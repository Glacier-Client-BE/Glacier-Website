'use strict';

/* ── Kinetic interactive layer ──
   A dependency-free overlay that adds an interactive glacial particle field,
   cursor-deflection, magnetic controls and physics-based card tilt on top of
   the existing site. Everything lives in one requestAnimationFrame loop, sizes
   itself to the viewport (DPR-aware, zero CLS), degrades to gyro / drift on
   touch, honours prefers-reduced-motion, and tears itself fully down on
   pagehide so nothing leaks across navigations. */
(function () {
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = matchMedia('(hover: none), (pointer: coarse)');

    const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
    const lerp = (a, b, t) => a + (b - a) * t;

    // Pointer state in CSS pixels plus a smoothed velocity used to drive how
    // hard particles are pushed away from the cursor's path.
    const pointer = { x: -1e4, y: -1e4, px: -1e4, py: -1e4, vx: 0, vy: 0, inside: false };

    // Subtle parallax/tilt offset shared by the field; fed by the cursor on
    // desktop and by device orientation on touch hardware.
    const ambient = { x: 0, y: 0, tx: 0, ty: 0 };

    let canvas, ctx, dpr = 1, cssW = 0, cssH = 0;
    let particles = [];
    let rafId = 0;
    let running = false;
    let lastT = 0;
    let accentRGB = '142,160,224';

    const magnets = [];
    const tilts = [];
    const teardown = [];

    function on(target, type, fn, opts) {
        target.addEventListener(type, fn, opts);
        teardown.push(() => target.removeEventListener(type, fn, opts));
    }

    function readAccent() {
        const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        const hex = /^#([0-9a-f]{6})$/i.exec(raw);
        if (hex) {
            const n = parseInt(hex[1], 16);
            accentRGB = (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255);
        }
    }

    function viewportTier() {
        const w = innerWidth;
        if (w <= 600) return { count: 0.000018, cap: 46, radius: 96, link: false };
        if (w <= 1024) return { count: 0.000026, cap: 90, radius: 120, link: false };
        if (w <= 1600) return { count: 0.000034, cap: 130, radius: 150, link: true };
        return { count: 0.000038, cap: 170, radius: 168, link: true };
    }

    function spawn(tier) {
        const target = Math.min(tier.cap, Math.round(cssW * cssH * tier.count));
        particles = new Array(target);
        for (let i = 0; i < target; i++) {
            particles[i] = {
                x: Math.random() * cssW,
                y: Math.random() * cssH,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                r: 0.6 + Math.random() * 1.8,
                a: 0.18 + Math.random() * 0.5,
                depth: 0.4 + Math.random() * 0.9
            };
        }
    }

    function resize() {
        dpr = clamp(devicePixelRatio || 1, 1, 2);
        cssW = innerWidth;
        cssH = innerHeight;
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        canvas.style.width = cssW + 'px';
        canvas.style.height = cssH + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        spawn(viewportTier());
        cacheRects();
    }

    function cacheRects() {
        for (const m of magnets) m.rect = m.el.getBoundingClientRect();
        for (const t of tilts) t.rect = t.el.getBoundingClientRect();
    }

    function step(now) {
        const dt = Math.min(0.05, (now - lastT) / 1000) || 0.016;
        lastT = now;

        pointer.vx = lerp(pointer.vx, pointer.x - pointer.px, 0.3);
        pointer.vy = lerp(pointer.vy, pointer.y - pointer.py, 0.3);
        pointer.px = pointer.x;
        pointer.py = pointer.y;

        ambient.x = lerp(ambient.x, ambient.tx, 0.06);
        ambient.y = lerp(ambient.y, ambient.ty, 0.06);

        renderField(dt);
        updateMagnets();
        updateTilts();

        rafId = requestAnimationFrame(step);
    }

    function renderField(dt) {
        const tier = viewportTier();
        const rad = tier.radius;
        const rad2 = rad * rad;
        const speed = Math.hypot(pointer.vx, pointer.vy);
        const push = clamp(0.6 + speed * 0.05, 0.6, 3.4);

        ctx.clearRect(0, 0, cssW, cssH);
        ctx.fillStyle = '';

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            p.x += p.vx * dt * p.depth;
            p.y += p.vy * dt * p.depth;

            if (pointer.inside) {
                const dx = p.x - pointer.x;
                const dy = p.y - pointer.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < rad2 && d2 > 0.001) {
                    const d = Math.sqrt(d2);
                    const f = (1 - d / rad) * push;
                    p.vx += (dx / d) * f * 6 * dt * 60;
                    p.vy += (dy / d) * f * 6 * dt * 60;
                }
            }

            p.vx *= 0.96;
            p.vy *= 0.96;

            const driftX = ambient.x * 14 * p.depth;
            const driftY = ambient.y * 14 * p.depth;

            if (p.x < -20) p.x = cssW + 20; else if (p.x > cssW + 20) p.x = -20;
            if (p.y < -20) p.y = cssH + 20; else if (p.y > cssH + 20) p.y = -20;

            const sx = p.x + driftX;
            const sy = p.y + driftY;

            ctx.beginPath();
            ctx.arc(sx, sy, p.r, 0, 6.2832);
            ctx.fillStyle = 'rgba(' + accentRGB + ',' + p.a.toFixed(3) + ')';
            ctx.fill();

            if (tier.link && pointer.inside) {
                const ldx = sx - pointer.x;
                const ldy = sy - pointer.y;
                const ld2 = ldx * ldx + ldy * ldy;
                if (ld2 < rad2) {
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(pointer.x, pointer.y);
                    ctx.strokeStyle = 'rgba(' + accentRGB + ',' + (0.12 * (1 - ld2 / rad2)).toFixed(3) + ')';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function updateMagnets() {
        for (const m of magnets) {
            const r = m.rect;
            if (!r) continue;
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const dx = pointer.x - cx;
            const dy = pointer.y - cy;
            const reach = Math.max(r.width, r.height) * 0.9 + 36;
            const near = pointer.inside && Math.hypot(dx, dy) < reach;

            m.tx = near ? clamp(dx * 0.32, -16, 16) : 0;
            m.ty = near ? clamp(dy * 0.32, -16, 16) : 0;
            m.x = lerp(m.x, m.tx, 0.18);
            m.y = lerp(m.y, m.ty, 0.18);

            if (Math.abs(m.x) < 0.05 && Math.abs(m.y) < 0.05 && !near) {
                if (m.applied) { m.el.style.transform = ''; m.applied = false; }
            } else {
                m.el.style.transform = 'translate(' + m.x.toFixed(2) + 'px,' + m.y.toFixed(2) + 'px)';
                m.applied = true;
            }
        }
    }

    function updateTilts() {
        for (const t of tilts) {
            const r = t.rect;
            if (!r) continue;
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const inside = pointer.inside &&
                pointer.x >= r.left && pointer.x <= r.right &&
                pointer.y >= r.top && pointer.y <= r.bottom;

            const nx = inside ? clamp((pointer.x - cx) / (r.width / 2), -1, 1) : 0;
            const ny = inside ? clamp((pointer.y - cy) / (r.height / 2), -1, 1) : 0;

            t.tx = -ny * 6;
            t.ty = nx * 6;
            t.tl = inside ? -6 : 0;

            t.x = lerp(t.x, t.tx, 0.12);
            t.y = lerp(t.y, t.ty, 0.12);
            t.lift = lerp(t.lift, t.tl, 0.12);

            const idle = Math.abs(t.x) < 0.02 && Math.abs(t.y) < 0.02 && Math.abs(t.lift) < 0.05;
            if (idle && !inside) {
                if (t.applied) { t.el.style.transform = ''; t.applied = false; }
            } else {
                t.el.style.transform =
                    'perspective(900px) rotateX(' + t.x.toFixed(2) + 'deg) rotateY(' + t.y.toFixed(2) +
                    'deg) translateY(' + t.lift.toFixed(2) + 'px)';
                t.applied = true;
            }
        }
    }

    function bindPointer() {
        on(window, 'pointermove', e => {
            if (e.pointerType === 'touch') return;
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            pointer.inside = true;
            ambient.tx = (e.clientX / cssW - 0.5) * 2;
            ambient.ty = (e.clientY / cssH - 0.5) * 2;
        }, { passive: true });

        on(window, 'pointerleave', () => { pointer.inside = false; });
        on(document, 'mouseleave', () => { pointer.inside = false; });
    }

    function bindGyro() {
        let throttled = 0;
        on(window, 'deviceorientation', e => {
            const now = performance.now();
            if (now - throttled < 60) return;
            throttled = now;
            ambient.tx = clamp((e.gamma || 0) / 30, -1, 1);
            ambient.ty = clamp((e.beta || 0) / 45, -1, 1);
        }, { passive: true });
    }

    function collectInteractive() {
        if (coarse.matches) return;
        document.querySelectorAll('.btn, .header-icon-btn, .search-trigger')
            .forEach(el => magnets.push({ el, x: 0, y: 0, tx: 0, ty: 0, rect: null, applied: false }));
        document.querySelectorAll('.feature-card, .card-base')
            .forEach(el => tilts.push({ el, x: 0, y: 0, lift: 0, tx: 0, ty: 0, tl: 0, rect: null, applied: false }));
    }

    function pause() {
        if (!running) return;
        running = false;
        cancelAnimationFrame(rafId);
    }

    function play() {
        if (running) return;
        running = true;
        lastT = performance.now();
        rafId = requestAnimationFrame(step);
    }

    function destroy() {
        pause();
        for (const fn of teardown.splice(0)) fn();
        for (const m of magnets) m.el.style.transform = '';
        for (const t of tilts) t.el.style.transform = '';
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
        particles = [];
        magnets.length = 0;
        tilts.length = 0;
    }

    function init() {
        if (reduceMotion.matches) return;

        canvas = document.createElement('canvas');
        canvas.className = 'kinetic-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        ctx = canvas.getContext('2d', { alpha: true });
        document.body.appendChild(canvas);

        readAccent();
        collectInteractive();
        resize();

        if (coarse.matches) {
            if (typeof DeviceOrientationEvent !== 'undefined') bindGyro();
        } else {
            bindPointer();
        }

        const onResize = (() => {
            let t = 0;
            return () => { clearTimeout(t); t = setTimeout(resize, 150); };
        })();
        on(window, 'resize', onResize, { passive: true });
        on(window, 'scroll', (() => {
            let queued = false;
            return () => {
                if (queued) return;
                queued = true;
                requestAnimationFrame(() => { cacheRects(); queued = false; });
            };
        })(), { passive: true });

        on(document, 'visibilitychange', () => document.hidden ? pause() : play());
        on(window, 'pagehide', destroy);

        const themeObs = new MutationObserver(readAccent);
        themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        teardown.push(() => themeObs.disconnect());

        play();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
