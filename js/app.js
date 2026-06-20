'use strict';
const USE_MONETIZATION = true;
const LINKVERTISE_USER_ID = 499358;

// Base URL of the Cloudflare Worker that tracks live download clicks.
// Leave empty to disable live counts (cards then show the static base numbers).
// Expected API:  GET <base>/counts -> { "v6.2": 12, ... }
//                POST <base>/increment/<key> -> { count: 13 }
const COUNTER_API = 'https://glacier-downloads.pepeoncloudeflare.workers.dev';

// Stable per-version key used by the counter (e.g. "Glacier v6.2" -> "v6.2").
function countKey(version) {
    const m = /v[\d.]+/i.exec(version || '');
    return m ? m[0].toLowerCase() : null;
}

const formatCount = n => Number(n).toLocaleString('en-US');

function getMonetizedUrl(targetUrl) {
    if (!USE_MONETIZATION || !LINKVERTISE_USER_ID) return targetUrl;
    try {
        const encoded = encodeURIComponent(btoa(encodeURI(targetUrl)));
        const random = Math.random() * 1000;
        return 'https://link-to.net/' + LINKVERTISE_USER_ID + '/' + random + '/dynamic/?r=' + encoded;
    } catch (e) {
        return targetUrl;
    }
}

// Text/key are derived from the latest client in downloads.json at runtime
// (see applyVersioning); only the static bits live here.
const NOTIFICATION = { cta: 'Download', section: 'downloads' };
let toastKey = '';

const META = {
    home: 'Next-gen Minecraft Bedrock client with 37+ modules, draggable HUD, and zero performance impact.',
    features: 'Explore the advanced features of Glacier Client config editor, custom themes, and auto-updates.',
    gallery: 'See Glacier Client in action with screenshots of the mod menu, start screen, and pause screen.',
    community: 'Join the Glacier Client Discord community for support, updates, and events.',
    downloads: 'Download the latest Glacier Client version for Minecraft Bedrock Edition.',
    faq: 'Frequently asked questions about Glacier Client installation, compatibility, and usage.',
    mods: 'Browse all 37+ modules available in Glacier Client for Minecraft Bedrock Edition.',
    license: 'Read the Glacier Client license to understand permitted and restricted usage.',
    donate: 'Support Glacier Client development through PayPal or Ko-fi.'
};

const MAIN = new Set(['home', 'features', 'gallery']);
const ALL = new Set(['home', 'features', 'gallery', 'community', 'downloads', 'faq', 'mods', 'license', 'donate']);

const $ = id => document.getElementById(id);

let dom;
let modsData = [];
let faqData = [];
let downloadsData = { clients: { working: [], legacy: [] }, extensions: { working: [], legacy: [] } };
let modCards = [];
let revealObs = null;
let usesCssTimeline = false;
const dlIndex = new Map();
let pendingDeepLink = null;
let currentSectionId = 'home';

// Eased scroll position that lerps toward window.scrollY each frame. Scroll-
// linked effects (side rail, top progress bar, showcase) read from this instead
// of the raw value so they glide and settle rather than tracking 1:1 — the
// "Apple-esque" feel — while native scrolling stays untouched.
let smoothY = 0;
const scrollSubs = [];

const ESC_RE = /[<>"']/g;
const ESC_MAP = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escAttr = s => String(s).replace(ESC_RE, c => ESC_MAP[c]);
const slice = (s, n) => s.length > n ? s.slice(0, n) + '…' : s;

function debounce(fn, ms) {
    let t = 0;
    return function (...a) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, a), ms);
    };
}

function formatBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
}

function showSection(id, sub) {
    if (!ALL.has(id)) id = 'home';
    currentSectionId = id;

    const targetEl = $(id + '-section');
    for (const s of dom.sections) {
        s.classList.toggle('active', s === targetEl);
    }
    for (const l of dom.navLinks) {
        l.classList.toggle('active', l.dataset.section === id);
    }

    updateSideNav(id);

    const hasDeepLink = id === 'downloads' && sub;

    if (!hasDeepLink) {
        if (id === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const cc = dom.contentContainer;
            if (cc) window.scrollTo({ top: cc.offsetTop - dom.headerEl.offsetHeight - 16, behavior: 'smooth' });
        }
    }

    const hash = hasDeepLink ? id + '/' + sub : id;
    history.replaceState(null, '', '#' + hash);
    closeMobileMenu();

    const desc = META[id] || META.home;
    if (dom.metaOgDesc) dom.metaOgDesc.setAttribute('content', desc);
    if (dom.metaTwDesc) dom.metaTwDesc.setAttribute('content', desc);
    if (dom.metaOgUrl) dom.metaOgUrl.setAttribute('content', 'https://glacierclient.xyz/#' + hash);

    if (hasDeepLink) {
        if (dlIndex.size) applyDeepLink(sub);
        else pendingDeepLink = sub;
    } else {
        pendingDeepLink = null;
    }

    requestAnimationFrame(observeReveals);
}

