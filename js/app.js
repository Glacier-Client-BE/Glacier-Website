const NOTIFICATION = {
    key: 'glacier-v6.1-release',
    text: 'Glacier v6.1 is now available!',
    cta: 'Download',
    section: 'downloads'
};

const ogMeta = {
    home:      'Next-gen Minecraft Bedrock client with 37+ modules, draggable HUD, and zero performance impact.',
    features:  'Explore the advanced features of Glacier Client — config editor, custom themes, and auto-updates.',
    gallery:   'See Glacier Client in action with screenshots of the mod menu, start screen, and pause screen.',
    community: 'Join the Glacier Client Discord community for support, updates, and events.',
    downloads: 'Download the latest Glacier Client version for Minecraft Bedrock Edition.',
    faq:       'Frequently asked questions about Glacier Client installation, compatibility, and usage.',
    mods:      'Browse all 37+ modules available in Glacier Client for Minecraft Bedrock Edition.',
    license:   'Read the Glacier Client license to understand permitted and restricted usage.',
    donate:    'Support Glacier Client development through PayPal or Ko-fi.'
};

const MAIN_SECTIONS = new Set(['home', 'features', 'gallery']);
const ALL_SECTIONS = new Set(['home', 'features', 'gallery', 'community', 'downloads', 'faq', 'mods', 'license', 'donate']);

let currentSection = 'home';
let modsData = [];
let faqData = [];
let downloadsData = { clients: { working: [], legacy: [] }, extensions: { working: [], legacy: [] } };

function showSection(id) {
    if (!ALL_SECTIONS.has(id)) id = 'home';
    currentSection = id;

    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id + '-section');
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.dataset.section === id);
    });

    updateSideNav(id);

    if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const headerH = document.getElementById('mainHeader').offsetHeight;
        const cc = document.querySelector('.content-container');
        if (cc) window.scrollTo({ top: cc.offsetTop - headerH - 16, behavior: 'smooth' });
    }

    history.replaceState(null, '', '#' + id);
    closeMobileMenu();

    const desc = ogMeta[id] || ogMeta.home;
    document.querySelector('meta[property="og:description"]').setAttribute('content', desc);
    document.querySelector('meta[name="twitter:description"]').setAttribute('content', desc);
    document.querySelector('meta[property="og:url"]').setAttribute('content', 'https://glacierclient.xyz/#' + id);
}

function updateSideNav(id) {
    const nav = document.getElementById('sideNav');
    const dots = MAIN_SECTIONS.has(id)
        ? [{ id: 'home', label: 'Home' }, { id: 'features', label: 'Features' }, { id: 'gallery', label: 'Gallery' }, { id: 'footer', label: 'Footer' }]
        : [{ id: 'home', label: 'Home' }, { id, label: id.charAt(0).toUpperCase() + id.slice(1) }, { id: 'footer', label: 'Footer' }];

    nav.innerHTML = dots.map(d =>
        '<div class="side-dot' + (d.id === id ? ' active' : '') + '" data-section="' + d.id + '" data-tooltip="' + d.label + '" role="button" tabindex="0" aria-label="Go to ' + d.label + '"></div>'
    ).join('');

    nav.querySelectorAll('.side-dot').forEach(dot => {
        const handler = () => {
            const sec = dot.dataset.section;
            if (sec === 'footer') {
                document.querySelector('footer').scrollIntoView({ behavior: 'smooth' });
                nav.querySelectorAll('.side-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
            } else {
                showSection(sec);
            }
        };
        dot.addEventListener('click', handler);
        dot.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
    });
}

function closeMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('navMenu');
    menu.classList.remove('active');
    btn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    btn.setAttribute('aria-expanded', 'false');
}

function setupMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('navMenu');

    btn.addEventListener('click', e => {
        e.stopPropagation();
        const open = menu.classList.toggle('active');
        btn.innerHTML = open
            ? '<i class="fas fa-times" aria-hidden="true"></i>'
            : '<i class="fas fa-bars" aria-hidden="true"></i>';
        btn.setAttribute('aria-expanded', open);
    });

    document.addEventListener('click', e => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) closeMobileMenu();
    });
}

function setupTabs() {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const tc = document.getElementById(tab + '-tab-content');
            if (tc) tc.classList.add('active');
        });
    });
}

