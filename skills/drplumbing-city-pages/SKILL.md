---
name: drplumbing-city-pages
description: Replicate Dr Plumbing's existing Mercer Island pages for another requested service city, preserving localized copy, page structure, pictures, and city-specific navigation. Use when preparing another city like Mercer Island.
---

# Replicate the Mercer Island pages

Use the current Mercer Island implementation as the reference. Keep its wording
adjustments, service hierarchy, layout, photos, and navigation. Change the city
name and slug for the cities the user requests. Do not redesign or rewrite the
service content as part of replication.

## Locate the work

Work in the DrPlumbing Git repository or its active worktree under
`/Users/jideanene/claude/Projects/Plumbing/`. Read its `AGENTS.md` and README.
The versioned copy of this skill is `skills/drplumbing-city-pages/SKILL.md`.

Inspect these sources before editing:

- `src/cities.ts`: city allowlist, Mercer Island copy, category and option pages,
  and city-aware service links.
- `src/sitePaths.ts` and `src/routes.ts`: public paths, old-path redirects, and
  direct navigation.
- `src/CityPage.tsx`, `src/SiteContent.tsx`, and `src/SiteShell.tsx`: city overview,
  service pages, header, mobile navigation, footer, and related-service links.
- `src/content.ts`, `src/serviceDetails.ts`, and `src/projectPhotos.ts`: shared
  explanations and the original photos. Reuse these rather than copying assets.
- `src/seo.ts` and `scripts/prerender.mjs`: static pages, titles, descriptions,
  canonicals, service/breadcrumb schema, sitemap, robots, and redirects.

## Preserve the details already established

- Replicate only explicitly requested cities already confirmed in
  `src/businessFacts.ts`. Leave all other cities and general-site links alone.
- The current Mercer Island set has one overview, six categories, and 35 option
  pages. Inspect the current catalog before assuming those counts still apply.
- The overview is `/plumber-{city}/`, not a generic installation or service URL.
  Keep the existing category names and paths, including
  `/water-heater-replacement-{city}/`, `/heating-and-cooling-{city}/`, and
  `/drain-and-sewer-{city}/`. Options use `/{option}-{city}/`.
- Preserve old `/areas-we-serve/{city}/` bookmarks through the same redirect
  mechanism used for Mercer Island. Give each page one canonical URL.
- Keep service links in the selected city throughout the journey: overview,
  category menu, detail siblings, parent link, header dropdown, mobile menu,
  and footer. Gas → electric → tankless → boilers must not leave that city.
- A category alias, such as Plumbing → Water filtration systems, opens that
  city's filtration category rather than creating a duplicate detail page.
- Keep the main service pages' pictures, galleries, and educational sections.
  Preserve the existing category-photo fallback where Mercer Island uses it.
  Check actual image loading, not just the presence of an image element.
- Localize the overview, heading, introduction, booking text, metadata, and
  service area in schema. Preserve shared business/contact facts. Do not leave
  “Mercer Island” in the new city's rendered copy or claim photos were taken there.
- Preserve booking service preselection and existing call/text destinations.
- Update the generated sitemap and redirects through the route catalog; do not
  hand-edit build output. Keep development/preview indexing rules unchanged.

## Verify and save

Extend the existing city-page and city-journey tests for each requested city.
Check direct URLs, all category/option destinations, parent/sibling navigation,
canonical/schema city names, original photos, and unchanged unrelated cities.
Run `npm run check`. If parallel tests time out, diagnose and run with fewer
workers without skipping tests or increasing limits to conceal failures.

Walk the gas → electric → tankless → boilers journey in the local browser.
Check desktop and mobile navigation, console errors, photos, and the built
sitemap/redirect files. Report the actual counts and any failed checks.

Commit the skill and implementation on a feature branch when requested, and
report the commit hash and exact skill path. “Saved” means the files exist;
“committed” means Git contains them. Verify both before claiming completion.

Honor the requested release scope. For local preparation, do not push, merge,
deploy, or submit anything to Search Console. This repository auto-deploys
pushed branches, and merging main publishes production.
