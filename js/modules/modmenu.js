'use strict';

// Replica of the Glacier v7 in-game mod menu. Module names, descriptions,
// icons and which modules start switched on all come from the v7 pack itself
// (texts/en_US.lang, icons/modules/*.png and config.json), so the replica
// matches what players see in game. mountModMenu() renders it into any element
// and reports every change, which is how the game preview's HUD reacts to it.
// Also home to the "What's new in v7" changelog tabs.

import { escAttr } from './utils.js?v=20260902203329';

// [id, name, description, category, on by default in v7's config.json]
export const MODULES = [
    ['armorhud', 'ArmorHUD', 'Monitor your equipped armor.', 'hud', false],
    ['bowindicator', 'Bow Indicator', 'Visualizes bow charge and draw progress.', 'pvp', false],
    ['chat', 'Chat', 'Choose between bottom or top chat.', 'utility', true],
    ['chunkmap', 'Chunk Map', 'Locate slime chunks and view grid boundaries.', 'world', false],
    ['clockcompass', 'Clock & Compass', 'Displays clock and compass items.', 'hud', false],
    ['combocounter', 'Combo Counter', 'Track your current hit combo in real time.', 'pvp', false],
    ['coordinates', 'Coordinates', 'Detailed view of your current position.', 'world', true],
    ['daysplayed', 'Days Played', 'Displays number of Days Played.', 'world', true],
    ['dayevent', 'Day Event', 'Displays the current day and time cycle.', 'world', false],
    ['deathcoords', 'Death Coords', 'Saves the location of your last death.', 'world', false],
    ['debughud', 'Debug HUD', 'Advanced technical info and game statistics.', 'utility', false],
    ['directionhud', 'DirectionHUD', 'A direction display for easy navigation.', 'hud', false],
    ['expcalculator', 'XP Calculator', 'Calculates XP needed for your next level.', 'utility', false],
    ['forcecoords', 'Force Coords', 'Forces coords to show regardless of world settings.', 'world', false],
    ['fpscounter', 'FPS Counter', 'Monitor frames per second performance.', 'hud', false],
    ['hudpopup', 'HUD Popup', 'Start-up message and branding.', 'utility', true],
    ['inventoryhud', 'InventoryHUD', 'View your inventory without opening the menu.', 'hud', false],
    ['itemcounters', 'Item Counters', 'Counts specific items in your inventory.', 'pvp', false],
    ['keystrokes', 'Keystrokes', 'Shows your movement and mouse keys on screen.', 'pvp', false],
    ['killcounter', 'Kill Counter', 'Counts your killstreak; resets when you die.', 'pvp', false],
    ['lowdurability', 'Low Durability', 'Alerts you when an item is about to break.', 'pvp', false],
    ['mainhandhud', 'MainhandHUD', 'Shows info for the item in your main hand.', 'hud', false],
    ['mobindicator', 'Mob Indicator', 'Shows a sword icon when aiming at a mob.', 'pvp', false],
    ['mobileshortcuts', 'Mobile Shortcuts', 'Quick-action buttons for touch users.', 'utility', true],
    ['offhandhud', 'OffhandHUD', 'Shows the item in your offhand.', 'hud', false],
    ['orevisualizer', 'Ore Visualizer', 'Visualizes optimal ore generation heights.', 'world', false],
    ['playerlist', 'Player Tab List', 'Enhanced list of online players.', 'utility', true],
    ['safezoneviewer', 'Safe Zone Viewer', 'Highlights safe zone area of your screen.', 'utility', false],
    ['serverdisplay', 'Server Display', 'Displays current server ip or world name.', 'utility', false],
    ['shinypotions', 'Shiny Potions', 'Adds a glint effect to potion items.', 'pvp', false],
    ['slotcounter', 'Slot Counter', 'Tracks empty slots in your inventory.', 'hud', false],
    ['speedometer', 'Speedometer', 'Measures your current travel speed in m/s.', 'hud', false],
    ['statushud', 'StatusHUD', 'Shows your current movement status.', 'hud', false],
    ['targethud', 'TargetHUD', 'Displays health and info of your target.', 'pvp', false],
    ['timerhud', 'TimerHUD', 'Tracks your playtime for the current session.', 'hud', false],
    ['walkdistance', 'Walk Distance', 'Tracks total distance traveled on foot.', 'hud', false]
];

