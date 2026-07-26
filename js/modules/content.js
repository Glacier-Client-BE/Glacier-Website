'use strict';

import { state } from './state.js?v=20260726113218';
import { $, escAttr, formatBytes, formatCount, countKey, slugify, getMonetizedUrl, markCopyableCode } from './utils.js?v=20260726113218';
import { COUNTER_API } from './config.js?v=20260726113218';
import { applyDeepLink } from './navigation.js?v=20260726113218';
import { observeReveals } from './reveal.js?v=20260726113218';
import { setupTilt } from './tilt.js?v=20260726113218';
import { t, currentLang } from './i18n.js?v=20260726113218';

// ── Data loading ──────────────────────────────────────────────────────────
export function loadData() {
    return Promise.all([
        fetch('assets/data/mods.json').then(r => r.json()),
        fetch('assets/data/faq.json').then(r => r.json()),
        fetch('assets/data/downloads.json').then(r => r.json())
    ]).then(([m, f, d]) => { state.modsData = m; state.faqData = f; state.downloadsData = d; });
}

export function initSkeletons() {
    if (state.dom.modsGrid) state.dom.modsGrid.innerHTML = '<div class="skeleton skeleton-mod"></div>'.repeat(8);
    for (const id of ['working-clients', 'legacy-clients']) {
        const el = $(id);
        if (el) el.innerHTML = '<div class="skeleton skeleton-download"></div>'.repeat(2);
    }
    if (state.dom.launcherGrid) state.dom.launcherGrid.innerHTML = '<div class="launcher-loading"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i> ' + t(currentLang(), 'dl.loadingLauncher') + '</div>';
}

// ── Mods ──────────────────────────────────────────────────────────────────
const FAV_KEY = 'gc-fav-mods';

function loadFavorites() {
    try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY)) || []); }
    catch { return new Set(); }
}

function saveFavorites(favs) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify([...favs])); } catch { }
}

export function initMods() {
    if (!state.dom.modsGrid) return;
    const lang = currentLang();
    const favs = loadFavorites();
    let html = '';
    for (const m of state.modsData) {
        const title = m.titleKey ? t(lang, m.titleKey) : m.title;
        const desc = m.descKey ? t(lang, m.descKey) : m.description;
        let tags = '';
        for (const tagKey of m.tags) {
            const tagText = tagKey.startsWith('tag.') ? t(lang, tagKey) : tagKey;
            tags += '<span class="mod-tag">' + tagText + '</span>';
        }
        const fav = favs.has(m.id);
        html += '<div class="mod-card card-base reveal' + (fav ? ' is-fav' : '') + '"'
            + ' data-categories="' + m.categories.join(',') + '" data-mod-id="' + escAttr(m.id) + '">'
            + '<button class="mod-fav" type="button" aria-pressed="' + fav + '"'
            + ' aria-label="' + (fav ? 'Unfavorite ' : 'Favorite ') + escAttr(title) + '">'
            + '<i class="' + (fav ? 'fas' : 'far') + ' fa-star" aria-hidden="true"></i></button>'
            + '<div class="mod-icon-tile">'
            + '<img src="' + m.icon + '" alt="" class="mod-image" loading="lazy" decoding="async" width="48" height="48" />'
            + '</div>'
            + '<h3 class="mod-title">' + title + '</h3>'
            + '<p class="mod-description">' + desc + '</p>'
            + '<div class="mod-tags">' + tags + '</div>'
            + '</div>';
    }
    state.dom.modsGrid.innerHTML = html;

    state.modCards = [];
    for (const el of state.dom.modsGrid.children) {
        state.modCards.push({
            el,
            id: el.dataset.modId,
            cats: el.dataset.categories.split(','),
            title: el.querySelector('.mod-title').textContent.toLowerCase(),
            desc: el.querySelector('.mod-description').textContent.toLowerCase()
        });
    }
    setupTilt('.mod-card');
    refreshModsVisibility();
}

