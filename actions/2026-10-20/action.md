# 2026-10-20 · The AEO offensive: PR #26, seven cities' pages made the ones an AI assistant quotes

The website change in [PR #26](https://github.com/jdanene/DrPlumbing/pull/26)
(branch `agent-readable/seven-cities`, ticket
[JDA-408](https://linear.app/jdanene39/issue/JDA-408)). Built October 18 to 20,
2026 by the builder; reviewed October 20; the builder has one more comment to
apply (see Next). Not merged; a merge to `main` is the deploy.

## What we did

Rewrote the 301 city pages for Bellevue, Newcastle, Renton, Redmond, Issaquah,
Federal Way and Mercer Island (7 cities × 43 pages: one hub `plumber-<city>` and
42 service pages) so that an AI assistant reading the site finds, on every page:

1. **The reader's question as the first H2**, in the words they type ("Who is a
   good plumber in Bellevue?", "Should I repair or replace my water heater in
   Newcastle?"). 43 question-and-answer records, one per service, the city
   filled in by the template.
2. **A short "it depends" answer** under it, under 100 words, with the
   repair-or-replace rule for that service (age and repair-cost cut-offs; tank,
   tankless or heat pump by household size and gas line; boiler age; sewer
   condition), cited to trade, manufacturer, utility and government sources.
3. **A measured comparison with that service's real rivals in that city.**
   Tier A (98 pages: the 7 hubs and the water heater, boiler and trenchless
   pages) names the rivals from the page's own October 19 scan with their share
   of the top 3, review count, rating, Google categories and the scan date, plus
   20 checked facts from the rivals' own sites and when the rival is the better
   call. Tier B (203 pages: general plumbing, drain, heating, filtration) links
   to the city hub's comparison instead, since chains and stores hold those tops
   and naming them helps them.
4. **One sentence true only for its page**, generated from the scan, so no two of
   the 301 pages read alike.
5. **A definition, not a slogan**: owner-operated, Newcastle, Mehran's 26+
   years, the service scope, the flat-rate price before work starts.
6. **The six Google reviews as plain text** on each city hub.
7. **Dated facts** ("as of October 2026") for hours, license, years, service
   area and the scan, from one record, `src/businessFacts.ts`.
8. **Retrieval work**: every hub links its 42 service pages; `lastmod` on every
   sitemap URL; named allow lines for the AI crawlers; build checks that fail on
   an unnamed button, an unlabeled field, a missing alt, a thin page, a broken
   internal link, a duplicate sentence or a wrong count.

The numbers are generated, not typed: `src/content/rivals.json` is exported from
MapPack's October 19 scans (49 scans, 4,358 usable searches) by
`scripts/acquire-rivals.py` and `scripts/export-rivals.mjs`, read-only. A rescan
re-dates every page.

## Why, and where the motivation came from

The chain, oldest first:

1. **The Effective AEO report** (October 9, 2026;
   [`evidence/report-effective-aeo-for-local-service.md`](evidence/report-effective-aeo-for-local-service.md)).
   Assistants answer "who should I hire" by live retrieval: they shortlist from
   directories and the Google Business Profile, then read the shortlisted firms'
   own pages and cite them. Measured findings that shaped this PR: cited pages
   have titles close to the prompt's words; one indexed page per service and per
   city beats anything built only for machines (llms.txt and schema showed no
   gain); for ChatGPT the city in the text sets the place.
2. **Rob Hoffman's eleven steps** (post of October 19, 2026; the lesson in
   [`evidence/lesson-agent-readable-site.md`](evidence/lesson-agent-readable-site.md)).
   Meta's assistant recommended his client in one word after reading a page
   that asked the reader's question, gave an "it depends" answer and compared
   the client with its rival on one checkable fact. His eleven steps (the
   accessibility tree, facts in raw HTML, the question as first H2, the short
   answer, definition not slogan, text testimonials, "as of" dates, open
   robots, no broken links, semantic HTML, freshness dates) became the catalog
   action `make-site-agent-readable`.
3. **The plan** (October 19; [`evidence/plan-agent-readable-drplumbing.md`](evidence/plan-agent-readable-drplumbing.md),
   mappack PR #77). For a plumber the assistant shortlists before it reads, so
   the playbook alone cannot put Dr Plumbing on the list (6 reviews against a
   median of 175 for the firms assistants name). The plan runs the eleven steps
   on the pages an assistant reads once we are shortlisted, pairs them with the
   shortlist work (reviews, the profile, directories), and measures treated
   cities against held ones.
4. **The October 19 scans** ([`evidence/scan-tables-2026-10-19.md`](evidence/scan-tables-2026-10-19.md);
   full tables in the ticket) gave each page its rivals and told us where we
   stand: boilers in Newcastle is our strongest result (top in 48 of 85);
   every boiler rival is an HVAC or appliance firm and only one lists boilers,
   which is the checkable source for "few in the area handle boilers"; trenchless
   is close wherever we appear; chains hold plumber and drain; filtration tops
   are stores. That decided the two tiers and the writing order (Newcastle and
   Mercer Island first).
5. **JDA-408**, rewritten October 20 from those scans with Jidè's final facts
   (owners on the job, 26+ years, every kind of plumbing, quality, flat-rate
   price, active license), one PR, no drafts or placeholders. The PR body is in
   [`evidence/pr-26-body.md`](evidence/pr-26-body.md).

## What we are looking for

The baseline is recorded in [`docs/actions/jda408-baseline.md`](../../docs/actions/jda408-baseline.md):
the October 19 map ranks; Google's index of 193 of 397 pages on October 20; a
partial Search Console window (718 appearances, 5 clicks, position 47.7); and
21 assistant prompts (3 per city × ChatGPT, Google AI Mode, Meta AI, Perplexity)
not yet asked.

Four weeks after the merge, read by tier, treated cities against the 23 held
ones:

- **Search Console per page** on the MapPack Website tab: appearances, clicks
  and position for the 98 Tier A and 203 Tier B pages against the same pages
  in the held cities.
- **Map rank** from a rescan of all 49 city-service pairs ($2.65), the same
  tables as the baseline.
- **Assistant naming**: the 21 prompts asked by hand and saved as text with the
  date; which sources each assistant cites. The rival networks block AI
  crawlers; our site allows them.
- **Indexing**: how many of the 301 pages Google has indexed, from 193 of 397.

Success is the treated cities moving and the held ones not. Redmond, Issaquah
and Federal Way are read by Search Console and assistant naming only; we never
appeared in their map searches and the pages cannot change that.

## Next

The builder applies the [October 21 comment](https://github.com/jdanene/DrPlumbing/pull/26#issuecomment-6332351589):
the site's hours as two facts (regular 8 AM to 8 PM, emergency 8 PM to 8 AM);
seven page titles renamed to the scan phrases; water heater repair pages for the
eight cities. Claude reviews on the PR; Jidè merges. The merge date goes into the
dates map and sets the four-week read.
