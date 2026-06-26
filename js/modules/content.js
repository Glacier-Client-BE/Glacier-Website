'use strict';

import { state } from './state.js';
import { $, escAttr, formatBytes, formatCount, countKey, slugify, getMonetizedUrl } from './utils.js';
import { COUNTER_API } from './config.js';
import { applyDeepLink } from './navigation.js';
import { observeReveals } from './reveal.js';
import { setupTilt } from './tilt.js';

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
    if (state.dom.launcherGrid) state.dom.launcherGrid.innerHTML = '<div class="launcher-loading"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Loading launcher releases...</div>';
}

// ── Mods ──────────────────────────────────────────────────────────────────
export function initMods() {
    if (!state.dom.modsGrid) return;
    let html = '';
    for (const m of state.modsData) {
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
    state.dom.modsGrid.innerHTML = html;

    state.modCards = [];
    for (const el of state.dom.modsGrid.children) {
        state.modCards.push({
            el,
            cats: el.dataset.categories.split(','),
            title: el.querySelector('.mod-title').textContent.toLowerCase(),
            desc: el.querySelector('.mod-description').textContent.toLowerCase()
        });
    }
    setupTilt('.mod-card');
}

// ── FAQ ───────────────────────────────────────────────────────────────────
export function initFAQ() {
    if (!state.dom.faqContainer) return;
    let html = '';
    for (let i = 0; i < state.faqData.length; i++) {
        const f = state.faqData[i];
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
    state.dom.faqContainer.innerHTML = html;
}

// ── Downloads ─────────────────────────────────────────────────────────────
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

export function initLauncher() {
    if (!state.dom.launcherGrid) return;
    fetch('assets/data/launcher.json')
        .then(r => r.json())
        .then(rels => {
            if (!Array.isArray(rels) || !rels.length) {
                state.dom.launcherGrid.innerHTML = '<p class="launcher-empty">No launcher releases found.</p>';
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
            state.dom.launcherGrid.innerHTML = '<p class="launcher-error">Failed to load launcher releases. <a href="https://github.com/Glacier-Client-BE/Glacier-Launcher/releases/" target="_blank" rel="noopener">View on GitHub</a></p>';
        });
}

// Pull the latest client version (e.g. "v6.2") out of the downloads data so the
// header pill and announcement always match the newest release without edits.
export function latestVersionLabel() {
    const w = (state.downloadsData.clients && state.downloadsData.clients.working) || [];
    const latest = w.find(c => c.tag === 'Latest') || w[0];
    if (!latest) return null;
    const m = /v[\d.]+/i.exec(latest.version);
    return m ? m[0] : latest.version;
}
