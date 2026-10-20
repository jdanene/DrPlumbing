/**
 * Description: Export saved MapPack comparisons for the seven-city experiment.
 * Inputs: --input API-shaped acquisition JSON, or MAPPACK_TOKEN and MAPPACK_API_ORIGIN
 * with an existing output file whose scan series identify the 49 saved selections.
 * Output: src/content/rivals.json with provenance, never a scan or provider purchase.
 * Invalid, incomplete or unsupported measurements fail before replacing that file.
 * Examples: node scripts/export-rivals.mjs --input /private/tmp/comparisons.json
 * exports seven cities times seven services. --help explains authenticated refresh.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const cities = ['bellevue', 'newcastle', 'renton', 'redmond', 'issaquah', 'federal-way', 'mercer-island'];
const services = ['plumber', 'water-heaters', 'boilers-and-radiant', 'trenchless', 'drain-and-sewer', 'heating-and-cooling', 'water-filtration'];
const root = fileURLToPath(new URL('../', import.meta.url));

/**
 * Description: Keep rank measurements in their original units and unknowns explicit.
 * Inputs: One competitors/1 row, its usable denominator and measured top threshold.
 * Output: Public listing facts; share is a percentage of searches in positions 1–3.
 * Throws when exact top-three counts are absent rather than relabeling top-N share.
 * Examples: A top-three count of 45 in 90 searches yields share=50;
 * unknown reviews stay null; an unseen listing keeps medianPosition=null.
 */
function listing(row, searches, top) {
  const topThreeCount = row.top_three_count ?? (top === 3 ? row.top_n_count : null);
  if (!Number.isInteger(topThreeCount) || topThreeCount < 0 || topThreeCount > searches)
    throw new Error('Exact positions 1–3 counts are missing. Acquire saved rows with MapPack competitor_rows(top_n=3); top-N counts are not interchangeable.');
  return {
    listingKey: row.listing_key, name: row.title,
    share: Number((100 * topThreeCount / searches).toFixed(4)),
    topThreeCount, inTop: row.top_n_count, firstPlaceCount: row.first_count,
    seen: row.seen_count, medianPosition: row.median_position,
    reviews: row.reviews, rating: row.rating, categories: row.categories,
    website: row.website?.display ? `https://${row.website.display.replace(/^https?:\/\//, '')}` : null,
    websiteState: row.website?.state ?? 'unreadable',
    evidenceDay: row.evidence_day, stale: row.stale,
  };
}

const listingExample = listing({ title: 'Example', top_three_count: 45, categories: [],
  reviews: null, median_position: null }, 90, 4);
assert.equal(listingExample.share, 50);
assert.equal(listingExample.reviews, null);
assert.equal(listingExample.medianPosition, null);

/**
 * Description: Preserve one service's real rivals without mixing its denominator.
 * Inputs: API response, city/service keys and optional native scan timestamps.
 * Output: A dated comparison including the measured top businesses and own counts.
 * Examples: Newcastle boilers top=4 can include Dr Plumbing, leaving three rivals;
 * an absent target has seen=0 and null rating rather than invented listing metadata.
 */
export function exportComparison({ citySlug, serviceId, response, timestamps = {} }) {
  const top = response.series?.top_n;
  const scan = response.shown_scan;
  const searches = scan?.searches?.valid;
  if (response.schema_version !== 'competitors/1' || !Number.isInteger(top) || top < 1 || top > 10
      || !Number.isInteger(searches) || searches < 1 || !scan.observed_day || !Array.isArray(response.rows))
    throw new Error(`Unusable comparison: ${citySlug}/${serviceId}`);
  const ownRow = response.rows.find(row => row.is_target);
  if (!ownRow) throw new Error(`Missing target row: ${citySlug}/${serviceId}`);
  const facts = response.rows.filter(row => !row.own_listing).map(row => listing(row, searches, top));
  const leaders = facts.filter(row => row.topThreeCount > 0).sort((left, right) =>
    right.topThreeCount - left.topThreeCount || right.firstPlaceCount - left.firstPlaceCount
    || left.name.localeCompare(right.name) || left.listingKey.localeCompare(right.listingKey)).slice(0, top);
  return {
    citySlug, serviceId, seriesId: response.series.id, scanId: scan.id,
    scannedAt: scan.observed_day, requestedDay: scan.requested_day,
    requestedAt: timestamps.scheduled_at ?? null, startedAt: timestamps.started_at ?? null,
    finishedAt: timestamps.finished_at ?? null,
    firstObservedAt: timestamps.first_observed_at ?? null,
    lastObservedAt: timestamps.last_observed_at ?? null,
    top, searches, expectedSearches: scan.searches.expected,
    excludedSearches: response.excluded.length,
    businessCount: response.rows.filter(row => row.seen_count > 0).length,
    listingRows: response.rows.length,
    phrases: response.series.phrases,
    own: listing(ownRow, searches, top),
    rivals: leaders.filter(row => row.listingKey !== ownRow.listing_key),
    source: { endpoint: '/api/competitors', schemaVersion: response.schema_version,
      shareDefinition: '100 × searches with positions 1–3 / valid searches',
      topDefinition: 'MapPack first-scan measured business threshold',
      scanStatus: scan.status },
  };
}

