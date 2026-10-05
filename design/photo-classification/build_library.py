"""Build service folders from reviewed evidence; never classify by filename.

Inputs: catalog.json beside this script, original files in public/service-photos,
    macOS sips and Pillow. Run --check to verify without changing files.
Output: JPEG candidates in selected/by-service, a private review gallery, and
    a coverage CSV. Source images and website mappings stay untouched. Raises
    ValueError if inventory, review coverage, or source hashes disagree.
Examples: --check checks every original; --limit 1 proves one copy end to end;
    a normal run builds all reviewed folders. Validation runs before any writes.
"""

import argparse
from concurrent.futures import ThreadPoolExecutor
import csv
import hashlib
import html
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

from PIL import Image, ImageOps, ImageStat

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent.parent
SOURCE = PROJECT / "public/service-photos"
DESTINATION = SOURCE / "selected/by-service"
CATALOG = HERE / "catalog.json"
FIELDS = ("subject", "assignments", "evidence", "confidence", "quality", "quality_note", "status", "question")


def eligible(photo):
    """Return whether two-reviewed evidence permits a website candidate copy.

    Inputs: A validated photo record; quality is separate from subject accuracy.
    Output: Boolean. Reference-only or uncertain images remain review material.
    Examples: high/classified/usable -> True; high/classified/reference-only -> False.
    """
    return (photo["status"] == "classified" and photo["confidence"] == "high"
            and photo["quality"] in {"strong", "usable"})


def verify_inputs(catalog):
    """Check completeness and provenance before publishing local candidate copies.

    Inputs: Reviewed catalog with taxonomy, unique photos and duplicate filenames.
    Output: None; raises ValueError for absent reviews, unknown keys, new images,
        missing originals or changed bytes. Sources are read only.
    Examples: An unreviewed new HEIC fails; an exact recorded duplicate passes.
    """
    categories = {category["key"] for category in catalog["categories"]}
    if len(categories) != len(catalog["categories"]) or any(
            Path(key).is_absolute() or ".." in Path(key).parts for key in categories):
        raise ValueError("Invalid or repeated category key")
    ids, originals, digests = set(), set(), set()
    for photo in catalog["photos"]:
        if photo["id"] in ids:
            raise ValueError(f"Repeated ID: {photo['id']}")
        ids.add(photo["id"])
        if not photo.get("primary_review") or not photo.get("second_review"):
            raise ValueError(f"Missing review: {photo['id']}")
        first, second = photo["primary_review"], photo["second_review"]
        if not all(field in first for field in FIELDS) or not first.get("evidence"):
            raise ValueError(f"Incomplete first review: {photo['id']}")
        if not all(field in second for field in ("assignments", "status", "confidence", "reason")) or not second["reason"]:
            raise ValueError(f"Incomplete second review: {photo['id']}")
        if not first.get("reviewer") or not second.get("reviewer") or first["reviewer"] == second["reviewer"]:
            raise ValueError(f"Reviewers are not independent: {photo['id']}")
        expected = {field: first[field] for field in FIELDS}
        if second.get("verdict") == "revise":
            adjudication = photo.get("adjudication", {})
            if not adjudication.get("reviewer") or not adjudication.get("reason"):
                raise ValueError(f"Unresolved disagreement: {photo['id']}")
            expected.update({field: second[field] for field in FIELDS if field in second})
            if expected["status"] != "needs-review":
                expected["question"] = ""
        elif second.get("verdict") != "agree" or any(second[field] != first[field] for field in FIELDS if field in second):
            raise ValueError(f"Invalid agreement: {photo['id']}")
        for category in catalog["categories"]:
            prefix = category.get("crossListsPrefix")
            if prefix and any(key.startswith(prefix) for key in expected["assignments"]):
                expected["assignments"] = list(dict.fromkeys([*expected["assignments"], category["key"]]))
        if any(photo[field] != expected[field] for field in FIELDS):
            raise ValueError(f"Final record differs from reviewed decision: {photo['id']}")
        if any(photo[review]["id"] != photo["id"] for review in ("primary_review", "second_review")):
            raise ValueError(f"Review ID mismatch: {photo['id']}")
        if photo["original"] not in photo["originals"]:
            raise ValueError(f"Representative missing from originals: {photo['id']}")
        if photo["sha256"] in digests or set(photo["originals"]) & originals or len(set(photo["originals"])) != len(photo["originals"]):
            raise ValueError(f"Repeated original group: {photo['id']}")
        digests.add(photo["sha256"])
        if not set(photo["assignments"]) <= categories:
            raise ValueError(f"Unknown service: {photo['id']}")
        if len(set(photo["assignments"])) != len(photo["assignments"]):
            raise ValueError(f"Repeated assignment: {photo['id']}")
        if photo["status"] not in {"classified", "needs-review", "not-for-website"}:
            raise ValueError(f"Unknown status: {photo['id']}")
        if photo["confidence"] not in {"high", "medium", "low"}:
            raise ValueError(f"Unknown confidence: {photo['id']}")
        if photo["quality"] not in {"strong", "usable", "reference-only"}:
            raise ValueError(f"Unknown quality: {photo['id']}")
        if eligible(photo) and not photo["assignments"]:
            raise ValueError(f"Candidate has no service: {photo['id']}")
        if photo["status"] == "needs-review" and not photo["question"]:
            raise ValueError(f"Review question missing: {photo['id']}")
        for name in photo["originals"]:
            if Path(name).name != name:
                raise ValueError(f"Invalid source filename: {name}")
            digest = hashlib.sha256((SOURCE / name).read_bytes()).hexdigest()
            if digest != photo["sha256"]:
                raise ValueError(f"Original changed: {name}")
            originals.add(name)
    actual = {p.name for p in SOURCE.iterdir()
              if p.is_file() and p.suffix.lower() in {".heic", ".jpg", ".jpeg", ".png"}}
    if actual != originals:
        raise ValueError(f"Inventory changed: {sorted(actual ^ originals)}")


