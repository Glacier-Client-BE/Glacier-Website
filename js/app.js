'use strict';

const NOTIFICATION = { key: 'glacier-v6.1-release', text: 'Glacier v6.1 is now available!', cta: 'Download', section: 'downloads' };

const META = {
    home: 'Next-gen Minecraft Bedrock client with 37+ modules, draggable HUD, and zero performance impact.',
    features: 'Explore the advanced features of Glacier Client — config editor, custom themes, and auto-updates.',
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

function showSection(id) {
    if (!ALL.has(id)) id = 'home';

    const targetEl = $(id + '-section');
    for (const s of dom.sections) {
        s.classList.toggle('active', s === targetEl);
    }
    for (const l of dom.navLinks) {
        l.classList.toggle('active', l.dataset.section === id);
    }

    updateSideNav(id);

    if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const cc = dom.contentContainer;
        if (cc) window.scrollTo({ top: cc.offsetTop - dom.headerEl.offsetHeight - 16, behavior: 'smooth' });
    }

    history.replaceState(null, '', '#' + id);
    closeMobileMenu();

    const desc = META[id] || META.home;
    if (dom.metaOgDesc) dom.metaOgDesc.setAttribute('content', desc);
    if (dom.metaTwDesc) dom.metaTwDesc.setAttribute('content', desc);
    if (dom.metaOgUrl) dom.metaOgUrl.setAttribute('content', 'https://glacierclient.xyz/#' + id);

    requestAnimationFrame(observeReveals);
}

function updateSideNav(id) {
    const dots = MAIN.has(id)
        ? [['home', 'Home'], ['features', 'Features'], ['gallery', 'Gallery'], ['footer', 'Footer']]
        : [['home', 'Home'], [id, id[0].toUpperCase() + id.slice(1)], ['footer', 'Footer']];

    let html = '';
    for (const [i, l] of dots) {
        html += '<div class="side-dot' + (i === id ? ' active' : '') + '" data-section="' + i + '" data-tooltip="' + l + '" role="button" tabindex="0" aria-label="Go to ' + l + '"></div>';
    }
    dom.sideNav.innerHTML = html;
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
    for (const id of ['working-clients', 'legacy-clients', 'working-extensions', 'legacy-extensions']) {
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
            + '<details class="faq-card card-base"' + (i === 0 ? ' open' : '') + '>'
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
    for (const o of opts) s += '<a href="' + o.url + '" class="btn ' + btnClass(o.name) + '" target="_blank" rel="noopener">' + o.name + '</a>';
    return s;
}

function clientCard(item) {
    return '<div class="download-card card-base reveal">'
        + '<div class="download-header">'
        + '<h3 class="download-title">' + item.version + '</h3>'
        + '<span class="download-tag ' + (item.tag === 'Latest' ? 'tag-latest' : 'tag-archived') + '">' + item.tag + '</span>'
        + '</div>'
        + '<div class="download-meta">'
        + '<span><i class="fas fa-calendar-alt download-meta-icon" aria-hidden="true"></i>' + item.release + '</span>'
        + '<span><i class="fas fa-file-archive download-meta-icon" aria-hidden="true"></i>' + item.size + '</span>'
        + '</div>'
        + '<div class="download-buttons">' + buttonsHtml(item.options) + '</div>'
        + '</div>';
}

function extCard(item) {
    return '<div class="download-card card-base reveal">'
        + '<div class="download-header"><h3 class="download-title">' + item.version + '</h3></div>'
        + '<p class="download-desc">' + item.description + '</p>'
        + '<div class="download-buttons">' + buttonsHtml(item.options) + '</div>'
        + '</div>';
}

function initDownloads() {
    const groups = [
        ['working-clients', downloadsData.clients.working, clientCard],
        ['legacy-clients', downloadsData.clients.legacy, clientCard],
        ['working-extensions', downloadsData.extensions.working, extCard],
        ['legacy-extensions', downloadsData.extensions.legacy, extCard]
    ];
    for (const [id, data, fn] of groups) {
        const el = $(id);
        if (!el) continue;
        let html = '';
        for (const item of data) html += fn(item);
        el.innerHTML = html;
    }
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
                for (const a of assets) btns += '<a href="' + a.browser_download_url + '" class="btn btn-primary" target="_blank" rel="noopener"><i class="fas fa-download" aria-hidden="true"></i> ' + a.name + '</a>';
                const size = assets.length ? formatBytes(assets[0].size) : '';
                html += '<div class="download-card card-base reveal">'
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
            observeReveals();
        })
        .catch(() => {
            dom.launcherGrid.innerHTML = '<p class="launcher-error">Failed to load launcher releases. <a href="https://github.com/Glacier-Client-BE/Glacier-Launcher/releases/" target="_blank" rel="noopener">View on GitHub</a></p>';
        });
}

