'use strict';

// Playable walkthrough of Glacier v7 in the hero: start screen → worlds →
// create world → in-game HUD → pause screen → mod menu, styled after the v7
// pack's own screens. The HUD is live: modules switched on in the mod menu
// appear on it, the Elements/Editors settings (crosshair, EXP bar colour,
// hotbar style, chat position, armor bar) restyle it, and WASD / Space /
// mouse drag move you around a small parallax world so Coordinates,
// Speedometer, DirectionHUD, Keystrokes etc. have something to show.
//
// Everything is local and cosmetic — it's a showcase, not the game.

import { mountModMenu, MODULES, DEFAULT_SETTINGS, FLARE_SVG, glyph } from './modmenu.js?v=20260902203329';
import { escAttr } from './utils.js?v=20260902203329';

const HUD = 'assets/v7/hud/';
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SCREENS = [
    ['start', 'Start screen'],
    ['worlds', 'Worlds'],
    ['create', 'Create world'],
    ['hud', 'In game'],
    ['pause', 'Pause'],
    ['mods', 'Mod menu']
];
const IN_GAME = new Set(['hud', 'pause', 'mods']);

const MODES = {
    Survival: 'Explore a mysterious world where you build, collect, craft, and fight monsters.',
    Creative: 'Unlimited resources. Free flying. Create without limits.',
    Adventure: 'Play custom maps and adventures. Blocks can’t be broken or placed by default.'
};
const DIFFICULTIES = {
    Peaceful: 'No hostile mobs, and health slowly regenerates.',
    Easy: 'Hostile mobs spawn but deal less damage. Hunger never drains below 5 hearts.',
    Normal: 'Hostile mobs spawn and deal standard damage. Hunger drains health down to half a heart.',
    Hard: 'Hostile mobs deal more damage. Hunger can drain all of your health.'
};

// Server list: the pack ships icons for these in mods/server_icons.
const SERVERS = [
    ['hive', 'The Hive', 'geo.hivebedrock.network'],
    ['cubecraft', 'CubeCraft', 'play.cubecraft.net'],
    ['lifeboat', 'Lifeboat', 'mco.lbsg.net'],
    ['galaxite', 'Galaxite', 'play.galaxite.net'],
    ['nethergames', 'NetherGames', 'play.nethergames.org'],
    ['zeqa', 'Zeqa', 'zeqa.net'],
    ['mineville', 'Mineville', 'play.inpvp.net']
];

// Hotbar contents: the leather set the pack retextures, one per slot.
const ITEMS = [['leather_helmet', 'Leather Cap'], ['leather_chestplate', 'Leather Tunic'], ['leather_leggings', 'Leather Pants'], ['leather_boots', 'Leather Boots']];

// Start-screen panels, text taken from the pack's lang file and manifest.
const START_PANELS = {
    changelog: ['Changelog', [
        ['Module Settings — Back Button', 'Every module settings panel now has a Back button, and the header shows the current module’s name.'],
        ['New Modules', 'Ore Visualizer, Death Coords and Mob Indicator.'],
        ['Animation Overhaul', '50+ animations re-timed: out-expo entrances, in-cubic exits, out-back popups.'],
        ['Coordinate System Unification', 'Every coordinate display now reads from a single source, so they can never disagree.'],
        ['Bug Fixes', 'Scroll wheel works on PC again; the player list no longer opens on TAB when it’s disabled.']
    ]],
    tutorials: ['Tutorials', [
        ['Waypoints', 'Sneak, look straight down with an empty hand for 1 second, then attack to place. Sneak, look straight up and jump to remove.'],
        ['Greenscreen', 'Sneak while holding a Slime Ball, then attack. Sneak with a Slime Ball and jump to turn it off.'],
        ['Deathpoint Tracking', 'Tracked automatically when you die. Sneak, look straight down with an empty hand and jump to clear it.'],
        ['Chunk Borders', 'Hold a Nautilus Shell in your offhand while in third person.']
    ]],
    credits: ['Credits', [
        ['Glacier Client', 'Made by @PepeYT · Glacier Productions © 2025.'],
        ['Player Status Icons', 'Based on Yan’s Utility Pack.'],
        ['PvP Utility', 'Health indicators and hitboxes from Pepe’s PvP Utility.'],
        ['Community', 'discord.glacierclient.xyz']
    ]]
};

// 9×9 pixel sprites for the vanilla bars (k outline, r/w heart, b/l food).
function sprite(rows, colors) {
    let rects = '';
    rows.forEach((row, y) => [...row].forEach((c, x) => {
        if (colors[c]) rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + colors[c] + '"/>';
    }));
    return 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 9" shape-rendering="crispEdges">' + rects + '</svg>') + '")';
}
const HEART = sprite(['.kk...kk.', 'kwrk.krrk', 'krrrkrrrk', 'krrrrrrrk', '.krrrrrk.', '..krrrk..', '...krk...', '....k....'], { k: '#1a0a0a', r: '#e02828', w: '#ffb3b3' });
const FOOD = sprite(['.....kkk.', '....kbbbk', '...kbllbk', '...kbbbbk', '...kbbbk.', '..kwkkk..', '.kwwk....', 'kwwk.....', '.kk......'], { k: '#2a1608', b: '#b0602a', l: '#d98a4a', w: '#f2efe6' });

function btn(label, attrs = '', cls = '') {
    return '<button type="button" class="gs-btn ' + cls + '" ' + attrs + '>' + label + '</button>';
}

