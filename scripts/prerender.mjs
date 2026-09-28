import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { PUBLIC_ROUTES, SITE_ORIGIN, renderPage, routeHref } from "../dist-ssr/prerender.js";

/**
 * Description: Publishes React pages and crawl files into Vite's existing static output.
 * Inputs: The client build and SSR renderer must already exist; SITE_NOINDEX=1 makes a private preview build.
 * Output: One HTML file per public route, a true 404, robots.txt, sitemap.xml, and Cloudflare headers.
 * Examples: /water-heaters/gas-water-heaters/ is served from dist/water-heaters/gas-water-heaters/index.html.
 */
const output = "dist";
const template = await readFile(join(output, "index.html"), "utf8");
const indexable = process.env.SITE_NOINDEX !== "1";
if (!template.includes("<!--seo:start-->") || !template.includes('<div id="root"></div>')) {
  throw new Error("The Vite HTML template is missing its SEO or root marker.");
}

for (const route of [...PUBLIC_ROUTES, "not-found"]) {
  const { head, body } = renderPage(route, indexable);
  const html = template
    .replace('<html lang="en"', `<html lang="en" data-indexable="${indexable}"`)
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, () => head)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
  const file = route === "not-found" ? join(output, "404.html") : join(output, routeHref(route), "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

const locations = PUBLIC_ROUTES.map((route) => `  <url><loc>${SITE_ORIGIN}${routeHref(route)}</loc></url>`);
await writeFile(join(output, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locations.join("\n")}\n</urlset>\n`);
await writeFile(join(output, "robots.txt"), indexable
  ? `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`
  : "User-agent: *\nDisallow: /\n");

// Host-specific rules keep both the Pages alias and branch previews out of search.
await writeFile(join(output, "_headers"), `https://:project.pages.dev/*\n  X-Robots-Tag: noindex\n\nhttps://:version.:project.pages.dev/*\n  X-Robots-Tag: noindex\n`);

// These aliases work on this host. Redirecting mbphg.com itself still requires its owner's domain settings.
const oldPaths = [
  ["/about-us", "about"],
  ["/garbage-disposals", "plumbing/garbage-disposals"],
  ["/burst-pipe-repair", "plumbing/burst-pipe-repair"],
  ["/copy-of-water-filteration-1", "water-filtration"],
  ["/repiping", "plumbing/piping-and-repiping"],
  ["/copy-of-trenchless-sewer-line-2", "plumbing/trenchless-water-line-repair"],
  ["/showers-tubs", "plumbing/showers-and-tubs"],
  ["/toilet-repairs-installation", "plumbing/toilet-repair-and-installation"],
  ["/faucets-fixtures-sinks", "plumbing/faucets-fixtures-and-sinks"],
  ["/gas-line-repair-installation", "plumbing/gas-line-repair-and-installation"],
  ["/sump-pumps", "plumbing/sump-pumps"],
  ["/leak-detection", "plumbing/leak-detection"],
  ["/water-heater", "water-heaters"],
  ["/copy-of-standard-water-heaters", "water-heaters/electric-water-heaters"],
  ["/copy-of-leak-detection", "water-heaters/gas-water-heaters"],
  ["/copy-of-standard-water-heaters-1", "water-heaters/tankless-water-heaters"],
  ["/heat-pump-water-heater", "water-heaters/heat-pump-water-heaters"],
  ["/hydrojetting", "drain-sewer/hydrojetting"],
  ["/sewer-line-repair-replacement", "drain-sewer/sewer-line-repair-and-replacement"],
  ["/copy-of-trenchless-sewer-line", "drain-sewer/trenchless-sewer-repair"],
  ["/copy-of-trenchless-sewer-line-1", "drain-sewer/drain-cleaning"],
  ["/water-filteration", "water-filtration"],
  ["/copy-of-water-filteration", "heating-cooling"],
  ["/copy-2-of-water-filteration", "boilers"],
];
await writeFile(join(output, "_redirects"), oldPaths.map(([oldPath, route]) => `${oldPath} ${routeHref(route)} 301`).join("\n") + "\n");
console.log(`Prerendered ${PUBLIC_ROUTES.length} pages, 404.html, sitemap.xml, and robots.txt (${indexable ? "production indexable" : "preview noindex"}).`);
