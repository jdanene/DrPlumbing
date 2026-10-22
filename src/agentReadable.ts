import { AGENT_READABLE_CITY_SLUGS, type CityPageMatch } from "./cities";
import { pathSlug } from "./sitePaths";
import { RIVAL_SITE_FACTS } from "./content/rivalFacts";
import { BUSINESS, confirmed } from "./businessFacts";

export interface Rival {
  name: string;
  share: number | null;
  firstPlaceCount: number | null;
  reviews: number | null;
  rating: number | null;
  categories: string[];
  website: string | null;
}

export interface RivalScan {
  citySlug: string;
  serviceId: string;
  scannedAt: string;
  top: number;
  searches: number;
  own: Rival & { seen: number; inTop: number; medianPosition: number | null };
  rivals: Rival[];
}

/**
 * Description: Limits the new reading structure to the seven measured cities.
 * Inputs: A resolved city page, or undefined for a general page.
 * Output: True only for JDA-408's cohort; Kirkland and other city pages remain unchanged.
 * Examples: undefined returns false; a page with city.slug=kirkland returns false.
 */
export function isAgentReadable(page?: CityPageMatch) {
  return Boolean(page && AGENT_READABLE_CITY_SLUGS.includes(page.city.slug));
}

/**
 * Description: Identifies the one shared answer for a category, option or city hub.
 * Inputs: A resolved page from cities.ts, not a public URL alias.
 * Output: The answer-record key; category aliases do not create duplicate answers.
 * Examples: A hub returns hub; water-heaters with Gas water heaters returns water-heaters/gas-water-heaters.
 */
export function answerKey(page: CityPageMatch) {
  return page.service ? `${page.service.id}${page.detail ? `/${pathSlug(page.detail.item)}` : ""}` : "hub";
}

/**
 * Description: Inserts the served city without changing the approved service guidance.
 * Inputs: Authored text contains zero or more {city} tokens; city is a public city name.
 * Output: The filled text, unchanged when the token is absent.
 * Examples: fillCity("Plumber in {city}", "Bellevue") returns "Plumber in Bellevue"; fillCity("Call us", "Renton") returns "Call us".
 */
export function fillCity(text: string, city: string) {
  return text.replaceAll("{city}", city);
}

/**
 * Description: Chooses the existing MapPack scan that supplies this service's evidence.
 * Inputs: service is the website category ID; item is an option label when present.
 * Output: One of the seven MapPack service slugs. Both trenchless options share the trenchless scan.
 * Examples: scanServiceFor("plumbing", "Trenchless water line repair") returns "trenchless"; scanServiceFor("boilers") returns "boilers-and-radiant".
 */
export function scanServiceFor(service?: string, item?: string) {
  if (item === "Emergency service") return "plumber";
  if (item?.startsWith("Trenchless")) return "trenchless";
  return ({ boilers: "boilers-and-radiant", "heating-cooling": "heating-and-cooling", "drain-sewer": "drain-and-sewer" } as Record<string, string>)[service ?? ""] ?? (service === "plumbing" || !service ? "plumber" : service);
}

/**
 * Description: Names the pages that receive their own named comparison.
 * Inputs: A website category ID and optional existing service option label.
 * Output: Tier A for hubs, heaters, boilers and trenchless; Tier B for other service pages.
 * Examples: pageTier() returns A; pageTier("water-filtration") returns B; pageTier("plumbing", "Trenchless water line repair") returns A.
 */
export function pageTier(service?: string, item?: string): "A" | "B" {
  return !service || service === "water-heaters" || service === "boilers" || item?.startsWith("Trenchless") ? "A" : "B";
}

/**
 * Description: Dates a recorded fact in the customer's language without a timezone shift.
 * Inputs: An ISO date or timestamp beginning with a valid YYYY-MM-DD date.
 * Output: Its month and year; invalid saved dates throw rather than publish fake freshness.
 * Examples: factMonth("2026-10-19") returns "October 2026".
 */
export function factMonth(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date.slice(0, 10)}T00:00:00Z`));
}

/**
 * Description: Uses a checked rival statement only when its saved website matches the verified host.
 * Inputs: A saved HTTP(S) website, or null when Google supplied none.
 * Output: The matching source record; unknown or invalid websites get no service or hours claim.
 * Examples: rivalSiteFact("https://www.rotorooter.com/") finds rotorooter.com; rivalSiteFact(null) returns undefined.
 */
export function rivalSiteFact(website: string | null) {
  if (!website) return undefined;
  try {
    const host = new URL(website).hostname.replace(/^www\./, "");
    return RIVAL_SITE_FACTS.find((fact) => host === fact.host || host.endsWith(`.${fact.host}`));
  } catch { return undefined; }
}

/**
 * Description: Gives each page one service-and-city-specific sentence from its own saved scan.
 * Inputs: subject identifies the page; scan contains measured Google observations, not promises of service.
 * Output: Unique page context. Category counts exclude our listing and never prove a rival lacks a service.
 * Examples: Newcastle boilers reports zero of three other leaders, then our verified boiler scope;
 * a scan without our listing counts every rival; Tier B reports its measured leading-listing count.
 */
export function scanSentence(subject: string, city: string, scan: RivalScan, tier: "A" | "B") {
  const introduction = `For ${subject.toLowerCase()} in ${city}`;
  if (scan.serviceId === "boilers-and-radiant" || scan.serviceId === "trenchless") {
    const term = scan.serviceId === "trenchless" ? "trenchless" : "boiler";
    const count = scan.rivals.filter((rival) => rival.categories.some((category) => category.toLowerCase().includes(term))).length;
    const scope = confirmed(BUSINESS.serviceScope);
    const ourService = scan.serviceId === "trenchless" ? scope.trenchless : scope.boilersAndRadiant;
    return `${introduction}, ${count} of the ${scan.rivals.length} other leading Google listings included “${term}” in their categories in ${factMonth(scan.scannedAt)}. ${ourService} A Google category's absence does not establish which work another company accepts.`;
  }
  if (tier === "B") return `${introduction}, the ${factMonth(scan.scannedAt)} scan identified ${scan.top} leading businesses across ${scan.searches} usable searches; the city hub comparison explains the wider plumbing choices.`;
  const leaders = scan.rivals.slice(0, 2).map((rival) => `${rival.name}${rival.share === null ? "" : ` (${Math.round(rival.share)}% of searches in positions 1–3)`}`).join(" and ");
  return `${introduction}, ${leaders} led the saved ${factMonth(scan.scannedAt)} Google results across ${scan.searches} usable searches.`;
}
