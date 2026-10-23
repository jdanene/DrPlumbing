import { AGENT_READABLE_CITY_SLUGS, type CityPageMatch } from "./cities";
import { pathSlug } from "./sitePaths";

/**
 * Description: Names the seven target cities whose pages carry the machine-readable answer metadata.
 * Inputs: A resolved city page, or undefined for a general page.
 * Output: True only for JDA-408's cohort; Kirkland and other city pages keep their plain metadata.
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
