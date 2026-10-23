# Making Dr Plumbing the plumber an AI assistant recommends: the plan for the seven cities

October 19, 2026. Ticket [JDA-408](https://linear.app/jdanene39/issue/JDA-408).
Lesson: [Making a site readable to AI agents](../research/agent-readable-site.md)
(Rob Hoffman, October 19). Catalog action: `make-site-agent-readable`, the lesson's eleven steps as one
action ([catalog](../action-catalog.md)). Evidence on how
assistants pick a plumber: the [Effective AEO report](../research/effective-aeo.md).

## 1. The answer

Hoffman's eleven steps make a page an assistant can read, trust and quote. For
his client, a newsletter platform, that was enough: Meta's assistant read a page
that compared the client with its rival on one checkable fact, and repeated it.

For a plumber the assistant's path has a step before that. It first shortlists
businesses from directories and the Google Business Profile, then reads the
shortlisted firms' own pages, then picks. The playbook works on the third step.
It cannot put Dr Plumbing on the shortlist, and today that is the harder
problem: Dr Plumbing has 6 Google reviews, and the businesses assistants name
have a median of 175 (§2). So this plan does two things at once:

1. **It runs the playbook on the pages an assistant will read once Dr Plumbing is
   shortlisted:** the 301 city pages for Bellevue, Newcastle, Renton, Redmond,
   Issaquah, Federal Way and Mercer Island, plus the base pages. The work is
   49 pieces of writing, not 301 (§4): one question-and-answer per service (42)
   and one comparison per city (7), poured into the one template.
2. **It pairs the playbook with the shortlist work the catalog already holds:**
   reviews (`request-reviews`), the profile (`describe-services`,
   `set-service-areas`) and the directories (`run-citation-campaign`). Without
   those, a perfect page is a perfect page nobody retrieves.

And it measures honestly: the seven cities are treated, the other 21 cities on
the areas page are held as they are, and the same numbers are read for both
after four weeks (§6). If the treated cities move and the held ones don't, the
playbook did it.

## 2. How an assistant picks a plumber, and where the playbook acts

From the Effective AEO report, measured sources, read October 9:

| Stage | What happens | Who decides it | Evidence |
|---|---|---|---|
| Retrieval | The assistant runs several searches for "plumber in Bellevue" and its variants, through Google's or Bing's index. A page must rank somewhere in the top 100 for one of them. | Ordinary indexing and local ranking | Google, December 10, 2025; 1.4 million ChatGPT prompts |
| Shortlist | It reads a directory or best-of list for the city, plus the Google Business Profile or Yelp records. Google's assistants cite the Business Profile for 94% of businesses; ChatGPT's app cites Yelp in about 80% of answers; Angi, Expertise and BBB feed the rest. | Reviews, profile completeness, directory presence | BrightLocal, 60,970 checks, August 26, 2026; Spearleaf; 8ight.AI |
| Reading | It opens the shortlisted firms' own pages and quotes what it can read. 44% of ChatGPT's citations come from the first 30% of a page. The named firms had an in-city page or address: odds ratio 14.4. | **The playbook** | Indig via CXL; Spearleaf |
| Naming | It names the firms whose pages answered the question with facts it can repeat. Businesses with under 25 reviews were named in 3.4% of answers; 25–99, 10%; 100–249, 14%. | Reviews, and **the playbook's comparison** | 8ight.AI, 2,975 businesses |

Dr Plumbing's position, from the seven city scans of October 19 (30 spots × 3
phrases each, Google Maps at 13z), with **6 reviews, 5.0 stars**:

