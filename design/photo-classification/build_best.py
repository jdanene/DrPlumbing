"""Copy visually curated options into each reviewed category's best folder.

Inputs: catalog.json, best-selection.json and verified category JPEGs beside this
    workflow. Requires Python 3 and Pillow through build_library's validation.
Output: Byte-identical shortlist copies, ranked READMEs and best-index.html.
    Never moves originals, edits pixels, changes website mappings or deletes files.
    Raises ValueError for unsupported picks, stale files or changed receipts.
Examples: A category with no candidates gets a README-only best folder; the
    gas-heater category copies ID 132; --check verifies without writing.
"""

import argparse
import hashlib
import html
import json
from pathlib import Path
import shutil
from urllib.parse import quote

from build_library import CATALOG, DESTINATION, HERE, PROJECT, candidate_name, eligible, verify_inputs, verify_outputs

SELECTION = HERE / "best-selection.json"
RECEIPT = HERE / "best-generated-files.json"
GALLERY = HERE / "best-index.html"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".heic", ".webp", ".gif", ".tif", ".tiff", ".avif", ".svg"}


def validate_selection(catalog, selection):
    """Reject unsupported rankings before copying a photo into best.

    Inputs: Validated catalog and a selection covering exactly its category keys.
    Output: Photo-ID lookup. Raises ValueError for duplicate ranks, more than three
        picks, missing curation notes or picks outside their reviewed category.
    Examples: A gas-heater pick of 132 passes; 95 fails; an empty category passes.
    """
    categories = {c["key"] for c in catalog["categories"]}
    if selection.get("schema_version") != 1 or set(selection["categories"]) != categories:
        raise ValueError("Selection must cover exactly the reviewed categories")
    photos = {p["id"]: p for p in catalog["photos"]}
    chosen = set()
    for key, category in selection["categories"].items():
        picks = category["picks"]
        if len(picks) > 3 or len(set(picks)) != len(picks):
            raise ValueError(f"Invalid shortlist length or duplicate rank: {key}")
        candidates = {p["id"] for p in photos.values() if eligible(p) and key in p["assignments"]}
        if not set(picks) <= candidates or (candidates and not picks):
            raise ValueError(f"Unsupported or absent picks: {key}")
        if candidates - set(picks) and not category.get("cut_reason"):
            raise ValueError(f"Missing cut reason: {key}")
        chosen.update(picks)
    if {str(photo_id) for photo_id in chosen} != set(selection["photo_notes"]):
        raise ValueError("Notes must cover exactly the selected unique photos")
    for photo_id, note in selection["photo_notes"].items():
        if any(not note.get(field) for field in ("reason", "aspect", "crop", "grade")):
            raise ValueError(f"Incomplete curation note: {photo_id}")
        focal = note.get("focal_point", [])
        if len(focal) != 2 or any(not isinstance(n, (int, float)) or not 0 <= n <= 100 for n in focal):
            raise ValueError(f"Invalid focal point: {photo_id}")
    return photos


def write_category(category, selection, photos):
    """Create one ranked shortlist without cropping or moving its candidates.

    Inputs: Reviewed category, validated selection and photo lookup.
    Output: best/README.md and up to three byte-identical JPEG copies. Empty
        categories receive a README only. Raises on a missing source candidate.
    Examples: water-heaters/gas-water-heaters writes 132_IMG_5541.jpg and its rank.
    """
    key = category["key"]
    picks = selection["categories"][key]["picks"]
    folder = DESTINATION / key / "best"
    folder.mkdir(parents=True, exist_ok=True)
    lines = [f"# Best — {category['label']}", "", f"Category: `{key}`.", "",
             "Ranked alternatives for website selection. Copies retain the full frame; no crop or color grade is applied.", ""]
    if not picks:
        lines += ["No suitable, high-confidence candidate exists in this category. Keep it empty rather than use a different service's equipment.", ""]
    for rank, photo_id in enumerate(picks, 1):
        photo = photos[photo_id]
        note = selection["photo_notes"][str(photo_id)]
        name = candidate_name(photo)
        shutil.copyfile(DESTINATION / key / name, folder / name)
        lines += [f"## {rank}. {photo['subject']}", "", f"File: `{name}`.", "",
                  note["reason"], "", f"Suggested frame: {note['aspect']}. {note['crop']}", "",
                  f"Focal point: {note['focal_point'][0]}% from left, {note['focal_point'][1]}% from top.", "",
                  f"Light and color: {note['grade']}", ""]
    cut_reason = selection["categories"][key].get("cut_reason")
    if cut_reason:
        lines += ["## Other candidates", "", cut_reason, ""]
    lines += ["Rank source: `design/photo-classification/best-selection.json` at the project root. Rebuild with `python3 design/photo-classification/build_best.py`.", ""]
    (folder / "README.md").write_text("\n".join(lines))