// Toggles a mod's favorite star (delegated from navigation.js). Favorites are
// persisted and float to the top of the grid via CSS order.
export function toggleModFavorite(btn) {
    const card = btn.closest('.mod-card');
    if (!card) return;
    const id = card.dataset.modId;
    const favs = loadFavorites();
    const nowFav = !favs.has(id);
    if (nowFav) favs.add(id); else favs.delete(id);
    saveFavorites(favs);
    card.classList.toggle('is-fav', nowFav);
    btn.setAttribute('aria-pressed', String(nowFav));
    const title = card.querySelector('.mod-title').textContent;
    btn.setAttribute('aria-label', (nowFav ? 'Unfavorite ' : 'Favorite ') + title);
    btn.querySelector('i').className = (nowFav ? 'fas' : 'far') + ' fa-star';
    // If the Favorites filter is active, an un-starred card leaves the view.
    if (state.modFilter.cat === 'favorites') refreshModsVisibility();
}

// One source of truth for which mod cards are visible: the active category
// chip (incl. the special "favorites" one) AND the search term must both match.
export function refreshModsVisibility() {
    const { cat, term } = state.modFilter;
    let shown = 0;
    for (const c of state.modCards) {
        const catOk = cat === 'all'
            || (cat === 'favorites' ? c.el.classList.contains('is-fav') : c.cats.includes(cat));
        const termOk = !term || c.title.includes(term) || c.desc.includes(term);
        const ok = catOk && termOk;
        c.el.style.display = ok ? '' : 'none';
        if (ok) shown++;
    }
    const count = $('modsCount');
    if (count) count.textContent = t(currentLang(), 'mods.countOf').replace('{shown}', shown).replace('{total}', state.modCards.length);
    const empty = $('modsEmpty');
    if (empty) empty.style.display = shown ? 'none' : '';
}

// ── FAQ ───────────────────────────────────────────────────────────────────
const FAQ_ICONS = {
    'Getting Started': 'fa-flag-checkered',
    'Installation & Setup': 'fa-download',
    'Troubleshooting': 'fa-wrench',
    'Features & Compatibility': 'fa-layer-group',
    'Community & Content': 'fa-users',
    'Legal & Privacy': 'fa-scale-balanced'
};

function faqCategoryOrder() {
    const seen = [];
    for (const f of state.faqData) if (!seen.includes(f.category)) seen.push(f.category);
    return seen;
}

function faqCardHtml(f, open) {
    const video = f.videoUrl
        ? '<div class="faq-video"><iframe width="100%" height="300" src="' + f.videoUrl + '" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen loading="lazy" title="Tutorial video"></iframe></div>'
        : '';
    return '<div class="faq-item reveal" data-category="' + escAttr(f.category) + '">'
        + '<details class="faq-card"' + (open ? ' open' : '') + '>'
        + '<summary class="faq-question"><span>' + f.question + '</span><i class="fas fa-chevron-down" aria-hidden="true"></i></summary>'
        + '<div class="faq-answer">' + f.answer + video + '</div>'
        + '</details>'
        + '</div>';
}

export function initFAQ() {
    if (!state.dom.faqContainer) return;
    const lang = currentLang();
    const categories = faqCategoryOrder();

    let filterHtml = '<button class="filter-button active" data-faq-category="all">' + t(lang, 'faq.allQuestions') + '</button>';
    for (const cat of categories) {
        const catLabel = t(lang, 'faqcat.' + cat);
        filterHtml += '<button class="filter-button" data-faq-category="' + escAttr(cat) + '">' + catLabel + '</button>';
    }
    if (state.dom.faqFilterControls) state.dom.faqFilterControls.innerHTML = filterHtml;

    let html = '';
    let first = true;
    for (const cat of categories) {
        const items = state.faqData.filter(f => f.category === cat);
        const catLabel = t(lang, 'faqcat.' + cat);
        html += '<div class="faq-category-group" data-category="' + escAttr(cat) + '">'
            + '<h3 class="faq-category-heading"><i class="fas ' + (FAQ_ICONS[cat] || 'fa-circle-question') + '" aria-hidden="true"></i> ' + catLabel + '</h3>';
        for (const f of items) {
            const question = t(lang, 'faqq.' + f.id);
            const answer = t(lang, 'faqa.' + f.id);
            html += faqCardHtml({ ...f, question, answer }, first);
            first = false;
        }
        html += '</div>';
    }
    state.dom.faqContainer.innerHTML = html;
    markCopyableCode(state.dom.faqContainer);
}