function bar(title, back) {
    return '<div class="gs-bar">'
        + (back ? '<button type="button" class="gs-back" data-go="' + back + '" aria-label="Back">' + glyph('assets/v7/ui/arrow_left.png', 'gs-back-icon') + '</button>' : '')
        + '<img src="assets/logo.png" alt="" class="gs-bar-logo" width="26" height="26" />'
        + '<span class="gs-bar-title">' + title + '</span>'
        + FLARE_SVG
        + '</div>';
}

function thumb(cls = '') {
    return '<span class="gs-thumb ' + cls + '" aria-hidden="true"><span class="gs-layer l-far"></span><span class="gs-layer l-mid"></span><span class="gs-layer l-near"></span></span>';
}

function tabs(group, items) {
    let t = '<div class="gs-tabs" role="tablist" data-gs-tabs="' + group + '">';
    items.forEach(([id, label, icon], i) => {
        t += '<button type="button" role="tab" class="gs-tab' + (i === 0 ? ' is-active' : '') + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-tab="' + id + '">'
            + (icon ? '<img src="' + icon + '" alt="" width="18" height="18" />' : '') + '<span>' + label + '</span></button>';
    });
    return t + '</div>';
}

function toggleRow(title, desc, on, key) {
    return '<div class="mm-row"><span class="mm-row-text"><span class="mm-row-title">' + title + '</span><span class="mm-row-desc">' + desc + '</span></span>'
        + '<button type="button" class="mm-toggle" role="switch" aria-checked="' + on + '" aria-label="' + escAttr(title) + '" data-gs-opt="' + key + '"><span class="mm-knob"></span></button></div>';
}

function segGroup(name, key, options, active) {
    let s = '<span class="mm-seg gs-seg" role="group" aria-label="' + name + '" data-gs-seg="' + key + '">';
    for (const o of options) s += '<button type="button" class="' + (o === active ? 'is-active' : '') + '" aria-pressed="' + (o === active) + '" data-value="' + o + '">' + o + '</button>';
    return s + '</span>';
}

function startScreen() {
    return '<div class="gs-screen gs-start" data-screen="start">'
        + '<div class="gs-start-side">'
        + '<div class="gs-wordmark"><img src="assets/logo.png" alt="" width="56" height="56" /><span><strong>Glacier</strong><small>Client v7</small></span></div>'
        + '<div class="gs-start-btns">'
        + btn('Play Game', 'data-go="worlds" data-autofocus', 'is-accent is-big')
        + btn('Options', 'data-soon')
        + btn('Marketplace', 'data-soon')
        + btn('Dressing Room', 'data-soon')
        + '<div class="gs-start-row">' + btn('Changelog', 'data-panel="changelog"') + btn('Tutorials', 'data-panel="tutorials"') + btn('Credits', 'data-panel="credits"') + '</div>'
        + '</div></div>'
        + '<div class="gs-user"><img src="' + HUD + 'play_friends.png" alt="" width="16" height="16" /><span>Logged in as: <strong>Steve</strong></span></div>'
        + '<div class="gs-news">'
        + '<button type="button" class="gs-news-tile" data-panel="changelog"><img src="assets/logo.png" alt="" width="22" height="22" /><span><strong>Glacier v7</strong><small>The rebuilt mod menu</small></span></button>'
        + '<button type="button" class="gs-news-tile" data-panel="tutorials">' + glyph('assets/v7/ui/tab_elements.png') + '<span><strong>Tutorials</strong><small>Waypoints, greenscreen…</small></span></button>'
        + '<a class="gs-news-tile" href="https://discord.glacierclient.xyz/" target="_blank" rel="noopener">' + glyph('assets/v7/modules/hudpopup.png') + '<span><strong>Discord</strong><small>Found a bug? Report it</small></span></a>'
        + '</div>'
        + '<span class="gs-ver gs-ver-l">Glacier Client v7</span><span class="gs-ver gs-ver-r">Minecraft 1.21.130+</span>'
        + '<div class="gs-modal" hidden><div class="gs-panel gs-modal-box" role="dialog" aria-modal="true" aria-labelledby="gsModalTitle">'
        + '<div class="gs-bar"><img src="assets/logo.png" alt="" class="gs-bar-logo" width="26" height="26" /><span class="gs-bar-title" id="gsModalTitle"></span>' + FLARE_SVG
        + '<button type="button" class="gs-close" data-close-modal aria-label="Close">' + glyph('assets/v7/ui/exit.png') + '</button></div>'
        + '<ul class="mm-rows gs-modal-list"></ul></div></div>'
        + '</div>';
}

function worldsScreen() {
    let servers = '';
    for (const [id, name, ip] of SERVERS) {
        servers += '<button type="button" class="gs-server" data-server="' + id + '"><img src="' + HUD + 'server_' + id + '.png" alt="" width="40" height="40" loading="lazy" /><span><strong>' + name + '</strong><small>' + ip + '</small></span><span class="gs-join">Join</span></button>';
    }
    return '<div class="gs-screen gs-worlds" data-screen="worlds">'
        + bar('Play', 'start')
        + '<div class="gs-body">'
        + tabs('play', [['worlds', 'Worlds', HUD + 'play_worlds.png'], ['friends', 'Friends', HUD + 'play_friends.png'], ['servers', 'Servers', HUD + 'play_servers.png']])
        + '<div class="gs-tabpanel" data-panel-of="play" data-tab="worlds">'
        + '<div class="gs-toolbar">' + btn('Create New World', 'data-go="create" data-autofocus', 'is-accent') + btn('Import World', 'data-soon') + '</div>'
        + '<div class="gs-world-list"></div></div>'
        + '<div class="gs-tabpanel" data-panel-of="play" data-tab="friends" hidden><div class="gs-empty">' + thumb('is-empty') + '<strong>No friends online… yet!</strong><span>Find people to play with in the Glacier Discord.</span><a class="gs-btn" href="https://discord.glacierclient.xyz/" target="_blank" rel="noopener">Join the Discord</a></div></div>'
        + '<div class="gs-tabpanel" data-panel-of="play" data-tab="servers" hidden><div class="gs-server-grid">' + servers + '</div></div>'
        + '</div></div>';
}