def write_gallery(catalog, selection, photos):
    """Show each curated set together without concealing the original framing.

    Inputs: Validated catalog, selection and photo lookup.
    Output: best-index.html with all categories, full-frame previews, ranking,
        crop notes and cut-list IDs. Links open the byte-identical best copies.
    Examples: An empty service shows a coverage gap; a populated service shows
        up to three ranked alternatives and their selection reasons.
    """
    escape = html.escape
    sections = []
    for category in catalog["categories"]:
        key = category["key"]
        picks = selection["categories"][key]["picks"]
        cards = []
        for rank, photo_id in enumerate(picks, 1):
            photo = photos[photo_id]
            note = selection["photo_notes"][str(photo_id)]
            path = DESTINATION / key / "best" / candidate_name(photo)
            url = "../../" + quote(str(path.relative_to(PROJECT)))
            cards.append(f'''<article><a href="{url}"><img loading="lazy" src="{url}" alt="{escape(photo['subject'], quote=True)}"></a>
<h3>{rank}. {photo_id:03} · {escape(photo['subject'])}</h3><p>{escape(note['reason'])}</p>
<p><strong>Suggested frame: {escape(note['aspect'])}.</strong> {escape(note['crop'])}</p>
<p class="muted">{escape(note['grade'])}</p></article>''')
        cuts = [p["id"] for p in photos.values() if eligible(p) and key in p["assignments"] and p["id"] not in picks]
        cut_html = ""
        if cuts:
            cut_html = f"<details><summary>Other candidate IDs: {', '.join(f'{n:03}' for n in cuts)}</summary><p>{escape(selection['categories'][key]['cut_reason'])}</p></details>"
        gap = "" if picks else "<p class='muted'>No suitable, high-confidence candidate. No substitute from a different service.</p>"
        sections.append(f"<section><h2>{escape(category['service'])} / {escape(category['label'])}</h2><p class='muted'>{escape(key)}</p><div class='photos'>{''.join(cards)}</div>{gap}{cut_html}</section>")
    system = "".join(f"<p><strong>{escape(key.replace('_', ' ').capitalize())}:</strong> {escape(value)}</p>" for key, value in selection["visual_system"].items())
    GALLERY.write_text('''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dr Plumbing — best service photos</title><style>
*{box-sizing:border-box}body{margin:0;padding:24px;font:16px/1.55 system-ui;color:#eee8df;background:#0d191e}main{max-width:1320px;margin:auto}h1{font-size:clamp(28px,4vw,44px);line-height:1.2;margin:16px 0}h2{font-size:23px;margin:0}h3{font-size:18px;line-height:1.4}p{margin:12px 0}.intro{max-width:860px}.muted{color:#b5c0c4}section{margin-top:32px;padding-top:24px;border-top:1px solid #33474f}.photos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}article{min-width:0}img{width:100%;height:340px;object-fit:contain;background:#16262d;display:block}a{color:#e99a6d}details{margin:16px 0}summary{cursor:pointer;overflow-wrap:anywhere}img:focus,a:focus-visible,summary:focus-visible{outline:3px solid #e99a6d;outline-offset:4px}@media(max-width:850px){.photos{grid-template-columns:1fr}img{height:auto;max-height:480px}body{padding:20px}}
</style></head><body><main><h1>Best service photos</h1><div class="intro"><p>Up to three ranked alternatives per category. Full frames are shown together for review. Click a photo for its best-folder copy. The website and originals are unchanged.</p>
<p><a href="best-selection.json">Selection record</a> · <a href="index.html">All reviewed photos</a> · <a href="coverage.csv">Coverage gaps</a></p><details><summary>Visual selection rules</summary>'''
                       + system + "</details></div>" + "".join(sections) + "</main></body></html>\n")


