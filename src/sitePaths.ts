/**
 * Description: Defines the public page addresses shared by links, navigation, and the static build.
 * Inputs: Route names use the existing mockup IDs; detail routes append a service slug.
 * Output: Stable paths on the registered domain. Homepage sections retain their anchors.
 * Examples: routeHref("work") is "/our-work/"; routeHref("home-faq") is "/#home-faq".
 */
export const PAGE_PATHS: Record<string, string> = {
  home: "/",
  services: "/services/",
  about: "/about/",
  work: "/our-work/",
  book: "/book/",
  areas: "/areas-we-serve/",
  plumbing: "/plumbing/",
  "water-heaters": "/water-heaters/",
  "drain-sewer": "/drain-and-sewer/",
  "water-filtration": "/water-filtration/",
  "heating-cooling": "/heating-and-cooling/",
  boilers: "/boilers/",
};

export const HOME_ANCHORS = ["home-reviews", "home-area", "home-services", "home-faq"];

/** Only these owner-selected cities replicate the full Mercer Island service journey. */
export const FULL_SERVICE_CITY_SLUGS = ["mercer-island", "federal-way", "newcastle", "bellevue", "renton", "kirkland", "redmond", "issaquah"];

/** City pages with owner-requested flat addresses; other cities retain the areas hierarchy. */
export const CITY_PATHS: Record<string, string> = {
  ...Object.fromEntries(
    FULL_SERVICE_CITY_SLUGS.flatMap((city) => [
      [`areas/${city}`, `/plumber-${city}/`],
      [`areas/${city}/plumbing`, `/plumbing-${city}/`],
      [`areas/${city}/water-heater-replacement`, `/water-heater-replacement-${city}/`],
      [`areas/${city}/drain-sewer`, `/drain-and-sewer-${city}/`],
      [`areas/${city}/water-filtration`, `/water-filtration-${city}/`],
      [`areas/${city}/heating-cooling`, `/heating-and-cooling-${city}/`],
      [`areas/${city}/boilers`, `/boilers-${city}/`],
    ]),
  ),
  "areas/federal-way": "/federal-way-residential-plumber/",
  "areas/federal-way/water-heater-replacement": "/federal-way-water-heater-installation/",
};

/** Old nested addresses resolve locally and redirect permanently on the static host. */
export const PATH_REDIRECTS: Record<string, string> = {
  ...Object.fromEntries(
    Object.keys(CITY_PATHS).map((route) => [`${PAGE_PATHS.areas}${route.slice("areas/".length)}/`, route]),
  ),
  "/plumber-federal-way/": "areas/federal-way",
  "/water-heater-replacement-federal-way/": "areas/federal-way/water-heater-replacement",
  "/areas-we-serve/bellevue/water-heaters/": "areas/bellevue/water-heater-replacement",
};

/**
 * Description: Gives an existing route its crawlable link without exposing path aliases to callers.
 * Inputs: route is a page ID, a listed city/service/option route, or a homepage section ID.
 * Output: An absolute local path; an unknown page returns the homepage.
 * Examples: "drain-sewer/hydrojetting" becomes "/drain-and-sewer/hydrojetting/"; "home" becomes "/";
 * "areas/bellevue/water-heater-replacement" becomes "/water-heater-replacement-bellevue/";
 * "areas/mercer-island/water-heater-replacement/gas-water-heaters" becomes "/gas-water-heaters-mercer-island/".
 */
export function routeHref(route: string) {
  if (HOME_ANCHORS.includes(route)) return `/#${route}`;
  if (CITY_PATHS[route]) return CITY_PATHS[route];
  const [page, ...children] = route.split("/");
  if (page === "areas" && children.length === 3) return `/${children[2]}-${children[0]}/`;
  const path = PAGE_PATHS[page];
  if (!path) return "/";
  return children.length ? `${path}${children.join("/")}/` : path;
}

/**
 * Description: Turns a label into the one path segment this site uses for it, so a service detail,
 * a city and any future child page share one address rule.
 * Inputs: label is a visible heading, a city name, or an existing slug.
 * Output: Lowercase words joined by hyphens, with "&" written as "and" and no leading or trailing hyphen.
 * Examples: "Gas water heaters" is "gas-water-heaters"; "Faucets, fixtures & sinks" is
 * "faucets-fixtures-and-sinks"; "East Hill-Meridian" is "east-hill-meridian"; "" is "".
 */
export function pathSlug(label: string) {
  return label.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
