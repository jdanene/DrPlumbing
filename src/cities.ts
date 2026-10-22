import { BUSINESS, confirmed, confirmedFact, pendingFact, type ConfirmedFact, type Fact } from "./businessFacts";
import { SERVICES, serviceMenu, type Service } from "./content";
import { serviceDetailFor, serviceNavigationMenu, serviceOptionHref, type ServiceDetail } from "./serviceDetails";
import { FULL_SERVICE_CITY_SLUGS, pathSlug, routeHref } from "./sitePaths";

/**
 * Description: The served cities as pages: which city pages exist, which city-and-service pages
 * exist, how a path resolves to one, and the sentences every city page says about the firm. The
 * module reads the business record and the service catalog; it holds no React and no schema.org
 * shaping (seo.ts), and it never invents a fact about a city.
 * Inputs: None. Cities come from BUSINESS.serviceCities; approved landmarks cite official city records.
 * Output: CITY_PAGES, CITY_SERVICE_PAGES, cityPageAt(), cityHeading() and cityAnswer().
 * Examples: CityPages.test.tsx runs every example in the headers below.
 */

/** One served city: its name, its path segment, and its verified local landmarks. */
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
  detail?: ServiceDetail;
}

/** JDA-408's measured cohort; Kirkland and the remaining cities keep their existing pages. */
export const AGENT_READABLE_CITY_SLUGS = ["bellevue", "newcastle", "renton", "redmond", "issaquah", "federal-way", "mercer-island"];

/** Display phrases change independently of published option labels and slugs. */
const CITY_OPTION_LABELS: Record<string, string> = {
  "drain-sewer/hydrojetting": "Hydro jetting",
  "boilers/radiant-floor-heating": "Radiant floor heating repair",
  "water-filtration/water-softeners": "Water softener installation",
  "water-filtration/reverse-osmosis": "Reverse osmosis installation",
  "plumbing/trenchless-water-line-repair": "Trenchless water line replacement",
  "water-heaters/tankless-water-heaters": "Tankless water heater installation",
  "heating-cooling/emergency-service": "Emergency plumber",
};

/**
 * Description: Names a city option without changing its established route identity.
 * Inputs: serviceId is a catalog ID; label is the original option label or slug.
 * Output: The approved city phrase, or the original label for unchanged options.
 * Examples: boilers + Radiant floor heating returns Radiant floor heating repair;
 * water-heaters + Gas water heaters stays Gas water heaters.
 */
export function cityOptionLabel(serviceId: string, label: string) {
  return CITY_OPTION_LABELS[`${serviceId}/${pathSlug(label)}`] ?? label;
}

const CITY_EXTRA_DETAILS: Record<string, ServiceDetail[]> = {
  "water-heaters": [{
    item: "Water heater repair", cta: "water heater repair", photo: "Water heater repair",
    summary: "No hot water, a puddle under the tank, or a shower that runs hot and cold? We find the cause, tell you what the fix costs, and tell you straight if the heater is worth fixing.",
    sections: [
      { heading: "What usually goes wrong", paras: ["No hot water on an electric heater is most often a dead heating element or thermostat. On a gas heater it is usually the pilot, the igniter or the gas valve. Water that is too hot or never hot enough points to the thermostat. A drip from the relief valve or a fitting is a part we can change. Water coming from the tank itself means the tank is done."] },
      { heading: "Fix it or replace it", paras: ["We repair a sound heater with one failed part. We tell you to replace it when the tank leaks, when it is past ten or twelve years and failing again, or when the repair would cost close to half of a new heater. Either way, you approve a flat-rate price before we start."] },
      { heading: "Before we come", paras: ["Text us a photo of the label on the heater, and of the leak or the error code if there is one. If water is pooling near the heater's wiring or an outlet, keep away from it and switch off the breaker if you can reach it safely. If you smell gas, leave the house and call the gas company or 911 from outside."] },
    ],
  }],
};

