'use strict';

// Global site search (Ctrl/Cmd+K or "/"). One index covers quick actions, pages,
// mods, feature cards and showcase frames, FAQ, docs sections, downloads and
// external links. It is built on first use and rebuilt when the language
// changes. Matching folds case and accents, allows one typo in words of four or
// more letters, takes prefixes and a few synonyms, and ranks title > keyword >
// body text, with a small boost for mods, pages and actions.

import { state } from './state.js?v=20261024212106';
import { $, debounce, emptyStateHtml, escAttr, formatBytes, prefersReducedMotion, slugify } from './utils.js?v=20261024212106';
import { showSection, showNotFound, searchMods, setActiveTab, toggleMobileMenu } from './navigation.js?v=20261024212106';
import { applyTheme } from './ui.js?v=20261024212106';
import { t, currentLang } from './i18n.js?v=20261024212106';

const RECENT_KEY = 'gc-search-recent';
const RECENT_MAX = 5;
const GROUP_CAP = 5;
const SUGGESTED = ['dl', 'config', 'discord', 'theme'];
const POPULAR_MODS = ['coordinates', 'fpscounter', 'armorhud', 'hitbox'];
const BOOST = { action: 4, page: 4, mod: 6, docs: 2 };
const KIND_LABEL = {
    action: 'search.kind.actions', page: 'search.kind.pages', mod: 'search.kind.mods',
    feat: 'search.kind.features', faq: 'search.kind.faq', docs: 'search.kind.docs',
    dl: 'search.kind.downloads', link: 'search.kind.links'
};
const PLATFORMS = 'Mobile · PC · Console';

// English aliases and shorthand for each module, keyed by mods.json id.
const MOD_ALIASES = new Map(Object.entries({
    capephysics: 'cape physics capes cloth',
    armorhud: 'armor armour armor hud armour hud durability',
    bowindicator: 'bow arrow charge indicator',
    chat: 'chat messages text',
    chunkborder: 'chunk border chunks borders',
    clockcompass: 'clock compass time',
    coordinates: 'coords xyz position location x y z',
    crosshairchanger: 'crosshair crosshairs reticle aim cross',
    dayevent: 'day event daytime calendar',
    daycounter: 'day counter days survival',
    debughud: 'debug f3 debug screen',
    directionhud: 'direction heading facing compass',
    expcalculator: 'exp xp experience calculator levels',
    forcecoords: 'force coordinates always show',
    fpscounter: 'fps frames framerate performance counter',
    hitbox: 'hitboxes hit box collision',
    hitcolor: 'hit color damage flash red flash',
    hotbar: 'hot bar slots toolbar',
    hudpopup: 'hud popup popups notifications pop up',
    inventoryhud: 'inventory inv bag',
    itemcounter: 'item count items counter',
    lowdurability: 'durability low durability tools warning',
    mainhandhud: 'mainhand main hand held item hand',
    mobileshortcuts: 'mobile shortcuts touch buttons',
    offhandhud: 'offhand off hand shield second hand',
    playerlist: 'players list tab player list online',
    safezoneviewer: 'safezone safe zone safe area screen edges',
    saturationdisplaychanger: 'saturation hunger display',
    serverdisplay: 'server display server name ip',
    shinypotions: 'potions potion glint shiny effects',
    slotcounter: 'slots slot counter slot',
    speedometer: 'speed speedometer velocity bps kmh',
    statushud: 'status health hunger effects',
    targethud: 'target enemy mob health target hud',
    timerhud: 'timer timers stopwatch',
    walkdistance: 'distance walked walk odometer',
    waypointsplus: 'waypoints waypoint markers beacons'
}));

