"""Build a proposed GBP photo package from reviewed category candidates.

Inputs: catalog.json, gbp-selection.json and reviewed category JPEGs. Requires
    Python 3 and Pillow. Selection owns filenames, order and superseded picks.
Output: Fifteen byte-identical upload candidates, a README and gbp-index.html.
    Superseded copies remain in a separate subfolder. No uploads, pixel changes,
    original moves or deletion. Ignores .DS_Store; refuses other unrecognized files.
Examples: --check validates the existing package without writing; a tankless
    pick of 132 passes; mislabeling the electric heater as tankless fails.
"""

import argparse
import hashlib
import html
import json
from pathlib import Path
import shutil
from urllib.parse import quote

from PIL import Image

from build_library import CATALOG, DESTINATION, HERE, PROJECT, candidate_name, eligible, verify_inputs, verify_outputs

MANIFEST = HERE / "gbp-selection.json"
OUTPUT = PROJECT / "public/service-photos/selected/google-business-profile"
GALLERY = HERE / "gbp-index.html"
FINDER_METADATA_FILENAME = ".DS_Store"


def photo_files(catalog, selection):
    """Resolve supported picks and reject changes to the reviewed classifications.

    Inputs: Validated catalog and GBP selection.
    Output: Ordered (record, source, destination) triples. Raises ValueError for
        unsupported categories, missing picks, duplicate photos or unsafe names.
    Examples: Fifteen unique eligible picks pass; repeating 132 fails; assigning
        95 to gas-water-heaters fails even when the filename looks correct.
    """
    photos = {p["id"]: p for p in catalog["photos"]}
    records = selection["photos"]
    if selection["schema_version"] != 1 or len(records) != 15:
        raise ValueError("GBP package must contain exactly 15 photos")
    if len({p["id"] for p in records}) != 15 or len({p["file"] for p in records}) != 15:
        raise ValueError("GBP picks and filenames must be unique")
    files = []
    for order, record in enumerate(records, 1):
        photo = photos[record["id"]]
        key = record["category"]
        name = record["file"]
        if not eligible(photo) or key not in photo["assignments"]:
            raise ValueError(f"Unsupported subject assignment: {record['id']} / {key}")
        if record["order"] != order or Path(name).name != name or not name.startswith(f"{order:02}_") or Path(name).suffix != ".jpg":
            raise ValueError(f"Unsafe filename or incorrect order: {name}")
        source = DESTINATION / key / candidate_name(photo)
        files.append((record, source, OUTPUT / name))
    return files


def superseded_files(catalog, selection):
    """Resolve retained old picks outside the current upload set.

    Inputs: Validated catalog and declared superseded records in the manifest.
    Output: (record, reviewed source, archive destination) triples. Raises
        ValueError for unsupported subjects, unsafe paths or duplicate files.
    Examples: ID 14 archived under superseded passes; ../14.jpg fails; an
        undeclared old JPEG remains an unexpected file and stops the build.
    """
    photos = {p["id"]: p for p in catalog["photos"]}
    files = []
    for record in selection.get("superseded_photos", []):
        photo = photos[record["id"]]
        key = record["category"]
        name = record["file"]
        archive = Path(record["archived_file"])
        if not eligible(photo) or key not in photo["assignments"]:
            raise ValueError(f"Unsupported superseded subject: {record['id']} / {key}")
        if Path(name).name != name or Path(name).suffix != ".jpg" or archive.parts != ("superseded", name):
            raise ValueError(f"Unsafe superseded path: {archive}")
        files.append((record, DESTINATION / key / candidate_name(photo), OUTPUT / archive))
    if len({destination for _, _, destination in files}) != len(files):
        raise ValueError("Superseded filenames must be unique")
    return files


