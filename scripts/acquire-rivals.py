"""Acquire saved measurements for the seven-city experiment without buying scans.

Inputs: --mappack-root points to a current local MapPack checkout; DATABASE_URL
comes from the environment or --env-file. --date is the business-local request
day, default 2026-10-19. --output names the local acquisition JSON.
Output: Exactly 49 competitors/1 records, exact positions 1–3 counts and saved
scan timestamps. Every database transaction is read-only. Credentials stay private.
Examples: python scripts/acquire-rivals.py --help makes no database request.
Then export with node scripts/export-rivals.mjs --input acquisition.json.
"""
import argparse
from datetime import date, datetime, timezone
import json
import os
from pathlib import Path
import subprocess
import sys

CITIES = ['Bellevue', 'Newcastle', 'Renton', 'Redmond', 'Issaquah', 'Federal Way', 'Mercer Island']
SERVICES = ['plumber', 'water-heaters', 'boilers-and-radiant', 'trenchless',
            'drain-and-sewer', 'heating-and-cooling', 'water-filtration']
TIMEZONE = 'America/Los_Angeles'


def main():
    """Read the chosen existing scan set through MapPack's own comparison rules.

    Inputs: CLI paths/date and an existing database credential; no provider secret.
    Output: Complete acquisition JSON, or a concise error before replacing output.
    Examples: An absent city/service fails the 49-pair check; an older requested
    scan fails when MapPack now shows a different scan, rather than mixing dates.
    """
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--mappack-root', type=Path, required=True, help='Current MapPack checkout containing backend/app/intelligence.')
    parser.add_argument('--env-file', type=Path, help='Optional .env file containing DATABASE_URL; only that value is read.')
    parser.add_argument('--date', type=date.fromisoformat, default=date(2026, 10, 19), help='Existing scan request date in America/Los_Angeles (YYYY-MM-DD).')
    parser.add_argument('--output', type=Path, required=True, help='Local acquisition JSON for export-rivals.mjs --input.')
    args = parser.parse_args()
    if args.env_file:
        for line in args.env_file.read_text().splitlines():
            key, separator, value = line.removeprefix('export ').partition('=')
            if separator and key.strip() == 'DATABASE_URL':
                os.environ['DATABASE_URL'] = value.strip().strip('"\'')
                break
        else:
            raise ValueError('DATABASE_URL is missing from --env-file.')
    if not os.environ.get('DATABASE_URL'):
        raise ValueError('Set DATABASE_URL or supply --env-file. Its value will not be printed.')
    root = args.mappack_root.resolve()
    if not (root / 'backend/app/intelligence/competitors.py').is_file():
        raise ValueError('Use a current local MapPack checkout with app/intelligence/competitors.py.')
    sys.path.insert(0, str(root / 'backend'))
    import psycopg
    from psycopg.rows import dict_row
    from app.intelligence.competitors import get_competitors, read_scans
    from app.intelligence.comparison import competitor_rows

    commit = subprocess.run(['git', '-C', str(root), 'rev-parse', 'HEAD'], check=True,
                            capture_output=True, text=True).stdout.strip()
    with psycopg.connect(os.environ['DATABASE_URL'], autocommit=True, connect_timeout=7,
                         options='-c default_transaction_read_only=on', row_factory=dict_row) as database:
        with database.transaction():
            database.execute('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ, READ ONLY')
            rows = database.execute('''
                SELECT DISTINCT ON (series.tenant_id,series.business_id,area.name,service.service_key)
                       series.id,series.tenant_id,series.business_id,area.name AS city,
                       service.service_key,scan.id AS scan_id,scan.scheduled_at,
                       scan.started_at,scan.finished_at,
                       min(search.observed_at) AS first_observed_at,
                       max(search.observed_at) AS last_observed_at
                FROM scan_series AS series
                JOIN area ON (area.tenant_id,area.id)=(series.tenant_id,series.area_id)
                JOIN service ON (service.tenant_id,service.id)=(series.tenant_id,series.service_id)
                JOIN rank_scan AS scan ON (scan.tenant_id,scan.series_id)=(series.tenant_id,series.id)
                JOIN scan_search AS search ON (search.tenant_id,search.scan_id)=(scan.tenant_id,scan.id)
                WHERE area.name=ANY(%s) AND service.service_key=ANY(%s)
                  AND series.context->>'zoom'='13z'
                  AND series.context->>'endpoint'='v3/serp/google/maps/task_post'
                  AND (scan.scheduled_at AT TIME ZONE %s)::date=%s
                GROUP BY series.id,series.tenant_id,series.business_id,area.name,service.service_key,scan.id
                ORDER BY series.tenant_id,series.business_id,area.name,service.service_key,
                         scan.scheduled_at DESC,scan.created_at DESC,scan.id DESC
            ''', (CITIES, SERVICES, TIMEZONE, args.date)).fetchall()
    keys = {(row['city'], row['service_key']) for row in rows}
    if (len(rows) != 49 or len({(row['tenant_id'], row['business_id']) for row in rows}) != 1
            or keys != {(city, service) for city in CITIES for service in SERVICES}):
        raise ValueError('Expected exactly one business with seven cities × seven services on that date.')
    result = {'exportedAt': datetime.now(timezone.utc).isoformat(), 'source': {
        'method': 'read-only MapPack repository get_competitors, not an HTTP request',
        'repository': 'https://github.com/jdanene/mappack', 'commit': commit,
        'contract': 'competitors/1',
        'selection': f'Latest saved 13z task_post scan requested on {args.date} {TIMEZONE}, seven cities excluding Kirkland',
    }, 'responses': []}
    for row in rows:
        # The repository starts a repeatable-read, read-only transaction itself.
        response = get_competitors(row['tenant_id'], row['id']).model_dump(mode='json')
        if not response['shown_scan'] or response['shown_scan']['id'] != str(row['scan_id']):
            raise ValueError('MapPack now shows a different scan than the selected request date.')
        with psycopg.connect(os.environ['DATABASE_URL'], autocommit=True, connect_timeout=7,
                             options='-c default_transaction_read_only=on', row_factory=dict_row) as database:
            with database.transaction():
                database.execute('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ, READ ONLY')
                settings = database.execute('''
                    SELECT series.target_profile_id,business.display_name,profile.identity_attributes
                    FROM scan_series AS series
                    JOIN business ON (business.tenant_id,business.id)=(series.tenant_id,series.business_id)
                    JOIN business_profile AS profile ON (profile.tenant_id,profile.id)=(series.tenant_id,series.target_profile_id)
                    WHERE series.id=%s AND series.tenant_id=%s
                ''', (row['id'], row['tenant_id'])).fetchone()
                scans = read_scans(database, row['tenant_id'], [row['id']], TIMEZONE)[row['id']]
                rank3 = competitor_rows(scans, row['scan_id'], target_profile_id=settings['target_profile_id'],
                    business_name=settings['display_name'], identity_attributes=settings['identity_attributes'], top_n=3)
        counts = {item['listing_key']: item['top_n_count'] for item in rank3}
        for item in response['rows']:
            item['top_three_count'] = counts[item['listing_key']]
        timestamps = {key: row[key].isoformat() if row[key] else None for key in
                      ['scheduled_at', 'started_at', 'finished_at', 'first_observed_at', 'last_observed_at']}
        result['responses'].append({'citySlug': row['city'].lower().replace(' ', '-'),
            'serviceId': row['service_key'], 'timestamps': timestamps, 'response': response})
        print(len(result['responses']), row['city'], row['service_key'], flush=True)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_name(args.output.name + '.tmp')
    temporary.write_text(json.dumps(result, indent=2) + '\n')
    temporary.replace(args.output)
    print(f'Saved 49 existing comparisons to {args.output}; no scans requested.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, FileNotFoundError) as error:
        raise SystemExit(str(error)) from None
    except Exception as error:
        raise SystemExit(f'Read-only acquisition failed ({type(error).__name__}); check local dependencies, access and saved data. No credentials were printed.') from None
