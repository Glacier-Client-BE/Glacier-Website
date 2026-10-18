'use strict';

// Screenshot showcase: three frames behind ARIA tabs, with autoplay, keyboard
// and swipe control. This module only moves state. It sets classes and
// attributes, and the CSS does the motion (css/showcase-motion.css).
// Autoplay runs on the active tab's CSS progress bar: its animationend advances
// the cycle. CSS pauses that bar on hover, focus, or while the section is
// offscreen or the tab is hidden. Reduced motion starts paused.
const SWIPE_PX = 40;
const STEP = { ArrowRight: 1, ArrowLeft: -1, Home: -1, End: 1 };

export function setupShowcase() {
    const root = document.querySelector('.sc');
    if (!root) return;
    const stage = root.querySelector('.sc-stage');
    const panel = root.querySelector('.sc-panel');
    const tablist = root.querySelector('.sc-tablist');
    const tabs = [...root.querySelectorAll('.sc-tab')];
    const frames = [...root.querySelectorAll('.sc-img')];
    const caps = [...root.querySelectorAll('.sc-cap')];
    const chips = [...root.querySelectorAll('.sc-chip-item')];
    const toggle = root.querySelector('.sc-toggle');
    const n = tabs.length;
    if (!n || frames.length !== n || caps.length !== n) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let playing = !motion.matches;

    // Only the first frame can be the LCP image, and only if it starts in view.
    if (root.getBoundingClientRect().top < window.innerHeight) {
        frames[0].loading = 'eager';
        frames[0].setAttribute('fetchpriority', 'high');
    }

    // Sets the incoming item's enter class and the outgoing one's exit class.
    function swap(items, prev, next) {
        items.forEach((el, k) => {
            if (k === next) {
                el.classList.remove('is-out', 'is-on');
                el.classList.add('is-in');
                el.removeAttribute('aria-hidden');
            } else {
                if (k === prev) {
                    el.classList.remove('is-in', 'is-on');
                    el.classList.add('is-out');
                }
                el.setAttribute('aria-hidden', 'true');
            }
        });
    }

    function preloadNext() {
        new Image().src = frames[(index + 1) % n].src;
    }

    function select(i, step = 1) {
        if (i === index) return;
        const prev = index;
        index = i;
        panel.dataset.dir = step > 0 ? 'next' : 'prev';
        swap(frames, prev, i);
        swap(caps, prev, i);
        swap(chips, prev, i);
        tabs.forEach((tab, k) => {
            tab.setAttribute('aria-selected', String(k === i));
            tab.tabIndex = k === i ? 0 : -1;
        });
        panel.setAttribute('aria-labelledby', tabs[i].id);
        tablist.style.setProperty('--sc-i', i);
        preloadNext();
    }

    function paint() {
        root.classList.toggle('is-paused', !playing);
        toggle.setAttribute('aria-label', playing ? 'Pause autoplay' : 'Play autoplay');
    }

    tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i, i > index ? 1 : -1)));

    tablist.addEventListener('keydown', e => {
        const step = STEP[e.key];
        if (!step) return;
        e.preventDefault();
        let i = index + step;
        if (e.key === 'Home') i = 0;
        else if (e.key === 'End') i = n - 1;
        else i = (i + n) % n;
        select(i, step);
        tabs[i].focus();
    });

    // Swipe: horizontal only, and only for touch and pen so mouse drags are ignored.
    let startX = null;
    let startY = 0;
    stage.addEventListener('pointerdown', e => {
        if (e.pointerType === 'mouse') return;
        startX = e.clientX;
        startY = e.clientY;
    });
    stage.addEventListener('pointerup', e => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        startX = null;
        if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return;
        const step = dx < 0 ? 1 : -1;
        select((index + step + n) % n, step);
    });
    stage.addEventListener('pointercancel', () => { startX = null; });

    root.addEventListener('animationend', e => {
        if (e.animationName === 'sc-fill' && playing) select((index + 1) % n, 1);
    });

    toggle.addEventListener('click', () => {
        playing = !playing;
        paint();
    });
    motion.addEventListener?.('change', e => {
        playing = !e.matches;
        paint();
    });

    // Pause while the section is offscreen or the tab is hidden.
    new IntersectionObserver(([entry]) => {
        root.classList.toggle('is-away', !entry.isIntersecting);
    }).observe(root);
    document.addEventListener('visibilitychange', () => {
        root.classList.toggle('is-hidden', document.hidden);
    });

    tablist.style.setProperty('--sc-i', 0);
    paint();
    preloadNext();
}