def shortlist_paths(catalog, selection, photos):
    """List exactly the generated shortlist files for safe rebuilding and checks.

    Inputs: Validated catalog, selection and photo lookup.
    Output: Set of image paths, category READMEs and gallery path. Never includes
        originals or base candidates. Empty categories still include a README.
    Examples: A single-pick category contributes one image and one README.
    """
    return ({DESTINATION / key / "best" / candidate_name(photos[photo_id])
             for key, category in selection["categories"].items() for photo_id in category["picks"]}
            | {DESTINATION / c["key"] / "best/README.md" for c in catalog["categories"]}
            | {GALLERY})


def verify_best(catalog, selection, photos):
    """Verify complete best folders and their byte-identical source relationships.

    Inputs: Validated catalog, selection and photo lookup; materialized shortlist.
    Output: Folder, image and unique-pick counts. Raises for missing, changed or
        unexpected files, stale selection receipts or images in nested folders.
    Examples: A renamed extra JPEG fails; all 43 README-only/populated folders pass
        when their contents match the manifest and recorded candidate bytes.
    """
    expected = shortlist_paths(catalog, selection, photos)
    receipt = json.loads(RECEIPT.read_text())
    if receipt["selection_sha256"] != hashlib.sha256(SELECTION.read_bytes()).hexdigest():
        raise ValueError("Selection changed; rebuild best folders")
    if receipt["catalog_sha256"] != hashlib.sha256(CATALOG.read_bytes()).hexdigest():
        raise ValueError("Catalog changed; review the best selections again")
    if set(receipt["files"]) != {str(p.relative_to(PROJECT)) for p in expected}:
        raise ValueError("Best-file receipt differs from expected output")
    copies = set()
    for category in catalog["categories"]:
        folder = DESTINATION / category["key"] / "best"
        images = {p for p in folder.rglob("*") if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS}
        wanted = {folder / candidate_name(photos[n]) for n in selection["categories"][category["key"]]["picks"]}
        if images != wanted:
            raise ValueError(f"Missing or stale best images: {category['key']}")
        for path in wanted:
            if path.read_bytes() != (folder.parent / path.name).read_bytes():
                raise ValueError(f"Best copy differs from its category source: {path}")
        copies.update(wanted)
    for path in expected:
        if hashlib.sha256(path.read_bytes()).hexdigest() != receipt["files"][str(path.relative_to(PROJECT))]:
            raise ValueError(f"Generated best file changed: {path}")
    populated = sum(bool(c["picks"]) for c in selection["categories"].values())
    return {"best_folders": len(catalog["categories"]), "populated_folders": populated,
            "empty_folders": len(catalog["categories"]) - populated, "photo_copies": len(copies),
            "unique_selected_photos": len(selection["photo_notes"])}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Verify sources, rankings and generated best folders without writing.")
    arguments = parser.parse_args()
    catalog = json.loads(CATALOG.read_text())
    selection = json.loads(SELECTION.read_text())
    verify_inputs(catalog)
    verify_outputs(catalog)
    photos = validate_selection(catalog, selection)
    if not arguments.check:
        expected = shortlist_paths(catalog, selection, photos)
        # Preserve an old or user-added image instead of deleting it to make a
        # changed selection pass. Resolve that exact file before rebuilding.
        for category in catalog["categories"]:
            folder = DESTINATION / category["key"] / "best"
            stale = {p for p in folder.rglob("*") if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS and p not in expected}
            if stale:
                raise ValueError(f"Existing images outside the new selection: {sorted(str(p) for p in stale)}")
        for category in catalog["categories"]:
            write_category(category, selection, photos)
        write_gallery(catalog, selection, photos)
        RECEIPT.write_text(json.dumps({
            "catalog_sha256": hashlib.sha256(CATALOG.read_bytes()).hexdigest(),
            "selection_sha256": hashlib.sha256(SELECTION.read_bytes()).hexdigest(),
            "files": {str(path.relative_to(PROJECT)): hashlib.sha256(path.read_bytes()).hexdigest()
                      for path in sorted(expected)}}, indent=2) + "\n")
    print(json.dumps(verify_best(catalog, selection, photos), indent=2))
