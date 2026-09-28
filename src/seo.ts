import { BUSINESS_NAME, CITIES, SERVICES } from "./content";
import { SERVICE_DETAILS, serviceDetailFor, serviceDetailSlug } from "./serviceDetails";
import { HOME_ANCHORS, PAGE_PATHS, routeHref } from "./sitePaths";

export const SITE_ORIGIN = "https://drplumbingheating.com";

// Adapted from the vetted mockup's seo.js; the current site supplies the business facts.
const PAGE_METADATA: Record<string, [string, string]> = {
  home: ["Dr Plumbing & Heating | Greater Seattle Area", "Family-owned plumbing, heating and cooling in the Greater Seattle area, with 26+ years in the trade. Water heaters, drains, boilers and HVAC. Call (206) 671-8888."],
  services: ["Plumbing, Heating & Cooling Services | Dr Plumbing & Heating", "Every service we offer, from leak detection and water heaters to boilers and HVAC. Licensed, bonded and insured technicians in the Greater Seattle area."],
  about: ["About Dr Plumbing & Heating | Seattle, WA Plumber", "Dr Plumbing & Heating is a family-owned plumbing, heating and cooling company in Seattle, WA. HomeAdvisor certified, with flat-rate pricing."],
  work: ["Our Work | Plumbing & HVAC Projects | Dr Plumbing & Heating", "Explore our water heater, boiler, heat pump, sewer and plumbing work for homes from Everett to Federal Way."],
  book: ["Book a Plumber or HVAC Technician | Dr Plumbing & Heating", "Request a visit from a licensed plumber or HVAC technician in the Greater Seattle area. We confirm your time and give you a flat-rate price before we start."],
  areas: ["Areas We Serve: Everett to Federal Way | Dr Plumbing & Heating", "Plumbing, heating and cooling for Seattle, Bellevue, Renton, Redmond, Kent, Everett and nearby cities in King and Snohomish counties."],
  plumbing: ["Plumbing Repair & Installation in Seattle, WA | Dr Plumbing & Heating", "Leak detection, burst pipes, repiping, trenchless water lines, gas lines, toilets, faucets and sump pumps. Licensed plumbers serving Everett to Federal Way."],
  "water-heaters": ["Water Heater Repair & Installation in Seattle, WA | Dr Plumbing & Heating", "Electric, gas, tankless and heat pump water heaters. We repair, replace and install water heaters in homes from Everett to Federal Way. (206) 671-8888."],
  "drain-sewer": ["Drain Cleaning & Sewer Repair in Seattle, WA | Dr Plumbing & Heating", "Drain cleaning, hydro jetting and sewer line repair and replacement for homes in Seattle, Bellevue, Renton and nearby cities."],
  "water-filtration": ["Water Filtration & Softeners in Seattle, WA | Dr Plumbing & Heating", "Water softeners, carbon filters, reverse osmosis and iron and sulfur filters, installed by licensed plumbers in Seattle, WA and the Eastside."],
  "heating-cooling": ["Heating & Cooling (HVAC) in Seattle, WA | Dr Plumbing & Heating", "Furnace, heat pump and air conditioning installation, maintenance and repair, plus emergency HVAC service in Seattle, WA and nearby cities."],
  boilers: ["Boiler Service & Hydronic Heating in Seattle, WA | Dr Plumbing & Heating", "Hydronic boiler maintenance, repair and replacement, including radiant floor and baseboard heat. Annual boiler service from licensed technicians."],
  "plumbing/garbage-disposals": ["Garbage Disposal Repair & Installation | Dr Plumbing & Heating", "Garbage disposal installation, repair and cleaning for homes and commercial kitchens in Seattle, WA and the Greater Seattle area."],
  "water-heaters/electric-water-heaters": ["Electric Water Heaters in Seattle, WA | Dr Plumbing & Heating", "Tank and tankless electric water heaters sized to your home. Repair, replacement and installation from licensed plumbers in Seattle, WA."],
  "water-heaters/gas-water-heaters": ["Gas Water Heater Repair & Replacement | Dr Plumbing & Heating", "Gas and propane water heater repair, maintenance and replacement. Running out of hot water, or water too hot? Our plumbers can help."],
  "water-heaters/tankless-water-heaters": ["Tankless Water Heaters in Seattle, WA | Dr Plumbing & Heating", "On-demand tankless water heaters sized to your family's hot water use, plus tankless repair and maintenance. Serving Everett to Federal Way."],
  "water-heaters/heat-pump-water-heaters": ["Heat Pump Water Heaters in Seattle, WA | Dr Plumbing & Heating", "Energy-efficient heat pump water heaters that can lower your energy bills. Installation, service and help choosing a model in Seattle, WA."],
  "drain-sewer/hydrojetting": ["Hydro Jetting for Drains & Sewer Lines | Dr Plumbing & Heating", "Hydro jetting at up to 4,000 psi clears stubborn clogs and years of sludge from drains and sewer lines. Serving Seattle, WA and nearby cities."],
};

export const PUBLIC_ROUTES = [
  ...Object.keys(PAGE_PATHS),
  ...Object.entries(SERVICE_DETAILS).flatMap(([serviceId, details]) =>
    details.map((detail) => `${serviceId}/${serviceDetailSlug(detail.item)}`),
  ),
];

interface HeadTag {
  tag: "title" | "meta" | "link" | "script";
  attributes: Record<string, string>;
  text?: string;
}

