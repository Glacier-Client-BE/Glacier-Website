'use strict';

// Soft accent-colored halo that follows the cursor on desktop. Skipped on
// touch devices and under reduced-motion, purely cosmetic (GPU-only
// translate, no layout impact).
export function setupCursorGlow() {
    const el = document.getElementById('cursorGlow');
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, active = false;

    const onMove = e => {
        tx = e.clientX; ty = e.clientY;
        if (!active) { active = true; el.classList.add('is-visible'); }
    };
    const onLeave = () => { active = false; el.classList.remove('is-visible'); };
    const onDown = () => el.classList.add('is-pressed');
    const onUp = () => el.classList.remove('is-pressed');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);

    const tick = () => {
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
        el.style.transform = 'translate3d(' + (cx - 160) + 'px,' + (cy - 160) + 'px,0)';
        raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
}