/**
 * Description: Read existing saved comparisons with the caller's authorized token.
 * Inputs: Existing exported selections, HTTPS API origin and MAPPACK_TOKEN.
 * Output: API-shaped acquisition bundle; only GET /api/competitors is called.
 * Examples: 49 existing selections issue 49 read requests; a 401 stops with sign-in
 * guidance and never logs the credential or server response body.
 */
async function readApi(previous) {
  const origin = new URL(process.env.MAPPACK_API_ORIGIN);
  if (origin.protocol !== 'https:' || origin.username || origin.password || !process.env.MAPPACK_TOKEN)
    throw new Error('Set an HTTPS MAPPACK_API_ORIGIN and an authorized MAPPACK_TOKEN.');
  const responses = [];
  for (const selection of previous.scans) {
    const url = new URL('/api/competitors', origin);
    url.searchParams.set('series_id', selection.seriesId);
    const reply = await fetch(url, { headers: { Authorization: `Bearer ${process.env.MAPPACK_TOKEN}` },
      signal: AbortSignal.timeout(30_000), cache: 'no-store', redirect: 'error' });
    if (!reply.ok) throw new Error(`MapPack read failed (${reply.status}); verify the token and saved series.`);
    responses.push({ citySlug: selection.citySlug, serviceId: selection.serviceId, response: await reply.json() });
  }
  return { exportedAt: new Date().toISOString(), source: {
    method: 'authenticated HTTP GET', origin: origin.origin, endpoint: '/api/competitors',
  }, responses };
}

/**
 * Description: Replace the export only after all 49 city/service pairs validate.
 * Inputs: --input acquisition JSON or authorized API settings; optional --output path.
 * Output: Complete dated JSON; unknown flags or incomplete selections fail closed.
 * Examples: Kirkland never enters the seven-city export; duplicate city/service
 * pairs fail; --help performs no account request and writes no file.
 */
async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('node scripts/export-rivals.mjs --input acquisition.json [--output src/content/rivals.json]\nOr set MAPPACK_API_ORIGIN and MAPPACK_TOKEN to refresh series from the existing output.\nThe API must supply exact top_three_count for top sizes other than three; otherwise use a read-only repository acquisition. No scan is started.');
    return;
  }
  let input, output = resolve(root, 'src/content/rivals.json');
  for (let index = 0; index < args.length; index += 2) {
    if (!args[index + 1] || !['--input', '--output'].includes(args[index])) throw new Error('Use --help for export arguments.');
    if (args[index] === '--input') input = args[index + 1];
    else output = resolve(args[index + 1]);
  }
  const acquired = input ? JSON.parse(await readFile(input, 'utf8')) : await readApi(JSON.parse(await readFile(output, 'utf8')));
  if (!acquired.source || !acquired.exportedAt || !Array.isArray(acquired.responses)) throw new Error('Acquisition provenance is missing.');
  const scans = acquired.responses.map(exportComparison);
  const keys = new Set(scans.map(scan => `${scan.citySlug}/${scan.serviceId}`));
  if (scans.length !== 49 || keys.size !== 49 || cities.some(city => services.some(service => !keys.has(`${city}/${service}`))))
    throw new Error('Expected exactly seven approved cities × seven services, excluding Kirkland.');
  const result = { exportedAt: acquired.exportedAt, source: acquired.source, scans };
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`Exported ${scans.length} saved comparisons to ${output}; no scans requested.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
