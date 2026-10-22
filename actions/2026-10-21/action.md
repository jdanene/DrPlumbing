# 2026-10-21 · Google Business Profile, Week 1 of the battle plan

## What we did

Edited the Google Business Profile of Dr Plumbing & Heating Group (Business
Profile Manager, account dominicanene@gmail.com). Claude typed every value in
Chrome; Jidè pressed Save on each services batch. Google reviews profile edits
before publishing: the description "up to 10 minutes", services "up to 1 day".

1. **Description** replaced (saved by Claude; 656 of 750 characters). The text
   entered is in [`evidence/description-entered.txt`](evidence/description-entered.txt):

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

   Second save, later the same day, pending review (725 of 750 characters;
   [`evidence/description-entered-v2.txt`](evidence/description-entered-v2.txt),
   [screenshot](evidence/screenshots/13-description-v2-pending.jpg)): one sentence
   added before the flat-rate line, "Regular hours are 8 AM to 8 PM; emergency
   service runs 8 PM to 8 AM." Jidè, 2026-10-21: the profile hours became 24 hours
   (step 7), so the description states the split to keep it truthful.

2. **Categories**: no change. Primary Plumber; additional Drainage service, Heating
   contractor. "Service establishment" was already gone. Google's list has no
   "Water heater repair service" category ([screenshot](evidence/screenshots/03-category-search-no-water-heater.png)).

3. **Services, batch A**, under Plumber, saved by Jidè, pending review
   ([typed](evidence/screenshots/04-services-batch-a-typed.jpg), [saved](evidence/screenshots/05-services-batch-a-saved-pending.jpg)):
   Hydro jetting · Emergency plumber · Water softener installation · Reverse
   osmosis installation · Bathroom remodeling · Gas line installation.

4. **Services, batch B**, under Plumber, saved by Jidè, pending review
   ([typed](evidence/screenshots/06-services-batch-b-typed.jpg), [saved](evidence/screenshots/09-services-batch-b-saved.jpg)):
   Boiler replacement · Radiant floor heating repair · Trenchless sewer repair ·
   Trenchless water line replacement · Water filtration system installation.

   Services already on the profile before today, kept: faucet, shower, toilet,
   garbage disposal and sump pump work; leak detection and repair; pipe repair;
   drain cleaning; sewer cleaning, repair and sewer-line replacement; water heater
   installation, repair and replacement; tankless water heater installation and
   repair; electric, gas, heat pump and traditional water heaters; piping and
   repiping; gas line; trenchless sewer; trenchless water line repair; underground
   water-line repair and replacement; water line replacement; water filtration;
   heating system installation, maintenance and repair; install AC; boiler
   installation, repair and maintenance; hydronic heating installation and
   repair; radiant floor heating installation and repair; ductless heating & A/C.
   The Drainage service category had no services of its own.

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

## What we are looking for

After Google publishes the edits, rescan five series ($0.054 each, $0.27):
Newcastle Boilers and radiant, Mercer Island Boilers and radiant, Newcastle
Water heaters, Renton Trenchless, Newcastle Drain and sewer. Mark the change on
the MapPack Website tab with this folder's name. Success looks like:

- Newcastle "boiler repair": top 3 in 20 or more of 30 (from 12); "boiler
  replacement" 12 or more (from 6).
- Mercer Island "radiant floor heating repair": 15 or more of 30 (from 4).
- Newcastle "tankless water heater installation", "water heater repair", "water
  heater replacement": each up by 5 or more.
- Renton "trenchless sewer repair" and "trenchless water line replacement": first
  top-3 placements (from 0).
- "hydro jetting" and "water filtration system": first appearances at all in
  Newcastle and Mercer Island (from 0 of 60).

If a phrase moves, the words did it, and the next step is the matching website
page title (JDA-408). If nothing moves after two weeks, the profile text is not
the lever for that phrase and the next lever is reviews.

5. **Services, Drainage service category**, saved by Claude, pending review
   ([typed](evidence/screenshots/10-drainage-services-typed.jpg), [saved](evidence/screenshots/11-drainage-services-saved-pending.jpg)):
   Hydro jetting · Drain cleaning · Sewer line repair · Sewer line replacement.
   The category had no services of its own before today.

6. **Review link** read from "Ask for reviews" ([screenshot](evidence/screenshots/12-review-link.jpg)):
   `https://g.page/r/CcmsSYO6C_WuEBM/review`. Battle plan step 5: Jidè texts it
   after every job. No profile change.

## 7. Hours (saved by Claude, pending review)

Main hours changed from 8 AM to 8 PM daily to **Open 24 hours, every day**
([typed](evidence/screenshots/07-hours-24-typed.jpg), [pending](evidence/screenshots/08-hours-pending.jpg)).
Each day set through the "Opens at" picker's "24 hours" option; the "Describe
your opening hours" box did not apply the change.

