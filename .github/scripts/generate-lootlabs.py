#!/usr/bin/env python3
"""Add a LootLabs option to every download in assets/data/downloads.json.

Uses the LootLabs content-locker API (same as Pepe's Portfolio generator.py).
Needs a secret token: set LOOTLABS_API_TOKEN (LootLabs panel -> Advanced tab).
Idempotent: entries that already have a LootLabs option are skipped.
Usage: LOOTLABS_API_TOKEN=... python .github/scripts/generate-lootlabs.py
"""
import json, os, sys, urllib.parse, urllib.request

PATH = 'assets/data/downloads.json'
TOKEN = os.environ.get('LOOTLABS_API_TOKEN')
if not TOKEN:
    sys.exit('Set LOOTLABS_API_TOKEN first.')


def make_link(title, url):
    q = urllib.parse.urlencode({'api_token': TOKEN, 'title': title[:30], 'url': url,
                                'tier_id': '1', 'number_of_tasks': '3', 'theme': '1'})
    with urllib.request.urlopen('https://creators.lootlabs.gg/api/public/content_locker?' + q, timeout=15) as r:
        msg = json.loads(r.read().decode()).get('message')
    if isinstance(msg, list) and msg:
        msg = msg[0]
    return msg.get('loot_url') if isinstance(msg, dict) else None


with open(PATH, encoding='utf-8') as f:
    data = json.load(f)

added = 0


def walk(node):
    global added
    if isinstance(node, dict):
        opts = node.get('options')
        if isinstance(opts, list) and opts and not any(o.get('name') == 'LootLabs' for o in opts):
            # Prefer the raw/main option; skip nothing else.
            src = next((o for o in opts if o.get('name') == 'Download'), opts[0])
            try:
                link = make_link(node.get('version', 'Glacier'), src['url'])
            except Exception as e:
                link = None
                print('  failed', node.get('version'), e)
            if link:
                opts.append({'name': 'LootLabs', 'url': link})
                added += 1
                print('  +', node.get('version'), link)
        for v in node.values():
            walk(v)
    elif isinstance(node, list):
        for v in node:
            walk(v)


walk(data)

# Launcher releases: add "loot_url" to each release asset (preserved across
# update-launcher runs by the workflow).
LAUNCHER = 'assets/data/launcher.json'
if os.path.exists(LAUNCHER):
    with open(LAUNCHER, encoding='utf-8') as f:
        rels = json.load(f)
    changed = False
    for rel in rels:
        for a in rel.get('assets', []):
            if a.get('loot_url'):
                continue
            try:
                link = make_link('Glacier Launcher ' + rel['tag_name'], a['browser_download_url'])
            except Exception as e:
                link = None
                print('  failed', a.get('name'), e)
            if link:
                a['loot_url'] = link
                changed = True
                added += 1
                print('  +', a['name'], link)
    if changed:
        with open(LAUNCHER, 'w', encoding='utf-8') as f:
            json.dump(rels, f, indent=2, ensure_ascii=False)
            f.write('
')
with open(PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write('\n')
print('Added', added, 'LootLabs link(s).')
