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

   No 24/7 claim. Jidè, 2026-10-21: it is a one-man business; he takes emergency
   calls when the price is right, but is not awake at 8 PM.

2. **Categories**: no change. Primary Plumber; additional Drainage service, Heating
   contractor. "Service establishment" was already gone. Google's list has no
   "Water heater repair service" category ([screenshot](evidence/screenshots/03-category-search-no-water-heater.png)).

3. **Services, batch A**, under Plumber, saved by Jidè, pending review
   ([typed](evidence/screenshots/04-services-batch-a-typed.jpg), [saved](evidence/screenshots/05-services-batch-a-saved-pending.jpg)):
   Hydro jetting · Emergency plumber · Water softener installation · Reverse
   osmosis installation · Bathroom remodeling · Gas line installation.

4. **Services, batch B**, under Plumber, typed by Claude, Save pending from Jidè
   ([typed](evidence/screenshots/06-services-batch-b-typed.jpg)):
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

## Hours (decision made, Jidè to enter)

The profile says 8 AM to 8 PM daily. Jidè, 2026-10-21: the owner made those
numbers up and is not awake at 8 PM, but takes emergency calls when the price is
right, and "if 8 PM hurts us you can change that time". The arena report found
that being closed at the 9 PM scan cost 1 to 2 places. Decision: main hours
**Open 24 hours, every day**, so the hours agree with the description and the
"Emergency plumber" service. Special hours do not apply (they are for dates), and
Google has no emergency "more hours" type for plumbers. Claude could not enter
it (the harness blocks hours changes), so Jidè enters it in Business
information → Hours: describe "Open 24 hours, every day", Apply hours, Save. The
fallback if he will not promise the night: 7 AM to 10 PM daily. The site's
`src/businessFacts.ts` copied 8-to-8 from the profile and must match whatever is
set.

## Not changed today

- Reviews link (battle plan step 5): to pull from "Ask for reviews" after the saves.

## Next

1. Jidè saves batch B.
2. Claude types the Drainage service list (Hydro jetting, Drain cleaning, Sewer
   line repair, Sewer line replacement) and a Heating contractor list (Boiler
   replacement, Radiant floor heating repair); Jidè saves each.
3. Description rewrite with the exact scan phrases: "boiler repair", "boiler
   replacement", "radiant floor heating repair", "water heater repair", "tankless
   water heater installation", "trenchless sewer repair", "trenchless water line
   replacement", "hydro jetting", "water filtration system", "reverse osmosis".
4. Rescans as above once Google publishes.
