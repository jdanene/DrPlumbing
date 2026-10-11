import { BUSINESS, confirmed, confirmedFact, displayText, pendingFact, type Fact } from "./businessFacts";
import { SERVICES, type Service } from "./content";
import { pathSlug } from "./sitePaths";

/**
 * Description: The served cities as pages: which city pages exist, which city-and-service pages
 * exist, how a path resolves to one, and the sentences every city page says about the firm. The
 * module reads the business record and the service catalog; it holds no React and no schema.org
 * shaping (seo.ts), and it never invents a fact about a city.
 * Inputs: None. Cities come from BUSINESS.serviceCities; landmarks come from the owner.
 * Output: CITY_PAGES, CITY_SERVICE_PAGES, cityPageAt(), cityHeading() and cityAnswer().
 * Examples: CityPages.test.tsx runs every example in the headers below.
 */

/** One served city: its name, its path segment, and two landmarks the owner has named. */
export interface CityPage {
  name: string;
  slug: string;
  landmarks: Fact<readonly [string, string]>;
}

/** A resolved city page, with the service when the path named a listed city-and-service page. */
export interface CityPageMatch {
  route: string;
  city: CityPage;
  service?: Service;
}

/**
 * Two landmarks per city, keyed by city slug, as the owner supplies them. Empty until then, so every
 * city's landmarks are pending. Fill the pairs and the source line below together in one reviewed change.
 */
export const CITY_LANDMARKS: Record<string, [string, string]> = {};
const LANDMARKS_SOURCE = "Owner";
const LANDMARKS_CONFIRMED_ON = "";

/** One page per served city, in the record's order. */
export const CITY_PAGES: readonly CityPage[] = confirmed(BUSINESS.serviceCities).map((name) => {
  const slug = pathSlug(name);
  const pair = CITY_LANDMARKS[slug];
  return {
    name,
    slug,
    landmarks: pair
      ? confirmedFact<readonly [string, string]>(pair, LANDMARKS_SOURCE, LANDMARKS_CONFIRMED_ON)
      : pendingFact(`[${name.toUpperCase().replace(/[^A-Z]+/g, " ")} LANDMARKS]`),
  };
});

/** The city-and-service pages that exist. An allowlist, never a cross product of cities and services. */
export const CITY_SERVICE_PAGES: readonly { citySlug: string; serviceId: string }[] = [
  { citySlug: "bellevue", serviceId: "water-heaters" },
];

/**
 * Description: Resolves the path segments after "areas" to a city page, so routing, metadata and the
 * static build agree on which city addresses exist.
 * Inputs: segments are the path parts after the areas page: a city name or slug, then optionally a
 * service id. Segments past the second are ignored.
 * Output: The page's route, city and listed service. An unlisted service yields the city page; an
 * unknown city yields undefined.
 * Examples: ["Bellevue"] and ["bellevue"] both give route "areas/bellevue" with no service;
 * ["bellevue", "water-heaters"] gives "areas/bellevue/water-heaters" with the water-heaters service;
 * ["bellevue", "boilers"] gives the Bellevue city page; ["nowhere"] gives undefined.
 */
export function cityPageAt(segments: readonly string[]): CityPageMatch | undefined {
  const [citySegment = "", serviceSegment = ""] = segments;
  const city = CITY_PAGES.find((page) => page.slug === pathSlug(citySegment));
  if (!city) return undefined;
  const serviceId = pathSlug(serviceSegment);
  const listed = CITY_SERVICE_PAGES.some((entry) => entry.citySlug === city.slug && entry.serviceId === serviceId);
  const service = listed ? SERVICES.find((item) => item.id === serviceId) : undefined;
  return service
    ? { route: `areas/${city.slug}/${service.id}`, city, service }
    : { route: `areas/${city.slug}`, city };
}

/**
 * Description: Names what a city page is about, for its heading and its Service schema.
 * Inputs: page is a resolved city page.
 * Output: The city page names every trade; the city-and-service page names the service.
 * Examples: The Bellevue page is "Plumbing, heating and cooling in Bellevue, WA"; the Bellevue
 * water-heaters page is "Water heaters in Bellevue, WA".
 */
export function cityHeading(page: CityPageMatch) {
  return `${page.service?.title ?? "Plumbing, heating and cooling"} in ${page.city.name}, WA`;
}

/**
 * Description: Answers "what does this firm do here?" in two or three sentences built from confirmed
 * facts, so the page and its meta description say the same thing and neither can guess.
 * Inputs: page is a resolved city page.
 * Output: What the firm does in the city (the service's own lead on a city-and-service page), the
 * price basis, and the response time only when the owner has confirmed one.
 * Examples: The Bellevue page reads "Dr Plumbing & Heating repairs and installs plumbing, water
 * heaters, drains and heating for homes in Bellevue, WA. You approve a flat-rate price before work
 * starts." The Bellevue water-heaters page starts "Dr Plumbing & Heating serves homes in Bellevue,
 * WA." and continues with the service's lead. No page mentions a response time today.
 */
export function cityAnswer(page: CityPageMatch) {
  const name = confirmed(BUSINESS.publicName);
  const where = `homes in ${page.city.name}, WA`;
  const sentences = page.service
    ? [`${name} serves ${where}.`, page.service.lead]
    : [`${name} repairs and installs plumbing, water heaters, drains and heating for ${where}.`];
  sentences.push(confirmed(BUSINESS.priceBasis));
  const responseTime = confirmed(BUSINESS.responseTime);
  if (responseTime) sentences.push(`Typical response time: ${responseTime}.`);
  return sentences.join(" ");
}

/**
 * Description: The sentence that places the firm's work in the city, from the owner's two landmarks.
 * Inputs: page is a resolved city page.
 * Output: "We work in homes from A to B." when confirmed; the bracketed placeholder outside
 * production; undefined in production while the landmarks are pending.
 * Examples: Bellevue reads "[BELLEVUE LANDMARKS]" under vitest and undefined with PROD stubbed true.
 */
export function cityLandmarksText(page: CityPageMatch) {
  return displayText(page.city.landmarks, ([from, to]) => `We work in homes from ${from} to ${to}.`);
}
