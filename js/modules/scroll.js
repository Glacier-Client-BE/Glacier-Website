'use strict';

import { state } from './state.js';
import { $ } from './utils.js';
import { syncScrollProgress } from './navigation.js';

// Single eased-scroll loop. One rAF drives every scroll-linked effect from one
// value (state.smoothY): the sticky header, the back-to-top button, the top
// reading-progress bar, and any registered scrollSubs (parallax). It keeps
// running until smoothY catches the real scroll position, then parks itself so
// an idle page costs nothing.
export function setupScroll() {
    const header = state.dom.headerEl;
    const back = $('backToTop');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    state.smoothY = window.scrollY;

    function frame() {
        const targetY = window.scrollY;
        const diff = targetY - state.smoothY;
        if (reduce || Math.abs(diff) < 0.4) {
            state.smoothY = targetY;
        } else {
            state.smoothY += diff * 0.16;
        }

        header.classList.toggle('scrolled', state.smoothY > 50);
        back.classList.toggle('visible', state.smoothY > 320);
        syncScrollProgress();
        for (const fn of state.scrollSubs) fn(state.smoothY);

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