function createScreen() {
    return '<div class="gs-screen gs-create" data-screen="create">'
        + bar('Create New World', 'worlds')
        + '<div class="gs-create-body">'
        + '<aside class="gs-create-side">' + thumb('is-preview')
        + btn('Create', 'data-create data-autofocus', 'is-accent is-big')
        + tabs('create', [['general', 'General', ''], ['advanced', 'Advanced', ''], ['cheats', 'Cheats', '']])
        + '</aside>'
        + '<div class="gs-create-main">'
        + '<div class="gs-tabpanel" data-panel-of="create" data-tab="general">'
        + '<section class="gs-field"><label class="gs-label" for="gsWorldName">World name</label><input id="gsWorldName" class="gs-input" type="text" value="My World" maxlength="32" autocomplete="off" spellcheck="false" /></section>'
        + '<section class="gs-field"><span class="gs-label">Game mode</span>' + segGroup('Game mode', 'mode', Object.keys(MODES), 'Survival') + '<p class="gs-hint" data-hint="mode">' + MODES.Survival + '</p></section>'
        + '<section class="gs-field"><span class="gs-label">Difficulty</span>' + segGroup('Difficulty', 'diff', Object.keys(DIFFICULTIES), 'Normal') + '<p class="gs-hint" data-hint="diff">' + DIFFICULTIES.Normal + '</p></section>'
        + '</div>'
        + '<div class="gs-tabpanel mm-rows" data-panel-of="create" data-tab="advanced" hidden>'
        + toggleRow('Show Coordinates', 'Vanilla position readout (Glacier’s Coordinates module goes further).', false, 'vanillaCoords')
        + toggleRow('Bonus Chest', 'Start next to a chest of basic supplies.', false, 'bonus')
        + toggleRow('Starting Map', 'Start with a map of the surrounding area.', true, 'map')
        + '</div>'
        + '<div class="gs-tabpanel mm-rows" data-panel-of="create" data-tab="cheats" hidden>'
        + toggleRow('Activate Cheats', 'Lets you use commands like /gamemode in chat.', true, 'cheats')
        + toggleRow('Keep Inventory', 'Keep your items when you die.', false, 'keepInv')
        + toggleRow('Always Day', 'Stop the day–night cycle at noon.', true, 'alwaysDay')
        + '</div>'
        + '</div></div></div>';
}