Why: Jidè, 2026-10-21: the 8-to-8 numbers were made up, the owner is not awake
at 8 PM, but he takes emergency calls when the price is right, and "if 8 PM hurts
us you can change that time". The arena report found that being closed at the
9 PM scan cost 1 to 2 places. 24 hours makes the hours agree with the description
("emergency repairs") and the "Emergency plumber" service. Special hours were
considered and rejected: they are exceptions for dates (holidays), and Google's
"more hours" types (breakfast, delivery, pickup, senior hours) have no emergency
type, so neither removes the "Closed" label at night.

Previous value, for rollback: 8:00 AM to 8:00 PM, Sunday through Saturday.

Follow-up: the site states the split as two facts, regular 8 AM to 8 PM and
emergency 8 PM to 8 AM. Jidè: not done by Claude; posted as instructions on
[PR #26](https://github.com/jdanene/DrPlumbing/pull/26#issuecomment-6332351589).

## 8. Website pages: what exists and what the builder changes (PR #26)

Battle plan steps 6 and 7 were wrong: the PR #26 branch already builds 362
pages, a page for every service in all eight cities. What is missing is the
exact wording. Eight title patterns do not say the scan phrase (Hydrojetting /
hydro jetting; Radiant floor heating / radiant floor heating repair; Water
softeners / water softener installation; Reverse osmosis / reverse osmosis
installation; Trenchless water line repair / replacement; Tankless water
heaters / tankless water heater installation; Emergency service / emergency
plumber; Water filtration / water filtration system installation), and no "water heater repair in {City}" page exists although Newcastle
"water heater repair" is already top 3 in 10 of 30 searches. Instructions
posted as PR #26 comments (October 21, with an addendum for the eighth
rename); Claude made no code change. Unchanged on purpose: plumber, boiler
repair and replacement, trenchless sewer repair, water heater replacement,
drain cleaning, sewer line repair and replacement, Federal Way's water heater
installation, and the heating-and-cooling pages (HVAC firms own those phrases;
not his trade this quarter).

## 9. The visible reading blocks come off the site (Jidè, late October 21)

Jidè opened the PR #26 preview (`/plumber-newcastle/`) and rejected the visible
result of the AEO offensive: the question and answer block at the top, the scan
sentence ("60% of searches in positions 1–3 … across 90 usable searches"), the
"Compare providers" link, the definition paragraph, "Sources for this guidance",
"What you can expect" with "As of October 2026" on every line, the comparison
table naming rivals with their ratings and review counts beside our six, "When
another provider may fit", "How this comparison was measured", and the reviews
block. His words: "really bad", "absolutely not", "revert the pages back",
"don't rewrite the production approved pages unless it's completely new".

His understanding was that the offensive was descriptors for AI, hidden in the
HTML. The sources say otherwise (Hoffman's post: "try highlighting the text
with your mouse. If you can't, AI likely can't read it"; the Effective AEO
report §5: a "visible plain-language FAQ", JSON-LD "that mirrors the visible
text"), and hidden text is the first line of the arena report's Avoid list. The
decision stands as a product call: the pages show only the approved copy.

What Claude changed on the PR #26 branch, at Jidè's instruction ("review the pr
fix anything broken", "remove useless tests"):

- Removed from every page: `AgentReadableContent.tsx` (answer and evidence
  blocks), `BusinessDefinition.tsx`, `agentReadable.css`, the rival data
  (`rivals.json`, `rivalFacts.ts`, `acquire-rivals.py`, `export-rivals.mjs`),
  the reviews record, the footer rewrite and the "(as of …)" after the license.
- Kept, invisible or asked for: the eight title renames; the eight water heater
  repair pages (new, so they open with their question and short answer); the
  hub's list of its 42 pages; sitemap `lastmod` dates; crawler allow lines; the
  link check; the facts record with regular and emergency hours.
- Added, behind the scenes: each target-city page's meta description and
  WebPage description is its short answer (1–100 words, city filled in); the
  business schema carries the emergency line as a ContactPoint with
  hoursAvailable 20:00–08:00. One visible line: hours and the emergency hours
  on the footer's contact list.
- Tests: deleted `CityReplication.test.tsx` (329 HTML-equality cases, 253
  broken by the renames); fixed the label and count expectations in the rest;
  fixed the Our Work photo test, which had failed on `main` since `b989f6b`
  removed a duplicate bathroom photo.
- `check-readability.mjs` now checks the description and the absence of
  comparison blocks on the seven cities instead of the removed visible blocks.

What we are looking for changes with it: the site now contributes titles,
descriptions and facts, not a visible comparison. The four-week read keeps the
same instruments (Search Console per page, the $2.65 rescan, the 21 assistant
prompts, pages indexed), with the expectation written down honestly: the
measured evidence says assistants quote visible text, so the site's share of
any movement is expected to be small; the profile work above carries the
plumber-rank targets.

## Next

1. Description rewrite with the exact scan phrases: "boiler repair", "boiler
   replacement", "radiant floor heating repair", "water heater repair", "tankless
   water heater installation", "trenchless sewer repair", "trenchless water line
   replacement", "hydro jetting", "water filtration system", "reverse osmosis".
2. Builder applied the PR #26 comments (commit 682ba0b); Claude reviewed and
   reverted the visible blocks (section 9); Jidè merges.
3. Rescans as above once Google publishes (services take up to 1 day).