function setupToast() {
    if (sessionStorage.getItem(NOTIFICATION.key)) return;
    $('toastMsg').textContent = NOTIFICATION.text;
    const cta = $('toastCta');
    cta.textContent = NOTIFICATION.cta;
    cta.addEventListener('click', e => { e.preventDefault(); showSection(NOTIFICATION.section); dismissToast(); });
    $('toastBanner').classList.add('visible');
    document.body.classList.add('has-toast');
    $('toastClose').addEventListener('click', dismissToast);
}

function dismissToast() {
    sessionStorage.setItem(NOTIFICATION.key, '1');
    $('toastBanner').classList.remove('visible');
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
    let raf = false;

    function tick() {
        const y = window.scrollY;
        header.classList.toggle('scrolled', y > 50);
        back.classList.toggle('visible', y > 320);
        raf = false;
    }

    window.addEventListener('scroll', () => {
        if (!raf) { raf = true; requestAnimationFrame(tick); }
    }, { passive: true });

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
    const triggers = document.querySelectorAll('.showcase-trigger');
    if (!triggers.length || !('IntersectionObserver' in window)) return;

    const imgs = document.querySelectorAll('.showcase-img');
    const texts = document.querySelectorAll('.showcase-text');
    const ticks = document.querySelectorAll('.showcase-tick');
    const ratios = new Map();
    let activeFrame = '0';

    function activate(frame) {
        if (frame === activeFrame) return;
        activeFrame = frame;
        for (const el of imgs) el.classList.toggle('is-active', el.dataset.frame === frame);
        for (const el of texts) el.classList.toggle('is-active', el.dataset.frame === frame);
        for (const el of ticks) el.classList.toggle('is-active', el.dataset.frame === frame);
    }

    const thresholds = [];
    for (let i = 0; i <= 20; i++) thresholds.push(i / 20);

    const obs = new IntersectionObserver(entries => {
        for (const e of entries) ratios.set(e.target, e.intersectionRatio);
        let bestFrame = activeFrame, bestRatio = 0;
        for (const [el, r] of ratios) {
            if (r > bestRatio) { bestRatio = r; bestFrame = el.dataset.frame; }
        }
        if (bestRatio > 0) activate(bestFrame);
    }, { threshold: thresholds });

    for (const t of triggers) obs.observe(t);
}

function handleSectionClick(id) {
    if (id === 'footer') {
        const f = document.querySelector('footer');
        if (f) f.scrollIntoView({ behavior: 'smooth' });
        for (const d of dom.sideNav.querySelectorAll('.side-dot')) d.classList.toggle('active', d.dataset.section === 'footer');
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
        sections: document.querySelectorAll('.content-section'),
        navLinks: document.querySelectorAll('.nav-link'),
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
    setupDelegation();

    dom.mobileMenuBtn.addEventListener('click', e => { e.stopPropagation(); toggleMobileMenu(); });

    applyTheme(localStorage.getItem('gc-theme') || 'dark');
    $('themeToggle').addEventListener('click', () => {
        applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    const modSearch = $('modSearch');
    if (modSearch) modSearch.addEventListener('input', debounce(e => searchMods(e.target.value), 100));

    setupToast();
    setupGlobalSearch();
    fetchDiscord();

    window.addEventListener('popstate', () => {
        const h = location.hash.slice(1);
        showSection(ALL.has(h) ? h : 'home');
    });
    const initialHash = location.hash.slice(1);
    showSection(ALL.has(initialHash) ? initialHash : 'home');

    loadData().then(() => {
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