def verify_package(files, superseded):
    """Check copy provenance, exact count and Google's technical photo limits.

    Inputs: Resolved current and superseded triples and the local package.
    Output: Per-image source hash, JPEG size and dimensions. Raises ValueError
        for stale files, changed bytes, unsupported format or undersized images.
    Examples: A 1200 by 1600 JPEG below 5 MB passes; an extra JPEG fails; a
        differently cropped copy fails because its bytes differ from the source.
    """
    expected = {destination for _, _, destination in files + superseded} | {OUTPUT / "README.md"}
    actual = {p for p in OUTPUT.rglob("*") if p.is_file() and p.name != FINDER_METADATA_FILENAME}
    if actual != expected:
        raise ValueError(f"GBP folder has missing or unexpected files: {actual ^ expected}")
    for _, source, destination in superseded:
        if destination.read_bytes() != source.read_bytes():
            raise ValueError(f"Superseded copy differs from its source: {destination}")
    report = []
    hashes = set()
    for record, source, destination in files:
        data = source.read_bytes()
        if destination.read_bytes() != data:
            raise ValueError(f"GBP copy differs from its source: {destination}")
        digest = hashlib.sha256(data).hexdigest()
        hashes.add(digest)
        with Image.open(destination) as image:
            width, height = image.size
            if image.format != "JPEG" or min(width, height) < 720 or not 10_000 <= len(data) <= 5_000_000:
                raise ValueError(f"Image misses GBP format, size or recommended resolution: {destination}")
            if image.getexif():
                raise ValueError(f"Unexpected EXIF metadata: {destination}")
            image.verify()
        report.append({"order": record["order"], "id": record["id"], "sha256": digest,
                       "bytes": len(data), "width": width, "height": height})
    if len(hashes) != 15:
        raise ValueError("GBP package contains identical image bytes under different IDs")
    return report