// Small synonym sets. A synonym match counts a little less than a direct one.
const SYN = new Map(Object.entries({
    coords: ['coordinates', 'xyz', 'position', 'location'],
    coord: ['coordinates'],
    cords: ['coordinates'],
    fps: ['framerate', 'frames', 'performance'],
    install: ['installation', 'setup', 'import'],
    installation: ['install', 'setup'],
    setup: ['install', 'installation'],
    download: ['get', 'mcpack', 'latest'],
    downloads: ['download'],
    latest: ['newest', 'new', 'current'],
    newest: ['latest'],
    theme: ['themes', 'dark', 'light', 'mode', 'color'],
    themes: ['theme'],
    dark: ['theme'],
    light: ['theme'],
    discord: ['chat', 'server', 'community'],
    support: ['donate', 'donation', 'paypal', 'kofi'],
    donate: ['donation', 'support', 'paypal', 'kofi'],
    donation: ['donate', 'support'],
    paypal: ['donate'],
    kofi: ['donate'],
    bug: ['issue', 'report', 'github'],
    report: ['bug', 'issue'],
    github: ['source', 'code', 'repo'],
    config: ['settings', 'configuration', 'editor', 'json'],
    settings: ['config', 'configuration'],
    configuration: ['config', 'settings'],
    editor: ['config'],
    json: ['config'],
    help: ['docs', 'documentation', 'faq', 'guide'],
    docs: ['documentation', 'help', 'guide'],
    faq: ['questions', 'answers'],
    questions: ['faq'],
    armour: ['armor'],
    armor: ['armour'],
    colour: ['color'],
    color: ['colour'],
    android: ['mobile', 'ios'],
    ios: ['mobile', 'android'],
    mobile: ['android', 'ios'],
    pc: ['windows'],
    windows: ['pc'],
    path: ['folder', 'location', 'directory'],
    folder: ['path'],
    language: ['translate', 'locale', 'idioma'],
    lang: ['language'],
    translate: ['language'],
    license: ['legal', 'terms'],
    terms: ['license', 'legal'],
    legal: ['license', 'terms'],
    tos: ['terms'],
    privacy: ['data', 'gdpr'],
    gdpr: ['privacy'],
    brand: ['logo', 'media', 'kit'],
    logo: ['brand'],
    media: ['kit', 'brand'],
    kit: ['media'],
    screenshot: ['screenshots', 'images', 'gallery'],
    screenshots: ['screenshot', 'gallery'],
    gallery: ['screenshots'],
    showcase: ['video', 'videos', 'creators'],
    video: ['showcase'],
    videos: ['showcase'],
    module: ['modules', 'mod', 'mods'],
    modules: ['module', 'mods'],
    mod: ['mods', 'module'],
    mods: ['mod', 'module'],
    update: ['updates', 'upgrade', 'version'],
    updates: ['update'],
    version: ['update'],
    error: ['404', 'missing'],
    '404': ['error', 'notfound'],
    notfound: ['404'],
    speed: ['speedometer'],
    hitbox: ['hitboxes', 'collision']
}));

