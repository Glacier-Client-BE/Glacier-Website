'use strict';

// Entry point. Caches DOM refs into shared state, wires the one-time listeners,
// boots the scroll/motion systems, then loads JSON data and renders the
// data-driven sections. Loaded as an ES module (see index.html), so it runs
// after the document is parsed.

import { state } from './modules/state.js';
import { $, debounce } from './modules/utils.js';
import { ALL } from './modules/config.js';
import { setupScroll } from './modules/scroll.js';
import { setupReveal, observeReveals } from './modules/reveal.js';
import { setupShowcase } from './modules/showcase.js';
import { setupParallax } from './modules/parallax.js';
import { setupTilt } from './modules/tilt.js';
import { showSection, parseHash, setupDelegation, toggleMobileMenu, searchMods } from './modules/navigation.js';
import { loadData, initSkeletons, initFAQ, initMods, initDownloads, initLauncher } from './modules/content.js';
import { applyVersioning, applyTheme, setupGlobalSearch, fetchDiscord } from './modules/ui.js';

function init() {
    state.dom = {
        headerEl: $('mainHeader'),
        navMenu: $('navMenu'),
        mobileMenuBtn: $('mobileMenuBtn'),
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
    setupParallax();
    setupTilt('.feature-card, .gallery-item, .donate-card, .social-card, .license-card, .hero-image');
    setupDelegation();

    state.dom.mobileMenuBtn.addEventListener('click', e => { e.stopPropagation(); toggleMobileMenu(); });

    const themeToggle = $('themeToggle');
    applyTheme(localStorage.getItem('gc-theme') || 'dark');
    let themeSpins = 0;
    themeToggle.addEventListener('click', () => {
        applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        // Each toggle spins the button a further full turn — a small reward for
        // flipping the lights. (Disabled under reduced motion via CSS.)
        themeSpins++;
        themeToggle.style.setProperty('--gc-spin', (themeSpins * 360) + 'deg');
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
