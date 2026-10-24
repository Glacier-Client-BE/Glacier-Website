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
    };
    return s;
  }
  const sizeFor = (v, id) => { const s = specFor(v)[id]; return s ? { w: s.w, h: s.h } : null; };

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
  function buildScene(w, h) {
    const s = el('hs-scene', { width: w + 'px', height: h + 'px' });
    s.append(el('hs-sky'), el('hs-ground', { top: Math.round(h * 0.56) + 'px' }));

    // Glacier "base bg" hotbar: nine black slots with the accent underline; the selected slot gets the white frame.
    const bar = place(el('hs-abs', { width: '180px', height: '22px' }), 'bottom_middle', [0, 0]);
    const items = ['items__diamond_sword.png', 'items__apple.png', 'items__apple_golden.png', 'items__beef_cooked.png', 'items__bread.png',
      'items__iron_pickaxe.png', 'items__ender_pearl.png', 'items__experience_bottle.png', 'items__compass_item.png'];
    items.forEach((f, i) => {
      const cell = el('hs-abs', { left: i * 20 + 'px', top: 0, width: '20px', height: '22px' });
      cell.append(el('hs-ub hs-slotbg', { left: '0', top: '1px', width: '19.5px', height: '20px', '--a': .65 }));
      cell.append(mc(f, 16, 16, { position: 'absolute', left: '2px', top: '3px' }));
      bar.append(cell);
    });
    bar.append(gl('default_hotbar.png', 21, 23, { position: 'absolute', left: '-0.5px', top: '-0.5px', zIndex: 2 }));
    s.append(bar);

    // XP: 14 blue segments (13x5) with a nub; ~42% full
    const xp = place(el('hs-abs', { width: '182px', height: '5px' }), 'bottom_middle', [0, -26]);
    for (let i = 0; i < 14; i++) xp.append(gl(i < 6 ? 'blue_full.png' : 'blue_empty.png', 13, 5, { position: 'absolute', left: i * 13 + 'px', top: 0 }));
    s.append(xp, place(el('hs-lvl', null, String(SAMPLE.level)), 'bottom_middle', [0, -31]));

    const cx = w / 2;
    const row = (n, y, side, bg, fg, half) => {
      for (let i = 0; i < 10; i++) {
        const x = side === 'l' ? cx - 90 + i * 8 : cx + 90 - 9 - i * 8;
        const wrap = el('hs-abs', { left: x + 'px', bottom: y + 'px', width: '9px', height: '9px' }, mc(bg, 9, 9));
        if (i < n) wrap.append(mc(fg, 9, 9, { position: 'absolute', left: 0, top: 0 }));
        else if (half && i === n) wrap.append(mc(half, 9, 9, { position: 'absolute', left: 0, top: 0 }));
        s.append(wrap);
      }
    };
    row(10, 32, 'l', 'ui__heart_background.png', 'ui__heart.png');
    row(8, 42, 'l', 'ui__armor_empty.png', 'ui__armor_full.png');
    row(8, 32, 'r', 'ui__hunger_background.png', 'ui__hunger_full.png', 'ui__hunger_half.png');
    s.append(place(gl('1.png', 15, 15), 'center'));
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
    fpscounter: (c) => ub(c, line(c.s.label, digits(SAMPLE.fps))),
    slotcounter: (c) => ub(c, el('hs-split', null, lab(c.s.label), txt(String(SAMPLE.slot)))),
    walkdistance: (c) => ub(c, el('hs-split', null, lab(c.s.label), digits(SAMPLE.walked))),
    speedometer: (c) => ub(c, el('hs-split', null, el('hs-line', null, digits(Math.floor(SAMPLE.speed)), txt('.'), digits(Math.round((SAMPLE.speed % 1) * 100), 2)), lab('m/s'))),
    daycounter: (c) => ub(c, line(c.s.label, digits(SAMPLE.day))),
    dayevent: (c) => ub(c, el('hs-center', null, gl('day.png', 40, 10))),
    statushud: (c) => ub(c, el('hs-center', null, gl('standing.png', 53, 8))),
    timerhud: (c) => ub(c, el('hs-center', null, txt(SAMPLE.timer))),
    serverdisplay: (c) => ub(c, line(null, txt(SAMPLE.server))),
    expcalculator: (c) => ub(c, el('hs-split', null, lab(c.s.label), txt(String(SAMPLE.level)))),
    creeperrange: (c) => ub(c, el('hs-split', null, lab(c.s.label), digits(7))),
    lowdurability: (c) => ub(c, el('hs-center', null, txt('Item Durability Low!', { color: '#ff5555' }))),
    clockcompass: (c) => ub(c, el('hs-center', { gap: '4px' }, mc('items__clock_item.png', 12, 12), mc('items__compass_item.png', 12, 12))),
    mainhandhud: (c) => ub(c, line(null, el('hs-line', null, mc('items__diamond_sword.png', 13, 13), txt('Diamond Sword')))),
    targethud: (c) => ub(c, el('hs-col', null,
      el('hs-line', null, lab('Distance:'), digits(SAMPLE.targetDist)),
      el('hs-gap'),
      el('hs-line', null, lab('Health:'), digits(SAMPLE.targetHp)))),
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
      const names = { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW' };
      const heading = ((SAMPLE.yaw % 360) + 360) % 360;
      const barW = c.w - 25;
      const tape = el('hs-tape', { width: barW + 'px', height: c.h + 'px' });
      for (let a = Math.ceil((heading - 66) / 5) * 5; a <= heading + 66; a += 5) {
        const deg = ((a % 360) + 360) % 360;
        const x = barW / 2 + (a - heading);
        const major = deg % 45 === 0;
        tape.append(el('hs-tick', { left: x + 'px', height: major ? '5px' : '3px' }));
        if (major) tape.append(el('hs-t', { position: 'absolute', left: x + 'px', top: '5px', transform: 'translateX(-50%)', color: deg === 0 ? '#ff5555' : '#fff' }, names[deg]));
      }
      tape.append(el('hs-needle', { left: barW / 2 + 'px', height: c.h + 'px' }));
      const rot = ub({ w: 25, h: c.h, op: c.op }, el('hs-center', null, digits(heading)));
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
    f1button: (c) => ub(c, el('hs-center', null, txt('F1'))),
    f8button: (c) => ub(c, el('hs-center', null, txt('F8'))),
    playerlist: (c) => ub(c, el('hs-center', null, txt('TAB'))),
  };

  /* drawModule(id, version, get): the module's drawing at its drag size for that Glacier version. */
  function drawModule(id, version, get) {
    const s = specFor(version)[id] || { w: 64, h: 16 };
    const fn = MODS[id];
    const op = Number(get('$' + id + '_opacity|default', 0.7));
    const c = { get, v: version, s, w: s.w, h: s.h, op: isFinite(op) ? op : 0.7 };
    if (fn) return fn(c);
    return ub(c, el('hs-center', null, txt(id)));
  }

  window.GlacierHud = { buildScene, drawModule, sizeFor, has: (id) => !!MODS[id] };
})();
