// Page-specific behavior: mod filters and favorites, FAQ filter, docs table of contents, gallery lightbox, search palette trigger.
import { $, $$, store, mk } from './util.js?v=20261115202409';

export function initMods() {
  const grid = $('#mods');
  if (!grid) return;
  const cards = $$('.mod', grid), chips = $$('[data-cat]'), q = $('#modQ'), empty = $('#modEmpty'), count = $('#modCount');
  let cat = 'all', favs = [];
  try { favs = JSON.parse(store.get('gc-favs') || '[]'); } catch {}
  const apply = () => {
    const term = (q.value || '').trim().toLowerCase();
    let n = 0;
    cards.forEach(c => {
      const okCat = cat === 'all' || (cat === 'fav' ? favs.includes(c.dataset.id) : c.dataset.cats.split(' ').includes(cat));
      const ok = okCat && (!term || c.dataset.q.includes(term));
      c.hidden = !ok; if (ok) n++;
    });
    empty.classList.toggle('on', n === 0);
    if (count) count.textContent = n;
  };
  cards.forEach(c => { const f = $('.fav', c); f.setAttribute('aria-pressed', String(favs.includes(c.dataset.id))); f.addEventListener('click', () => {
    const id = c.dataset.id;
    favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
    store.set('gc-favs', JSON.stringify(favs));
    f.setAttribute('aria-pressed', String(favs.includes(id)));
    if (cat === 'fav') apply();
  }); });
  chips.forEach(b => b.addEventListener('click', () => { cat = b.dataset.cat; chips.forEach(x => x.setAttribute('aria-pressed', String(x === b))); apply(); }));
  q.addEventListener('input', apply);
  const p = new URLSearchParams(location.search).get('q');
  if (p) q.value = p;
  apply();
}

export function initFaq() {
  const list = $('#faq');
  if (!list) return;
  const items = $$('.faq-item', list), cats = $$('.faq-cat', list), chips = $$('[data-faqcat]'), q = $('#faqQ'), empty = $('#faqEmpty');
  let cat = 'all';
  const apply = () => {
    const term = (q.value || '').trim().toLowerCase();
    let n = 0;
    items.forEach(it => { const ok = (cat === 'all' || it.dataset.cat === cat) && (!term || it.dataset.q.includes(term)); it.hidden = !ok; if (ok) n++; });
    cats.forEach(c => { c.hidden = ![...items].some(it => !it.hidden && it.dataset.cat === c.dataset.cat); });
    empty.classList.toggle('on', n === 0);
  };
  chips.forEach(b => b.addEventListener('click', () => { cat = b.dataset.faqcat; chips.forEach(x => x.setAttribute('aria-pressed', String(x === b))); apply(); }));
  q.addEventListener('input', apply);
  const open = () => { const t = $(location.hash || '#_'); if (t && t.tagName === 'DETAILS') { t.open = true; t.scrollIntoView({ block: 'center' }); } };
  addEventListener('hashchange', open); open();
}

export function initToc() {
  const toc = $('.toc');
  if (!toc || !('IntersectionObserver' in window)) return;
  const links = $$('a', toc);
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-30% 0px -60% 0px' });
  links.map(a => $(a.getAttribute('href'))).filter(Boolean).forEach(t => spy.observe(t));
}

export function initGallery() {
  const items = $$('[data-zoom]');
  if (!items.length) return;
  const dlg = $('#lightbox'), img = $('img', dlg);
  items.forEach(b => b.addEventListener('click', () => { img.src = b.dataset.zoom; img.alt = b.dataset.alt || ''; dlg.showModal(); }));
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
}

// Search palette: Ctrl or Cmd K, or "/", opens it. The index loads on first use.
export function initSearch() {
  const dlg = $('#cmdk');
  if (!dlg || !dlg.showModal) return;
  const input = $('#ckIn'), ul = $('#ckList');
  let index = null, act = 0, items = [];
  const vis = () => items.filter(li => !li.hidden);
  const mark = () => { const v = vis(); v.forEach((li, i) => li.classList.toggle('on', i === act)); if (v[act]) v[act].scrollIntoView({ block: 'nearest' }); };
  const build = list => { ul.innerHTML = ''; items = list.map(e => { const li = mk('li'); li.innerHTML = `<a href="${e.u}"><b></b><span></span></a>`; $('b', li).textContent = e.t; $('span', li).textContent = e.d || ''; li.dataset.k = (e.t + ' ' + (e.d || '') + ' ' + (e.k || '')).toLowerCase(); ul.append(li); return li; }); };
  const filter = () => {
    const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    items.forEach(li => { li.hidden = !terms.every(t => li.dataset.k.includes(t)); });
    act = 0; mark();
  };
  const open = async () => {
    if (dlg.open) return;
    dlg.showModal(); input.value = ''; input.focus();
    if (!index) { index = await fetch('/assets/data/search-index.json').then(r => r.json()).catch(() => []); build(index); }
    filter();
  };
  $$('[data-cmdk]').forEach(b => b.addEventListener('click', open));
  addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName);
    if ((e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) { e.preventDefault(); open(); }
  });
  input.addEventListener('input', filter);
  dlg.addEventListener('keydown', e => {
    const v = vis();
    if (e.key === 'ArrowDown') { e.preventDefault(); act = Math.min(v.length - 1, act + 1); mark(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); act = Math.max(0, act - 1); mark(); }
    else if (e.key === 'Enter') { const a = v[act] && $('a', v[act]); if (a) { e.preventDefault(); location.href = a.href; } }
  });
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
}

// Horizontal mods rail with arrow buttons.
export function initRail() {
  const rail = $('.rail');
  if (!rail) return;
  $$('[data-rail]').forEach(b => b.addEventListener('click', () => rail.scrollBy({ left: (b.dataset.rail === 'next' ? 1 : -1) * 280, behavior: 'smooth' })));
}
