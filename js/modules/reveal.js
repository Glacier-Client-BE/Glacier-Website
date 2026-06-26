'use strict';

import { state } from './state.js';

// Scroll-into-view reveals. Prefers the native CSS scroll-driven animations
// (animation-timeline: view()) when supported; otherwise falls back to an
// IntersectionObserver that adds .is-visible once, then unobserves.

let revealObs = null;

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

// Observe any not-yet-revealed elements. Called again after async content
// (downloads, mods, FAQ) is injected so late nodes still animate in.
export function observeReveals() {
    if (!revealObs) return;
    for (const el of document.querySelectorAll('.reveal:not(.is-visible)')) revealObs.observe(el);
}