// Menu-wide settings from the Elements and Editors tabs.
export const DEFAULT_SETTINGS = {
    chatPos: 'Bottom',
    hotbar: 'Connected',
    exp: 'blue',
    betterArmor: false,
    glacierVer: true,
    crosshair: 3,
    outline: true
};

const CATS = [['all', 'All'], ['hud', 'HUD'], ['pvp', 'PvP'], ['world', 'World'], ['utility', 'Utility']];

const TABS = [
    ['modules', 'Modules'],
    ['elements', 'Elements'],
    ['editors', 'Editors'],
    ['music_player', 'Music']
];

// The pack's EXP bar colour presets (textures/…/exp_bar/<colour>).
export const EXP_COLORS = [['blue', '#55aaff'], ['purple', '#a66bff'], ['pink', '#ff77c8'], ['red', '#ff5a5a'], ['orange', '#ffaa33'], ['yellow', '#ffe45c'], ['white', '#ffffff']];

// "All music discs have been added to the built-in player" — a few of them.
const TRACKS = [['Pigstep', 'Lena Raine', '2:28'], ['Relic', 'Aaron Cherof', '3:38'], ['otherside', 'Lena Raine', '3:15'], ['Creator', 'Lena Raine', '2:56'], ['Precipice', 'Aaron Cherof', '4:59']];

// The pause-screen flourish: a folded accent ribbon, a diagonal stripe and
// three sparkles, redrawn as SVG from v7's pause_screen.png header.
export const FLARE_SVG = '<svg class="v7-flare" viewBox="0 0 300 150" aria-hidden="true" focusable="false">'
    + '<path d="M4 0H222L88 138V86Z"/><path d="M292 0H300V150H214Z"/>'
    + '<path d="M134 128 160 98 178 115 211 112 182 139 166 126Z"/>'
    + star(236, 38, 12) + star(206, 50, 9) + star(232, 70, 6)
    + '</svg>';

function star(x, y, r) {
    const k = r * 0.28;
    return '<path d="M' + x + ' ' + (y - r) + 'Q' + (x + k) + ' ' + (y - k) + ' ' + (x + r) + ' ' + y
        + 'Q' + (x + k) + ' ' + (y + k) + ' ' + x + ' ' + (y + r)
        + 'Q' + (x - k) + ' ' + (y + k) + ' ' + (x - r) + ' ' + y
        + 'Q' + (x - k) + ' ' + (y - k) + ' ' + x + ' ' + (y - r) + 'Z"/>';
}

// The URL lands in a custom property, which resolves relative to the
// stylesheet (css/) that reads it, not the page — hence the ../ prefix.
export const glyph = (src, cls) => '<span class="v7-glyph' + (cls ? ' ' + cls : '') + '" style="--glyph:url(../' + src + ')" aria-hidden="true"></span>';

const toggle = (on, label, setting) => '<button type="button" class="mm-toggle" role="switch" aria-checked="' + on + '" aria-label="' + escAttr(label) + '"'
    + (setting ? ' data-mm-setting="' + setting + '"' : '') + '><span class="mm-knob"></span></button>';

function modulesPanel(ids, modules) {
    let pills = '';
    for (const [id, label] of CATS) {
        pills += '<button type="button" class="mm-pill' + (id === 'all' ? ' is-active' : '') + '" data-mm-cat="' + id + '" aria-pressed="' + (id === 'all') + '">' + label + '</button>';
    }
    let cards = '';
    for (const [id, name, desc, cat] of MODULES) {
        const on = !!modules[id];
        cards += '<div class="mm-card' + (on ? ' is-on' : '') + '" data-mm-id="' + id + '" data-mm-cat="' + cat + '" data-mm-text="' + escAttr((name + ' ' + desc).toLowerCase()) + '">'
            + glyph('assets/v7/modules/' + id + '.png', 'mm-card-icon')
            + '<span class="mm-card-text"><span class="mm-card-name">' + name + '</span><span class="mm-card-desc">' + desc + '</span></span>'
            + toggle(on, name)
            + '</div>';
    }
    return '<div class="mm-toolbar">'
        + '<label class="mm-search">' + glyph('assets/v7/ui/search.png') + '<input type="search" placeholder="Search modules…" aria-label="Search modules" autocomplete="off" spellcheck="false" /></label>'
        + '<div class="mm-pills" role="group" aria-label="Filter by category">' + pills + '</div>'
        + '</div>'
        + '<div class="mm-grid" tabindex="0" aria-label="Modules">' + cards + '<p class="mm-empty" hidden>No modules match.</p></div>'
        + '<div class="mm-foot"><span class="mm-count"></span><span class="mm-bar"><span class="mm-bar-fill"></span></span></div>';
}