function setupModFilters() {
    const cards = document.querySelectorAll('.mod-card');

    document.querySelectorAll('.filter-button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.category;
            cards.forEach(c => {
                const cats = c.dataset.categories.split(',');
                c.style.display = (cat === 'all' || cats.includes(cat)) ? '' : 'none';
            });
        });
    });

    const search = document.getElementById('modSearch');
    if (search) {
        search.addEventListener('input', () => {
            const term = search.value.toLowerCase().trim();
            cards.forEach(c => {
                const match = c.querySelector('.mod-title').textContent.toLowerCase().includes(term)
                    || c.querySelector('.mod-description').textContent.toLowerCase().includes(term);
                c.style.display = match ? '' : 'none';
            });
        });
    }
}

function initSkeletons() {
    const modsGrid = document.getElementById('modsGrid');
    if (modsGrid) {
        modsGrid.innerHTML = Array(8).fill('<div class="skeleton skeleton-mod"></div>').join('');
    }
    ['working-clients', 'legacy-clients', 'working-extensions', 'legacy-extensions'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = Array(2).fill('<div class="skeleton skeleton-download"></div>').join('');
    });
    const launcherGrid = document.getElementById('launcher-releases');
    if (launcherGrid) {
        launcherGrid.innerHTML = '<div class="launcher-loading"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Loading launcher releases...</div>';
    }
}

function initMods() {
    const grid = document.getElementById('modsGrid');
    if (!grid) return;
    grid.innerHTML = modsData.map(m =>
        '<div class="mod-card card-base" data-categories="' + m.categories.join(',') + '">' +
            '<img src="' + m.icon + '" alt="' + m.title + '" class="mod-image" loading="lazy" width="76" height="76" />' +
            '<div class="mod-content">' +
                '<h3 class="mod-title">' + m.title + '</h3>' +
                '<p class="mod-description">' + m.description + '</p>' +
                '<div class="mod-tags">' + m.tags.map(t => '<span class="mod-tag">' + t + '</span>').join('') + '</div>' +
            '</div>' +
        '</div>'
    ).join('');
}

function initFAQ() {
    const container = document.getElementById('faqContainer');
    if (!container) return;
    container.innerHTML = faqData.map((f, i) =>
        '<div class="faq-item">' +
            '<details class="faq-card card-base"' + (i === 0 ? ' open' : '') + '>' +
                '<summary class="faq-question">' +
                    '<span>' + f.question + '</span>' +
                    '<i class="fas fa-chevron-down" aria-hidden="true"></i>' +
                '</summary>' +
                '<div class="faq-answer">' +
                    f.answer +
                    (f.videoUrl ? '<div style="margin-top:18px;border-radius:var(--radius);overflow:hidden;"><iframe width="100%" height="300" src="' + f.videoUrl + '" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen loading="lazy" title="Tutorial video"></iframe></div>' : '') +
                '</div>' +
            '</details>' +
        '</div>'
    ).join('');
}

function btnClass(name) {
    return name === 'Download' ? 'btn-primary' : 'btn-secondary';
}

function createClientCard(item) {
    const btns = item.options.map(o =>
        '<a href="' + o.url + '" class="btn ' + btnClass(o.name) + '" target="_blank" rel="noopener">' + o.name + '</a>'
    ).join('');
    return '<div class="download-card card-base">' +
        '<div class="download-header">' +
            '<h3 class="download-title">' + item.version + '</h3>' +
            '<span class="download-tag ' + (item.tag === 'Latest' ? 'tag-latest' : 'tag-archived') + '">' + item.tag + '</span>' +
        '</div>' +
        '<div class="download-meta">' +
            '<span><i class="fas fa-calendar-alt" aria-hidden="true" style="margin-right:6px;color:var(--blurple);"></i>' + item.release + '</span>' +
            '<span><i class="fas fa-file-archive" aria-hidden="true" style="margin-right:6px;color:var(--blurple);"></i>' + item.size + '</span>' +
        '</div>' +
        '<div class="download-buttons">' + btns + '</div>' +
    '</div>';
}

function createExtCard(item) {
    const btns = item.options.map(o =>
        '<a href="' + o.url + '" class="btn ' + btnClass(o.name) + '" target="_blank" rel="noopener">' + o.name + '</a>'
    ).join('');
    return '<div class="download-card card-base">' +
        '<div class="download-header"><h3 class="download-title">' + item.version + '</h3></div>' +
        '<p style="color:var(--text-muted);margin-bottom:18px;">' + item.description + '</p>' +
        '<div class="download-buttons">' + btns + '</div>' +
    '</div>';
}

function initDownloads() {
    const map = {
        'working-clients': { data: downloadsData.clients.working, fn: createClientCard },
        'legacy-clients': { data: downloadsData.clients.legacy, fn: createClientCard },
        'working-extensions': { data: downloadsData.extensions.working, fn: createExtCard },
        'legacy-extensions': { data: downloadsData.extensions.legacy, fn: createExtCard }
    };
    for (const [id, { data, fn }] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = data.map(fn).join('');
    }
}

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

