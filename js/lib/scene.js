// Home scenes: the in-game window carousel (video + screenshots), the 3D bear, the feature explorer,
// the launcher theme swatches, click-to-play YouTube players and in-view video playback.
import { $, $$, reduce, fine, mk } from './util.js?v=20261115194304';

const isVideo = el => el && el.tagName === 'VIDEO';

// Plays a video only while it is on screen and the tab is visible. Reduced motion keeps the poster.
function autoplay(v) {
  if (reduce) { v.removeAttribute('autoplay'); return; }
  const go = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  new IntersectionObserver(([e]) => { if (e.isIntersecting && !document.hidden) go(); else v.pause(); }, { threshold: .25 }).observe(v);
  document.addEventListener('visibilitychange', () => { if (document.hidden) v.pause(); });
}

// Tabs that crossfade a set of slides (images or one video) and rotate until the visitor takes over.
function carousel(tabs, slides, ms) {
  if (!tabs.length) return;
  let i = 0, timer = 0, manual = false, visible = true;
  const show = n => {
    i = n;
    tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === n)));
    slides.forEach((m, k) => {
      m.classList.toggle('on', k === n);
      if (isVideo(m)) { if (k === n) { m.currentTime = 0; if (!reduce && visible) m.play().catch(() => {}); } else m.pause(); }
    });
  };
  const next = () => { if (!manual && !document.hidden && visible) show((i + 1) % tabs.length); };
  const arm = () => {
    clearTimeout(timer);
    if (reduce || manual) return;
    const cur = slides[i];
    timer = setTimeout(() => { next(); arm(); }, isVideo(cur) ? 14000 : ms);
  };
  slides.filter(isVideo).forEach(v => { v.loop = false; v.addEventListener('ended', () => { if (!manual && slides[i] === v) { clearTimeout(timer); next(); arm(); } }); });
  tabs.forEach((t, k) => t.addEventListener('click', () => { manual = true; clearTimeout(timer); show(k); }));
  const host = tabs[0].closest('.win, .xp') || tabs[0].parentElement;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; const v = slides[i]; if (isVideo(v)) { if (visible && !reduce) v.play().catch(() => {}); else v.pause(); } }, { threshold: .2 }).observe(host);
  show(0); arm();
}

// Every .bear-box becomes a stack of masked slices of the logo, forming a real 3D bear that turns.
function bears() {
  $$('.bear-box').forEach(box => {
    const n = 10;
    for (let i = 0; i < n; i++) { const l = mk('i', 'bear'); l.style.setProperty('--i', i); box.append(l); }
    box.parentElement.classList.add('has-3d');
    const host = box.closest('.hero2') || box.parentElement || box.parentElement;
    let ry = 0, tilt = 0, tiltT = 0, tr = 0, raf = 0, phase = Math.random() * 6;
    const paint = () => { box.style.transform = `rotateX(${(8 + tilt).toFixed(2)}deg) rotateY(${(-22 + ry).toFixed(2)}deg)`; };
    paint();
    if (reduce) return;
    const t0 = performance.now();
    const idle = t => { ry = Math.sin((t - t0) / 3200 + phase) * 18; paint(); raf = requestAnimationFrame(idle); };
    new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if (e.isIntersecting) raf = requestAnimationFrame(idle); }).observe(host);
    if (fine) {
      host.addEventListener('pointermove', e => {
        const r = host.getBoundingClientRect();
        tiltT = (.5 - (e.clientY - r.top) / r.height) * 12; phase += ((e.clientX - r.left) / r.width - .5) * .02;
        cancelAnimationFrame(tr); tr = requestAnimationFrame(function ease() { tilt += (tiltT - tilt) * .12; paint(); if (Math.abs(tiltT - tilt) > .05) tr = requestAnimationFrame(ease); });
      });
    }
  });
}

function launcher() {
  const band = $('.lband'), sw = $$('.swatches2 button');
  if (!band || !sw.length) return;
  sw.forEach(b => b.addEventListener('click', () => {
    band.style.setProperty('--lac', b.dataset.c);
    sw.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  }));
}

// Click-to-play YouTube: nothing from youtube loads until the visitor presses play (privacy + speed).
function players() {
  $$('.yt').forEach(box => {
    const go = () => {
      const f = mk('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${box.dataset.yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      f.title = box.dataset.title || 'Video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      box.replaceChildren(f); box.classList.add('live');
    };
    box.addEventListener('click', go, { once: true });
  });
}

export function initScene() {
  $$('.win').forEach(w => { const t = $$('.win-tabs button', w); if (t.length) carousel(t, $$('.win-view > *', w), 5000); });
  carousel($$('.xp-tab'), $$('.xp-view img'), 6000);
  $$('video[data-play]').filter(v => !v.closest('.win-tabs, .win') || !v.closest('.win').querySelector('.win-tabs')).forEach(autoplay);
  bears(); launcher(); players();
}
