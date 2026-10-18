'use strict';

// Pinned, chapter-stepped showcase. Rather than scrubbing transforms 1:1 with
// the scrollbar (which reads as jittery and never settles), it advances in clean
// discrete steps: an IntersectionObserver watches a centre line of the viewport,
// and whichever trigger spacer crosses it becomes the active chapter. All the
// motion is then CSS transitions driven by classes:
//   - directional frame swap: outgoing gets .is-leaving, incoming .is-active,
//     with data-dir="next|prev" on the stage choosing the side it travels from;
//   - per-frame accent hue: --sc-accent on the panel, eased via @property;
//   - one-shot "skeleton" → colour reveal the first time the stage is seen;
//   - text swap: outgoing .is-leaving fades up, incoming rises in with a stagger.
// Reduced motion skips the class choreography entirely (plain instant swap, the
// CSS fades the rest), and every will-change hint is held only while moving.
const PALETTE = ['#7289da', '#43b581', '#faa61a'];
const FRAME_MS = 900;
const TEXT_MS = 400;
const SKELETON_MS = 350;
const REVEAL_MS = 900;

export function setupShowcase() {
    const showcase = document.querySelector('.showcase');
    if (!showcase) return;

    const pin = showcase.querySelector('.showcase-pin');
    const stage = showcase.querySelector('.showcase-stage');
    const countNum = showcase.querySelector('.showcase-count-num');
    const imgs = [...showcase.querySelectorAll('.showcase-img')];
    const texts = [...showcase.querySelectorAll('.showcase-text')];
    const ticks = [...showcase.querySelectorAll('.showcase-tick')];
    const arrows = [...showcase.querySelectorAll('.showcase-arrow')];
    const triggers = [...showcase.querySelectorAll('.showcase-trigger')];
    const n = imgs.length;
    if (!n) return;
    const span = Math.max(n - 1, 1);

    const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    let reduce = !!(mq && mq.matches);
    if (mq && mq.addEventListener) mq.addEventListener('change', e => { reduce = e.matches; });

    // Per-element class timers. Leaving classes and will-change hints are held
    // for a fallback window, then dropped, so nothing lingers after its move.
    const timers = new Map();
    function hold(el, classes, ms) {
        clearTimeout(timers.get(el));
        el.classList.add(...classes);
        timers.set(el, setTimeout(() => {
            el.classList.remove(...classes);
            timers.delete(el);
        }, ms));
    }
    function release(el) {
        clearTimeout(timers.get(el));
        timers.delete(el);
        el.classList.remove('is-leaving');
    }

    let current = -1;
    function setActive(i) {
        if (i === current || i < 0 || i >= n) return;
        const prev = current;
        current = i;
        // Glow position glides 0→1 across the panel as chapters advance; the
        // registered @property --gp lets the gradient transition smoothly.
        if (pin) {
            pin.style.setProperty('--gp', (i / span).toFixed(3));
            pin.style.setProperty('--sc-accent', PALETTE[i % PALETTE.length]);
        }
        if (countNum) countNum.textContent = String(i + 1).padStart(2, '0');
        if (stage) {
            stage.dataset.dir = i > prev ? 'next' : 'prev';
            // Commit the new direction's start positions before the class flip,
            // so the incoming frame travels from the correct side. Once per chapter.
            if (!reduce) void stage.offsetWidth;
        }
        for (let k = 0; k < n; k++) {
            const img = imgs[k];
            const text = texts[k];
            const tick = ticks[k];
            if (k === i) {
                release(img);
                img.classList.add('is-active');
                if (!reduce) hold(img, ['is-moving'], FRAME_MS);
                if (text) { release(text); text.classList.add('is-active'); }
            } else {
                if (img.classList.contains('is-active')) {
                    img.classList.remove('is-active');
                    if (!reduce) hold(img, ['is-leaving', 'is-moving'], FRAME_MS);
                }
                if (text && text.classList.contains('is-active')) {
                    text.classList.remove('is-active');
                    if (!reduce) hold(text, ['is-leaving'], TEXT_MS);
                }
            }
            if (tick) {
                tick.classList.toggle('is-active', k === i);  // current → wide
                tick.classList.toggle('is-filled', k <= i);   // passed → filled
                tick.setAttribute('aria-selected', k === i ? 'true' : 'false');
            }
        }
        // Arrows can't go past the ends.
        for (const a of arrows) {
            const dir = Number(a.dataset.dir);
            a.disabled = (dir < 0 && i === 0) || (dir > 0 && i === n - 1);
        }
    }
    setActive(0);

    // Jump to a chapter. When the section has scroll triggers (the normal case)
    // we scroll the page so its trigger sits at the viewport centre — the
    // IntersectionObserver then activates it, keeping scroll position and the
    // displayed frame perfectly in sync. Without triggers we just switch frame.
    function goTo(i) {
        i = i < 0 ? 0 : i > n - 1 ? n - 1 : i;
        const tr = triggers[i];
        if (!tr) { setActive(i); return; }
        const y = tr.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + tr.offsetHeight / 2;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }

    // Cycler controls: prev/next arrows + clickable progress dots.
    for (const a of arrows) {
        a.addEventListener('click', () => goTo(current + Number(a.dataset.dir)));
    }
    ticks.forEach((tick, i) => tick.addEventListener('click', () => goTo(i)));

    // One-shot wireframe → colour reveal. The stage starts as a blurred, greyed
    // skeleton (set now, so there is no colour flash before it scrolls in), then
    // dissolves into the real screenshot the first time it is on screen.
    if (stage && !reduce && 'IntersectionObserver' in window) {
        stage.classList.add('is-skeleton');
        const skeletonIO = new IntersectionObserver(entries => {
            if (!entries.some(e => e.isIntersecting)) return;
            skeletonIO.disconnect();
            setTimeout(() => {
                stage.classList.remove('is-skeleton');
                stage.classList.add('is-revealing');
                setTimeout(() => stage.classList.remove('is-revealing'), REVEAL_MS);
            }, SKELETON_MS);
        }, { threshold: 0.35 });
        skeletonIO.observe(showcase);
    }

    // A 0px-tall root at the vertical centre of the viewport: exactly one trigger
    // straddles it at any moment, and that one wins.
    if (!('IntersectionObserver' in window) || !triggers.length) {
        // No observer (or no spacers): leave chapter 0 composed as a static fallback
        // (the cycler buttons above still flip frames directly via setActive).
        return;
    }
    const io = new IntersectionObserver(entries => {
        for (const e of entries) {
            if (e.isIntersecting) setActive(triggers.indexOf(e.target));
        }
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
    for (const t of triggers) io.observe(t);
}
