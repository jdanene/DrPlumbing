# Service photo classification

The folders follow the website's service hierarchy, including all 36 subcategories.
The source is `src/content.ts`. Each service also has a `system-overview` folder for
relevant equipment whose subtype or activity the photograph does not establish.

## Open the results

- `../../public/service-photos/selected/by-service/`: categorized website candidates.
- [index.html](index.html): every unique image, evidence, quality and open questions.
- [coverage.csv](coverage.csv): photo counts and gaps by category.
- [review-questions.md](review-questions.md): unresolved equipment with photo previews.
- [catalog.json](catalog.json): source filenames, hashes, both reviews and final assignments.
- [website-assignment-audit.md](website-assignment-audit.md): existing website mappings that need correction or review.
- [best-index.html](best-index.html): ranked shortlists, compared as sets.
- [best-selection.json](best-selection.json): picks, selection reasons, crop notes and cut reasons.

Folders contain reviewed candidates. The local website uses ranked `best/` copies
and user-selected work photos through `src/projectPhotos.ts`. No production deployment occurs
when rebuilding this library.

## Working-photo selections — October 4

The first shortlist favored tidy equipment and portraits. It undervalued clear
photos of people doing the work. IDs 23, 80 and 99 were already classified as
usable; they were omitted by the aesthetic shortlist, not rejected by the
classification review.

The user selected all three. The website references their existing categorized
copies. `best/` remains a set of ranked alternatives, not a publication gate.
Website placements live in `src/projectPhotos.ts`.

| Photo | Classification | Website placement |
| --- | --- | --- |
| 99 — checking copper pipe alignment | Boilers / hydronic heating; About / on the job | Homepage owner section and Recent jobs; About work gallery; Our Work |
| 80 — working beneath the HTP heating appliance | Boilers / hydronic heating; About / on the job | Homepage Recent jobs; About work gallery; Our Work |
| 95 — Rheem tank water heater | Water heaters / electric water heaters | Homepage Recent jobs; water-heater detail page; Our Work |
| 23 — welding beside a pump assembly | About / on the job | About work gallery |
| 84 — hydronic heating system with a Weil-McLain boiler | Boilers / hydronic heating | Boilers hero |

The user chose ID 84 for the Boilers hero after comparing alternatives. It shows
the complete boiler more clearly than ID 80. The working photo remains in the
supporting galleries and GBP package. The homepage's blue-pipe installation
remains available in Our Work; the pipe-alignment photo remains beside the owner
introduction.

The homepage's Recent jobs gallery now leads with IDs 99 and 80 showing people
working, followed by the user's chosen tank water heater, ID 95. These three
photos retain their full portrait frames. Captions sit below the photos rather
than covering the tools or equipment. Bathroom, filtration and sewer examples
follow. Tankless heating, the blue-pipe plant and the radiator remain in Our Work.

The homepage keeps the existing owner portrait as the smaller inset. All three
working photos retain their full portrait frame so hands, tools and equipment
remain visible. No text covers the action. Their natural workshop lighting and
color remain unchanged; no filters or image edits were applied.

These selections add visible work to the existing finished-installation photos.
They do not change service copy or use pump color to infer a specific service.
The GBP package includes all three in its 15-photo set. Its current choices and
replacement reasons live in [gbp-selection.json](gbp-selection.json); replaced
copies remain in that package's `superseded/` folder.

## Website placement review — October 4

Subject accuracy comes before visual fit. A photo can contain relevant equipment
and still fail a placement when another subject dominates it.

- HVAC: replaced the sink-led bathroom image with the confirmed unit heater, ID
  149. Removed the washroom-led ventilation image. Ventilation copy remains.
  The unit-heater photo is technically relevant but lacks the presentation of a
  clean residential furnace, heat-pump or air-conditioning photo.
- Residential project gallery: uses radiator ID 86, not the industrial unit
  heater. The general project gallery retains the unit-heater example. Its
  heading now says "Real jobs. Real photos." so it does not label that technical
  project as a home. Home-gallery keys use project titles because two distinct
  examples can share a service.
- Fixtures: uses ID 186, whose basin and faucet dominate the frame.
- Boilers: uses ID 63 for the plant, ID 86 for radiators and ID 9 for circulation.
  Confirmed the circulation photo loads after scrolling on desktop and mobile.
- Other placements: reviewed the bathroom, shower, toilet, gas meter, domestic
  manifold, water-supply trench, rough-in, electric heater, tankless heater,
  sewer connection, filtration systems and work portraits. Captions describe
  visible subjects, not unsupported repairs or before-and-after claims.
- GBP: reviewed all 15 picks. ID 86 replaces the sink-led ID 14. The package keeps
  the old copy under `superseded/` and retains the other 14 candidates.

Originals remain unchanged. The replaced hydronic `best/` copy is preserved in
`public/service-photos/selected/superseded/best/boilers-hydronic-heating/`.
The underlying category candidate and fixture alternative remain available.

## Best photos

