'use strict';

import { state } from './state.js';
import { $, escAttr, slice, debounce } from './utils.js';
import { NOTIFICATION } from './config.js';
import { showSection, searchMods } from './navigation.js';
import { latestVersionLabel } from './content.js';

let toastKey = '';

// Sync the header version pill + corner popups to the newest release. The two
// corner popups share one slot: the version announcement takes priority; the
// donation nudge fills in when there's no new release to show.
export function applyVersioning() {
    const v = latestVersionLabel();
    if (!v) return;
    const pill = document.querySelector('.version-pill');
    if (pill) pill.textContent = v;
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

export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gc-theme', theme);
    $('themeToggle').innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun" aria-hidden="true"></i>'
        : '<i class="fas fa-moon" aria-hidden="true"></i>';
}

const SEARCH_HINT = '<div class="search-empty-hint"><i class="fas fa-search" aria-hidden="true"></i><span>Search across mods, FAQ, downloads and pages</span><span class="search-hint-sub">Try "FPS", "install", or "v6.1"</span></div>';

// Sections reachable straight from search — so typing "donate", "license" or
// "community" jumps you there, not just content matches.
const SEARCH_PAGES = [
    ['home', 'Home', 'fa-house'],
    ['features', 'Features', 'fa-star'],
    ['gallery', 'Gallery', 'fa-images'],
    ['community', 'Community', 'fa-users'],
    ['downloads', 'Downloads', 'fa-download'],
    ['faq', 'FAQ', 'fa-circle-question'],
    ['mods', 'All Mods', 'fa-cubes'],
    ['license', 'License', 'fa-scale-balanced'],
    ['donate', 'Donate', 'fa-heart']
];

// Wrap the first case-insensitive hit of `term` in <mark>. Runs on trusted data
// (mod titles, FAQ questions, version strings), so the matched slice is safe to
// re-insert as HTML.
function highlight(text, term) {
    if (!term) return text;
    const i = text.toLowerCase().indexOf(term);
    if (i === -1) return text;
    return text.slice(0, i) + '<mark class="search-hl">' + text.slice(i, i + term.length) + '</mark>' + text.slice(i + term.length);
}

const dlSlug = version => {
    const m = String(version).match(/v[\d.]+/i);
    return m ? m[0].toLowerCase() : null;
};

