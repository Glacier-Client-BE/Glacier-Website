'use strict';

import { state } from './state.js';
import { $, escAttr, slice, debounce } from './utils.js';
import { NOTIFICATION } from './config.js';
import { showSection } from './navigation.js';
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

const SEARCH_HINT = '<div class="search-empty-hint"><i class="fas fa-search" aria-hidden="true"></i><span>Search across mods, FAQ, downloads and news</span><span class="search-hint-sub">Try "FPS", "install", or "v6.1"</span></div>';

export function setupGlobalSearch() {
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
        for (const m of state.modsData) {
            if (mods.length >= 5) break;
            if (m.title.toLowerCase().includes(term) || m.description.toLowerCase().includes(term)) mods.push(m);
        }

        const faqs = [];
        for (const f of state.faqData) {
            if (faqs.length >= 3) break;
            if (f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term)) faqs.push(f);
        }

        const dl = [];
        const pools = [state.downloadsData.clients.working, state.downloadsData.clients.legacy, state.downloadsData.extensions.working, state.downloadsData.extensions.legacy];
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

export function fetchDiscord() {
    fetch('https://discord.com/api/guilds/938248183878930514/widget.json')
        .then(r => r.json())
        .then(d => {
            const el = $('discordOnline');
            if (el && d.presence_count !== undefined) el.textContent = d.presence_count.toLocaleString();
        })
        .catch(() => {});
}
