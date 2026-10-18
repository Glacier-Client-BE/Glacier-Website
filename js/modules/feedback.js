'use strict';

// Interaction feedback, answering every press within the Doherty threshold (~400ms):
//   • a pointer ripple on buttons and nav tabs (a span that scales out and is
//     removed on finish). Pointer-only, so keyboard focus is never touched;
//   • a "Starting download…" state on download buttons. The link is never
//     blocked; the label reverts after about 1.5s;
//   • a floating "Copied!" toast, shown by showCopiedToast() from copyText().
// Every motion is skipped under prefers-reduced-motion. Listeners are passive.

import { prefersReducedMotion } from './utils.js?v=20260902203329';

const RIPPLE_SEL = '.btn, button, .nav-tab';
const DL_SEL = '.download-card a.btn';
const LOADING_MS = 1500;
const TOAST_HOLD_MS = 1400;
const EASE_OUT = 'cubic-bezier(.22,1,.36,1)';

const busy = new WeakMap();   // download link -> { html, timer }
let toastEl = null;
let toastTimer = 0;
let toastAnim = null;

export function setupFeedback() {
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('click', onDownloadClick, { passive: true });
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

// ── Download loading state ─────────────────────────────────────────────────
// Only the visual state changes here; the browser follows the href as usual.
function onDownloadClick(e) {
    const link = e.target.closest(DL_SEL);
    if (!link) return;

    const prev = busy.get(link);
    const originalHtml = prev ? prev.html : link.innerHTML;
    if (prev) clearTimeout(prev.timer);

    link.classList.add('is-loading');
    link.setAttribute('aria-busy', 'true');
    link.innerHTML = '<i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i> Starting download…';

    const timer = setTimeout(() => {
        link.innerHTML = originalHtml;
        link.classList.remove('is-loading');
        link.removeAttribute('aria-busy');
        busy.delete(link);
    }, LOADING_MS);
    busy.set(link, { html: originalHtml, timer });
}

// ── Copied toast ───────────────────────────────────────────────────────────
// One shared live region, created on first use. It fades and rises in, holds,
// then fades out. A new copy interrupts whichever phase is running.
export function showCopiedToast(message = 'Copied!') {
    if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.className = 'copied-toast';
        toastEl.setAttribute('role', 'status');
        toastEl.setAttribute('aria-live', 'polite');
        toastEl.style.cssText = 'position:fixed;left:0;right:0;margin:0 auto;bottom:24px;width:max-content;'
            + 'z-index:1100;pointer-events:none;opacity:0;';
        document.body.appendChild(toastEl);
    }

    clearTimeout(toastTimer);
    if (toastAnim) toastAnim.cancel();
    toastEl.textContent = message;
    toastEl.classList.add('is-shown');

    if (prefersReducedMotion() || !toastEl.animate) {
        toastEl.style.opacity = '1';
    } else {
        toastAnim = toastEl.animate([
            { opacity: 0, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 200, easing: EASE_OUT, fill: 'forwards' });
    }
    toastTimer = setTimeout(hideCopiedToast, TOAST_HOLD_MS);
}

function hideCopiedToast() {
    if (!toastEl) return;
    toastEl.classList.remove('is-shown');
    if (prefersReducedMotion() || !toastEl.animate) {
        toastEl.style.opacity = '0';
        return;
    }
    if (toastAnim) toastAnim.cancel();
    toastAnim = toastEl.animate([
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(8px)' }
    ], { duration: 220, easing: 'ease-in', fill: 'forwards' });
}
