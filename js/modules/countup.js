'use strict';

// Count-up for download totals. Each .dl-count-num tweens from 0 to its value
// (800ms, ease-out cubic) the first time it scrolls into view. One shared
// IntersectionObserver drives it, and each tween runs on rAF. The live counter
// can rewrite the number at any time; if it does mid-tween, the tween yields to
// that value. Skipped entirely under reduced motion, where numbers render as-is.
// Digit styling (tabular-nums) belongs to CSS on .dl-count-num.

import { prefersReducedMotion } from './utils.js?v=20261018221924';

const DURATION = 800;
const fmt = new Intl.NumberFormat('en-US');
let io = null;

// Call after download cards render (initial load and on language change).
export function observeCounts() {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    if (!io) io = new IntersectionObserver(onIntersect, { threshold: 0.4 });
    for (const cell of document.querySelectorAll('.dl-count:not([data-counted])')) io.observe(cell);
}

function onIntersect(entries) {
    for (const en of entries) {
        if (!en.isIntersecting) continue;
        io.unobserve(en.target);
        countUp(en.target);
    }
}

function countUp(cell) {
    const num = cell.querySelector('.dl-count-num');
    if (!num || cell.dataset.counted) return;
    cell.dataset.counted = '1';

    const target = Number(num.textContent.replace(/\D/g, '')) || 0;
    if (!target) return;

    let written = null;
    let raf = 0;
    // If anything other than this tween writes the number, stop and keep theirs.
    const mo = new MutationObserver(() => {
        if (num.textContent !== written) {
            cancelAnimationFrame(raf);
            mo.disconnect();
        }
    });
    mo.observe(num, { childList: true, characterData: true, subtree: true });

    const start = performance.now();
    const step = now => {
        const t = Math.min((now - start) / DURATION, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        written = fmt.format(Math.round(target * eased));
        num.textContent = written;
        if (t < 1) raf = requestAnimationFrame(step);
        else mo.disconnect();
    };
    raf = requestAnimationFrame(step);
}