const LINKS = [
    { k: 'discord', name: 'Discord server', url: 'https://discord.glacierclient.xyz', host: 'discord.glacierclient.xyz', ic: 'fab fa-discord', kw: 'discord server chat community join' },
    { k: 'github', name: 'GitHub organization', url: 'https://github.com/Glacier-Client-BE', host: 'github.com/Glacier-Client-BE', ic: 'fab fa-github', kw: 'github source code repo issues bug' },
    { k: 'youtube', name: 'YouTube', url: 'https://youtube.com/@glacierclient', host: 'youtube.com/@glacierclient', ic: 'fab fa-youtube', kw: 'youtube video channel watch' },
    { k: 'x', name: 'X (Twitter)', url: 'https://x.com/glacierclientbe', host: 'x.com/glacierclientbe', ic: 'fab fa-x-twitter', kw: 'x twitter tweet follow news' },
    { k: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/glacierclientmcbe', host: 'instagram.com/glacierclientmcbe', ic: 'fab fa-instagram', kw: 'instagram photos follow' },
    { k: 'tiktok', name: 'TikTok', url: 'https://www.tiktok.com/@glacierclientmcbe', host: 'tiktok.com/@glacierclientmcbe', ic: 'fab fa-tiktok', kw: 'tiktok short videos follow' },
    { k: 'kofi', name: 'Ko-fi', url: 'https://ko-fi.com/pepeonkofi', host: 'ko-fi.com/pepeonkofi', ic: 'fas fa-mug-hot', kw: 'ko-fi kofi donate support tip' },
    { k: 'paypal', name: 'PayPal', url: 'https://paypal.me/PepeOnPayPal', host: 'paypal.me/PepeOnPayPal', ic: 'fab fa-paypal', kw: 'paypal donate support tip' }
];

// ── Actions and pages ─────────────────────────────────────────────────────
// Quick actions run directly. `keep` actions leave the modal open.
const ACTIONS = [
    { k: 'dl', ic: 'fas fa-download', run: () => showSection('downloads', 'latest') },
    { k: 'config', ic: 'fas fa-sliders', run: () => location.assign('/config/') },
    { k: 'discord', ic: 'fab fa-discord', run: () => openExternal('https://discord.glacierclient.xyz') },
    { k: 'theme', ic: 'fas fa-circle-half-stroke', run: toggleTheme },
    { k: 'lang', ic: 'fas fa-globe', run: openLanguage },
    { k: 'copyMobile', ic: 'fas fa-copy', keep: true, run: () => copyPath('android') },
    { k: 'copyWin', ic: 'fas fa-copy', keep: true, run: () => copyPath('windows') },
    { k: 'bug', ic: 'fab fa-github', run: () => openExternal('https://github.com/Glacier-Client-BE') },
    { k: 'donate', ic: 'fas fa-heart', run: () => showSection('donate') }
];

const PAGES = [
    { id: 'home', nav: 'nav.home', d: 'home', ic: 'fas fa-house', run: () => showSection('home') },
    { id: 'features', nav: 'nav.features', d: 'features', ic: 'fas fa-star', run: () => showSection('features') },
    { id: 'downloads', nav: 'nav.downloads', d: 'downloads', ic: 'fas fa-download', run: () => showSection('downloads') },
    { id: 'community', nav: 'nav.community', d: 'community', ic: 'fas fa-users', run: () => showSection('community') },
    { id: 'docs', nav: 'nav.help', d: 'docs', ic: 'fas fa-book', run: () => showSection('docs') },
    { id: 'donate', nav: 'nav.donate', d: 'donate', ic: 'fas fa-heart', run: () => showSection('donate') },
    { id: 'faq', nav: 'nav.faq', d: 'faq', ic: 'fas fa-circle-question', run: () => showSection('faq') },
    { id: 'config', name: 'search.pg.config', d: 'config', ic: 'fas fa-sliders', run: () => location.assign('/config/') },
    { id: 'mediakit', name: 'search.pg.mediakit', d: 'mediakit', ic: 'fas fa-palette', run: () => showSection('mediakit') },
    { id: 'notfound', name: 'search.pg.notfound', d: 'notfound', ic: 'fas fa-triangle-exclamation', run: () => { showNotFound(); history.pushState(null, '', '/404'); } },
    { id: 'gallery', name: 'search.pg.gallery', d: 'gallery', ic: 'fas fa-images', run: () => showSection('gallery') },
    { id: 'mods', name: 'search.pg.mods', d: 'mods', ic: 'fas fa-cubes', run: () => showSection('mods') },
    { id: 'license', name: 'search.pg.license', d: 'license', ic: 'fas fa-scale-balanced', run: () => showSection('license') },
    { id: 'tos', name: 'search.pg.tos', d: 'tos', ic: 'fas fa-file-lines', run: () => showSection('tos') },
    { id: 'privacy', name: 'search.pg.privacy', d: 'privacy', ic: 'fas fa-user-shield', run: () => showSection('privacy') },
    { id: 'best-bedrock-client', name: 'search.pg.best', d: 'best', ic: 'fas fa-trophy', run: () => showSection('best-bedrock-client') }
];

// ── Text helpers ──────────────────────────────────────────────────────────
const COMBINING = /[̀-ͯ]/g;
const MARK = /\p{M}/u;
const SEP = /[^\p{L}\p{N}.+#]/u;

// Folds text for matching: decomposed, accents stripped, lowercased, and every
// run of other characters collapsed to one space. start/end tie each folded
// character back to its span in the original string, for <mark> highlighting.
function fold(text) {
    const str = String(text == null ? '' : text);
    let s = '';
    const start = [];
    const end = [];
    let pos = 0;
    for (const ch of str) {
        const from = pos;
        pos += ch.length;
        if (MARK.test(ch)) { if (end.length) end[end.length - 1] = pos; continue; }
        if (SEP.test(ch)) {
            if (s.length && s[s.length - 1] !== ' ') { s += ' '; start.push(from); end.push(pos); }
            continue;
        }
        const f = ch.normalize('NFD').replace(COMBINING, '').toLowerCase();
        for (let k = 0; k < f.length; k++) { s += f[k]; start.push(from); end.push(pos); }
    }
    if (s.endsWith(' ')) { s = s.slice(0, -1); start.pop(); end.pop(); }
    return { s, start, end };
}

const collapse = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
const clip = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const words = s => (s ? s.split(' ').map(w => w.replace(/^\.+|\.+$/g, '')).filter(Boolean) : []);
const text = el => (el ? collapse(el.textContent) : '');
// Visible label text: innerText keeps words in sibling spans apart.
const label = el => (el ? collapse(el.innerText || el.textContent) : '');
const $$ = sel => [...document.querySelectorAll(sel)];

let docParser = null;
// Plain text of an HTML snippet from our own FAQ data. DOMParser documents do
// not run scripts or load images, unlike a detached element with innerHTML.
function plain(html) {
    const src = String(html || '');
    if (typeof DOMParser === 'undefined') return collapse(src.replace(/<[^>]+>/g, ' '));
    docParser = docParser || new DOMParser();
    return collapse(docParser.parseFromString(src, 'text/html').body.textContent || '');
}

function iconClass(el, fallback) {
    const m = el && /(?:^|\s)fa-([a-z0-9-]+)/.exec(el.className && el.className.baseVal !== undefined ? el.className.baseVal : (el.className || ''));
    return m ? 'fas fa-' + m[1] : fallback;
}

// Edit distance of at most one (optimal string alignment): one substitution,
// insertion, deletion or adjacent transposition.
function withinOne(a, b) {
    const la = a.length;
    const lb = b.length;
    if (a === b) return true;
    if (Math.abs(la - lb) > 1) return false;
    let i = 0;
    while (i < la && i < lb && a[i] === b[i]) i++;
    if (la === lb) {
        if (a.slice(i + 1) === b.slice(i + 1)) return true;
        return i + 1 < la && a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
    }
    if (la > lb) return withinOne(b, a);
    return a.slice(i) === b.slice(i + 1);
}

// ── Scoring ───────────────────────────────────────────────────────────────
// Tiers: [exact, prefix floor, typo]. A prefix scores between its floor and
// the exact score, closer to exact the more of the word the query covers.
const TITLE = [100, 70, 60];
const KEYS = [72, 50, 42];
const BODY = [30, 20, 12];

function wordScore(w, x, tier) {
    if (x === w) return tier[0];
    if (x.startsWith(w)) return tier[1] + (tier[0] - tier[1]) * (w.length / x.length);
    if (w.length >= 4 && x.length >= 4 && Math.abs(x.length - w.length) <= 1 && withinOne(w, x)) return tier[2];
    return 0;
}

function direct(e, w, factor) {
    let best = 0;
    for (const x of e.tw) { const v = wordScore(w, x, TITLE); if (v > best) best = v; }
    for (const x of e.kw) { const v = wordScore(w, x, KEYS); if (v > best) best = v; }
    if (best < KEYS[1]) for (const x of e.bw) { const v = wordScore(w, x, BODY); if (v > best) best = v; }
    if (!best && w.length >= 3 && e.all.includes(w)) best = 5;
    return best * factor;
}

function tokenScore(e, tk) {
    let best = direct(e, tk.t, 1);
    if (best < TITLE[0]) {
        for (const s of tk.syns) { const v = direct(e, s, 0.6); if (v > best) best = v; }
    }
    return best;
}

function tokensFor(q) {
    return q.split(' ').filter(Boolean).map(w => ({ t: w, syns: SYN.get(w) || [] }));
}

function scoreEntry(e, toks, q) {
    let total = 0;
    for (const tk of toks) {
        const s = tokenScore(e, tk);
        if (!s) return 0;
        total += s;
    }
    if (e.nt === q) total += 200;
    else if (e.nt.startsWith(q)) total += 120;
    else if (q.length > 1 && e.nt.includes(q)) total += 40;
    if (e.nk.includes(' ' + q + ' ')) total += 40;
    return total + (BOOST[e.kind] || 0);
}

function rank(list, toks, q) {
    const hits = [];
    for (const e of list) {
        const s = scoreEntry(e, toks, q);
        if (s > 0) hits.push({ e, s });
    }
    hits.sort((a, b) => b.s - a.s);
    return hits;
}

// Groups keep the order of their best hit, so the strongest group comes first.
function groupHits(hits) {
    const map = new Map();
    for (const h of hits) {
        let g = map.get(h.e.kind);
        if (!g) { g = { kind: h.e.kind, best: h.s, items: [] }; map.set(h.e.kind, g); }
        g.items.push(h.e);
    }
    return [...map.values()];
}

// Wraps every match of the query tokens in <mark>, escaping everything else.
function highlight(str, toks) {
    if (!toks.length || !str) return esc(str);
    const f = fold(str);
    const ranges = [];
    for (const tk of toks) {
        let i = f.s.indexOf(tk);
        while (i !== -1) {
            ranges.push([f.start[i], f.end[i + tk.length - 1]]);
            i = f.s.indexOf(tk, i + 1);
        }
    }
    if (!ranges.length) return esc(str);
    ranges.sort((a, b) => a[0] - b[0]);
    let out = '';
    let last = 0;
    for (let [a, b] of ranges) {
        if (a < last) a = last;
        if (b <= a) continue;
        out += esc(str.slice(last, a)) + '<mark class="search-hl">' + esc(str.slice(a, b)) + '</mark>';
        last = b;
    }
    return out + esc(str.slice(last));
}

// A short window of body text around the first match, for FAQ and docs rows.
function snippetFor(body, toks) {
    const f = fold(body);
    let at = -1;
    for (const tk of toks) {
        const i = f.s.indexOf(tk);
        if (i !== -1 && (at === -1 || i < at)) at = i;
    }
    if (at === -1) return '';
    const os = f.start[at];
    const from = Math.max(0, os - 48);
    const to = Math.min(body.length, os + 110);
    return (from > 0 ? '… ' : '') + collapse(body.slice(from, to)) + (to < body.length ? ' …' : '');
}

// ── Index ─────────────────────────────────────────────────────────────────
function makeEntry(kind, id, title, sub, body, keys, extra) {
    const nt = fold(title).s;
    const nk = fold(keys).s;
    const nb = fold(body).s;
    return Object.assign({
        kind, id,
        title: collapse(title),
        sub: collapse(sub),
        body: collapse(body),
        ic: 'fas fa-star',
        img: '',
        run: null,
        keep: false
    }, extra, {
        nt,
        nk: ' ' + nk + ' ',
        tw: words(nt),
        kw: words(nk),
        bw: [...new Set(words(nb))],
        all: nt + ' ' + nk + ' ' + nb
    });
}

let cache = null;
let cacheLang = '';
let dirty = true;
let launchers = [];
let launchReady = false;

function dataLoaded() {
    return state.modsData.length > 0 && state.faqData.length > 0 && state.downloadsData.clients.working.length > 0;
}

function loadLaunchers() {
    fetch('assets/data/launcher.json')
        .then(r => (r.ok ? r.json() : []))
        .then(list => { launchers = Array.isArray(list) ? list : []; })
        .catch(() => { launchers = []; })
        .finally(() => { launchReady = true; dirty = true; });
}

function buildEntries(lang) {
    const out = [];
    const add = (kind, id, title, sub, body, keys, extra) => out.push(makeEntry(kind, id, title, sub, body, keys, extra));

    for (const a of ACTIONS) {
        add('action', 'act-' + a.k, t(lang, 'search.act.' + a.k), '', '', t(lang, 'search.kw.' + a.k), { ic: a.ic, run: a.run, keep: !!a.keep });
    }

    for (const p of PAGES) {
        const desc = t(lang, 'search.pd.' + p.d);
        add('page', 'page-' + p.id, t(lang, p.nav || p.name), desc, desc, t(lang, 'search.pk.' + p.d) + ' ' + p.id, { ic: p.ic, run: p.run });
    }

    $$('#features-section .feature-card').forEach((card, i) => {
        const desc = text(card.querySelector('.feature-desc'));
        add('feat', 'feat-' + i, label(card.querySelector('.feature-title')), desc, desc, text(card.querySelector('.feature-badge')),
            { ic: iconClass(card.querySelector('.feature-icon i'), 'fas fa-star'), run: () => goFeature(i) });
    });

    const captions = $$('.sc-cap');
    $$('.sc-tab').forEach((tab, i) => {
        const cap = text(captions[i]);
        add('feat', 'showcase-' + i, label(tab), cap, cap, t(lang, 'search.kind.features'), { ic: 'fas fa-images', run: () => goShowcase(i) });
    });

    for (const f of state.faqData) {
        const question = t(lang, 'faqq.' + f.id) || f.question;
        const answer = plain(t(lang, 'faqa.' + f.id) || f.answer);
        const cat = t(lang, 'faqcat.' + f.category) || f.category;
        add('faq', 'faq-' + f.id, question, cat, answer, cat, { ic: 'fas fa-circle-question', run: () => goFaq(question) });
    }

    $$('#docs-section .docs-card').forEach(card => {
        const h = card.querySelector('h3');
        const title = label(h);
        const body = text(card);
        const toc = text(document.querySelector('.docs-toc-link[href="#' + card.id + '"]'));
        add('docs', card.id, title, clip(body, 110), body, toc, { ic: iconClass(h && h.querySelector('i'), 'fas fa-book'), run: () => goDocs(card.id) });
    });

    const dl = state.downloadsData;
    const clients = [...dl.clients.working, ...dl.clients.legacy];
    for (const c of clients) {
        const slug = clientSlug(c.version);
        const tag = c.tag === 'Latest' ? t(lang, 'dl.tagLatest') : t(lang, 'dl.tagArchived');
        const notes = [];
        for (const cl of c.changelog || []) {
            notes.push(t(lang, 'changelog.' + cl.version + '.title') || cl.title || '');
            (cl.notes || []).forEach((n, i) => notes.push(t(lang, 'changelog.' + cl.version + '.note' + i) || n));
        }
        const num = (/\d+(?:\.\d+)*/.exec(c.version) || [''])[0];
        add('dl', 'dl-' + slug, c.version, [tag, c.release, c.size].filter(Boolean).join(' · '), [PLATFORMS, ...notes].join(' '),
            [num, 'v' + num, c.release, tag, c.tag === 'Latest' ? 'latest newest' : '', 'mobile pc console client'].join(' '),
            { ic: 'fas fa-download', run: () => showSection('downloads', slug) });
    }

    for (const x of [...dl.extensions.working, ...dl.extensions.legacy]) {
        const maj = (/v(\d+)/i.exec(x.version) || [])[1] || '';
        const kindLabel = t(lang, 'search.kind.ext');
        add('dl', 'ext-' + slugify(x.version), x.version, [kindLabel, x.description].filter(Boolean).join(' · '), x.description || '',
            kindLabel + ' extension addon ' + maj + ' v' + maj, { ic: 'fas fa-puzzle-piece', run: () => goExtension(x.version) });
    }

    for (const r of launchers) {
        const tag = String(r.tag_name || '');
        if (!tag) continue;
        const date = String(r.published_at || '').slice(0, 10);
        const size = r.assets && r.assets[0] && typeof r.assets[0].size === 'number' ? formatBytes(r.assets[0].size) : '';
        const label = t(lang, 'search.kind.launcher');
        add('dl', 'launcher-' + slugify(tag), 'Glacier Launcher ' + tag, [label, date, size].filter(Boolean).join(' · '), '',
            tag + ' ' + tag.replace(/^v/i, '') + ' ' + date + ' windows exe ' + label,
            { ic: 'fas fa-rocket', run: () => showSection('downloads', 'launcher-' + slugify(tag)) });
    }

    for (const L of LINKS) {
        add('link', 'link-' + L.k, L.name, L.host, '', L.kw + ' ' + t(lang, 'search.kind.links'), { ic: L.ic, run: () => openExternal(L.url) });
    }

    for (const m of state.modsData) {
        const title = t(lang, m.titleKey) || m.id;
        const desc = t(lang, m.descKey) || '';
        const cats = (m.categories || []).map(c => t(lang, 'mods.filter.' + c) || c);
        const tags = (m.tags || []).map(k => (k.startsWith('tag.') ? t(lang, k) : k));
        add('mod', 'mod-' + m.id, title, clip(desc, 96), desc,
            [MOD_ALIASES.get(m.id) || '', ...cats, ...tags, ...(m.categories || [])].join(' '),
            { img: m.icon, run: () => goMod(m.id) });
    }
    return out;
}

// The index is cached per language once the data it reads is in. Until then
// it is rebuilt on each use, which is cheap and keeps results correct.
function getEntries(lang) {
    if (cache && !dirty && cacheLang === lang) return cache;
    const built = buildEntries(lang);
    if (dataLoaded() && launchReady) { cache = built; cacheLang = lang; dirty = false; }
    return built;
}

function clientSlug(version) {
    const m = String(version).match(/v[\d.]+/i);
    return m ? m[0].toLowerCase() : slugify(version);
}

// ── Actions and navigation helpers ────────────────────────────────────────
function after(fn) {
    setTimeout(fn, prefersReducedMotion() ? 60 : 420);
}

function revealEl(el, block = 'center') {
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block });
    el.classList.remove('search-flash');
    void el.offsetWidth;
    el.classList.add('search-flash');
    setTimeout(() => el.classList.remove('search-flash'), 2000);
}

