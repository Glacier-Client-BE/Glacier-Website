// Site shell: theme, header, full-screen mobile menu, language, reveals, small affordances.
import { $, $$, reduce, mk, store } from './util.js?v=20261115202616';

const SUN = '<i class="fa-solid fa-sun ico" aria-hidden="true"></i>';
const MOON = '<i class="fa-solid fa-moon ico" aria-hidden="true"></i>';
const SUPPORTED = ['en', 'fr', 'de', 'es', 'es-MX', 'it', 'pt', 'pt-BR', 'ru', 'zh', 'zh-TW', 'ja', 'ko', 'th', 'hi', 'id', 'tl', 'vi', 'pl', 'tr', 'ar'];
const base = new URL('.', import.meta.url);

export function snack(html, ms = 7000) {
  let s = $('#snack');
  if (!s) { s = mk('div', 'snack'); s.id = 'snack'; s.setAttribute('role', 'status'); s.setAttribute('aria-live', 'polite'); document.body.append(s); }
  s.innerHTML = html;
  s.classList.add('on');
  clearTimeout(s._t);
  s._t = setTimeout(() => s.classList.remove('on'), ms);
}

function theme() {
  const root = document.documentElement, btn = $('#themeToggle'), btn2 = $('#themeToggle2');
  const paint = () => { if (btn) btn.innerHTML = root.getAttribute('data-theme') === 'light' ? MOON : SUN; };
  paint();
  const flip = () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    store.set('gc-theme', next);
    paint();
  };
  if (btn) btn.addEventListener('click', flip);
  if (btn2) btn2.addEventListener('click', flip);
}

function header() {
  const h = $('.site-h');
  if (h && 'IntersectionObserver' in window) {
    const s = mk('i');
    s.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none';
    document.body.prepend(s);
    new IntersectionObserver(([e]) => h.classList.toggle('scrolled', !e.isIntersecting)).observe(s);
  }
  const top = $('.totop');
  if (top) {
    const on = () => top.classList.toggle('on', scrollY > 900);
    addEventListener('scroll', on, { passive: true });
    top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
    on();
  }
}

function current() {
  const sec = document.body.dataset.sec || '';
  $$('[data-nav]').forEach(a => { if (a.dataset.nav === sec) a.setAttribute('aria-current', 'page'); });
}

// Phones get a full-screen menu instead of a bottom bar.
function menu() {
  const btn = $('#burger'), m = $('#menu');
  if (!btn || !m) return;
  const set = on => {
    m.classList.toggle('on', on);
    btn.setAttribute('aria-expanded', String(on));
    document.body.classList.toggle('lock', on);
    if (on) { const f = $('a, button', m); f && f.focus(); } else btn.focus({ preventScroll: true });
  };
  btn.addEventListener('click', () => set(!m.classList.contains('on')));
  $$('[data-menu-close]', m).forEach(b => b.addEventListener('click', () => set(false)));
  m.addEventListener('click', e => { if (e.target.closest('a[href]')) set(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('on')) set(false); });
  matchMedia('(min-width: 960px)').addEventListener('change', e => { if (e.matches) set(false); });
}

function detectLang() {
  for (let c of navigator.languages || [navigator.language || 'en']) {
    if (SUPPORTED.includes(c)) return c;
    if (c === 'fil') return 'tl';
    c = c.split('-')[0];
    if (SUPPORTED.includes(c)) return c;
  }
  return 'en';
}

// Language: the translation tables load only when a non-English language is actually used.
function language() {
  const root = $('#lang'), trigger = $('#langBtn'), menuEl = $('#langMenu');
  let mod = null;
  const load = () => mod || (mod = import(new URL('../modules/i18n.js' + new URL(import.meta.url).search, base).href));
  const apply = async code => {
    const m = await load();
    window.__gc = { t: m.t, lang: code };
    m.applyLang(code);
    $$('button', menuEl).forEach(b => b.classList.toggle('on', b.dataset.value === code));
  };
  const saved = store.get('gc-lang');
  const start = saved || detectLang();
  if (start !== 'en') apply(start);
  else $$('button', menuEl).forEach(b => b.classList.toggle('on', b.dataset.value === 'en'));
  const sel = $('#langSel');
  if (sel) { sel.value = start; sel.addEventListener('change', () => apply(sel.value)); }
  if (!root) return;
  trigger.addEventListener('click', e => { e.stopPropagation(); const o = root.classList.toggle('open'); trigger.setAttribute('aria-expanded', String(o)); });
  menuEl.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    apply(b.dataset.value);
    root.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', e => { if (root.classList.contains('open') && !root.contains(e.target)) root.classList.remove('open'); });
  addEventListener('keydown', e => { if (e.key === 'Escape') root.classList.remove('open'); });
}

function reveals() {
  const rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 });
    rv.forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });
  } else rv.forEach(el => el.classList.add('in'));
}

function copy() {
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const v = b.dataset.copy;
    try { await navigator.clipboard.writeText(v); } catch { const t = mk('textarea'); t.value = v; document.body.append(t); t.select(); try { document.execCommand('copy'); } catch {} t.remove(); }
    snack('Copied ' + v, 1800);
  }));
}

// Warm a page as soon as someone reaches for its link so the click lands instantly.
function prefetch() {
  const seen = new Set();
  const warm = e => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.origin !== location.origin || a.pathname === location.pathname || seen.has(a.href)) return;
    if (navigator.connection && navigator.connection.saveData) return;
    seen.add(a.href);
    const l = mk('link'); l.rel = 'prefetch'; l.href = a.href; document.head.append(l);
  };
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('touchstart', warm, { passive: true });
}

// A tab left open across a deploy offers a refresh.
function staleCheck() {
  const meta = $('meta[name="site-build"]');
  if (!meta) return;
  const mine = meta.content;
  const check = async () => {
    try {
      const html = await (await fetch(location.pathname, { cache: 'no-store' })).text();
      const m = /name="site-build" content="([^"]*)"/.exec(html);
      if (m && m[1] && m[1] !== mine) snack('A new version of this site is available. <a href="" onclick="location.reload();return false">Refresh</a>', 600000);
    } catch {}
  };
  setInterval(() => { if (!document.hidden) check(); }, 15 * 60 * 1000);
}

// AdSense units load when they are close to the viewport.
export function initShell() {
  document.documentElement.classList.remove('nojs');
  theme(); header(); current(); menu(); language(); reveals(); copy(); prefetch(); staleCheck();
}
