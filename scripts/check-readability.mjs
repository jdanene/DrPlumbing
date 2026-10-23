/**
 * Description: Rejects unreadable static pages before Cloudflare receives them.
 * Inputs: dist contains prerendered HTML; JavaScript is never executed.
 * Output: Route-specific failures and a nonzero exit code, or a page count.
 * Examples: An unnamed button fails; a labelled input and explicitly decorative logo pass.
 */
import { readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { AGENT_READABLE_CITY_SLUGS, FULL_SERVICE_CITY_SLUGS, PAGE_DATES, PUBLIC_ROUTES, SERVICE_ANSWERS, fillCity, routeHref } from "../dist-ssr/prerender.js";

/**
 * Description: Reads an element's authored accessible name without decorative icon text.
 * Inputs: element is an element in the document being checked.
 * Output: A trimmed name, or an empty string when no authored name exists.
 * Examples: aria-label="Open menu" returns "Open menu"; an icon-only button returns "".
 */
function accessibleName(element) {
  const references = element.getAttribute("aria-labelledby")?.split(/\s+/).filter(Boolean);
  if (references?.length) return references.map((id) => element.ownerDocument.getElementById(id)?.textContent ?? "").join(" ").trim();
  if (element.getAttribute("aria-label")?.trim()) return element.getAttribute("aria-label").trim();
  const copy = element.cloneNode(true);
  copy.querySelectorAll('[aria-hidden="true"], [hidden]').forEach((child) => child.remove());
  return copy.textContent.trim();
}

const example = new JSDOM('<button aria-label="Open menu"></button><button><svg aria-hidden="true">icon</svg></button>');
assert.equal(accessibleName(example.window.document.querySelector("button")), "Open menu");
assert.equal(accessibleName(example.window.document.querySelectorAll("button")[1]), "");
example.window.close();

const failures = [];
const pageLinks = new Map();
let pages = 0;
let phrasePages = 0;
const cityPhrases = {
  "drain-sewer/hydrojetting": "Hydro jetting",
  "boilers/radiant-floor-heating": "Radiant floor heating repair",
  "water-filtration/water-softeners": "Water softener installation",
  "water-filtration/reverse-osmosis": "Reverse osmosis installation",
  "plumbing/trenchless-water-line-repair": "Trenchless water line replacement",
  "water-heater-replacement/tankless-water-heaters": "Tankless water heater installation",
  "plumbing/emergency-plumber": "Emergency plumber",
  "water-filtration": "Water filtration system installation",
  "water-heater-replacement/water-heater-repair": "Water heater repair",
};
for (const page of [...PUBLIC_ROUTES, "not-found"]) {
  const file = page === "not-found" ? join("dist", "404.html") : join("dist", routeHref(page), "index.html");
  const route = `/${relative("dist", file).replace(/index\.html$/, "")}`;
  const dom = new JSDOM(await readFile(file, "utf8"));
  const document = dom.window.document;
  pageLinks.set(page, new Set([...document.querySelectorAll("a[href]")].map((link) => link.getAttribute("href"))));
  const fail = (rule, element) => failures.push(`${route}: ${rule}${element ? ` (${element.outerHTML.slice(0, 180)})` : ""}`);
  pages += 1;
  const [, citySlug, ...serviceParts] = page.split("/");
  const phrase = page.startsWith("areas/") && FULL_SERVICE_CITY_SLUGS.includes(citySlug) ? cityPhrases[serviceParts.join("/")] : undefined;
  if (phrase) {
    phrasePages += 1;
    if (!document.querySelector("main h1")?.textContent.startsWith(`${phrase} in `)) fail(`H1 must name ${phrase}`);
    if (!document.title.startsWith(`${phrase} in `)) fail(`title must name ${phrase}`);
    const firstAnswer = document.querySelector(".service-repair-answer .lead, main .copy > p.lead, main h1 + p.lead")?.textContent.split(/[.!?]/)[0].toLowerCase();
    if (!firstAnswer?.includes(phrase.toLowerCase())) fail(`first answer sentence must name ${phrase}`);
    if (phrase === "Water heater repair" && !document.querySelector(".service-repair-answer h2")) fail("water heater repair requires its own question and answer");
  }
  if (page !== "not-found") {
    const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)["@graph"];
    const hours = graph.find((node) => node["@type"]?.includes("Plumber"))?.openingHoursSpecification;
    if (hours?.length !== 1 || new Set(hours[0].dayOfWeek).size !== 7 || hours[0].opens !== "08:00" || hours[0].closes !== "20:00") fail("business hours schema must cover all seven days, 08:00–20:00");
  }
  const inCohort = AGENT_READABLE_CITY_SLUGS.some((slug) => page === `areas/${slug}` || page.startsWith(`areas/${slug}/`));
  if (inCohort) {
    // The answer lives in the page's metadata, not its visible copy: Jidè, October 21.
    const description = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    const words = description.trim().split(/\s+/).length;
    if (!description || words > 100) fail(`target city description has ${words} words; require 1–100`);
    if (document.querySelector(".reading-answer, .reading-evidence, #service-comparison")) fail("visible comparison blocks were removed on October 21");
  }

  for (const button of document.querySelectorAll("button")) {
    if (!accessibleName(button)) fail("button has no accessible name", button);
  }
  for (const field of document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea')) {
    if (![...field.labels].some((label) => accessibleName(label))) fail("form field has no text label", field);
  }
  for (const image of document.querySelectorAll("img")) {
    if (!image.hasAttribute("alt")) fail("image has no alt attribute", image);
    else if (!image.getAttribute("alt").trim() && image.getAttribute("aria-hidden") !== "true" && image.getAttribute("role") !== "presentation") {
      fail("empty image alt requires explicit decorative intent", image);
    }
  }
  for (const element of document.querySelectorAll('div[role="button"], div[role="link"], div[role="navigation"], div[role="banner"], div[onclick]')) {
    fail("use a native button, link, nav or header", element);
  }
  document.querySelectorAll("script, style, template").forEach((element) => element.remove());
  const words = document.body.textContent.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  if (!file.endsWith("404.html") && words < 200) fail(`body contains ${words} words; minimum is 200`);
  dom.window.close();
}
for (const slug of AGENT_READABLE_CITY_SLUGS) {
  const hub = `areas/${slug}`;
  if (!pageLinks.get("areas").has(routeHref(hub))) failures.push(`/areas-we-serve/: missing city hub ${routeHref(hub)}`);
  for (const route of PUBLIC_ROUTES.filter((route) => route.startsWith(`${hub}/`))) {
    if (!pageLinks.get(hub).has(routeHref(route))) failures.push(`${routeHref(hub)}: missing service link ${routeHref(route)}`);
  }
}
assert.equal(Object.keys(PAGE_DATES).length, PUBLIC_ROUTES.length);
assert.equal(phrasePages, 72, "eight city journeys contain eight renamed topics and water heater repair");
assert.equal(Object.keys(SERVICE_ANSWERS).length, 44, "one answer record per city page type");
assert.equal(fillCity("Plumber in {city}", "Bellevue"), "Plumber in Bellevue");
assert.equal(fillCity("Call us", "Renton"), "Call us");
if (!pages) throw new Error("No rendered HTML in dist; run the prerender build first.");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else console.log(`Readability: ${pages} HTML pages pass names, labels, alt text, native semantics and body word count.`);