function openExternal(url) {
    window.open(url, '_blank', 'noopener');
}

function toggleTheme() {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

function openLanguage() {
    const trigger = $('langDropdownTrigger');
    if (!trigger) return;
    const menu = state.dom && state.dom.navMenu;
    // Below 480px the language control lives in the mobile menu panel.
    if (!trigger.offsetParent && menu && !menu.classList.contains('active')) toggleMobileMenu();
    trigger.click();
}

function copyPath(which) {
    const want = which === 'android' ? /android\/data/i : /%userprofile%/i;
    const code = $$('#docs-config code').find(c => want.test(c.textContent));
    const value = code ? code.textContent.trim() : '';
    if (!value || !navigator.clipboard) return;
    navigator.clipboard.writeText(value)
        .then(() => announce(t(currentLang(), 'search.copied')))
        .catch(() => {});
}

// Status text for screen readers, and the visible line in the modal footer.
let statusEl = null;
let msgEl = null;
function announce(msg) {
    if (statusEl) statusEl.textContent = msg;
    if (msgEl) msgEl.textContent = msg;
}

function goFeature(i) {
    showSection('features');
    after(() => revealEl($$('#features-section .feature-card')[i]));
}

function goShowcase(i) {
    showSection('home');
    after(() => {
        const tab = $$('.sc-tab')[i];
        if (tab) tab.click();
        revealEl(document.querySelector('.sc-stage'));
    });
}

function resetModFilters() {
    const ms = $('modSearch');
    if (ms) ms.value = '';
    searchMods('');
    const all = document.querySelector('#features-section .filter-button[data-category="all"]');
    // Always click: the chip's active class is not kept in sync on this page.
    if (all) all.click();
}

function goMod(id) {
    resetModFilters();
    showSection('mods');
    after(() => {
        const grid = $('modsGrid');
        const card = grid ? [...grid.children].find(c => c.dataset.modId === id) : null;
        revealEl(card);
    });
}

function goFaq(question) {
    const faqAll = document.querySelector('#faqFilterControls [data-faq-category="all"]');
    if (faqAll && !faqAll.classList.contains('active')) faqAll.click();
    showSection('faq');
    after(() => {
        const item = $$('#faqContainer .faq-item').find(el => text(el.querySelector('.faq-question span')) === collapse(question));
        if (!item) return;
        const d = item.querySelector('details');
        if (d) d.open = true;
        revealEl(item);
    });
}

function goDocs(id) {
    showSection('docs');
    after(() => revealEl(document.getElementById(id), 'start'));
}

function goExtension(name) {
    setActiveTab('clients');
    showSection('downloads');
    after(() => {
        const row = $$('.ext-row').find(r => text(r.querySelector('.ext-row-name')) === collapse(name));
        if (!row) return;
        const d = row.closest('details');
        if (d) d.open = true;
        revealEl(row);
    });
}

// ── Recent searches ───────────────────────────────────────────────────────
function readRecent() {
    try {
        const list = JSON.parse(localStorage.getItem(RECENT_KEY));
        return Array.isArray(list) ? list.filter(x => typeof x === 'string').slice(0, RECENT_MAX) : [];
    } catch {
        return [];
    }
}

function writeRecent(list) {
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX))); } catch { }
}

