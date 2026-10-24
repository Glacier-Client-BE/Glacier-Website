'use strict';

import { state } from './state.js?v=20261024211110';
import { prefersReducedMotion } from './utils.js?v=20261024211110';

// Scroll-into-view reveals. Prefers the native CSS scroll-driven animations
// (animation-timeline: view()) when supported; otherwise falls back to an
// IntersectionObserver that adds .is-visible once, then unobserves.
// Siblings in a grid also get a --stagger-i index (capped) so a list cascades
// in rather than landing all at once; the CSS turns that into a transition-delay.

let revealObs = null;
const STAGGER_MAX = 8;

export function setupReveal() {
    const usesCssTimeline = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'));
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

// Position of a .reveal element among its .reveal siblings (non-reveal siblings,
// such as a category heading, are not counted). Read-only.
function staggerIndex(el) {
    const parent = el.parentElement;
    if (!parent) return 0;
    let i = 0;
    for (const sib of parent.children) {
        if (sib === el) return i;
        if (sib.classList.contains('reveal')) i++;
    }
    return 0;
}

// Observe any not-yet-revealed elements. Called again after async content
// (downloads, mods, FAQ) is injected so late nodes still animate in.
export function observeReveals() {
    if (!revealObs) return;
    const pending = [...document.querySelectorAll('.reveal:not(.is-visible)')];
    // Read every index first, then write the custom properties.
    if (!prefersReducedMotion()) {
        const indexes = pending.map(staggerIndex);
        pending.forEach((el, k) => el.style.setProperty('--stagger-i', Math.min(indexes[k], STAGGER_MAX)));
    }
    for (const el of pending) revealObs.observe(el);
}
