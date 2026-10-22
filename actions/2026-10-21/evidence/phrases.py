"""Per (city, service, phrase): who holds the top 3, how strong they are, and where Dr Plumbing sits.
Reads only. Output: weak/phrases.json and a ranked markdown table on stdout.
"""
import json, os, statistics
from collections import defaultdict
import psycopg
from psycopg.rows import dict_row

CITIES = ('Mercer Island', 'Newcastle', 'Bellevue', 'Redmond', 'Issaquah', 'Federal Way', 'Renton')
US = 'Dr Plumbing'

with psycopg.connect(os.environ['DATABASE_URL_UNPOOLED'], row_factory=dict_row) as db:
    db.execute('SET default_transaction_read_only = on')
    series = db.execute("""SELECT DISTINCT ON (s.id) s.id, a.name AS city, sv.name AS service, r.id AS scan_id, r.created_at
        FROM scan_series s JOIN area a ON a.id=s.area_id JOIN service sv ON sv.id=s.service_id
        JOIN rank_scan r ON r.series_id=s.id
        WHERE a.name = ANY(%s) AND s.context->>'endpoint'='v3/serp/google/maps/task_post'
          AND EXISTS (SELECT 1 FROM scan_search x WHERE x.scan_id=r.id AND x.state IN ('ranked','unranked'))
        ORDER BY s.id, r.created_at DESC""", (list(CITIES),)).fetchall()
    cells = {}
    for s in series:
        rows = db.execute("""SELECT x.id AS search_id, ph.query_text AS phrase, r.position, r.result_attributes AS a
            FROM scan_search x
            JOIN phrase_selection_item i ON i.id=x.selection_item_id JOIN phrase ph ON ph.id=i.phrase_id
            JOIN search_result r ON r.attempt_id=x.accepted_attempt_id AND r.result_kind='organic'
            WHERE x.scan_id=%s AND x.state IN ('ranked','unranked')""", (s['scan_id'],)).fetchall()
        by_phrase = defaultdict(lambda: {'searches': set(), 'top': defaultdict(list), 'us': [], 'names': {}, 'listings': set(), 'depth': []})
        for r in rows:
            p = by_phrase[r['phrase']]
            p['searches'].add(r['search_id'])
            a = r['a']; key = a.get('cid') or a.get('place_id') or a.get('title')
            p['listings'].add(key)
            rating = a.get('rating') or {}
            p['names'][key] = (a.get('title'), rating.get('votes_count') or 0, a.get('category'))
            if r['position'] <= 3:
                p['top'][key].append(r['position'])
            if (a.get('title') or '').startswith(US):
                p['us'].append(r['position'])
        for phrase, p in by_phrase.items():
            n = len(p['searches'])
            holders = sorted(((len(v), k) for k, v in p['top'].items()), reverse=True)
            leaders = [{'name': p['names'][k][0], 'reviews': p['names'][k][1], 'category': p['names'][k][2],
                        'placements': c, 'share': round(c / n * 100)} for c, k in holders[:6]]
            us_top = sum(1 for x in p['us'] if x <= 3)
            us_near = sum(1 for x in p['us'] if 4 <= x <= 6)
            cells[(s['city'], s['service'], phrase)] = {
                'city': s['city'], 'service': s['service'], 'phrase': phrase, 'searches': n,
                'distinct_listings': len(p['listings']),
                'leaders': leaders,
                'weak_leader_slots': sum(l['placements'] for l in leaders if l['reviews'] < 20),
                'us_seen': len(p['us']), 'us_top3': us_top, 'us_4_6': us_near,
                'us_median': statistics.median(p['us']) if p['us'] else None,
            }

out = list(cells.values())
json.dump(out, open(os.path.join(os.path.dirname(__file__), 'phrases.json'), 'w'), indent=1)
print(len(out), 'phrase cells')
