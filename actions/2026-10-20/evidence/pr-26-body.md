## JDA-408: seven-city agent-readable service pages

One PR for the complete website implementation. This replaces the earlier
two-PR split. No merge or production deployment has occurred.

### Content and evidence

- Update all 301 existing pages for Bellevue, Newcastle, Renton, Redmond,
  Issaquah, Federal Way and Mercer Island. Preserve their routes, photos,
  educational copy and city-specific navigation. Kirkland stays outside the
  new reading blocks.
- Add 43 final question-and-answer records. The first main H2 asks the service
  question; its direct answer stays below 100 words. Repair-or-replace guidance
  cites primary trade, manufacturer, utility and government sources.
- Render 98 Tier A named comparisons and 203 Tier B pages linked to their city
  comparison hub. Each page has a distinct measured sentence.
- Generate the comparison data from all 49 saved October 19 MapPack scans,
  containing 4,358 usable searches. Preserve scan IDs, timestamps, categories,
  ratings, review counts, exact positions 1–3 counts, first-place counts and
  leading-group membership. These are separate measures.
- Add 20 checked official-site sources and conditional reasons to choose an
  alternative. An absent Google category never becomes a claim that a rival
  lacks that service. Unchecked websites do not become rendered source links.
- Show all six Google review records on each city hub: five attributed quote
  excerpts and Orlando's rating/service tags. His record has no invented quote.
  Preserve the original names within quotations; show reviewer first names.
- Centralize Jide's final facts: owners on the job, Mehran's 26+ years of
  plumbing experience, service scope, quality workmanship and flat-rate price
  approval. Show the active license number on every page, with dated facts.
  The current six-review Google total does not replace historical scan counts.
- Record the public Google profile's verified 8 AM–8 PM daily Pacific hours,
  checked October 20. Render dated hours and seven-day opening-hours schema.

### Retrieval, dates and checks

- Link every target hub directly to its 42 service pages. Keep named AI crawler
  allow groups and `/api/` exclusions; private previews remain closed.
- Record the known October 18 cohort publication and October 20 content
  revision separately. All 397 sitemap dates reflect the shared license
  revision. Builds never invent a fresh date. If the merge occurs later,
  advance the revision record to that actual content publication date.
- Add static rendered-HTML checks for accessible names, labels, alt intent,
  native semantics, raw body word count, the 301 question/answer blocks,
  unique sentences, tier counts, review records, dates and hub links.
- Check internal page, asset and fragment targets. External failures get two
  attempts with a five-second deadline and remain warnings.
- Keep the existing visual system. Scope narrow-screen service-grid fixes to
  the seven-city reading pages; comparison tables scroll within their region.

### Reproducible data acquisition

`scripts/acquire-rivals.py` reads the existing configured MapPack database in a
read-only transaction and calls the current repository's comparison logic.
`scripts/export-rivals.mjs` validates and generates `src/content/rivals.json`.
README gives the commands and expected repository version. No paid scan ran,
no database write occurred, and no credential is committed or printed.

The provenance explicitly records repository acquisition, not an HTTP response.
The current HTTP export does not expose exact positions 1–3 counts when its
group size differs from three; that path fails closed rather than substituting
positions 1–N as share. The large JSON diff is the generated evidence record.

### Verification

- Required `npm run build` passes: 397 routes, 404 and ownership verification
  HTML. Readability passes all 398 route documents.
- Link check: 399 HTML files, 51,688 references, 60 external URLs; zero internal
  errors. Seven external endpoints warn after retry (403/500, timeout or fetch
  failure); none returned 404/410. These are not asserted to be dead links.
- `npm run lint` exits 0. Existing React Fast Refresh/effect warnings remain.
- Embedded helper examples execute in the build checks. No test suite ran,
  as the issue specifies.
- Independent review has no required findings. Impeccable detector and
  `git diff --check` pass. Browser verification covers the rendered Newcastle
  comparison, question ordering, dates and narrow-screen layout.

### October 20 review corrections

All five review points are addressed. Boiler and trenchless category counts now
exclude our listing, use the number of other leaders and state our verified
service scope. The category-absence disclaimer remains. Old MB-domain citations
are removed, comparison headings use “providers for”, confirmed dated hours
render in text and schema, and the identified boiler slogan is factual copy.
Build examples cover the rival-only denominator and service contrast. The
rendered checks retain all 43 answers under 100 words and 301 unique sentences.
The existing pending-fact fixtures now use a synthetic pending value because
hours are confirmed. No test suite ran. Independent review found no required
issues in the correction diff.

### Baseline and external follow-up

The committed indexing snapshot records 193 indexed and 204 not indexed out of
397 checked URLs on October 20. This supersedes the ticket's older 10-page
count. The actual inventory contains 30 cities, so seven treated cities leave
23 held journeys, not the older 21-city count. No city was removed to force it.

`docs/actions/jda408-baseline.md` records the measurement limits. The available
718 impressions, five clicks and 47.7 average position cover a partial 30-day
site window, not the required 60-day per-page baseline. The 21 prompts across
four assistants remain unmeasured, not zero. No assistant result is fabricated.

After actual production publication, finish the read-only baseline collection
and set the four-week comparison from that real release date. No Search Console
submission, calendar date, recurring automation or rank improvement is claimed.
The L&I account phone correction requires the account owner's authorized action;
this PR only changes website content. No profile or contractor-record mutation
was performed.

Issue: https://linear.app/jdanene39/issue/JDA-408
Plan: https://github.com/jdanene/mappack/pull/77