function parseHash() {
    const raw = location.hash.slice(1);
    if (!raw) return { id: '', sub: '' };
    const i = raw.indexOf('/');
    return i === -1 ? { id: raw, sub: '' } : { id: raw.slice(0, i), sub: raw.slice(i + 1) };
}

function slugify(s) {
    return s.toLowerCase().replace(/\+/g, '-plus').replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '');
}

function clientSlug(item) {
    const m = item.version.match(/v[\d.]+/i);
    return m ? m[0].toLowerCase() : slugify(item.version);
}

function applyDeepLink(sub) {
    const entry = dlIndex.get(sub.toLowerCase());
    if (!entry) return;
    setActiveTab(entry.tab);
    requestAnimationFrame(() => {
        entry.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        entry.el.classList.add('dl-highlight');
        setTimeout(() => entry.el.classList.remove('dl-highlight'), 2400);
    });
}

function updateSideNav(id) {
    const dots = MAIN.has(id)
        ? [['home', 'Home'], ['features', 'Features'], ['gallery', 'Gallery'], ['footer', 'Footer']]
        : [['home', 'Home'], [id, id[0].toUpperCase() + id.slice(1)], ['footer', 'Footer']];

    let html = '';
    for (const [i, l] of dots) {
        html += '<div class="side-dot" data-section="' + i + '" data-tooltip="' + l + '" role="button" tabindex="0" aria-label="Go to ' + l + '"></div>';
    }
    dom.sideNav.innerHTML = html;
    syncSideNav();
}

// Scroll-spy + progress rail for the side nav. Keeps the active dot in sync
// with the actual scroll position (footer lights up when reached, the current
// section otherwise) and drives the vertical rail fill via --sn-progress.
function syncSideNav() {
    if (!dom.sideNav) return;

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docH > 0 ? Math.min(Math.max(smoothY / docH, 0), 1) : 0;
    dom.sideNav.style.setProperty('--sn-progress', progress.toFixed(4));
    if (dom.progressBar) dom.progressBar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';

    const dots = dom.sideNav.children;
    if (!dots.length) return;

    // Footer is "reached" once a meaningful slice of it has scrolled into view
    // (its top sits at least 40px above the viewport bottom). This stays correct
    // for a short footer at the end of a tall page, where the footer never
    // climbs past the upper viewport.
    const footer = dom.footerEl;
    const footerActive = footer && footer.getBoundingClientRect().top < window.innerHeight - 40;
    const activeId = footerActive ? 'footer' : currentSectionId;

    for (const d of dots) {
        const on = d.dataset.section === activeId;
        d.classList.toggle('active', on);
        if (on) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
    }
}

function closeMobileMenu() {
    dom.navMenu.classList.remove('active');
    dom.mobileMenuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    dom.mobileMenuBtn.setAttribute('aria-expanded', 'false');
}

