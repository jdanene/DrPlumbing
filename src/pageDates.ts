import { PUBLIC_ROUTES } from "./seo";

/**
 * Description: Records each page's content-revision date for the sitemap, not the build day.
 * Inputs: Public route IDs; a later content edit changes the date of the routes it touched.
 * Output: A complete route-to-date map; the sitemap's lastmod and the 90-day content review read it.
 * Examples: Object.keys(PAGE_DATES).length equals PUBLIC_ROUTES.length.
 *
 * Source: October 22, 2026 renamed the services in the header menu, so every page changed that day.
 * Do not replace a date with today's merely because a build ran; change it when the content changes.
 */
const contentRevised = "2026-10-22";
export const PAGE_DATES: Record<string, { updated: string }> = Object.fromEntries(
  PUBLIC_ROUTES.map((route) => [route, { updated: contentRevised }]),
);