/**
 * Description: Adds requested city-only options to the existing service menu.
 * Inputs: service is a catalog category; page supplies city context when present.
 * Output: Original option labels for link lookup; only full city journeys gain water heater repair.
 * Examples: A Bellevue heater menu includes Water heater repair; a general heater menu does not.
 */
export function cityServiceMenu(service: Service, page?: CityPageMatch) {
  const extra = page && FULL_SERVICE_CITY_SLUGS.includes(page.city.slug) ? CITY_EXTRA_DETAILS[service.id] ?? [] : [];
  return [...extra.map((detail) => detail.item), ...serviceNavigationMenu(service)];
}

/** Owner-approved landmark references, verified against each city's parks directory. */
export const CITY_LANDMARKS: Record<string, ConfirmedFact<readonly [string, string]>> = {
  bellevue: confirmedFact(
    ["Downtown Park", "Kelsey Creek Park"],
    "https://bellevuewa.gov/sites/default/files/media/pdf_document/2023/Park-Site-Information.pdf",
    "2026-10-18",
  ),
  renton: confirmedFact(
    ["Gene Coulon Memorial Beach Park", "Liberty Park"],
    "https://www.rentonwa.gov/Government/Departments-and-Offices/Parks-and-Recreation/Parks-and-Trails",
    "2026-10-18",
  ),
  kirkland: confirmedFact(
    ["Marina Park", "Juanita Bay Park"],
    "https://www.kirklandwa.gov/Government/Departments/Parks-and-Community-Services/Find-a-Park/Juanita-Bay-Park",
    "2026-10-18",
  ),
  redmond: confirmedFact(
    ["Marymoor Park", "Idylwood Beach Park"],
    "https://www.redmond.gov/Facilities/Facility/Details/Marymoor-Park-40; https://www.redmond.gov/1555/Parks",
    "2026-10-18",
  ),
  issaquah: confirmedFact(
    ["Confluence Park", "Tibbetts Valley Park"],
    "https://www.issaquahwa.gov/DocumentCenter/View/10623/Issaquah-Parks-System-Plan-Adopted-Nov-2024",
    "2026-10-18",
  ),
  newcastle: confirmedFact(
    ["Lake Boren Park", "May Creek Park"],
    "https://newcastlewa.gov/parks_and_trails/parks-trails/city-parks/",
    "2026-10-17",
  ),
  "federal-way": confirmedFact(
    ["Celebration Park", "Steel Lake Park"],
    "https://www.federalwaywa.gov/page/our-parks",
    "2026-10-17",
  ),
  "mercer-island": confirmedFact(
    ["Luther Burbank Park", "Pioneer Park"],
    "https://www.mercerisland.gov/parksrec/page/parks-facilities",
    "2026-10-17",
  ),
};

/** One page per served city, in the record's order. */
export const CITY_PAGES: readonly CityPage[] = confirmed(BUSINESS.serviceCities).map((name) => {
  const slug = pathSlug(name);
  return {
    name,
    slug,
    landmarks: CITY_LANDMARKS[slug] ?? pendingFact(`[${name.toUpperCase().replace(/[^A-Z]+/g, " ")} LANDMARKS]`),
  };
});

/** The city-and-service pages that exist. An allowlist, never a cross product of cities and services. */
export const CITY_SERVICE_PAGES: readonly { citySlug: string; serviceId: string; slug?: string; label?: string }[] = [
  ...FULL_SERVICE_CITY_SLUGS.flatMap((citySlug) => [
    { citySlug, serviceId: "water-heaters", slug: "water-heater-replacement", label: citySlug === "federal-way" ? "Water heater installation" : "Water heater replacement" },
    { citySlug, serviceId: "plumbing" },
    { citySlug, serviceId: "drain-sewer" },
    { citySlug, serviceId: "water-filtration" },
    { citySlug, serviceId: "heating-cooling" },
    { citySlug, serviceId: "boilers" },
  ]),
];