function initLauncher() {
    const grid = document.getElementById('launcher-releases');
    if (!grid) return;

    fetch('assets/data/launcher.json')
        .then(r => r.json())
        .then(releases => {
            if (!Array.isArray(releases) || releases.length === 0) {
                grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">No launcher releases found.</p>';
                return;
            }

            grid.innerHTML = releases.map((rel, i) => {
                const tag = i === 0 ? 'Latest' : 'Archived';
                const date = new Date(rel.published_at).toISOString().split('T')[0];
                const assets = rel.assets || [];
                const btns = assets.map(a =>
                    '<a href="' + a.browser_download_url + '" class="btn btn-primary" target="_blank" rel="noopener">' +
                        '<i class="fas fa-download" aria-hidden="true"></i> ' + a.name +
                    '</a>'
                ).join('');
                const sizeInfo = assets.length > 0 ? formatBytes(assets[0].size) : '';

                return '<div class="download-card card-base">' +
                    '<div class="download-header">' +
                        '<h3 class="download-title">Glacier Launcher ' + rel.tag_name + '</h3>' +
                        '<span class="download-tag ' + (i === 0 ? 'tag-latest' : 'tag-archived') + '">' + tag + '</span>' +
                    '</div>' +
                    '<div class="download-meta">' +
                        '<span><i class="fas fa-calendar-alt" aria-hidden="true" style="margin-right:6px;color:var(--blurple);"></i>' + date + '</span>' +
                        (sizeInfo ? '<span><i class="fas fa-file-archive" aria-hidden="true" style="margin-right:6px;color:var(--blurple);"></i>' + sizeInfo + '</span>' : '') +
                    '</div>' +
                    '<div class="download-buttons">' + btns + '</div>' +
                '</div>';
            }).join('');
        })
        .catch(() => {
            grid.innerHTML = '<p class="launcher-error">Failed to load launcher releases. <a href="https://github.com/Glacier-Client-BE/Glacier-Launcher/releases/" target="_blank" rel="noopener" style="color:var(--blurple);">View on GitHub</a></p>';
        });
}