| City | In the top | Seen in | Median position | Who holds the top (share of searches · reviews) |
|---|---|---|---|---|
| Bellevue | 0 of 88 | 13 | 13 | Homeservice Plumbers 59% · 1,533; ProMax Water Heaters 31% · 58; Steve's Plumbing 25% · 299 |
| Newcastle | 28 of 90 | 84 | 6 | Homeservice 60% · 1,533; Aquarius 59% · 50; The Plumbing Joint 43% · 485; Roto-Rooter 41% · 797 |
| Renton | 0 of 90 | 11 | 15 | Washington Water Heaters 50% · 320; Trusted Plumbing 48% · 466; The Plumbing Joint 48% · 485 |
| Redmond | 0 of 84 | 0 | none | Ballard Heating & Plumbing 42% · 107; OneCall Plumber 33% · 32; Roto-Rooter 32% · 336 |
| Issaquah | 0 of 85 | 0 | none | Noble Plumbing 92% · 142; Eastside Plumbing 54% · 97; Top Heating 44% · 71 |
| Federal Way | 0 of 89 | 0 | none | Pat's Plumbing 35% · 194; In & Out Plumbing 33% · 398; Steady Flow 29% · 210 |
| Mercer Island | 7 of 86 | 50 | 11.5 | Water Heater Doctor 63% · 126; Homeservice 62% · 1,533; Ben's Plumbing 24% · 135 |

Newcastle, the home city, is the one place Dr Plumbing is in the running. In
three cities Google never shows it at all. That is the baseline (§6).

So: the playbook is what makes the assistant pick Dr Plumbing **among the firms
it has already found**, and the comparison section is where a 6-review firm
can beat a 2,000-review chain on the one thing the assistant is asked, "who
should I call for my boiler", because the chain's page doesn't say it does
boilers and ours says why we do.

## 3. What each step does for this site

The site: 397 prerendered pages on `main`. Seven cities × 43 pages (a
`plumber-<city>` hub and 42 service pages, from `src/CityPage.tsx`), plus 98
base pages. The template puts the H1, a two-sentence lead, the city's
landmarks, the service sections and a call to action. The text is in the HTML
(1,055 words on the homepage); the elements are semantic; the photos carry
alt text; robots.txt allows every crawler.

| Step | What an assistant does with it | Dr Plumbing today | The change | Writing units |
|---|---|---|---|---|
| 1. Accessibility tree | Reads buttons, fields and images by their names; an unnamed button is a hole in the page | The two service-group menu buttons have no name; the booking form's labels are unchecked; photos are described | A script over all 397 rendered pages that fails the build on an unnamed button, an unlabelled field, an empty alt; fix the shared components | 0 |
| 2. Facts in raw HTML | Can only quote what the prerender wrote | True today | A build check: every route's HTML has at least 200 words of body text | 0 |
| 3. First H2 is the question | Matches the page to the question it was asked; the first 30% of the page is what gets quoted | First H2 is "What do you need help with?", a menu prompt, on every page | One question per service, in the words people type, with the city filled in | 42 |
| 4. "It depends" answer and comparison | Repeats the answer when it is short, concrete and checkable; prefers a page that admits when the rival is better | None | Per service: the best choice per situation in 100 words. Per city: Dr Plumbing against the top rivals MapPack found there, on checkable facts, saying when they win | 42 + 7 |
| 5. Definition, not slogan | Needs "what is it, who is it for, what does it do" to describe the business | "Your local..." lead; "A price before we start" is a fact and stays | One definition on every page, from the confirmed facts | 1 |
| 6. Testimonials in text | Quotes review text; images and widgets are invisible | 6 Google reviews, shown on the Reviews page | The reviews as text on each city hub, with first name and platform; and `request-reviews` to get past 20, then 100 | 0, plus the reviews action |
| 7. "As of" dates | Trusts a dated fact and discards a stale one | No fact carries a date | Dates from `businessFacts.ts`: hours, areas, license, years, the differences. The comparison carries the scan's date | 0 (generated) |
| 8. Robots | Can't read what robots.txt refuses | `User-agent: *` / `Allow: /` | Name the AI crawlers explicitly so nobody blocks them later | 0 |
| 9. Broken links | Stops at a dead link and marks the site down | Unchecked across 397 pages | A link checker over `dist/` in the build; fix each | 0 |
| 10. Semantic HTML | Understands `<nav>`, `<button>` as what they are | True today | The step-1 script also fails on a `<div>` doing a button's job | 0 |
| 11. Freshness | Prefers recently updated pages; checks the updated date against the content | No dates | A published and updated date per page from the content record, true to the day the unit changed; `lastmod` in the sitemap from the same record | 0 (generated) |

