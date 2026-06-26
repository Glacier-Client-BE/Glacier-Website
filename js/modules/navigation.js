'use strict';

import { state } from './state.js';
import { $ } from './utils.js';
import { ALL, META } from './config.js';
import { observeReveals } from './reveal.js';

// Single-page section switcher. Toggles the active section + nav tab, syncs the
// URL hash and SEO meta, and handles download deep links (#downloads/<slug>).
export function showSection(id, sub) {
    if (!ALL.has(id)) id = 'home';

    const targetEl = $(id + '-section');
    for (const s of state.dom.sections) {
        s.classList.toggle('active', s === targetEl);
    }
    for (const l of state.dom.navLinks) {
        l.classList.toggle('active', l.dataset.section === id);
    }

    const hasDeepLink = id === 'downloads' && sub;

    if (!hasDeepLink) {
        if (id === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const cc = state.dom.contentContainer;
            if (cc) window.scrollTo({ top: cc.offsetTop - state.dom.headerEl.offsetHeight - 16, behavior: 'smooth' });
        }
    }

    const hash = hasDeepLink ? id + '/' + sub : id;
    history.replaceState(null, '', '#' + hash);
    closeMobileMenu();

    const desc = META[id] || META.home;
    if (state.dom.metaOgDesc) state.dom.metaOgDesc.setAttribute('content', desc);
    if (state.dom.metaTwDesc) state.dom.metaTwDesc.setAttribute('content', desc);
    if (state.dom.metaOgUrl) state.dom.metaOgUrl.setAttribute('content', 'https://glacierclient.xyz/#' + hash);

    if (hasDeepLink) {
        if (state.dlIndex.size) applyDeepLink(sub);
        else state.pendingDeepLink = sub;
    } else {
        state.pendingDeepLink = null;
    }

    requestAnimationFrame(observeReveals);
}

export function parseHash() {
    const raw = location.hash.slice(1);
    if (!raw) return { id: '', sub: '' };
    const i = raw.indexOf('/');
    return i === -1 ? { id: raw, sub: '' } : { id: raw.slice(0, i), sub: raw.slice(i + 1) };
}

export function setActiveTab(name) {
    for (const b of document.querySelectorAll('.tab-button')) b.classList.toggle('active', b.dataset.tab === name);
    for (const c of document.querySelectorAll('.tab-content')) c.classList.toggle('active', c.id === name + '-tab-content');
}

// Scroll the deep-linked download card into view and flash it.
export function applyDeepLink(sub) {
    const entry = state.dlIndex.get(sub.toLowerCase());
    if (!entry) return;
    setActiveTab(entry.tab);
    requestAnimationFrame(() => {
        entry.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        entry.el.classList.add('dl-highlight');
        setTimeout(() => entry.el.classList.remove('dl-highlight'), 2400);
    });
}

// Drives the top reading-progress bar from the eased scroll value (state.smoothY),
// so the fill glides in lockstep with the rest of the scroll-linked motion.
export function syncScrollProgress() {
    if (!state.dom.progressBar) return;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docH > 0 ? Math.min(Math.max(state.smoothY / docH, 0), 1) : 0;
    state.dom.progressBar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
}

export function closeMobileMenu() {
    state.dom.navMenu.classList.remove('active');
    state.dom.mobileMenuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    state.dom.mobileMenuBtn.setAttribute('aria-expanded', 'false');
}

export function toggleMobileMenu() {
    const open = state.dom.navMenu.classList.toggle('active');
    state.dom.mobileMenuBtn.innerHTML = open
        ? '<i class="fas fa-times" aria-hidden="true"></i>'
        : '<i class="fas fa-bars" aria-hidden="true"></i>';
    state.dom.mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function setActiveCategory(cat) {
    for (const b of document.querySelectorAll('.filter-button')) b.classList.toggle('active', b.dataset.category === cat);
    for (const c of state.modCards) {
        const ok = cat === 'all' || c.cats.includes(cat);
        c.el.style.display = ok ? '' : 'none';
    }
}

export function searchMods(term) {
    term = term.toLowerCase().trim();
    for (const c of state.modCards) {
        c.el.style.display = (!term || c.title.includes(term) || c.desc.includes(term)) ? '' : 'none';
    }
}

export function handleSectionClick(id) {
    showSection(id);
}

// One delegated click handler for nav links, tabs and filters — so dynamically
// injected content stays wired without per-node listeners.
export function setupDelegation() {
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
        if (!state.dom.navMenu.contains(e.target) && !state.dom.mobileMenuBtn.contains(e.target)) closeMobileMenu();
    });
}