export function filterFAQCategory(cat) {
    for (const group of state.dom.faqContainer.querySelectorAll('.faq-category-group')) {
        group.style.display = (cat === 'all' || group.dataset.category === cat) ? '' : 'none';
    }
}

// ── Downloads ─────────────────────────────────────────────────────────────
const btnClass = name => name === 'Download' ? 'btn-primary' : 'btn-secondary';

function buttonsHtml(opts) {
    let s = '';
    const lang = currentLang();
    // Options flagged with "monetize" hold a raw file URL (e.g. Mediafire) and
    // get a fresh Linkvertise link generated on the fly, exactly like the
    // launcher releases. Pre-made Linkvertise links are used as-is. Provider
    // names (Linkvertise, LootLabs) are proper nouns and stay untranslated;
    // only the generic "Download" label is localized.
    for (const o of opts) {
        const href = o.monetize ? getMonetizedUrl(o.url) : o.url;
        const label = o.name === 'Download' ? t(lang, 'btn.download') : o.name;
        s += '<a href="' + href + '" class="btn ' + btnClass(o.name) + '" target="_blank" rel="noopener">' + label + '</a>';
    }
    return s;
}

function changelogHtml(entries) {
    if (!entries || !entries.length) return '';
    const lang = currentLang();
    let rows = '';
    for (const c of entries) {
        // Translation keys are keyed by the changelog's own version string
        // (e.g. "changelog.v6.2.title"). Falls back to the raw JSON text when
        // no translation exists yet, so newly-added releases never render
        // blank while translations catch up.
        const title = c.title ? (t(lang, 'changelog.' + c.version + '.title') || c.title) : '';
        let notes = '';
        c.notes.forEach((n, i) => {
            notes += '<li>' + (t(lang, 'changelog.' + c.version + '.note' + i) || n) + '</li>';
        });
        rows += '<div class="changelog-entry">'
            + '<div class="changelog-entry-head">'
            + '<span class="changelog-entry-version">' + c.version + '</span>'
            + (c.date ? '<span class="changelog-entry-date">' + c.date + '</span>' : '')
            + '</div>'
            + (title ? '<p class="changelog-entry-title">' + title + '</p>' : '')
            + '<ul class="changelog-notes">' + notes + '</ul>'
            + '</div>';
    }
    return '<details class="ext-dropdown changelog-dropdown">'
        + '<summary class="ext-summary">'
        + '<span class="ext-summary-label"><i class="fas fa-clipboard-list" aria-hidden="true"></i> ' + t(lang, 'dl.changelogLabel') + '</span>'
        + '<i class="fas fa-chevron-down ext-chevron" aria-hidden="true"></i>'
        + '</summary>'
        + '<div class="ext-list">' + rows + '</div>'
        + '</details>';
}

const majorVersion = str => {
    const m = /v(\d+)/i.exec(str || '');
    return m ? m[1] : null;
};

function clientSlug(item) {
    const m = item.version.match(/v[\d.]+/i);
    return m ? m[0].toLowerCase() : slugify(item.version);
}

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
    const lang = currentLang();
    const label = t(lang, n > 1 ? 'dl.extMany' : 'dl.extOne').replace('{n}', n);
    return '<details class="ext-dropdown">'
        + '<summary class="ext-summary">'
        + '<span class="ext-summary-label"><i class="fas fa-puzzle-piece" aria-hidden="true"></i> '
        + label + '</span>'
        + '<i class="fas fa-chevron-down ext-chevron" aria-hidden="true"></i>'
        + '</summary>'
        + '<div class="ext-list">' + rows + '</div>'
        + '</details>';
}

function mirrorsHtml(mirrors) {
    if (!mirrors || !mirrors.length) return '';
    const lang = currentLang();
    let links = '';
    for (const m of mirrors) {
        links += '<a href="' + m.url + '" class="mirror-link' + (m.outdated ? ' mirror-link--outdated' : '') + '"'
            + ' target="_blank" rel="noopener"'
            + (m.outdated ? ' title="' + escAttr(t(lang, 'dl.mirrorPending')) + '"' : '')
            + '>' + escAttr(m.name) + '</a>';
    }
    return '<div class="download-mirrors">'
        + '<span class="download-mirrors-label">' + t(lang, 'dl.alsoAvailableOn') + '</span>'
        + links
        + '</div>';
}

