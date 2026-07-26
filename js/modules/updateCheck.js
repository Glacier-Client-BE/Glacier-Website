'use strict';

// Detects when the currently loaded page is running an older build than
// what's actually deployed, and offers a one-click refresh instead of
// requiring the user to know to hard-reload.
//
// Why this exists: browsers cache each JS module by its own URL. Bumping
// the cache-busting "?v=" query on js/main.js (done automatically by
// .github/workflows/stamp-version.yml on every push) guarantees *that*
// script is re-fetched, but its internal `import`s of ./modules/*.js are
// still subject to ordinary HTTP caching — a tab left open across a
// deploy can keep running stale sub-modules until those caches expire.
// This check re-fetches the page itself (bypassing cache) periodically
// and compares the stamped build id against the one baked into this tab.

import { t, currentLang } from './i18n.js?v=20260726094126';

const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
let dismissed = false;

function myBuild() {
    const meta = document.querySelector('meta[name="site-build"]');
    return meta ? meta.content : null;
}

async function checkForUpdate() {
    if (dismissed) return;
    const mine = myBuild();
    if (!mine) return;
    try {
        const html = await fetch(location.pathname + location.search, { cache: 'no-store' }).then(r => r.text());
        const m = /<meta name="site-build" content="([^"]+)"/.exec(html);
        if (m && m[1] !== mine) showBar();
    } catch {
        // Offline, or the request was blocked — just try again next interval.
    }
}

function showBar() {
    const bar = document.getElementById('updateBar');
    if (bar) bar.classList.add('visible');
}

// The message/CTA are also set programmatically here (rather than relying
// solely on data-i18n) so they stay correct even though this banner is
// hidden by default and applyLang() runs before it's ever shown.
export function retranslateUpdateBar() {
    const lang = currentLang();
    const msgEl = document.querySelector('#updateBar [data-i18n="update.available"]');
    const refreshEl = document.getElementById('updateBarRefresh');
    if (msgEl) msgEl.textContent = t(lang, 'update.available');
    if (refreshEl) refreshEl.textContent = t(lang, 'update.refresh');
}

export function setupUpdateCheck() {
    const bar = document.getElementById('updateBar');
    if (!bar) return;

    retranslateUpdateBar();
    document.getElementById('updateBarRefresh').addEventListener('click', () => location.reload());
    document.getElementById('updateBarDismiss').addEventListener('click', () => {
        dismissed = true;
        bar.classList.remove('visible');
    });

    setInterval(checkForUpdate, CHECK_INTERVAL);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate();
    });
}