/**
 * Description: Supplies identical search and social metadata to the static build and client navigation.
 * Inputs: route is a resolved page; indexable is false for development and missing pages.
 * Output: Head tags with one canonical, page-specific copy, and schema limited to current business facts.
 * Examples: A gas-water-heater page names its own URL and service; home-faq uses the homepage canonical; not-found is noindex.
 */
export function headTags(route: string, indexable = true): HeadTag[] {
  const page = HOME_ANCHORS.includes(route) ? "home" : route;
  const canonical = `${SITE_ORIGIN}${routeHref(page)}`;
  const logo = `${SITE_ORIGIN}/brand/dr-brand-mark.png`;
  const socialImage = `${SITE_ORIGIN}/brand/dr-social-card-v1.png`;
  const businessId = `${SITE_ORIGIN}/#business`;
  const [serviceId, detailKey] = page.split("/");
  const service = SERVICES.find((item) => item.id === serviceId);
  const detail = detailKey ? serviceDetailFor(serviceId, detailKey) : undefined;
  const [title, description] = PAGE_METADATA[page] ?? (detail
    ? [`${detail.item} in Seattle, WA | Dr Plumbing & Heating`, detail.summary ?? detail.lead ?? service?.lead ?? "Plumbing, heating and cooling in the Greater Seattle area."]
    : ["Page not found | Dr Plumbing & Heating", "Find plumbing, heating and cooling services in the Greater Seattle area."]);
  const socialTitle = page === "home" ? "Plumbing, Heating & Cooling in Greater Seattle" : title;
  const graph: Record<string, unknown>[] = [
    {
      "@type": ["Plumber", "HVACBusiness"],
      "@id": businessId,
      name: BUSINESS_NAME,
      url: `${SITE_ORIGIN}/`,
      telephone: "+12066718888",
      email: "drplumbinggroup@gmail.com",
      logo,
      areaServed: CITIES.map((name) => ({ "@type": "City", name })),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      name: "Dr Plumbing & Heating",
      url: `${SITE_ORIGIN}/`,
      publisher: { "@id": businessId },
    },
    {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: title,
      description,
      isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
      about: { "@id": businessId },
    },
  ];
  if (service) {
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: detail?.item ?? service.title,
      description,
      url: canonical,
      provider: { "@id": businessId },
      areaServed: CITIES.map((name) => ({ "@type": "City", name })),
    });
    const crumbs = [{ name: "Home", item: `${SITE_ORIGIN}/` }];
    if (detail) crumbs.push({ name: service.tab, item: `${SITE_ORIGIN}${routeHref(serviceId)}` });
    crumbs.push({ name: detail?.item ?? service.tab, item: canonical });
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, ...crumb })),
    });
  }
  const tags: HeadTag[] = [
    { tag: "title", attributes: {}, text: title },
    { tag: "meta", attributes: { name: "description", content: description } },
    { tag: "meta", attributes: { name: "robots", content: indexable && page !== "not-found" ? "index, follow, max-image-preview:large" : "noindex, nofollow" } },
  ];
  if (page === "not-found") return tags;
  tags.push(
    { tag: "link", attributes: { rel: "canonical", href: canonical } },
    { tag: "meta", attributes: { property: "og:type", content: "website" } },
    { tag: "meta", attributes: { property: "og:site_name", content: "Dr Plumbing & Heating" } },
    { tag: "meta", attributes: { property: "og:locale", content: "en_US" } },
    { tag: "meta", attributes: { property: "og:title", content: socialTitle } },
    { tag: "meta", attributes: { property: "og:description", content: description } },
    { tag: "meta", attributes: { property: "og:url", content: canonical } },
    { tag: "meta", attributes: { property: "og:image", content: socialImage } },
    { tag: "meta", attributes: { property: "og:image:type", content: "image/png" } },
    { tag: "meta", attributes: { property: "og:image:width", content: "1200" } },
    { tag: "meta", attributes: { property: "og:image:height", content: "630" } },
    { tag: "meta", attributes: { property: "og:image:alt", content: "Dr Plumbing, Heating & Cooling DR logo on a light background" } },
    { tag: "meta", attributes: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attributes: { name: "twitter:title", content: socialTitle } },
    { tag: "meta", attributes: { name: "twitter:description", content: description } },
    { tag: "meta", attributes: { name: "twitter:image", content: socialImage } },
    { tag: "meta", attributes: { name: "twitter:image:alt", content: "Dr Plumbing, Heating & Cooling DR logo on a light background" } },
    { tag: "script", attributes: { type: "application/ld+json" }, text: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") },
  );
  return tags;
}

/**
 * Description: Keeps browser metadata aligned when navigation does not reload the document.
 * Inputs: route is the displayed page. Development and noncanonical hosts remain noindex.
 * Output: Replaces only this site's managed head tags; fonts, icons, and theme stay untouched.
 * Examples: Moving from plumbing to boilers changes the title, canonical, and Service schema together.
 */
export function updateHead(route: string) {
  document.head.querySelectorAll("[data-seo]").forEach((tag) => tag.remove());
  const indexable = import.meta.env.PROD && window.location.origin === SITE_ORIGIN && document.documentElement.dataset.indexable !== "false";
  for (const { tag, attributes, text } of headTags(route, indexable)) {
    const element = document.createElement(tag);
    element.dataset.seo = "";
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
    if (text !== undefined) element.textContent = text;
    document.head.appendChild(element);
  }
}
