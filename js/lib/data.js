// Live data: downloads page, stats, Discord presence, announcement bar. Everything reads the JSON that the workflows keep fresh.
import { $, $$, mk, esc, json, nf, slug, liveDelta, monetize, store, reduce, tt, COUNTER_API, DISCORD_GUILD } from './util.js?v=20261115202616';
import { snack } from './shell.js?v=20261115202616';

const CHEV = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
const MB = n => (n / 1048576).toFixed(1) + ' MB';
let counts = {}, baseline = {};

const btnClass = (name, primary) => (name === 'LootLabs' || name === 'Linkvertise' || name === 'Download') ? (primary ? 'btn p' : 'btn g') : 'btn g';

// LootLabs first, Linkvertise (or the plain download) second. "monetize" options hold a raw file URL that gets a fresh Linkvertise link.
function buttons(opts, primary, key) {
  const hasLoot = opts.some(o => o.name === 'LootLabs');
  const sorted = [...opts].sort((a, b) => (b.name === 'LootLabs') - (a.name === 'LootLabs'));
  return sorted.map((o, i) => {
    const href = o.monetize ? monetize(o.url) : o.url;
    const label = o.name === 'Download' ? (hasLoot ? 'Linkvertise' : tt('btn.download', 'Download')) : o.name;
    return `<button type="button" class="${btnClass(o.name, primary && i === 0)}" data-go="${esc(href)}" data-dl="${esc(key || '')}">${label}</button>`;
  }).join('');
}

function changelog(entries) {
  if (!entries || !entries.length) return '';
  const rows = entries.map(c => {
    const title = c.title ? (tt('changelog.' + c.version + '.title', c.title)) : '';
    const notes = c.notes.map((n, i) => `<li>${tt('changelog.' + c.version + '.note' + i, n)}</li>`).join('');
    return `<div><b>${esc(c.version)}</b> <span class="mut">${esc(c.date || '')}</span>${title ? `<p>${title}</p>` : ''}<ul>${notes}</ul></div>`;
  }).join('');
  return `<details class="acc"><summary>${tt('dl.changelogLabel', 'Changelog')}${CHEV}</summary><div class="body">${rows}</div></details>`;
}

function extensions(list) {
  if (!list || !list.length) return '';
  const n = list.length;
  const label = tt(n === 1 ? 'dl.extOne' : 'dl.extMany', n === 1 ? '{n} compatible extension' : '{n} compatible extensions', { n });
  const rows = list.map(e => `<div class="row"><div><b>${esc(e.version)}</b><div class="meta">${esc(e.description || '')}</div></div><div class="btns">${buttons(e.options || [], false, '')}</div></div>`).join('');
  return `<details class="acc"><summary>${label}${CHEV}</summary><div class="list" style="box-shadow:none;border-radius:0">${rows}</div></details>`;
}

function liveCount(key, base) { return (Number(base) || 0) + (counts && counts[key] != null ? liveDelta(counts, baseline, key) : 0); }

function renderPack(dl) {
  const host = $('#packPanel');
  if (!host || !dl) return;
  const exts = (dl.extensions && dl.extensions.working) || [];
  const latest = (dl.clients.working || []).map(c => {
    const key = slug(c);
    const mirrors = (c.mirrors || []).map(m => `<a href="${esc(m.url)}" target="_blank" rel="noopener">${esc(m.name)}</a>`).join('');
    return `<article class="card rel rv in">
      <div class="head"><span class="lbl"><i class="dot"></i>${tt('dl.tagLatest', c.tag || 'Latest')}</span><span class="tag">${esc(c.release)} · ${esc(c.size)} · <span data-dlcount="${esc(key)}" data-base="${c.downloads}">${nf(liveCount(key, c.downloads))}</span> ${tt('dl.downloadsWord', 'downloads')}</span></div>
      <h3 class="v">${esc(c.version)}</h3>
      <div class="btns">${buttons(c.options, true, key)}</div>
      ${mirrors ? `<div class="mirrors"><span>${tt('dl.alsoAvailableOn', 'Also available on')}</span>${mirrors}</div>` : ''}
      <div class="list" style="box-shadow:none;background:none;margin:8px -24px -24px;border-radius:0 0 20px 20px">${changelog(c.changelog)}${extensions(exts)}</div>
    </article>`;
  }).join('');
  const legacy = (dl.clients.legacy || []).map(c => {
    const key = slug(c);
    return `<div class="row"><div><b>${esc(c.version)}</b><div class="meta">${esc(c.release || '')} · ${esc(c.size || '')} · <span data-dlcount="${esc(key)}" data-base="${c.downloads || 0}">${nf(liveCount(key, c.downloads))}</span> ${tt('dl.downloadsWord', 'downloads')}</div></div><div class="btns">${buttons(c.options, false, key)}</div></div>`;
  }).join('');
  host.innerHTML = `<h2 class="vh">${tt('dl.working', 'Working Versions')}</h2>${latest}<h3 style="margin:40px 0 16px;font-size:28px">${tt('dl.legacy', 'Legacy Versions')}</h3><div class="card list rv in">${legacy}</div>`;
}

