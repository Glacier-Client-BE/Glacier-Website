'use strict';

import { $ } from './utils.js?v=20261024212402';
import { NOTIFICATION } from './config.js?v=20261024212402';
import { showSection } from './navigation.js?v=20261024212402';
import { latestVersionLabel, latestPackSize } from './content.js?v=20261024212402';
import { t, currentLang } from './i18n.js?v=20261024212402';

let toastKey = '';
let toastVersion = null;

// Sync the header version pill + corner popups to the newest release. The two
// corner popups share one slot: the version announcement takes priority; the
// donation nudge fills in when there's no new release to show.
export function applyVersioning() {
    // Pack size comes from the same release entry as the version, but it's set
    // independently so a missing size never suppresses the version pill/toast.
    const size = latestPackSize();
    const sizeEl = $('heroPackSize');
    if (size && sizeEl) sizeEl.textContent = size;

    const v = latestVersionLabel();
    if (!v) return;
    const pill = document.querySelector('.version-pill');
    if (pill) pill.textContent = v;
    if (!setupToast(v)) setupDonateToast();
}

function setupToast(version) {
    toastKey = 'glacier-' + version + '-release';
    if (sessionStorage.getItem(toastKey)) return false;
    toastVersion = version;
    renderToastText();
    const cta = $('toastCta');
    cta.addEventListener('click', e => { e.preventDefault(); showSection(NOTIFICATION.section); dismissToast(); });
    document.body.classList.add('has-toast');
    $('toastClose').addEventListener('click', dismissToast);
    // Let the page settle, then spring the popup in from the corner.
    setTimeout(() => $('toastBanner').classList.add('visible'), 700);
    return true;
}

function renderToastText() {
    if (toastVersion == null) return;
    $('toastMsg').textContent = t(currentLang(), 'toast.available').replace('{version}', toastVersion);
    $('toastCta').textContent = t(currentLang(), 'btn.download');
}

// The toast message/CTA are set programmatically (they interpolate the
// version number), so they don't carry data-i18n and need an explicit
// re-render whenever the language changes; main.js calls this on gc:langchange.
export function retranslateToast() {
    renderToastText();
}

function dismissToast() {
    if (toastKey) sessionStorage.setItem(toastKey, '1');
    $('toastBanner').classList.remove('visible');
    document.body.classList.remove('has-toast');
}

// Donation prompt: same springy corner popup as the announcement, shown on
// every load (when the version announcement isn't taking the slot). The CTA
// carries data-section="donate" so the global delegation handles navigation;
// here we just hide it. Dismissing hides it for the rest of the tab session.
function setupDonateToast() {
    const banner = $('donateBanner');
    if (!banner) return;
    // A dismissal is remembered for this tab session, so the prompt never
    // reappears on every navigation or reload after someone has said no.
    try { if (sessionStorage.getItem('gc-donate-dismissed')) return; } catch (e) { }
    document.body.classList.add('has-toast');
    $('donateClose').addEventListener('click', dismissDonateToast);
    $('donateCta').addEventListener('click', dismissDonateToast);
    // On narrow viewports the popup spans the bottom edge and would otherwise
    // cover the hero stats before the user has even scrolled — wait for the
    // first scroll (or a longer fallback delay) so the pitch lands first.
    if (window.innerWidth <= 560) {
        let shown = false;
        const reveal = () => {
            if (shown) return;
            shown = true;
            banner.classList.add('visible');
            window.removeEventListener('scroll', reveal);
        };
        window.addEventListener('scroll', reveal, { passive: true });
        setTimeout(reveal, 4000);
    } else {
        setTimeout(() => banner.classList.add('visible'), 900);
    }
}

function dismissDonateToast() {
    $('donateBanner').classList.remove('visible');
    document.body.classList.remove('has-toast');
    try { sessionStorage.setItem('gc-donate-dismissed', '1'); } catch (e) { }
}

export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gc-theme', theme);
    $('themeToggle').innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun" aria-hidden="true"></i>'
        : '<i class="fas fa-moon" aria-hidden="true"></i>';
}

export function fetchDiscord() {
    fetch('https://discord.com/api/guilds/938248183878930514/widget.json')
        .then(r => r.json())
        .then(d => {
            if (d.presence_count === undefined) return;
            const text = d.presence_count.toLocaleString();
            for (const el of document.querySelectorAll('[data-discord-online]')) el.textContent = text;
        })
        .catch(() => {});
}
