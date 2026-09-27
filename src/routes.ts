import { SERVICES } from "./content";

export const HOME_ANCHORS = ["home-reviews", "home-area", "home-services"];

/**
 * Description: Resolves public hash links without an application server or router dependency.
 * Inputs: hash includes an optional #; unknown and empty values resolve to home.
 * Output: A known page or homepage section identifier.
 * Examples: App.test.tsx checks empty, unknown, service, and homepage-section links.
 */
export function resolveRoute(hash: string) {
  const route = hash.replace(/^#/, "");
  return [
    "home",
    "services",
    "about",
    "work",
    "book",
    ...HOME_ANCHORS,
    ...SERVICES.map((service) => service.id),
  ].includes(route)
    ? route
    : "home";
}
