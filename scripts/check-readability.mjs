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
import { AGENT_READABLE_CITY_SLUGS, FULL_SERVICE_CITY_SLUGS, PAGE_DATES, PUBLIC_ROUTES, SERVICE_ANSWERS, factMonth, fillCity, pageTier, rivalSiteFact, routeHref, scanSentence, scanServiceFor } from "../dist-ssr/prerender.js";

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
const contextSentences = new Set();
const tierCounts = { A: 0, B: 0 };
let pages = 0;
let phrasePages = 0;
const cityPhrases = {
  "drain-sewer/hydrojetting": "Hydro jetting",
  "boilers/radiant-floor-heating": "Radiant floor heating repair",
  "water-filtration/water-softeners": "Water softener installation",
  "water-filtration/reverse-osmosis": "Reverse osmosis installation",
  "plumbing/trenchless-water-line-repair": "Trenchless water line replacement",
  "water-heater-replacement/tankless-water-heaters": "Tankless water heater installation",
  "heating-cooling/emergency-service": "Emergency plumber",
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
    const firstAnswer = document.querySelector(".reading-short-answer, .service-repair-answer .lead, main .copy > p.lead")?.textContent.split(/[.!?]/)[0].toLowerCase();
    if (!firstAnswer?.includes(phrase.toLowerCase())) fail(`first answer sentence must name ${phrase}`);
    if (phrase === "Water heater repair" && !document.querySelector(".reading-answer h2, .service-repair-answer h2")) fail("water heater repair requires its own question and answer");
  }
  if (page !== "not-found") {
    const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)["@graph"];
    const hours = graph.find((node) => node["@type"]?.includes("Plumber"))?.openingHoursSpecification;
    if (hours?.length !== 1 || new Set(hours[0].dayOfWeek).size !== 7 || hours[0].opens !== "08:00" || hours[0].closes !== "20:00") fail("business hours schema must cover all seven days, 08:00–20:00");
  }
  const inCohort = AGENT_READABLE_CITY_SLUGS.some((slug) => page === `areas/${slug}` || page.startsWith(`areas/${slug}/`));
  const answer = document.querySelector(".reading-answer");
  if (inCohort) {
    if (!answer) fail("target city page is missing its question and answer");
    else {
      const key = answer.getAttribute("data-answer-key");
      const record = SERVICE_ANSWERS[key];
      const tier = answer.getAttribute("data-reading-tier");
      if (tier !== "A" && tier !== "B") fail("missing comparison tier");
      else tierCounts[tier] += 1;
      if (!record || record.status !== "final") fail("answer record is missing or not final");
      if (document.querySelector("main h2") !== answer.querySelector("h2")) fail("first main H2 must be the reader question");
      const answerWords = answer.querySelector(".reading-short-answer")?.textContent.trim().split(/\s+/).length ?? 0;
      if (!answerWords || answerWords > 100) fail(`short answer has ${answerWords} words; require 1–100`);
      const sentence = answer.querySelector(".reading-scan-sentence")?.textContent;
      if (!sentence || contextSentences.has(sentence)) fail("missing or repeated city-service scan sentence");
      contextSentences.add(sentence);
      if (answer.querySelectorAll("time[datetime]").length !== (PAGE_DATES[page].published ? 2 : 1)) fail("known publication and update dates are required");
      if (!answer.querySelector(".business-definition")) fail("missing business definition");
      if (!document.querySelector(".reading-business-facts")?.textContent.includes("Hours: 8 AM to 8 PM daily, Pacific time; emergency service 8 PM to 8 AM daily. As of October 2026.")) fail("missing dated regular and emergency hours");
      if (tier === "A" && !document.querySelector("#service-comparison table")) fail("Tier A requires its own named comparison");
      if (tier === "B" && document.querySelector("#service-comparison table")) fail("Tier B must link its hub, not name rivals");
      if (page.split("/").length === 2 && document.querySelectorAll(".reading-reviews figure").length !== 6) fail("city hub requires all six Google review records");
    }
  } else if (answer) fail("reading changes escaped the seven-city cohort");

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
assert.equal(tierCounts.A, 105, "Tier A route count");
assert.equal(tierCounts.B, 203, "Tier B route count");
assert.equal(phrasePages, 72, "eight city journeys contain eight renamed topics and water heater repair");
assert.equal(Object.keys(SERVICE_ANSWERS).length, 44, "one answer record per city page type");
assert.equal(fillCity("Plumber in {city}", "Bellevue"), "Plumber in Bellevue");
assert.equal(fillCity("Call us", "Renton"), "Call us");
assert.equal(scanServiceFor("plumbing", "Trenchless water line repair"), "trenchless");
assert.equal(scanServiceFor("boilers"), "boilers-and-radiant");
assert.equal(scanServiceFor("heating-cooling", "Emergency service"), "plumber");
assert.equal(pageTier(), "A");
assert.equal(pageTier("water-filtration"), "B");
assert.equal(pageTier("plumbing", "Trenchless water line repair"), "A");
assert.equal(factMonth("2026-10-19"), "October 2026");
assert.equal(rivalSiteFact("https://www.rotorooter.com/").host, "rotorooter.com");
assert.equal(rivalSiteFact(null), undefined);
const boilerExample = {
  serviceId: "boilers-and-radiant", scannedAt: "2026-10-19", top: 4,
  rivals: [{ categories: ["Plumber"] }, { categories: ["HVAC contractor"] }, { categories: ["Heating contractor"] }],
  own: { categories: ["Boiler supplier"] },
};
const boilerSentence = scanSentence("Boilers", "Newcastle", boilerExample, "A");
assert.match(boilerSentence, /0 of the 3 other leading Google listings/);
assert.match(boilerSentence, /Dr Plumbing & Heating repairs and replaces boilers and radiant heat systems/);
assert.match(boilerSentence, /absence does not establish which work another company accepts/);
assert.match(scanSentence("Boilers", "Newcastle", { ...boilerExample, top: 3, rivals: [{ categories: ["Boiler supplier"] }, ...boilerExample.rivals.slice(1)] }, "A"), /1 of the 3 other leading Google listings/);
assert.match(scanSentence("Trenchless water line repair", "Newcastle", { ...boilerExample, serviceId: "trenchless" }, "A"), /Dr Plumbing & Heating provides trenchless water and sewer line repair/);
if (!pages) throw new Error("No rendered HTML in dist; run the prerender build first.");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else console.log(`Readability: ${pages} HTML pages pass names, labels, alt text, native semantics and body word count.`);