export function setupGlobalSearch() {
    const modal = $('searchModal');
    const input = $('globalSearchInput');
    const results = $('searchResults');

    let items = [];   // current result rows, for keyboard navigation
    let active = -1;   // highlighted row index

    function open() {
        modal.classList.add('open');
        requestAnimationFrame(() => input.focus());
    }
    function close() {
        modal.classList.remove('open');
        input.value = '';
        results.innerHTML = SEARCH_HINT;
        items = []; active = -1;
    }

    function setActive(i) {
        if (!items.length) return;
        active = (i + items.length) % items.length;
        for (let k = 0; k < items.length; k++) items[k].classList.toggle('is-active', k === active);
        items[active].scrollIntoView({ block: 'nearest' });
    }

    // Activate a result: deep-link where we can (flash the download, open the
    // FAQ, filter to the mod), otherwise just switch to the section.
    function activate(item) {
        const { section, dl, faq, mod } = item.dataset;
        close();
        if (dl) { showSection('downloads', dl); return; }
        showSection(section);
        if (faq) openFaqItem(Number(faq));
        else if (mod) filterToMod(mod);
    }

    function openFaqItem(idx) {
        requestAnimationFrame(() => {
            const el = document.querySelectorAll('#faqContainer .faq-item')[idx];
            if (!el) return;
            const d = el.querySelector('details');
            if (d) d.open = true;
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    function filterToMod(title) {
        const ms = $('modSearch');
        if (ms) { ms.value = title; searchMods(title); }
        requestAnimationFrame(() => {
            const card = [...document.querySelectorAll('#modsGrid .mod-card')].find(c => c.style.display !== 'none');
            if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    $('searchTrigger').addEventListener('click', open);
    $('searchClose').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
        else if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    // Arrow keys move the highlight; Enter opens the highlighted row.
    input.addEventListener('keydown', e => {
        if (!items.length) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
        else if (e.key === 'Enter') { e.preventDefault(); if (items[active]) activate(items[active]); }
    });

    const run = debounce(() => {
        const term = input.value.toLowerCase().trim();
        if (!term) { results.innerHTML = SEARCH_HINT; items = []; active = -1; return; }

        const mods = [];
        for (const m of state.modsData) {
            if (mods.length >= 5) break;
            if (m.title.toLowerCase().includes(term) || m.description.toLowerCase().includes(term)) mods.push(m);
        }

        const faqs = [];
        for (let i = 0; i < state.faqData.length; i++) {
            if (faqs.length >= 3) break;
            const f = state.faqData[i];
            if (f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term)) faqs.push({ f, i });
        }

        const dl = [];
        const pools = [state.downloadsData.clients.working, state.downloadsData.clients.legacy, state.downloadsData.extensions.working, state.downloadsData.extensions.legacy];
        outer: for (const pool of pools) for (const d of pool) {
            if (d.version.toLowerCase().includes(term)) {
                dl.push(d);
                if (dl.length >= 3) break outer;
            }
        }

        const pages = SEARCH_PAGES.filter(p => p[1].toLowerCase().includes(term)).slice(0, 4);

        if (!mods.length && !faqs.length && !dl.length && !pages.length) {
            results.innerHTML = '<div class="search-no-results"><i class="fas fa-search search-no-results-icon" aria-hidden="true"></i>No results for "' + escAttr(input.value) + '"</div>';
            items = []; active = -1;
            return;
        }

        let html = '';
        if (mods.length) {
            html += '<div class="search-result-group"><div class="search-result-label">Mods</div>';
            for (const m of mods) html += '<div class="search-result-item" data-section="mods" data-mod="' + escAttr(m.title) + '"><img src="' + m.icon + '" alt="' + escAttr(m.title) + '" class="search-result-icon-img" /><div><div class="search-result-title">' + highlight(m.title, term) + '</div><div class="search-result-desc">' + slice(m.description, 60) + '</div></div></div>';
            html += '</div>';
        }
        if (faqs.length) {
            html += '<div class="search-result-group"><div class="search-result-label">FAQ</div>';
            for (const { f, i } of faqs) html += '<div class="search-result-item" data-section="faq" data-faq="' + i + '"><div class="search-result-icon-box icon-box-faq"><i class="fas fa-question" aria-hidden="true"></i></div><div><div class="search-result-title">' + highlight(slice(f.question, 65), term) + '</div></div></div>';
            html += '</div>';
        }
        if (dl.length) {
            html += '<div class="search-result-group"><div class="search-result-label">Downloads</div>';
            for (const d of dl) {
                const slug = dlSlug(d.version);
                html += '<div class="search-result-item" data-section="downloads"' + (slug ? ' data-dl="' + slug + '"' : '') + '><div class="search-result-icon-box icon-box-dl"><i class="fas fa-download" aria-hidden="true"></i></div><div><div class="search-result-title">' + highlight(d.version, term) + '</div></div></div>';
            }
            html += '</div>';
        }
        if (pages.length) {
            html += '<div class="search-result-group"><div class="search-result-label">Pages</div>';
            for (const [id, name, icon] of pages) html += '<div class="search-result-item" data-section="' + id + '"><div class="search-result-icon-box icon-box-faq"><i class="fas ' + icon + '" aria-hidden="true"></i></div><div><div class="search-result-title">' + highlight(name, term) + '</div></div></div>';
            html += '</div>';
        }
        results.innerHTML = html;
        items = [...results.querySelectorAll('.search-result-item')];
        active = -1;
        if (items.length) setActive(0);   // preselect first so Enter works immediately
    }, 120);

    input.addEventListener('input', run);
    results.addEventListener('click', e => {
        const item = e.target.closest('.search-result-item');
        if (item) activate(item);
    });
    results.addEventListener('pointermove', e => {
        const item = e.target.closest('.search-result-item');
        if (item) setActive(items.indexOf(item));
    });
}

export function fetchDiscord() {
    fetch('https://discord.com/api/guilds/938248183878930514/widget.json')
        .then(r => r.json())
        .then(d => {
            const el = $('discordOnline');
            if (el && d.presence_count !== undefined) el.textContent = d.presence_count.toLocaleString();
        })
        .catch(() => {});
}
