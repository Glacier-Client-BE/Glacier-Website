'use strict';

import { USE_MONETIZATION, LINKVERTISE_USER_ID } from './config.js?v=20261024204450';

// Small shared helpers — DOM lookup, string/number formatting, escaping.

export const $ = id => document.getElementById(id);

// Reduced-motion preference, read once at load. Every JS animation checks this
// and skips itself; the CSS hard-resets its own transitions separately.
const REDUCED_MOTION = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
export const prefersReducedMotion = () => REDUCED_MOTION;

export function debounce(fn, ms) {
    let t = 0;
    return function (...a) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, a), ms);
    };
}

const ESC_RE = /[<>"']/g;
const ESC_MAP = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escAttr = s => String(s).replace(ESC_RE, c => ESC_MAP[c]);
export const slice = (s, n) => s.length > n ? s.slice(0, n) + '…' : s;

export function formatBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
}

export const formatCount = n => Number(n).toLocaleString('en-US');

// Stable per-version key used by the counter (e.g. "Glacier v6.2" -> "v6.2").
export function countKey(version) {
    const m = /v[\d.]+/i.exec(version || '');
    return m ? m[0].toLowerCase() : null;
}

// Live portion of a Worker counter total for one key: the running total minus
// whatever's already been folded into the static base, never negative.
export function liveDelta(counts, baseline, key) {
    return Math.max(0, (Number(counts[key]) || 0) - (Number((baseline || {})[key]) || 0));
}

export function slugify(s) {
    return s.toLowerCase().replace(/\+/g, '-plus').replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '');
}

// Flags <code> elements that look like copyable file paths (contain a path
// separator and are reasonably long) so click-to-copy only applies where
// useful, not to every short inline <code>true</code>/<code>v6.2</code>.
export function markCopyableCode(root) {
    for (const el of (root || document).querySelectorAll('code:not(.copyable-code)')) {
        const text = el.textContent.trim();
        if (/[\\/]/.test(text) && text.length > 8) el.classList.add('copyable-code');
    }
}

export function getMonetizedUrl(targetUrl) {
    if (!USE_MONETIZATION || !LINKVERTISE_USER_ID) return targetUrl;
    try {
        const encoded = encodeURIComponent(btoa(encodeURI(targetUrl)));
        const random = Math.random() * 1000;
        return 'https://link-to.net/' + LINKVERTISE_USER_ID + '/' + random + '/dynamic/?r=' + encoded;
    } catch (e) {
        return targetUrl;
    }
}

// Friendly empty or failed state: an icon in a soft disc, one short line and
// at most one next action. `action` is trusted markup built by the caller.
export function emptyStateHtml(icon, text, action = '') {
    return '<div class="empty-state" role="status">'
        + '<span class="empty-state-ico" aria-hidden="true"><i class="fas ' + icon + '"></i></span>'
        + '<p>' + text + '</p>' + action + '</div>';
}
