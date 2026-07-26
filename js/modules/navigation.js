'use strict';

import { state } from './state.js?v=20260726125001';
import { $, markCopyableCode } from './utils.js?v=20260726125001';
import { ALL, META, TITLES, MERGED } from './config.js?v=20260726125001';
import { observeReveals } from './reveal.js?v=20260726125001';
import { filterFAQCategory, refreshModsVisibility, toggleModFavorite } from './content.js?v=20260726125001';

// Shows the custom 404 page for a path that doesn't match any known section.
// Leaves the URL as-is (whatever the visitor actually landed on).
export function showNotFound() {
    const targetEl = $('notfound-section');
    for (const s of state.dom.sections) {
        s.classList.toggle('active', s === targetEl);
    }
    for (const l of state.dom.navLinks) {
        l.classList.remove('active');
    }
    document.title = 'Page Not Found | Glacier Client';
    document.body.classList.add('is-404');
    closeMobileMenu();
    requestAnimationFrame(observeReveals);
}

// Single-page section switcher. Toggles the active section + nav tab, syncs the
// URL path and SEO meta, and handles download deep links (/downloads/<slug>).
export function showSection(id, sub) {
    if (!ALL.has(id)) id = 'home';
    document.body.classList.remove('is-404');

    // A merged page (e.g. /mods) shows its parent section but keeps its own URL,
    // title and meta — so the id below drives the DOM, while `id` drives SEO.
    const merged = MERGED[id];
    const sectionId = merged ? merged.into : id;

    const targetEl = $(sectionId + '-section');
    for (const s of state.dom.sections) {
        s.classList.toggle('active', s === targetEl);
    }
    for (const l of state.dom.navLinks) {
        l.classList.toggle('active', l.dataset.section === sectionId);
    }

    const hasDeepLink = id === 'downloads' && sub;

    if (!hasDeepLink) {
        if (id === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (merged) {
            // Land on the block that absorbed this page rather than the top of
            // the parent. Deferred a frame so the section is laid out first.
            requestAnimationFrame(() => {
                const anchor = document.getElementById(merged.anchor);
                if (!anchor) return;
                const top = anchor.getBoundingClientRect().top + window.scrollY
                    - state.dom.headerEl.offsetHeight - 16;
                window.scrollTo({ top, behavior: 'smooth' });
            });
        } else {
            const cc = state.dom.contentContainer;
            if (cc) window.scrollTo({ top: cc.offsetTop - state.dom.headerEl.offsetHeight - 16, behavior: 'smooth' });
        }
    }

    const path = id === 'home' ? '/' : '/' + id + (hasDeepLink ? '/' + sub : '');
    if (location.pathname !== path) history.pushState(null, '', path);
    closeMobileMenu();

    document.title = TITLES[id] || TITLES.home;
    const desc = META[id] || META.home;
    if (state.dom.metaOgDesc) state.dom.metaOgDesc.setAttribute('content', desc);
    if (state.dom.metaTwDesc) state.dom.metaTwDesc.setAttribute('content', desc);
    if (state.dom.metaOgUrl) state.dom.metaOgUrl.setAttribute('content', 'https://glacierclient.xyz' + path);

    if (hasDeepLink) {
        if (state.dlIndex.size) applyDeepLink(sub);
        else state.pendingDeepLink = sub;
    } else {
        state.pendingDeepLink = null;
    }

    requestAnimationFrame(observeReveals);
}

export function parsePath() {
    const raw = location.pathname.replace(/^\/+|\/+$/g, '');
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

function copyText(el, text) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
        clearTimeout(el._copyTimer);
        el.classList.add('code-copied');
        el._copyTimer = setTimeout(() => el.classList.remove('code-copied'), 1400);
    }).catch(() => {});
}

// Property sets per specimen "kind" for the brand guide's click-to-copy-CSS
// feature. Reads the element's own computed style at click time, so the
// copied snippet always matches what's actually on screen.
const CSS_COPY_PROPS = {
    type: ['font-family', 'font-weight', 'font-size', 'letter-spacing', 'line-height', 'color'],
    component: ['background-color', 'color', 'border-radius', 'padding', 'font-size', 'font-weight', 'box-shadow', 'border'],
    shape: ['border-radius', 'width', 'height'],
    space: ['width', 'height'],
    effect: ['background', 'backdrop-filter', 'box-shadow', 'border', 'border-radius']
};

function cssSnippetFor(el) {
    const props = CSS_COPY_PROPS[el.dataset.copyKind] || CSS_COPY_PROPS.component;
    const cs = getComputedStyle(el);
    return props.map(p => p + ': ' + cs.getPropertyValue(p) + ';').join('\n');
}

function playShowcaseVideo(card) {
    if (!card || card.dataset.playing) return;
    card.dataset.playing = '1';
    const id = card.dataset.videoId;
    const thumb = card.querySelector('.showcase-video-thumb');
    const iframe = document.createElement('iframe');
    iframe.className = 'showcase-video-frame';
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    iframe.title = card.querySelector('.showcase-video-title').textContent;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture';
    iframe.allowFullscreen = true;
    thumb.replaceWith(iframe);
}

function setActiveFAQCategory(cat) {
    if (!state.dom.faqFilterControls) return;
    for (const b of state.dom.faqFilterControls.querySelectorAll('[data-faq-category]')) {
        b.classList.toggle('active', b.dataset.faqCategory === cat);
    }
    filterFAQCategory(cat);
}

function setActiveCategory(cat) {
    for (const b of document.querySelectorAll('#mods-section .filter-button')) {
        b.classList.toggle('active', b.dataset.category === cat);
    }
    state.modFilter.cat = cat;
    refreshModsVisibility();
}

export function searchMods(term) {
    state.modFilter.term = term.toLowerCase().trim();
    refreshModsVisibility();
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
        if (tab && tab.dataset.tab) { setActiveTab(tab.dataset.tab); return; }
        const faqFilter = e.target.closest('[data-faq-category]');
        if (faqFilter && faqFilter.dataset.faqCategory) { setActiveFAQCategory(faqFilter.dataset.faqCategory); return; }
        const videoThumb = e.target.closest('.showcase-video-thumb');
        if (videoThumb) { playShowcaseVideo(videoThumb.closest('.showcase-video-card')); return; }
        const copyable = e.target.closest('.copyable-code');
        if (copyable) { copyText(copyable, copyable.textContent); return; }
        const swatch = e.target.closest('.color-swatch[data-copy-hex]');
        if (swatch) { copyText(swatch, swatch.dataset.copyHex); return; }
        const fav = e.target.closest('.mod-fav');
        if (fav) { toggleModFavorite(fav); return; }
        const filter = e.target.closest('.filter-button');
        if (filter && filter.dataset.category) { setActiveCategory(filter.dataset.category); return; }
        const cssItem = e.target.closest('.copy-css-item');
        if (cssItem) { copyText(cssItem, cssSnippetFor(cssItem)); return; }
        if (!state.dom.navMenu.contains(e.target) && !state.dom.mobileMenuBtn.contains(e.target)) closeMobileMenu();
    });
}