function rememberRecent(raw) {
    const q = collapse(raw).slice(0, 60);
    if (!q) return;
    const list = readRecent().filter(x => x.toLowerCase() !== q.toLowerCase());
    list.unshift(q);
    writeRecent(list);
}

function clearRecent() {
    try { localStorage.removeItem(RECENT_KEY); } catch { }
}

// ── Modal ─────────────────────────────────────────────────────────────────
function rowHtml(it, i) {
    const lang = currentLang();
    const id = 'sr-opt-' + i;
    const style = ' style="--i:' + Math.min(i, 12) + '"';
    if (it.type === 'more') {
        return '<div class="search-result-item search-result-more" role="option" id="' + id + '" data-i="' + i + '" aria-selected="false"' + style + '>'
            + '<span class="search-result-icon-box" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>'
            + '<div class="search-result-text"><div class="search-result-title">' + esc(t(lang, 'search.showAll').replace('{n}', it.n)) + '</div></div></div>';
    }
    if (it.type === 'recent') {
        return '<div class="search-result-item" role="option" id="' + id + '" data-i="' + i + '" aria-selected="false"' + style + '>'
            + '<span class="search-result-icon-box" aria-hidden="true"><i class="fas fa-clock-rotate-left"></i></span>'
            + '<div class="search-result-text"><div class="search-result-title">' + esc(it.q) + '</div></div></div>';
    }
    const e = it.e;
    const toks = it.toks;
    const icon = e.img
        ? '<img class="search-result-icon-img" src="' + escAttr(e.img) + '" alt="" width="32" height="32" loading="lazy" decoding="async" />'
        : '<span class="search-result-icon-box" aria-hidden="true"><i class="' + e.ic + '"></i></span>';
    const titleHit = toks.some(w => e.nt.includes(w));
    let descHtml = esc(e.sub);
    if (toks.length && !titleHit && e.body) {
        const sn = snippetFor(e.body, toks);
        if (sn) descHtml = highlight(sn, toks);
    } else if (toks.length) {
        descHtml = highlight(e.sub, toks);
    }
    return '<div class="search-result-item" role="option" id="' + id + '" data-i="' + i + '" aria-selected="false"' + style + '>'
        + icon
        + '<div class="search-result-text"><div class="search-result-title">' + highlight(e.title, toks) + '</div>'
        + (descHtml ? '<div class="search-result-desc">' + descHtml + '</div>' : '') + '</div></div>';
}