def make_jpeg(source, target, size):
    """Create a full-frame, oriented review copy without changing the original.

    Inputs: Existing source; JPEG target; positive maximum long-edge size.
    Output: Metadata-free RGB JPEG, quality 88. Rebuilds the generated target.
        Raises if macOS decoding fails or produces a blank image.
    Examples: Portrait HEIC -> portrait JPEG; stale generated bytes are replaced.
    """
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="dr-photo-convert-") as temporary:
        intermediate = Path(temporary) / "decoded.jpg"
        subprocess.run(["sips", "-s", "format", "jpeg", "-Z", str(size),
                        str(source), "--out", str(intermediate)], check=True,
                       capture_output=True, text=True)
        with Image.open(intermediate) as raw:
            oriented = ImageOps.exif_transpose(raw).convert("RGB")
            if max(ImageStat.Stat(oriented).var) < 1:
                raise ValueError(f"Blank decoded image: {source.name}")
            clean = Image.new("RGB", oriented.size)
            clean.paste(oriented)
            clean.save(target, quality=88)


def candidate_name(photo):
    """Return a stable ID plus original stem for traceable JPEG copies.

    Inputs: Photo with numeric ID and original filename. Output: JPEG basename.
    Examples: ID 44, IMG_1446.HEIC -> 044_IMG_1446.jpg.
    """
    return f"{photo['id']:03}_{Path(photo['original']).stem}.jpg"


def materialize_photo(photo):
    """Create one review preview and its evidence-approved category copies.

    Inputs: Validated photo record. Output: Files only; converts the candidate
        once even when several visible subjects justify several folders.
    Examples: An uncertain photo gets a preview; a faucet-and-tub image may get
        two byte-identical candidate copies.
    """
    make_jpeg(SOURCE / photo["original"], HERE / "previews" / candidate_name(photo), 700)
    if not eligible(photo):
        return
    first = DESTINATION / photo["assignments"][0] / candidate_name(photo)
    make_jpeg(SOURCE / photo["original"], first, 1600)
    for key in photo["assignments"][1:]:
        target = DESTINATION / key / first.name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(first, target)


