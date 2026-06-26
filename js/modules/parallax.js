'use strict';

import { state } from './state.js';

// Parallax depth. Drives two kinds of scroll-linked drift off the shared eased
// value (state.smoothY), so the motion inherits the same inertial, slightly-
// trailing feel rather than tracking the raw scrollbar 1:1:
//   • the far BG.png layer (body::before) drifts slowly via --bg-parallax;
//   • every [data-parallax] element shifts by its distance from the eased
//     viewport centre × its factor via --parallax-y, so each plane moves at its
//     own rate and reads as depth.
// Skipped wholesale under reduced-motion (the CSS also hard-resets the transforms).
export function setupParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    const layers = [...document.querySelectorAll('[data-parallax]')].map(el => ({
        el,
        factor: parseFloat(el.dataset.parallax) || 0
    }));

    const clampPx = (v, lim) => v < -lim ? -lim : v > lim ? lim : v;

    function render(y) {
        // Far layer: a slow, capped drift behind the kinetic particle field.
        root.style.setProperty('--bg-parallax', clampPx(-y * 0.04, 40).toFixed(1) + 'px');

        // Foreground layers: offset by each element's distance from the eased
        // viewport centre. Layout (absolute centre) is read from the real scroll
        // position so the mapping stays correct; the eased y feeds the motion.
        if (!layers.length) return;
        const mid = y + window.innerHeight / 2;
        for (const layer of layers) {
            const rect = layer.el.getBoundingClientRect();
            const center = rect.top + window.scrollY + rect.height / 2;
            layer.el.style.setProperty('--parallax-y', ((mid - center) * layer.factor).toFixed(1) + 'px');
        }
    }

    state.scrollSubs.push(render);
    render(state.smoothY);
}