function launcherFacts(rels) {
  const r = rels && rels[0];
  const a = r && (r.assets || []).find(x => /\.exe$/i.test(x.name));
  if (!r || !a) return;
  $$('[data-lv]').forEach(el => { el.textContent = r.tag_name; });
  $$('[data-ls]').forEach(el => { el.textContent = MB(a.size); });
  $$('[data-ld]').forEach(el => { el.textContent = new Date(r.published_at).toISOString().slice(0, 10); });
}

function renderLauncher(rels) {
  launcherFacts(rels);
  const host = $('#launcherPanel');
  if (!host) return;
  if (!rels || !rels.length) { host.innerHTML = `<p class="mut">${tt('dl.failedLoadLauncher', 'Failed to load launcher releases.')}</p>`; return; }
  const row = (r, big) => {
    const a = (r.assets || []).find(x => /\.exe$/i.test(x.name)) || (r.assets || [])[0];
    if (!a) return '';
    const btns = `${a.loot_url ? `<button type="button" class="btn ${big ? 'p lg' : 'g'}" data-go="${esc(a.loot_url)}" data-dl="launcher">LootLabs</button>` : ''}<button type="button" class="btn ${big && !a.loot_url ? 'p lg' : 'g'}" data-go="${esc(monetize(a.browser_download_url))}" data-dl="launcher">Linkvertise</button>`;
    const gh = `https://github.com/Glacier-Client-BE/Glacier-Launcher/releases/tag/${encodeURIComponent(r.tag_name)}`;
    const date = new Date(r.published_at).toISOString().slice(0, 10);
    if (big) return `<article class="card rel feature"><div class="head"><span class="lbl"><i class="dot"></i>${tt('dl.tagLatest', 'Latest')} · Windows</span><span class="tag">${date} · ${MB(a.size)} · Windows</span></div><h3 class="v">Glacier Launcher ${esc(r.tag_name)}</h3><p>Install and launch Glacier on Windows, with the config editor, themes and auto-updates built in.</p><div class="btns">${btns}</div><div class="mirrors"><a href="${gh}" target="_blank" rel="noopener">${tt('dl.viewOnGithub', 'View on GitHub')}</a></div></article>`;
    return `<div class="row"><div><b>Glacier Launcher ${esc(r.tag_name)}</b><div class="meta">${date} · ${MB(a.size)}</div></div><div class="btns">${btns}<a class="btn g" href="${gh}" target="_blank" rel="noopener">GitHub</a></div></div>`;
  };
  const [first, ...rest] = rels;
  host.innerHTML = row(first, true) + (rest.length ? `<h3 style="margin:40px 0 16px;font-size:28px">${tt('dl.launcherReleases', 'Glacier Launcher Releases')}</h3><div class="card list">${rest.slice(0, 10).map(r => row(r, false)).join('')}</div>` : '');
}

async function liveCounts() {
  const [c, b] = await Promise.all([
    fetch(COUNTER_API + '/counts').then(r => (r.ok ? r.json() : {})).catch(() => ({})),
    json('/assets/data/download-counts-baseline.json').then(x => x || {})
  ]);
  counts = c || {}; baseline = b || {};
}