function clientCard(item, slug, exts) {
    const lang = currentLang();
    const tagLabel = item.tag === 'Latest' ? t(lang, 'dl.tagLatest') : t(lang, 'dl.tagArchived');
    return '<div id="dl-' + slug + '" class="download-card reveal">'
        + '<div class="download-header">'
        + '<h3 class="download-title">' + item.version + '</h3>'
        + '<span class="download-tag ' + (item.tag === 'Latest' ? 'tag-latest' : 'tag-archived') + '">' + tagLabel + '</span>'
        + '</div>'
        + '<div class="download-meta">'
        + '<span><i class="fas fa-calendar-alt download-meta-icon" aria-hidden="true"></i>' + item.release + '</span>'
        + '<span><i class="fas fa-file-archive download-meta-icon" aria-hidden="true"></i>' + item.size + '</span>'
        + (item.downloads != null
            ? '<span class="dl-count" data-dl-key="' + (countKey(item.version) || '') + '" data-dl-base="' + item.downloads + '">'
              + '<i class="fas fa-download download-meta-icon" aria-hidden="true"></i>'
              + '<span class="dl-count-num">' + formatCount(item.downloads) + '</span> ' + t(lang, 'dl.downloadsWord') + '</span>'
            : '')
        + '</div>'
        + '<div class="download-buttons">' + buttonsHtml(item.options) + '</div>'
        + mirrorsHtml(item.mirrors)
        + changelogHtml(item.changelog)
        + extDropdownHtml(exts)
        + '</div>';
}

export function initDownloads() {
    // Extensions are tagged by client major version in their name, e.g.
    // "Hitbox (v6)". Group them so each is shown as a dropdown under the
    // matching client (v6 extensions also cover v6.1).
    const extByMajor = new Map();
    for (const e of [...state.downloadsData.extensions.working, ...state.downloadsData.extensions.legacy]) {
        const maj = majorVersion(e.version);
        if (!maj) continue;
        if (!extByMajor.has(maj)) extByMajor.set(maj, []);
        extByMajor.get(maj).push(e);
    }
    const usedMajors = new Set();

    const groups = [
        ['working-clients', state.downloadsData.clients.working],
        ['legacy-clients', state.downloadsData.clients.legacy]
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
            state.dlIndex.set(slugs[i], { tab: 'clients', el: el.children[i] });
        }
    }
    const latestIdx = state.downloadsData.clients.working.findIndex(c => c.tag === 'Latest');
    if (latestIdx !== -1) {
        const wc = $('working-clients');
        if (wc && wc.children[latestIdx]) state.dlIndex.set('latest', { tab: 'clients', el: wc.children[latestIdx] });
    }
    if (state.pendingDeepLink) { applyDeepLink(state.pendingDeepLink); state.pendingDeepLink = null; }
    initDownloadCounts();
}

// The Worker's /counts (and /increment) return a running total per key that
// is never reset. update-download-counts.yml periodically folds that total
// into downloads.json's base and records how much it folded in
// assets/data/download-counts-baseline.json. So the *live* portion to add on
// top of the base is (worker total − baseline), never the raw worker total —
// otherwise every already-folded click gets counted a second time on top of
// the updated base, compounding a little more on every fold. Cached as a
// promise since multiple call sites need it and it only needs fetching once
// per page load.
let baselinePromise = null;
function getBaseline() {
    if (!baselinePromise) {
        baselinePromise = fetch('assets/data/download-counts-baseline.json').then(r => r.ok ? r.json() : {}).catch(() => ({}));
    }
    return baselinePromise;
}

// Every client release (current + legacy). Extensions are excluded — they carry
// no download figures, so they'd contribute nothing but noise to the total.
function clientEntries() {
    const c = state.downloadsData.clients || {};
    return [...(c.working || []), ...(c.legacy || [])];
}

