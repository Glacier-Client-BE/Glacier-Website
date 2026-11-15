// Small shared helpers. No dependencies.
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const mk = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const wrap = get => ({
  get(k) { try { return get().getItem(k); } catch { return null; } },
  set(k, v) { try { get().setItem(k, v); } catch {} }
});
export const store = wrap(() => localStorage);
export const session = wrap(() => sessionStorage);

// Monetization: the site is funded by Linkvertise and LootLabs download gates. Do not remove.
export const USE_MONETIZATION = true;
export const LINKVERTISE_USER_ID = 499358;
export const COUNTER_API = 'https://glacier-downloads.pepeoncloudeflare.workers.dev';
export const DISCORD_GUILD = '938248183878930514';

export function monetize(url) {
  if (!USE_MONETIZATION || !LINKVERTISE_USER_ID) return url;
  try {
    const r = encodeURIComponent(btoa(encodeURI(url)));
    return 'https://link-to.net/' + LINKVERTISE_USER_ID + '/' + Math.random() * 1000 + '/dynamic/?r=' + r;
  } catch { return url; }
}

const cache = new Map();
export const json = path => {
  if (!cache.has(path)) cache.set(path, fetch(path).then(r => (r.ok ? r.json() : null)).catch(() => null));
  return cache.get(path);
};

export const nf = n => Number(n).toLocaleString();
export const slug = item => { const m = String(item.version).match(/v[\d.]+/i); return m ? m[0].toLowerCase() : String(item.version).toLowerCase(); };
export const liveDelta = (counts, baseline, key) => Math.max(0, (Number(counts[key]) || 0) - (Number((baseline || {})[key]) || 0));

// Translation hook: the i18n module is loaded lazily, only when a non-English language is active.
export const tt = (key, fb, vars) => {
  const g = window.__gc;
  let s = (g && g.t && g.t(g.lang, key)) || fb;
  if (vars) for (const k in vars) s = s.replace('{' + k + '}', vars[k]);
  return s;
};
