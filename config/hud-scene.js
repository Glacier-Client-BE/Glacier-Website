/* HUD preview renderer for the Glacier config editor.
   Draws a Bedrock HUD the way Glacier shows it, using the packs' own assets (img/gl: digit strips, status / day-time
   labels, bow and chunk sprites, hotbar + XP bar) on top of the vanilla textures (img/mc), with the version's own
   numbers. All data below was read from the released packs (Glacier Client V4, V5.1, V6): module drag sizes, labels,
   box heights and which text/sprites each module draws. Everything is laid out in GUI pixels; the editor scales it.
   The shared look in all three versions is the pack's underlined_base_bg: solid black at the module's opacity with a
   #7289da underline, labels in Inter Medium. Values are sample data (the game fills them from the player entity). */
(function () {
  'use strict';

  const MC = (n) => 'img/mc/' + n;
  const GL = (n) => 'img/gl/' + n;
  const SAMPLE = { pos: [12, 64, -30], chunk: [0, 4, -2], nether: [1, 64, -4], fps: 120, speed: 8.52, walked: 1284, yaw: 35,
    slot: 1, day: 12, health: 20, targetDist: 6, targetHp: 18, level: 30, timer: '00:12:34', server: 'localhost' };

  /* ── per-version module specs (from each pack's hud_modules JSON) ──
     size: the module's drag size [w, h]; h is the pack's box height (V4/V5 use 18, V6 uses 16). `auto` widths are
     the content width of the sample data. label: the text the pack puts in front of the value. */
  const H = { v4: 18, v5: 18, v6: 16 };
  function specFor(v) {
    const h = H[v] || 16;
    const s = {
      fpscounter: { w: 60, h, label: 'Fps:' },
      speedometer: { w: 60, h },
      walkdistance: { w: 100, h, label: v === 'v4' ? 'Distance Walked:' : 'Walked:' },
      dayevent: { w: 60, h },
      daycounter: { w: 60, h, label: 'Day:' },
      statushud: { w: 60, h },
      slotcounter: { w: 60, h, label: 'Slot:' },
      timerhud: { w: 60, h },
      forcecoords: { w: v === 'v4' ? 94 : 70, h: v === 'v4' ? 50 : 40, label: v === 'v4' ? 'Coordinates:' : null },
      targethud: { w: 70, h: 35 },
      directionhud: { w: 163, h: v === 'v4' ? 18 : 17 },
      offhandhud: { w: 20, h: 20 },
      bowindicator: { w: 24, h: 24 },
      armorhud: v === 'v6' ? { w: 32, h: 64 } : { w: v === 'v5' ? 16 : 20, h: 70 },
      expcalculator: { w: 78, h, label: v === 'v4' ? 'Lvl:' : 'Level:' },
      mainhandhud: { w: 112, h: 17 },
      serverdisplay: { w: 74, h },
      clockcompass: v === 'v5' ? { w: 18, h: 52 } : { w: 56, h },
      creeperrange: { w: 90, h, label: 'Creeper Range:' },
      lowdurability: { w: 120, h },
      chunkmap: { w: 64, h: 64 },
      inventoryhud: { w: 144, h: 48 },
      coordinates: { w: 64, h: 32 },
      playerlist: { w: 18, h: 18 },
      f1button: { w: 18, h: 18 },
      f8button: { w: 18, h: 18 },
      hotbar_left_button: { w: 22, h: 22 },
      hotbar_right_button: { w: 22, h: 22 },
      playerlist_mobile_button: { w: 18, h: 18 },
      bossbar: { w: 200, h: 20 },
      scoreboard: { w: 90, h: 60 },
    };
    return s;
  }
  // Drag size: from the pack's own JSON UI when it's loaded (the module's root control), else the table above.
  const jsonSizes = {};
  function sizeFor(v, id) {
    const s = specFor(v)[id];
    const J = window.GlacierJsonUi;
    const b = J && J.ready(v);
    if (b && b.modules[id] && !ENTITY_DRAWN.has(id)) {
      const k = v + '|' + id;
      if (!(k in jsonSizes)) {
        let r = null;
        try { r = J.render(v, b.modules[id], (key, d) => d, { w: s ? s.w : 64, h: s ? s.h : 16, hooks: {} }); } catch (e) { /* keep the table size */ }
        jsonSizes[k] = r && r.node.w > 0 && r.node.h > 0 ? { w: Math.round(r.node.w), h: Math.round(r.node.h) } : null;
      }
      if (jsonSizes[k]) return jsonSizes[k];
    }
    return s ? { w: s.w, h: s.h } : null;
  }

  /* ── tiny DOM helpers ── */
  function el(cls, css, ...kids) {
    const d = document.createElement('div');
    if (cls) d.className = cls;
    if (css) Object.assign(d.style, css);
    for (const k of kids.flat()) if (k != null) d.append(k.nodeType ? k : document.createTextNode(k));
    return d;
  }
  function img(src, w, h, css) {
    const i = document.createElement('img');
    i.src = src; i.width = w; i.height = h; i.alt = ''; i.draggable = false; i.className = 'hs-px';
    if (css) Object.assign(i.style, css);
    return i;
  }
  const mc = (f, w, h, css) => img(MC(f), w, h, css);
  const gl = (f, w, h, css) => img(GL(f), w, h, css);
  const ANCHOR = { top_left: [0, 0], top_middle: [.5, 0], top_right: [1, 0], left_middle: [0, .5], middle: [.5, .5], center: [.5, .5],
    right_middle: [1, .5], bottom_left: [0, 1], bottom_middle: [.5, 1], bottom_right: [1, 1] };
  function place(n, anchor, off) {
    const [ax, ay] = ANCHOR[anchor] || ANCHOR.top_left;
    n.style.position = 'absolute';
    n.style.left = ax * 100 + '%'; n.style.top = ay * 100 + '%';
    n.style.transform = 'translate(calc(' + (-ax * 100) + '% + ' + ((off && off[0]) || 0) + 'px), calc(' + (-ay * 100) + '% + ' + ((off && off[1]) || 0) + 'px))';
    return n;
  }

  // Glacier's digit strips: 6 positions (rows) x digits 0-9 (36x7 strips, glyph 5px wide every 6px).
  function digits(value, minPos) {
    const s = String(Math.abs(Math.round(value)));
    const n = Math.max(s.length, minPos || 0);
    const off = value < 0 ? 1 : 0;               // a minus sign takes the first position
    const wrap = el('hs-digits', { width: (n + off - 1) * 6 + 5 + 'px' });
    if (off) wrap.append(el('hs-dg hs-neg', { left: '0' }));
    const pad = s.padStart(n, ' ');
    for (let i = 0; i < n; i++) {
      if (pad[i] === ' ') continue;
      wrap.append(el('hs-dg', { backgroundPosition: '-' + Number(pad[i]) * 36 + 'px -' + (i + off) * 7 + 'px', left: '0' }));
    }
    return wrap;
  }

  /* ── vanilla scene with Glacier's hotbar, XP bar and crosshair ── */
  /* ── scene settings (read from the pack's own config keys) ── */
  // Exp bar colour preset (glacier_exp_bar_settings): 1 = vanilla, then these folders; 9 = chroma.
  const XP_COLORS = { 2: 'blue', 3: 'red', 4: 'pink', 5: 'yellow', 6: 'orange', 7: 'purple', 8: 'white', 9: 'rgb' };
  // Crosshair colour preset (glacier_crosshairs_settings): 1 = texture as drawn; 9 = chroma.
  const CROSS_COLORS = { 2: '#000000', 3: '#ff0000', 4: '#0000ff', 5: '#ffff00', 6: '#ff8000', 7: '#a020f0', 8: '#00ff00', 9: 'rgb' };
  // Screen tint ("display") toggles and their colours (glacier_saturation_display.json). V4/V5 call them *_saturation.
  const TINTS = [['brighter', [1, 1, 1]], ['red', [1, .333, .333]], ['yellow', [1, 1, .333]], ['aqua', [.333, 1, 1]], ['blue', [.333, .333, 1]],
    ['orange', [1, .5, 0]], ['purple', [.627, .125, .941]], ['green', [.333, 1, .333]]];
  const CROSSHAIR_COUNT = { v4: 27, v5: 33, v6: 33 };
  const SCENE_KEYS = ['$hotbar_toggle_index', '$exp_bar_color_default_preset_index', '$show_xp_percentage', '$hide_xp_level', '$xp_level_opacity|default',
    '$crosshair_default_preset_index', '$crosshair_size|default', '$crosshair_color_default_preset_index', '$show_crosshair_outlines',
    '$hide_crosshair', '$rgb_crosshair', '$display_opacity|default', '$brighter'].concat(
    TINTS.flatMap(([n]) => ['$' + n + '_display', '$' + n + '_saturation']));
  // Anything that changes the scene; the editor rebuilds the scene only when this string changes.
  const sceneKey = (get) => SCENE_KEYS.map((k) => JSON.stringify(get(k, null))).join('|');

  // Nine-sliced strip like the game draws it (slice = [left, top, right, bottom] from the texture's .json).
  function nine(src, w, h, slice, css) {
    const [l, t, r, b] = slice;
    return el('hs-nine', Object.assign({ width: w + 'px', height: h + 'px',
      borderStyle: 'solid', borderWidth: t + 'px ' + r + 'px ' + b + 'px ' + l + 'px',
      borderImage: 'url(' + src + ') ' + t + ' ' + r + ' ' + b + ' ' + l + ' fill stretch' }, css || {}));
  }

  function hotbar(get) {
    // Hotbar style (glacier_hotbar_settings): 1 = vanilla, 2 = connected, 3 = RGB, 4 = Glacier.
    const type = Number(get('$hotbar_toggle_index', 1)) || 1;
    const items = ['items__diamond_sword.png', 'items__apple.png', 'items__apple_golden.png', 'items__beef_cooked.png', 'items__bread.png',
      'items__iron_pickaxe.png', 'items__ender_pearl.png', 'items__experience_bottle.png', 'items__compass_item.png'];
    const vanilla = type === 1;
    const bar = place(el('hs-abs', { width: (vanilla ? 182 : 180) + 'px', height: '22px' }), 'bottom_middle', [0, 0]);
    const x0 = vanilla ? 1 : 0;
    if (vanilla) {
      bar.append(mc('ui__hotbar_start_cap.png', 1, 22, { position: 'absolute', left: 0 }));
      for (let i = 0; i < 9; i++) bar.append(mc('ui__hotbar_' + i + '.png', 20, 22, { position: 'absolute', left: 1 + i * 20 + 'px' }));
      bar.append(mc('ui__hotbar_end_cap.png', 1, 22, { position: 'absolute', left: '181px' }));
    } else if (type === 2) {
      bar.append(gl('connected_hotbar.png', 180, 22, { position: 'absolute', left: 0, opacity: .7 }));
    } else {
      const rgb = ['#ff4040', '#ff9f40', '#ffff40', '#40ff70', '#40c8ff', '#9a60ff'];
      for (let i = 0; i < 9; i++) {
        if (type === 3) {
          bar.append(el('hs-tint', { left: i * 20 - .5 + 'px', top: '-.5px', width: '21px', height: '23px',
            maskImage: 'url(' + GL('default_hotbar.png') + ')', WebkitMaskImage: 'url(' + GL('default_hotbar.png') + ')', background: rgb[(8 - i) % 6] }));
        } else {
          bar.append(el('hs-ub hs-slotbg', { left: i * 20 + 'px', top: '1px', width: '19.5px', height: '20px', '--a': .65 }));
        }
      }
    }
    items.forEach((f, i) => bar.append(mc(f, 16, 16, { position: 'absolute', left: x0 + 2 + i * 20 + 'px', top: '3px', zIndex: 1 })));
    bar.append(mc('ui__selected_hotbar_slot.png', 24, 24, { position: 'absolute', left: x0 - 1 + 'px', top: '-1px', zIndex: 2 }));
    return bar;
  }

  function xpBar(get) {
    const color = XP_COLORS[Number(get('$exp_bar_color_default_preset_index', 1))];
    const xp = place(el('hs-abs', { width: '182px', height: '5px' }), 'bottom_middle', [0, -24]);
    const fill = el('hs-abs', { left: 0, top: 0, width: '77px', height: '5px', overflow: 'hidden' });
    if (!color) {
      xp.append(mc('ui__experiencebarempty.png', 182, 5, { position: 'absolute' }));
      fill.append(mc('ui__experiencebarfull.png', 182, 5));
    } else {
      const c = color === 'rgb' ? 'white' : color;
      xp.append(nine(GL('xp/' + c + '_empty.png'), 182, 5, [6, 1, 6, 1], { position: 'absolute', left: 0, top: 0 }));
      fill.append(nine(GL('xp/' + c + '_full.png'), 182, 5, [1, 0, 1, 0]));
      if (color === 'rgb') fill.append(el('hs-chroma-overlay'));
    }
    xp.append(fill);
    const parts = [xp];
    if (!get('$hide_xp_level', false)) {
      const lvl = place(el('hs-lvl', null, String(SAMPLE.level)), 'bottom_middle', [0, -29]);
      const op = get('$xp_level_opacity|default', null);
      if (op != null) lvl.style.opacity = Math.max(.15, Number(op));
      parts.push(lvl);
    }
    if (get('$show_xp_percentage', false)) parts.push(place(el('hs-t hs-xppct', null, '42%'), 'bottom_middle', [100, -24]));
    return parts;
  }

  function crosshair(get, version) {
    if (get('$hide_crosshair', false)) return null;
    const max = CROSSHAIR_COUNT[version] || 33;
    const idx = Math.min(max, Math.max(1, Math.round(Number(get('$crosshair_default_preset_index', 1)) || 1)));
    const src = GL('crosshairs/' + idx + '.png');
    const size = Number(get('$crosshair_size|default', .5));
    const px = Math.max(4, Math.round(15 * (isFinite(size) ? size : .5) * 2));
    let color = CROSS_COLORS[Number(get('$crosshair_color_default_preset_index', 1))];
    if (get('$rgb_crosshair', false)) color = 'rgb';
    const draw = (c, dx, dy) => {
      const css = { width: px + 'px', height: px + 'px', left: dx + 'px', top: dy + 'px' };
      if (!c) return el('hs-cross-img', Object.assign(css, { backgroundImage: 'url(' + src + ')' }));
      return el('hs-tint' + (c === 'rgb' ? ' hs-chroma' : ''), Object.assign(css,
        { maskImage: 'url(' + src + ')', WebkitMaskImage: 'url(' + src + ')' }, c === 'rgb' ? {} : { background: c }));
    };
    const wrap = place(el('hs-abs', { width: px + 'px', height: px + 'px' }), 'center');
    if (get('$show_crosshair_outlines', false)) [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => wrap.append(draw('#000000', dx, dy)));
    wrap.append(draw(color, 0, 0));
    return wrap;
  }

  function tint(get) {
    const on = TINTS.filter(([n]) => (n === 'brighter' ? get('$brighter', false) : get('$' + n + '_display', false) || get('$' + n + '_saturation', false)));
    if (!on.length) return null;
    const amount = Number(get('$display_opacity|default', 1));
    const alpha = Math.min(.8, .2 * Math.max(1, isFinite(amount) ? amount : 1));
    const layer = el('hs-abs', { inset: '0', pointerEvents: 'none' });
    on.forEach(([, [r, g, b]]) => layer.append(el('hs-abs', { inset: '0',
      background: 'rgba(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ',' + alpha + ')' })));
    return layer;
  }

  /* ── vanilla scene + Glacier's hotbar / XP bar / crosshair / screen tint, all driven by the config ── */
  function buildScene(w, h, get, version) {
    get = get || ((k, d) => d);
    const s = el('hs-scene', { width: w + 'px', height: h + 'px' });
    s.append(el('hs-sky'), el('hs-ground', { top: Math.round(h * 0.56) + 'px' }));
    const t = tint(get);
    if (t) s.append(t);
    s.append(hotbar(get), ...xpBar(get));

    const cx = w / 2;
    const row = (n, y, side, bg, fg, half) => {
      for (let i = 0; i < 10; i++) {
        const x = side === 'l' ? cx - 91 + i * 8 : cx + 91 - 9 - i * 8;
        const wrap = el('hs-abs', { left: x + 'px', bottom: y + 'px', width: '9px', height: '9px' }, mc(bg, 9, 9));
        if (i < n) wrap.append(mc(fg, 9, 9, { position: 'absolute', left: 0, top: 0 }));
        else if (half && i === n) wrap.append(mc(half, 9, 9, { position: 'absolute', left: 0, top: 0 }));
        s.append(wrap);
      }
    };
    row(10, 30, 'l', 'ui__heart_background.png', 'ui__heart.png');
    row(8, 40, 'l', 'ui__armor_empty.png', 'ui__armor_full.png');
    row(8, 30, 'r', 'ui__hunger_background.png', 'ui__hunger_full.png', 'ui__hunger_half.png');
    const ch = crosshair(get, version);
    if (ch) s.append(ch);
    return s;
  }

  /* ── module drawings ── */
  // The pack's underlined_base_bg: black at the module's opacity, 2px accent underline.
  function ub(c, ...kids) {
    const b = el('hs-ub', { width: c.w + 'px', height: c.h + 'px' }, ...kids);
    b.style.setProperty('--a', c.op);
    return b;
  }
  const txt = (s, css) => el('hs-t', css, s);
  const lab = (s) => txt(s);
  const num = (n) => Number(n).toLocaleString('en-US');
  const fix = (n, d) => Number(n).toFixed(d);
  // label + value on one baseline, left aligned like the pack's left_middle label
  const line = (label, value) => el('hs-line', null, label ? lab(label) : null, value);

  const MODS = {
    fpscounter: (c) => ub(c, el('hs-split', null, lab(c.s.label), digits(SAMPLE.fps))),
    slotcounter: (c) => ub(c, el('hs-split', null, lab(c.s.label), txt(String(SAMPLE.slot)))),
    walkdistance: (c) => ub(c, el('hs-split', null, lab(c.s.label), digits(SAMPLE.walked))),
    speedometer: (c) => ub(c, el('hs-split', null, el('hs-line', null, digits(Math.floor(SAMPLE.speed)), txt('.'), digits(Math.round((SAMPLE.speed % 1) * 100), 2)), lab('m/s'))),
    daycounter: (c) => ub(c, el('hs-split', null, lab(c.s.label), digits(SAMPLE.day))),
    dayevent: (c) => ub(c, el('hs-center', null, gl('day.png', 40, 10))),
    statushud: (c) => ub(c, el('hs-center', null, gl('standing.png', 53, 8))),
    timerhud: (c) => ub(c, el('hs-center', null, txt(SAMPLE.timer))),
    serverdisplay: (c) => ub(c, line(null, el('hs-line', null, gl('server_localhost.png', 12, 12), txt(SAMPLE.server)))),
    expcalculator: (c) => ub(c, el('hs-split', null, lab(c.s.label), txt(String(SAMPLE.level)))),
    creeperrange: (c) => ub(c, el('hs-split', null, lab(c.s.label), digits(7))),
    lowdurability: (c) => ub(c, el('hs-center', null, txt('Item Durability Low!', { color: '#ff5555' }))),
    clockcompass: (c) => ub(c, el('hs-center', { gap: '4px' }, mc('items__clock_item.png', 12, 12), mc('items__compass_item.png', 12, 12))),
    mainhandhud: (c) => ub(c, line(null, el('hs-line', null, mc('items__diamond_sword.png', 13, 13), txt('Diamond Sword')))),
    targethud: (c) => ub(c, el('hs-col', { width: '100%' },
      el('hs-split', { width: '100%' }, lab('Distance:'), digits(SAMPLE.targetDist)),
      el('hs-gap'),
      el('hs-split', { width: '100%' }, lab('Health:'), digits(SAMPLE.targetHp)))),
    forcecoords: (c) => {
      const rows = [['X:', SAMPLE.pos[0]], ['Y:', SAMPLE.pos[1]], ['Z:', SAMPLE.pos[2]]];
      const col = el('hs-col', { gap: '1px' });
      if (c.s.label) col.append(lab(c.s.label));
      rows.forEach(([l, v]) => col.append(el('hs-split', { width: '100%' }, lab(l), digits(v))));
      return ub(c, col);
    },
    coordinates: (c) => {
      const lines = [];
      if (!c.get('$hide_vanillacordinates', false)) lines.push('Position: ' + SAMPLE.pos.join(', '));
      if (!c.get('$hide_chunkcoordinates', false)) lines.push('Chunk: ' + SAMPLE.chunk.join(', '));
      if (!c.get('$hide_nethercoordinates', false)) lines.push('Nether: ' + SAMPLE.nether.join(', '));
      if (!lines.length) lines.push('Position: ' + SAMPLE.pos.join(', '));
      const b = el('hs-black', null, el('hs-col', { gap: '1px' }, lines.map((l) => txt(l))));
      b.style.setProperty('--a', c.op);
      return b;
    },
    directionhud: (c) => {
      // [rotation box 25px] + [compass bar 138px]
      const heading = ((SAMPLE.yaw % 360) + 360) % 360;
      const barW = c.w - 25;
      const tape = el('hs-tape', { width: barW + 'px', height: c.h + 'px' });
      // glacier_directionhud.png: 192px wide for a full turn, N at x=0; repeat it and centre the current heading.
      const px = heading / 360 * 192;
      tape.append(el('hs-dirtape', { backgroundImage: 'url(' + GL('directionhud.png') + ')',
        backgroundPosition: (barW / 2 - px) + 'px 2px' }));
      tape.append(el('hs-needle', { left: barW / 2 + 'px', height: c.h + 'px' }));
      const rot = ub({ w: 25, h: c.h, op: c.op }, el('hs-split', { width: '100%', justifyContent: 'flex-end' }, digits(heading)));
      const bar = ub({ w: barW, h: c.h, op: c.op }, tape);
      bar.style.padding = '0';
      return el('hs-hrow', { width: c.w + 'px', height: c.h + 'px' }, rot, bar);
    },
    armorhud: (c) => {
      const pieces = [['helmet', .92], ['chestplate', .64], ['leggings', .78], ['boots', .45]];
      const underline = c.v !== 'v6'; // V4/V5 armor sits on the module box; V6 draws the stack bare
      const col = el('hs-col', { gap: '0', width: '100%', height: '100%' });
      pieces.forEach(([p, f]) => {
        const cell = el('hs-abs', { position: 'relative', width: '100%', height: (c.h / 4) + 'px' });
        cell.append(mc('items__netherite_' + p + '.png', 16, 16, { position: 'absolute', left: '0', top: '0' }));
        cell.append(el('hs-dur-bg', { left: '1px', top: '12px' }), el('hs-dur', { left: '1px', top: '12px', width: Math.max(1, Math.round(13 * f)) + 'px', background: 'hsl(' + Math.round(f * 120) + ' 100% 50%)' }));
        col.append(cell);
      });
      return underline ? ub(c, col) : el('hs-fill', { width: c.w + 'px', height: c.h + 'px' }, col);
    },
    offhandhud: (c) => ub(c, el('hs-center', null, mc('items__totem.png', 16, 16))),
    bowindicator: (c) => ub(c, el('hs-center', null, gl('bow_standby.png', 16, 16))),
    chunkmap: (c) => {
      const g = el('hs-chunks', { width: c.w + 'px', height: c.h + 'px' });
      for (let i = 0; i < 16; i++) g.append(gl('chunk_border.png', 16, 16));
      g.append(gl('player_indicator.png', 7, 7, { position: 'absolute', left: '28px', top: '28px' }));
      return g;
    },
    inventoryhud: (c) => {
      const g = el('hs-invgrid');
      for (let i = 0; i < 27; i++) g.append(el('hs-slot', null, i % 5 === 0 ? mc('items__bread.png', 10, 10) : null));
      return el('hs-fill', { width: c.w + 'px', height: c.h + 'px' }, g);
    },
    // touch buttons use the pack's ore_ui_button (grey bevel), not the underlined base
    f1button: (c) => btn(c, txt('F1', { color: '#000' })),
    f8button: (c) => btn(c, txt('F8', { color: '#000' })),
    hotbar_left_button: (c) => btn(c, txt('<', { color: '#000' })),
    hotbar_right_button: (c) => btn(c, txt('>', { color: '#000' })),
    playerlist_mobile_button: (c) => btn(c, gl('player_list.png', 9, 9)),
    bossbar: (c) => ub(c, el('hs-col', { gap: '2px', width: '100%', alignItems: 'center' },
      txt('Ender Dragon'),
      el(null, { width: '182px', height: '5px', background: '#000', position: 'relative' },
        el(null, { width: '62%', height: '100%', background: '#b03ec4' })))),
    scoreboard: (c) => {
      const rows = [['Kills', 12], ['Deaths', 3], ['Coins', 450], ['Level', 30]];
      const col = el('hs-col', { gap: '1px', width: '100%' }, el('hs-center', { fontWeight: 'bold' }, txt('SCOREBOARD')));
      rows.forEach(([l, v]) => col.append(el('hs-split', { width: '100%' }, lab(l), txt(num(v), { color: '#ff5555' }))));
      return ub(c, col);
    },
  };
  // ore_ui_button look: light grey face with a dark bevel, centred content
  function btn(c, child) {
    // The pack's ore_ui_button texture, stretched to the button size like the game does.
    return el('hs-center hs-ore', { width: c.w + 'px', height: c.h + 'px', backgroundImage: 'url(' + GL('ore_ui_button.png') + ')' }, child);
  }

  /* ── modules from the pack's own JSON UI (jsonui.js) ──
     Entity modules draw their number with a paper doll renderer (an entity whose geometry shows the value); the
     browser can't run that, so the value is drawn with the pack's digit strip right after the module's label.
     Entity modules that are mostly entity geometry keep the hand-made drawing above. */
  const ENTITY_VALUE = {
    fpscounter: () => digits(SAMPLE.fps),
    walkdistance: () => digits(SAMPLE.walked),
    daycounter: () => digits(SAMPLE.day),
    creeperrange: () => digits(7),
  };
  const ENTITY_DRAWN = new Set(['directionhud', 'targethud', 'forcecoords', 'dayevent', 'statushud', 'bowindicator', 'offhandhud', 'speedometer', 'timerhud',
    // drawn by the game itself (live player renderer, vanilla boss bar / scoreboard factories)
    'armorhud', 'bossbar', 'scoreboard']);
  const ITEM_ICON = (name) => MC('items__' + name + '.png');

  function fromJsonUi(id, version, get, s) {
    const J = window.GlacierJsonUi;
    const b = J && J.ready(version);
    if (!b || !b.modules[id] || ENTITY_DRAWN.has(id)) return null;
    let paperDoll = false;
    const hooks = {
      custom(renderer, n) {
        if (renderer === 'paper_doll_renderer' || renderer === 'live_player_renderer') { paperDoll = true; return null; }
        if (renderer === 'inventory_item_renderer') {
          // Collection slots carry their sample item; fixed renderers (clock & compass) are named after their item.
          const item = (n.data && n.data['#item_id_aux'] !== -1 && n.data['#item']) || (/clock/.test(n.name) ? 'clock_item' : /compass/.test(n.name) ? 'compass_item' : null);
          if (item) return img(ITEM_ICON(item), n.w, n.h, { position: 'absolute', inset: 0, width: '100%', height: '100%' });
        }
        return null;
      },
    };
    let r;
    try { r = J.render(version, b.modules[id], get, { w: s.w, h: s.h, hooks }); } catch (e) { console.warn('jsonui', id, e); return null; }
    if (!r) return null;
    if (paperDoll && ENTITY_VALUE[id]) {
      // Glacier's entity numbers are right aligned in the box, vertically centred.
      const v = ENTITY_VALUE[id]();
      Object.assign(v.style, { position: 'absolute', right: '2px', top: '50%', transform: 'translateY(-50%)', zIndex: 20 });
      r.el.append(v);
    }
    return r.el;
  }

  /* drawModule(id, version, get): the module's drawing at its drag size for that Glacier version. */
  function drawModule(id, version, get) {
    const s = specFor(version)[id] || { w: 64, h: 16 };
    const ju = fromJsonUi(id, version, get, s);
    if (ju) return ju;
    const fn = MODS[id];
    const op = Number(get('$' + id + '_opacity|default', 0.7));
    const c = { get, v: version, s, w: s.w, h: s.h, op: isFinite(op) ? op : 0.7 };
    if (fn) return fn(c);
    return ub(c, el('hs-center', null, txt(id)));
  }

  window.GlacierHud = { buildScene, sceneKey, crosshairCount: (v) => CROSSHAIR_COUNT[v] || 33, drawModule, sizeFor, has: (id) => !!MODS[id] };
})();