function row(title, desc, control) {
    return '<div class="mm-row"><span class="mm-row-text"><span class="mm-row-title">' + title + '</span><span class="mm-row-desc">' + desc + '</span></span>' + control + '</div>';
}

function seg(name, setting, options, active) {
    let html = '<span class="mm-seg" role="group" aria-label="' + escAttr(name) + '" data-mm-setting="' + setting + '">';
    for (const o of options) html += '<button type="button" class="' + (o === active ? 'is-active' : '') + '" aria-pressed="' + (o === active) + '" data-value="' + o + '">' + o + '</button>';
    return html + '</span>';
}

function elementsPanel(s) {
    let swatches = '<span class="mm-swatches" role="group" aria-label="EXP bar colour" data-mm-setting="exp">';
    for (const [name, hex] of EXP_COLORS) {
        const on = name === s.exp;
        swatches += '<button type="button" class="mm-swatch' + (on ? ' is-active' : '') + '" style="--sw:' + hex + '" aria-label="' + name + '" aria-pressed="' + on + '" data-value="' + name + '"></button>';
    }
    swatches += '</span>';
    return '<div class="mm-rows">'
        + row('Chat', 'Choose between bottom or top chat.', seg('Chat position', 'chatPos', ['Bottom', 'Top'], s.chatPos))
        + row('Hotbar Style', 'Default or the Glacier-themed connected hotbar.', seg('Hotbar style', 'hotbar', ['Default', 'Connected'], s.hotbar))
        + row('EXP Bar', 'Eight new colours, plus a custom RGB option.', swatches)
        + row('Better Armor Bar', 'Colours the armor bar by material.', toggle(s.betterArmor, 'Better Armor Bar', 'betterArmor'))
        + row('Glacier Version', 'Show the Glacier version in the Debug HUD.', toggle(s.glacierVer, 'Show Glacier Version', 'glacierVer'))
        + '</div>';
}

function editorsPanel(s) {
    let grid = '';
    for (let i = 1; i <= 12; i++) {
        const on = i === s.crosshair;
        grid += '<button type="button" class="mm-cross' + (on ? ' is-active' : '') + '" data-value="' + i + '" aria-label="Crosshair ' + i + '" aria-pressed="' + on + '"><img src="assets/v7/ui/crosshair_' + i + '.png" alt="" width="15" height="15" loading="lazy" /></button>';
    }
    return '<div class="mm-editor">'
        + '<div class="mm-editor-side"><span class="mm-label">Crosshairs</span><div class="mm-cross-grid" data-mm-setting="crosshair">' + grid + '</div>'
        + row('Crosshair Outlines', 'Adds a dark outline for contrast.', toggle(s.outline, 'Crosshair Outlines', 'outline'))
        + '</div>'
        + '<div class="mm-preview" aria-label="Editor preview"><span class="mm-label">Editor Preview</span><img class="mm-preview-cross' + (s.outline ? ' is-outlined' : '') + '" src="assets/v7/ui/crosshair_' + s.crosshair + '.png" alt="" width="15" height="15" /></div>'
        + '</div>';
}

