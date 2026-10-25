/* A small JSON UI interpreter for the HUD preview.
   It reads each Glacier version's own HUD JSON (bundled to ui/<version>.json by .github/scripts/bundle-jsonui.py)
   and lays it out the way Bedrock does: `name@base` inheritance, `$variables` (with `|default`), size strings
   ("100%", "100%c", "100%sm", "50% - 2px", "fill", "default"), anchor_from / anchor_to / offset, stack panels,
   grids, images (uv, nine-slice, tint, alpha) and labels. Bindings run on sample game data: global bindings,
   view bindings from the mod menu's toggles and sliders (fed by the editor's config), and the expression
   language ('+', '-' on strings, '%.Ns' * text, comparisons, and/or/not).
   Things the browser can't run (entity renderers, the item renderer) are handed to hooks. */
(function () {
  'use strict';

  const bundles = {};
  function load(version) {
    if (!bundles[version]) {
      bundles[version] = fetch('ui/' + version + '.json?v=20261025101736').then((r) => r.json()).then((b) => {
        const idx = {};                                   // ns -> name -> [key, body]
        for (const ns in b.defs) {
          idx[ns] = {};
          for (const key in b.defs[ns]) idx[ns][key.split('@')[0]] = [key, b.defs[ns][key]];
        }
        b.idx = idx;
        b.version = version;
        bundles[version].value = b;
        return b;
      });
    }
    return bundles[version];
  }
  const ready = (version) => bundles[version] && bundles[version].value;

  /* ── sample game data for global / collection bindings ── */
  const GLOBALS = {
    '#hud_visible': true, '#show_survival_ui': true, '#is_creative_mode': false, '#player_position_visible': true,
    '#player_position_text': 'Position: 12, 64, -30', '#number_of_days_played_text': 'Day 12', '#number_of_days_played_visible': true,
    '#level_number': 30, '#exp_progress': 0.42, '#gamertag': 'Steve', '#player_list_title': 'localhost',
    '#players_grid_dimension': [1, 2], '#scoreboard_sidebar_visible': true, '#inventory_touch_button': true,
    '#hotbar_grid_dimensions': [9, 1], '#is_armor_visible': true, '#gamepad_helper_visible': false, '#keyboard_helper_visible': false,
    '#chat_text': '', '#slider_steps': 10,
  };
  const ITEMS = [
    ['diamond_sword', 1, 1561, 1400], ['apple', 12], ['apple_golden', 5], ['beef_cooked', 32], ['bread', 16],
    ['iron_pickaxe', 1, 250, 30], ['ender_pearl', 9], ['experience_bottle', 64], ['compass_item', 1],
  ];
  function collectionItem(name, i) {
    const it = ITEMS[i % ITEMS.length];
    const empty = i >= 9 && i % 3 !== 0;
    return { '#item_id_aux': empty ? -1 : 1 + i, '#inventory_stack_count': it[1] > 1 ? String(it[1]) : '',
      '#stack_count': it[1], '#item_durability_total_amount': it[2] || 0, '#item_durability_current_amount': it[3] || 0,
      '#item_durability_visible': !!it[2], '#slot_selected': i === 0, '#collection_index': i, '#item': it[0],
      '#gamertag': i === 0 ? 'Steve' : 'Alex', '#item_storage_visible': false };
  }

  /* ── expression language ── */
  function tokenize(s) {
    const out = [];
    const re = /\s*(?:(\d+(?:\.\d+)?)|'((?:[^'])*)'|(#[\w.]+|\$[\w|]+)|(>=|<=|=|>|<|\+|-|\*|\/|%|\(|\))|(and|or|not)\b)/y;
    let m;
    re.lastIndex = 0;
    while (re.lastIndex < s.length) {
      const at = re.lastIndex;
      m = re.exec(s);
      if (!m) { if (/^\s*$/.test(s.slice(at))) break; throw new Error('bad expr ' + s.slice(at)); }
      if (m[1] != null) out.push({ t: 'n', v: Number(m[1]) });
      else if (m[2] != null) out.push({ t: 's', v: m[2] });
      else if (m[3] != null) out.push({ t: 'p', v: m[3] });
      else out.push({ t: 'o', v: m[4] || m[5] });
    }
    return out;
  }
  const num = (v) => (typeof v === 'boolean' ? +v : typeof v === 'number' ? v : (v === '' || isNaN(Number(v)) ? 0 : Number(v)));
  const str = (v) => (typeof v === 'boolean' ? (v ? 'true' : 'false') : typeof v === 'number' ? (Number.isInteger(v) ? String(v) : String(+v.toFixed(2))) : v == null ? '' : String(v));
  const truthy = (v) => (typeof v === 'string' ? v !== '' && v !== 'false' && v !== '0' : !!v);
  function binop(op, a, b) {
    switch (op) {
      case '+': return typeof a === 'string' || typeof b === 'string' ? str(a) + str(b) : num(a) + num(b);
      case '-':
        if (typeof a === 'string' && !(a !== '' && !isNaN(Number(a)) && typeof b !== 'string')) return a.split(str(b)).join('');
        return num(a) - num(b);
      case '*': {
        if (typeof a === 'string') {
          const f = /^%\.(\d+)s$/.exec(a);
          if (f) return str(b).slice(0, +f[1]);
          if (/^%\.?\d*d$/.test(a)) return str(Math.trunc(num(b)));
          if (isNaN(Number(a))) return truthy(b) ? a : '';
        }
        if (typeof b === 'string' && isNaN(Number(b))) return truthy(a) ? b : '';
        return num(a) * num(b);
      }
      case '/': { const d = num(b); return d ? num(a) / d : 0; }
      case '%': return num(b) ? num(a) % num(b) : 0;
      case '=': return typeof a === 'string' || typeof b === 'string' ? str(a) === str(b) : num(a) === num(b);
      case '>': return num(a) > num(b);
      case '<': return num(a) < num(b);
      case '>=': return num(a) >= num(b);
      case '<=': return num(a) <= num(b);
      case 'and': return truthy(a) && truthy(b);
      case 'or': return truthy(a) || truthy(b);
    }
  }
  const PREC = { or: 1, and: 2, '=': 3, '>': 3, '<': 3, '>=': 3, '<=': 3, '+': 4, '-': 4, '*': 5, '/': 5, '%': 5 };
  function evaluate(expr, props) {
    if (typeof expr !== 'string') return expr;
    let toks;
    try { toks = tokenize(expr); } catch (e) { return undefined; }
    let i = 0;
    const prop = (n) => (n in props ? props[n] : n in GLOBALS ? GLOBALS[n] : '');
    function unary() {
      const t = toks[i++];
      if (!t) return '';
      if (t.t === 'n' || t.t === 's') return t.v;
      if (t.t === 'p') return prop(t.v);
      if (t.v === '(') { const v = expr1(0); i++; return v; }
      if (t.v === 'not') return !truthy(unary());
      if (t.v === '-') return -num(unary());
      return '';
    }
    function expr1(min) {
      let a = unary();
      for (;;) {
        const t = toks[i];
        if (!t || t.t !== 'o' || !(t.v in PREC) || PREC[t.v] <= min - 1 || PREC[t.v] < min) break;
        i++;
        const b = expr1(PREC[t.v] + 1);
        a = binop(t.v, a, b);
      }
      return a;
    }
    return expr1(0);
  }

  /* ── definitions: inheritance + variables ── */
  function lookup(b, ref, vars) {
    for (let i = 0; i < 8 && typeof ref === 'string' && ref[0] === '$'; i++) ref = vars[ref.split('|')[0]];
    if (typeof ref !== 'string') return null;
    const dot = ref.indexOf('.');
    const ns = dot > 0 ? ref.slice(0, dot) : null;
    const name = dot > 0 ? ref.slice(dot + 1) : ref;
    const hit = (ns && b.idx[ns] && b.idx[ns][name]) || (!ns && Object.values(b.idx).map((n) => n[name]).find(Boolean));
    if (hit) return { key: hit[0], body: hit[1], ns: ns || Object.keys(b.idx).find((k) => b.idx[k][name] === hit) };
    // Vanilla controls the pack builds on: treat them as plain panels / images.
    if (/image|texture|icon|bg|background/.test(name)) return { key: name, body: { type: 'image' }, ns };
    return { key: name, body: { type: name === 'button' ? 'button' : name === 'toggle' ? 'toggle' : 'panel' }, ns };
  }
  // The chain of bodies from the most basic ancestor to the control itself.
  function chain(b, key, body, ns, vars, depth) {
    const at = key.indexOf('@');
    let list = [];
    if (at >= 0 && depth < 24) {
      const base = lookup(b, key.slice(at + 1), vars);
      if (base) list = chain(b, base.key, base.body, base.ns, vars, depth + 1);
    }
    list.push(body);
    return list;
  }
  function subst(v, vars, depth) {
    if (typeof v === 'string') {
      if (v[0] === '$' && v in vars) return depth > 8 ? vars[v] : subst(vars[v], vars, (depth || 0) + 1);
      if (v[0] === '(' && v.includes('$')) {
        return v.replace(/\$[\w]+(\|default)?/g, (m) => {
          const x = vars[m.replace('|default', '')];
          return x === undefined ? m : typeof x === 'number' || typeof x === 'boolean' ? String(x) : "'" + String(x).replace(/'/g, '') + "'";
        });
      }
      return v;
    }
    if (Array.isArray(v)) return v.map((x) => subst(x, vars, depth));
    if (v && typeof v === 'object') {
      const o = {};
      for (const k in v) o[k] = k === 'controls' ? v[k] : subst(v[k], vars, depth);
      return o;
    }
    return v;
  }
  // Build one control instance: merged properties and the variables its children see.
  function instance(b, key, body, parentVars) {
    const vars = Object.assign({}, parentVars);
    const own = {};
    const bodies = chain(b, key, body, null, vars, 0);
    // Non-default variables: the control itself wins over its bases, and over the parent's.
    // A variable set to another variable ("$a": "$b") takes that variable's value from the scope it is set in.
    const deref = (v) => { for (let i = 0; i < 8 && typeof v === 'string' && v[0] === '$' && v in vars; i++) v = vars[v]; return v; };
    for (const bd of bodies) for (const k in bd) if (k[0] === '$' && !k.includes('|default')) vars[k] = deref(bd[k]);
    // |default variables: only when nothing above set them.
    for (let j = bodies.length - 1; j >= 0; j--) for (const k in bodies[j]) {
      if (k[0] === '$' && k.endsWith('|default')) { const n = k.slice(0, -8); if (!(n in vars)) vars[n] = deref(bodies[j][k]); }
    }
    for (const bd of bodies) for (const k in bd) if (k[0] !== '$') own[k] = bd[k];
    const props = subst(own, vars);
    if (vars.$bindings && !props.bindings) props.bindings = subst(vars.$bindings, vars);
    else if (vars.$bindings && Array.isArray(props.bindings)) props.bindings = props.bindings.concat(subst(vars.$bindings, vars));
    return { props, vars };
  }

  /* ── bindings ── */
  function runBindings(props, ctx, data) {
    const out = {};
    const own = Object.assign({}, data);
    const list = Array.isArray(props.bindings) ? props.bindings : [];
    for (const bd of list) {
      if (!bd || typeof bd !== 'object') continue;
      const type = bd.binding_type || 'global';
      let target = bd.binding_name_override || bd.target_property_name || bd.binding_name;
      let val;
      if (type === 'global' || type === 'collection' || type === 'collection_details') {
        const name = bd.binding_name;
        if (!name || name === 'none') continue;
        const ci = props.collection_index != null ? props.collection_index : data && data.__ci;
        if (type !== 'global' && ci != null) Object.assign(own, collectionItem(bd.binding_collection_name, num(ci)));
        val = /[()\s]/.test(name) ? evaluate(name, own) : (name in own ? own[name] : GLOBALS[name]);
      } else if (type === 'view') {
        let src = own;
        if (bd.source_control_name) src = ctx.control(bd.source_control_name);
        const env = Object.assign({}, own, src);
        // A counter that steps toward a value every frame, ((#v < #t) - (#v > #t) + #v), shows the value it settles on.
        const step = /^\(\((#\w+) < (#\w+)\) - \(\1 > \2\) \+ \1\)$/.exec(String(bd.source_property_name || '').replace(/\s+/g, ' '));
        val = step ? env[step[2]] : evaluate(bd.source_property_name || '', env);
      } else continue;
      if (val === undefined || !target) continue;
      if (target[0] === '(') target = str(evaluate(target, own));
      own[target] = val;
      out[target] = val;
    }
    return out;
  }

  /* ── layout ── */
  const ANCH = { top_left: [0, 0], top_middle: [.5, 0], top_right: [1, 0], left_middle: [0, .5], center: [.5, .5], middle: [.5, .5],
    right_middle: [1, .5], bottom_left: [0, 1], bottom_middle: [.5, 1], bottom_right: [1, 1] };
  // One size axis: number | "N%" | "N%c" (children) | "N%cm" (largest child) | "N%sm" (siblings' max) | "N%x"/"N%y" | "default" | "fill", with +/- px terms.
  function axis(v, parent, kids, other, def) {
    if (typeof v === 'number') return v;
    if (v == null || v === 'default') return def;
    if (v === 'fill') return null;
    let total = 0;
    const re = /([+-]?)\s*(\d+(?:\.\d+)?)\s*(%cm|%c|%sm|%x|%y|%|px)?/g;
    let m, any = false;
    while ((m = re.exec(String(v)))) {
      if (!m[0].trim()) { re.lastIndex++; continue; }
      any = true;
      const n = Number(m[2]) * (m[1] === '-' ? -1 : 1);
      const u = m[3] || 'px';
      total += u === 'px' ? n : u === '%' ? parent * n / 100 : u === '%c' || u === '%cm' ? kids * n / 100 : u === '%x' || u === '%y' ? other * n / 100 : parent * n / 100;
    }
    return any ? total : def;
  }
  const fontPx = (p) => 8 * (Number(p.font_scale_factor) || 1);
  const FONTS = { 'Inter-Medium': "500 {s}px GlacierInter, Inter, sans-serif", 'Roboto-Bold': "700 {s}px Roboto, GlacierInter, sans-serif",
    mojangles: "{s}px 'Pixelify Sans', monospace", smooth: "500 {s}px GlacierInter, sans-serif", default: "{s}px 'Pixelify Sans', monospace" };
  const fontCss = (p, vars) => (FONTS[p.font_type] || FONTS[vars.$font] || FONTS.default).replace('{s}', fontPx(p));
  // Minecraft § formatting codes: colours, §l bold, §o italic, §r reset; anything else is dropped.
  const MCC = { 0: '#000', 1: '#00a', 2: '#0a0', 3: '#0aa', 4: '#a00', 5: '#a0a', 6: '#fa0', 7: '#aaa', 8: '#555', 9: '#55f',
    a: '#5f5', b: '#5ff', c: '#f55', d: '#f5f', e: '#ff5', f: '#fff', g: '#ddd605' };
  const plain = (t) => String(t).replace(/§./g, '').replace(/%%/g, '%');
  function formatted(d, text) {
    let color = null, bold = false, italic = false;
    String(text).replace(/%%/g, '%').split(/(§.)/).forEach((part) => {
      if (/^§.$/.test(part)) {
        const c = part[1].toLowerCase();
        if (c in MCC) color = MCC[c]; else if (c === 'l') bold = true; else if (c === 'o') italic = true;
        else if (c === 'r') { color = null; bold = italic = false; }
        return;
      }
      if (!part) return;
      if (!color && !bold && !italic) { d.append(part); return; }
      const sp = document.createElement('span');
      sp.textContent = part;
      if (color) sp.style.color = color;
      if (bold) sp.style.fontWeight = '700';
      if (italic) sp.style.fontStyle = 'italic';
      d.append(sp);
    });
  }
  let ctx2d;
  function measure(text, font) {
    text = plain(text);
    ctx2d = ctx2d || document.createElement('canvas').getContext('2d');
    ctx2d.font = font;
    const lines = String(text).split('\n');
    return { w: Math.ceil(Math.max(...lines.map((l) => ctx2d.measureText(l).width), 0)), h: lines.length * 9 };
  }
  const COLORS = { white: [1, 1, 1], black: [0, 0, 0], gray: [.5, .5, .5], grey: [.5, .5, .5], red: [1, .33, .33], green: [.33, 1, .33],
    yellow: [1, 1, .33], blue: [.33, .33, 1], light_gray: [.75, .75, .75] };
  const rgb = (c) => {
    const v = Array.isArray(c) ? c : COLORS[c];
    return v ? 'rgb(' + v.slice(0, 3).map((x) => Math.round(Math.min(1, Math.max(0, +x)) * 255)).join(',') + ')' : null;
  };

  /* Build a laid-out node tree: {props, vars, data, w, h, x, y, kids}. */
  function build(b, key, body, vars, data, ctx, depth) {
    if (depth > 40) return null;
    const inst = instance(b, key, body, vars);
    const p = inst.props;
    if (p.ignored === true || p.ignored === 'true') return null;
    const type = p.type || 'panel';
    if (p.collection_index != null) data = Object.assign({}, data, collectionItem(p.collection_name, num(p.collection_index)), { __ci: num(p.collection_index) });
    const node = { name: key.split('@')[0], p, vars: inst.vars, data, kids: [], type, bound: {} };
    // children
    let kidsDefs = Array.isArray(p.controls) ? p.controls : [];
    // Vanilla toggles / buttons (not in the pack) build their look from the state controls named in variables.
    if (!kidsDefs.length && (type === 'toggle' || type === 'button')) {
      const v = inst.vars;
      const ref = type === 'toggle' ? (truthy(p.toggle_default_state) ? v.$checked_control : v.$unchecked_control) : v.$default_control;
      if (typeof ref === 'string') kidsDefs = [{ ['state@' + ref]: {} }];
    }
    if (type === 'grid') {
      const dims = Array.isArray(p.grid_dimensions) ? p.grid_dimensions : (GLOBALS[p.grid_dimension_binding] || [1, 1]);
      const tpl = p.grid_item_template ? lookup(b, p.grid_item_template, inst.vars) : null;
      node.grid = dims;
      if (tpl) {
        for (let i = 0; i < dims[0] * dims[1]; i++) {
          const k = build(b, tpl.key, tpl.body, inst.vars, collectionItem(p.collection_name, i), ctx, depth + 1);
          if (k) { k.cell = i; node.kids.push(k); }
        }
      }
      kidsDefs = [];
    }
    if (type === 'factory' && p.control_name) {
      const t = lookup(b, p.control_name, inst.vars);
      if (t) { const k = build(b, t.key, t.body, inst.vars, data, ctx, depth + 1); if (k) node.kids.push(k); }
    }
    kidsDefs.forEach((c) => {
      if (!c || typeof c !== 'object') return;
      for (const ck in c) {
        const k = build(b, ck, c[ck] || {}, inst.vars, data, ctx, depth + 1);
        if (k) node.kids.push(k);
      }
    });
    return node;
  }

  /* Bindings run after the tree exists: a view binding's source_control_name can be any named control (a
     descendant, an ancestor, a sibling) or one of the mod menu's toggles / sliders. A few passes settle chains
     where controls read each other. */
  function bindAll(root, ctx) {
    const all = [];
    (function walk(n) { all.push(n); n.textKey = typeof n.p.text === 'string' && n.p.text[0] === '#' ? n.p.text : null; n.kids.forEach(walk); })(root);
    const find = (from, name) => {
      const q = from.kids.slice();
      while (q.length) { const k = q.shift(); if (k.name === name) return k; q.push(...k.kids); }
      return all.find((k) => k.name === name);
    };
    for (let pass = 0; pass < 3; pass++) {
      for (let i = all.length - 1; i >= 0; i--) {
        const n = all[i];
        const local = { control(name) { const k = find(n, name); return k ? Object.assign({}, k.bound) : ctx.control(name); } };
        n.bound = runBindings(n.p, local, n.data);
      }
    }
    all.forEach((n) => {
      const p = n.p, bound = n.bound;
      Object.assign(p, bound);
      if ('#visible' in bound) p.visible = truthy(bound['#visible']);
      if ('#alpha' in bound) p.alpha = num(bound['#alpha']);
      if (n.textKey) p.text = n.textKey in bound ? bound[n.textKey] : (GLOBALS[n.textKey] != null ? GLOBALS[n.textKey] : '');
      if ('#texture' in bound) p.texture = bound['#texture'];
      n.hidden = p.visible === false || p.visible === 'false';
    });
  }

  function sizeOf(n, pw, ph) {
    const p = n.p;
    let sz = p.size;
    if (!Array.isArray(sz)) sz = sz == null ? null : [sz, sz];
    // default sizes: labels measure their text, images their texture, panels fill the parent
    let dw = pw, dh = ph;
    if (n.type === 'label') {
      const t = measure(p.text == null ? '' : p.text, fontCss(p, n.vars));
      dw = t.w; dh = Math.max(t.h, fontPx(p) + 1);
      n.font = fontCss(p, n.vars);
    }
    // children first for %c sizes (children laid out against this control's own fixed axes)
    const want = sz || ['default', 'default'];
    const fixedW = !/%c|%sm/.test(String(want[0])) ? axis(want[0], pw, 0, ph, dw) : null;
    const fixedH = !/%c|%sm/.test(String(want[1])) ? axis(want[1], ph, 0, pw, dh) : null;
    const innerW = fixedW == null ? pw : fixedW, innerH = fixedH == null ? ph : fixedH;
    const ks = layoutKids(n, innerW, innerH);
    const w = fixedW != null ? fixedW : axis(want[0], pw, ks.w, innerH, dw);
    const h = fixedH != null ? fixedH : axis(want[1], ph, ks.h, w, dh);
    n.w = w == null ? pw : Math.max(0, w);
    n.h = h == null ? ph : Math.max(0, h);
    if ((fixedW == null || fixedH == null) && (n.w !== innerW || n.h !== innerH)) layoutKids(n, n.w, n.h);
    return n;
  }

  function layoutKids(n, W, H) {
    const vis = n.kids.filter((k) => !k.hidden);
    if (n.type === 'stack_panel') {
      const horiz = n.p.orientation === 'horizontal';
      let used = 0, cross = 0;
      const fills = [];
      vis.forEach((k) => {
        const s = Array.isArray(k.p.size) ? k.p.size : [k.p.size, k.p.size];
        if (s[horiz ? 0 : 1] === 'fill') { fills.push(k); return; }
        sizeOf(k, W, H);
        used += horiz ? k.w : k.h;
      });
      fills.forEach((k) => {
        const rest = Math.max(0, (horiz ? W : H) - used);
        sizeOf(k, horiz ? rest : W, horiz ? H : rest);
        if (horiz) k.w = rest; else k.h = rest;
        used += rest;
      });
      let at = 0;
      vis.forEach((k) => {
        const [ax, ay] = ANCH[k.p.anchor_from] || [0, 0];
        const [tx, ty] = ANCH[k.p.anchor_to] || [0, 0];
        const off = Array.isArray(k.p.offset) ? k.p.offset.map((o) => axis(o, horiz ? H : W, 0, 0, 0) || 0) : [0, 0];
        if (horiz) { k.x = at + off[0]; k.y = ay * H - ty * k.h + off[1]; at += k.w; cross = Math.max(cross, k.h); }
        else { k.y = at + off[1]; k.x = ax * W - tx * k.w + off[0]; at += k.h; cross = Math.max(cross, k.w); }
      });
      return horiz ? { w: at, h: cross } : { w: cross, h: at };
    }
    if (n.type === 'grid' && n.grid) {
      const [cols, rows] = n.grid;
      const fixed = n.p.size && !/%c/.test(String(n.p.size));
      const cw = fixed ? W / Math.max(1, cols) : W, chh = fixed ? H / Math.max(1, rows) : H;
      let mw = 0, mh = 0;
      vis.forEach((k) => { sizeOf(k, cw, chh); mw = Math.max(mw, k.w); mh = Math.max(mh, k.h); });
      const iw = fixed ? cw : mw, ih = fixed ? chh : mh;
      vis.forEach((k) => { k.x = (k.cell % cols) * iw; k.y = Math.floor(k.cell / cols) * ih; });
      return { w: iw * cols, h: ih * rows };
    }
    let mw = 0, mh = 0;
    vis.forEach((k) => {
      sizeOf(k, W, H);
      const [ax, ay] = ANCH[k.p.anchor_from] || ANCH.center;
      const [tx, ty] = ANCH[k.p.anchor_to] || ANCH.center;
      const off = Array.isArray(k.p.offset) ? [axis(k.p.offset[0], W, 0, H, 0) || 0, axis(k.p.offset[1], H, 0, W, 0) || 0] : [0, 0];
      k.x = ax * W - tx * k.w + off[0];
      k.y = ay * H - ty * k.h + off[1];
      mw = Math.max(mw, k.w); mh = Math.max(mh, k.h);
    });
    return { w: mw, h: mh };
  }

  /* ── textures ── */
  function resolveTex(b, t) {
    if (typeof t !== 'string' || !t) return null;
    const info = b.textures[t];
    // nineslice_size is in base_size units; the png can be a higher-resolution copy of that.
    if (info) return { url: 'ui/' + b.version + '/' + info.f, nine: info.nineslice_size, w: info.w, h: info.h,
      k: info.base_size && info.w ? info.w / info.base_size[0] : 1 };
    const m = /^textures\/(ui|items|blocks)\/(.+)$/.exec(t);
    if (m) {
      if (/^(White|white)$/.test(m[2])) return { color: '#fff' };
      if (/^(Black|black)$/.test(m[2])) return { color: '#000' };
      return { url: 'img/mc/' + m[1] + '__' + m[2] + '.png' };
    }
    return null;
  }

  /* ── DOM ── */
  function paint(b, n, hooks) {
    let d = document.createElement('div');
    d.className = 'ju';
    Object.assign(d.style, { left: n.x + 'px', top: n.y + 'px', width: n.w + 'px', height: n.h + 'px' });
    const p = n.p;
    // alpha belongs to the control's own drawing; children keep theirs unless propagate_alpha is set.
    const alpha = p.alpha != null && p.alpha !== '' && !isNaN(+p.alpha) ? Math.max(0, Math.min(1, +p.alpha)) : null;
    if (alpha != null && (p.propagate_alpha || n.type === 'label')) d.style.opacity = alpha;
    if (p.clips_children) d.style.overflow = 'hidden';
    if (Number(p.layer)) d.style.zIndex = Math.max(0, Math.round(Number(p.layer)));
    if (n.type === 'image') {
      // Paint on a layer of its own so a nine-slice border never shifts the children.
      const host = d;
      d = document.createElement('div');
      d.className = 'ju-img';
      if (alpha != null && !p.propagate_alpha) d.style.opacity = alpha;
      host.append(d);
      const t = n.tex;
      const tint = rgb(p.color);
      if (t && t.color) d.style.background = tint || t.color;
      else if (t && t.url) {
        const nine = p.nineslice_size != null ? p.nineslice_size : t.nine;
        const s9 = nine == null ? null : Array.isArray(nine) ? nine : [nine, nine, nine, nine];
        // A slice that leaves no centre (a 2x2 texture sliced at 1) is just the texture stretched.
        const centre = s9 && (!t.w || ((s9[0] + s9[2]) * t.k < t.w && (s9[1] + s9[3]) * t.k < t.h));
        if (s9 && centre && !p.uv) {
          const s = s9;
          d.style.borderStyle = 'solid';
          d.style.borderWidth = s[1] + 'px ' + s[2] + 'px ' + s[3] + 'px ' + s[0] + 'px';
          d.style.borderImage = 'url(' + t.url + ') ' + [s[1], s[2], s[3], s[0]].map((x) => x * t.k).join(' ') + ' fill stretch';
          d.style.boxSizing = 'border-box';
        } else if (p.uv && p.uv_size && t.w) {
          const sx = n.w / p.uv_size[0], sy = n.h / p.uv_size[1];
          d.style.backgroundImage = 'url(' + t.url + ')';
          d.style.backgroundSize = t.w * sx + 'px ' + t.h * sy + 'px';
          d.style.backgroundPosition = -p.uv[0] * sx + 'px ' + -p.uv[1] * sy + 'px';
        } else {
          d.style.backgroundImage = 'url(' + t.url + ')';
          d.style.backgroundSize = p.keep_ratio ? 'contain' : '100% 100%';
          if (p.tiled) d.style.backgroundSize = 'auto';
          d.style.backgroundRepeat = p.tiled ? 'repeat' : 'no-repeat';
          d.style.backgroundPosition = 'center';
        }
        if (tint && tint !== 'rgb(255,255,255)') {
          // Bedrock multiplies the texture by the colour; a mask of the texture filled with the colour matches it for the pack's white textures.
          d.style.backgroundColor = tint; d.style.backgroundBlendMode = 'multiply';
          d.style.webkitMaskImage = d.style.maskImage = 'url(' + t.url + ')';
          d.style.webkitMaskSize = d.style.maskSize = '100% 100%';
        }
      }
    } else if (n.type === 'label') {
      d.classList.add('ju-t');
      formatted(d, p.text == null ? '' : str(p.text));
      d.style.font = n.font;
      d.style.lineHeight = n.h + 'px';
      d.style.color = rgb(p.color) || '#fff';
      d.style.textAlign = p.text_alignment || 'left';
      if (p.shadow === true) d.style.textShadow = '1px 1px 0 rgba(0,0,0,.6)';
    } else if ((n.type === 'custom' || (/item_renderer|item_icon|_item$/.test(n.name) && !n.kids.length)) && hooks.custom) {
      // (vanilla's item_renderer control isn't in the pack, so a childless control by that name is one too)
      const c = hooks.custom(p.renderer || 'inventory_item_renderer', n);
      if (c) d.append(c);
    }
    const box = d.className === 'ju-img' ? d.parentNode : d;
    n.kids.filter((k) => !k.hidden).forEach((k) => box.append(paint(b, k, hooks)));
    return box;
  }

  function attachTextures(b, n) {
    if (n.type === 'image') n.tex = resolveTex(b, typeof n.p.texture === 'string' && n.p.texture[0] === '(' ? str(evaluate(n.p.texture, n.bound || {})) : n.p.texture);
    n.kids.forEach((k) => attachTextures(b, k));
  }

  /* render(version, path, get, opts): the module's DOM at w x h GUI px, or null when the bundle isn't loaded yet. */
  function render(version, path, get, opts) {
    const b = ready(version);
    if (!b || !path) return null;
    // Config variables are the outermost scope, like mod_menu_config in the pack.
    const vars = {};
    const cfg = b.idx.gc && b.idx.gc.mod_menu_config;
    if (cfg) for (const k in cfg[1]) if (k[0] === '$') vars[k.replace('|default', '')] = cfg[1][k];
    for (const k in vars) { const v = get(k + '|default', get(k, undefined)); if (v !== undefined) vars[k] = v; }
    const ctx = {
      control(name) {
        if (b.toggles[name]) { const v = vars[b.toggles[name]]; return { '#toggle_state': v === undefined ? false : truthy(v) }; }
        if (b.radios && b.radios[name]) { const [g, i] = b.radios[name]; return { '#toggle_state': num(vars[g] || 0) === num(i) }; }
        if (b.sliders[name]) { const v = vars[b.sliders[name]]; return { '#slider_value': v === undefined ? 7 : num(v) * 10 }; }
        if (/edit_hud/.test(name)) return { '#toggle_state': false };
        return { '#toggle_state': true, '#slider_value': 7 };
      },
    };
    // Walk the path: the top-level control, then named children.
    let found = lookup(b, path[0], vars);
    if (!found) return null;
    let key = found.key, body = found.body;
    let scope = vars;
    for (let i = 1; i < path.length; i++) {
      const inst = instance(b, key, body, scope);
      scope = inst.vars;
      const kid = (inst.props.controls || []).map((c) => Object.entries(c)[0]).find((e) => e && e[0].split('@')[0] === path[i]);
      if (!kid) return null;
      [key, body] = kid;
    }
    const node = build(b, key, body, scope, {}, ctx, 0);
    if (!node) return null;
    bindAll(node, ctx);
    node.hidden = false;
    attachTextures(b, node);
    sizeOf(node, opts.w, opts.h);
    node.x = 0; node.y = 0;
    const out = paint(b, node, opts.hooks || {});
    out.style.position = 'relative';
    out.style.left = out.style.top = '0';
    out.classList.add('ju-root');
    return { el: out, node };
  }

  window.GlacierJsonUi = { load, ready, render, evaluate };
})();
