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
export const CITY_SERVICE_PAGES: readonly { citySlug: string; serviceId: string; slug?: string; label?: string }[] = [
  { citySlug: "bellevue", serviceId: "water-heaters" },
  { citySlug: "mercer-island", serviceId: "water-heaters", slug: "water-heater-replacement", label: "Water heater replacement" },
];

/** Owner-requested search topics share one route record for visible copy and metadata. */
export const CITY_PAGE_COPY: Record<string, {
  heading: string;
  lead: string;
  sections: readonly { heading: string; text: string }[];
}> = {
  "areas/bellevue": {
    heading: "Plumber in Bellevue, WA",
    lead: "Dr Plumbing & Heating repairs and installs plumbing for homes in Bellevue, WA. Tell us whether you need help with a leak, a blocked drain, a fixture or a larger plumbing project.",
    sections: [
      { heading: "From a fixture repair to a whole-house project", text: "A dripping faucet, a running toilet and a leak behind a wall need different approaches. We offer fixture repairs, leak detection, piping and repiping, drain and sewer work, and water-heater installation and replacement." },
      { heading: "Tell us what changed", text: "Let us know when the problem started, which fixtures it affects and whether you can see leaking water. Photos and details of previous repairs help us understand the job before a visit." },
      { heading: "Planning a bathroom or plumbing upgrade?", text: "Share the fixtures you want to change and whether the layout is moving. We can discuss the plumbing work, access and installation options before you approve the scope and price." },
    ],
  },
  "areas/mercer-island": {
    heading: "Plumber in Mercer Island, WA",
    lead: "Dr Plumbing & Heating serves homes in Mercer Island, WA, with plumbing repairs, fixture installation, drain and sewer work, repiping and water-heater services.",
    sections: [
      { heading: "Help with the plumbing you use every day", text: "Choose a service below for leaking pipes, toilets, faucets, showers and tubs. If you are unsure what is wrong, describe what you can see or hear and which parts of the home are affected." },
      { heading: "Hot-water problems or a planned replacement", text: "Tell us whether the water is cold, runs out sooner than expected or leaks around the heater. For replacement planning, share the existing unit's label and a photo of the installation space so we can discuss suitable options." },
      { heading: "Prepare for the visit", text: "Share your Mercer Island address, access details and preferred timing when you contact us. We will confirm the next step and discuss the work before it begins." },
    ],
  },
  "areas/mercer-island/water-heater-replacement": {
    heading: "Water heater replacement in Mercer Island, WA",
    lead: "Dr Plumbing & Heating replaces water heaters in Mercer Island homes. We help you compare tank, tankless and heat-pump options with the home's hot-water demand, existing fuel supply and installation space in mind.",
    sections: [
      { heading: "Repair or replace? Start with the condition of the heater", text: "Loss of hot water does not always mean you need a new unit. Tell us the heater's age if known, the symptoms and whether there is a visible leak. An assessment helps establish whether a repair or replacement makes sense." },
      { heading: "Choose a replacement that fits the home", text: "Capacity, gas or electrical supply, ventilation and available space affect the choice. We discuss these requirements before recommending a storage tank, tankless unit or heat-pump water heater. Changing systems can involve more work than replacing a similar unit." },
      { heading: "Send the model label and installation photos", text: "A clear picture of the label, pipe connections and surrounding space helps us understand the current setup. Tell us how many people use hot water and whether you regularly run out." },
      { heading: "Agree on the work before installation", text: "We explain the proposed replacement and installation scope so you can approve the price before work starts. Contact us to discuss your existing heater and arrange the next step." },
    ],
  },
};

/**
 * Description: Resolves the path segments after "areas" to a city page, so routing, metadata and the
 * static build agree on which city addresses exist.
 * Inputs: segments are the path parts after the areas page: a city name or slug, then optionally a
 * listed service-page slug (the service ID when no custom slug is supplied). Later segments are ignored.
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
  const listed = CITY_SERVICE_PAGES.find((entry) => entry.citySlug === city.slug && (entry.slug ?? entry.serviceId) === serviceId);
  const service = listed ? SERVICES.find((item) => item.id === listed.serviceId) : undefined;
  return service
    ? { route: `areas/${city.slug}/${listed!.slug ?? service.id}`, city, service }
    : { route: `areas/${city.slug}`, city };
}

/**
 * Description: Names what a city page is about, for its heading and its Service schema.
 * Inputs: page is a resolved city page.
 * Output: An explicit search-topic heading when supplied, otherwise the city and service heading.
 * Examples: The Bellevue page is "Plumber in Bellevue, WA"; the Bellevue
 * water-heaters page is "Water heaters in Bellevue, WA".
 */
export function cityHeading(page: CityPageMatch) {
  return CITY_PAGE_COPY[page.route]?.heading ?? `${page.service?.title ?? "Plumbing, heating and cooling"} in ${page.city.name}, WA`;
}

/**
 * Description: Answers "what does this firm do here?" in two or three sentences built from confirmed
 * facts, so the page and its meta description say the same thing and neither can guess.
 * Inputs: page is a resolved city page.
 * Output: What the firm does in the city (the service's own lead on a city-and-service page), the
 * price basis, and the response time only when the owner has confirmed one.
 * Examples: Bellevue's introduction names plumbing repair and installation and ends with the
 * approved flat-rate price statement. The Bellevue water-heaters page starts "Dr Plumbing & Heating serves homes in Bellevue,
 * WA." and continues with the service's lead. No page mentions a response time today.
 */
export function cityAnswer(page: CityPageMatch) {
  const name = confirmed(BUSINESS.publicName);
  const where = `homes in ${page.city.name}, WA`;
  const copy = CITY_PAGE_COPY[page.route];
  const sentences = copy ? [copy.lead] : page.service
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
