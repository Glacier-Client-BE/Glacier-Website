/* ===================================================================
   Glacier Config Editor — vanilla JS
   Ported from the React app (App.tsx, ConfigForm, HUDCanvas, useHUDDrag,
   RawEditor, TutorialModal). No framework, no build step.
   =================================================================== */
(function () {
  'use strict';

  const { VERSIONS, HUD_SIZES, DEFAULT_CONFIGS } = window.GC_DATA;
  const HISTORY_LIMIT = 30;
  const HUD_SECTION = 'mod_menu_config@gc.pnl';
  const REFERENCE_WIDTH = 1920;
  const MIN_SCALE = 1.05;
  const MIN_SCALE_TOUCH = 1.35;

  const ANCHORS = [
    'top_left', 'top_middle', 'top_right',
    'left_middle', 'middle', 'right_middle',
    'bottom_left', 'bottom_middle', 'bottom_right',
  ];
  const ANCHOR_LABELS = {
    top_left: 'TL', top_middle: 'TM', top_right: 'TR',
    left_middle: 'LM', middle: 'MID', right_middle: 'RM',
    bottom_left: 'BL', bottom_middle: 'BM', bottom_right: 'BR',
  };
  const SECTION_LABELS = [
    ['mod_menu', 'Mod Menu'], ['start_screen', 'Start Screen'],
    ['pause_menu', 'Pause Menu'], ['container', 'Container'],
  ];

  /* ── Module artwork ──────────────────────────────────────────────
     The main site ships an icon for every mod (assets/mods/<id>.png, the
     same art its mods grid renders), so a module looks identical in both
     places. Paths are root-absolute: the deploy step copies assets/mods
     to the published root, and at glacierclient.xyz/config/ they resolve
     against the main site — see .github/workflows/deploy-config-editor.yml.

     Groups whose id matches an icon filename need no entry. The map below
     covers the rest: the three individual item counters share the counter
     art, and the handful of groups that are setting clusters rather than
     shipped mods (the boss bar, the scoreboard, the text-visibility
     switches) fall back to a Font Awesome glyph. */
  const MODULE_ART = {
    armorhud: 1, bowindicator: 1, chat: 1, chunkmap: 1, clockcompass: 1, coordinates: 1,
    daycounter: 1, dayevent: 1, debughud: 1, directionhud: 1, expcalculator: 1, forcecoords: 1,
    fpscounter: 1, hotbar: 1, hudpopup: 1, inventoryhud: 1, itemcounters: 1, lowdurability: 1,
    mainhandhud: 1, mobileshortcuts: 1, offhandhud: 1, playerlist: 1, safezoneviewer: 1,
    serverdisplay: 1, shinypotions: 1, slotcounter: 1, speedometer: 1, statushud: 1,
    targethud: 1, timerhud: 1, walkdistance: 1,
    // Group id → the icon that actually depicts it.
    arrowcounter: 'itemcounter', potioncounter: 'itemcounter', totemcounter: 'itemcounter',
    crosshair: 'crosshairs', saturation_display: 'display', nightshift: 'display',
  };
  const MODULE_GLYPH = {
    bossbar: 'fa-bars-progress',
    scoreboard: 'fa-list-ol',
    text_visibility: 'fa-comment-slash',
    exp_bar: 'fa-chart-simple',
    brighter: 'fa-lightbulb',
    creeperrange: 'fa-bomb',
  };

  function moduleIcon(groupId) {
    const art = MODULE_ART[groupId];
    if (art) {
      const name = art === 1 ? groupId : art;
      return h('span', { class: 'group-icon' }, [
        h('img', { src: '/assets/mods/' + name + '.png', alt: '', width: 24, height: 24, loading: 'lazy', decoding: 'async' }),
      ]);
    }
    // Unknown ids get a neutral glyph rather than a broken image.
    const glyph = MODULE_GLYPH[groupId] || (HUD_SIZES[groupId] && HUD_SIZES[groupId].icon) || 'fa-sliders';
    return h('span', { class: 'group-icon group-icon--glyph' }, [h('i', { class: 'fas ' + glyph, 'aria-hidden': 'true' })]);
  }

  const clone = (o) => (typeof structuredClone === 'function' ? structuredClone(o) : JSON.parse(JSON.stringify(o)));
  const $ = (id) => document.getElementById(id);
  const coarse = () => window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  function h(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k.startsWith('on') && typeof attrs[k] === 'function') e.addEventListener(k.slice(2), attrs[k]);
      else if (k === 'style') e.setAttribute('style', attrs[k]);
      else if (attrs[k] != null && attrs[k] !== false) e.setAttribute(k, attrs[k]);
    }
    if (children != null) (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (c == null || c === false) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }

  const formatLabel = (key) => key.replace('$', '').replace(/_|\|default/g, ' ').trim();
  const sectionLabel = (sec) => { for (const [k, v] of SECTION_LABELS) if (sec.includes(k)) return v; return sec.split('_')[0]; };

  /* ── State ──────────────────────────────────────────────────── */
  let version = 'v6';
  let config = clone(DEFAULT_CONFIGS.v6);
  let activeSection = HUD_SECTION;
  let activeView = 'visual';       // visual | raw
  let mobileView = 'config';       // config | preview
  let history = [];
  let redoStack = [];
  let searchTerm = '';
  let expandedGroups = {};
  let selectedId = null;
  let showBackground = true;
  let theme = (() => { try { return localStorage.getItem('gc-theme') === 'light' ? 'light' : 'dark'; } catch (e) { return 'dark'; } })();

  /* ── Config mutation ────────────────────────────────────────── */
  function pushHistory(prev) {
    history = history.length >= HISTORY_LIMIT ? history.slice(1).concat([prev]) : history.concat([prev]);
    redoStack = [];
  }

  // re-render scope hint: 'none' | 'controls' | 'all'
  function updateConfig(path, value, skipHistory, rerender) {
    const prev = config;
    const next = clone(config);
    let cur = next;
    for (let i = 0; i < path.length - 1; i++) { if (cur[path[i]] == null) cur[path[i]] = {}; cur = cur[path[i]]; }
    cur[path[path.length - 1]] = value;
    if (!skipHistory) pushHistory(prev);
    config = next;
    syncDerived();
    if (rerender === 'controls' || rerender === 'all') renderControls();
    if (rerender === 'all') renderView();
  }

  function setConfig(next, withHistory) {
    if (withHistory) pushHistory(config);
    config = next;
    syncDerived();
  }

  function syncDerived() {
    $('undoBtn').disabled = history.length === 0;
    $('redoBtn').disabled = redoStack.length === 0;
    updateHUD();
    syncRaw();
  }

  /* ── Grouping (ported from ConfigForm) ──────────────────────── */
  const SYNTHETIC_RULES = [
    { id: 'bossbar', pattern: 'boss' }, { id: 'scoreboard', pattern: 'scoreboard' },
    { id: 'crosshair', pattern: 'crosshair' }, { id: 'exp_bar', pattern: 'xp_bar' },
    { id: 'exp_bar', pattern: 'xp_percentage' }, { id: 'saturation_display', pattern: 'display' },
    { id: 'saturation_display', pattern: 'saturation' }, { id: 'saturation_display', pattern: 'nightshift' },
    { id: 'text_visibility', pattern: 'hide_item_name' }, { id: 'text_visibility', pattern: 'hide_jukebox' },
    { id: 'text_visibility', pattern: 'hide_tip' }, { id: 'text_visibility', pattern: 'hide_actionbar' },
  ];
  const DEBUG_KEYWORDS = ['glacierversion', 'version', 'os_type', 'graphics', 'platform', 'ui_type', 'world_type', 'world_name', 'day_counter', 'moon_phase', 'gamemode', 'xp_level', 'item_id', 'item_aux_id'];

  function matchChildren(base, root, keys) {
    const not = (k) => k !== root;
    switch (base) {
      case 'coordinates': return keys.filter((k) => not(k) && (k.startsWith('$coordinates_') || /vanillacordinates|chunk_coordinates|nether_coordinates|nether_in_overworld|show_chunkcoordinates|show_nethercoordinates|hide_chunkcoordinates|hide_nethercoordinates|hide_vanillacordinates/.test(k)));
      case 'itemcounters': return keys.filter((k) => not(k) && /hide_potioncounter|hide_totemcounter|hide_arrowcounter/.test(k));
      case 'clockcompass': return keys.filter((k) => not(k) && (k.startsWith('$clockcompass_') || /compass_aux|clock_aux|recovery_compass_aux|show_clock_compass/.test(k)));
      case 'mobileshortcuts': return keys.filter((k) => not(k) && /f1button|f8button|hotbar_left_button|hotbar_right_button/.test(k));
      case 'mainhandhud': return keys.filter((k) => not(k) && (k.startsWith('$mainhandhud_') || /mainhand_durability_toggle_index|hide_mainhandhud|mainhandhud_slot_opacity/.test(k)));
      case 'chunkmap': return keys.filter((k) => not(k) && (k.startsWith('$chunkmap_') || /hide_slime_chunks|chunkmap_chunk_position/.test(k)));
      case 'playerlist': return keys.filter((k) => not(k) && (k.startsWith('$playerlist_') || /hide_playeravatars|playerlist_mobile_button/.test(k)));
      case 'hotbar': return keys.filter((k) => not(k) && (k.startsWith('$hotbar_') || /hide_hotbar|hide_inventory_button|show_hotbar_numbers|hotbar_toggle_index/.test(k)));
      default: return keys.filter((k) => not(k) && (k.startsWith(root + '_') || k.startsWith('$hide_' + base) || k.startsWith('$show_' + base)));
    }
  }

  function buildGroups() {
    const data = config[activeSection];
    if (!data) return { groups: {}, standalones: [] };
    const keys = Object.keys(data);
    const groups = {};
    const processed = new Set();

    const roots = keys.filter((k) => k.startsWith('$') && typeof data[k] === 'boolean' && !k.includes('_'));
    for (const root of roots) {
      const base = root.substring(1);
      const children = matchChildren(base, root, keys);
      groups[base] = { root, children };
      children.forEach((c) => processed.add(c));
      processed.add(root);
    }
    for (const rule of SYNTHETIC_RULES) {
      const matches = keys.filter((k) => !processed.has(k) && k.toLowerCase().includes(rule.pattern));
      if (!matches.length) continue;
      const ex = groups[rule.id] || { root: '', children: [] };
      ex.children = Array.from(new Set(ex.children.concat(matches)));
      groups[rule.id] = ex;
      matches.forEach((k) => processed.add(k));
    }
    if (keys.includes('$debughud')) {
      const dch = keys.filter((k) => !processed.has(k) && DEBUG_KEYWORDS.some((d) => k.includes(d)));
      const cur = groups.debughud || { root: '$debughud', children: [] };
      cur.children = Array.from(new Set(cur.children.concat(dch)));
      groups.debughud = cur;
      dch.forEach((k) => processed.add(k));
      processed.add('$debughud');
    }
    const standalones = keys.filter((k) => !processed.has(k));
    return { groups, standalones };
  }

  /* ── Control renderers ──────────────────────────────────────── */
  function ctlToggle(section, key, value, isChild) {
    const btn = h('button', { class: 'toggle' + (value ? ' on' : ''), 'aria-pressed': value, 'aria-label': 'Toggle ' + formatLabel(key) });
    btn.addEventListener('click', () => updateConfig([section, key], !value, false, 'controls'));
    return h('div', { class: 'ctl' + (isChild ? ' child' : '') }, [
      h('div', { class: 'ctl-row' }, [h('label', { class: 'ctl-label', text: formatLabel(key) }), btn]),
    ]);
  }

  function ctlOpacity(section, key, value, isChild) {
    const valEl = h('span', { class: 'range-val', text: Math.round(value * 100) + '%' });
    const input = h('input', { type: 'range', min: '0', max: '1', step: '0.01', value: String(value) });
    input.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      valEl.textContent = Math.round(v * 100) + '%';
      updateConfig([section, key], v, false, 'none');
    });
    return h('div', { class: 'ctl' + (isChild ? ' child' : '') }, [
      h('div', { class: 'range-head' }, [h('label', { class: 'ctl-label accent dim', text: formatLabel(key) }), valEl]),
      input,
    ]);
  }

  function ctlNumber(section, key, value, isChild) {
    const input = h('input', { class: 'field', type: 'number', value: String(value) });
    input.addEventListener('input', (e) => updateConfig([section, key], parseFloat(e.target.value) || 0, false, 'none'));
    return h('div', { class: 'ctl' + (isChild ? ' child' : '') }, [
      h('label', { class: 'ctl-label dim ctl-sub', text: formatLabel(key) }), input,
    ]);
  }

  function ctlString(section, key, value, isChild) {
    const input = h('input', { class: 'field', type: 'text', value: String(value) });
    input.addEventListener('input', (e) => updateConfig([section, key], e.target.value, false, 'none'));
    return h('div', { class: 'ctl' + (isChild ? ' child' : '') }, [
      h('label', { class: 'ctl-label dim ctl-sub', text: formatLabel(key) }), input,
    ]);
  }

  function ctlArray(section, key, value, isChild) {
    const isSize = key.includes('size');
    const mk = (idx, lbl) => {
      const inp = h('input', { type: 'number', value: String(value[idx]) });
      inp.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value) || 0;
        const arr = idx === 0 ? [v, value[1]] : [value[0], v];
        value = arr;
        updateConfig([section, key], arr, false, 'none');
      });
      return h('div', { class: 'xy-cell' }, [h('span', { text: lbl }), inp]);
    };
    return h('div', { class: 'ctl' + (isChild ? ' child' : '') }, [
      h('label', { class: 'ctl-label dim ctl-sub', text: formatLabel(key) }),
      h('div', { class: 'xy-row' }, [mk(0, isSize ? 'W' : 'X'), mk(1, isSize ? 'H' : 'Y')]),
    ]);
  }

  function renderControl(section, key, value, isChild) {
    if (Array.isArray(value) && value.length === 2) return ctlArray(section, key, value, isChild);
    if (typeof value === 'boolean') return ctlToggle(section, key, value, isChild);
    if (key.includes('opacity') && typeof value === 'number') return ctlOpacity(section, key, value, isChild);
    if (typeof value === 'number') return ctlNumber(section, key, value, isChild);
    if (typeof value === 'string') return ctlString(section, key, value, isChild);
    return null;
  }

  function renderGroup(groupId, data) {
    const sec = config[activeSection];
    const enabled = data.root ? sec[data.root] === true : true;
    const open = !!expandedGroups[groupId];

    const wrap = h('div', { class: 'group' + (open ? ' open' : '') });
    const head = h('div', { class: 'group-head' });
    const left = h('div', { class: 'group-head-left' });

    if (data.root) {
      const tg = h('button', { class: 'toggle' + (enabled ? ' on' : ''), 'aria-label': 'Toggle ' + groupId.replace(/_/g, ' ') });
      tg.addEventListener('click', (e) => { e.stopPropagation(); updateConfig([activeSection, data.root], !enabled, false, 'controls'); });
      left.appendChild(tg);
    }
    left.appendChild(moduleIcon(groupId));
    left.appendChild(h('div', { class: 'group-meta' }, [
      h('span', { class: 'group-name', text: groupId.replace(/_/g, ' ') }),
      h('span', { class: 'group-count', text: data.children.length + ' ' + (data.children.length === 1 ? 'parameter' : 'parameters') }),
    ]));
    head.appendChild(left);
    head.appendChild(h('i', { class: 'fas fa-chevron-down group-chevron' }));
    head.addEventListener('click', () => { expandedGroups[groupId] = !open; renderControls(); });
    wrap.appendChild(head);

    if (open) {
      const body = h('div', { class: 'group-body anim-fade-in' });
      if (enabled) {
        const list = h('div', { class: 'controls-list' });
        data.children.forEach((ck) => { const c = renderControl(activeSection, ck, sec[ck], true); if (c) list.appendChild(c); });
        body.appendChild(list);
      } else {
        body.appendChild(h('div', { class: 'group-locked' }, [
          h('i', { class: 'fas fa-lock' }),
          h('p', { text: 'Enable module to customize' }),
        ]));
      }
      wrap.appendChild(body);
    }
    return wrap;
  }

  function renderControls() {
    const scroll = $('controlsScroll');
    const keepTop = scroll ? scroll.scrollTop : 0;
    const list = $('controlsList');
    list.innerHTML = '';
    const sec = config[activeSection];
    if (!sec) return;

    const { groups, standalones } = buildGroups();
    const s = searchTerm.trim().toLowerCase();

    let groupEntries = Object.keys(groups).map((id) => [id, groups[id]]);
    let standaloneKeys = standalones.slice();
    if (s) {
      groupEntries = groupEntries.filter(([id, d]) => id.toLowerCase().includes(s) || d.children.some((c) => c.toLowerCase().includes(s)));
      standaloneKeys = standaloneKeys.filter((k) => k.toLowerCase().includes(s));
    }

    groupEntries.forEach(([id, d]) => list.appendChild(renderGroup(id, d)));
    standaloneKeys.forEach((k) => { const c = renderControl(activeSection, k, sec[k], false); if (c) list.appendChild(c); });

    if (groupEntries.length + standaloneKeys.length === 0) {
      list.appendChild(h('div', { class: 'empty-state' }, [
        h('i', { class: 'fas fa-magnifying-glass' }),
        h('p', { text: searchTerm ? 'No matches for "' + searchTerm + '"' : 'No settings in this section' }),
      ]));
    }
    if (scroll) scroll.scrollTop = keepTop;
  }

  /* ── Section pills + version tabs ───────────────────────────── */
  function availableSections() {
    return Object.keys(config).filter((k) => typeof config[k] === 'object' && config[k] !== null && !Array.isArray(config[k]) && k !== 'namespace');
  }

  function renderSectionPills() {
    const wrap = $('sectionPills');
    wrap.innerHTML = '';
    availableSections().forEach((sec) => {
      const b = h('button', { class: 'section-pill' + (sec === activeSection ? ' active' : ''), text: sectionLabel(sec) });
      b.addEventListener('click', () => { activeSection = sec; selectedId = null; renderSectionPills(); renderControls(); });
      wrap.appendChild(b);
    });
  }

  function renderVersionTabs() {
    const wrap = $('versionTabs');
    wrap.innerHTML = '';
    VERSIONS.forEach((v) => {
      const b = h('button', { class: 'version-tab' + (v === version ? ' active' : ''), text: v.toUpperCase() });
      b.addEventListener('click', () => selectVersion(v));
      wrap.appendChild(b);
    });
    // The header pill mirrors the site's client-version pill, so it tracks
    // whichever config version is being edited.
    const pill = $('versionPill');
    if (pill) pill.textContent = version;
  }

  function selectVersion(v) {
    version = v;
    config = clone(DEFAULT_CONFIGS[v]);
    history = []; redoStack = [];
    selectedId = null; searchTerm = ''; expandedGroups = {};
    const secs = availableSections();
    activeSection = secs.length ? secs[0] : HUD_SECTION;
    $('searchInput').value = '';
    $('searchWrap').classList.remove('has-value');
    renderVersionTabs();
    renderSectionPills();
    renderControls();
    syncDerived();
    renderView();
  }

  /* ── Right view (visual / raw) ──────────────────────────────── */
  function renderView() {
    const wrap = $('viewBody');
    wrap.innerHTML = '';
    const isRaw = activeView === 'raw';
    $('copyBtn').style.display = isRaw ? '' : 'none';
    $('bgToggle').style.display = isRaw ? 'none' : '';
    $('fsToggle').style.display = isRaw ? 'none' : '';
    if (isRaw) wrap.appendChild(buildRaw());
    else wrap.appendChild(buildHUD());
  }

  /* ── HUD canvas ─────────────────────────────────────────────── */
  let hudRefs = null; // { canvas, layer, anchorGrid, status, recenterBtn, bgEl }

  function hudModules() {
    const mm = config[HUD_SECTION];
    const mods = [];
    if (!mm) return mods;
    for (const key of Object.keys(mm)) {
      if (!key.startsWith('$') || typeof mm[key] !== 'boolean' || key.includes('_')) continue;
      const base = key.substring(1);
      const anchorKey = '$' + base + '_anchor|default';
      const offsetKey = '$' + base + '_offset|default';
      if (mm[anchorKey] === undefined || mm[offsetKey] === undefined) continue;
      const size = HUD_SIZES[base] || { w: 64, h: 32, icon: 'fa-cube' };
      mods.push({ id: base, toggleKey: key, anchorKey, offsetKey, width: size.w, height: size.h, icon: size.icon });
    }
    return mods;
  }

  function computePosition(anchor, offset, w, h2, cw, ch) {
    let x, y;
    if (anchor.includes('left')) x = offset[0];
    else if (anchor.includes('right')) x = cw - w + offset[0];
    else x = (cw - w) / 2 + offset[0];
    if (anchor.includes('top')) y = offset[1];
    else if (anchor.includes('bottom')) y = ch - h2 + offset[1];
    else y = (ch - h2) / 2 + offset[1];
    return { x, y };
  }

  function computeAnchorAndOffset(x, y, w, h2, cw, ch) {
    const cx = x + w / 2, cy = y + h2 / 2;
    const hZone = cx < cw / 3 ? 'left' : cx > (cw * 2) / 3 ? 'right' : 'middle';
    const vZone = cy < ch / 3 ? 'top' : cy > (ch * 2) / 3 ? 'bottom' : 'middle';
    let anchor;
    if (vZone === 'middle' && hZone === 'middle') anchor = 'middle';
    else if (vZone === 'middle') anchor = hZone + '_middle';
    else if (hZone === 'middle') anchor = vZone + '_middle';
    else anchor = vZone + '_' + hZone;
    let ox, oy;
    if (hZone === 'left') ox = x; else if (hZone === 'right') ox = x - (cw - w); else ox = x - (cw - w) / 2;
    if (vZone === 'top') oy = y; else if (vZone === 'bottom') oy = y - (ch - h2); else oy = y - (ch - h2) / 2;
    return { anchor: anchor, offset: [Math.round(ox), Math.round(oy)] };
  }

  function curScale() {
    if (!hudRefs) return 1;
    const w = hudRefs.canvas.clientWidth;
    if (!w) return 1;
    return Math.max(coarse() ? MIN_SCALE_TOUCH : MIN_SCALE, w / REFERENCE_WIDTH);
  }

  let drag = null; // { id, anchor, offset } preview during drag
  let dragState = null;

  function buildHUD() {
    const stage = h('div', { class: 'hud-stage' });
    const canvas = h('div', { class: 'hud-canvas' });
    if (showBackground) {
      canvas.appendChild(h('div', { class: 'hud-bg', style: "background-image:url('img/HUD.png')" }));
      canvas.appendChild(h('div', { class: 'hud-bg-dim' }));
    } else {
      canvas.appendChild(h('div', { class: 'hud-grid-dots' }));
    }
    const layer = h('div', { style: 'position:absolute;inset:0' });
    canvas.appendChild(layer);

    const anchorGrid = h('div', { class: 'anchor-grid', style: 'display:none' });
    ANCHORS.forEach((a) => {
      const cell = h('button', { class: 'anchor-cell', 'data-anchor': a, text: ANCHOR_LABELS[a] });
      cell.addEventListener('pointerdown', (e) => e.stopPropagation());
      cell.addEventListener('click', () => snapToAnchor(a));
      anchorGrid.appendChild(cell);
    });
    canvas.appendChild(anchorGrid);

    const inspector = h('div', { class: 'hud-inspector' });
    canvas.appendChild(inspector);

    canvas.addEventListener('pointerdown', (e) => { if (e.target === canvas || e.target === layer) { selectedId = null; refreshHUD(); } });
    stage.appendChild(canvas);

    hudRefs = { stage, canvas, layer, anchorGrid, inspector };
    requestAnimationFrame(() => { refreshHUD(); });
    return stage;
  }

  function refreshHUD() { if (hudRefs && activeView === 'visual') { drawModules(); drawStatus(); } }
  // alias used by syncDerived without rebuilding DOM
  function updateHUD() { if (hudRefs && activeView === 'visual') { drawModules(); drawStatus(); } }

  function drawModules() {
    const { canvas, layer, anchorGrid } = hudRefs;
    const settings = config[HUD_SECTION];
    const scale = curScale();
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    layer.innerHTML = '';
    if (!settings || !cw || !ch) return;

    const mods = hudModules().filter((m) => settings[m.toggleKey]);
    anchorGrid.style.display = selectedId ? '' : 'none';
    // mark hot anchor cell during drag
    Array.from(anchorGrid.children).forEach((c) => c.classList.toggle('hot', drag && c.getAttribute('data-anchor') === drag.anchor));

    if (!mods.length) {
      layer.appendChild(h('div', { class: 'hud-empty' }, [
        h('div', { class: 'hud-empty-box' }, [
          h('i', { class: 'fas fa-table-cells-large' }),
          h('span', { class: 'l1', text: 'No active HUD elements' }),
          h('span', { class: 'l2', text: 'Toggle modules in the config panel' }),
        ]),
      ]));
      return;
    }

    const refW = cw / scale, refH = ch / scale;
    mods.forEach((m) => {
      const isDragging = drag && drag.id === m.id;
      const anchor = isDragging ? drag.anchor : (settings[m.anchorKey] || 'top_left');
      const offset = isDragging ? drag.offset : (settings[m.offsetKey] || [0, 0]);
      const { x, y } = computePosition(anchor, offset, m.width, m.height, refW, refH);
      const w = m.width * scale, hh = m.height * scale;
      const sel = selectedId === m.id;
      const node = h('div', {
        class: 'hud-module' + (isDragging ? ' dragging' : sel ? ' selected' : ''),
        style: 'width:' + w + 'px;height:' + hh + 'px;transform:translate3d(' + Math.round(x * scale) + 'px,' + Math.round(y * scale) + 'px,0);z-index:' + (isDragging ? 200 : sel ? 150 : 50),
      }, [h('i', { class: 'fas ' + m.icon, style: 'font-size:' + Math.max(8, 10 * scale) + 'px' })]);
      if (isDragging || sel) node.appendChild(h('div', { class: 'hud-tag', style: 'top:' + (hh + 6) + 'px', text: m.id }));
      node.addEventListener('pointerdown', (e) => onModulePointerDown(e, m));
      layer.appendChild(node);
    });
  }

  function drawStatus() {
    const { inspector } = hudRefs;
    const settings = config[HUD_SECTION];
    const mod = selectedId ? hudModules().find((m) => m.id === selectedId) : null;
    inspector.innerHTML = '';
    if (mod && settings) {
      const anchor = drag && drag.id === mod.id ? drag.anchor : (settings[mod.anchorKey] || 'top_left');
      const offset = drag && drag.id === mod.id ? drag.offset : (settings[mod.offsetKey] || [0, 0]);
      inspector.classList.remove('hint');
      inspector.appendChild(h('span', { class: 'sel-name' }, [h('i', { class: 'fas ' + mod.icon }), document.createTextNode(' ' + mod.id)]));
      inspector.appendChild(h('span', { class: 'dot', text: '·' }));
      inspector.appendChild(h('span', { class: 'sel-anchor', text: anchor.replace(/_/g, ' ') }));
      inspector.appendChild(h('span', { class: 'dot', text: '·' }));
      inspector.appendChild(h('span', { class: 'sel-off', text: '(' + offset[0] + ', ' + offset[1] + ')' }));
      const rb = h('button', { class: 'chip-btn accent reset-pos' }, [h('i', { class: 'fas fa-rotate-left' }), document.createTextNode(' Reset')]);
      rb.addEventListener('pointerdown', (e) => e.stopPropagation());
      rb.addEventListener('click', recenterSelected);
      inspector.appendChild(rb);
    } else {
      inspector.classList.add('hint');
      inspector.appendChild(h('span', {}, [h('i', { class: 'fas fa-hand-pointer' }), document.createTextNode(' Tap an element · drag to move · arrow keys nudge · Esc to deselect')]));
    }
  }

  /* drag logic (ported from useHUDDrag) */
  function onModulePointerDown(e, mod) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const settings = config[HUD_SECTION];
    if (!settings) return;
    e.preventDefault(); e.stopPropagation();
    const target = e.currentTarget;
    try { target.setPointerCapture(e.pointerId); } catch (err) {}
    const rect = target.getBoundingClientRect();
    const sx = curScale() || 1;
    dragState = {
      id: mod.id, pointerId: e.pointerId,
      pointerOffsetX: (e.clientX - rect.left) / sx,
      pointerOffsetY: (e.clientY - rect.top) / sx,
      moduleW: mod.width, moduleH: mod.height,
      startX: e.clientX, startY: e.clientY, moved: false, target: target,
      anchorKey: mod.anchorKey, offsetKey: mod.offsetKey,
    };
    selectedId = mod.id;
    drag = { id: mod.id, anchor: settings[mod.anchorKey] || 'top_left', offset: settings[mod.offsetKey] || [0, 0] };
    refreshHUD();
  }

  function pointerToRef(clientX, clientY, d) {
    const el = hudRefs.canvas;
    const rect = el.getBoundingClientRect();
    const sx = curScale() || 1;
    const cw = rect.width / sx, ch = rect.height / sx;
    const rawX = (clientX - rect.left) / sx - d.pointerOffsetX;
    const rawY = (clientY - rect.top) / sx - d.pointerOffsetY;
    return { x: Math.max(0, Math.min(cw - d.moduleW, rawX)), y: Math.max(0, Math.min(ch - d.moduleH, rawY)), cw, ch };
  }

  let rafPending = false;
  function onGlobalMove(e) {
    const d = dragState;
    if (!d || d.pointerId !== e.pointerId) return;
    if (!d.moved && (Math.abs(e.clientX - d.startX) > 3 || Math.abs(e.clientY - d.startY) > 3)) d.moved = true;
    const cx = e.clientX, cy = e.clientY;
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      if (!dragState) return;
      const p = pointerToRef(cx, cy, dragState);
      const r = computeAnchorAndOffset(p.x, p.y, dragState.moduleW, dragState.moduleH, p.cw, p.ch);
      drag = { id: dragState.id, anchor: r.anchor, offset: r.offset };
      refreshHUD();
    });
  }

  function onGlobalUp(e) {
    const d = dragState;
    if (!d || d.pointerId !== e.pointerId) return;
    if (d.moved) {
      const p = pointerToRef(e.clientX, e.clientY, d);
      const r = computeAnchorAndOffset(p.x, p.y, d.moduleW, d.moduleH, p.cw, p.ch);
      updateConfig([HUD_SECTION, d.anchorKey], r.anchor, false, 'none');
      updateConfig([HUD_SECTION, d.offsetKey], r.offset, true, 'none');
      refreshFormForKeys([d.anchorKey, d.offsetKey]);
    }
    try { if (d.target && d.target.releasePointerCapture) d.target.releasePointerCapture(d.pointerId); } catch (err) {}
    dragState = null; drag = null;
    refreshHUD();
  }

  function snapToAnchor(anchor) {
    if (!selectedId) return;
    const mod = hudModules().find((m) => m.id === selectedId);
    if (!mod) return;
    updateConfig([HUD_SECTION, mod.anchorKey], anchor, false, 'none');
    updateConfig([HUD_SECTION, mod.offsetKey], [0, 0], true, 'none');
    refreshFormForKeys([mod.anchorKey, mod.offsetKey]);
    refreshHUD();
  }

  function recenterSelected() {
    if (!selectedId) return;
    const mod = hudModules().find((m) => m.id === selectedId);
    if (!mod) return;
    const defs = DEFAULT_CONFIGS[version][HUD_SECTION] || {};
    updateConfig([HUD_SECTION, mod.anchorKey], defs[mod.anchorKey] || 'top_left', false, 'none');
    updateConfig([HUD_SECTION, mod.offsetKey], defs[mod.offsetKey] || [0, 0], true, 'none');
    refreshFormForKeys([mod.anchorKey, mod.offsetKey]);
    refreshHUD();
  }

  // If the config panel is currently showing mod_menu, refresh it so offset fields update.
  function refreshFormForKeys() { if (activeSection === HUD_SECTION) renderControls(); }

  // Real browser fullscreen on the (stable) preview section.
  function fsElement() { return $('previewPanel'); }
  function isFullscreen() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function enterFullscreen() {
    const el = fsElement();
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req) { try { const p = req.call(el, { navigationUI: 'hide' }); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
  }
  function exitFullscreen() {
    const ex = document.exitFullscreen || document.webkitExitFullscreen;
    if (isFullscreen() && ex) { try { const p = ex.call(document); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
  }
  function toggleFullscreen() { if (isFullscreen()) exitFullscreen(); else enterFullscreen(); }
  function onFsChange() {
    const fs = isFullscreen();
    const b = $('fsToggle');
    if (b) { b.innerHTML = '<i class="fas ' + (fs ? 'fa-compress' : 'fa-expand') + '"></i>'; b.classList.toggle('active', fs); b.title = fs ? 'Exit fullscreen (Esc)' : 'Fullscreen'; }
    requestAnimationFrame(refreshHUD);
  }
  document.addEventListener('fullscreenchange', onFsChange);
  document.addEventListener('webkitfullscreenchange', onFsChange);

  /* ── Raw editor ─────────────────────────────────────────────── */
  let rawArea = null, rawStatusEl = null, rawFocused = false;
  function buildRaw() {
    const wrap = h('div', { class: 'raw-shell' });
    const box = h('div', { class: 'raw-wrap' });
    rawArea = h('textarea', { class: 'raw-area', spellcheck: 'false', wrap: 'off' });
    rawArea.value = JSON.stringify(config, null, 2);
    box.appendChild(rawArea);
    rawStatusEl = h('div', { class: 'raw-status ok' }, [h('i', { class: 'fas fa-check-circle' }), h('span', { text: 'Valid JSON' })]);

    rawArea.addEventListener('focus', () => { rawFocused = true; });
    rawArea.addEventListener('blur', () => { rawFocused = false; });
    rawArea.addEventListener('input', () => {
      try {
        const parsed = JSON.parse(rawArea.value);
        rawArea.classList.remove('invalid');
        rawStatusEl.className = 'raw-status ok';
        rawStatusEl.innerHTML = '<i class="fas fa-check-circle"></i><span>Valid JSON · live synced</span>';
        config = parsed; // raw edits don't push history (mirrors React setConfig)
      } catch (err) {
        rawArea.classList.add('invalid');
        rawStatusEl.className = 'raw-status err';
        rawStatusEl.innerHTML = '<i class="fas fa-triangle-exclamation"></i><span>' + (err.message || 'Invalid JSON') + '</span>';
      }
    });
    wrap.appendChild(box);
    wrap.appendChild(rawStatusEl);
    return wrap;
  }
  function syncRaw() {
    if (activeView === 'raw' && rawArea && !rawFocused) {
      const next = JSON.stringify(config, null, 2);
      if (rawArea.value !== next) rawArea.value = next;
    }
  }

  /* ── Toolbar actions ────────────────────────────────────────── */
  function undo() {
    if (!history.length) return;
    const prev = history[history.length - 1];
    redoStack = redoStack.concat([config]);
    history = history.slice(0, -1);
    config = prev;
    afterBulkChange();
  }
  function redo() {
    if (!redoStack.length) return;
    const next = redoStack[redoStack.length - 1];
    history = history.concat([config]);
    redoStack = redoStack.slice(0, -1);
    config = next;
    afterBulkChange();
  }
  function afterBulkChange() {
    if (!availableSections().includes(activeSection)) { const s = availableSections(); activeSection = s.length ? s[0] : HUD_SECTION; }
    renderSectionPills(); renderControls(); syncDerived(); renderView();
  }

  function resetSection() {
    const def = DEFAULT_CONFIGS[version][activeSection];
    if (!def) return;
    updateConfig([activeSection], clone(def), false, 'controls');
    renderView();
    toast('Section reset to defaults');
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: 'config.json' });
    a.click(); URL.revokeObjectURL(url);
    toast('config.json exported');
  }
  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
        setConfig(json, true);
        afterBulkChange();
        toast('Config imported');
      } catch (e) { toast('Invalid JSON file', true); }
    };
    reader.readAsText(file);
  }
  function copyJSON() {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2)).then(() => toast('Copied to clipboard'), () => toast('Copy failed', true));
  }

  /* ── Config pack (.mcpack) builder ──────────────────────────── */
  function uuidv4() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0; return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
  function makeManifest() {
    return {
      format_version: 2,
      header: {
        name: 'Glacier Client Config v' + version,
        description: 'Put this above Glacier main pack for the config to work\nGlacier Client by © 2026 Glacier Productions ',
        uuid: uuidv4(),
        version: [1, 0, 0],
        min_engine_version: [1, 20, 0],
      },
      modules: [{ type: 'resources', uuid: uuidv4(), version: [1, 0, 0] }],
    };
  }
  function saveBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: name });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function downloadPack() {
    if (typeof JSZip === 'undefined') { toast('Pack builder still loading…', true); return; }
    try {
      const zip = new JSZip();
      // All three files sit at the pack root, next to manifest.json.
      zip.file('manifest.json', JSON.stringify(makeManifest(), null, 2));
      zip.file('config.json', JSON.stringify(config, null, 2));
      try {
        const res = await fetch('img/pack_icon.png', { cache: 'no-cache' });
        if (res.ok) zip.file('pack_icon.png', await res.arrayBuffer());
      } catch (e) { /* icon optional */ }
      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      saveBlob(blob, 'Glacier-Config.mcpack');
      toast('Config pack downloaded');
    } catch (e) { toast('Pack export failed', true); }
  }

  /* ── Theme ──────────────────────────────────────────────────── */
  function applyTheme(t) {
    theme = t;
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('gc-theme', t); } catch (e) {}
    $('themeToggle').innerHTML = '<i class="fas ' + (t === 'dark' ? 'fa-sun' : 'fa-moon') + '" aria-hidden="true"></i>';
    refreshHUD();
  }

  /* ── Toast ──────────────────────────────────────────────────── */
  let toastTimer = null;
  function toast(msg, isErr) {
    const t = $('toast');
    $('toastMsg').textContent = msg;
    t.querySelector('i').className = isErr ? 'fas fa-triangle-exclamation' : 'fas fa-check-circle';
    t.querySelector('i').style.color = isErr ? 'var(--red)' : 'var(--green)';
    t.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ── Mobile view switch ─────────────────────────────────────── */
  function setMobileView(v) {
    mobileView = v;
    Array.from($('mobileSwitch').children).forEach((b) => b.classList.toggle('active', b.getAttribute('data-view') === v));
    $('configPanel').classList.toggle('mobile-hidden', v !== 'config');
    $('previewPanel').classList.toggle('mobile-hidden', v !== 'preview');
    if (v === 'preview') refreshHUD();
  }

  /* ── Tutorial modal ─────────────────────────────────────────── */
  const TUT_TABS = [
    { id: 'editors', label: 'Editors', icon: 'fa-pen-to-square' },
    { id: 'locate', label: 'Locate File', icon: 'fa-folder-open' },
    { id: 'customize', label: 'Customize', icon: 'fa-sliders' },
    { id: 'video', label: 'Videos', icon: 'fa-circle-play' },
  ];
  let tutTab = 'editors';

  function pathBlock(value, label) {
    return '<div class="path-block">' + (label ? '<span class="ctl-label dim" style="flex-shrink:0">' + label + '</span>' : '') +
      '<code>' + value.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</code>' +
      '<button class="path-copy" data-copy="' + encodeURIComponent(value) + '"><i class="fas fa-copy"></i> Copy</button></div>';
  }

  function tutContent(tab) {
    if (tab === 'editors') return '' +
      '<h3><i class="fas fa-screwdriver-wrench"></i> Recommended Editors</h3>' +
      '<p>Use a proper text editor that handles JSON safely without corrupting the file\'s encoding.</p>' +
      '<div class="tut-grid">' +
        '<div class="tut-card"><i class="fab fa-android big" style="color:var(--green)"></i><div class="os">Android</div><div class="apps">MT Manager · QuickEdit</div></div>' +
        '<div class="tut-card"><i class="fab fa-apple big" style="color:var(--accent)"></i><div class="os">iOS</div><div class="apps">Documents by Readdle</div></div>' +
        '<div class="tut-card"><i class="fab fa-windows big" style="color:var(--pink)"></i><div class="os">PC</div><div class="apps">VS Code · Notepad++</div></div>' +
      '</div>';
    if (tab === 'locate') return '' +
      '<div class="tut-block"><h3><i class="fab fa-android"></i> Android</h3>' +
        '<ol><li>Open your device\'s <b>Files</b> app.</li><li>Navigate to:</li></ol>' +
        pathBlock('Android/data/com.mojang.minecraftpe/files/games/com.mojang/resource_packs/') +
        '<p class="muted">Open the <b>/Glacier</b> folder and locate <code>config.json</code>.</p></div>' +
      '<div class="tut-block"><h3><i class="fab fa-apple"></i> iOS / iPadOS</h3>' +
        '<ol><li>Open the <b>Files</b> app → <b>On My iPhone</b> (or iPad).</li><li>Navigate to:</li></ol>' +
        pathBlock('On My iPhone/Minecraft/games/com.mojang/resource_packs/', 'iOS') +
        '<p class="muted">Open the <b>/Glacier</b> folder and locate <code>config.json</code>. If Minecraft doesn\'t appear, open it once after installing.</p></div>' +
      '<div class="tut-block"><h3><i class="fab fa-windows"></i> Windows (PC)</h3>' +
        '<ol><li>Press <kbd>Win + R</kbd>, then paste:</li></ol>' +
        pathBlock('%userprofile%\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\resource_packs', 'MS Store') +
        pathBlock('%userprofile%\\AppData\\Roaming\\Minecraft Bedrock\\Users\\Shared\\games\\com.mojang\\resource_packs', 'GDK') +
        '<p class="muted">Open the <b>/Glacier</b> folder and locate <code>config.json</code>.</p></div>';
    if (tab === 'customize') return '' +
      '<h3><i class="fas fa-wand-magic-sparkles"></i> Customizing Your Settings</h3>' +
      '<div class="tut-grid">' +
        '<div class="tut-card"><div class="os" style="color:var(--accent)">Toggles</div><div style="display:flex;gap:8px;margin-top:8px"><code style="color:var(--green)">true</code> <code style="color:var(--red)">false</code></div><p class="muted" style="margin-top:8px">Enable / disable a module.</p></div>' +
        '<div class="tut-card"><div class="os" style="color:var(--accent)">Opacity</div><code style="color:var(--accent-hover)">0.0 → 1.0</code><p class="muted" style="margin-top:8px">Transparency of the element.</p></div>' +
        '<div class="tut-card"><div class="os" style="color:var(--accent)">Offset (X, Y)</div><code style="color:var(--accent-hover)">[x, y]</code><p class="muted" style="margin-top:8px">Move element by pixels.</p></div>' +
      '</div>' +
      '<div class="tut-card" style="margin-top:14px;background:linear-gradient(135deg,var(--accent-bg),transparent);border-color:rgba(114,137,218,.2)"><h3 style="font-size:.82rem"><i class="fas fa-lightbulb"></i> Tip</h3><p class="muted">Do all of this <b>visually</b> right here — drag HUD elements on the preview canvas, toggle modules, and the JSON updates live. When done, click <b style="color:var(--accent)">Export JSON</b>.</p></div>';
    return '' +
      '<h3><i class="fas fa-circle-play"></i> Video Tutorials</h3>' +
      '<div class="tut-vid">' +
        '<a href="https://youtu.be/RrTHx6V-zp4" target="_blank" rel="noopener"><i class="fab fa-youtube yt"></i><div class="vt">Android · ChromeOS</div><div class="vn">Watch Tutorial</div></a>' +
        '<a href="https://youtu.be/oaQCtVdNUXg" target="_blank" rel="noopener"><i class="fab fa-youtube yt"></i><div class="vt">iPadOS · iOS</div><div class="vn">Watch Tutorial</div></a>' +
      '</div>';
  }

  function renderModal() {
    const tabs = $('modalTabs'); tabs.innerHTML = '';
    TUT_TABS.forEach((t) => {
      const b = h('button', { class: 'modal-tab' + (t.id === tutTab ? ' active' : '') }, [h('i', { class: 'fas ' + t.icon }), document.createTextNode(' ' + t.label)]);
      b.addEventListener('click', () => { tutTab = t.id; renderModal(); });
      tabs.appendChild(b);
    });
    const body = $('modalBody');
    body.className = 'modal-body anim-fade-in';
    body.innerHTML = tutContent(tutTab);
    body.querySelectorAll('.path-copy').forEach((btn) => btn.addEventListener('click', () => {
      const v = decodeURIComponent(btn.getAttribute('data-copy'));
      navigator.clipboard.writeText(v).then(() => { btn.innerHTML = '<i class="fas fa-check"></i> Copied'; setTimeout(() => { btn.innerHTML = '<i class="fas fa-copy"></i> Copy'; }, 1400); });
    }));
  }
  function openModal() { renderModal(); $('tutorialModal').classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeModal() { $('tutorialModal').classList.remove('open'); document.body.style.overflow = ''; }

  /* ── Keyboard shortcuts ─────────────────────────────────────── */
  function isTyping(t) { return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable); }
  document.addEventListener('keydown', (e) => {
    const t = e.target;
    // HUD nudge / deselect (only when not typing)
    if (!isTyping(t)) {
      const mod = selectedId ? hudModules().find((m) => m.id === selectedId) : null;
      if (e.key === 'Escape') { if (isFullscreen()) { return; } if ($('tutorialModal').classList.contains('open')) { closeModal(); return; } if (selectedId) { selectedId = null; refreshHUD(); return; } }
      if (mod && activeView === 'visual') {
        const settings = config[HUD_SECTION];
        const off = settings[mod.offsetKey] || [0, 0];
        const step = e.shiftKey ? 10 : 1;
        let dx = 0, dy = 0;
        if (e.key === 'ArrowLeft') dx = -step; else if (e.key === 'ArrowRight') dx = step;
        else if (e.key === 'ArrowUp') dy = -step; else if (e.key === 'ArrowDown') dy = step;
        if (dx || dy) { e.preventDefault(); updateConfig([HUD_SECTION, mod.offsetKey], [off[0] + dx, off[1] + dy], false, 'none'); refreshFormForKeys(); refreshHUD(); return; }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) { e.preventDefault(); redo(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); exportJSON(); return; }
    } else {
      if (e.key === 'Escape' && $('tutorialModal').classList.contains('open')) closeModal();
    }
  });

  window.addEventListener('pointermove', onGlobalMove);
  window.addEventListener('pointerup', onGlobalUp);
  window.addEventListener('pointercancel', onGlobalUp);
  window.addEventListener('resize', () => refreshHUD());
  window.addEventListener('scroll', () => { $('mainHeader').classList.toggle('scrolled', window.scrollY > 8); });

  /* ── Wire up static controls ────────────────────────────────── */
  function init() {
    applyTheme(theme);
    var yr = $('currentYear'); if (yr) yr.textContent = new Date().getFullYear();
    renderVersionTabs();
    renderSectionPills();
    renderControls();
    renderView();
    syncDerived();

    $('undoBtn').addEventListener('click', undo);
    $('redoBtn').addEventListener('click', redo);
    $('themeToggle').addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark'));
    $('tutorialBtn').addEventListener('click', openModal);
    [$('footerTutorial'), $('cardTutorial')].forEach((el) => {
      if (el) el.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    });

    // The site's header collapses its nav into a dropdown below 768px; this
    // page has no router, so it drives the same .active class itself.
    const menuBtn = $('mobileMenuBtn'), navMenu = $('navMenu');
    const closeMenu = () => { navMenu.classList.remove('active'); menuBtn.setAttribute('aria-expanded', 'false'); };
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menuBtn.setAttribute('aria-expanded', navMenu.classList.toggle('active') ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => { if (!navMenu.contains(e.target)) closeMenu(); });
    $('modalClose').addEventListener('click', closeModal);
    $('modalGotIt').addEventListener('click', closeModal);
    $('tutorialModal').addEventListener('click', (e) => { if (e.target === $('tutorialModal')) closeModal(); });
    $('resetSectionBtn').addEventListener('click', resetSection);
    $('importBtn').addEventListener('click', () => $('fileInput').click());
    $('fileInput').addEventListener('change', (e) => { const f = e.target.files[0]; e.target.value = ''; if (f) importJSON(f); });
    $('copyBtn').addEventListener('click', copyJSON);

    // Export split-button menu
    const exportBtn = $('exportBtn'), exportMenu = $('exportMenu');
    const closeExportMenu = () => { exportMenu.classList.remove('open'); exportBtn.classList.remove('open'); exportBtn.setAttribute('aria-expanded', 'false'); };
    exportBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = exportMenu.classList.toggle('open');
      exportBtn.classList.toggle('open', open);
      exportBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => { if (!exportMenu.contains(e.target) && !exportBtn.contains(e.target)) closeExportMenu(); });
    $('optPack').addEventListener('click', () => { closeExportMenu(); downloadPack(); });
    $('optJson').addEventListener('click', () => { closeExportMenu(); exportJSON(); });

    // Preview toolbar: background + fullscreen
    $('bgToggle').addEventListener('click', () => {
      showBackground = !showBackground;
      $('bgToggle').classList.toggle('active', showBackground);
      if (activeView === 'visual') renderView();
    });
    $('fsToggle').addEventListener('click', toggleFullscreen);

    const si = $('searchInput');
    si.addEventListener('input', (e) => { searchTerm = e.target.value; $('searchWrap').classList.toggle('has-value', !!searchTerm); renderControls(); });
    $('searchClear').addEventListener('click', () => { searchTerm = ''; si.value = ''; $('searchWrap').classList.remove('has-value'); renderControls(); si.focus(); });

    document.querySelectorAll('.view-tab').forEach((b) => b.addEventListener('click', () => {
      activeView = b.getAttribute('data-view');
      document.querySelectorAll('.view-tab').forEach((x) => x.classList.toggle('active', x === b));
      renderView();
    }));
    Array.from($('mobileSwitch').children).forEach((b) => b.addEventListener('click', () => setMobileView(b.getAttribute('data-view'))));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
