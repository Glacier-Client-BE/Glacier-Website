"""Bundle each Glacier pack's HUD JSON UI for the config editor's preview.

Usage: python bundle-jsonui.py <pack dir> <version id> <site config dir>
Writes <config>/ui/<version>.json (every control the HUD screen uses, with comments stripped) and copies the
textures those controls reference to <config>/ui/<version>/ (with their nine-slice .json data inlined).
"""
import json, os, re, shutil, sys

PACK, VER, OUT = sys.argv[1], sys.argv[2], sys.argv[3]


def load(path):
    s = open(path, encoding='utf-8-sig').read()
    out, i, n, q = [], 0, len(s), False
    while i < n:  # strip // and /* */ comments outside strings
        c = s[i]
        if q:
            out.append(c)
            if c == '\\':
                out.append(s[i + 1]); i += 2; continue
            if c == '"':
                q = False
        elif c == '"':
            q = True; out.append(c)
        elif s.startswith('//', i):
            while i < n and s[i] != '\n':
                i += 1
            continue
        elif s.startswith('/*', i):
            j = s.find('*/', i + 2); i = (j + 2) if j >= 0 else n; continue
        else:
            out.append(c)
        i += 1
    s = re.sub(r',(\s*[}\]])', r'\1', ''.join(out))
    return json.JSONDecoder().raw_decode(s.strip())[0]


defs = {}
files = []
for root, _, fs in os.walk(os.path.join(PACK, '.glacier')):
    rel = root.replace('\\', '/')
    if '/common' in rel or '/hud_screen' in rel:
        files += [os.path.join(root, f) for f in fs if f.endswith('.json')]
for f in files:
    try:
        d = load(f)
    except Exception as e:
        print('skip', f, e); continue
    if not isinstance(d, dict):
        continue
    ns = d.pop('namespace', None)
    if ns:
        defs.setdefault(ns, {}).update(d)
cfg = load(os.path.join(PACK, 'config.json'))
cfg.pop('namespace', None)
defs.setdefault('gc', {}).update(cfg)

# Toggle / slider control names -> config variable, from the mod menu's settings controls.
toggles, sliders, radios = {}, {}, {}


def walk(o, group=None):
    if isinstance(o, dict):
        # A radio group's selected index lives in a $..._toggle_index config variable set on an ancestor.
        group = next((v for v in o.values() if isinstance(v, str) and re.fullmatch(r'\$\w+_toggle_index', v)
                      and ('"' + v + '"') in json.dumps(cfg)), group)
        tag = next((v for k, v in o.items() if k.endswith('toggle_tags') and isinstance(v, str) and v.startswith('$')), None)
        names = [v for k, v in o.items() if isinstance(v, str) and re.fullmatch(r'glacier_\w+', v) and 'name' in k]
        if tag:
            for k, v in o.items():
                if isinstance(v, str) and re.fullmatch(r'glacier_\w+', v) and 'name' in k:
                    (sliders if 'slider' in k else toggles).setdefault(v, tag)
        elif '$toggle_group_forced_index' in o and group:
            for v in names:
                radios.setdefault(v, [group, o['$toggle_group_forced_index']])
        for v in o.values():
            walk(v, group)
    elif isinstance(o, list):
        for v in o:
            walk(v, group)


for root, _, fs in os.walk(os.path.join(PACK, '.glacier')):
    for f in fs:
        if f.endswith('.json'):
            try:
                walk(load(os.path.join(root, f)))
            except Exception:
                pass

# Module id (as the config names it: $<id>_anchor) -> the control that draws it.
# Stored as a path: the top-level control, then child control names down to the one that uses the anchor.
modules = {}
config_keys = {k.split('|')[0][1:] for k in json.dumps(cfg) and re.findall(r'"(\$\w+_anchor)(?:\|default)?"', json.dumps(cfg))}


def find(body, path):
    if not isinstance(body, dict):
        return
    for k, v in body.items():
        m = re.fullmatch(r'\$(\w+)_anchor', v) if isinstance(v, str) else None
        if m and k in ('$drag_af', 'anchor_from', '$af', '$draggable_anchor', '$drag_anchor') and m.group(1) + '_anchor' in config_keys:
            modules.setdefault(m.group(1), path)
            return
    for c in body.get('controls', []) or []:
        if isinstance(c, dict):
            for ck, cv in c.items():
                find(cv, path + [ck.split('@')[0]])


for ns, items in defs.items():
    for key, body in items.items():
        find(body, [ns + '.' + key.split('@')[0]])

# Textures referenced anywhere in the bundle.
tex = set()
for v in re.findall(r'"(\.glacier/textures/[^"]+|textures/[^"]+)"', json.dumps(defs)):
    tex.add(v)
# Textures picked at runtime by an expression ('<folder>/' + name): take the whole folder.
for folder in re.findall(r"'(\.glacier/textures/[^']+/)'", json.dumps(defs)):
    d = os.path.join(PACK, folder)
    if os.path.isdir(d):
        tex.update(folder + os.path.splitext(f)[0] for f in os.listdir(d) if f.endswith('.png'))
dst = os.path.join(OUT, 'ui', VER)
os.makedirs(dst, exist_ok=True)
textures = {}
for t in sorted(tex):
    for ext in ('.png', '.jpg', '.tga'):
        src = os.path.join(PACK, t + ext)
        if os.path.exists(src):
            name = re.sub(r'[^\w.-]', '_', t.replace('.glacier/textures/', '').replace('/', '__')) + ext
            if os.path.getsize(src) > 200_000:  # menu backgrounds the HUD never draws
                continue
            shutil.copy(src, os.path.join(dst, name))
            info = {'f': name}
            if ext == '.png':
                head = open(src, 'rb').read(24)
                info['w'], info['h'] = int.from_bytes(head[16:20], 'big'), int.from_bytes(head[20:24], 'big')
            j = os.path.join(PACK, t + '.json')
            if os.path.exists(j):
                try:
                    info.update(load(j))
                except Exception:
                    pass
            textures[t] = info
            break

# Module on/off toggles named after their config switch (glacier_<id>_toggle -> $<id>).
cfg_text = json.dumps(cfg)
for name in set(re.findall(r'"source_control_name": "(glacier_\w+_toggle)"', json.dumps(defs))):
    base = name[len('glacier_'):-len('_toggle')]
    if name not in toggles and name not in radios and '"$' + base + '"' in cfg_text:
        toggles[name] = '$' + base

json.dump({'defs': defs, 'modules': modules, 'toggles': toggles, 'sliders': sliders, 'radios': radios, 'textures': textures},
          open(os.path.join(OUT, 'ui', VER + '.json'), 'w', encoding='utf-8'), separators=(',', ':'))
print(VER, 'controls', sum(len(v) for v in defs.values()), 'modules', len(modules), 'toggles', len(toggles),
      'sliders', len(sliders), 'textures', len(textures), 'of', len(tex))