// Lifetime downloads across all client releases, for the hero stat. Uses exactly
// the same maths as the per-card counts: static base from downloads.json plus
// (worker total − folded baseline), never the raw worker total. Called once with
// no live data so the base renders immediately, then again when /counts lands.
// Shown with a trailing "+" because the earliest releases (v1–v3) predate
// tracking and mirror downloads were never counted — the real figure is higher.
function renderTotalDownloads(counts, baseline) {
    const el = $('heroDownloads');
    if (!el) return;
    let total = 0;
    for (const item of clientEntries()) {
        if (item.downloads == null) continue;
        total += Number(item.downloads) || 0;
        const key = countKey(item.version);
        if (!key || !counts || counts[key] == null) continue;
        total += Math.max(0, (Number(counts[key]) || 0) - (Number((baseline || {})[key]) || 0));
    }
    if (total > 0) el.textContent = formatCount(total) + '+';
}

// Displayed count = static base (from downloads.json) + live clicks tracked by
// the Cloudflare Worker, adjusted for whatever's already folded into that base.
function initDownloadCounts() {
    // Render the hero total before the per-card work, so it still appears on
    // pages/states where no .dl-count cells are in the DOM.
    renderTotalDownloads(null, null);

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
        Promise.all([
            fetch(apiBase + '/counts').then(r => r.ok ? r.json() : {}).catch(() => ({})),
            getBaseline()
        ]).then(([counts, baseline]) => {
            for (const cell of cells) {
                const key = cell.dataset.dlKey;
                if (!key || counts[key] == null) continue;
                const live = Math.max(0, (Number(counts[key]) || 0) - (Number(baseline[key]) || 0));
                setCount(cell, live);
            }
            renderTotalDownloads(counts, baseline);
        });
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
                .then(d => {
                    if (!d || d.count == null) return;
                    return getBaseline().then(baseline => {
                        const live = Math.max(0, (Number(d.count) || 0) - (Number(baseline[key]) || 0));
                        setCount(cell, live);
                    });
                })
                .catch(() => {});
        }
    });
}

export function initLauncher() {
    if (!state.dom.launcherGrid) return;
    const lang = currentLang();
    fetch('assets/data/launcher.json')
        .then(r => r.json())
        .then(rels => {
            if (!Array.isArray(rels) || !rels.length) {
                state.dom.launcherGrid.innerHTML = '<p class="launcher-empty">' + t(lang, 'dl.noLauncherReleases') + '</p>';
                return;
            }
            let html = '';
            for (let i = 0; i < rels.length; i++) {
                const rel = rels[i];
                const tag = i === 0 ? t(lang, 'dl.tagLatest') : t(lang, 'dl.tagArchived');
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
            state.dom.launcherGrid.innerHTML = html;
            for (let i = 0; i < rels.length; i++) {
                const slug = 'launcher-' + slugify(rels[i].tag_name);
                state.dlIndex.set(slug, { tab: 'launcher', el: state.dom.launcherGrid.children[i] });
                if (i === 0) state.dlIndex.set('launcher-latest', { tab: 'launcher', el: state.dom.launcherGrid.children[i] });
            }
            if (state.pendingDeepLink) { applyDeepLink(state.pendingDeepLink); state.pendingDeepLink = null; }
            observeReveals();
        })
        .catch(() => {
            state.dom.launcherGrid.innerHTML = '<p class="launcher-error">' + t(lang, 'dl.failedLoadLauncher') + ' <a href="https://github.com/Glacier-Client-BE/Glacier-Launcher/releases/" target="_blank" rel="noopener">' + t(lang, 'dl.viewOnGithub') + '</a></p>';
        });
}

// Pull the latest client version (e.g. "v6.2") out of the downloads data so the
// header pill and announcement always match the newest release without edits.
export function latestVersionLabel() {
    const latest = latestClient();
    if (!latest) return null;
    const m = /v[\d.]+/i.exec(latest.version);
    return m ? m[0] : latest.version;
}

// The newest working client from downloads.json — the one the hero stats and
// the release toast both describe.
function latestClient() {
    const w = (state.downloadsData.clients && state.downloadsData.clients.working) || [];
    return w.find(c => c.tag === 'Latest') || w[0] || null;
}

// Download size of the latest release (e.g. "3.41 MB"), so the hero stat tracks
// the actual pack instead of a hard-coded number that silently goes stale.
export function latestPackSize() {
    const latest = latestClient();
    return (latest && latest.size) || null;
}
