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
 * Inputs: route is a page ID, service/detail ID, or homepage section ID.
 * Output: An absolute local path; an unknown page returns the homepage.
 * Examples: "drain-sewer/hydrojetting" becomes "/drain-and-sewer/hydrojetting/"; "home" becomes "/".
 */
export function routeHref(route: string) {
  if (HOME_ANCHORS.includes(route)) return `/#${route}`;
  const [page, detail] = route.split("/");
  const path = PAGE_PATHS[page];
  if (!path) return "/";
  return detail ? `${path}${detail}/` : path;
}
