'use strict';

import { state } from './state.js?v=20261025084120';
import { $ } from './utils.js?v=20261025084120';
import { syncScrollProgress } from './navigation.js?v=20261025084120';

// Single eased-scroll loop. One rAF drives every scroll-linked effect from one
// value (state.smoothY): the sticky header, the back-to-top button, the top
// reading-progress bar. It keeps
// running until smoothY catches the real scroll position, then parks itself so
// an idle page costs nothing.
export function setupScroll() {
    const header = state.dom.headerEl;
    const back = $('backToTop');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let wasScrolled = null;
    let wasBack = null;
    state.smoothY = window.scrollY;

    function frame() {
        const targetY = window.scrollY;
        const diff = targetY - state.smoothY;
        if (reduce || Math.abs(diff) < 0.4) {
            state.smoothY = targetY;
        } else {
            state.smoothY += diff * 0.16;
        }

        // Only touch the DOM when a threshold is crossed, not on every frame of the scroll.
        const scrolled = state.smoothY > 50, showBack = state.smoothY > 320;
        if (scrolled !== wasScrolled) { header.classList.toggle('scrolled', scrolled); wasScrolled = scrolled; }
        if (showBack !== wasBack) { back.classList.toggle('visible', showBack); wasBack = showBack; }
        syncScrollProgress();

        if (!reduce && Math.abs(window.scrollY - state.smoothY) >= 0.4) {
            raf = requestAnimationFrame(frame);
        } else {
            state.smoothY = window.scrollY;
            raf = 0;
        }
    }

    const schedule = () => { if (!raf) raf = requestAnimationFrame(frame); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    frame();

    back.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
