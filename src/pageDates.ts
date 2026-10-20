import { PUBLIC_ROUTES } from "./seo";

/**
 * Description: Records the last published HTML change for each existing page, not the build day.
 * Inputs: Public route IDs; future content edits add an override on their actual merge day.
 * Output: A complete route-to-date map used by the sitemap and later visible content dates.
 * Examples: Object.keys(PAGE_DATES).length equals PUBLIC_ROUTES.length.
 *
 * Source: shared SiteShell content changed in 8d2c55af (2026-10-18, America/Los_Angeles),
 * affecting every rendered page. Later service/photo changes on the same day include
 * f0506630, 89b15256 and b989f6bb. These are last-modified dates, not first-publication dates.
 * Do not replace them with today's date merely because a build ran.
 */
const baselineUpdated = "2026-10-18";
const routeUpdates: Record<string, string> = {};
export const PAGE_DATES: Record<string, { updated: string }> = Object.fromEntries(
  PUBLIC_ROUTES.map((route) => [route, { updated: routeUpdates[route] ?? baselineUpdated }]),
);