function toggleMobileMenu() {
    const open = dom.navMenu.classList.toggle('active');
    dom.mobileMenuBtn.innerHTML = open
        ? '<i class="fas fa-times" aria-hidden="true"></i>'
        : '<i class="fas fa-bars" aria-hidden="true"></i>';
    dom.mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function setActiveTab(name) {
    for (const b of document.querySelectorAll('.tab-button')) b.classList.toggle('active', b.dataset.tab === name);
    for (const c of document.querySelectorAll('.tab-content')) c.classList.toggle('active', c.id === name + '-tab-content');
}

function setActiveCategory(cat) {
    for (const b of document.querySelectorAll('.filter-button')) b.classList.toggle('active', b.dataset.category === cat);
    for (const c of modCards) {
        const ok = cat === 'all' || c.cats.includes(cat);
        c.el.style.display = ok ? '' : 'none';
    }
}

function searchMods(term) {
    term = term.toLowerCase().trim();
    for (const c of modCards) {
        c.el.style.display = (!term || c.title.includes(term) || c.desc.includes(term)) ? '' : 'none';
    }
}

function initSkeletons() {
    if (dom.modsGrid) dom.modsGrid.innerHTML = '<div class="skeleton skeleton-mod"></div>'.repeat(8);
    for (const id of ['working-clients', 'legacy-clients']) {
        const el = $(id);
        if (el) el.innerHTML = '<div class="skeleton skeleton-download"></div>'.repeat(2);
    }
    if (dom.launcherGrid) dom.launcherGrid.innerHTML = '<div class="launcher-loading"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Loading launcher releases...</div>';
}

function initMods() {
    if (!dom.modsGrid) return;
    let html = '';
    for (const m of modsData) {
        let tags = '';
        for (const t of m.tags) tags += '<span class="mod-tag">' + t + '</span>';
        html += '<div class="mod-card card-base reveal" data-categories="' + m.categories.join(',') + '">'
            + '<img src="' + m.icon + '" alt="' + escAttr(m.title) + '" class="mod-image" loading="lazy" decoding="async" width="76" height="76" />'
            + '<div class="mod-content">'
            + '<h3 class="mod-title">' + m.title + '</h3>'
            + '<p class="mod-description">' + m.description + '</p>'
            + '<div class="mod-tags">' + tags + '</div>'
            + '</div>'
            + '</div>';
    }
    dom.modsGrid.innerHTML = html;

    modCards = [];
    for (const el of dom.modsGrid.children) {
        modCards.push({
            el,
            cats: el.dataset.categories.split(','),
            title: el.querySelector('.mod-title').textContent.toLowerCase(),
            desc: el.querySelector('.mod-description').textContent.toLowerCase()
        });
    }
    setupTilt('.mod-card');
}

function initFAQ() {
    if (!dom.faqContainer) return;
    let html = '';
    for (let i = 0; i < faqData.length; i++) {
        const f = faqData[i];
        const video = f.videoUrl
            ? '<div class="faq-video"><iframe width="100%" height="300" src="' + f.videoUrl + '" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen loading="lazy" title="Tutorial video"></iframe></div>'
            : '';
        html += '<div class="faq-item reveal">'
            + '<details class="faq-card"' + (i === 0 ? ' open' : '') + '>'
            + '<summary class="faq-question"><span>' + f.question + '</span><i class="fas fa-chevron-down" aria-hidden="true"></i></summary>'
            + '<div class="faq-answer">' + f.answer + video + '</div>'
            + '</details>'
            + '</div>';
    }
    dom.faqContainer.innerHTML = html;
}

const btnClass = name => name === 'Download' ? 'btn-primary' : 'btn-secondary';

function buttonsHtml(opts) {
    let s = '';
    // Options flagged with "monetize" hold a raw file URL (e.g. Mediafire) and
    // get a fresh Linkvertise link generated on the fly, exactly like the
    // launcher releases. Pre-made Linkvertise links are used as-is.
    for (const o of opts) {
        const href = o.monetize ? getMonetizedUrl(o.url) : o.url;
        s += '<a href="' + href + '" class="btn ' + btnClass(o.name) + '" target="_blank" rel="noopener">' + o.name + '</a>';
    }
    return s;
}

function changelogHtml(entries) {
    if (!entries || !entries.length) return '';
    let rows = '';
    for (const c of entries) {
        let notes = '';
        for (const n of c.notes) notes += '<li>' + n + '</li>';
        rows += '<div class="changelog-entry">'
            + '<div class="changelog-entry-head">'
            + '<span class="changelog-entry-version">' + c.version + '</span>'
            + (c.date ? '<span class="changelog-entry-date">' + c.date + '</span>' : '')
            + '</div>'
            + (c.title ? '<p class="changelog-entry-title">' + c.title + '</p>' : '')
            + '<ul class="changelog-notes">' + notes + '</ul>'
            + '</div>';
    }
    return '<details class="ext-dropdown changelog-dropdown">'
        + '<summary class="ext-summary">'
        + '<span class="ext-summary-label"><i class="fas fa-clipboard-list" aria-hidden="true"></i> Changelog</span>'
        + '<i class="fas fa-chevron-down ext-chevron" aria-hidden="true"></i>'
        + '</summary>'
        + '<div class="ext-list">' + rows + '</div>'
        + '</details>';
}

const majorVersion = str => {
    const m = /v(\d+)/i.exec(str || '');
    return m ? m[1] : null;
};

function extDropdownHtml(exts) {
    if (!exts || !exts.length) return '';
    let rows = '';
    for (const e of exts) {
        rows += '<div class="ext-row">'
            + '<div class="ext-row-info">'
            + '<span class="ext-row-name">' + e.version + '</span>'
            + '<span class="ext-row-desc">' + e.description + '</span>'
            + '</div>'
            + '<div class="ext-row-actions">' + buttonsHtml(e.options) + '</div>'
            + '</div>';
    }
    const n = exts.length;
    return '<details class="ext-dropdown">'
        + '<summary class="ext-summary">'
        + '<span class="ext-summary-label"><i class="fas fa-puzzle-piece" aria-hidden="true"></i> '
        + n + ' compatible extension' + (n > 1 ? 's' : '') + '</span>'
        + '<i class="fas fa-chevron-down ext-chevron" aria-hidden="true"></i>'
        + '</summary>'
        + '<div class="ext-list">' + rows + '</div>'
        + '</details>';
}

function clientCard(item, slug, exts) {
    return '<div id="dl-' + slug + '" class="download-card reveal">'
        + '<div class="download-header">'
        + '<h3 class="download-title">' + item.version + '</h3>'
        + '<span class="download-tag ' + (item.tag === 'Latest' ? 'tag-latest' : 'tag-archived') + '">' + item.tag + '</span>'
        + '</div>'
        + '<div class="download-meta">'
        + '<span><i class="fas fa-calendar-alt download-meta-icon" aria-hidden="true"></i>' + item.release + '</span>'
        + '<span><i class="fas fa-file-archive download-meta-icon" aria-hidden="true"></i>' + item.size + '</span>'
        + (item.downloads != null
            ? '<span class="dl-count" data-dl-key="' + (countKey(item.version) || '') + '" data-dl-base="' + item.downloads + '">'
              + '<i class="fas fa-download download-meta-icon" aria-hidden="true"></i>'
              + '<span class="dl-count-num">' + formatCount(item.downloads) + '</span> downloads</span>'
            : '')
        + '</div>'
        + '<div class="download-buttons">' + buttonsHtml(item.options) + '</div>'
        + changelogHtml(item.changelog)
        + extDropdownHtml(exts)
        + '</div>';
}

function initDownloads() {
    // Extensions are tagged by client major version in their name, e.g.
    // "Hitbox (v6)". Group them so each is shown as a dropdown under the
    // matching client (v6 extensions also cover v6.1).
    const extByMajor = new Map();
    for (const e of [...downloadsData.extensions.working, ...downloadsData.extensions.legacy]) {
        const maj = majorVersion(e.version);
        if (!maj) continue;
        if (!extByMajor.has(maj)) extByMajor.set(maj, []);
        extByMajor.get(maj).push(e);
    }
    const usedMajors = new Set();

    const groups = [
        ['working-clients', downloadsData.clients.working],
        ['legacy-clients', downloadsData.clients.legacy]
    ];
    for (const [id, data] of groups) {
        const el = $(id);
        if (!el) continue;
        let html = '';
        const slugs = [];
        for (const item of data) {
            const slug = clientSlug(item);
            slugs.push(slug);
            const maj = majorVersion(item.version);
            let exts = null;
            if (maj && extByMajor.has(maj) && !usedMajors.has(maj)) {
                exts = extByMajor.get(maj);
                usedMajors.add(maj);
            }
            html += clientCard(item, slug, exts);
        }
        el.innerHTML = html;
        for (let i = 0; i < slugs.length; i++) {
            dlIndex.set(slugs[i], { tab: 'clients', el: el.children[i] });
        }
    }
    const latestIdx = downloadsData.clients.working.findIndex(c => c.tag === 'Latest');
    if (latestIdx !== -1) {
        const wc = $('working-clients');
        if (wc && wc.children[latestIdx]) dlIndex.set('latest', { tab: 'clients', el: wc.children[latestIdx] });
    }
    if (pendingDeepLink) { applyDeepLink(pendingDeepLink); pendingDeepLink = null; }
    initDownloadCounts();
}

// Displayed count = static base (from downloads.json) + live clicks tracked by
// the Cloudflare Worker. We fetch the worker's deltas once, then optimistically
// bump the number whenever a download button is clicked.
function initDownloadCounts() {
    const cells = [...document.querySelectorAll('.dl-count')];
    if (!cells.length) return;

    // Tolerate a trailing slash / placeholder in the configured URL.
    const apiBase = (COUNTER_API || '').replace(/\/+$/, '');
    const apiReady = apiBase && !/YOUR-SUBDOMAIN/.test(apiBase);

    const setCount = (cell, delta) => {
        const base = Number(cell.dataset.dlBase) || 0;
        const num = cell.querySelector('.dl-count-num');
        if (num) num.textContent = formatCount(base + (Number(delta) || 0));
    };

    if (apiReady) {
        fetch(apiBase + '/counts')
            .then(r => r.ok ? r.json() : {})
            .then(counts => {
                for (const cell of cells) {
                    const key = cell.dataset.dlKey;
                    if (key && counts[key] != null) setCount(cell, counts[key]);
                }
            })
            .catch(() => {});
    }

    // Increment on download-button click (delegated, once).
    if (initDownloadCounts._bound) return;
    initDownloadCounts._bound = true;
    document.addEventListener('click', e => {
        const btn = e.target.closest('.download-card .download-buttons a');
        if (!btn) return;
        const cell = btn.closest('.download-card').querySelector('.dl-count');
        if (!cell) return;
        const key = cell.dataset.dlKey;
        // Optimistic local bump so the user sees it react immediately.
        cell.dataset.dlBase = String((Number(cell.dataset.dlBase) || 0) + 1);
        setCount(cell, 0);
        if (key && apiReady) {
            // Roll the optimistic +1 back into the base and trust the worker total.
            cell.dataset.dlBase = String((Number(cell.dataset.dlBase) || 1) - 1);
            fetch(apiBase + '/increment/' + encodeURIComponent(key), { method: 'POST' })
                .then(r => r.ok ? r.json() : null)
                .then(d => { if (d && d.count != null) setCount(cell, d.count); })
                .catch(() => {});
        }
    });
}

function initLauncher() {
    if (!dom.launcherGrid) return;
    fetch('assets/data/launcher.json')
        .then(r => r.json())
        .then(rels => {
            if (!Array.isArray(rels) || !rels.length) {
                dom.launcherGrid.innerHTML = '<p class="launcher-empty">No launcher releases found.</p>';
                return;
            }
            let html = '';
            for (let i = 0; i < rels.length; i++) {
                const rel = rels[i];
                const tag = i === 0 ? 'Latest' : 'Archived';
                const date = new Date(rel.published_at).toISOString().slice(0, 10);
                const assets = rel.assets || [];
                let btns = '';
                for (const a of assets) btns += '<a href="' + getMonetizedUrl(a.browser_download_url) + '" class="btn btn-primary" target="_blank" rel="noopener"><i class="fas fa-download" aria-hidden="true"></i> ' + a.name + '</a>';
                const size = assets.length ? formatBytes(assets[0].size) : '';
                const tagSlug = slugify(rel.tag_name);
                html += '<div id="dl-launcher-' + tagSlug + '" class="download-card reveal">'
                    + '<div class="download-header">'
                    + '<h3 class="download-title">Glacier Launcher ' + rel.tag_name + '</h3>'
                    + '<span class="download-tag ' + (i === 0 ? 'tag-latest' : 'tag-archived') + '">' + tag + '</span>'
                    + '</div>'
                    + '<div class="download-meta">'
                    + '<span><i class="fas fa-calendar-alt download-meta-icon" aria-hidden="true"></i>' + date + '</span>'
                    + (size ? '<span><i class="fas fa-file-archive download-meta-icon" aria-hidden="true"></i>' + size + '</span>' : '')
                    + '</div>'
                    + '<div class="download-buttons">' + btns + '</div>'
                    + '</div>';
            }
            dom.launcherGrid.innerHTML = html;
            for (let i = 0; i < rels.length; i++) {
                const slug = 'launcher-' + slugify(rels[i].tag_name);
                dlIndex.set(slug, { tab: 'launcher', el: dom.launcherGrid.children[i] });
                if (i === 0) dlIndex.set('launcher-latest', { tab: 'launcher', el: dom.launcherGrid.children[i] });
            }
            if (pendingDeepLink) { applyDeepLink(pendingDeepLink); pendingDeepLink = null; }
            observeReveals();
        })
        .catch(() => {
            dom.launcherGrid.innerHTML = '<p class="launcher-error">Failed to load launcher releases. <a href="https://github.com/Glacier-Client-BE/Glacier-Launcher/releases/" target="_blank" rel="noopener">View on GitHub</a></p>';
        });
}

// Pull the latest client version (e.g. "v6.2") out of the downloads data so the
// header pill and announcement always match the newest release without edits.
function latestVersionLabel() {
    const w = (downloadsData.clients && downloadsData.clients.working) || [];
    const latest = w.find(c => c.tag === 'Latest') || w[0];
    if (!latest) return null;
    const m = /v[\d.]+/i.exec(latest.version);
    return m ? m[0] : latest.version;
}

function applyVersioning() {
    const v = latestVersionLabel();
    if (!v) return;
    const pill = document.querySelector('.version-pill');
    if (pill) pill.textContent = v;
    // The two corner popups share one slot: the version announcement takes
    // priority; the donation nudge fills in when there's no new release to show.
    if (!setupToast(v)) setupDonateToast();
}

function setupToast(version) {
    toastKey = 'glacier-' + version + '-release';
    if (sessionStorage.getItem(toastKey)) return false;
    $('toastMsg').textContent = 'Glacier ' + version + ' is now available!';
    const cta = $('toastCta');
    cta.textContent = NOTIFICATION.cta;
    cta.addEventListener('click', e => { e.preventDefault(); showSection(NOTIFICATION.section); dismissToast(); });
    document.body.classList.add('has-toast');
    $('toastClose').addEventListener('click', dismissToast);
    // Let the page settle, then spring the popup in from the corner.
    setTimeout(() => $('toastBanner').classList.add('visible'), 700);
    return true;
}

function dismissToast() {
    if (toastKey) sessionStorage.setItem(toastKey, '1');
    $('toastBanner').classList.remove('visible');
    document.body.classList.remove('has-toast');
}

// Donation prompt: same springy corner popup as the announcement, shown on
// every load (when the version announcement isn't taking the slot). The CTA
// carries data-section="donate" so the global delegation handles navigation;
// here we just hide it. Dismissing only hides it for the current view — a
// reload brings it back.
function setupDonateToast() {
    const banner = $('donateBanner');
    if (!banner) return;
    document.body.classList.add('has-toast');
    $('donateClose').addEventListener('click', dismissDonateToast);
    $('donateCta').addEventListener('click', dismissDonateToast);
    setTimeout(() => banner.classList.add('visible'), 900);
}

function dismissDonateToast() {
    $('donateBanner').classList.remove('visible');
    document.body.classList.remove('has-toast');
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gc-theme', theme);
    $('themeToggle').innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun" aria-hidden="true"></i>'
        : '<i class="fas fa-moon" aria-hidden="true"></i>';
}

const SEARCH_HINT = '<div class="search-empty-hint"><i class="fas fa-search" aria-hidden="true"></i><span>Search across mods, FAQ, downloads and news</span><span class="search-hint-sub">Try "FPS", "install", or "v6.1"</span></div>';

function setupGlobalSearch() {
    const modal = $('searchModal');
    const input = $('globalSearchInput');
    const results = $('searchResults');

    function open() {
        modal.classList.add('open');
        requestAnimationFrame(() => input.focus());
    }
    function close() {
        modal.classList.remove('open');
        input.value = '';
        results.innerHTML = SEARCH_HINT;
    }

    $('searchTrigger').addEventListener('click', open);
    $('searchClose').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
        else if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    const run = debounce(() => {
        const term = input.value.toLowerCase().trim();
        if (!term) { results.innerHTML = SEARCH_HINT; return; }

        const mods = [];
        for (const m of modsData) {
            if (mods.length >= 5) break;
            if (m.title.toLowerCase().includes(term) || m.description.toLowerCase().includes(term)) mods.push(m);
        }

        const faqs = [];
        for (const f of faqData) {
            if (faqs.length >= 3) break;
            if (f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term)) faqs.push(f);
        }

        const dl = [];
        const pools = [downloadsData.clients.working, downloadsData.clients.legacy, downloadsData.extensions.working, downloadsData.extensions.legacy];
        outer: for (const pool of pools) for (const d of pool) {
            if (d.version.toLowerCase().includes(term)) {
                dl.push(d);
                if (dl.length >= 3) break outer;
            }
        }

        if (!mods.length && !faqs.length && !dl.length) {
            results.innerHTML = '<div class="search-no-results"><i class="fas fa-search search-no-results-icon" aria-hidden="true"></i>No results for "' + escAttr(input.value) + '"</div>';
            return;
        }

        let html = '';
        if (mods.length) {
            html += '<div class="search-result-group"><div class="search-result-label">Mods</div>';
            for (const m of mods) html += '<div class="search-result-item" data-section="mods"><img src="' + m.icon + '" alt="' + escAttr(m.title) + '" class="search-result-icon-img" /><div><div class="search-result-title">' + m.title + '</div><div class="search-result-desc">' + slice(m.description, 60) + '</div></div></div>';
            html += '</div>';
        }
        if (faqs.length) {
            html += '<div class="search-result-group"><div class="search-result-label">FAQ</div>';
            for (const f of faqs) html += '<div class="search-result-item" data-section="faq"><div class="search-result-icon-box icon-box-faq"><i class="fas fa-question" aria-hidden="true"></i></div><div><div class="search-result-title">' + slice(f.question, 65) + '</div></div></div>';
            html += '</div>';
        }
        if (dl.length) {
            html += '<div class="search-result-group"><div class="search-result-label">Downloads</div>';
            for (const d of dl) html += '<div class="search-result-item" data-section="downloads"><div class="search-result-icon-box icon-box-dl"><i class="fas fa-download" aria-hidden="true"></i></div><div><div class="search-result-title">' + d.version + '</div></div></div>';
            html += '</div>';
        }
        results.innerHTML = html;
    }, 120);

    input.addEventListener('input', run);
    results.addEventListener('click', e => {
        const item = e.target.closest('.search-result-item');
        if (item) { showSection(item.dataset.section); close(); }
    });
}