Forty-nine pieces of writing cover 397 pages. Everything else is template and
build work.

## 4. The writing

### The question and the answer, one per service (42)

The question is what a homeowner types into Google or asks an assistant. The
answer says "it depends", names the best choice per situation, and stops within
100 words. Example, for every city's `water-heater-replacement-<city>` page:

> **Should I repair or replace my water heater in Bellevue?**
>
> It depends on age and the repair. Under eight years old, with a failed
> element, thermostat or valve, repair: it's usually under half the cost of a
> new unit. Past ten years, or with a leaking tank, replace: a tank can't be
> patched, and a new one earns back the difference in gas or power. Between
> those, we tell you the repair price before we start, and you choose. We
> replace tank, tankless and heat-pump heaters in Bellevue; a tankless suits a
> house of four or more with a gas line, a heat pump suits a garage or
> basement install.

The age cut-offs and the gas-line rule are the owner's recommendations and go
into the content record as his, dated. The 42 questions:

- the hub, per city: "Who is a good plumber in Bellevue?"
- each service: the repair-or-replace, which-type, is-it-urgent or who-does-it
  question for that service ("Who repairs boilers in Mercer Island?", "Is a
  sewer line backup an emergency?", "Do I need a permit for a gas line in
  Renton?").

### The comparison, one per city (7)

This is the part of the playbook that moved Hoffman's client, and it is where
MapPack earns its keep: the rivals, their ratings and review counts come from
the Competitors tab after one Search this area press per city. Each rival's own
site supplies the checkable facts: what it lists as services, whether it's a
franchise, whether it names an owner, its stated hours. The section lives on the
city hub and is linked from each service page's answer. Example for Mercer
Island, from the October 19 scan; the rivals' facts marked [check] are read from
their sites before publishing:

> **Dr Plumbing & Heating or the other plumbers on Mercer Island?**
>
> Google's map showed 95 plumbers across Mercer Island on October 19, 2026;
> two hold the top spots in most searches. It depends on the job.
>
> - **Water heater only, today:** Water Heater Doctor does one thing and tops
>   63% of searches here [check: services listed]. For a straight swap, call
>   them.
> - **Boilers, radiant heat, trenchless sewer lines, remodels:** call us. We
>   are one of the few plumbers in the area who service hydronic boilers;
>   Homeservice Plumbers and Water Heater Doctor list neither [check].
> - **An emergency at 2 AM:** Roto-Rooter runs a 24-hour crew [check]; our
>   hours are [as confirmed]. Call them, then call us in the morning if the
>   fix needs doing right.
> - **Who shows up:** here it's an owner, with 26 years in the trade, as of
>   October 2026. Homeservice Plumbers dispatches employees [check].
> - **Price:** nobody on Mercer Island publishes prices, us included. We give
>   a flat-rate price before work starts; ask the others whether they do.
>
> Ratings as of October 19, 2026: Dr Plumbing 5.0 (6 reviews); Water Heater
> Doctor 5.0 (126); Homeservice Plumbers 4.9 (1,533); Ben's Plumbing 4.9
> (135); Roto-Rooter 4.6 (2,680).

Three rules hold it together. Every fact about a rival is read from the rival's
own site or Google listing and dated. The section says when the rival is the
better call. And it never claims a rival lacks something unless its site says
so; "[check]" items that can't be confirmed are dropped, not guessed.

Publishing the rival's review count beside ours (6 against 1,533) is the
honest part the assistant rewards, and it is the number `request-reviews` has
to move.

### The definition (1)

> Dr Plumbing & Heating is an owner-operated plumbing and heating company in
> Newcastle, WA, serving the Eastside and south King County since [year, as
> confirmed]: water heaters, boilers and radiant heat, drains and sewer lines,
> trenchless repair, gas lines and bathroom remodels. You get a flat-rate price
> before work starts.

## 5. What MapPack does in this plan

- **Finds the rivals.** One press per city on the Map, 90 searches each, 630 in
  all, about $0.38 of trial credit. The Competitors tab then lists, per city,
  who holds the top spots, with rating and review count. The seven presses
  are done; the table in §2 is from them.
- **Drafts the comparison.** The rivals, ratings, counts and scan date are data;
  the draft section is a template over them. A person reads each rival's site
  for the [check] facts and approves (ADR-002). This is the first action where
  MapPack's data writes most of the page, the shape JDA-320 designs.
- **Keeps it fresh.** Every new scan re-dates the comparison and its ratings,
  so the "updated" date is true and changes every month without anyone editing
  copy. That is step 11 of the playbook, automated.
- **Measures.** Search Console per page (the Website tab), map rank per area
  (the Map), near misses for the questions.

## 6. The test: seven cities treated, twenty-one held

Before any copy changes, record for every city page: appearances, clicks and
average position from Search Console (the Website tab, 60 days); map rank per
area, already recorded in §2 from the October 19 presses; and whether an assistant names Dr Plumbing for
three prompts per city ("who is a good plumber in <city>", "water heater
replacement <city>", "boiler repair <city>") asked by hand in ChatGPT, Google
AI Mode, Meta AI and Perplexity, saved as text with the date. That is 21
prompts across 4 assistants, once a week, half an hour.

Ship the seven cities. Leave the other 21 cities' pages untouched. Four weeks
after the last city page is live, read the same numbers for all 28. The result
is the change in the seven against the change in the 21. A rising number in
both means the season or Google moved; a rise in the seven alone means the
pages did. Then expand to the 21.

Two limits, stated now. Search Console lists only the searches Google shows
(rare ones are hidden), so city pages with few appearances read as nothing
either way; the assistant check is the one that answers the real question.
And the shortlist cap stays: with 6 reviews, the honest expectation for the
four-week read is appearances and near misses moving, assistant names moving
only where the comparison answers a question the chains' pages don't.

## 7. Order

1. **PR 1, readability and links, no copy:** steps 1, 2, 8, 9, 10 as build
   checks and component fixes. Small, reversible, one day.
2. **The presses:** Jidè presses the seven cities (§5). The Competitors tab
   fills.
3. **The baseline:** §6, recorded in `docs/actions/` with the date.
4. **PR 2, the content record:** 42 questions and answers, 7 comparisons with
   their [check] facts read and dated, the definition, the dates map. Each
   answer carries the owner's recommendation as his.
5. **PR 3, the template:** `CityPage.tsx` renders question, answer, comparison
   link, definition, dates; the hub renders the comparison and the reviews as
   text; the sitemap takes `lastmod` from the dates map.
6. **Four weeks:** the read, then the expansion decision.

Pull requests go to `jdanene/DrPlumbing`; Jidè merges, since a merge to `main`
publishes. A failed build check names the page and the rule. Nothing here is
paid except the seven presses.

## 8. What can go wrong

- **Thin duplicates.** 42 answers reused across 7 cities is the same text on
  seven pages. That is what the practitioner does (one answer per question),
  and Google's own rule is about pages with no value of their own, not shared
  paragraphs; the city pages already differ by landmarks, rivals and reviews.
  If Search Console's indexing report starts dropping city pages, the answer
  gets a city-specific sentence.
- **A rival claim that's wrong.** Only facts read from the rival's own site,
  dated, and nothing about price, quality or complaints. If a rival objects, the
  dated source is the answer.
- **Fake freshness.** The updated date changes only when a unit changed. A
  script that bumps dates on every build would be caught by an assistant
  comparing the date with the text, and by us.
- **The review gap.** The comparison shows it. That's the point: it tells the
  owner, and the catalog, what to fix next.