Each category has a `best/` subfolder. Its README ranks up to three photographs
and explains their useful framing. The files are byte-identical copies of the
reviewed candidates immediately above them. Originals and website mappings stay
unchanged.

The selection uses [Visual Asset Curation](https://github.com/SkillMedev/skills/blob/main/skills/visual-asset-curation/SKILL.md),
installed at `~/.codex/skills/visual-asset-curation`. It favors readable subjects,
compatible light and color, finished residential context and useful variation.
The selection record contains the visual rules and category-specific cut reasons.

Treat the picks as alternatives, not three mandatory website slots. The strongest
view ranks first. Near-identical lower-resolution versions stay outside `best/`.
Empty categories remain empty. Shared subjects can appear in several categories;
their classification comes from the catalog, not aesthetic fit.

No color grade or crop is applied. Notes suggest later framing without changing
the image, inventing a before-and-after pair or mislabeling equipment.

```sh
python3 design/photo-classification/build_best.py
python3 design/photo-classification/build_best.py --check
```

The builder checks candidate provenance before copying. Its separate receipt,
`best-generated-files.json`, binds the outputs to the selection and catalog.
The classification checker still verifies every base candidate; the best checker
verifies every shortlist copy. Both reject misplaced or changed images.

If the catalog or picks change, review the selection and rebuild. The builder
refuses stale images rather than deleting them. Move the specific obsolete copy
out of `best/` before rebuilding; keep the original candidate.

## Classification workflow

1. Hash the originals. Review one representative of each exact duplicate group.
   Preserve every original and record all duplicate filenames.
2. Read the full service hierarchy. Classify the visible equipment or work into
   the most specific supported subcategory. Do not use the mockup caption as evidence.
3. Open each photo individually. Read equipment labels at larger resolution when
   the thumbnail does not distinguish the equipment. Record visible evidence.
4. Have a second reviewer inspect each image before comparing the first assignment.
   Review subject accuracy and image quality separately.
5. Resolve disagreements from the image or a readable equipment label. If evidence
   remains inconclusive, keep the photo in `needs-review` in the catalog and gallery.
6. Copy high-confidence, usable photographs into their category folders. Leave
   unsupported categories empty. Keep screenshots, diagrams and poor project shots
   in the private review gallery, not the candidate folders.
7. Verify hashes, complete review coverage, valid category keys, generated files,
   readable image pixels and metadata removal. Choose final website photos afterward.

Three reviewers split the first pass into IDs 1–64, 65–128 and 129–190. They rotated
for the independent second pass. The catalog retains both reviews and any final
adjudication. AI review is not an owner confirmation of the job or equipment.

## Evidence rules

- A faucet supports a fixture photo. It does not establish that a leak was found.
- A trench supports excavation. It does not establish a trenchless method.
- A complete appliance does not establish repair, annual maintenance or emergency work.
- Copper pipes may carry domestic water or hydronic heating water. Inspect the circuits.
- Identify boilers, combi appliances and tankless water heaters from labels or
  circuit evidence, not cabinet shape alone.
- Filter housings do not establish their treatment media. Keep unknown media in
  `water-filtration/system-overview`.
- A clearly visible second subject may justify a second folder. The catalog keeps
  one record per unique photo. Copies in multiple folders are intentional.
- Filtration photos belong under their specific filtration types when supported.
  General Plumbing's `water-filtration-systems` category is a cross-listing, not
  evidence for an unverified filter type.
- Do not infer the person's identity, who performed the work, location, date,
  before/after pairing, or compliance from an image.

`strong` means a clear subject and useful framing. `usable` may need a later crop
or a smaller placement. `reference-only` records useful evidence but is unsuitable
for the website in its current form. No creative edits or crops occur in this pass.

## Repeat the build

Use Python 3 with Pillow and macOS `sips`:

```sh
python3 design/photo-classification/build_library.py --limit 1
python3 design/photo-classification/build_library.py
python3 design/photo-classification/build_library.py --check
```

`--limit 1` proves one record end to end. A complete build creates all folders and
indexes. `--check` reads only. The script refuses changed or unreviewed originals.
macOS image decoding must be available; a sandbox may produce blank HEIC conversions.
The script rejects blank conversions rather than accepting them.

Copies retain the full frame and orientation, have a maximum 1600-pixel long edge,
use JPEG quality 88, and omit EXIF metadata. Review previews use a 700-pixel long edge.
Names retain the original stem with a stable numeric ID.

The builder regenerates its photo copies from the originals and flags misplaced files.
`generated-files.json` records output hashes so `--check` catches altered images or indexes.
If a review changes an assignment, move that specific obsolete copy out of the
candidate folder, update the catalog, then rebuild. Do not delete source photographs.

## Design choice

Moving originals into one folder would destroy their shared provenance and force
one category onto photos with several visible subjects. This workflow keeps the
originals intact, records decisions once in the catalog, and generates section copies.
The private gallery retains uncertainty without adding review material to the site.

Two MOV files are outside this still-photo review. They remain untouched.