/**
 * Description: Reuses approved service explanations for an individual city-service option.
 * Inputs: service is a catalog category; label is one of its visible menu options, not a category alias.
 * Output: Its existing detail record, or the matching catalog explanation shaped as a detail page.
 * Examples: Gas water heaters retains its full detail; Boiler repair uses the repair section;
 * Water softeners uses the softener item rather than unrelated filtration claims.
 */
function optionDetail(service: Service, label: string): ServiceDetail {
  const extra = CITY_EXTRA_DETAILS[service.id]?.find((detail) => detail.item === label);
  if (extra) return extra;
  if (service.id === "heating-cooling" && label === "Emergency service") return {
    item: label, cta: "emergency plumbing", photo: "Emergency plumbing repair",
    summary: "We handle urgent plumbing problems, including burst pipes, active leaks and drain or sewer backups. Call to describe the problem and confirm the next available visit.",
    sections: [
      { heading: "Limit the damage safely", paras: ["Shut off the water supply if you can safely reach the valve. Stop using fixtures when wastewater is backing up. Keep clear of water near electrical equipment. For a gas smell, leave the area and call the utility or 911 from outside."] },
      { heading: "Tell us what is happening", paras: ["Describe the leak or backup, when it began and whether you can stop the water. Send photos if it is safe. We confirm the next step and explain the work and flat-rate price before starting."] },
    ],
  };
  const detail = serviceDetailFor(service.id, label);
  if (detail) return detail;
  const target = pathSlug(service.optionTargets?.[label] ?? label);
  const section = service.sections.find((section) => pathSlug(section.heading ?? "") === target);
  const item = service.sections.flatMap((section) => section.items ?? []).find(([title]) => pathSlug(title) === target);
  return {
    item: label, cta: label.toLowerCase(), photo: service.photo,
    summary: item?.[1] ?? section?.paras?.[0] ?? section?.intro,
    sections: section ? [section] : item ? [{ heading: label, paras: item[1] ? [item[1]] : [] }] : [],
  };
}

/** All menu options become pages only for cities selected for the full service journey. */
export const CITY_OPTION_PAGES = CITY_SERVICE_PAGES.filter((entry) => FULL_SERVICE_CITY_SLUGS.includes(entry.citySlug)).flatMap((entry) => {
  const service = SERVICES.find((item) => item.id === entry.serviceId)!;
  // Retain published option URLs even when navigation groups them under a new page.
  return [...new Set([...(CITY_EXTRA_DETAILS[service.id] ?? []).map((detail) => detail.item), ...serviceNavigationMenu(service), ...serviceMenu(service)])]
    .filter((label) => !SERVICES.some((item) => item.id === service.optionTargets?.[label]))
    .map((label) => ({
      citySlug: entry.citySlug,
      serviceId: service.id,
      route: `areas/${entry.citySlug}/${entry.slug ?? service.id}/${pathSlug(label)}`,
      slug: pathSlug(label),
      detail: optionDetail(service, label),
    }));
});

/**
 * Description: Keeps category and option links in the current city when city pages exist.
 * Inputs: page is the current city context or undefined; serviceId is a category; label optionally selects an option.
 * Output: A listed city page, otherwise the original site-wide destination. Category aliases retain city context.
 * Examples: Mercer Island Gas water heaters opens /gas-water-heaters-mercer-island/;
 * its Water filtration systems link opens /water-filtration-mercer-island/; Auburn retains site-wide options.
 */
