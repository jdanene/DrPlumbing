import { SERVICES } from "./content";
import { serviceDetailFor, serviceDetailSlug } from "./serviceDetails";
import { HOME_ANCHORS, PAGE_PATHS, routeHref } from "./sitePaths";

export { HOME_ANCHORS } from "./sitePaths";

/**
 * Description: Resolves public hash links without an application server or router dependency.
 * Inputs: hash includes an optional # and may name a service detail.
 * Output: A known page or section; unknown details fall back to their parent and unknown parents to home.
 * Examples: App.test.tsx and ServiceDetails.test.tsx check homepage anchors, detail links, and both fallback cases.
 */
export function resolveRoute(hash: string) {
  const route = hash.replace(/^#/, "");
  const [serviceId, detailKey] = route.split("/");
  if (SERVICES.some((service) => service.id === serviceId)) {
    const detail = detailKey ? serviceDetailFor(serviceId, detailKey) : undefined;
    return detail ? `${serviceId}/${serviceDetailSlug(detail.item)}` : serviceId;
  }
  return [
    "home",
    "services",
    "about",
    "work",
    "book",
    "areas",
    ...HOME_ANCHORS,
    ...SERVICES.map((service) => service.id),
  ].includes(route)
    ? route
    : "home";
}

/**
 * Description: Distinguishes old page hashes from ordinary section anchors.
 * Inputs: hash may include a leading # and a subservice slug.
 * Output: True only when the hash starts with a known mockup page or homepage section.
 * Examples: #boilers is legacy navigation; #home-faq is a homepage section; #leak-detection stays on the current page.
 */
export function isLegacyRouteHash(hash: string) {
  const value = hash.replace(/^#/, "");
  return HOME_ANCHORS.includes(value) || Object.hasOwn(PAGE_PATHS, value.split("/")[0]);
}

/**
 * Description: Resolves clean paths and retains bookmarks made before the hash-route migration.
 * Inputs: pathname and hash come from one browser location; neither includes the query string.
 * Output: A page or homepage section. Unknown real paths return not-found; legacy unknown hashes retain home fallback.
 * Examples: "/plumbing/#leak-detection" stays on plumbing; "/#home-faq" resolves the FAQ; "/missing/" is not-found.
 */
export function routeFromLocation(pathname: string, hash = "") {
  if (isLegacyRouteHash(hash)) return resolveRoute(hash);
  const path = pathname.replace(/\/+$/, "") || "/";
  for (const [route, href] of Object.entries(PAGE_PATHS)) {
    if ((href.replace(/\/+$/, "") || "/") === path) return route;
    if (route !== "home" && pathname.startsWith(href)) {
      const detail = pathname.slice(href.length).replace(/\/+$/, "");
      const resolved = resolveRoute(`#${route}/${detail}`);
      if (routeHref(resolved).replace(/\/+$/, "") === path) return resolved;
    }
  }
  return "not-found";
}