function hudScreen() {
    let hotbar = '';
    for (let i = 0; i < 9; i++) {
        const item = ITEMS[i];
        hotbar += '<span class="hud-slot" data-slot="' + i + '">' + (item ? '<img src="' + HUD + item[0] + '.png" alt="" width="16" height="16" />' : '') + '</span>';
    }
    let hearts = '', food = '', armor = '', exp = '';
    for (let i = 0; i < 10; i++) {
        hearts += '<i></i>';
        food += '<i></i>';
        armor += '<i class="' + (i < 4 ? 'is-full' : '') + '"></i>';
    }
    for (let i = 0; i < 14; i++) exp += '<i class="' + (i < 8 ? 'is-full' : '') + '"></i>';
    const mod = (id, inner, extra = '') => '<div class="hud-mod" data-mod="' + id + '"' + extra + '>' + inner + '</div>';
    return '<div class="gs-screen gs-hud" data-screen="hud">'
        + '<div class="gs-world" aria-hidden="true"><span class="gs-layer l-sky"></span><span class="gs-layer l-far"></span><span class="gs-layer l-mid"></span><span class="gs-layer l-near"></span></div>'
        + '<div class="hud" aria-hidden="true">'
        + '<img class="hud-cross" alt="" width="15" height="15" />'
        + '<div class="hud-dir hud-mod" data-mod="directionhud"><span class="hud-dir-strip"></span><span class="hud-dir-deg"></span></div>'
        + '<div class="hud-popup"><img src="assets/logo.png" alt="" width="26" height="26" /><span><strong>Glacier Client v7</strong><small>Found any bugs? Report them in our Server.</small></span></div>'
        + '<div class="hud-stack">'
        + mod('coordinates', '<span class="hud-k">X:</span> <b data-v="x"></b> <span class="hud-k">Y:</span> <b data-v="y"></b> <span class="hud-k">Z:</span> <b data-v="z"></b>')
        + mod('fpscounter', '<span class="hud-k">FPS:</span> <b data-v="fps"></b>')
        + mod('speedometer', '<b data-v="speed"></b> <span class="hud-k">m/s</span>')
        + mod('walkdistance', '<span class="hud-k">Walked:</span> <b data-v="walked"></b>')
        + mod('timerhud', glyph('assets/v7/modules/timerhud.png') + ' <b data-v="timer"></b>')
        + mod('daysplayed', '<span class="hud-k">Days played:</span> <b>1</b>')
        + mod('dayevent', glyph('assets/v7/modules/dayevent.png') + ' <b data-v="dayevent">Noon</b>')
        + mod('serverdisplay', '<img data-v="serverIcon" alt="" width="16" height="16" /> <b data-v="server"></b>')
        + mod('statushud', '<b data-v="status"></b>')
        + mod('combocounter', '<span class="hud-k">COMBO:</span> <b data-v="combo">0</b>')
        + mod('killcounter', '<span class="hud-k">KILLS:</span> <b>0</b>')
        + mod('debughud', '<span data-v="debug"></span>')
        + '<div class="hud-vanilla-coords">Position: <span data-v="vpos"></span></div>'
        + '</div>'
        + '<div class="hud-keys hud-mod" data-mod="keystrokes">'
        + '<span class="hud-key k-w" data-key="w">W</span><span class="hud-key k-a" data-key="a">A</span><span class="hud-key k-s" data-key="s">S</span><span class="hud-key k-d" data-key="d">D</span>'
        + '<span class="hud-key k-l" data-key="lmb">LMB</span><span class="hud-key k-r" data-key="rmb">RMB</span><span class="hud-key k-sp" data-key=" "><i></i></span>'
        + '</div>'
        + '<div class="hud-armor hud-mod" data-mod="armorhud">'
        + ITEMS.map(([id]) => '<span><img src="' + HUD + id + '.png" alt="" width="16" height="16" /><b>' + (id === 'leather_helmet' ? 55 : id === 'leather_chestplate' ? 80 : id === 'leather_leggings' ? 75 : 65) + '</b></span>').join('')
        + '</div>'
        + '<div class="hud-chat" data-mod="chat"><ul class="hud-chat-log"></ul><form class="hud-chat-form" hidden><input type="text" class="hud-chat-input" maxlength="80" aria-label="Chat" placeholder="Try /gamemode creative" autocomplete="off" spellcheck="false" /></form></div>'
        + '<div class="hud-plist"><strong>Players: 1</strong><span><img src="' + HUD + 'play_friends.png" alt="" width="12" height="12" /> Steve</span></div>'
        + '<div class="hud-shortcuts hud-mod" data-mod="mobileshortcuts">'
        + '<button type="button" data-go="mods" aria-label="Open mod menu"><img src="' + HUD + 'mod_menu.png" alt="" width="18" height="18" /></button>'
        + '<button type="button" data-go="pause" aria-label="Pause">' + glyph('assets/v7/ui/paused.png') + '</button>'
        + '<button type="button" data-hide-hud aria-label="Hide HUD (F1)">' + glyph('assets/v7/ui/grid_on.png') + '</button>'
        + '</div>'
        + '<div class="hud-touch"><div class="hud-pad">'
        + '<button type="button" data-hold="w" aria-label="Forward">▲</button><button type="button" data-hold="a" aria-label="Left">◀</button><button type="button" data-hold="s" aria-label="Back">▼</button><button type="button" data-hold="d" aria-label="Right">▶</button>'
        + '</div><button type="button" class="hud-jump" data-hold=" " aria-label="Jump">⤒</button></div>'
        + '<div class="hud-bottom">'
        + '<span class="hud-tip"></span>'
        + '<div class="hud-stats"><div class="hud-left"><span class="hud-armorbar">' + armor + '</span><span class="hud-hearts" style="--sprite:' + HEART.replace(/"/g, '&quot;') + '">' + hearts + '</span></div>'
        + '<div class="hud-right"><span class="hud-food" style="--sprite:' + FOOD.replace(/"/g, '&quot;') + '">' + food + '</span></div></div>'
        + '<div class="hud-xp"><b class="hud-level">14</b><span class="hud-xpbar">' + exp + '</span></div>'
        + '<div class="hud-hotbar">' + hotbar + '</div>'
        + '</div>'
        + '</div>'
        + '<button type="button" class="gs-play-prompt">' + glyph('assets/v7/ui/playing.png') + '<span><strong>Click to play</strong><small>WASD move · Space jump · drag to look · Esc pause · M mod menu</small></span></button>'
        + '</div>';
}

function pauseScreen() {
    return '<div class="gs-screen gs-pause gs-overlay" data-screen="pause">'
        + '<div class="gs-panel gs-pause-box">'
        + '<div class="gs-bar"><img src="assets/logo.png" alt="" class="gs-bar-logo" width="30" height="30" /><span class="gs-bar-title">Game Paused</span>' + FLARE_SVG + '</div>'
        + '<div class="gs-pause-body">'
        + '<div class="gs-pause-btns">'
        + btn('Resume Game', 'data-go="hud" data-autofocus', 'is-accent is-big')
        + btn(glyph('assets/v7/ui/tab_modules.png') + ' Mod Menu', 'data-go="mods"')
        + btn(glyph('assets/v7/ui/settings.png') + ' Settings', 'data-soon')
        + btn(glyph('assets/v7/ui/grid_on.png') + ' Achievements', 'data-soon')
        + btn('Save &amp; Quit', 'data-quit', 'is-danger')
        + '</div>'
        + '<div class="gs-pause-info">'
        + '<div class="gs-info"><span>Logged in as:</span><strong>Steve</strong></div>'
        + '<div class="gs-info"><span>Playing in:</span><strong data-v="playing"></strong></div>'
        + '<div class="gs-info"><span>Game Status:</span><strong data-v="gamestatus"></strong></div>'
        + '<div class="gs-info gs-info-players"><span>Players (1)</span><strong><img src="' + HUD + 'play_friends.png" alt="" width="14" height="14" /> Steve</strong></div>'
        + '</div></div></div></div>';
}

export function setupSimulator() {
    const wrap = document.getElementById('gameSim');
    if (!wrap) return;

    const S = {
        screen: 'start',
        modsFrom: 'hud',
        modules: Object.fromEntries(MODULES.map(m => [m[0], m[4]])),
        settings: { ...DEFAULT_SETTINGS },
        worlds: [{ name: 'Glacier Showcase', mode: 'Survival', diff: 'Normal', when: 'Today' }],
        create: { mode: 'Survival', diff: 'Normal', vanillaCoords: false, cheats: true },
        session: null,
        hudHidden: false,
        keys: new Set()
    };
    const P = { x: 0, y: 64, z: 0, yaw: 0, strafe: 0, walked: 0, speed: 0, jump: 0, vy: 0, bob: 0, slot: 0, combo: 0, lastHit: 0, t0: 0, fps: 60 };

    let chips = '';
    for (const [id, label] of SCREENS) chips += '<button type="button" class="gs-chip" data-go="' + id + '" aria-pressed="' + (id === 'start') + '">' + label + '</button>';
    wrap.innerHTML = '<div class="gs-nav" role="group" aria-label="Jump to a screen">' + chips + '</div>'
        + '<div class="gs" tabindex="0" role="region" aria-roledescription="interactive preview" aria-label="Glacier v7 walkthrough: start screen, worlds, world creation, in-game HUD, pause screen and mod menu">'
        + startScreen() + worldsScreen() + createScreen() + hudScreen() + pauseScreen()
        + '<div class="gs-screen gs-mods gs-overlay" data-screen="mods"><div class="gs-mm"></div></div>'
        + '<div class="gs-loading" hidden><img src="assets/logo.png" alt="" width="64" height="64" /><strong></strong><span class="mm-bar"><span class="mm-bar-fill"></span></span></div>'
        + '<div class="gs-toast" role="status" aria-live="polite"></div>'
        + '</div>';

    const root = wrap.querySelector('.gs');
    const $ = sel => root.querySelector(sel);
    const hud = $('.hud');
    const vals = {};
    for (const el of root.querySelectorAll('[data-v]')) (vals[el.dataset.v] ||= []).push(el);
    const setV = (k, v) => { for (const el of vals[k] || []) if (el.textContent !== v) el.textContent = v; };
    const layers = { far: $('.gs-hud .l-far'), mid: $('.gs-hud .l-mid'), near: $('.gs-hud .l-near') };
    const keyEls = Object.fromEntries([...root.querySelectorAll('.hud-key')].map(k => [k.dataset.key, k]));

    // ── Mod menu (inside the game) ──
    mountModMenu($('.gs-mm'), {
        modules: S.modules,
        settings: S.settings,
        onChange: applyHud,
        onClose: () => go(S.modsFrom)
    });

    // ── Toast ──
    let toastTimer = 0;
    function toast(msg) {
        const t = $('.gs-toast');
        t.textContent = msg;
        t.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove('is-visible'), 2200);
    }

    // ── Screens ──
    function go(id, { focus = true } = {}) {
        if (IN_GAME.has(id) && !S.session) joinWorld(S.worlds[0], { instant: true });
        if (id === 'mods' && S.screen !== 'mods') S.modsFrom = S.screen === 'pause' ? 'pause' : 'hud';
        if (id === 'start') closeModal();
        closeChat(false);
        S.screen = id;
        root.dataset.screen = id;
        for (const s of root.querySelectorAll('.gs-screen')) {
            const name = s.dataset.screen;
            const shown = name === id || (name === 'hud' && IN_GAME.has(id));
            s.classList.toggle('is-active', shown);
            s.classList.toggle('is-under', shown && name !== id);
            s.inert = name !== id;
        }
        for (const c of wrap.querySelectorAll('.gs-chip')) c.setAttribute('aria-pressed', String(c.dataset.go === id));
        if (id === 'worlds') renderWorlds();
        if (id === 'pause') {
            setV('playing', S.session.name);
            setV('gamestatus', S.session.mode);
        }
        if (focus) {
            const target = id === 'hud' ? root : (id === 'mods' ? $('.gs-mm .mm-tab.is-active') : $('.gs-screen[data-screen="' + id + '"] [data-autofocus]'));
            (target || root).focus({ preventScroll: true });
        }
        S.keys.clear();
        syncKeys();
        loop();
    }

    // ── Start screen panels ──
    function openModal(key) {
        const [title, items] = START_PANELS[key];
        $('#gsModalTitle').textContent = title;
        $('.gs-modal-list').innerHTML = items.map(([t, d]) => '<li class="mm-row"><span class="mm-row-text"><span class="mm-row-title">' + t + '</span><span class="mm-row-desc">' + d + '</span></span></li>').join('');
        $('.gs-modal').hidden = false;
        $('.gs-modal [data-close-modal]').focus({ preventScroll: true });
    }
    function closeModal() {
        const m = $('.gs-modal');
        if (m.hidden) return false;
        m.hidden = true;
        $('.gs-start [data-autofocus]').focus({ preventScroll: true });
        return true;
    }

    // ── Worlds ──
    function renderWorlds() {
        $('.gs-world-list').innerHTML = S.worlds.map((w, i) => '<button type="button" class="gs-world-row" data-world="' + i + '">'
            + thumb() + '<span class="gs-world-text"><strong>' + escAttr(w.name) + '</strong><small>' + w.mode + ' · ' + w.diff + ' · ' + w.when + '</small></span>'
            + '<span class="gs-join">Play</span></button>').join('');
    }

    function loading(label, done) {
        const l = $('.gs-loading');
        l.querySelector('strong').textContent = label;
        l.hidden = false;
        l.classList.remove('is-run');
        void l.offsetWidth;
        l.classList.add('is-run');
        setTimeout(() => { l.hidden = true; done(); }, REDUCED ? 250 : 1100);
    }

    function joinWorld(world, { instant = false, server = null } = {}) {
        const start = () => {
            S.session = server
                ? { name: server[1], ip: server[2], icon: HUD + 'server_' + server[0] + '.png', mode: 'Adventure', cheats: false }
                : { name: world.name, ip: null, icon: HUD + 'play_worlds.png', mode: world.mode, cheats: world.cheats !== false, vanillaCoords: !!world.vanillaCoords };
            Object.assign(P, { x: 128.5, y: 64, z: -212.5, yaw: 0, strafe: 0, walked: 0, speed: 0, jump: 0, vy: 0, combo: 0, t0: performance.now() });
            $('.hud-chat-log').innerHTML = '';
            chat(server ? 'Connected to ' + server[2] : 'Steve joined the game', 'is-yellow');
            chat('[Glacier] Press M to open the mod menu — try switching on Keystrokes.', 'is-accent');
            applyHud();
            if (S.modules.hudpopup) {
                const p = $('.hud-popup');
                p.classList.remove('is-shown');
                void p.offsetWidth;
                p.classList.add('is-shown');
            }
        };
        if (instant) { start(); return; }
        loading(server ? 'Connecting to ' + server[1] + '…' : 'Generating world…', () => { start(); go('hud'); });
    }

    // ── HUD state from modules + settings ──
    function applyHud() {
        for (const el of root.querySelectorAll('.hud [data-mod]')) el.hidden = !S.modules[el.dataset.mod];
        const st = S.settings;
        const cross = $('.hud-cross');
        cross.src = 'assets/v7/ui/crosshair_' + st.crosshair + '.png';
        cross.classList.toggle('is-outlined', st.outline);
        hud.dataset.hotbar = st.hotbar.toLowerCase();
        hud.dataset.chat = st.chatPos.toLowerCase();
        hud.style.setProperty('--xp-full', 'url(../' + HUD + 'exp_' + st.exp + '_full.png)');
        hud.style.setProperty('--xp-empty', 'url(../' + HUD + 'exp_' + st.exp + '_empty.png)');
        hud.style.setProperty('--armor-icon', 'url(../' + HUD + (st.betterArmor ? 'armor_leather.png' : 'armor_iron.png') + ')');
        if (S.session) {
            hud.dataset.mode = S.session.mode.toLowerCase();
            setV('server', S.session.ip || S.session.name);
            for (const img of vals.serverIcon || []) img.src = S.session.icon;
            hud.classList.toggle('show-vanilla-coords', !!S.session.vanillaCoords && !S.modules.coordinates);
        }
        hud.classList.toggle('is-hidden', S.hudHidden);
        setSlot(P.slot, false);
    }

    function setSlot(i, tip = true) {
        P.slot = (i + 9) % 9;
        for (const s of root.querySelectorAll('.hud-slot')) s.classList.toggle('is-sel', Number(s.dataset.slot) === P.slot);
        $('.hud-hotbar').style.setProperty('--sel', P.slot);
        if (!tip) return;
        const t = $('.hud-tip');
        const item = ITEMS[P.slot];
        t.textContent = item ? item[1] : '';
        t.classList.remove('is-shown');
        void t.offsetWidth;
        if (item) t.classList.add('is-shown');
    }

    // ── Chat ──
    function chat(text, cls = '') {
        const log = $('.hud-chat-log');
        const li = document.createElement('li');
        li.textContent = text;
        if (cls) li.className = cls;
        log.appendChild(li);
        while (log.children.length > 6) log.firstChild.remove();
    }
    function openChat() {
        const f = $('.hud-chat-form');
        f.hidden = false;
        hud.classList.add('is-chatting');
        f.querySelector('input').focus({ preventScroll: true });
    }
    function closeChat(refocus = true) {
        const f = $('.hud-chat-form');
        if (f.hidden) return;
        f.hidden = true;
        f.querySelector('input').value = '';
        hud.classList.remove('is-chatting');
        if (refocus) root.focus({ preventScroll: true });
    }
    $('.hud-chat-form').addEventListener('submit', e => {
        e.preventDefault();
        const input = e.target.querySelector('input');
        const msg = input.value.trim();
        if (msg.startsWith('/')) command(msg);
        else if (msg) chat('<Steve> ' + msg);
        closeChat();
    });
    function command(cmd) {
        const [name, arg = ''] = cmd.slice(1).toLowerCase().split(/\s+/);
        if (name === 'help') { chat('Commands: /gamemode <survival|creative|adventure>, /help', 'is-grey'); return; }
        if (name === 'gamemode' || name === 'gm') {
            const mode = { s: 'Survival', survival: 'Survival', 0: 'Survival', c: 'Creative', creative: 'Creative', 1: 'Creative', a: 'Adventure', adventure: 'Adventure', 2: 'Adventure' }[arg];
            if (!S.session.cheats) { chat('You do not have permission to use this command.', 'is-red'); return; }
            if (!mode) { chat('Usage: /gamemode <survival|creative|adventure>', 'is-red'); return; }
            S.session.mode = mode;
            applyHud();
            chat('Your game mode has been updated to ' + mode + ' Mode', 'is-grey');
            return;
        }
        chat('Unknown command: ' + name + '. Try /help.', 'is-red');
    }

    // ── Input ──
    const MOVE = new Set(['w', 'a', 's', 'd', ' ', 'shift', 'arrowleft', 'arrowright', 'q', 'e']);
    function syncKeys() {
        for (const [k, el] of Object.entries(keyEls)) el.classList.toggle('is-on', S.keys.has(k));
    }
    root.addEventListener('keydown', e => {
        const k = e.key.toLowerCase();
        const typing = e.target.matches('input');
        if (k === 'escape') {
            e.preventDefault();
            if (!$('.hud-chat-form').hidden) { closeChat(); return; }
            if (S.screen === 'start') { closeModal(); return; }
            const back = { hud: 'pause', pause: 'hud', mods: S.modsFrom, create: 'worlds', worlds: 'start' }[S.screen];
            if (back) go(back);
            return;
        }
        if (typing || S.screen !== 'hud' || e.ctrlKey || e.metaKey || e.altKey) return;
        if (MOVE.has(k)) { e.preventDefault(); S.keys.add(k); syncKeys(); loop(); return; }
        if (k === 'shift') return;
        if (/^[1-9]$/.test(k)) { setSlot(Number(k) - 1); return; }
        if (k === 'm') { e.preventDefault(); go('mods'); return; }
        if (k === 't' || k === 'enter' || k === '/') {
            if (!S.modules.chat) return;
            e.preventDefault();
            openChat();
            if (k === '/') $('.hud-chat-input').value = '/';
            return;
        }
        if (k === 'f1') { e.preventDefault(); S.hudHidden = !S.hudHidden; applyHud(); return; }
        if (k === 'tab' && S.modules.playerlist) { e.preventDefault(); hud.classList.add('show-plist'); }
    });
    root.addEventListener('keyup', e => {
        const k = e.key.toLowerCase();
        if (S.keys.delete(k)) syncKeys();
        if (k === 'tab') hud.classList.remove('show-plist');
    });
    root.addEventListener('focusout', () => {
        requestAnimationFrame(() => {
            if (root.contains(document.activeElement)) return;
            S.keys.clear();
            syncKeys();
            hud.classList.remove('show-plist');
        });
    });

    // Clicks in the world: hit (LMB/RMB keystrokes + combo) and drag to look.
    const world = $('.gs-hud');
    let drag = null;
    world.addEventListener('pointerdown', e => {
        if (S.screen !== 'hud' || e.target.closest('button, input, .hud-chat')) return;
        root.focus({ preventScroll: true });
        const key = e.button === 2 ? 'rmb' : 'lmb';
        S.keys.add(key);
        syncKeys();
        if (key === 'lmb') {
            const now = performance.now();
            P.combo = now - P.lastHit < 1500 ? P.combo + 1 : 1;
            P.lastHit = now;
            setV('combo', String(P.combo));
        }
        drag = { id: e.pointerId, x: e.clientX, key };
        world.setPointerCapture(e.pointerId);
    });
    world.addEventListener('pointermove', e => {
        if (!drag || drag.id !== e.pointerId) return;
        P.yaw += (e.clientX - drag.x) * 0.35;
        drag.x = e.clientX;
        loop();
    });
    const endDrag = e => {
        if (!drag || drag.id !== e.pointerId) return;
        S.keys.delete(drag.key);
        syncKeys();
        drag = null;
    };
    world.addEventListener('pointerup', endDrag);
    world.addEventListener('pointercancel', endDrag);
    world.addEventListener('contextmenu', e => e.preventDefault());

    // Touch pad: hold to move / jump.
    for (const b of root.querySelectorAll('[data-hold]')) {
        const k = b.dataset.hold;
        b.addEventListener('pointerdown', e => { e.preventDefault(); S.keys.add(k); syncKeys(); loop(); });
        for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, () => { S.keys.delete(k); syncKeys(); });
    }

    root.addEventListener('wheel', e => {
        if (S.screen !== 'hud' || document.activeElement !== root) return;
        e.preventDefault();
        setSlot(P.slot + Math.sign(e.deltaY));
    }, { passive: false });

    // Buttons everywhere.
    root.addEventListener('click', e => {
        const t = e.target;
        const goBtn = t.closest('[data-go]');
        if (goBtn) { go(goBtn.dataset.go); return; }
        if (t.closest('[data-soon]')) { toast('Not part of this preview — try it in game!'); return; }
        const panel = t.closest('[data-panel]');
        if (panel) { openModal(panel.dataset.panel); return; }
        if (t.closest('[data-close-modal]') || t.classList.contains('gs-modal')) { closeModal(); return; }
        const row = t.closest('[data-world]');
        if (row) { joinWorld(S.worlds[Number(row.dataset.world)]); return; }
        const srv = t.closest('[data-server]');
        if (srv) { joinWorld(null, { server: SERVERS.find(s => s[0] === srv.dataset.server) }); return; }
        if (t.closest('[data-create]')) {
            const name = $('#gsWorldName').value.trim() || 'My World';
            const w = { name, mode: S.create.mode, diff: S.create.diff, when: 'Just now', cheats: S.create.cheats, vanillaCoords: S.create.vanillaCoords };
            S.worlds.unshift(w);
            joinWorld(w);
            return;
        }
        if (t.closest('[data-quit]')) {
            loading('Saving world…', () => { S.session = null; go('start'); });
            return;
        }
        if (t.closest('[data-hide-hud]')) { S.hudHidden = !S.hudHidden; applyHud(); return; }
        if (t.closest('.gs-play-prompt')) { root.focus({ preventScroll: true }); return; }

        const tab = t.closest('.gs-tab');
        if (tab) { selectTab(tab); return; }
        const segBtn = t.closest('[data-gs-seg] > button');
        if (segBtn) {
            const group = segBtn.parentNode;
            for (const b of group.children) { b.classList.toggle('is-active', b === segBtn); b.setAttribute('aria-pressed', String(b === segBtn)); }
            const key = group.dataset.gsSeg;
            S.create[key] = segBtn.dataset.value;
            $('[data-hint="' + key + '"]').textContent = (key === 'mode' ? MODES : DIFFICULTIES)[segBtn.dataset.value];
            return;
        }
        const opt = t.closest('[data-gs-opt]');
        if (opt) {
            const on = opt.getAttribute('aria-checked') !== 'true';
            opt.setAttribute('aria-checked', String(on));
            S.create[opt.dataset.gsOpt] = on;
        }
    });

    function selectTab(tab, focus) {
        const group = tab.parentNode.dataset.gsTabs;
        for (const b of tab.parentNode.children) {
            const on = b === tab;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-selected', String(on));
            b.tabIndex = on ? 0 : -1;
        }
        for (const p of root.querySelectorAll('[data-panel-of="' + group + '"]')) p.hidden = p.dataset.tab !== tab.dataset.tab;
        if (focus) tab.focus();
    }
    root.addEventListener('keydown', e => {
        const tab = e.target.closest('.gs-tab');
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!tab || !d) return;
        e.preventDefault();
        const all = [...tab.parentNode.children];
        selectTab(all[(all.indexOf(tab) + d + all.length) % all.length], true);
    });

    // ── Game loop: only runs while the HUD is on screen and visible. ──
    let raf = 0, last = 0, onScreen = false, lastFpsDraw = 0;
    new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; loop(); }).observe(root);
    document.addEventListener('visibilitychange', loop);

    function loop() {
        const want = S.screen === 'hud' && onScreen && !document.hidden;
        if (want && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
        if (!want && raf) { cancelAnimationFrame(raf); raf = 0; }
        if (S.session) draw(performance.now());
    }

    function tick(now) {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (dt > 0) P.fps += (1 / dt - P.fps) * 0.08;
        const k = S.keys;
        const turn = (k.has('arrowright') || k.has('e') ? 1 : 0) - (k.has('arrowleft') || k.has('q') ? 1 : 0);
        P.yaw += turn * 110 * dt;
        const fwd = (k.has('w') ? 1 : 0) - (k.has('s') ? 1 : 0);
        const side = (k.has('d') ? 1 : 0) - (k.has('a') ? 1 : 0);
        const sneak = k.has('shift');
        const len = Math.hypot(fwd, side) || 1;
        const v = (sneak ? 1.295 : 4.317) * dt / len;
        const h = P.yaw * Math.PI / 180;
        const dx = (Math.sin(h) * fwd + Math.cos(h) * side) * v;
        const dz = (-Math.cos(h) * fwd + Math.sin(h) * side) * v;
        const dist = Math.hypot(dx, dz);
        P.x += dx;
        P.z += dz;
        P.strafe += side * v;
        P.walked += dist;
        P.speed += (dist / (dt || 1) - P.speed) * 0.2;
        if (dist) P.bob += dist * 2.2;
        if (k.has(' ') && P.jump === 0) P.vy = 8.4;
        if (P.vy || P.jump > 0) {
            P.vy -= 32 * dt;
            P.jump = Math.max(0, P.jump + P.vy * dt);
            if (P.jump === 0) P.vy = 0;
        }
        P.y = 64 + P.jump;
        if (P.combo && now - P.lastHit > 2000) { P.combo = 0; setV('combo', '0'); }
        draw(now);
        raf = requestAnimationFrame(tick);
    }

    const fmt = n => (Math.round(n * 10) / 10).toFixed(1);
    function draw(now) {
        const yaw = ((P.yaw % 360) + 360) % 360;
        const bob = Math.sin(P.bob) * 0.35;
        const px = -yaw * 6 + P.strafe * -14;
        // Layers tile horizontally (repeat-x), so shifting background-position
        // wraps forever however far you turn; the vertical bob is a transform.
        layers.far.style.backgroundPositionX = (px * 0.15).toFixed(1) + 'px';
        layers.mid.style.backgroundPositionX = (px * 0.45).toFixed(1) + 'px';
        layers.near.style.backgroundPositionX = px.toFixed(1) + 'px';
        layers.mid.style.transform = 'translateY(' + (bob * 0.4).toFixed(2) + 'em)';
        layers.near.style.transform = 'translateY(' + bob.toFixed(2) + 'em)';
        setV('x', String(Math.floor(P.x)));
        setV('y', String(Math.floor(P.y)));
        setV('z', String(Math.floor(P.z)));
        setV('vpos', Math.floor(P.x) + ', ' + Math.floor(P.y) + ', ' + Math.floor(P.z));
        setV('speed', fmt(P.speed < 0.05 ? 0 : P.speed));
        setV('walked', fmt(P.walked) + 'm');
        if (now - lastFpsDraw > 250) { setV('fps', String(Math.round(P.fps))); lastFpsDraw = now; }
        const secs = Math.floor((now - P.t0) / 1000);
        setV('timer', String(Math.floor(secs / 60)).padStart(2, '0') + ':' + String(secs % 60).padStart(2, '0'));
        const moving = P.speed > 0.2;
        setV('status', P.jump > 0 ? 'Jumping' : S.keys.has('shift') ? 'Sneaking' : moving ? 'Moving' : 'Standing');
        const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        setV('debug', 'Glacier' + (S.settings.glacierVer ? ' v7' : '') + ' · Facing ' + dirs[Math.round(yaw / 45) % 8] + ' (' + Math.round(yaw) + '°)');
        // direction.png is 1920px for 360° with N at x≈347; CSS centres --dir.
        $('.hud-dir-strip').style.setProperty('--dir', ((347 + yaw * 5.333) % 1920).toFixed(1));
        $('.hud-dir-deg').textContent = Math.round(yaw) + '°';
    }

    go('start', { focus: false });
    applyHud();
}