function musicPanel() {
    let list = '';
    TRACKS.forEach(([title, artist, len], i) => {
        list += '<button type="button" class="mm-track' + (i === 0 ? ' is-active' : '') + '" data-mm-track="' + i + '"><span class="mm-track-num">' + String(i + 1).padStart(2, '0') + '</span><span class="mm-track-title">' + title + '</span><span class="mm-track-artist">' + artist + '</span><span class="mm-track-len">' + len + '</span></button>';
    });
    return '<div class="mm-music">'
        + '<div class="mm-now"><span class="mm-disc" aria-hidden="true"></span><span class="mm-now-text"><span class="mm-label">Now playing</span><span class="mm-now-title">' + TRACKS[0][0] + '</span><span class="mm-now-artist">' + TRACKS[0][1] + '</span></span>'
        + '<button type="button" class="mm-play" aria-label="Play">' + glyph('assets/v7/ui/playing.png') + '</button></div>'
        + '<span class="mm-bar mm-progress"><span class="mm-bar-fill"></span></span>'
        + '<div class="mm-tracks">' + list + '</div>'
        + '</div>';
}

function markup(uid, modules, settings, closable) {
    let tabs = '';
    for (const [id, label] of TABS) {
        const on = id === 'modules';
        tabs += '<button type="button" class="mm-tab' + (on ? ' is-active' : '') + '" role="tab" id="' + uid + '-tab-' + id + '" aria-controls="' + uid + '-panel-' + id + '" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '">'
            + glyph('assets/v7/ui/tab_' + id + '.png') + '<span>' + label + '</span></button>';
    }
    const panels = { modules: modulesPanel(uid, modules), elements: elementsPanel(settings), editors: editorsPanel(settings), music_player: musicPanel() };
    let body = '';
    for (const [id] of TABS) {
        body += '<div class="mm-panel" role="tabpanel" id="' + uid + '-panel-' + id + '" aria-labelledby="' + uid + '-tab-' + id + '"' + (id === 'modules' ? '' : ' hidden') + '>' + panels[id] + '</div>';
    }
    return '<div class="mm-titlebar">'
        + '<img src="assets/logo.png" alt="" class="mm-logo" width="30" height="30" />'
        + '<span class="mm-title">Glacier</span><span class="mm-ver">v7</span>'
        + FLARE_SVG
        + (closable ? '<button type="button" class="mm-close" aria-label="Close mod menu">' + glyph('assets/v7/ui/exit.png') + '</button>' : '')
        + '</div>'
        + '<div class="mm-body">'
        + '<div class="mm-side" role="tablist" aria-label="Mod menu sections">' + tabs + '</div>'
        + '<div class="mm-main">' + body + '</div>'
        + '</div>';
}

let uidSeq = 0;

