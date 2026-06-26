'use strict';

// Pointer-driven 3D tilt for cards and the hero image. Each element rotates
// toward the cursor in shared perspective (set on the parent grid via CSS) and
// shows a glare highlight that tracks the pointer. One rAF per element keeps it
// smooth; disabled on touch/coarse pointers and reduced-motion.

let tiltEnabled = null;   // cached capability check (null until first call)

function tiltAllowed() {
    if (tiltEnabled === null) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
        tiltEnabled = !reduce && !coarse;
    }
    return tiltEnabled;
}

export function setupTilt(selector) {
    if (!tiltAllowed()) return;

    const MAX = 9;     // peak rotation in degrees
    const LIFT = -6;   // px the card lifts toward the viewer

    for (const el of document.querySelectorAll(selector)) {
        if (el.classList.contains('tilt-3d')) continue;   // idempotent — skip wired elements
        const glare = document.createElement('span');
        glare.className = 'tilt-glare';
        el.appendChild(glare);
        el.classList.add('tilt-3d');

        let raf = 0;
        let px = 0.5, py = 0.5;

        const apply = () => {
            raf = 0;
            const ry = (px - 0.5) * 2 * MAX;        // left/right → rotateY
            const rx = (0.5 - py) * 2 * MAX;        // up/down → rotateX
            el.style.setProperty('--tilt-ry', ry.toFixed(2) + 'deg');
            el.style.setProperty('--tilt-rx', rx.toFixed(2) + 'deg');
            el.style.setProperty('--tilt-lift', LIFT + 'px');
            glare.style.setProperty('--glare-x', (px * 100).toFixed(1) + '%');
            glare.style.setProperty('--glare-y', (py * 100).toFixed(1) + '%');
        };

        el.addEventListener('pointermove', e => {
            if (e.pointerType === 'touch') return;
            const r = el.getBoundingClientRect();
            px = (e.clientX - r.left) / r.width;
            py = (e.clientY - r.top) / r.height;
            if (!raf) raf = requestAnimationFrame(apply);
        });

        el.addEventListener('pointerenter', e => {
            if (e.pointerType === 'touch') return;
            el.classList.add('is-tilting');
        });

        el.addEventListener('pointerleave', () => {
            if (raf) { cancelAnimationFrame(raf); raf = 0; }
            el.classList.remove('is-tilting');
            el.style.setProperty('--tilt-rx', '0deg');
            el.style.setProperty('--tilt-ry', '0deg');
            el.style.setProperty('--tilt-lift', '0px');
        });
    }
}