def build_package(selection, files, superseded):
    """Copy selected bytes and generate review files from one selection record.

    Inputs: GBP manifest and validated current and superseded triples. An
        existing folder may contain only declared picks and its generated README.
    Output: Fifteen copies, README and full-frame HTML review gallery. Refuses
        stale or user-added files instead of deleting them. Moves declared old
        copies to superseded after checking their source bytes. Edits no pixels.
    Examples: A new package copies all picks; a second build refreshes the same
        outputs; an obsolete photo filename stops the build without deletion.
    """
    expected = {destination for _, _, destination in files + superseded} | {OUTPUT / "README.md"}
    old_names = {OUTPUT / record["file"] for record, _, _ in superseded}
    extras = {p for p in OUTPUT.rglob("*") if p.is_file() and p.name != FINDER_METADATA_FILENAME} - expected - old_names
    if extras:
        raise ValueError(f"Preserve and resolve these existing files before rebuilding: {extras}")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for record, source, destination in superseded:
        old_copy = OUTPUT / record["file"]
        for existing in (old_copy, destination):
            if existing.exists() and existing.read_bytes() != source.read_bytes():
                raise ValueError(f"Preserve this changed superseded copy: {existing}")
        destination.parent.mkdir(parents=True, exist_ok=True)
        if old_copy.exists():
            old_copy.rename(destination)
        elif not destination.exists():
            shutil.copyfile(source, destination)
    lines = ["# Google Business Profile — 15 proposed photos", "",
             "Local review package. Nothing has been uploaded. Full-frame JPEGs retain the reviewed source bytes.", "",
             "Use only the 15 numbered JPEGs at this folder's top level. The superseded subfolder preserves rejected earlier picks; do not upload those.", "",
             "Numbers express proposed review order, not Google's public display order. Photo 01 is the proposed cover; Google may choose another first image.", "",
             "Source: `design/photo-classification/gbp-selection.json` at the project root.", "",
             "Rebuild: `python3 design/photo-classification/build_gbp.py`.", "",
             "Verify without writing: `python3 design/photo-classification/build_gbp.py --check`.", ""]
    cards = []
    escape = html.escape
    for record, source, destination in files:
        shutil.copyfile(source, destination)
        # Prove the first copy before materializing the rest of the set.
        if destination.read_bytes() != source.read_bytes():
            raise ValueError(f"Copy verification failed: {destination}")
        lines += [f"## {record['order']:02}. {record['label']}", "",
                  f"File: `{record['file']}`. Reviewed image ID: {record['id']:03}.", "",
                  record["reason"], "", record["frame_note"], ""]
        url = "../../" + quote(str(destination.relative_to(PROJECT)))
        cards.append(f'''<article><a href="{url}"><img src="{url}" loading="lazy" alt="{escape(record['label'], quote=True)}"></a>
<h2>{record['order']:02}. {escape(record['label'])}</h2><p class="muted">{escape(record['role'])} · ID {record['id']:03}</p>
<p>{escape(record['reason'])}</p><p class="muted">{escape(record['frame_note'])}</p><p><a href="{url}">Open JPEG</a> · <a href="{escape(record['website_route'], quote=True)}">Related website service</a></p></article>''')
    for record, _, _ in superseded:
        lines += ["## Superseded — exclude from uploads", "",
                  f"File: `{record['archived_file']}`. Reviewed image ID: {record['id']:03}.", "",
                  record["reason"], ""]
    (OUTPUT / "README.md").write_text("\n".join(lines))
    sources = " · ".join(f'<a href="{escape(source["url"], quote=True)}">{escape(source["title"])}</a>' for source in selection["sources"])
    gaps = "".join(f"<li>{escape(gap)}</li>" for gap in selection["coverage_gaps"])
    rules = "".join(f"<p><strong>{escape(key.capitalize())}:</strong> {escape(value)}</p>" for key, value in selection["visual_system"].items())
    GALLERY.write_text('''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dr Plumbing — Google Business Profile photo selection</title><style>
*{box-sizing:border-box}body{margin:0;padding:24px;color:#eee8df;background:#0d191e;font:16px/1.55 system-ui}main{max-width:1320px;margin:auto}h1{font-size:clamp(28px,4vw,44px);line-height:1.2}h2{font-size:18px;line-height:1.35}.intro{max-width:900px}.photos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px;margin:32px 0}article{min-width:0}img{width:100%;height:360px;object-fit:contain;background:#16262d;display:block}.muted{color:#b5c0c4}a{color:#e99a6d}a:focus-visible,summary:focus-visible{outline:3px solid #e99a6d;outline-offset:4px}summary{cursor:pointer}section{border-top:1px solid #33474f;padding-top:16px}li{margin:10px 0}@media(max-width:850px){.photos{grid-template-columns:1fr}img{height:auto;max-height:520px}body{padding:20px}}
</style></head><body><main><h1>15 proposed Google Business Profile photos</h1><div class="intro"><p>Real people, priority work and finished home fixtures. Full frames are shown together; click a photo for its upload-ready JPEG. Nothing has been uploaded.</p>
<p><a href="gbp-selection.json">Selection record</a> · <a href="best-index.html">Service shortlists</a></p><p>01 is the proposed cover. These numbers organize the review package; Google controls the public display order.</p><details><summary>Visual selection rules</summary>'''
                       + rules + '</details></div><div class="photos">' + "".join(cards)
                       + f"</div><section><h2>Photo gaps</h2><ul>{gaps}</ul><p>{sources}</p></section></main></body></html>\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Verify without copying or rewriting outputs.")
    arguments = parser.parse_args()
    catalog = json.loads(CATALOG.read_text())
    selection = json.loads(MANIFEST.read_text())
    verify_inputs(catalog)
    verify_outputs(catalog)
    files = photo_files(catalog, selection)
    superseded = superseded_files(catalog, selection)
    if not arguments.check:
        build_package(selection, files, superseded)
    print(json.dumps({"count": 15, "superseded_count": len(superseded), "unchanged_source_bytes": True,
                      "photos": verify_package(files, superseded)}, indent=2))
