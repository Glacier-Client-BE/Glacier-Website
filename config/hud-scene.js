/* HUD preview renderer for the Glacier config editor.
   Draws a vanilla Bedrock HUD from real textures (img/mc/*) and renders each Glacier module the way the pack draws it:
   black box at the module's opacity with the accent underline (the pack's underlined_base_bg), the pack's own labels
   (texts/en_US.lang: "Fps:", "Walked:", "Distance:"...), box sizes from each module's drag size in the pack's JSON UI.
   Everything is laid out in GUI pixels; the editor scales the whole scene. Modules read their settings through
   `get(key, fallback)`, so only what the selected Glacier version's config actually contains is drawn, with the
   version's own values (opacity, hide_* flags...). Modules without a drawing here still show as a labelled box. */
(function () {
  'use strict';

  const T = (n) => 'img/mc/' + n;
  const ACCENT = '#7289da';
  const SAMPLE = { pos: [12, 64, -30], chunk: [0, 4, -2], nether: [1, 64, -4], death: [-37, 70, 10], fps: 120, speed: 8.52,
    walked: 1284, yaw: 35, slot: 1, day: 12, health: 20, target: { d: 6.4, hp: 18 }, level: 30, xp: 1395, timer: '00:12:34',
    server: 'play.example.net' };

  /* ── tiny DOM helpers ── */
  function el(cls, css, ...kids) {
    const d = document.createElement('div');
    if (cls) d.className = cls;
    if (css) Object.assign(d.style, css);
    for (const k of kids.flat()) if (k != null) d.append(k.nodeType ? k : document.createTextNode(k));
    return d;
  }
  function img(file, w, h, css) {
    const i = document.createElement('img');
    i.src = T(file); i.width = w; i.height = h; i.alt = ''; i.draggable = false; i.className = 'hs-px';
    if (css) Object.assign(i.style, css);
    return i;
  }
  const abs = (n, x, y) => { n.style.position = 'absolute'; n.style.left = x + 'px'; n.style.top = y + 'px'; return n; };
  const ANCHOR = { top_left: [0, 0], top_middle: [.5, 0], top_right: [1, 0], left_middle: [0, .5], middle: [.5, .5], center: [.5, .5],
    right_middle: [1, .5], bottom_left: [0, 1], bottom_middle: [.5, 1], bottom_right: [1, 1] };
  function place(n, anchor, off) {
    const [ax, ay] = ANCHOR[anchor] || ANCHOR.top_left;
    n.style.position = 'absolute';
    n.style.left = ax * 100 + '%'; n.style.top = ay * 100 + '%';
    n.style.transform = 'translate(calc(' + (-ax * 100) + '% + ' + ((off && off[0]) || 0) + 'px), calc(' + (-ay * 100) + '% + ' + ((off && off[1]) || 0) + 'px))';
    return n;
  }

  /* ── vanilla scene ── */
  function buildScene(w, h) {
    const s = el('hs-scene', { width: w + 'px', height: h + 'px' });
    s.append(el('hs-sky'), el('hs-ground', { top: Math.round(h * 0.56) + 'px' }));
    const bar = place(el('hs-abs', { width: '182px', height: '22px' }), 'bottom_middle', [0, 0]);
    bar.append(img('ui__hotbar_start_cap.png', 1, 22, { position: 'absolute', left: 0 }));
    for (let i = 0; i < 9; i++) bar.append(img('ui__hotbar_' + i + '.png', 20, 22, { position: 'absolute', left: 1 + i * 20 + 'px' }));
    bar.append(img('ui__hotbar_end_cap.png', 1, 22, { position: 'absolute', left: '181px' }));
    const items = ['items__diamond_sword.png', 'items__apple.png', 'items__apple_golden.png', 'items__beef_cooked.png', 'items__bread.png',
      'items__iron_pickaxe.png', 'items__ender_pearl.png', 'items__experience_bottle.png', 'items__compass_item.png'];
    items.forEach((f, i) => bar.append(img(f, 16, 16, { position: 'absolute', left: 3 + i * 20 + 'px', top: '3px' })));
    bar.append(img('ui__selected_hotbar_slot.png', 24, 24, { position: 'absolute', left: '-1px', top: '-1px', zIndex: 2 }));
    s.append(bar);

    const xp = place(el('hs-abs', { width: '182px', height: '5px' }), 'bottom_middle', [0, -24]);
    xp.append(img('ui__experiencebarempty.png', 182, 5, { position: 'absolute' }));
    xp.append(el('hs-abs', { left: 0, top: 0, width: '77px', height: '5px', overflow: 'hidden' }, img('ui__experiencebarfull.png', 182, 5)));
    s.append(xp, place(el('hs-lvl', null, String(SAMPLE.level)), 'bottom_middle', [0, -29]));

    const cx = w / 2;
    const row = (n, y, side, bg, fg, half) => {
      for (let i = 0; i < 10; i++) {
        const x = side === 'l' ? cx - 91 + i * 8 : cx + 91 - 9 - i * 8;
        const wrap = el('hs-abs', { left: x + 'px', bottom: y + 'px', width: '9px', height: '9px' }, img(bg, 9, 9));
        if (i < n) wrap.append(img(fg, 9, 9, { position: 'absolute', left: 0, top: 0 }));
        else if (half && i === n) wrap.append(img(half, 9, 9, { position: 'absolute', left: 0, top: 0 }));
        s.append(wrap);
      }
    };
    row(10, 30, 'l', 'ui__heart_background.png', 'ui__heart.png');
    row(8, 40, 'l', 'ui__armor_empty.png', 'ui__armor_full.png');
    row(8, 30, 'r', 'ui__hunger_background.png', 'ui__hunger_full.png', 'ui__hunger_half.png');
    s.append(place(el('hs-cross', null, el('hs-ch-h'), el('hs-ch-v')), 'center'));
    return s;
  }

  /* ── module drawings ── */
  // The pack's underlined_base_bg: solid black at the module's opacity with the accent underline.
  function ub(opacity, w, h, ...kids) {
    const b = el('hs-ub', { width: w == null ? 'max-content' : w + 'px', height: h == null ? 'auto' : h + 'px' }, ...kids);
    b.style.setProperty('--a', opacity);
    return b;
  }
  const txt = (s, css) => el('hs-t', css, s);
  const row = (...kids) => el('hs-row', null, ...kids);
  const num = (n) => Number(n).toLocaleString('en-US');
  const fix = (n, d) => Number(n).toFixed(d);

  // Each drawing: (ctx) => node filling its drag size. ctx = { get, w, h, version }
  const MODS = {
    fpscounter: (c) => ub(c.op, c.w, c.h, row(txt('Fps:'), txt(String(SAMPLE.fps)))),
    slotcounter: (c) => ub(c.op, c.w, c.h, row(txt('Slot:'), txt(String(SAMPLE.slot)))),
    walkdistance: (c) => ub(c.op, c.w, c.h, row(txt('Walked:'), txt(num(SAMPLE.walked)), txt('Blocks'))),
    speedometer: (c) => ub(c.op, c.w, c.h, row(txt(fix(SAMPLE.speed, 2), { color: '#fff' }), txt('m/s'))),
    daycounter: (c) => ub(c.op, c.w, c.h, row(img('items__clock_item.png', 12, 12), txt('Day'), txt(String(SAMPLE.day)))),
    dayevent: (c) => ub(c.op, c.w, c.h, row(img('items__clock_item.png', 12, 12), txt('Day ' + SAMPLE.day))),
    timerhud: (c) => ub(c.op, c.w, c.h, row(txt(SAMPLE.timer))),
    serverdisplay: (c) => ub(c.op, c.w, c.h, row(img('items__compass_item.png', 12, 12), txt(SAMPLE.server))),
    expcalculator: (c) => ub(c.op, c.w, c.h, row(img('items__experience_bottle.png', 12, 12), txt('Level ' + SAMPLE.level), txt('(' + num(SAMPLE.xp) + ' xp)'))),
    creeperrange: (c) => ub(c.op, c.w, c.h, row(txt('Creeper:'), txt('7m', { color: '#ff5555' }))),
    lowdurability: (c) => ub(c.op, c.w, c.h, row(img('items__iron_pickaxe.png', 12, 12), txt('Low durability!', { color: '#ff5555' }))),
    statushud: (c) => ub(c.op, c.w, c.h, row(img('ui__heart.png', 9, 9), txt(String(SAMPLE.health)), img('ui__hunger_full.png', 9, 9), txt('20'))),
    mainhandhud: (c) => ub(c.op, c.w, c.h, row(img('items__diamond_sword.png', 14, 14), txt('Diamond Sword'), txt('1561/1561', { color: '#aaa' }))),
    inventoryhud: (c) => {
      const g = el('hs-invgrid');
      for (let i = 0; i < 27; i++) g.append(el('hs-slot', null, i % 5 === 0 ? img('items__bread.png', 8, 8) : null));
      return ub(c.op, c.w, c.h, g);
    },
    targethud: (c) => ub(c.op, c.w, c.h, el('hs-col', null,
      row(txt('Distance:'), txt(fix(SAMPLE.target.d, 1))), row(txt('Health:'), txt(String(SAMPLE.target.hp))))),
    forcecoords: (c) => ub(c.op, c.w, c.h, el('hs-col', null,
      row(txt('X:'), txt(String(SAMPLE.pos[0]))), row(txt('Y:'), txt(String(SAMPLE.pos[1]))), row(txt('Z:'), txt(String(SAMPLE.pos[2]))))),
    coordinates: (c) => {
      const lines = [];
      if (!c.get('$hide_vanillacordinates', false)) lines.push('Position: ' + SAMPLE.pos.join(', '));
      if (!c.get('$hide_chunkcoordinates', false)) lines.push('Chunk: ' + SAMPLE.chunk.join(', '));
      if (!c.get('$hide_nethercoordinates', false)) lines.push('Nether: ' + SAMPLE.nether.join(', '));
      if (!lines.length) lines.push('Position: ' + SAMPLE.pos.join(', '));
      const b = el('hs-black', null, el('hs-col', null, lines.map((l) => txt(l))));
      b.style.setProperty('--a', c.op);
      return b;
    },
    directionhud: (c) => {
      const names = ['N', '', 'NE', '', 'E', '', 'SE', '', 'S', '', 'SW', '', 'W', '', 'NW', ''];
      const tape = el('hs-tape', { width: c.w + 'px' });
      const heading = (SAMPLE.yaw % 360 + 360) % 360;
      const from = Math.ceil((heading - 75) / 5) * 5;
      for (let a = from; a <= heading + 75; a += 5) {
        const deg = ((a % 360) + 360) % 360;
        const x = c.w / 2 + (a - heading);
        const major = deg % 45 === 0;
        tape.append(el('hs-tick', { left: x + 'px', height: major ? '6px' : '3px' }));
        if (major) tape.append(abs(txt(names[deg / 22.5] || '', { transform: 'translateX(-50%)', color: deg === 0 ? '#ff5555' : '#fff' }), x, 5));
      }
      tape.append(abs(el('hs-needle'), c.w / 2, 0));
      return ub(c.op, c.w, c.h, tape);
    },
    armorhud: (c) => {
      const pieces = [['helmet', .92], ['chestplate', .64], ['leggings', .78], ['boots', .45]];
      const col = el('hs-col', { gap: '0' });
      pieces.forEach(([p, f]) => {
        const cell = el('hs-abs', { position: 'relative', width: '32px', height: '16px' }, img('items__netherite_' + p + '.png', 16, 16, { position: 'absolute', left: '0' }));
        cell.append(el('hs-dur-bg', { left: '17px', top: '11px' }), el('hs-dur', { left: '17px', top: '11px', width: Math.max(1, Math.round(13 * f)) + 'px', background: 'hsl(' + Math.round(f * 120) + ' 100% 50%)' }));
        col.append(cell);
      });
      return el('hs-fill', { width: c.w + 'px', height: c.h + 'px' }, col);
    },
    offhandhud: (c) => el('hs-fill', { width: c.w + 'px', height: c.h + 'px' }, img('ui__selected_hotbar_slot.png', 20, 20), abs(img('items__totem.png', 16, 16), 2, 2)),
    bowindicator: (c) => ub(c.op, c.w, c.h, el('hs-center', null, img('items__arrow.png', 14, 14), txt('3'))),
    chunkmap: (c) => {
      const g = el('hs-chunks', { width: c.w + 'px', height: c.h + 'px' });
      for (let i = 0; i < 64; i++) g.append(el(null, { background: ((i * 7 + (i >> 3) * 3) % 5 === 0) ? '#5c8a3a' : (i % 3 === 0 ? '#6ca84e' : '#7cb85a') }));
      g.append(el('hs-player-dot'));
      return g;
    },
    f1button: (c) => ub(c.op, c.w, c.h, el('hs-center', null, txt('F1'))),
    f8button: (c) => ub(c.op, c.w, c.h, el('hs-center', null, txt('F8'))),
    playerlist: (c) => ub(c.op, c.w, c.h, el('hs-center', null, txt('TAB'))),
  };

  /* draw(id, size, get) -> node | null. `get(key, fallback)` reads the editor's settings for the active version. */
  function drawModule(id, size, get) {
    const fn = MODS[id];
    const op = Number(get('$' + id + '_opacity|default', 0.7));
    const ctx = { get, op: isFinite(op) ? op : 0.7, w: size.w, h: size.h };
    if (fn) return fn(ctx);
    return ub(ctx.op, size.w, size.h, el('hs-center', null, txt(id)));
  }

  window.GlacierHud = {
    buildScene,
    drawModule,
    has: (id) => !!MODS[id],
  };
})();