def build(catalog, limit=None):
    """Materialize reviewed assignments, empty categories, and the inspection index.

    Inputs: Validated catalog; optional photo limit for a single-case dry rollout.
    Output: Local folders and generated indexes. Does not edit website source,
        deploy, delete, or move originals. A limited run omits complete indexes.
    Examples: Unsupported hydrojetting stays empty except its explanatory README.
    """
    photos = catalog["photos"][:limit] if limit else catalog["photos"]
    with ThreadPoolExecutor(max_workers=6) as workers:
        list(workers.map(materialize_photo, photos))
    if limit:
        return
    rows = []
    for category in catalog["categories"]:
        key = category["key"]
        matches = [p for p in photos if key in p["assignments"]]
        candidates = [p for p in matches if eligible(p)]
        folder = DESTINATION / key
        folder.mkdir(parents=True, exist_ok=True)
        rows.append([key, category["label"], len(candidates), len(matches) - len(candidates)])
        lines = [f"# {category['label']}", "", category["rule"], "",
                 f"{len(candidates)} candidate photos. Classification is not a final website selection.", ""]
        if not candidates:
            lines += ["No suitable, high-confidence photo was found. Leave this category empty until the evidence supports a match.", ""]
        for photo in candidates:
            lines += [f"- `{candidate_name(photo)}` — {photo['subject']}. {photo['evidence']}"]
        lines += ["", "Source records, review questions and workflow: `design/photo-classification/catalog.json` and its README at the project root.", ""]
        (folder / "README.md").write_text("\n".join(lines))
    with (HERE / "coverage.csv").open("w", newline="") as stream:
        writer = csv.writer(stream)
        writer.writerow(["folder", "service", "candidate_photos", "reference_or_uncertain_photos"])
        writer.writerows(rows)
    questions = ["# Photos needing identification", "",
                 "These photos are not in the service candidate folders. Confirm the equipment or circuit before assigning a service.", ""]
    for photo in photos:
        if photo["status"] == "needs-review":
            questions += [f"## {photo['id']:03} — {photo['original']}", "",
                          photo["question"], "", f"![{photo['subject']}](previews/{candidate_name(photo)})", ""]
    (HERE / "review-questions.md").write_text("\n".join(questions))
    escape = html.escape
    cards = []
    for photo in photos:
        status = photo["status"]
        folders = ", ".join(photo["assignments"]) or "No service assignment"
        cards.append(f'''<article data-status="{status}">
<a href="../../public/service-photos/{escape(photo['original'], quote=True)}"><img loading="lazy" src="previews/{escape(candidate_name(photo), quote=True)}" alt="{escape(photo['subject'], quote=True)}"></a>
<h2>{photo['id']:03} · {escape(photo['subject'])}</h2>
<p><strong>{status} · {photo['confidence']} confidence · {photo['quality']}</strong></p>
<p>{escape(photo['original'])}</p><p>{escape(folders)}</p>
<p>{escape(photo['evidence'])}</p><p>{escape(photo['quality_note'])}</p>
<p class="question">{escape(photo['question'])}</p></article>''')
    document = '''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dr Plumbing — photo classification review</title><style>
body{font:16px/1.5 system-ui;margin:24px;color:#17262b;background:#f5f1e9}h1{margin-bottom:8px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}article{background:white;padding:16px;border:1px solid #ccc}img{width:100%;height:320px;object-fit:contain;background:#eee}h2{font-size:19px}p{overflow-wrap:anywhere}.question{color:#8b3813;font-weight:600}a{color:#8b3813}</style>
<h1>Service photo review</h1><p>Subject classification, not a new website selection. Original images are unchanged. Click a preview to open its source file. HEIC originals may need Preview on macOS.</p>
<p><a href="coverage.csv">Category coverage</a> · <a href="review-questions.md">Identification questions</a> · <a href="catalog.json">Full evidence and both reviews</a> · <a href="../../public/service-photos/selected/by-service/">Service folders</a></p><main>'''
    (HERE / "index.html").write_text(document + "\n".join(cards) + "</main></html>\n")
    receipt = {str(path.relative_to(PROJECT)): hashlib.sha256(path.read_bytes()).hexdigest()
               for path in generated_files(catalog)}
    (HERE / "generated-files.json").write_text(json.dumps({
        "catalog_sha256": hashlib.sha256(CATALOG.read_bytes()).hexdigest(), "files": receipt}, indent=2) + "\n")