function setupHeaderScroll() {
    const header = document.getElementById('mainHeader');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function setupToast() {
    if (sessionStorage.getItem(NOTIFICATION.key)) return;
    const banner = document.getElementById('toastBanner');
    document.getElementById('toastMsg').textContent = NOTIFICATION.text;
    const ctaEl = document.getElementById('toastCta');
    ctaEl.textContent = NOTIFICATION.cta;
    ctaEl.addEventListener('click', e => {
        e.preventDefault();
        showSection(NOTIFICATION.section);
        dismissToast();
    });
    banner.classList.add('visible');
    document.body.classList.add('has-toast');
    document.getElementById('toastClose').addEventListener('click', dismissToast);
}

function dismissToast() {
    sessionStorage.setItem(NOTIFICATION.key, '1');
    document.getElementById('toastBanner').classList.remove('visible');
    document.body.classList.remove('has-toast');
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gc-theme', theme);
    const btn = document.getElementById('themeToggle');
    btn.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun" aria-hidden="true"></i>'
        : '<i class="fas fa-moon" aria-hidden="true"></i>';
}

function setupThemeToggle() {
    const stored = localStorage.getItem('gc-theme') || 'dark';
    applyTheme(stored);
    document.getElementById('themeToggle').addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
}

function setupGlobalSearch() {
    const trigger = document.getElementById('searchTrigger');
    const modal = document.getElementById('searchModal');
    const closeBtn = document.getElementById('searchClose');
    const input = document.getElementById('globalSearchInput');
    const results = document.getElementById('searchResults');

    const emptyHint = '<div class="search-empty-hint"><i class="fas fa-search" aria-hidden="true"></i><span>Search across mods, FAQ, downloads and news</span><span style="font-size:.78rem;opacity:.6;">Try "FPS", "install", or "v6.1"</span></div>';

    function openSearch() {
        modal.classList.add('open');
        setTimeout(() => input.focus(), 60);
    }

    function closeSearch() {
        modal.classList.remove('open');
        input.value = '';
        results.innerHTML = emptyHint;
    }

    trigger.addEventListener('click', openSearch);
    closeBtn.addEventListener('click', closeSearch);
    modal.addEventListener('click', e => { if (e.target === modal) closeSearch(); });

    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
        if (e.key === 'Escape' && modal.classList.contains('open')) closeSearch();
    });

    input.addEventListener('input', () => {
        const term = input.value.toLowerCase().trim();
        if (!term) { results.innerHTML = emptyHint; return; }

        const modMatches = modsData.filter(m =>
            m.title.toLowerCase().includes(term) || m.description.toLowerCase().includes(term)
        ).slice(0, 5);

        const faqMatches = faqData.filter(f =>
            f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term)
        ).slice(0, 3);

        const allDownloads = [
            ...downloadsData.clients.working,
            ...downloadsData.clients.legacy,
            ...downloadsData.extensions.working,
            ...downloadsData.extensions.legacy
        ];
        const dlMatches = allDownloads.filter(d => d.version.toLowerCase().includes(term)).slice(0, 3);

        if (!modMatches.length && !faqMatches.length && !dlMatches.length) {
            results.innerHTML = '<div class="search-no-results"><i class="fas fa-search" style="display:block;font-size:1.4rem;margin-bottom:10px;opacity:.3;" aria-hidden="true"></i>No results for "' + input.value + '"</div>';
            return;
        }

        let html = '';

        if (modMatches.length) {
            html += '<div class="search-result-group"><div class="search-result-label">Mods</div>';
            html += modMatches.map(m =>
                '<div class="search-result-item" data-section="mods">' +
                    '<img src="' + m.icon + '" alt="' + m.title + '" class="search-result-icon-img" />' +
                    '<div>' +
                        '<div class="search-result-title">' + m.title + '</div>' +
                        '<div class="search-result-desc">' + (m.description.length > 60 ? m.description.slice(0, 60) + '\u2026' : m.description) + '</div>' +
                    '</div>' +
                '</div>'
            ).join('');
            html += '</div>';
        }

        if (faqMatches.length) {
            html += '<div class="search-result-group"><div class="search-result-label">FAQ</div>';
            html += faqMatches.map(f =>
                '<div class="search-result-item" data-section="faq">' +
                    '<div class="search-result-icon-box" style="background:rgba(114,137,218,.2);"><i class="fas fa-question" style="color:var(--blurple);" aria-hidden="true"></i></div>' +
                    '<div><div class="search-result-title">' + (f.question.length > 65 ? f.question.slice(0, 65) + '\u2026' : f.question) + '</div></div>' +
                '</div>'
            ).join('');
            html += '</div>';
        }

        if (dlMatches.length) {
            html += '<div class="search-result-group"><div class="search-result-label">Downloads</div>';
            html += dlMatches.map(d =>
                '<div class="search-result-item" data-section="downloads">' +
                    '<div class="search-result-icon-box" style="background:rgba(87,242,135,.15);"><i class="fas fa-download" style="color:var(--green);" aria-hidden="true"></i></div>' +
                    '<div><div class="search-result-title">' + d.version + '</div></div>' +
                '</div>'
            ).join('');
            html += '</div>';
        }

        results.innerHTML = html;
        results.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                showSection(item.dataset.section);
                closeSearch();
            });
        });
    });
}

function setupBackToTop() {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 320);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function fetchDiscordCount() {
    fetch('https://discord.com/api/guilds/938248183878930514/widget.json')
        .then(r => r.json())
        .then(d => {
            const el = document.getElementById('discordOnline');
            if (el && d.presence_count !== undefined) {
                el.textContent = d.presence_count.toLocaleString();
            }
        })
        .catch(() => {});
}

function setupNav() {
    document.querySelectorAll('[data-section]').forEach(el => {
        el.addEventListener('click', e => {
            const id = el.dataset.section;
            if (id && !el.hasAttribute('target')) {
                e.preventDefault();
                showSection(id);
            }
        });
    });

    window.addEventListener('popstate', () => {
        const hash = location.hash.slice(1);
        showSection(ALL_SECTIONS.has(hash) ? hash : 'home');
    });

    const hash = location.hash.slice(1);
    showSection(ALL_SECTIONS.has(hash) ? hash : 'home');
}

function loadData() {
    return Promise.all([
        fetch('assets/data/mods.json').then(r => r.json()),
        fetch('assets/data/faq.json').then(r => r.json()),
        fetch('assets/data/downloads.json').then(r => r.json())
    ]).then(([mods, faq, downloads]) => {
        modsData = mods;
        faqData = faq;
        downloadsData = downloads;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    initSkeletons();
    setupHeaderScroll();
    setupMobileMenu();
    setupTabs();
    setupNav();
    setupToast();
    setupThemeToggle();
    setupGlobalSearch();
    setupBackToTop();
    fetchDiscordCount();

    loadData().then(() => {
        initFAQ();
        initMods();
        initDownloads();
        initLauncher();
        setupModFilters();
    });
});