function totals(dl) {
  if (!dl) return;
  const all = [...(dl.clients.working || []), ...(dl.clients.legacy || [])];
  const total = all.reduce((n, c) => n + liveCount(slug(c), c.downloads), 0);
  $$('[data-total-dl]').forEach(el => count(el, total, '+'));
  const latest = (dl.clients.working || [])[0];
  if (latest) {
    $$('[data-pack-size]').forEach(el => { el.textContent = latest.size; });
    $$('[data-latest]').forEach(el => { el.textContent = latest.version.replace(/^Glacier\s*/i, ''); });
    $$('[data-latest-date]').forEach(el => { el.textContent = latest.release; });
  }
}

function count(el, to, suffix = '') {
  if (reduce || !('IntersectionObserver' in window)) { el.textContent = nf(to) + suffix; return; }
  const run = () => {
    const t0 = performance.now(), d = 1100;
    const step = t => { const p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - p, 3); el.textContent = nf(Math.round(to * e)) + suffix; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); run(); } });
  io.observe(el);
}

function discord() {
  fetch(`https://discord.com/api/guilds/${DISCORD_GUILD}/widget.json`).then(r => r.json()).then(d => {
    if (d.presence_count === undefined) return;
    $$('[data-discord-online]').forEach(el => { el.textContent = nf(d.presence_count); });
  }).catch(() => {});
}

function platform() {
  const el = $('#plat');
  if (!el) return;
  const ua = navigator.userAgent || '';
  const H = [[/android/i, 'Android', 'Open the .mcpack with Minecraft to import it.'], [/iphone|ipad|ipod/i, 'iOS', 'Open the .mcpack in Minecraft to import it.'], [/windows/i, 'Windows', 'Double-click the .mcpack to import it.'], [/mac|linux/i, 'Desktop', 'Packs need Minecraft Bedrock. See Help for Mac and Linux.']];
  const hit = H.find(([re]) => re.test(ua));
  if (hit) { el.textContent = `Detected ${hit[1]} · ${hit[2]}`; el.hidden = false; }
}

function announce(dl) {
  const bar = $('#ann');
  const latest = dl && (dl.clients.working || [])[0];
  if (!bar || !latest) return;
  const v = latest.version.replace(/^Glacier\s*/i, '');
  if (store.get('gc-ann') === v) return;
  $('#annText').textContent = tt('toast.available', 'Glacier {version} is now available!', { version: v });
  bar.classList.add('on');
  $('#annClose').addEventListener('click', () => { bar.classList.remove('on'); store.set('gc-ann', v); });
}

// Download clicks: count them, then point to the next step.
function trackClicks() {
  ['mouseover', 'mouseenter', 'pointerover', 'pointerenter'].forEach(t => window.addEventListener(t, e => { if (e.target.closest && e.target.closest('[data-go]')) e.stopPropagation(); }, true));
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-dl]');
    if (!a) return;
    // Gates open only on a real press, never on hover: they are buttons, not links, so no script can follow them early.
    if (a.dataset.go) window.open(a.dataset.go, '_blank', 'noopener');
    const key = a.dataset.dl;
    if (key && /^v[0-9.]{1,10}$/.test(key)) { try { fetch(COUNTER_API + '/increment/' + key, { method: 'POST', keepalive: true }); } catch {} }
    snack(`${tt('dl.next.lead', 'Download started!')} ${tt('dl.next.body', 'Next: import the .mcpack/.zip into Minecraft.')} <a href="/docs/#installation">${tt('dl.next.link', 'Install steps')}</a>`, 9000);
  });
}

function chooser() {
  const links = $$('.choose a[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-25% 0px -60% 0px' });
  links.map(a => $(a.getAttribute('href'))).filter(Boolean).forEach(t => spy.observe(t));
}

export async function initData() {
  platform(); discord(); trackClicks(); chooser();
  const [dl, rels] = await Promise.all([json('/assets/data/downloads.json'), json('/assets/data/launcher.json'), liveCounts()]);
  const draw = () => { renderPack(dl); renderLauncher(rels); totals(dl); };
  draw(); announce(dl);
  document.addEventListener('gc:langchange', () => { draw(); });
  // live counts refresh the numbers in place
  $$('[data-dlcount]').forEach(el => { el.textContent = nf(liveCount(el.dataset.dlcount, el.dataset.base)); });
}
