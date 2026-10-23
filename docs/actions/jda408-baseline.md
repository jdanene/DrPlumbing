# Seven-city reading experiment: baseline

Observed October 20, 2026. Implementation: [JDA-408](https://linear.app/jdanene39/issue/JDA-408)
and [PR 26](https://github.com/jdanene/DrPlumbing/pull/26). No production change
has been published by this PR.

## Existing Google Maps observations

The rival export built for this PR (all 49 city/service pairs, 4,358 usable
searches from the saved October 19 scans) was removed from the site on
October 21 with the visible comparison blocks; the same scan tables are kept in
[`actions/2026-10-20/evidence/`](../../actions/2026-10-20/evidence/) and
[`actions/2026-10-21/evidence/`](../../actions/2026-10-21/evidence/).
No scan was bought or rerun.

The measured leading-group size and positions 1–3 share are separate quantities.
The export derives exact positions 1–3 counts from the same accepted saved rows.
Historical own review counts can be five. The Google profile's six-review total
read on October 20 is a separate observation; it does not overwrite older data.

## Search indexing

The [397-row indexing snapshot](jda408-indexing.json) comes from MapPack's
Website → Pages in Google view, read October 20. Its accepted inventory timestamp
is `2026-10-20T16:55:54Z`; each row retains its own successful check time.

| State | Pages |
| --- | ---: |
| Indexed | 193 |
| Not indexed | 204 |
| Unchecked | 0 |

This supersedes the issue's earlier 10-page count. No indexing requests were
submitted. All 301 target-city pages receive the shared implementation in the
same change, including pages already indexed.

The live content record contains 30 served cities, not the issue's older 28-city
description. Seven are treated, leaving 23 held city journeys, including
Kirkland's existing detailed journey. No city was deleted to force the older
21-city control count.

What the seven target journeys carry after October 21 is in the head, not the
copy: each page's meta description is its short answer, and the business schema
holds the hours and the emergency line. Jidè removed the visible question,
comparison, review and dated-fact blocks on October 21 (see
[`actions/2026-10-21/action.md`](../../actions/2026-10-21/action.md)). The
October 21 additions are eight water heater repair pages and, on October 22,
the Emergency plumber page under General plumbing, bringing the build to 406
routes. The October 20 indexing snapshot remains 397 historical observations;
no indexing status has been invented for the new routes.

## Search performance and assistant naming

The initial Website view showed September 20–October 19: 718 impressions,
5 clicks and average position 47.7, with only 8 of 30 days present. These are
partial 30-day site totals, not a 60-day per-page baseline. Changing the From
field did not change the displayed window. Do not use these totals as the
required 60-day measurement or as city-page performance.

The 21 prompts across ChatGPT, Google AI Mode, Meta AI and Perplexity have not
been collected. No results are recorded as zero or as a failure to name the
business. The baseline remains unmeasured for those channels.

## After publication

Jide controls the merge and production release. Update the content revision
date if the actual merge occurs after the recorded October 20 revision.
The four-week comparison begins from the actual production publication date,
not this branch date. No calendar date or automation has been guessed before
publication. The measurement compares the seven target cities by Tier A and
Tier B with the held cities; Redmond, Issaquah and Federal Way use Search
Console and assistant naming rather than a claimed map-rank improvement.

No L&I account changes, Search Console submissions, profile mutations or paid
rescans were performed. The old L&I phone number needs the account owner's
authorized update; it is not changed by website code.