export function setupGlobalSearch() {
    const modal = $('searchModal');
    const input = $('globalSearchInput');
    const results = $('searchResults');
    const trigger = $('searchTrigger');
    const closeBtn = $('searchClose');
    if (!modal || !input || !results || !trigger) return;
    statusEl = $('searchStatus');
    msgEl = $('searchMsg');

    let rows = [];        // rendered row descriptors, indexed like data-i
    let active = -1;      // highlighted row
    let lastFocus = null;
    let lastRaw = '';     // raw query of the last run
    let lastQ = '';       // folded query of the last run
    let lastHits = [];
    let lastLang = '';
    const expanded = new Set();

    loadLaunchers();

    const optionEls = () => [...results.querySelectorAll('[role="option"]')];

    function setActive(i, scroll) {
        const els = optionEls();
        if (!els.length) { active = -1; input.removeAttribute('aria-activedescendant'); return; }
        const n = ((i % els.length) + els.length) % els.length;
        active = n;
        els.forEach((el, k) => {
            const on = k === n;
            el.classList.toggle('is-active', on);
            el.setAttribute('aria-selected', String(on));
        });
        input.setAttribute('aria-activedescendant', els[n].id);
        if (scroll) els[n].scrollIntoView({ block: 'nearest' });
    }

    function paint(sections, header) {
        rows = [];
        let html = header || '';
        for (const sec of sections) {
            if (!sec.items.length) continue;
            const gid = 'sr-grp-' + sec.key;
            html += '<div class="search-result-group" role="group" aria-labelledby="' + gid + '">'
                + '<div class="search-result-label" id="' + gid + '">' + (sec.html || esc(sec.label)) + '</div>';
            for (const it of sec.items) {
                const i = rows.length;
                rows.push(it);
                html += rowHtml(it, i);
            }
            html += '</div>';
        }
        results.innerHTML = html;
        results.classList.remove('is-entering');
        void results.offsetWidth;
        results.classList.add('is-entering');
        input.setAttribute('aria-expanded', rows.length ? 'true' : 'false');
        input.removeAttribute('aria-activedescendant');
        active = -1;
    }

    // Draws the grouped hits, honouring which groups were expanded.
    function paintHits() {
        const lang = currentLang();
        const words_ = lastQ ? lastQ.split(' ') : [];
        const sections = groupHits(lastHits).map(g => {
            const cap = expanded.has(g.kind) ? g.items.length : Math.min(GROUP_CAP, g.items.length);
            const items = g.items.slice(0, cap).map(e => ({ type: 'entry', e, toks: words_ }));
            if (g.items.length > cap) items.push({ type: 'more', key: g.kind, n: g.items.length });
            return { key: g.kind, label: t(lang, KIND_LABEL[g.kind]), items };
        });
        paint(sections, '');
        setActive(0, false);
    }

    function renderIdle() {
        lastHits = [];
        lastRaw = '';
        lastQ = '';
        expanded.clear();
        const lang = currentLang();
        const list = getEntries(lang);
        const byId = id => list.find(e => e.id === id);
        const sections = [];
        const recent = readRecent();
        if (recent.length) {
            sections.push({
                key: 'recent',
                html: '<span>' + esc(t(lang, 'search.recent')) + '</span><button type="button" class="search-label-btn" data-clear-recent>' + esc(t(lang, 'search.clearRecent')) + '</button>',
                items: recent.map(q => ({ type: 'recent', q }))
            });
        }
        const sug = SUGGESTED.map(k => byId('act-' + k)).filter(Boolean);
        sections.push({ key: 'suggested', label: t(lang, 'search.suggested'), items: sug.map(e => ({ type: 'entry', e, toks: [] })) });
        const pop = POPULAR_MODS.map(id => byId('mod-' + id)).filter(Boolean);
        sections.push({ key: 'popular', label: t(lang, 'search.popular'), items: pop.map(e => ({ type: 'entry', e, toks: [] })) });
        paint(sections, '<div class="search-idle-hint">' + esc(t(lang, 'search.idle')) + '</div>');
        setActive(0, false);
    }

    function runSearch() {
        lastRaw = input.value;
        const q = fold(lastRaw).s;
        if (!q) { renderIdle(); return; }
        const lang = currentLang();
        if (q !== lastQ || lang !== lastLang) expanded.clear();
        lastQ = q;
        lastLang = lang;
        const hits = rank(getEntries(lang), tokensFor(q), q);
        lastHits = hits;
        if (!hits.length) {
            rows = [];
            active = -1;
            results.innerHTML = emptyStateHtml('fa-magnifying-glass', t(lang, 'empty.search'),
                '<button type="button" class="btn btn-secondary" data-search-clear>' + esc(t(lang, 'empty.clearSearch')) + '</button>'
                + '<span class="search-try">' + esc(t(lang, 'search.try')) + '</span>');
            input.setAttribute('aria-expanded', 'false');
            input.removeAttribute('aria-activedescendant');
            if (statusEl) statusEl.textContent = t(lang, 'empty.search');
            return;
        }
        paintHits();
        if (statusEl) statusEl.textContent = t(lang, 'search.count').replace('{n}', hits.length);
    }

    const scheduleRun = debounce(runSearch, 80);

    function activate(i) {
        const it = rows[i];
        if (!it) return;
        if (it.type === 'more') {
            expanded.add(it.key);
            paintHits();
            setActive(i, true);   // the first hidden row now sits at this index
            return;
        }
        if (it.type === 'recent') {
            input.value = it.q;
            runSearch();
            input.focus();
            return;
        }
        rememberRecent(lastRaw);
        if (it.e.keep) { it.e.run(); return; }
        close();
        it.e.run();
    }

    function open() {
        if (modal.classList.contains('open')) { input.focus(); return; }
        lastFocus = document.activeElement;
        modal.classList.add('open');
        input.value = '';
        renderIdle();
        // Focus at once so keys typed right after Ctrl+K land in the query.
        input.focus();
        requestAnimationFrame(() => input.focus());
    }

    function close() {
        if (!modal.classList.contains('open')) return;
        modal.classList.remove('open');
        input.value = '';
        lastRaw = '';
        lastQ = '';
        lastHits = [];
        expanded.clear();
        rows = [];
        active = -1;
        results.innerHTML = '';
        announce('');
        const back = lastFocus && lastFocus.isConnected ? lastFocus : trigger;
        back.focus({ preventScroll: true });
    }

    trigger.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    // Keyboard control while the dialog is open. Tab cycles the results and
    // focus never leaves the input (a focus trap for a modal combobox).
    modal.addEventListener('keydown', e => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') { e.preventDefault(); close(); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1, true); return; }
        if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1, true); return; }
        if (e.key === 'Tab') { e.preventDefault(); setActive(active + (e.shiftKey ? -1 : 1), true); return; }
        if (e.key === 'Enter' && !e.isComposing) {
            e.preventDefault();
            if (input.value !== lastRaw) runSearch();
            if (active >= 0) activate(active);
        }
    });

    modal.addEventListener('focusout', e => {
        if (modal.classList.contains('open') && (!e.relatedTarget || !modal.contains(e.relatedTarget))) {
            requestAnimationFrame(() => { if (modal.classList.contains('open')) input.focus(); });
        }
    });
    modal.addEventListener('focusin', e => {
        if (e.target !== input && e.target !== closeBtn && modal.classList.contains('open')) input.focus();
    });

    input.addEventListener('input', scheduleRun);

    results.addEventListener('click', e => {
        if (e.target.closest('[data-search-clear]')) { input.value = ''; runSearch(); input.focus(); return; }
        if (e.target.closest('[data-clear-recent]')) { clearRecent(); renderIdle(); input.focus(); return; }
        const row = e.target.closest('[role="option"]');
        if (row) activate(Number(row.dataset.i));
    });
    results.addEventListener('pointermove', e => {
        const row = e.target.closest('[role="option"]');
        if (!row) return;
        const i = Number(row.dataset.i);
        if (i !== active) setActive(i, false);
    });

    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            open();
            return;
        }
        if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !isEditable(e.target) && !modal.classList.contains('open')) {
            e.preventDefault();
            open();
        }
    });

    // The index holds translated strings, so rebuild it on language change.
    document.addEventListener('gc:langchange', () => {
        dirty = true;
        if (!modal.classList.contains('open')) return;
        if (lastRaw) runSearch(); else renderIdle();
    });
}

function isEditable(el) {
    return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
}

// Exposed for tests: the ranking and the index, without the modal.
export const searchInternals = {
    entries: () => getEntries(currentLang()),
    rank: raw => {
        const q = fold(raw).s;
        return rank(getEntries(currentLang()), tokensFor(q), q);
    },
    fold
};
