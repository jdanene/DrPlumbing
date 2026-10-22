import { PUBLIC_ROUTES } from "./seo";
import { AGENT_READABLE_CITY_SLUGS } from "./cities";
import { FULL_SERVICE_CITY_SLUGS } from "./sitePaths";

/**
 * Description: Records known publication and content-revision dates, not the build day.
 * Inputs: Public route IDs; future content edits add an override on their actual merge day.
 * Output: A complete route-to-date map used by the sitemap and visible city-page dates.
 * Examples: Object.keys(PAGE_DATES).length equals PUBLIC_ROUTES.length.
 *
 * Source: October 21 adds the eight repair pages, updates city service phrases and
 * records emergency hours. Existing pages retain their previous revision unless touched.
 * The previous shared-shell baseline was 8d2c55af on October 18. Revision dates are
 * not first-publication dates and do not assert that an unmerged branch is live.
 * Do not replace them with today's date merely because a build ran.
 */
const baselineUpdated = "2026-10-20";
const routeUpdates: Record<string, string> = Object.fromEntries(
  PUBLIC_ROUTES.filter((route) => FULL_SERVICE_CITY_SLUGS.some((slug) => route === `areas/${slug}` || route.startsWith(`areas/${slug}/`))).map((route) => [route, "2026-10-21"]),
);
export const PAGE_DATES: Record<string, { published?: string; updated: string }> = Object.fromEntries(
  PUBLIC_ROUTES.map((route) => {
    const inCohort = AGENT_READABLE_CITY_SLUGS.some((slug) => route === `areas/${slug}` || route.startsWith(`areas/${slug}/`));
    // The ticket records the cohort's original production launch on October 18.
    // October 20 is this content revision, not a claim that this unmerged PR is live.
    const newRepairPage = route.endsWith("/water-heater-repair") || route.endsWith("/emergency-plumber");
    return [route, { ...(inCohort && !newRepairPage ? { published: "2026-10-18" } : {}), updated: routeUpdates[route] ?? baselineUpdated }];
  }),
);
