'use strict';

// Entry point. Caches DOM refs into shared state, wires the one-time listeners,
// boots the scroll/motion systems, then loads JSON data and renders the
// data-driven sections. Loaded as an ES module (see index.html), so it runs
// after the document is parsed.

import { state } from './modules/state.js?v=20260726094126';
import { $, debounce, markCopyableCode } from './modules/utils.js?v=20260726094126';
import { ALL } from './modules/config.js?v=20260726094126';
import { setupScroll } from './modules/scroll.js?v=20260726094126';
import { setupReveal, observeReveals } from './modules/reveal.js?v=20260726094126';
import { setupShowcase } from './modules/showcase.js?v=20260726094126';
import { setupParallax } from './modules/parallax.js?v=20260726094126';
import { setupTilt } from './modules/tilt.js?v=20260726094126';
import { showSection, showNotFound, parsePath, setupDelegation, toggleMobileMenu, searchMods } from './modules/navigation.js?v=20260726094126';
import { loadData, initSkeletons, initFAQ, initMods, initDownloads, initLauncher } from './modules/content.js?v=20260726094126';
import { applyVersioning, applyTheme, setupGlobalSearch, fetchDiscord, retranslateToast } from './modules/ui.js?v=20260726094126';
import { setupDocsToc } from './modules/docs.js?v=20260726094126';
import { setupI18n } from './modules/i18n.js?v=20260726094126';
import { setupUpdateCheck, retranslateUpdateBar } from './modules/updateCheck.js?v=20260726094126';

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
        faqFilterControls: $('faqFilterControls'),
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
    setupTilt('.feature-card, .gallery-item, .donate-card, .social-card, .license-card, .hero-image, .showcase-video-card');
    setupDelegation();
    markCopyableCode(document);
    setupDocsToc();
    setupI18n();
    setupUpdateCheck();

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
        const { id, sub } = parsePath();
        if (id && !ALL.has(id)) showNotFound();
        else showSection(id, sub);
    });
    const initial = parsePath();
    if (initial.id && !ALL.has(initial.id)) showNotFound();
    else showSection(initial.id, initial.sub);

    loadData().then(() => {
        applyVersioning();
        initFAQ();
        initMods();
        initDownloads();
        initLauncher();
        observeReveals();

        // Data-driven sections (mods, FAQ, downloads) render from JSON via
        // translation keys, not data-i18n, so they need an explicit re-render
        // whenever the active language changes.
        document.addEventListener('gc:langchange', () => {
            initFAQ();
            initMods();
            initDownloads();
            initLauncher();
            retranslateToast();
            retranslateUpdateBar();
            observeReveals();
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