def generated_files(catalog):
    """List the complete generated output set for provenance checks.

    Inputs: Validated catalog. Output: Set of absolute generated-file paths.
    Examples: Includes every preview, candidate, category README and review index.
    """
    return ({DESTINATION / key / candidate_name(p)
             for p in catalog["photos"] if eligible(p) for key in p["assignments"]}
            | {HERE / "previews" / candidate_name(p) for p in catalog["photos"]}
            | {DESTINATION / c["key"] / "README.md" for c in catalog["categories"]}
            | {HERE / name for name in ("index.html", "coverage.csv", "review-questions.md")})


def verify_outputs(catalog):
    """Verify generated folders contain only approved candidates with usable pixels.

    Inputs: Complete reviewed catalog. Output: Counts; raises for missing or stale
        files, missing category README, malformed JPEGs, EXIF or blank decodes.
    Examples: A misfiled leftover JPEG fails; an empty service with README passes.
    """
    expected = {DESTINATION / key / candidate_name(p)
                for p in catalog["photos"] if eligible(p) for key in p["assignments"]}
    image_extensions = {".jpg", ".jpeg", ".png", ".heic", ".webp", ".gif", ".tif", ".tiff", ".avif", ".svg"}
    # Ranked copies have their own manifest and validator. Only exact category
    # best folders are exempt; a misfiled image elsewhere still fails this check.
    best_folders = {DESTINATION / c["key"] / "best" for c in catalog["categories"]}
    actual = {p for p in DESTINATION.rglob("*") if p.is_file()
              and p.suffix.lower() in image_extensions and p.parent not in best_folders}
    if expected != actual:
        raise ValueError(f"Missing/stale copies: {sorted(str(p) for p in expected ^ actual)}")
    for category in catalog["categories"]:
        if not (DESTINATION / category["key"] / "README.md").exists():
            raise ValueError(f"Missing category: {category['key']}")
    previews = {HERE / "previews" / candidate_name(p) for p in catalog["photos"]}
    if previews != {p for p in (HERE / "previews").iterdir() if p.is_file()}:
        raise ValueError("Missing or stale review previews")
    provenance = json.loads((HERE / "generated-files.json").read_text())
    if provenance["catalog_sha256"] != hashlib.sha256(CATALOG.read_bytes()).hexdigest():
        raise ValueError("Catalog changed; rebuild the review indexes and copies")
    receipt = provenance["files"]
    paths = generated_files(catalog)
    if set(receipt) != {str(p.relative_to(PROJECT)) for p in paths}:
        raise ValueError("Generated-file receipt does not match the catalog")
    for path in paths:
        if hashlib.sha256(path.read_bytes()).hexdigest() != receipt[str(path.relative_to(PROJECT))]:
            raise ValueError(f"Generated file changed: {path}")
    for path in expected | previews:
        with Image.open(path) as image:
            image.load()
            if image.format != "JPEG" or image.getexif() or max(ImageStat.Stat(image).var) < 1:
                raise ValueError(f"Invalid image: {path}")
    return {"unique_photos": len(catalog["photos"]), "original_files": sum(len(p["originals"]) for p in catalog["photos"]),
            "categories": len(catalog["categories"]), "candidate_copies": len(expected),
            "candidate_photos": sum(eligible(p) for p in catalog["photos"]),
            "needs_review": sum(p["status"] == "needs-review" for p in catalog["photos"])}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Validate sources and complete generated output without writing.")
    parser.add_argument("--limit", type=int, help="Build only this many records to verify a first slice.")
    arguments = parser.parse_args()
    if arguments.limit is not None and arguments.limit < 1:
        parser.error("--limit must be positive")
    reviewed = json.loads(CATALOG.read_text())
    verify_inputs(reviewed)
    if not arguments.check:
        build(reviewed, arguments.limit)
    print(json.dumps(verify_outputs(reviewed) if not arguments.limit else {"tracer_photos": arguments.limit}, indent=2))
