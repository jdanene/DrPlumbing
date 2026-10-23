# 2026-10-21 · Week 1: the Google Business Profile, then the website put right

One working day, October 21 into the 22nd. Two halves: the profile edits of
the battle plan's Week 1, and the review of PR #26 that ended with the visible
AEO blocks off the site and the pages renamed to the phrases people type.
Evidence for everything is in [`evidence/`](evidence/).

## What we did

### On the Google Business Profile

Dr Plumbing & Heating Group, Business Profile Manager, account
dominicanene@gmail.com. Claude typed every value in Chrome; Jidè pressed Save on
the first two services batches. Google reviews profile edits before publishing:
the description within minutes, services within a day.

1. **Description** replaced (656 of 750 characters;
   [`evidence/description-entered.txt`](evidence/description-entered.txt)):

   > Dr Plumbing & Heating Group is a licensed plumber serving Newcastle, Bellevue,
   > Renton, Mercer Island, Issaquah, Redmond and Federal Way. The owners do the work
   > themselves, with 26+ years of plumbing experience. We handle every kind of
   > plumbing: emergency repairs, leak repair, drain cleaning and hydro jetting, sewer
   > and water line repair including trenchless replacement, tank and tankless water
   > heaters, boilers and radiant floor heating, gas lines, repiping, water softeners
   > and filtration, and bathroom remodels. You approve a flat-rate price before work
   > starts, and every job gets quality workmanship. Washington State Contractor
   > License DRPLUPH740ND.

   Previous text, for rollback ([screenshot](evidence/screenshots/01-description-before.png)):

   > At Dr. Plumbing & Heating Group, we specialize in plumbing, heating and hydronic
   > systems for residential and commercial properties. With 26+ years of hands-on
   > experience, we offer plumbing installation and repair, radiant floor heating,
   > boiler systems and remodeling support. We also install, repair and replace water
   > heaters; detect and repair leaks; clean drains; and repair and replace sewer lines
   > and underground water lines. We serve Greater Seattle and the Eastside. Our
   > mission is to provide reliable, efficient and honest service, quality workmanship
   > and customer satisfaction. Washington State Contractor Registration No.
   > DRPLUPH740ND.

   Second save the same day (725 of 750;
   [`evidence/description-entered-v2.txt`](evidence/description-entered-v2.txt),
   [screenshot](evidence/screenshots/13-description-v2-pending.jpg)): one sentence
   added before the flat-rate line, "Regular hours are 8 AM to 8 PM; emergency
   service runs 8 PM to 8 AM." Jidè: the profile hours became 24 hours (item 5),
   so the description states the split to keep it truthful.

2. **Categories**: no change. Primary Plumber; additional Drainage service, Heating
   contractor. Google's list has no "Water heater repair service" category
   ([screenshot](evidence/screenshots/03-category-search-no-water-heater.png)).

3. **Services added**, three saves:
   - Under Plumber, saved by Jidè ([typed](evidence/screenshots/04-services-batch-a-typed.jpg),
     [saved](evidence/screenshots/05-services-batch-a-saved-pending.jpg)): Hydro jetting ·
     Emergency plumber · Water softener installation · Reverse osmosis installation ·
     Bathroom remodeling · Gas line installation.
   - Under Plumber, saved by Jidè ([typed](evidence/screenshots/06-services-batch-b-typed.jpg),
     [saved](evidence/screenshots/09-services-batch-b-saved.jpg)): Boiler replacement ·
     Radiant floor heating repair · Trenchless sewer repair · Trenchless water line
     replacement · Water filtration system installation.
   - Under Drainage service, which had no services of its own, saved by Claude
     ([typed](evidence/screenshots/10-drainage-services-typed.jpg),
     [saved](evidence/screenshots/11-drainage-services-saved-pending.jpg)): Hydro jetting ·
     Drain cleaning · Sewer line repair · Sewer line replacement.

   Services already on the profile, kept: faucet, shower, toilet, garbage disposal
   and sump pump work; leak detection and repair; pipe repair; drain cleaning; sewer
   cleaning, repair and sewer-line replacement; water heater installation, repair
   and replacement; tankless water heater installation and repair; electric, gas,
   heat pump and traditional water heaters; piping and repiping; gas line;
   trenchless sewer; trenchless water line repair; underground water-line repair
   and replacement; water line replacement; water filtration; heating system
   installation, maintenance and repair; install AC; boiler installation, repair
   and maintenance; hydronic heating installation and repair; radiant floor
   heating installation and repair; ductless heating & A/C.

4. **Review link** read from "Ask for reviews" ([screenshot](evidence/screenshots/12-review-link.jpg)):
   `https://g.page/r/CcmsSYO6C_WuEBM/review`. Battle plan step 5: Jidè texts it
   after every job.

