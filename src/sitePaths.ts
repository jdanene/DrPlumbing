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

/**
 * Description: Gives an existing route its crawlable link without exposing path aliases to callers.
 * Inputs: route is a page ID, a page ID followed by one or more child segments, or a homepage section ID.
 * Output: An absolute local path; an unknown page returns the homepage.
 * Examples: "drain-sewer/hydrojetting" becomes "/drain-and-sewer/hydrojetting/"; "home" becomes "/";
 * "areas/bellevue/water-heaters" becomes "/areas-we-serve/bellevue/water-heaters/".
 */
export function routeHref(route: string) {
  if (HOME_ANCHORS.includes(route)) return `/#${route}`;
  const [page, ...children] = route.split("/");
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
