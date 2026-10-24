'use strict';

// Interaction feedback, answering every press within the Doherty threshold (~400ms):
//   • a pointer ripple on buttons and nav tabs (a span that scales out and is
//     removed on finish). Pointer-only, so keyboard focus is never touched;
//   • a "Starting download…" state on download buttons. The link is never
//     blocked; the label reverts after about 1.5s;
//   • a "next steps" panel after a download starts: what to do with the file,
//     with a link to the install guide. Neutral, dismissible, and it leaves on
//     its own after a while.
// Every motion is skipped under prefers-reduced-motion. Listeners are passive.

import { prefersReducedMotion } from './utils.js?v=20261024210441';
import { t, currentLang } from './i18n.js?v=20261024210441';

const RIPPLE_SEL = '.btn, button, .nav-tab';
const DL_SEL = '.download-card a.btn';
const LOADING_MS = 1500;
const NEXT_MS = 15000;
const EASE_OUT = 'cubic-bezier(.22,1,.36,1)';

const busy = new WeakMap();   // download link -> { html, timer }
let nextEl = null;
let nextTimer = 0;

export function setupFeedback() {
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('click', onDownloadClick, { passive: true });
    document.addEventListener('click', onNextClick);
}

// ── Ripple ─────────────────────────────────────────────────────────────────
function onPointerDown(e) {
    if (!e.isPrimary || prefersReducedMotion()) return;
    const host = e.target.closest(RIPPLE_SEL);
    if (!host || host.disabled) return;

    // Read geometry and computed style first, then write.
    const rect = host.getBoundingClientRect();
    const isStatic = getComputedStyle(host).position === 'static';
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = 2 * Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));

    if (isStatic) host.style.position = 'relative';
    const span = document.createElement('span');
    span.className = 'ripple';
    span.setAttribute('aria-hidden', 'true');
    span.style.cssText = 'position:absolute;pointer-events:none;border-radius:50%;background:currentColor;'
        + 'left:' + (x - size / 2) + 'px;top:' + (y - size / 2) + 'px;width:' + size + 'px;height:' + size + 'px;';
    host.appendChild(span);

    const anim = span.animate([
        { transform: 'scale(0)', opacity: 0.22 },
        { transform: 'scale(1)', opacity: 0 }
    ], { duration: 520, easing: EASE_OUT });
    anim.onfinish = () => span.remove();
    anim.oncancel = () => span.remove();
}

// ── Download loading state + next steps ────────────────────────────────────
// Only the visual state changes here; the browser follows the href as usual.
function onDownloadClick(e) {
    const link = e.target.closest(DL_SEL);
    if (!link) return;

    const prev = busy.get(link);
    const originalHtml = prev ? prev.html : link.innerHTML;
    if (prev) clearTimeout(prev.timer);

    link.classList.add('is-loading');
    link.setAttribute('aria-busy', 'true');
    link.innerHTML = '<i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i> ' + t(currentLang(), 'dl.starting');

    const timer = setTimeout(() => {
        link.innerHTML = originalHtml;
        link.classList.remove('is-loading');
        link.removeAttribute('aria-busy');
        busy.delete(link);
    }, LOADING_MS);
    busy.set(link, { html: originalHtml, timer });

    showNextSteps();
}

// Built on first use, filled with the current language each time it opens.
function showNextSteps() {
    const lang = currentLang();
    if (!nextEl) {
        nextEl = document.createElement('div');
        nextEl.id = 'dlNext';
        nextEl.className = 'dl-next';
        nextEl.setAttribute('role', 'status');
        nextEl.setAttribute('aria-live', 'polite');
        document.body.appendChild(nextEl);
    }
    nextEl.innerHTML =
        '<span class="dl-next-ico" aria-hidden="true"><i class="fas fa-circle-check"></i></span>'
        + '<p class="dl-next-text"><strong>' + t(lang, 'dl.next.lead') + '</strong> ' + t(lang, 'dl.next.body')
        + ' <a class="dl-next-link" href="/docs#docs-install" data-section="docs" data-dl-next-link>'
        + t(lang, 'dl.next.link') + ' <i class="fas fa-arrow-right" aria-hidden="true"></i></a></p>'
        + '<button type="button" class="dl-next-close" data-dl-next-close aria-label="' + t(lang, 'dl.next.close') + '">'
        + '<i class="fas fa-xmark" aria-hidden="true"></i></button>';

    clearTimeout(nextTimer);
    nextEl.classList.add('is-shown');
    nextTimer = setTimeout(hideNextSteps, NEXT_MS);
}

function hideNextSteps() {
    clearTimeout(nextTimer);
    if (nextEl) nextEl.classList.remove('is-shown');
}

// Close button hides the panel. The install link leaves it, then scrolls to the
// install card once the Help section has been shown by the delegated handler.
function onNextClick(e) {
    if (e.target.closest('[data-dl-next-close]')) { hideNextSteps(); return; }
    const link = e.target.closest('[data-dl-next-link]');
    if (!link) return;
    hideNextSteps();
    setTimeout(() => {
        const target = document.getElementById('docs-install');
        if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }, prefersReducedMotion() ? 50 : 450);
}