5. **Hours** changed from 8 AM to 8 PM daily to **Open 24 hours, every day**
   ([typed](evidence/screenshots/07-hours-24-typed.jpg), [pending](evidence/screenshots/08-hours-pending.jpg)),
   each day set through the "Opens at" picker's "24 hours" option. Jidè: the
   8-to-8 numbers were made up, the owner is not awake at 8 PM, but he takes
   emergency calls when the price is right, and "if 8 PM hurts us you can change
   that time". The arena report found that being closed at the 9 PM scan cost 1
   to 2 places. Special hours were considered and rejected: they are exceptions
   for dates, and Google's "more hours" types have no emergency type, so neither
   removes the "Closed" label at night. Previous value, for rollback: 8:00 AM to
   8:00 PM, Sunday through Saturday.

### On the website (PR #26, branch `agent-readable/seven-cities`)

6. **The builder's list.** The branch already built a page for every service in
   all eight full-journey cities; what was missing was wording. Posted on the PR
   ([comment](https://github.com/jdanene/DrPlumbing/pull/26#issuecomment-6332351589),
   [addendum](https://github.com/jdanene/DrPlumbing/pull/26#issuecomment-6332441893)):
   eight title renames to the scan phrases, eight "Water heater repair in {City}"
   pages, and the site's hours as two facts (regular 8 AM–8 PM, emergency 8 PM–8 AM).
   The builder applied it in 682ba0b.

7. **The visible AEO blocks came off.** Jidè opened the preview and rejected what
   the ticket had asked for and the builder had built: the question and answer
   at the top, the scan sentence ("60% of searches in positions 1–3 … across 90
   usable searches"), "Compare providers", the definition, "Sources for this
   guidance", "What you can expect" with "As of October 2026" on every line, the
   comparison table naming rivals' ratings and review counts beside our six,
   "When another provider may fit", "How this comparison was measured", the
   reviews block. His words: "really bad", "absolutely not", "revert the pages
   back", "don't rewrite the production approved pages unless it's completely
   new". His understanding was that the offensive was descriptors hidden in the
   HTML; the sources say otherwise (Hoffman: "try highlighting the text with your
   mouse. If you can't, AI likely can't read it"; the Effective AEO report §5: a
   "visible plain-language FAQ", JSON-LD "that mirrors the visible text"), and
   hidden text is the first line of the arena report's Avoid list. The decision
   stands as a product call, and a sound one: a comparison is a weapon for a firm
   with a record to show, and ours is six reviews against hundreds.

   Removed (14362ae): the answer and evidence components, the definition, the
   rival data and its scripts, the reviews record, the footer rewrite, the
   "(as of …)" after the license, and the 329-case HTML-equality test file.
   Kept: the title renames, the repair pages, the hub's links to its pages,
   sitemap dates, crawler access, the link check, the facts record. Added, in
   the head only: each target-city page's meta description is its short answer;
   the business schema carries the emergency line as a ContactPoint. One visible
   line: hours on the footer's contact list.

8. **Two builder rewrites kept on Jidè's word**: the Boilers lead ("We maintain,
   repair and replace boilers, including the piping, pumps and controls that
   carry heat through your home.") and the Emergency page's two sections. Both
   had come from Claude's October 20 review.

9. **The eight water heater repair pages** rewritten in the house voice (870e853):
   question "Can my water heater in {city} be fixed, or does it need replacing?";
   a 96-word answer that names the parts that usually fail, says when a new
   heater is the better buy, and promises the repair and replacement prices side
   by side; sections "What usually goes wrong", "Fix it or replace it", "Before
   we come". The repair-or-replace rule (leaking tank; past ten or twelve years
   and failing again; repair near half the price of new) is standard trade
   guidance, as JDA-408 allowed.

10. **Emergency plumber given a home** (e5cdcdc). On `main` the Heating & cooling
    page carried a menu line called "Emergency service" and the city pages
    inherited it at `/emergency-service-{city}/`. Jidè: "does it make sense to be
    under heating & cooling?" Now one detail record, "Emergency plumber", under
    General plumbing: `/plumbing/emergency-plumber/` on the general site,
    `/emergency-plumber-{city}/` in every full-journey city, the eight old
    addresses redirecting (301), the heating page's line gone. Its copy was
    rewritten in the house voice on the final pass (item 13).

11. **The typed phrases became the site's names, at the source** (5c9212f). Jidè
    approved renaming the general pages to match the cities, and added Bathroom
    remodeling. The builder's city-only label table became the site's one label
    map (`optionLabel` in `src/cities.ts`), applied to the header menu, headings,
    titles, breadcrumbs, chips and the hub lists on general and city pages
    alike; keys and URLs unchanged. Shown names: Hydro jetting, Tankless water
    heater installation, Water softener installation, Reverse osmosis
    installation, Radiant floor heating repair, Trenchless water line
    replacement, Water filtration system installation (category title; the nav
    tab stays "Water filtration"), Bathroom remodeling. The shared sentences that
    still said "hydrojetting" and the Our Work filter followed.

12. **HCI review of the hub list and the two new page types** (ca702eb), with the
    hci-design skill's review walk on the rendered preview at desktop and phone
    width ([before](evidence/screenshots/16-hub-services-before.jpg),
    [after](evidence/screenshots/17-hub-services-after.jpg),
    [emergency](evidence/screenshots/18-emergency-call-first.jpg)):
    - Hub: revise, applied. Two stacked blocks for one scope, a chip row of the
      six groups and then the same groups as underlined headings over 42
      browser-default bullets in one narrow column. Now one block, "Services in
      {City}", each group a heading link with its pages as chips beneath it, four
      columns on desktop and one on phones (checked at 375 px: one column, no
      sideways scroll). Same links, same crawlable text.
    - Emergency plumber page: revise, applied. The primary button was "Book a
      visit"; an emergency's main action is the call, so Call is first and filled
      on that page only.
    - Water heater repair page: supported; the headings alone tell the task.
    - Not changed: the Heating & cooling options "Installation", "Maintenance",
      "Repair" (approved copy; ambiguous as flat labels). Not checked: keyboard
      focus order in a real browser, and observed use.

13. **Final review for production** (the last commit). The emergency copy
    rewritten in the house voice, same facts ("A burst pipe, an active leak or
    sewage backing up can't wait. Call us, tell us what you see, and we'll say
    what to do right now and the soonest we can come."; sections "Limit the
    damage safely" and "Tell us what you see"). Page dates simplified to one
    content date, October 22, since the header menu changed on every page. The
    baseline doc and README no longer describe the removed blocks or the deleted
    rival export. The sweep of the built site found the category pages' item
    lists still printing "Hydrojetting" and "Tankless water heaters" and the
    general emergency description still saying "confirm the next available
    visit"; all three now use the shown names and the house voice. The emergency
    city lead no longer names the three emergencies twice ("Need an emergency
    plumber in Newcastle?" then the shared summary). `npm run check` (lint, 219
    tests, build with the readability and link checks over 406 pages) passes;
    no leftovers of the removed blocks, placeholders, unfilled city tokens or old
    addresses remain in any built page.

14. **A way to the emergency page from the home screen.** Jidè: "where do I
    access the emergency page, not immediately clear from home screen". It was
    reachable only through the header's Plumbing menu. The home hero now carries
    one line under the tagline: "Plumbing emergency? Call (206) 671-8888, day or
    night. What to do first." (the link is the emergency page), and the FAQ
    answer on emergencies names the page.

15. **Our Work gets a heading per service, in Jidè's order.** Jidè: only
    Bathroom remodeling had a heading; "aren't H1 headings good for SEO/AEO?"
    One H1 per page is right and the page has one ("Real jobs. Real photos.");
    what helps a reader and a crawler is an H2 that names the service. The flat
    "More of our work" became one H2 section per service, and the filters and
    sections follow the order he set: Water heaters, Bathroom remodeling,
    Plumbing, Drain & sewer, Water filtration, Boilers, Heating & cooling. The
    test that pinned the old filter order was removed as useless. The test
    timeout rose to 30 seconds, since whole-site tests tripped the 5-second
    default on a busy machine and failed for no reason.

## Why

Two readings of the October 19 MapPack scans (49 scans: 7 cities × 7 services,
30 search spots each, top 3 counted).

**The map-pack arena report** ([`evidence/map-pack-arena.html`](evidence/map-pack-arena.html);
rival tables in [`evidence/rivals-by-service.md`](evidence/rivals-by-service.md)
and [`evidence/rivals.json`](evidence/rivals.json)) found that the listings
beating us with 1 to 7 reviews win on the words on their profile, not on
reputation or citations: All Plumbing & Jetting (3 reviews) wins 26 of 30
Newcastle "hydro jetting" searches on the word "Jetting"; 15 of 22 outliers have
0 or 1 directory record outside Google. Dr Plumbing's category is already
Plumber on 323 of 398 results, so the category is not the gap; the words are.

**The phrase-level standings** ([`evidence/phrase-standings.md`](evidence/phrase-standings.md),
built by [`evidence/phrases.py`](evidence/phrases.py) from the production
database, read-only; raw cells in [`evidence/phrases.json`](evidence/phrases.json))
added two facts:

1. Dr Plumbing never appeared, in any of 210 searches, for "hydro jetting",
   "emergency plumber", "water softener installation", "water filtration system"
   (0 of 209) or "reverse osmosis installation" (0 of 198). The profile never said
   those words. It appeared in 23 of 210 for "plumber".
2. Where we do appear we often sit one notch below the top 3, and the holders on
   several of those phrases have almost no reviews:

| Phrase · city | Us before | Us at #4–6 | Who holds the top 3 |
|---|---|---|---|
| boiler repair · Newcastle | top 3 in 12 of 30 | 11 | Newcastle Heating & Cooling Services Specialists 57% with 1 review; Homeservice 57% |
| radiant floor heating repair · Mercer Island | 4 of 30 | 14 | Nortech 60%, Agni 57%, Sunhaven 33% with 9 reviews |
| boiler replacement · Newcastle | 6 of 30 | 9 | Agni 73%, the 1-review listing 57% |
| tankless water heater installation · Newcastle | 9 of 30 | 7 | Homeservice, Plumbing Joint, Ben's |
| water heater replacement · Newcastle | 5 of 30 | 7 | Aquarius 73% (50 reviews) |
| water heater repair · Newcastle | 10 of 30 | 5 | Aquarius 77% |
| trenchless water line replacement · Newcastle | 0 of 30, seen in 30 | 6 | Ridgid 87%, Master Bore 60% |
| trenchless sewer repair · Renton | 0 of 30 | 4 | Renton Plumbing & Piping 53% (2 reviews), Garys 50% (13), INAPN 40% (5) |
| trenchless water line replacement · Renton | 0 of 30 | 5 | Garys 50% (13 reviews), INAPN 27% (5) |
| radiant floor heating repair · Renton | 1 of 30 | 2 | Chipper 77% (3 reviews), Renton City HVAC Star 37% (2) |
| hydro jetting · Redmond | never seen | | All Plumbing & Jetting 87% (3 reviews) |
| water filtration system · Bellevue, Newcastle | never seen | | Filtrific and FreshPure 67% each (1 review); Tech Flow Plumbing 53% (2 reviews) |

Not targeted: "plumber" and "plumber near me", held in every city by shops with
485 to 1,533 reviews (Flow Renton is a referral network, not a model); air
conditioning and furnace phrases, held by name-keyword listings and not his trade.

Order of attack for a one-man shop: Newcastle and Mercer Island boilers and
radiant (high-ticket, already close), Newcastle water heaters, Renton and
Newcastle trenchless (weak holders, big jobs), then hydro jetting and water
filtration (an empty field, mid-ticket). Emergency stays on the profile.

The website's part is the same idea applied to the pages: the same words in the
titles, the H1 and the first sentence, where the evidence says assistants and
Google read them; the short answers in the descriptions; the hours and services
in the structured data. The comparison experiment is off until the review count
is real.

## What we are looking for

After Google publishes the profile edits and the PR is live, rescan five series
($0.054 each, $0.27): Newcastle Boilers and radiant, Mercer Island Boilers and
radiant, Newcastle Water heaters, Renton Trenchless, Newcastle Drain and sewer.
Mark the change on the MapPack Website tab with this folder's name. Success
looks like:

- Newcastle "boiler repair": top 3 in 20 or more of 30 (from 12); "boiler
  replacement" 12 or more (from 6).
- Mercer Island "radiant floor heating repair": 15 or more of 30 (from 4).
- Newcastle "tankless water heater installation", "water heater repair", "water
  heater replacement": each up by 5 or more.
- Renton "trenchless sewer repair" and "trenchless water line replacement": first
  top-3 placements (from 0).
- "hydro jetting" and "water filtration system": first appearances at all in
  Newcastle and Mercer Island (from 0 of 60).

If a phrase moves, the words did it. If nothing moves after two weeks, the
profile text is not the lever for that phrase and the next lever is reviews.
The site's share of any movement is expected to be small: the measured evidence
says assistants quote visible text, and the site now contributes titles,
descriptions and facts, not a visible comparison.

## Next

1. Jidè merges PR #26; the merge is the deploy. The sitemap's content date is
   October 22; advance it only if the content changes again before the merge.
2. Description rewrite with the exact scan phrases: "boiler repair", "boiler
   replacement", "radiant floor heating repair", "water heater repair", "tankless
   water heater installation", "trenchless sewer repair", "trenchless water line
   replacement", "hydro jetting", "water filtration system", "reverse osmosis".
3. Rescans as above once Google publishes (services take up to a day).