function fetchDiscord() {
    fetch('https://discord.com/api/guilds/938248183878930514/widget.json')
        .then(r => r.json())
        .then(d => {
            const el = $('discordOnline');
            if (el && d.presence_count !== undefined) el.textContent = d.presence_count.toLocaleString();
        })
        .catch(() => {});
}

function setupScroll() {
    const header = dom.headerEl;
    const back = $('backToTop');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    smoothY = window.scrollY;

    // Single rAF loop that drives every scroll-linked effect from one eased
    // value. It keeps running until smoothY catches the real scroll position,
    // then parks itself so an idle page costs nothing.
    function frame() {
        const targetY = window.scrollY;
        const diff = targetY - smoothY;
        if (reduce || Math.abs(diff) < 0.4) {
            smoothY = targetY;
        } else {
            smoothY += diff * 0.16;
        }

        header.classList.toggle('scrolled', smoothY > 50);
        back.classList.toggle('visible', smoothY > 320);
        syncSideNav();
        for (const fn of scrollSubs) fn(smoothY);

        if (!reduce && Math.abs(window.scrollY - smoothY) >= 0.4) {
            raf = requestAnimationFrame(frame);
        } else {
            smoothY = window.scrollY;
            raf = 0;
        }
    }

    const schedule = () => { if (!raf) raf = requestAnimationFrame(frame); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    frame();

    back.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function setupReveal() {
    usesCssTimeline = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'));
    if (usesCssTimeline) {
        document.documentElement.classList.add('css-timeline');
        return;
    }
    if (!('IntersectionObserver' in window)) {
        for (const el of document.querySelectorAll('.reveal')) el.classList.add('is-visible');
        return;
    }
    document.documentElement.classList.add('js-reveal');
    revealObs = new IntersectionObserver(entries => {
        for (const en of entries) {
            if (en.isIntersecting) {
                en.target.classList.add('is-visible');
                revealObs.unobserve(en.target);
            }
        }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    observeReveals();
}

function observeReveals() {
    if (!revealObs) return;
    for (const el of document.querySelectorAll('.reveal:not(.is-visible)')) revealObs.observe(el);
}

function setupShowcase() {
    const showcase = document.querySelector('.showcase');
    if (!showcase) return;

    const imgs = [...document.querySelectorAll('.showcase-img')];
    const texts = [...document.querySelectorAll('.showcase-text')];
    const ticks = [...document.querySelectorAll('.showcase-tick')];
    const n = imgs.length;
    if (!n) return;
    const span = n - 1;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
    // smootherstep — flat at both ends. Applied within each segment it gives
    // every frame a "dwell" where it sits fully composed, then a quick crossfade
    // into the next, instead of a constant linear scrub.
    const smoother = x => x * x * x * (x * (x * 6 - 15) + 10);

    // y is the eased scroll position from the shared loop. We derive the section's
    // document-space top from the *real* scroll so the mapping stays correct, then
    // feed the eased y through it for the buttery, slightly-trailing motion.
    function render(y) {
        const rect = showcase.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const absTop = rect.top + window.scrollY;
        const p = total > 0 ? clamp01((y - absTop) / total) : 0;

        const posF = p * span;
        const lo = Math.min(Math.floor(posF), span);
        const pos = reduce ? Math.round(posF) : Math.min(lo + smoother(posF - lo), span);
        const baseI = Math.min(Math.floor(pos), span);
        const t = pos - baseI;                       // 0..1 within the active segment
        const nearest = Math.round(pos);

        for (let i = 0; i < n; i++) {
            const d = pos - i;
            // Opaque base layer + incoming layer fading over it → a clean dissolve
            // with no bleed-through to the backdrop mid-transition.
            const op = i === baseI ? 1 : (i === baseI + 1 ? t : 0);

            const img = imgs[i];
            const txt = texts[i];
            if (reduce) {
                img.style.opacity = img.style.transform = '';
                if (txt) txt.style.opacity = txt.style.transform = '';
            } else {
                const ad = Math.min(Math.abs(d), 1);
                img.style.opacity = op.toFixed(3);
                img.style.transform = `translateY(${(-d * 1.6).toFixed(2)}%) scale(${(1 + 0.06 * ad).toFixed(3)})`;
                if (txt) {
                    txt.style.opacity = op.toFixed(3);
                    txt.style.transform = `translateY(${(-d * 14).toFixed(1)}px)`;
                }
            }
            img.classList.toggle('is-active', i === nearest);
            if (txt) txt.classList.toggle('is-active', i === nearest);
        }

        for (let i = 0; i < n; i++) {
            const tick = ticks[i];
            if (!tick) continue;
            tick.style.setProperty('--w', clamp01(1 - Math.abs(pos - i)).toFixed(3));
            tick.style.setProperty('--fill', clamp01(pos - i + 1).toFixed(3));
            tick.classList.toggle('is-active', i === nearest);
        }
    }

    scrollSubs.push(render);
    render(smoothY);
}

// Pointer-driven 3D tilt for cards and the hero image. Each element rotates
// toward the cursor in shared perspective (set on the parent grid via CSS) and
// shows a glare highlight that tracks the pointer. One rAF per element keeps it
// smooth; disabled on touch/coarse pointers and reduced-motion.
let tiltEnabled = null;   // cached capability check (null until first call)

function tiltAllowed() {
    if (tiltEnabled === null) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
        tiltEnabled = !reduce && !coarse;
    }
    return tiltEnabled;
}

function setupTilt(selector) {
    if (!tiltAllowed()) return;

    const MAX = 9;     // peak rotation in degrees
    const LIFT = -6;   // px the card lifts toward the viewer

    for (const el of document.querySelectorAll(selector)) {
        if (el.classList.contains('tilt-3d')) continue;   // idempotent — skip wired elements
        const glare = document.createElement('span');
        glare.className = 'tilt-glare';
        el.appendChild(glare);
        el.classList.add('tilt-3d');

        let raf = 0;
        let px = 0.5, py = 0.5;

        const apply = () => {
            raf = 0;
            const ry = (px - 0.5) * 2 * MAX;        // left/right → rotateY
            const rx = (0.5 - py) * 2 * MAX;        // up/down → rotateX
            el.style.setProperty('--tilt-ry', ry.toFixed(2) + 'deg');
            el.style.setProperty('--tilt-rx', rx.toFixed(2) + 'deg');
            el.style.setProperty('--tilt-lift', LIFT + 'px');
            glare.style.setProperty('--glare-x', (px * 100).toFixed(1) + '%');
            glare.style.setProperty('--glare-y', (py * 100).toFixed(1) + '%');
        };

        el.addEventListener('pointermove', e => {
            if (e.pointerType === 'touch') return;
            const r = el.getBoundingClientRect();
            px = (e.clientX - r.left) / r.width;
            py = (e.clientY - r.top) / r.height;
            if (!raf) raf = requestAnimationFrame(apply);
        });

        el.addEventListener('pointerenter', e => {
            if (e.pointerType === 'touch') return;
            el.classList.add('is-tilting');
        });

        el.addEventListener('pointerleave', () => {
            if (raf) { cancelAnimationFrame(raf); raf = 0; }
            el.classList.remove('is-tilting');
            el.style.setProperty('--tilt-rx', '0deg');
            el.style.setProperty('--tilt-ry', '0deg');
            el.style.setProperty('--tilt-lift', '0px');
        });
    }
}

function handleSectionClick(id) {
    if (id === 'footer') {
        if (dom.footerEl) dom.footerEl.scrollIntoView({ behavior: 'smooth' });
        // The scroll-spy will settle the active dot; reflect it immediately too.
        syncSideNav();
    } else {
        showSection(id);
    }
}

function setupDelegation() {
    document.addEventListener('click', e => {
        const linked = e.target.closest('[data-section]');
        if (linked && !linked.hasAttribute('target')) {
            const id = linked.dataset.section;
            if (id) { e.preventDefault(); handleSectionClick(id); return; }
        }
        const tab = e.target.closest('.tab-button');
        if (tab) { setActiveTab(tab.dataset.tab); return; }
        const filter = e.target.closest('.filter-button');
        if (filter) { setActiveCategory(filter.dataset.category); return; }
        if (!dom.navMenu.contains(e.target) && !dom.mobileMenuBtn.contains(e.target)) closeMobileMenu();
    });

    document.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const dot = e.target.closest('.side-dot');
        if (dot) { e.preventDefault(); handleSectionClick(dot.dataset.section); }
    });
}

function loadData() {
    return Promise.all([
        fetch('assets/data/mods.json').then(r => r.json()),
        fetch('assets/data/faq.json').then(r => r.json()),
        fetch('assets/data/downloads.json').then(r => r.json())
    ]).then(([m, f, d]) => { modsData = m; faqData = f; downloadsData = d; });
}

function init() {
    dom = {
        headerEl: $('mainHeader'),
        navMenu: $('navMenu'),
        mobileMenuBtn: $('mobileMenuBtn'),
        sideNav: $('sideNav'),
        progressBar: $('scrollProgress'),
        footerEl: document.querySelector('footer'),
        sections: document.querySelectorAll('.content-section'),
        navLinks: document.querySelectorAll('.nav-tab'),
        contentContainer: document.querySelector('.content-container'),
        modsGrid: $('modsGrid'),
        faqContainer: $('faqContainer'),
        launcherGrid: $('launcher-releases'),
        metaOgDesc: document.querySelector('meta[property="og:description"]'),
        metaTwDesc: document.querySelector('meta[name="twitter:description"]'),
        metaOgUrl: document.querySelector('meta[property="og:url"]')
    };

    $('currentYear').textContent = new Date().getFullYear();

    initSkeletons();
    setupScroll();
    setupReveal();
    setupShowcase();
    setupTilt('.feature-card, .gallery-item, .donate-card, .social-card, .license-card, .hero-image');
    setupDelegation();

    dom.mobileMenuBtn.addEventListener('click', e => { e.stopPropagation(); toggleMobileMenu(); });

    applyTheme(localStorage.getItem('gc-theme') || 'dark');
    $('themeToggle').addEventListener('click', () => {
        applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    const modSearch = $('modSearch');
    if (modSearch) modSearch.addEventListener('input', debounce(e => searchMods(e.target.value), 100));

    setupGlobalSearch();
    fetchDiscord();

    window.addEventListener('popstate', () => {
        const { id, sub } = parseHash();
        showSection(ALL.has(id) ? id : 'home', sub);
    });
    const initial = parseHash();
    showSection(ALL.has(initial.id) ? initial.id : 'home', initial.sub);

    loadData().then(() => {
        applyVersioning();
        initFAQ();
        initMods();
        initDownloads();
        initLauncher();
        observeReveals();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
