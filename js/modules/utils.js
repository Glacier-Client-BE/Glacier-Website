'use strict';

import { USE_MONETIZATION, LINKVERTISE_USER_ID } from './config.js';

// Small shared helpers — DOM lookup, string/number formatting, escaping.

export const $ = id => document.getElementById(id);

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

export function slugify(s) {
    return s.toLowerCase().replace(/\+/g, '-plus').replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '');
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