// Renders the mod menu into `root`. `modules` (id → on) and `settings` are
// read for the initial state and mutated in place as the user changes things;
// onChange(kind, key, value) fires after each change ('module' or 'setting').
export function mountModMenu(root, { modules, settings, onChange = () => {}, onClose = null }) {
    const uid = 'mm' + (++uidSeq);
    root.classList.add('mm');
    root.innerHTML = markup(uid, modules, settings, !!onClose);

    const cards = [...root.querySelectorAll('.mm-card')];
    const empty = root.querySelector('.mm-empty');
    const count = root.querySelector('.mm-count');
    const fill = root.querySelector('.mm-foot .mm-bar-fill');
    const search = root.querySelector('.mm-search input');
    const preview = root.querySelector('.mm-preview-cross');
    let cat = 'all';

    function syncCount() {
        const on = cards.filter(c => c.classList.contains('is-on')).length;
        count.textContent = on + ' of ' + cards.length + ' modules enabled';
        fill.style.transform = 'scaleX(' + (on / cards.length).toFixed(3) + ')';
    }

    function filter() {
        const term = search.value.toLowerCase().trim();
        let shown = 0;
        for (const c of cards) {
            const ok = (cat === 'all' || c.dataset.mmCat === cat) && (!term || c.dataset.mmText.includes(term));
            c.hidden = !ok;
            if (ok) shown++;
        }
        empty.hidden = shown > 0;
    }

    function selectTab(btn, focus) {
        for (const t of root.querySelectorAll('.mm-tab')) {
            const on = t === btn;
            t.classList.toggle('is-active', on);
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
            document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        }
        if (focus) btn.focus();
    }

    // Exclusive choice inside a group: mark the clicked one active, clear the rest.
    function pick(btn) {
        for (const b of btn.parentNode.children) {
            b.classList.toggle('is-active', b === btn);
            if (b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', String(b === btn));
        }
    }

    function set(key, value) {
        settings[key] = value;
        if (key === 'crosshair') preview.src = 'assets/v7/ui/crosshair_' + value + '.png';
        if (key === 'outline') preview.classList.toggle('is-outlined', value);
        if (key === 'exp') root.style.setProperty('--mm-exp', EXP_COLORS.find(c => c[0] === value)[1]);
        onChange('setting', key, value);
    }

    root.addEventListener('click', e => {
        const tab = e.target.closest('.mm-tab');
        if (tab) { selectTab(tab); return; }

        if (e.target.closest('.mm-close')) { onClose(); return; }

        const sw = e.target.closest('.mm-toggle');
        if (sw) {
            const on = sw.getAttribute('aria-checked') !== 'true';
            sw.setAttribute('aria-checked', String(on));
            const card = sw.closest('.mm-card');
            if (card) {
                card.classList.toggle('is-on', on);
                modules[card.dataset.mmId] = on;
                syncCount();
                onChange('module', card.dataset.mmId, on);
            } else if (sw.dataset.mmSetting) {
                set(sw.dataset.mmSetting, on);
            }
            return;
        }

        const pill = e.target.closest('.mm-pill');
        if (pill) {
            cat = pill.dataset.mmCat;
            pick(pill);
            filter();
            return;
        }

        // Segmented controls, EXP swatches and the crosshair grid all carry
        // their setting name on the group and the value on the button.
        const choice = e.target.closest('[data-mm-setting] > [data-value]');
        if (choice) {
            pick(choice);
            const key = choice.parentNode.dataset.mmSetting;
            set(key, key === 'crosshair' ? Number(choice.dataset.value) : choice.dataset.value);
            return;
        }

        const track = e.target.closest('.mm-track');
        if (track) {
            pick(track);
            const [title, artist] = TRACKS[Number(track.dataset.mmTrack)];
            root.querySelector('.mm-now-title').textContent = title;
            root.querySelector('.mm-now-artist').textContent = artist;
            const prog = root.querySelector('.mm-progress');
            prog.classList.remove('is-anim');
            void prog.offsetWidth; // restart the progress animation
            prog.classList.add('is-anim');
            setPlaying(true);
            return;
        }

        if (e.target.closest('.mm-play')) setPlaying(!root.classList.contains('is-playing'));
    });

    function setPlaying(on) {
        root.classList.toggle('is-playing', on);
        root.querySelector('.mm-progress').classList.add('is-anim');
        const btn = root.querySelector('.mm-play');
        btn.setAttribute('aria-label', on ? 'Pause' : 'Play');
        btn.querySelector('.v7-glyph').style.setProperty('--glyph', 'url(../assets/v7/ui/' + (on ? 'paused' : 'playing') + '.png)');
    }

    // Arrow keys move between tabs, as in any tablist.
    root.querySelector('.mm-side').addEventListener('keydown', e => {
        const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        if (!(e.key in keys)) return;
        e.preventDefault();
        e.stopPropagation();
        const tabs = [...root.querySelectorAll('.mm-tab')];
        const i = tabs.indexOf(document.activeElement);
        selectTab(tabs[(i + keys[e.key] + tabs.length) % tabs.length], true);
    });

    search.addEventListener('input', filter);
    root.style.setProperty('--mm-exp', EXP_COLORS.find(c => c[0] === settings.exp)[1]);
    syncCount();

    return { focus: () => root.querySelector('.mm-tab.is-active').focus() };
}

// "What's new in v7" changelog window: plain tabs over static panels.
export function setupChangelog() {
    const root = document.getElementById('v7Changelog');
    if (!root) return;
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    function select(tab, focus) {
        for (const t of tabs) {
            const on = t === tab;
            t.classList.toggle('is-active', on);
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
            document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        }
        if (focus) tab.focus();
    }
    root.addEventListener('click', e => {
        const tab = e.target.closest('[role="tab"]');
        if (tab) select(tab);
    });
    root.addEventListener('keydown', e => {
        const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        const i = tabs.indexOf(document.activeElement);
        if (i === -1 || !(e.key in keys)) return;
        e.preventDefault();
        select(tabs[(i + keys[e.key] + tabs.length) % tabs.length], true);
    });
}
