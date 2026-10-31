'use strict';

import { state } from './state.js?v=20261031133728';
import { $, markCopyableCode, prefersReducedMotion } from './utils.js?v=20261031133728';
import { ALL, META, TITLES, MERGED } from './config.js?v=20261031133728';
import { observeReveals } from './reveal.js?v=20261031133728';
import { filterFAQCategory, refreshModsVisibility, toggleModFavorite } from './content.js?v=20261031133728';

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
    document.documentElement.dataset.route = 'notfound';
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

    // The home hero belongs to the home page only; every other section starts at its own heading (see css: html[data-route]).
    document.documentElement.dataset.route = sectionId;

    const targetEl = $(sectionId + '-section');
    // Read before writing: only a section that was not already showing animates in.
    const wasActive = !targetEl || targetEl.classList.contains('active');
    for (const s of state.dom.sections) {
        s.classList.toggle('active', s === targetEl);
    }
    for (const l of state.dom.navLinks) {
        l.classList.toggle('active', l.dataset.section === sectionId);
    }
    if (!wasActive) animateSectionIn(targetEl);

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
            // A new page, not a place further down the home page: start at the top, no long scroll animation.
            window.scrollTo(0, 0);
        }
    }

    // Section URLs end in a slash (/downloads/) to match the real pages the SEO build generates.
    const path = id === 'home' ? '/' : '/' + id + '/' + (hasDeepLink ? sub : '');
    if (location.pathname !== path && location.pathname !== path.replace(/\/$/, '')) history.pushState(null, '', path);
    closeMobileMenu();

    document.title = TITLES[id] || TITLES.home;
    const desc = META[id] || META.home;
    if (state.dom.metaOgDesc) state.dom.metaOgDesc.setAttribute('content', desc);
    if (state.dom.metaTwDesc) state.dom.metaTwDesc.setAttribute('content', desc);
    if (state.dom.metaOgUrl) state.dom.metaOgUrl.setAttribute('content', 'https://glacierclient.xyz' + path);
    // Keep the rest of the head in step with the section (matters for tab titles, shares and JS-rendering crawlers).
    const setMeta = (sel, v) => { const m = document.querySelector(sel); if (m) m.setAttribute('content', v); };
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', document.title);
    setMeta('meta[name="twitter:title"]', document.title);
    const canon = document.querySelector('link[rel="canonical"]');
    if (canon) canon.setAttribute('href', 'https://glacierclient.xyz' + path);

    if (hasDeepLink) {
        if (state.dlIndex.size) applyDeepLink(sub);
        else state.pendingDeepLink = sub;
    } else {
        state.pendingDeepLink = null;
    }

    requestAnimationFrame(observeReveals);
}

// Short enter for the newly active section (WAAPI, so no CSS class juggling).
function animateSectionIn(el) {
    if (prefersReducedMotion() || !el.animate) return;
    el.animate([
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' });
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

// The phone menu is a full-width sheet under the header. While it is open the page behind it does not scroll.
function setMenuState(open) {
    const { navMenu, mobileMenuBtn, headerEl } = state.dom;
    navMenu.classList.toggle('active', open);
    document.documentElement.classList.toggle('menu-open', open);
    if (open) navMenu.style.setProperty('--hdr-h', headerEl.offsetHeight + 'px');
    mobileMenuBtn.innerHTML = open
        ? '<i class="fas fa-times" aria-hidden="true"></i>'
        : '<i class="fas fa-bars" aria-hidden="true"></i>';
    mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileMenuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

export function closeMobileMenu() {
    setMenuState(false);
}

// Below 480px the language and theme controls move into the mobile menu panel
// (#navUtils), so the header bar keeps only the logo, search and menu button.
// The existing elements are moved, not copied, so their ids and listeners stay.
const phoneHeaderQuery = window.matchMedia('(max-width: 480px)');

export function placeHeaderUtilities() {
    const lang = $('langDropdown');
    const theme = $('themeToggle');
    const utils = $('navUtils');
    const menuBtn = $('mobileMenuBtn');
    if (!lang || !theme || !utils || !menuBtn) return;
    if (phoneHeaderQuery.matches) {
        utils.append(lang, theme);
    } else if (utils.contains(lang)) {
        menuBtn.parentNode.insertBefore(lang, menuBtn);
        menuBtn.parentNode.insertBefore(theme, menuBtn);
    }
}

export function setupHeaderUtilities() {
    placeHeaderUtilities();
    phoneHeaderQuery.addEventListener('change', placeHeaderUtilities);
}

export function toggleMobileMenu() {
    setMenuState(!state.dom.navMenu.classList.contains('active'));
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.dom.navMenu && state.dom.navMenu.classList.contains('active')) {
        closeMobileMenu();
        state.dom.mobileMenuBtn.focus();
    }
});
window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => { if (e.matches) closeMobileMenu(); });

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
    for (const b of document.querySelectorAll('.filter-button[data-category]')) {
        b.classList.toggle('active', b.dataset.category === cat);
    }
    state.modFilter.cat = cat;
    refreshModsVisibility();
}

export function searchMods(term) {
    state.modFilter.term = term.toLowerCase().trim();
    refreshModsVisibility();
}

// One delegated click handler for nav links, tabs and filters — so dynamically
// injected content stays wired without per-node listeners.
export function setupDelegation() {
    document.addEventListener('click', e => {
        // Captured before any handler runs: a control may replace its own icon
        // (theme toggle) and detach e.target, which would fool contains() below.
        const path = e.composedPath();
        const linked = e.target.closest('[data-section]');
        if (linked && !linked.hasAttribute('target')) {
            const id = linked.dataset.section;
            if (id) { e.preventDefault(); showSection(id); return; }
        }
        const clearMods = e.target.closest('[data-clear-mods]');
        if (clearMods) {
            const ms = $('modSearch');
            if (ms) ms.value = '';
            setActiveCategory('all');
            searchMods('');
            return;
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
        if (!path.includes(state.dom.navMenu) && !path.includes(state.dom.mobileMenuBtn)) closeMobileMenu();
    });
}


// In-page hash links. The document has <base href="/">, so a bare href="#section" would navigate to "/#section"
// (a full page load of the home page) from any other section URL. Scroll to the target instead.
document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    e.preventDefault();
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
});
