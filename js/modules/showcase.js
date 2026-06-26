'use strict';

// Pinned, chapter-stepped showcase. Rather than scrubbing transforms 1:1 with
// the scrollbar (which reads as jittery and never settles), it advances in clean
// discrete steps: an IntersectionObserver watches a centre line of the viewport,
// and whichever trigger spacer crosses it becomes the active chapter. All the
// motion — crossfade, slide, scale, the glow sweep, the progress ticks — is then
// a pure CSS transition on the .is-active class, so every change is crisp and
// identically eased no matter how fast you scroll. Degrades to an instant swap
// under reduced motion (handled in CSS).
export function setupShowcase() {
    const showcase = document.querySelector('.showcase');
    if (!showcase) return;

    const pin = showcase.querySelector('.showcase-pin');
    const countNum = showcase.querySelector('.showcase-count-num');
    const imgs = [...showcase.querySelectorAll('.showcase-img')];
    const texts = [...showcase.querySelectorAll('.showcase-text')];
    const ticks = [...showcase.querySelectorAll('.showcase-tick')];
    const arrows = [...showcase.querySelectorAll('.showcase-arrow')];
    const triggers = [...showcase.querySelectorAll('.showcase-trigger')];
    const n = imgs.length;
    if (!n) return;
    const span = Math.max(n - 1, 1);

    let current = -1;
    function setActive(i) {
        if (i === current || i < 0 || i >= n) return;
        current = i;
        // Glow position glides 0→1 across the panel as chapters advance; the
        // registered @property --gp lets the gradient transition smoothly.
        if (pin) pin.style.setProperty('--gp', (i / span).toFixed(3));
        if (countNum) countNum.textContent = String(i + 1).padStart(2, '0');
        for (let k = 0; k < n; k++) {
            imgs[k].classList.toggle('is-active', k === i);
            if (texts[k]) texts[k].classList.toggle('is-active', k === i);
            const tick = ticks[k];
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