export function serviceHrefFor(page: CityPageMatch | undefined, serviceId: string, label?: string): string {
  if (label) {
    const service = SERVICES.find((item) => item.id === serviceId);
    const target = service?.optionTargets?.[label];
    if (target && SERVICES.some((item) => item.id === target)) return serviceHrefFor(page, target);
    const option = CITY_OPTION_PAGES.find((item) => item.citySlug === page?.city.slug && item.serviceId === serviceId && item.slug === pathSlug(label));
    return option ? routeHref(option.route) : serviceOptionHref(serviceId, label);
  }
  const entry = CITY_SERVICE_PAGES.find((item) => item.citySlug === page?.city.slug && item.serviceId === serviceId);
  return routeHref(entry ? `areas/${entry.citySlug}/${entry.slug ?? serviceId}` : serviceId);
}

/** Owner-requested search topics share one route record for visible copy and metadata. */
export const CITY_PAGE_COPY: Record<string, {
  heading: string;
  lead: string;
  sections: readonly { heading: string; text: string }[];
}> = {
  "areas/mercer-island/plumbing": {
    heading: "General plumbing in Mercer Island, WA",
    lead: "Dr Plumbing & Heating repairs and installs household plumbing in Mercer Island, from leaking faucets and toilets to damaged pipes and whole-house repiping.",
    sections: [
      { heading: "Leaks, fixtures and water lines", text: "Tell us which fixture or pipe is affected and whether the problem is constant or happens only during use. We offer leak detection, pipe repairs, toilet installation, faucet and sink work, and shower and tub repairs." },
      { heading: "Planning a repipe or fixture upgrade", text: "Share what you want to replace, any previous repairs and whether the fixtures will move. Pipe condition, access and the proposed layout help define the work before you approve a price." },
      { heading: "Before your plumbing visit", text: "Send photos of the affected fixture and any visible leak. If water is escaping, stop using the fixture and shut off its water supply if you can reach the valve safely. Include your Mercer Island address when booking." },
    ],
  },
  "areas/mercer-island/drain-sewer": {
    heading: "Drain and sewer services in Mercer Island, WA",
    lead: "Dr Plumbing & Heating clears household drains and repairs sewer lines for Mercer Island homes. We discuss the symptoms and condition of the line before choosing cleaning or repair work.",
    sections: [
      { heading: "One slow drain or several backed-up fixtures?", text: "A problem at one sink can differ from a backup affecting several fixtures. Tell us where water collects, whether toilets gurgle and which fixtures you were using when the problem started. Avoid using affected fixtures while wastewater is backing up." },
      { heading: "Drain cleaning, hydrojetting or line repair", text: "Cleaning can remove a blockage, but a damaged sewer line may need repair or replacement. We offer drain cleaning, hydrojetting, sewer-line repair and trenchless options. Suitability depends on the line's condition and access." },
      { heading: "Share the drain's repair history", text: "Let us know how often the blockage returns and whether the line has been repaired before. Existing inspection reports and photos can help us understand the problem at your Mercer Island home." },
    ],
  },
  "areas/mercer-island/water-filtration": {
    heading: "Water filtration system installation in Mercer Island, WA",
    lead: "Dr Plumbing & Heating provides water filtration system installation for Mercer Island homes. Start with the water concern and any test results so the equipment addresses the actual problem.",
    sections: [
      { heading: "Identify the concern before choosing a filter", text: "Taste, odor and mineral buildup do not all call for the same treatment. Describe what you notice, whether it affects hot and cold water, and whether it occurs throughout the home. A water test can help establish what needs treatment." },
      { heading: "Compare treatment options", text: "We discuss softeners, carbon filters and reverse-osmosis systems, including whole-house and drinking-water applications. Available space, pipe access and the household's water use affect the installation." },
      { heading: "Plan for maintenance as well as installation", text: "Filters need replacement and treatment systems need ongoing care. Ask about consumables, service access and maintenance requirements before choosing equipment. Send any water-test report and photos of your existing setup when contacting us." },
    ],
  },
  "areas/mercer-island/heating-cooling": {
    heading: "Heating and cooling in Mercer Island, WA",
    lead: "Dr Plumbing & Heating services home heating and cooling equipment in Mercer Island. Tell us what system you have and whether you need a repair, maintenance or replacement planning.",
    sections: [
      { heading: "Describe the comfort problem", text: "Tell us whether the system will not start, runs without reaching the set temperature or leaves some rooms uncomfortable. Include any displayed error code, unusual sound and when the symptoms began." },
      { heading: "Repair or replacement planning", text: "Equipment condition, the home's heating and cooling needs and the existing installation affect the options. Share the model label and photos of the equipment and surrounding space so we can discuss the next step." },
      { heading: "Boiler or radiant heating?", text: "If your home uses a boiler and hot-water radiators or radiant floors, choose the dedicated boiler service from the Mercer Island page. Identifying the system helps us prepare for the right type of visit." },
    ],
  },
  "areas/mercer-island/boilers": {
    heading: "Boiler services in Mercer Island, WA",
    lead: "Dr Plumbing & Heating services boilers and hydronic heating for Mercer Island homes. Contact us about boiler repairs, maintenance, replacement or uneven heat from radiators and radiant floors.",
    sections: [
      { heading: "A boiler problem or a heating-zone problem?", text: "Tell us whether the whole home has lost heat or only certain rooms are affected. Share any error code, visible leak or unusual noise. These details help distinguish equipment symptoms from distribution or control problems." },
      { heading: "Maintain, repair or replace the system", text: "The boiler's condition and the existing hydronic system guide the work. We discuss the equipment, controls and installation requirements before agreeing on repairs or replacement. A replacement needs to suit the heating system it serves." },
      { heading: "What to send before a visit", text: "Include photos of the boiler's model label, nearby piping and controls. Tell us whether the boiler also provides domestic hot water and when it was last serviced, if known. Include your Mercer Island address and access details." },
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

// Reuse the approved Mercer Island wording so city replicas cannot drift in scope or service claims.
const mercerCopy = Object.entries(CITY_PAGE_COPY).filter(([route]) => route === "areas/mercer-island" || route.startsWith("areas/mercer-island/"));
for (const citySlug of FULL_SERVICE_CITY_SLUGS.filter((slug) => slug !== "mercer-island")) {
  const city = CITY_PAGES.find((page) => page.slug === citySlug)!;
  for (const [route, copy] of mercerCopy) {
    CITY_PAGE_COPY[route.replace("mercer-island", citySlug)] = {
      heading: copy.heading.replaceAll("Mercer Island", city.name),
      lead: copy.lead.replaceAll("Mercer Island", city.name),
      sections: copy.sections.map((section) => ({
        heading: section.heading.replaceAll("Mercer Island", city.name),
        text: section.text.replaceAll("Mercer Island", city.name),
      })),
    };
  }
}

// Federal Way uses the owner's requested residential and installation search topics.
CITY_PAGE_COPY["areas/federal-way"].heading = "Residential plumber in Federal Way, WA";
CITY_PAGE_COPY["areas/federal-way/water-heater-replacement"].heading = "Water heater installation in Federal Way, WA";

/**
 * Description: Resolves the path segments after "areas" to a city page, so routing, metadata and the
 * static build agree on which city addresses exist.
 * Inputs: segments are the path parts after the areas page: a city name or slug, then optionally a
 * listed service-page slug, then an optional listed option slug. Later segments are ignored.
 * Output: The page's route, city, service and option detail when listed. An unlisted service yields the city page; an
 * unknown city yields undefined.
 * Examples: ["Bellevue"] and ["bellevue"] both give route "areas/bellevue" with no service;
 * ["bellevue", "water-heaters"] retains the old bookmark and gives "areas/bellevue/water-heater-replacement";
 * ["auburn", "boilers"] gives the Auburn city page; ["nowhere"] gives undefined;
 * ["mercer-island", "water-heater-replacement", "gas-water-heaters"] carries the gas detail.
 */
export function cityPageAt(segments: readonly string[]): CityPageMatch | undefined {
  const [citySegment = "", serviceSegment = "", optionSegment = ""] = segments;
  const city = CITY_PAGES.find((page) => page.slug === pathSlug(citySegment));
  if (!city) return undefined;
  const serviceId = city.slug === "bellevue" && serviceSegment === "water-heaters"
    ? "water-heater-replacement" : pathSlug(serviceSegment);
  const listed = CITY_SERVICE_PAGES.find((entry) => entry.citySlug === city.slug && (entry.slug ?? entry.serviceId) === serviceId);
  const service = listed ? SERVICES.find((item) => item.id === listed.serviceId) : undefined;
  const option = CITY_OPTION_PAGES.find((item) => item.citySlug === city.slug && item.serviceId === service?.id && item.slug === pathSlug(optionSegment));
  if (option) return { route: option.route, city, service, detail: option.detail };
  return service
    ? { route: `areas/${city.slug}/${listed!.slug ?? service.id}`, city, service }
    : { route: `areas/${city.slug}`, city };
}

/**
 * Description: Names what a city page is about, for its heading and its Service schema.
 * Inputs: page is a resolved city page.
 * Output: An explicit search-topic heading when supplied, otherwise the city and service heading.
 * Examples: The Bellevue page is "Plumber in Bellevue, WA"; the Bellevue
 * water-heater category is "Water heater replacement in Bellevue, WA".
 */
export function cityHeading(page: CityPageMatch) {
  if (page.detail) return `${cityOptionLabel(page.service!.id, page.detail.item)} in ${page.city.name}, WA`;
  return CITY_PAGE_COPY[page.route]?.heading ?? `${page.service?.title ?? "Plumbing, heating and cooling"} in ${page.city.name}, WA`;
}

/**
 * Description: Answers "what does this firm do here?" in two or three sentences built from confirmed
 * facts, so the page and its meta description say the same thing and neither can guess.
 * Inputs: page is a resolved city page.
 * Output: What the firm does in the city (the service's own lead on a city-and-service page), the
 * price basis, and the response time only when the owner has confirmed one.
 * Examples: Bellevue's introduction names household plumbing services and ends with the
 * approved flat-rate price statement. Its heater category describes replacement options.
 * No page mentions a response time today.
 */
export function cityAnswer(page: CityPageMatch) {
  const name = confirmed(BUSINESS.publicName);
  const where = `homes in ${page.city.name}, WA`;
  const copy = CITY_PAGE_COPY[page.route];
  const sentences = page.detail
    ? [page.detail.item === "Emergency service"
      ? `An emergency plumber in ${page.city.name} can help with an active leak, burst pipe or sewer backup.`
      : `${name} offers ${cityOptionLabel(page.service!.id, page.detail.item).toLowerCase()} for ${where}.`, page.detail.summary ?? page.detail.lead ?? page.service!.lead]
    : copy ? [copy.lead] : page.service
    ? [`${name} serves ${where}.`, page.service.lead]
    : [`${name} repairs and installs plumbing, water heaters, drains and heating for ${where}.`];
  sentences.push(confirmed(BUSINESS.priceBasis));
  const responseTime = confirmed(BUSINESS.responseTime);
  if (responseTime) sentences.push(`Typical response time: ${responseTime}.`);
  return sentences.join(" ");
}

/**
 * Description: Adds approved local references to the city's service coverage.
 * Inputs: page is a resolved city page.
 * Output: A coverage sentence naming two verified landmarks, or undefined when none are confirmed.
 * Examples: Newcastle names Lake Boren Park and May Creek Park; pending Auburn landmarks add no sentence.
 */
export function cityLandmarksText(page: CityPageMatch) {
  const landmarks = confirmed(page.city.landmarks);
  return landmarks ? `We serve homes throughout ${page.city.name}, including near ${landmarks[0]} and ${landmarks[1]}.` : undefined;
}
