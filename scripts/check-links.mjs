import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

/**
 * Description: Audits emitted pages before deployment. Internal failures block the
 * build; third-party availability produces warnings, never a failed build.
 * Inputs: Prerendered dist, or an optional output-directory argument. Requires Node 24.
 * Output: Route, reference and rule for each failure; exit 1 for broken internal links.
 * Examples: node scripts/check-links.mjs checks the existing production build.
 */
const output = resolve(process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), "../dist"));
const externalConcurrency = 4;
const externalTimeoutMs = 5_000;

/**
 * Description: Maps browser paths to static-host file candidates without escaping dist.
 * Inputs: An encoded URL pathname; query strings and fragments are already removed.
 * Output: Relative file candidates, or an empty array for malformed/escaping paths.
 * Examples: /a%20b/ -> [a b/index.html]; / -> [index.html]; /x -> [x, x/index.html, x.html].
 */
function fileCandidates(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return [];
  }
  if (decoded.includes("\0") || decoded.includes("\\") || decoded.split("/").includes("..")) return [];
  const path = decoded.replace(/^\/+/, "");
  if (!path || path.endsWith("/")) return [`${path}index.html`];
  return [path, `${path}/index.html`, `${path}.html`];
}

assert.deepEqual(fileCandidates("/a%20b/"), ["a b/index.html"]);
assert.deepEqual(fileCandidates("/"), ["index.html"]);
assert.deepEqual(fileCandidates("/x"), ["x", "x/index.html", "x.html"]);

/**
 * Description: Converts a built HTML filename into its browser route.
 * Inputs: A dist-relative HTML filename using the current platform's separator.
 * Output: A leading-slash route; index pages end in a slash.
 * Examples: index.html -> /; services/index.html -> /services/; 404.html -> /404.html.
 */
function pageRoute(filename) {
  return `/${filename.split(sep).join("/")}`.replace(/\/index\.html$/, "/");
}

assert.equal(pageRoute("index.html"), "/");
assert.equal(pageRoute(join("services", "index.html")), "/services/");
assert.equal(pageRoute("404.html"), "/404.html");

/**
 * Description: Probes one third-party URL without letting an outage block deployment.
 * Inputs: An absolute HTTP(S) URL. Each of two attempts has a five-second deadline.
 * Output: Null on HTTP success, otherwise a final warning reason. Response bodies are discarded.
 * Examples: HTTP 200 -> null; HTTP 404 twice -> HTTP 404; timeout twice -> timeout warning.
 */
async function externalWarning(url) {
  let warning;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(externalTimeoutMs),
        redirect: "follow",
        headers: { "User-Agent": "DrPlumbing-LinkCheck/1.0" },
      });
      await response.body?.cancel();
      if (response.ok) return null;
      warning = `HTTP ${response.status}`;
    } catch (error) {
      warning = `${error.name}: ${error.message}`;
    }
  }
  return warning;
}

/**
 * Description: Checks built references locally, then probes each distinct external URL once.
 * Inputs: The existing output directory, containing index.html with a canonical URL.
 * Output: A summary and actionable errors; missing output or internal references set exit 1.
 * Examples: Missing /contact/ reports internal-file with its source route; a third-party 503 warns.
 */
async function checkLinks() {
  const entries = await readdir(output, { recursive: true, withFileTypes: true });
  const files = new Set(entries.filter((entry) => entry.isFile()).map((entry) => relative(output, join(entry.parentPath, entry.name))));
  const htmlFiles = [...files].filter((file) => file.endsWith(".html")).sort();
  const homepage = new JSDOM(await readFile(join(output, "index.html"), "utf8"));
  const canonical = homepage.window.document.querySelector('link[rel="canonical"]')?.getAttribute("href");
  homepage.window.close();
  if (!canonical) throw new Error("dist/index.html needs an absolute canonical URL to identify internal links.");
  const site = new URL(canonical);
  const internalHosts = new Set([site.hostname, site.hostname.startsWith("www.") ? site.hostname.slice(4) : `www.${site.hostname}`]);
  const pages = new Map();
  const references = [];
  const failures = new Set();
  const external = new Map();

  for (const file of htmlFiles) {
    const route = pageRoute(file);
    const dom = new JSDOM(await readFile(join(output, file), "utf8"), { url: new URL(route, site).href });
    const document = dom.window.document;
    pages.set(file, new Set([...document.querySelectorAll("[id], a[name]")].flatMap((element) => [element.id, element.getAttribute("name")]).filter(Boolean)));
    for (const element of document.querySelectorAll("[href], [src]")) {
      for (const attribute of ["href", "src"]) {
        const value = element.getAttribute(attribute);
        if (value === null) continue;
        references.push({ route, attribute, value, base: document.baseURI });
      }
    }
    dom.window.close();
  }

  for (const { route, attribute, value, base } of references) {
    const context = `${route} ${attribute}=${JSON.stringify(value)}`;
    let url;
    try {
      url = new URL(value, base);
    } catch {
      failures.add(`[url] ${context}: malformed URL`);
      continue;
    }
    if (!["http:", "https:"].includes(url.protocol)) continue;
    if (!internalHosts.has(url.hostname)) {
      url.hash = "";
      if (!external.has(url.href)) external.set(url.href, context);
      continue;
    }
    const file = fileCandidates(url.pathname).find((candidate) => files.has(candidate));
    if (!file) {
      failures.add(`[internal-file] ${context}: ${url.pathname} has no built file`);
      continue;
    }
    // PDF and SVG fragments are not HTML anchors. Text fragments work without an ID.
    if (!url.hash || !pages.has(file)) continue;
    let fragment;
    try {
      fragment = decodeURIComponent(url.hash.slice(1).split(":~:")[0]);
    } catch {
      failures.add(`[internal-anchor] ${context}: malformed fragment encoding`);
      continue;
    }
    if (fragment && !pages.get(file).has(fragment)) failures.add(`[internal-anchor] ${context}: ${url.pathname} has no #${fragment}`);
  }

  for (const failure of failures) console.error(`ERROR ${failure}`);
  const queue = [...external.entries()];
  let externalWarnings = 0;
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(externalConcurrency, queue.length) }, async () => {
    while (cursor < queue.length) {
      const [url, context] = queue[cursor++];
      const warning = await externalWarning(url);
      if (warning) {
        externalWarnings += 1;
        console.warn(`WARN [external] ${context}: ${url} (${warning}, after 2 attempts)`);
      }
    }
  }));
  console.log(`Link check: ${htmlFiles.length} pages, ${references.length} references, ${external.size} external URLs; ${failures.size} internal errors, ${externalWarnings} external warnings.`);
  if (failures.size) process.exitCode = 1;
}

try {
  await checkLinks();
} catch (error) {
  console.error(`ERROR [build-output] ${error.message}. Run npm run build first.`);
  process.exitCode = 1;
}
