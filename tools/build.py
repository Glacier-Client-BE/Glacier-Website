#!/usr/bin/env python3
"""Builds the Glacier Client website: every page, the search index, the sitemap and robots.txt.

The site is plain static files served by GitHub Pages. Pages are generated from this file plus:
  tools/en.json               English strings (the keys match js/modules/i18n.js, so the 21 translations keep working)
  tools/content/*.html        legal, best-client copy
  tools/content/meta.json     page titles and descriptions
  assets/data/*.json          downloads, launcher releases, mods, FAQ (kept fresh by the workflows)
Run:  python tools/build.py        (idempotent; only rewrites files whose content changed)
"""
import hashlib, html, json, os, re, sys, datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SITE = 'https://glacierclient.xyz'
DISCORD = 'https://discord.glacierclient.xyz/'
CONFIG = 'https://config.glacierclient.xyz/'
AD_CLIENT = 'ca-pub-3797529826447427'
AD = {'home': '5966424262', 'features': '5966424262', 'downloads': '4954539589', 'docs': '9714097582', 'community': '5966424262'}


def rd(p, enc='utf-8'):
    with open(os.path.join(ROOT, p), encoding=enc) as f:
        return f.read()


def wr(p, text):
    full = os.path.join(ROOT, p)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    if os.path.exists(full) and rd(p) == text:
        return False
    with open(full, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)
    return True


EN = json.loads(rd('tools/en.json'))
META = json.loads(rd('tools/content/meta.json'))
LD = rd('tools/content/ld.json')
MODS = json.loads(rd('assets/data/mods.json'))
FAQ = json.loads(rd('assets/data/faq.json'))
DL = json.loads(rd('assets/data/downloads.json'))
LATEST = DL['clients']['working'][0]
VERSION = os.environ.get('VERSION') or hashlib.md5((rd('css/site.css') + ''.join(rd('js/' + p) for p in ('site.js', 'lib/shell.js', 'lib/data.js', 'lib/scene.js', 'lib/pages.js', 'lib/util.js'))).encode()).hexdigest()[:12]
YEAR = datetime.date.today().year

esc = lambda s: html.escape(str(s), quote=True)


def tx(k):
    assert k in EN, 'missing i18n key ' + k
    return html.escape(EN[k], quote=False)


def ta(k):
    assert k in EN, 'missing i18n key ' + k
    return 'data-i18n="%s"' % k


def th(k):
    assert k in EN, 'missing i18n key ' + k
    return EN[k]


FA = {'arrow': 'arrow-right', 'chev': 'chevron-right', 'chevl': 'chevron-left', 'down': 'download', 'search': 'magnifying-glass', 'globe': 'globe', 'home': 'house',
      'grid': 'layer-group', 'users': 'user-group', 'menu': 'bars', 'star': 'star', 'x': 'xmark', 'up': 'chevron-up', 'sun': 'sun', 'play': 'play',
      'sliders': 'sliders', 'heart': 'heart', 'book': 'book-open', 'bolt': 'bolt', 'palette': 'palette', 'rotate': 'rotate', 'windows': 'windows', 'cubes': 'cubes',
      'gear': 'gear', 'shield': 'shield-halved', 'film': 'film', 'mobile': 'mobile-screen', 'desktop': 'display', 'gamepad': 'gamepad', 'feather': 'feather-pointed', 'check': 'check',
      'video': 'circle-play', 'coffee': 'mug-hot', 'qa': 'circle-question', 'file': 'file-lines', 'image': 'image'}
BRANDS = {'Discord': 'discord', 'GitHub': 'github', 'YouTube': 'youtube', 'X': 'x-twitter', 'Instagram': 'instagram', 'TikTok': 'tiktok', 'paypal': 'paypal', 'windows': 'windows'}


def ic(n, extra=''):
    fam = 'fa-brands' if n in ('windows',) else ('fa-regular' if n == 'star' else 'fa-solid')
    return '<i class="%s fa-%s ico%s" aria-hidden="true"></i>' % (fam, FA[n], (' ' + extra) if extra else '')


def brand(name):
    return '<i class="fa-brands fa-%s ico" aria-hidden="true"></i>' % BRANDS[name]


LANGS = [('en', 'English'), ('fr', 'Français'), ('de', 'Deutsch'), ('es', 'Español'), ('es-MX', 'Español (México)'), ('it', 'Italiano'), ('pt', 'Português'), ('pt-BR', 'Português (Brasil)'), ('ru', 'Русский'), ('zh', '简体中文'), ('zh-TW', '繁體中文'), ('ja', '日本語'), ('ko', '한국어'), ('th', 'ไทย'), ('hi', 'हिन्दी'), ('id', 'Bahasa Indonesia'), ('tl', 'Tagalog'), ('vi', 'Tiếng Việt'), ('pl', 'Polski'), ('tr', 'Türkçe'), ('ar', 'العربية')]
NAV = [('home', '/', 'nav.home', 'home'), ('features', '/features/', 'nav.features', 'grid'), ('downloads', '/downloads/', 'nav.downloads', 'down'), ('community', '/community/', 'nav.community', 'users'), ('docs', '/docs/', 'nav.help', 'book'), ('donate', '/donate/', 'nav.donate', 'heart')]
MORE = [('docs', '/docs/', 'nav.help', 'Install, config, troubleshoot'), ('mods', '/mods/', 'nav.mods', '37+ modules'), ('gallery', '/gallery/', 'nav.gallery', 'Screenshots'), ('faq', '/faq/', 'nav.faq', 'Common questions'), ('donate', '/donate/', 'nav.donate', 'Support Glacier'), ('mediakit', '/mediakit/', None, 'Media kit')]
SOCIAL = [('Discord', DISCORD), ('GitHub', 'https://github.com/Glacier-Client-BE'), ('YouTube', 'https://youtube.com/@glacierclient'), ('X', 'https://x.com/glacierclientbe'), ('Instagram', 'https://www.instagram.com/glacierclientmcbe'), ('TikTok', 'https://www.tiktok.com/@glacierclientmcbe')]
SEARCH = []


def socials():
    return ''.join('<a href="%s" target="_blank" rel="noopener" aria-label="%s" title="%s">%s<span>%s</span></a>' % (u, n, n, brand(n), n) for n, u in SOCIAL)


def head_scripts():
    return ('<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=%s" crossorigin="anonymous"></script>\n'
            '<script src="https://publisher.linkvertise.com/cdn/linkvertise.js" defer></script>\n'
            '<script data-cfasync="false" src="//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1732675"></script>\n'
            '<script>\n  // linkvertise.js is deferred; ad blockers may block it entirely, so guard the call.\n'
            "  document.addEventListener('DOMContentLoaded', function () {\n    if (typeof linkvertise === 'function') { linkvertise(499358, { whitelist: [\"github.com\"], blacklist: [] }); }\n  });\n</script>\n") % AD_CLIENT


def ad(slot, cls=''):
    return '<div class="ad %s"><div class="ad-in"><small>Advertisement</small><ins class="adsbygoogle" style="display:block" data-ad-client="%s" data-ad-slot="%s" data-ad-format="auto" data-full-width-responsive="true"></ins></div></div>' % (cls, AD_CLIENT, slot)


def adw(slot):
    return '<div class="wrap ad-wrap">%s</div>' % ad(slot)


NAV_TOP = NAV


def header(sec):
    nav = ''.join('<a data-nav="%s" href="%s"%s %s>%s%s</a>' % (k, h, ' class="give"' if k == 'donate' else '', ta(t), ic('heart') if k == 'donate' else '', tx(t)) for k, h, t, _ in NAV_TOP)
    langs = ''.join('<button type="button" data-value="%s">%s</button>' % (c, esc(n)) for c, n in LANGS)
    opts = ''.join('<option value="%s">%s</option>' % (c, esc(n)) for c, n in LANGS)
    mnav = ''.join('<a data-nav="%s" href="%s"%s>%s<span class="mt" %s>%s</span><small>%02d</small></a>' % (k, h, ' class="give"' if k == 'donate' else '', ic(icn), ta(t), tx(t), i + 1) for i, (k, h, t, icn) in enumerate(NAV))
    soc = socials()
    return f"""<div class="ann" id="ann" role="status"><span id="annText"></span><a href="/downloads/">{tx('btn.download')} {ic('arrow')}</a><button class="ib" id="annClose" type="button" aria-label="{tx('toast.dismiss')}" data-i18n-aria="toast.dismiss">{ic('x')}</button></div>
<header class="site-h"><div class="wrap bar">
<a class="brand" href="/"><img src="/assets/logo.png" alt="" width="32" height="32"><span>Glacier</span><span class="ver" data-latest>{esc(LATEST['version'].replace('Glacier ', ''))}</span></a>
<nav class="nav" aria-label="Primary">{nav}</nav>
<div class="tools">
<button class="ib" type="button" data-cmdk aria-label="Search (Ctrl+K)" title="Search (Ctrl+K)">{ic('search')}</button>
<div class="lang hide-m" id="lang"><button class="ib" id="langBtn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Language">{ic('globe')}<span id="currentLangLabel" class="vh">English</span></button><div class="lang-menu" id="langMenu" role="menu">{langs}</div></div>
<button class="ib hide-m" id="themeToggle" type="button" aria-label="Toggle theme">{ic('sun')}</button>
<a class="btn p sm hide-m" href="/downloads/#launcher">{ic('down')}<span>Get the launcher</span></a>
<button class="ib burger" id="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="menu">{ic('menu')}</button>
</div></div></header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu">
<div class="menu-top"><a class="brand" href="/"><img src="/assets/logo.png" alt="" width="32" height="32"><span>Glacier</span></a><button class="ib" type="button" data-menu-close aria-label="Close menu">{ic('x')}</button></div>
<nav aria-label="Menu">{mnav}</nav>
<div class="menu-promo"><b>Get the launcher</b><p>Install and launch Glacier on Windows, with the config editor, themes and auto-updates built in.</p><a class="btn p lg" href="/downloads/#launcher">{ic('down')}<span>Download for Windows</span></a></div>
<div class="menu-foot"><select class="search" id="langSel" style="width:auto;padding-left:16px;background-image:none" aria-label="Language">{opts}</select><button class="btn g sm" id="themeToggle2" type="button">Theme</button><div class="fsoc">{soc}</div></div>
</div>"""


def footer():
    soc = socials()

    def col(t, links):
        return '<div class="fcol"><b %s>%s</b>%s</div>' % (ta(t), tx(t), ''.join(links))

    a = lambda h, label, key=None, cls='': '<a%s href="%s"%s>%s</a>' % ((' class="%s"' % cls) if cls else '', h, (' ' + ta(key)) if key else '', tx(key) if key else label)
    return f"""<footer class="site-f"><div class="wrap">
<div class="fgrid">
<div class="fbrand"><a class="brand" href="/"><span>Glacier Client</span></a><p {ta('footer.blurb')}>{tx('footer.blurb')}</p><span><i class="dot"></i><span data-discord-online>0</span> <span {ta('footer.onlineDiscord')}>{tx('footer.onlineDiscord')}</span></span><div class="fsoc">{soc}</div></div>
{col('footer.product', [a('/features/', '', 'nav.features'), a('/mods/', '', 'nav.mods'), a('/gallery/', '', 'nav.gallery'), a('/downloads/', '', 'nav.downloads')])}
{col('footer.resources', [a('/docs/', '', 'docs.title'), a('/faq/', '', 'nav.faq'), a('/best-bedrock-client/', 'Best Bedrock Client'), a('/mediakit/', 'Media Kit')])}
{col('footer.community', [a('/community/#showcases', 'Showcases'), a(DISCORD, 'Discord Server'), a('/donate/', '', 'nav.donate', 'give')])}
{col('legal.license', [a('/license/', '', 'legal.license'), a('/tos/', '', 'legal.tos'), a('/privacy/', '', 'legal.privacy')]).replace('<b data-i18n="legal.license">License</b>', '<b ' + ta('footer.legal') + '>' + tx('footer.legal') + '</b>')}
</div>
<div class="fcopy">&copy; {YEAR} Glacier Productions. <span {ta('footer.notAffiliated')}>{tx('footer.notAffiliated')}</span></div>
</div></footer>"""


def dock(sec):
    return f"""<button class="totop" type="button" aria-label="Back to top">{ic('up')}</button>
<dialog class="cmdk" id="cmdk" aria-label="Search the site"><div class="ck"><input id="ckIn" type="search" placeholder="{esc(EN['search.placeholder'])}" data-i18n-ph="search.placeholder" autocomplete="off" aria-label="Search"><ul id="ckList"></ul><p class="ck-h">{tx('search.foot.move')}: up / down. {tx('search.foot.open')}: Enter. {tx('search.foot.close')}: Esc</p></div></dialog>"""


def page(path, key, body, sec, desc=None, extra_head='', og_type='website', noindex=False, title=None):
    title = title or META['titles'].get(key, 'Glacier Client')
    desc = desc or META['meta'].get(key, '')
    url = SITE + path
    preload = '<link rel="preload" as="image" href="/assets/mod_menu.webp" fetchpriority="high">\n' if path == '/' else ''
    ld = ('<script type="application/ld+json">%s</script>\n' % LD) if path == '/' else ''
    SEARCH_PAGES.append((path, title))
    return f'''<!DOCTYPE html>
<html lang="en" data-theme="dark" class="nojs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="site-build" content="{VERSION}">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{url}">
{'<meta name="robots" content="noindex">' if noindex else ''}
<meta name="theme-color" content="#0a0b14">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:type" content="{og_type}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/assets/og-image.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="/assets/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="font" type="font/ttf" href="/assets/Inter_Medium.ttf" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700&amp;display=swap" rel="stylesheet">
{preload}<script>try{{var t=localStorage.getItem('gc-theme');if(t)document.documentElement.setAttribute('data-theme',t)}}catch(e){{}}</script>
<link rel="preload" as="font" type="font/woff2" href="/assets/fa/webfonts/fa-solid-900.woff2" crossorigin>
<link rel="stylesheet" href="/assets/fa/css/all.min.css">
<link rel="stylesheet" href="/css/site.css?v={VERSION}">
<script type="module" src="/js/site.js?v={VERSION}"></script>
{head_scripts()}{ld}</head>
<body data-sec="{sec}">
<a class="skip" href="#main" {ta('a11y.skip')}>{tx('a11y.skip')}</a>
{header(sec)}
<main id="main">
{body}
</main>
{footer()}
{dock(sec)}
</body>
</html>
'''


SEARCH_PAGES = []


def page_head(eyebrow, h1, sub, crumb=None, h1_attrs='', sub_attrs=''):
    cr = ''
    if crumb:
        cr = '<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Glacier</a><span aria-hidden="true">/</span><span aria-current="page">%s</span></nav>' % crumb
    return f'<div class="wrap"><div class="page-h">{cr}<span class="lbl">{eyebrow}</span><h1 {h1_attrs}>{h1}</h1>{("<p class=sub %s>%s</p>" % (sub_attrs, sub)) if sub else ""}</div></div>'


# ------------------------------------------------------------------ home
def mod_title(m):
    return EN[m['titleKey']]


def mod_desc(m):
    return EN[m['descKey']]


def mod_tile(m, fav=False):
    cats = ' '.join(m['categories'])
    tags = ' · '.join(tx(t) for t in m['tags'])
    q = esc((mod_title(m) + ' ' + mod_desc(m) + ' ' + cats).lower())
    star = '<button class="fav" type="button" aria-label="Favorite" aria-pressed="false">%s</button>' % ic('star') if fav else ''
    return (f'<article class="mod" data-id="{m["id"]}" data-cats="{cats}" data-q="{q}"><span class="ico-box"><img src="/{m["icon"]}" alt="" width="36" height="36" loading="lazy"></span>'
            f'<span><b {ta(m["titleKey"])}>{tx(m["titleKey"])}</b><small {ta(m["descKey"])}>{tx(m["descKey"])}</small></span>{star}</article>')


def faq_item(f, num=None):
    q = re.sub(r'<[^>]+>', ' ', f['question'] + ' ' + f['answer']).lower()
    qk = 'faqq.' + f['id']
    label = ('<span data-i18n="%s">%s</span>' % (qk, esc(f['question']))) if qk in EN else '<span>%s</span>' % esc(f['question'])
    return '<details class="acc faq-item" id="%s" data-cat="%s" data-q="%s"><summary>%s%s</summary><div class="body" data-i18n-html="faqa.%s">%s</div></details>' % (f['id'], esc(f['category']), esc(q), label, ic('chev'), f['id'], f['answer'])


SCREENS = [('modMenu', '/assets/mod_menu.webp', 1110, 659), ('startScreen', '/assets/start_screen.webp', 1915, 1077), ('pauseScreen', '/assets/pause_screen.webp', 1920, 1080)]
WIN_LABEL = {'modMenu': 'showcase.tabs.modMenu', 'startScreen': 'showcase.tabs.startScreen', 'pauseScreen': 'showcase.tabs.pauseScreen'}


def launcher_btn(cls='p'):
    return '<a class="btn %s two" href="/downloads/#launcher"><span>%s Download for Windows</span><small>Launcher <span data-lv>v2.0.1</span> · <span data-ls>6.8 MB</span></small></a>' % (cls, ic('windows'))


def yt(v, title, big=True):
    return ('<div class="yt%s" data-yt="%s" data-title="%s"><img src="https://i.ytimg.com/vi/%s/%s.jpg" alt="" width="%d" height="%d" loading="lazy">'
            '<button type="button" class="yt-play" aria-label="Play: %s"><i class="fa-solid fa-play" aria-hidden="true"></i></button></div>') % (' big' if big else '', v, esc(title), v, 'hqdefault', 480, 360, esc(title))


def vid(src, cls='', poster='/assets/mod_menu.webp', controls=False):
    return '<video class="%s" muted playsinline preload="metadata" poster="%s" width="1280" height="720" data-play%s><source src="%s" type="video/mp4"></video>' % (cls, poster, ' controls' if controls else '', src)


def hero():
    title = tx('hero.title').replace('texture pack', '<em>texture pack</em>')
    imgs = vid('/assets/hero-tour.mp4', 'on') + ''.join('<img src="%s" alt="" width="%d" height="%d" loading="lazy">' % (src, w, h) for (k, src, w, h) in SCREENS)
    tabs = '<button type="button" role="tab" aria-selected="true">%s Tour</button>' % ic('film') + ''.join('<button type="button" role="tab" aria-selected="false" %s>%s</button>' % (ta(WIN_LABEL[k]), tx(WIN_LABEL[k])) for (k, *_r) in SCREENS)
    chips = ''.join('<span class="chip">%s</span>' % m['name'] for m in [{'name': mod_title(x)} for x in MODS[:16]])
    return f"""<section class="hero2" id="top"><div class="wrap">
<div class="hero-t">
<div class="chips-row"><span class="chip ok"><span {ta('hero.free')}>{tx('hero.free')}</span> <span {ta('hero.forever')}>{tx('hero.forever')}</span></span><span class="chip">{ic('mobile')} Mobile</span><span class="chip">{ic('desktop')} PC</span><span class="chip">{ic('gamepad')} Console</span></div>
<h1 {ta('hero.title')}>{title}</h1>
<p class="lead" {ta('hero.subtitle')}>{tx('hero.subtitle')}</p>
<div class="cta">{launcher_btn('p')}<a class="btn g lg" href="/downloads/#pack">{ic('mobile')}<span>Get the pack</span></a></div>
<p class="plat" id="plat" hidden></p>
<span class="live"><i></i><span data-discord-online>0</span> <span {ta('hero.online')}>{tx('hero.online')}</span></span>
</div>
<div class="stage-win logo-stage"><div class="bear-wrap hbear" aria-hidden="true"><div class="bear-box"></div><img class="bear-fall" src="/assets/logo.png" alt="" width="420" height="420"></div></div>
</div></section>
<div class="wrap"><div class="strip">
<div>{ic('down','st')}<b data-total-dl>0</b><span {ta('hero.downloads')}>{tx('hero.downloads')}</span></div>
<div>{ic('cubes','st')}<b>37+</b><span {ta('hero.modules')}>{tx('hero.modules')}</span></div>
<div>{ic('feather','st')}<b data-pack-size>{esc(LATEST['size'])}</b><span {ta('hero.packSize')}>{tx('hero.packSize')}</span></div>
<div>{brand('Discord').replace('ico','ico st')}<b><span data-discord-online>0</span></b><span {ta('hero.online')}>{tx('hero.online')}</span></div>
</div></div>
<div class="marq" aria-hidden="true"><div class="marq-t">{chips}{chips}</div></div>"""


def peek():
    pts = [('bolt', 'Zero performance cost', 'Built as a resource pack, so there is no injector and no lag.'), ('cubes', '37+ modules in one menu', 'Toggle, drag and resize every HUD element in game.'), ('shield', 'Ban-safe by design', 'Only the resource pack system. Nothing touches game memory.')]
    li = ''.join('<li><span class="pi">%s</span><span><b>%s</b><small>%s</small></span></li>' % (ic(i), t, d) for i, t, d in pts)
    return f"""<section class="peek" id="peek"><div class="wrap"><div class="peek-in">
<div class="peek-t rv"><span class="lbl">{ic('film')} A peek inside</span><h2>See Glacier in motion.</h2><p class="lead">A quick look at the mod menu, the draggable HUD and the screens you get on day one.</p><ul class="plist">{li}</ul></div>
<div class="peek-v rv"><div class="win"><div class="win-bar"><i></i><i></i><i></i><span>Minecraft Bedrock · Glacier</span></div><div class="win-view">{vid('/assets/peek-inside.mp4', 'on')}{vid('/assets/hero-tour.mp4')}</div><div class="win-tabs" role="tablist" aria-label="Videos"><button type="button" role="tab" aria-selected="true">{ic('film')} Peek inside</button><button type="button" role="tab" aria-selected="false">{ic('play')} Tour</button></div></div></div>
</div></div></section>"""


def watch():
    t = SHOWS[0]
    side = ''.join('<a class="srow" href="https://www.youtube.com/watch?v=%s" target="_blank" rel="noopener"><span class="thumb"><img src="https://i.ytimg.com/vi/%s/mqdefault.jpg" alt="" width="320" height="180" loading="lazy"><i class="fa-solid fa-play" aria-hidden="true"></i></span><span><b>%s</b><small>%s · %s</small></span></a>' % (v, v, esc(tt), esc(c), v_) for v, tt, c, v_ in SHOWS[1:4])
    return f"""<section class="watch" id="watch"><div class="wrap"><div class="sec-h row rv"><div style="display:flex;flex-direction:column;gap:14px"><span class="lbl">{brand('YouTube')} Watch</span><h2>Teaser and creator showcases</h2></div><a class="btn g sm" href="/community/#showcases"><span>All videos</span>{ic('arrow')}</a></div>
<div class="watch-g rv"><div class="yt-wrap">{yt(t[0], t[1])}<p class="yt-cap"><span class="chip">{ic('video')} Official teaser</span><b>{esc(t[1])}</b></p></div><div class="side">{side}</div></div></div></section>"""


def explorer():
    items = [('feat.modules', 'feat.modules.title', 'feat.modules.desc', '/assets/mod_menu.webp', 1110, 659), ('feat.draggable', 'feat.draggable.title', 'feat.draggable.desc', '/assets/pause_screen.webp', 1920, 1080), ('showcase.startScreen', 'showcase.startScreen.heading', 'showcase.startScreen.body', '/assets/start_screen.webp', 1915, 1077)]
    xi = ['cubes', 'sliders', 'image']
    tabs = ''.join('<button class="xp-tab" type="button" role="tab" aria-selected="%s"><b>%s<span %s>%s</span></b><p %s>%s</p></button>' % ('true' if i == 0 else 'false', ic(xi[i]), ta(t), tx(t), ta(d), tx(d)) for i, (_, t, d, *_r) in enumerate(items))
    imgs = ''.join('<img %ssrc="%s" alt="" width="%d" height="%d" loading="lazy">' % ('class="on" ' if i == 0 else '', src, w, h) for i, (_, _t, _d, src, w, h) in enumerate(items))
    return f"""<section id="features"><div class="wrap"><div class="sec-h rv"><span class="lbl" {ta('nav.features')}>{tx('nav.features')}</span><h2 {ta('core.title')}>{tx('core.title')}</h2><p class="sub" {ta('core.sub')}>{tx('core.sub')}</p></div>
<div class="xp rv"><div class="xp-tabs" role="tablist" aria-label="{esc(EN['core.title'])}">{tabs}</div><div class="xp-view">{imgs}</div></div></div></section>"""


def lband():
    sw = ''.join('<button type="button" data-c="%s" aria-pressed="%s" style="background:%s" aria-label="Theme %s"></button>' % (c, 'true' if i == 0 else 'false', c, c) for i, c in enumerate(['#7289da', '#8ea0e0', '#4559b0', '#5b6fb8', '#aab6ec']))
    return f"""<section class="lband" id="launcher"><div class="wrap">
<div class="rv" style="display:flex;flex-direction:column;gap:22px"><span class="lbl">Glacier Launcher · Windows</span><h2>Skip the setup. Launch Glacier.</h2><p class="lead">Install and launch Glacier on Windows, with the config editor, themes and auto-updates built in.</p>
<ul class="checks"><li>{ic('gear')}Config Editor, built in</li><li>{ic('palette')}Custom themes</li><li>{ic('rotate')}Auto-updates, always the latest</li></ul>
<div class="btns" style="margin-top:6px">{launcher_btn('p')}<a class="btn g lg" href="/downloads/#launcher">{ic('book')}<span>All launcher versions</span></a></div></div>
<div class="rv lstage"><div class="yt-wrap">{yt('Xa2ndRECHo0', 'Glacier Launcher v2 | Official Trailer')}<p class="yt-cap"><span class="chip">{ic('film')} Launcher v2 trailer</span><b>Glacier Launcher v2 | Official Trailer</b></p></div></div>
</div></section>"""


def rail():
    tiles = ''.join(mod_tile(m) for m in MODS[:14])
    return f"""<section><div class="wrap"><div class="sec-h row rv"><div style="display:flex;flex-direction:column;gap:14px"><span class="lbl" {ta('mods.title')}>{tx('mods.title')}</span><h2>37+ modules, one menu</h2></div><div class="rail-btns"><button class="ib" type="button" data-rail="prev" aria-label="Previous">{ic('chevl')}</button><button class="ib" type="button" data-rail="next" aria-label="Next">{ic('chev')}</button><a class="btn g sm" href="/mods/"><span {ta('nav.mods')}>{tx('nav.mods')}</span></a></div></div><div class="rail">{tiles}</div></div></section>"""


def support():
    return f"""<section><div class="wrap"><div class="support rv"><div style="display:flex;flex-direction:column;gap:14px"><span class="lbl">{ic('heart')} {tx('nav.donate')}</span><h2>Glacier stays free. Help keep it that way.</h2><p class="lead" {ta('donate.toastText')}>{tx('donate.toastText')}</p></div><div style="display:flex;flex-direction:column;gap:12px"><a class="btn p lg" href="https://paypal.me/PepeOnPayPal" target="_blank" rel="noopener">{brand('paypal')}<span {ta('donate.paypal.btn')}>{tx('donate.paypal.btn')}</span></a><a class="btn g lg" href="https://ko-fi.com/pepeonkofi" target="_blank" rel="noopener">{ic('coffee')}<span {ta('donate.kofi.btn')}>{tx('donate.kofi.btn')}</span></a><a class="lnk" href="/donate/">More ways to help {ic('chev')}</a></div></div></div></section>"""


def home():
    faq3 = ''.join(faq_item(f) for f in FAQ[:3])
    body = f"""{hero()}
{explorer()}
{peek()}
{lband()}
{adw(AD['home'])}
{rail()}
{watch()}
<section><div class="wrap"><div class="card rv discord-strip"><div style="display:flex;flex-direction:column;gap:6px"><span class="lbl"><i class="dot"></i><span data-discord-online>0</span> <span {ta('hero.online')}>{tx('hero.online')}</span></span><h3 {ta('community.joinDiscord')}>{tx('community.joinDiscord')}</h3><p {ta('community.joinDesc')}>{tx('community.joinDesc')}</p></div><a class="btn p lg" href="{DISCORD}" target="_blank" rel="noopener">{brand('Discord')}<span {ta('btn.joinDiscord')}>{tx('btn.joinDiscord')}</span></a></div></div></section>
{support()}
<section><div class="wrap"><div class="grid" style="gap:32px"><div class="sec-h" style="margin:0"><span class="lbl" {ta('nav.faq')}>{tx('nav.faq')}</span><h2 {ta('faq.title')}>{tx('faq.title')}</h2></div><div class="card list rv">{faq3}</div><p><a class="btn g" href="/faq/"><span {ta('faq.allQuestions')}>{tx('faq.allQuestions')}</span>{ic('arrow')}</a></p></div></div></section>
{adw(AD['docs'])}
<section class="cta-band"><div class="wrap rv"><span class="lbl">Free, and playing in three minutes</span><h2 style="margin-top:12px">Get Glacier now.</h2><div class="btns">{launcher_btn('p')}<a class="btn g lg" href="/downloads/#pack">{ic('mobile')}<span>Get the pack</span></a></div></div></section>"""
    return page('/', 'home', body, 'home')


def features():
    rows = [('01', 'feat.modules.title', 'feat.modules.desc', '/assets/mod_menu.webp', 1110, 659), ('02', 'feat.draggable.title', 'feat.draggable.desc', '/assets/pause_screen.webp', 1920, 1080), ('03', 'showcase.startScreen.heading', 'showcase.startScreen.body', '/assets/start_screen.webp', 1915, 1077)]
    zz = ''.join(f'<div class="zz-row{" flip" if i % 2 else ""} rv"><div class="zz-t" style="display:flex;flex-direction:column;gap:14px"><span class="num">{n}</span><h3 {ta(t)}>{tx(t)}</h3><p {ta(d)}>{tx(d)}</p></div><div class="zz-img"><img src="{src}" alt="" width="{w}" height="{h}" loading="lazy"></div></div>' for i, (n, t, d, src, w, h) in enumerate(rows))
    trio = f'<div class="trio rv"><div><span class="ti">{ic('gear')}</span><span class="tag">Launcher only</span><h3>Config Editor</h3><p>Built-in configuration editor that allows you to customize every aspect of your client experience.</p></div><div><span class="ti">{ic('palette')}</span><span class="tag">Launcher only</span><h3>Custom Themes</h3><p>Multiple theme options to personalize the look and feel of your client interface.</p></div><div><span class="ti">{ic('rotate')}</span><span class="tag">Launcher only</span><h3>Auto-Updates</h3><p>Automatic update system that ensures you always have the latest features and bug fixes.</p></div></div>'
    body = f"""{page_head(tx('nav.features'), tx('core.title'), tx('core.sub'), tx('nav.features'), ta('core.title'), ta('core.sub'))}
<div class="wrap"><div class="zz">{zz}</div></div>
<section><div class="wrap"><div class="sec-h rv"><span class="lbl">Glacier Launcher</span><h2>Get more with the launcher</h2></div>{trio}<p class="btns" style="margin-top:24px;max-width:420px">{launcher_btn('p')}</p></div></section>
{adw(AD['features'])}
<section style="padding-top:24px"><div class="wrap"><div class="card rv" style="flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;padding:28px"><div><h3 {ta('feat.lightweight.title')}>{tx('feat.lightweight.title')}</h3><p {ta('feat.lightweight.desc')}>{tx('feat.lightweight.desc')}</p></div><div class="btns"><a class="btn p" href="/mods/"><span {ta('nav.mods')}>{tx('nav.mods')}</span>{ic('arrow')}</a><a class="btn g" href="{CONFIG}" target="_blank" rel="noopener"><span {ta('hero.config')}>{tx('hero.config')}</span></a></div></div></div></section>"""
    return page('/features/', 'features', body, 'features')


def mods_page():
    cats = [('all', 'mods.filter.all'), ('hud', 'mods.filter.hud'), ('cosmetic', 'mods.filter.cosmetic'), ('pvp', 'mods.filter.pvp'), ('utility', 'mods.filter.utility'), ('visual', 'mods.filter.visual'), ('fav', 'mods.filter.favorites')]
    count = lambda c: len(MODS) if c == 'all' else (sum(1 for m in MODS if c in m['categories']) if c != 'fav' else 0)
    chips = ''.join('<button class="chip" type="button" data-cat="%s" aria-pressed="%s"><span %s>%s</span>%s</button>' % (c, 'true' if c == 'all' else 'false', ta(k), tx(k), ('<small>%d</small>' % count(c)) if c != 'fav' else '') for c, k in cats)
    tiles = ''.join(mod_tile(m, True) for m in MODS)
    body = f"""{page_head(tx('nav.features'), tx('mods.title'), tx('mods.sub'), tx('nav.mods'), ta('mods.title'), ta('mods.sub'))}
<div class="wrap"><div class="mlayout"><aside class="mside"><input class="search" id="modQ" type="search" placeholder="{esc(EN['search.placeholder'].split(',')[0])}" autocomplete="off" aria-label="Search mods"><div class="mcats" role="group" aria-label="{esc(EN['mods.filter'])}">{chips}</div><span class="mcount"><span id="modCount">{len(MODS)}</span> / {len(MODS)}</span></aside>
<div><div class="mods" id="mods">{tiles}</div><p class="empty" id="modEmpty" {ta('mods.empty')}>{tx('mods.empty')}</p></div></div></div>
{adw(AD['features'])}"""
    for m in MODS:
        SEARCH.append({'t': mod_title(m), 'd': 'Mod · ' + ' · '.join(EN[t] for t in m['tags']), 'u': '/mods/?q=' + mod_title(m).replace(' ', '+'), 'k': mod_desc(m)})
    return page('/mods/', 'mods', body, 'features')


def gallery():
    items = [('modMenu', '/assets/mod_menu.webp', 1110, 659), ('startScreen', '/assets/start_screen.webp', 1915, 1077), ('pauseScreen', '/assets/pause_screen.webp', 1920, 1080)]
    cards = ''.join(f'<button class="card h gal-i rv" type="button" data-zoom="{s}" data-alt="{esc(EN["gallery." + k + ".title"])}"><img src="{s}" alt="{esc(EN["gallery." + k + ".title"])}" width="{w}" height="{h}" loading="lazy"><b {ta("gallery." + k + ".title")}>{tx("gallery." + k + ".title")}</b><small class="mut" {ta("gallery." + k + ".desc")}>{tx("gallery." + k + ".desc")}</small></button>' for k, s, w, h in items)
    body = f'''{page_head(tx('nav.features'), tx('gallery.title'), tx('gallery.sub'), tx('nav.gallery'), ta('gallery.title'), ta('gallery.sub'))}
<div class="wrap"><div class="gal">{cards}</div></div><div style="height:64px"></div>
<dialog class="lb" id="lightbox" aria-label="Screenshot"><button class="ib" type="button" data-close aria-label="Close">{ic('x')}</button><img alt="" src=""></dialog>'''
    return page('/gallery/', 'gallery', body, 'features')


def downloads():
    ex = LATEST
    pack_fb = f'<article class="card rel"><div class="head"><span class="lbl"><i class="dot"></i>{tx("dl.tagLatest")}</span><span class="tag">{esc(ex["release"])} · {esc(ex["size"])}</span></div><h3 class="v">{esc(ex["version"])}</h3><div class="btns"><a class="btn p" href="{DISCORD}">Discord</a></div></article>'
    choose = f"""<nav class="choose" aria-label="Downloads"><a class="rec" href="#launcher"><span>Launcher for Windows</span><small>Recommended</small></a><a href="#pack"><span>Pack for Mobile and Console</span><small>.mcpack</small></a><a href="#dev"><span>In development</span><small>DLL, Java</small></a>{ad(AD['downloads'])}</nav>"""
    body = f"""{page_head(tx('nav.downloads'), 'Download Glacier', 'Windows players get the launcher. Mobile and Console players import the pack like any resource pack.', tx('nav.downloads'))}
<div class="wrap"><div class="dlayout">{choose}
<div>
<section class="dsec" id="launcher" style="padding:0"><h2>Glacier Launcher</h2><div id="launcherPanel"><p class="mut" {ta('dl.loadingLauncher')}>{tx('dl.loadingLauncher')}</p><p><a class="btn p" href="https://github.com/Glacier-Client-BE/Glacier-Launcher/releases">GitHub releases</a></p></div></section>
<section class="dsec" id="pack" style="padding:0"><h2>The pack</h2><div id="packPanel">{pack_fb}</div></section>
<section class="dsec" id="dev" style="padding:0"><h2>In development</h2><div class="grid c2"><article class="card rel"><span class="lbl"><i class="dot warn"></i>In development</span><h3 class="v" style="font-size:26px" {ta('dl.dll.title')}>{tx('dl.dll.title')}</h3><p {ta('dl.dll.desc')}>{tx('dl.dll.desc')}</p><div class="btns"><a class="btn g" href="{DISCORD}" target="_blank" rel="noopener">{tx('btn.joinDiscord')}</a></div></article><article class="card rel"><span class="lbl"><i class="dot warn"></i>In development</span><h3 class="v" style="font-size:26px" {ta('dl.java.title')}>{tx('dl.java.title')}</h3><p {ta('dl.java.desc')}>{tx('dl.java.desc')}</p><div class="btns"><a class="btn g" href="{DISCORD}" target="_blank" rel="noopener">{tx('btn.joinDiscord')}</a></div></article></div></section>
<div class="card" style="margin-top:48px"><span class="lbl" {ta('docs.install.title')}>{tx('docs.install.title')}</span><ol class="steps"><li {ta('docs.install.s1')}>{tx('docs.install.s1')}</li><li {ta('docs.install.s2')}>{tx('docs.install.s2')}</li><li {ta('docs.install.s3')}>{tx('docs.install.s3')}</li></ol><p class="mut" style="font-size:14.5px">{th('docs.install.faqLink')}</p></div>
<div class="support rv" style="margin-top:32px;padding:28px"><div><span class="lbl">{ic('heart')} {tx('nav.donate')}</span><h3 style="font-size:28px;margin-top:6px">Enjoying Glacier?</h3><p class="mut" {ta('donate.toastText')}>{tx('donate.toastText')}</p></div><div><a class="btn amber" href="/donate/">{tx('nav.donate')}</a></div></div>
</div></div></div><div style="height:48px"></div>"""
    SEARCH.append({'t': 'Downloads', 'd': 'Page · Latest ' + LATEST['version'], 'u': '/downloads/', 'k': 'download install mcpack launcher'})
    return page('/downloads/', 'downloads', body, 'downloads')


SHOWS = [('vkaY68eebOA', 'Glacier v7 Official Teaser | MCBE/PE v26+ | Coming Soon!', 'Glacier Productions', '1.8K views'), ('ocWqAqCTILY', 'The NEW King of Minecraft Bedrock Clients?', 'PatarHD', '15K views'), ('aHUHPdzQ6-Y', 'The BEST Minecraft Bedrock Client! [MOBILE TOO]', 'Apup', '23K views'), ('3McOOk1c7xI', 'Glacier Client || Best Client For Minecraft Pocket Edition (26.0+) MCPE', 'FlareRite', '2.2K views'), ('9AONoKL11YE', 'Glacier Client V5 For MCPE 1.21+ ( Mod Menu, FPS Boost) No lag', 'BRAVE SHAHEEN YT', '7.6K views'), ('LhOfcg1zi_0', 'NEW Minecraft Bedrock Launcher JUST Dropped [Mobile Support]', 'Apup', '17K views')]
SHOWS.append(('Xa2ndRECHo0', 'Glacier Launcher v2 | Official Trailer', 'Glacier Productions', 'Official trailer'))


def community():
    order = [SHOWS[2]] + [x for x in SHOWS[1:] if x is not SHOWS[2]]
    shows = ''.join(f'<a class="card h show rv{" big" if i == 0 else ""}" href="https://www.youtube.com/watch?v={v}" target="_blank" rel="noopener"><span class="thumb"><img src="https://i.ytimg.com/vi/{v}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy"><i class="fa-solid fa-play" aria-hidden="true"></i></span><b>{esc(t)}</b><small>{esc(c)} · {v_}</small></a>' for i, (v, t, c, v_) in enumerate(order))
    soc = socials()
    lis = ''.join('<li %s>%s</li>' % (ta(k), tx(k)) for k in ('community.li1', 'community.li2', 'community.li3', 'community.li4'))
    body = f"""<div class="wrap"><div class="clayout" style="padding-top:56px">
<aside class="card dpanel"><span class="lbl"><i class="dot"></i><span data-discord-online>0</span> <span {ta('hero.online')}>{tx('hero.online')}</span></span><h1 {ta('community.joinDiscord')}>{tx('community.joinDiscord')}</h1><p class="sub" {ta('community.joinDesc')}>{tx('community.joinDesc')}</p><ul class="checks">{lis}</ul><div class="btns"><a class="btn p lg" href="{DISCORD}" target="_blank" rel="noopener">{brand('Discord')}<span {ta('btn.joinDiscord')}>{tx('btn.joinDiscord')}</span></a></div></aside>
<div id="showcases"><div class="yt-wrap" style="margin-bottom:24px">{yt(SHOWS[0][0], SHOWS[0][1])}<p class="yt-cap"><span class="chip">{ic('video')} Official teaser</span><b>{esc(SHOWS[0][1])}</b></p></div><div class="sec-h"><span class="lbl">{brand('YouTube')} Community</span><h2>Community Showcases</h2><p class="sub">See what creators in the Minecraft Bedrock community are saying about Glacier Client</p></div><div class="shows">{shows}</div></div>
</div></div>
{adw(AD['community'])}
<section style="padding-top:0"><div class="wrap"><div class="sec-h rv"><span class="lbl">Follow</span><h2>Follow Us</h2></div><div class="socials">{soc}</div></div></section>"""
    return page('/community/', 'community', body, 'community')


def docs():
    rows = [('Official Release (Mobile / PC)', 'Supported', 'ok', 'Recommended, always up to date'), ('Xbox &amp; PlayStation', 'Supported', 'ok', 'Via Realms'), ('Preview / Beta builds', 'Partial', 'part', 'Mojang changes core UI often'), ('Minecraft Java Edition', 'In development', '', 'Follow Discord for progress')]
    trs = ''.join('<div class="tr"><span>%s</span><span class="%s">%s</span><span class="mut">%s</span></div>' % (n, c, st, nt) for n, st, c, nt in rows)
    table = '<div class="table"><div class="tr th"><span %s>%s</span><span %s>%s</span><span %s>%s</span></div>%s</div>' % (ta('docs.versions.col.platform'), tx('docs.versions.col.platform'), ta('docs.versions.col.status'), tx('docs.versions.col.status'), ta('docs.versions.col.notes'), tx('docs.versions.col.notes'), trs)
    toc = ''.join('<a href="#%s" %s>%s</a>' % (i, ta(k), tx(k)) for i, k in (('installation', 'docs.toc.install'), ('configuration', 'docs.toc.config'), ('versions', 'docs.toc.versions'), ('troubleshooting', 'docs.toc.troubleshoot'), ('faq', 'nav.faq')))
    body = f'''{page_head(tx('nav.help'), tx('docs.title'), 'Everything you need to install, configure, and troubleshoot Glacier Client in one place', tx('nav.help'), ta('docs.title'))}
<div class="wrap"><p class="btns" style="max-width:360px;margin-bottom:32px"><a class="btn p" href="{CONFIG}" target="_blank" rel="noopener"><span {ta('hero.config')}>{tx('hero.config')}</span></a><a class="btn g" href="{DISCORD}" target="_blank" rel="noopener" {ta('btn.joinDiscord')}>{tx('btn.joinDiscord')}</a></p>
<div class="doc"><nav class="toc" aria-label="{esc(EN['docs.tocLabel'])}"><span {ta('docs.tocLabel')}>{tx('docs.tocLabel')}</span>{toc}</nav>
<div class="prose">
<section id="installation"><h2 {ta('docs.install.title')}>{tx('docs.install.title')}</h2><ol class="steps"><li {ta('docs.install.s1')}>{tx('docs.install.s1')}</li><li {ta('docs.install.s2')}>{tx('docs.install.s2')}</li><li {ta('docs.install.s3')}>{tx('docs.install.s3')}</li></ol><p style="margin-top:16px" data-i18n-html="docs.install.faqLink">{th('docs.install.faqLink')}</p></section>
<section id="configuration"><h2 {ta('docs.config.title')}>{tx('docs.config.title')}</h2><p data-i18n-html="docs.config.body">{th('docs.config.body')}</p><div class="mut" style="font:500 12.5px var(--mono);margin-top:16px">Android / iOS</div><div class="code">Android/data/com.mojang.minecraftpe/files/games/com.mojang/resource_packs/Glacier/config.json</div><div class="mut" style="font:500 12.5px var(--mono);margin-top:16px">Windows</div><div class="code">%userprofile%\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\resource_packs\\Glacier\\config.json</div></section>
<section id="versions"><h2 {ta('docs.versions.title')}>{tx('docs.versions.title')}</h2>{table}</section>
<section id="troubleshooting"><h2 {ta('docs.troubleshoot.title')}>{tx('docs.troubleshoot.title')}</h2><p data-i18n-html="docs.troubleshoot.body">{th('docs.troubleshoot.body')}</p></section>
<section id="faq"><h2 {ta('faq.title')}>{tx('faq.title')}</h2><p class="sub" {ta('faq.sub')}>{tx('faq.sub')}</p><p style="margin-top:16px"><a class="btn g" href="/faq/"><span {ta('faq.allQuestions')}>{tx('faq.allQuestions')}</span>{ic('arrow')}</a></p></section>
</div></div></div>
{adw(AD['docs'])}<div style="height:48px"></div>'''
    for i, k in (('installation', 'docs.install.title'), ('configuration', 'docs.config.title'), ('versions', 'docs.versions.title'), ('troubleshooting', 'docs.troubleshoot.title')):
        SEARCH.append({'t': EN[k], 'd': 'Docs', 'u': '/docs/#' + i, 'k': 'help guide config.json install'})
    return page('/docs/', 'docs', body, 'docs')


def faq_page():
    cats = []
    for f in FAQ:
        if f['category'] not in cats:
            cats.append(f['category'])
    chips = '<button class="chip" type="button" data-faqcat="all" aria-pressed="true" %s>%s</button>' % (ta('faq.allQuestions'), tx('faq.allQuestions')) + ''.join('<button class="chip" type="button" data-faqcat="%s" aria-pressed="false" %s>%s</button>' % (esc(c), ta('faqcat.' + c), tx('faqcat.' + c)) for c in cats)
    out = ''
    for c in cats:
        out += '<h2 class="faq-cat" data-cat="%s" %s>%s</h2>' % (esc(c), ta('faqcat.' + c), tx('faqcat.' + c))
        out += '<div class="card list" style="margin-bottom:8px">'
        for f in [x for x in FAQ if x['category'] == c]:
            out += faq_item(f)
            SEARCH.append({'t': f['question'], 'd': 'FAQ · ' + c, 'u': '/faq/#' + f['id'], 'k': re.sub(r'<[^>]+>', ' ', f['answer'])[:160]})
        out += '</div>'
    # the summary carries an icon next to the text, so translations go on an inner span instead
    body = f'''{page_head(tx('nav.help'), tx('faq.title'), tx('faq.sub'), tx('nav.faq'), ta('faq.title'), ta('faq.sub'))}
<div class="wrap"><div class="tools-row"><div class="chips" role="group">{chips}</div><input class="search" id="faqQ" type="search" placeholder="Search questions" autocomplete="off" aria-label="Search questions"></div>
<div id="faq">{out}</div><p class="empty" id="faqEmpty">No questions match your search.</p></div>
{adw(AD['docs'])}<div style="height:48px"></div>'''
    return page('/faq/', 'faq', body, 'docs')


def donate():
    body = f"""<div class="wrap"><div class="dn-hero"><span class="heart">{ic('heart')}</span><span class="lbl">{tx('nav.donate')}</span><h1 {ta('donate.title')}>{tx('donate.title')}</h1><p class="sub" style="text-align:center" {ta('donate.sub')}>{tx('donate.sub')}</p></div>
<div class="dn-grid">
<div class="card dn rv"><span class="di">{brand('paypal')}</span><span class="num">PayPal</span><h3 {ta('donate.paypal.title')}>{tx('donate.paypal.title')}</h3><p {ta('donate.paypal.desc')}>{tx('donate.paypal.desc')}</p><div class="act"><a class="btn p lg" href="https://paypal.me/PepeOnPayPal" target="_blank" rel="noopener">{brand('paypal')}<span {ta('donate.paypal.btn')}>{tx('donate.paypal.btn')}</span></a></div></div>
<div class="card dn rv"><span class="di">{ic('coffee')}</span><span class="num">Ko-fi</span><h3 {ta('donate.kofi.title')}>{tx('donate.kofi.title')}</h3><p {ta('donate.kofi.desc')}>{tx('donate.kofi.desc')}</p><div class="act"><a class="btn p lg" href="https://ko-fi.com/pepeonkofi" target="_blank" rel="noopener">{ic('coffee')}<span {ta('donate.kofi.btn')}>{tx('donate.kofi.btn')}</span></a></div></div>
<div class="card rv" style="grid-column:1/-1;flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;padding:24px 28px"><div><h3 {ta('donate.community.title')}>{tx('donate.community.title')}</h3><p {ta('donate.community.desc')}>{tx('donate.community.desc')}</p></div><a class="btn g" href="{DISCORD}" target="_blank" rel="noopener">{brand('Discord')}<span {ta('btn.joinDiscord')}>{tx('btn.joinDiscord')}</span></a></div>
</div></div><div style="height:96px"></div>"""
    return page('/donate/', 'donate', body, 'donate')


def split_fragment(name):
    t = rd('tools/content/%s.html' % name)
    i = t.index('<h3')
    head, rest = t[:i], t[i:]
    h1 = re.search(r'<h1>(.*?)</h1>', head, re.S).group(1).strip()
    eyebrow = re.search(r'<span>(.*?)</span>', head, re.S).group(1).strip()
    p = re.search(r'<p>(.*?)</p>', head, re.S)
    return eyebrow, h1, (p.group(1).strip() if p else ''), head, rest


def legal(name, route, key):
    eyebrow, h1, intro, _, rest = split_fragment(name)
    rest = re.sub(r'<h3', '<h2', rest.replace('</h3>', '</h2>'))
    tabs = ''.join('<a class="chip" href="%s" %s>%s</a>' % (h, 'aria-pressed="true"' if h == route else '', tx(k)) for h, k in (('/license/', 'legal.license'), ('/tos/', 'legal.tos'), ('/privacy/', 'legal.privacy')))
    body = f'''{page_head(eyebrow, h1, intro, h1)}
<div class="wrap"><div class="chips" style="margin-bottom:24px">{tabs}</div><article class="legal prose">{rest}</article></div><div style="height:96px"></div>'''
    SEARCH.append({'t': h1, 'd': 'Legal', 'u': route, 'k': intro})
    return page(route, key, body, 'docs')


def best():
    eyebrow, h1, intro, head, rest = split_fragment('bbc')
    rest = re.sub(r'<h3', '<h2', rest.replace('</h3>', '</h2>'))
    rest = re.sub(r'<h2>\s*<span>(.*?)</span>\s*</h2>', r'<h2>\1</h2>', rest, flags=re.S)
    rest = re.sub(r'<a href="/features/?">', '<a href="/features/">', rest)
    body = f'''{page_head(eyebrow, h1, intro, 'Best Bedrock Client')}
<div class="wrap"><div class="chips" style="margin-bottom:24px"><span class="chip" aria-pressed="true">37+ modules</span><span class="chip">No cheats</span><span class="chip">Free forever</span></div><p style="margin-bottom:32px"><a class="btn p lg" href="/downloads/"><span {ta('hero.download')}>{tx('hero.download')}</span></a></p><article class="prose">{rest}</article></div><div style="height:96px"></div>'''
    SEARCH.append({'t': h1, 'd': 'Guide', 'u': '/best-bedrock-client/', 'k': 'best minecraft bedrock client guide'})
    return page('/best-bedrock-client/', 'best-bedrock-client', body, 'docs', title=META['titles'].get('best-bedrock-client', 'Best Minecraft Bedrock Client | Glacier Client'), desc='What to look for in a Minecraft Bedrock client, and where Glacier Client fits in.')


def mediakit():
    sw = [('Accent', '#7289da', '#0a0b14'), ('Accent hover', '#8ea0e0', '#0a0b14'), ('Night', '#0a0b14', '#eaecf6'), ('Panel', '#121526', '#eaecf6'), ('Text', '#eaecf6', '#0a0b14'), ('Text dim', '#9aa1b8', '#0a0b14'), ('Success', '#43b581', '#0a0b14'), ('Danger', '#f04747', '#0a0b14')]
    swatches = ''.join('<button class="sw" type="button" data-copy="%s" style="background:%s;color:%s"><b>%s</b><span>%s</span></button>' % (h, h, ink, n, h) for n, h, ink in sw)
    shots = ''.join(f'<a class="card h rv" href="{p}" download><img src="{w}" alt="" style="border-radius:10px;width:100%;height:auto" loading="lazy"><b>{t}</b><span class="lbl">{ic("down")} PNG</span></a>' for t, p, w in (('Mod Menu', '/assets/mod_menu.png', '/assets/mod_menu.webp'), ('Start Screen', '/assets/start_screen.png', '/assets/start_screen.webp'), ('Pause Screen', '/assets/pause_screen.png', '/assets/pause_screen.webp')))
    body = f'''{page_head('Press', 'Media Kit &amp; Brand Guidelines', 'Downloadable assets for reviewers and press, plus the colors and type behind this site. See our <a href="/license/" style="text-decoration:underline">License</a> for usage terms.', 'Media Kit')}
<div class="wrap" style="display:flex;flex-direction:column;gap:48px">
<div class="grid c2"><div class="card rv"><h3>Logo</h3><div style="background:var(--s0);border-radius:14px;padding:24px;display:flex;justify-content:center"><img src="/assets/logo.png" alt="Glacier Client logo" width="160" height="160"></div><div class="act"><a class="btn g" href="/assets/logo.png" download>{ic('down')} Download logo</a></div></div>
<div class="card rv"><h3>Background texture</h3><img src="/assets/BG.webp" alt="Background texture" style="border-radius:14px;width:100%;height:auto" width="1280" height="720" loading="lazy"><div class="act"><a class="btn g" href="/assets/BG.png" download>{ic('down')} Download background</a></div></div></div>
<div><h2 style="font-size:32px;margin-bottom:16px">Screenshots</h2><div class="grid c3">{shots}</div></div>
<div><h2 style="font-size:32px;margin-bottom:8px">Brand colors</h2><p class="sub" style="margin-bottom:16px">Click a swatch to copy its hex code. One blurple accent over deep night carries the brand.</p><div class="swatches">{swatches}</div></div>
<div><h2 style="font-size:32px;margin-bottom:16px">Typography</h2><div class="grid c3"><div class="card"><span class="num">Headings</span><b style="font:700 32px var(--disp);letter-spacing:-.03em">Space Grotesk</b><p>Semibold, tight tracking</p></div><div class="card"><span class="num">Body</span><b style="font:500 28px var(--sans)">Geist</b><p>Regular and medium</p></div><div class="card"><span class="num">Labels and numbers</span><b style="font:500 24px var(--mono)">Geist Mono</b><p>Tabular figures</p></div></div></div>
</div><div style="height:96px"></div>'''
    SEARCH.append({'t': 'Media Kit', 'd': 'Page · logo, colors, screenshots', 'u': '/mediakit/', 'k': 'press brand guidelines assets'})
    return page('/mediakit/', 'mediakit', body, 'docs')


def notfound():
    body = '''<div class="wrap"><div class="page-h" style="min-height:55vh;justify-content:center"><span class="lbl">404</span><h1>Page not found</h1><p class="sub">That page does not exist. Try the downloads or the mods.</p><p class="btns" style="max-width:380px"><a class="btn p lg" href="/">Back home</a><a class="btn g lg" href="/downloads/">Downloads</a></p></div></div>'''
    t = page('/404', 'home', body, 'none', noindex=True).replace('<title>%s</title>' % esc(META['titles']['home']), '<title>Page not found | Glacier Client</title>')
    return t.replace('<link rel="canonical" href="%s/404">' % SITE, '')


def build():
    files = {}
    files['index.html'] = home()
    files['features/index.html'] = features()
    files['mods/index.html'] = mods_page()
    files['gallery/index.html'] = gallery()
    files['downloads/index.html'] = downloads()
    files['community/index.html'] = community()
    files['docs/index.html'] = docs()
    files['faq/index.html'] = faq_page()
    files['donate/index.html'] = donate()
    files['license/index.html'] = legal('license', '/license/', 'license')
    files['tos/index.html'] = legal('tos', '/tos/', 'tos')
    files['privacy/index.html'] = legal('privacy', '/privacy/', 'privacy')
    files['best-bedrock-client/index.html'] = best()
    files['mediakit/index.html'] = mediakit()
    files['404.html'] = notfound()
    changed = [p for p, t in files.items() if wr(p, t)]
    pri = {'/': 1.0, '/downloads/': .9, '/features/': .9, '/docs/': .8, '/best-bedrock-client/': .8, '/community/': .6, '/mods/': .6, '/gallery/': .5, '/faq/': .5, '/donate/': .4, '/mediakit/': .3, '/license/': .2, '/tos/': .2, '/privacy/': .2}
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join('  <url><loc>%s%s</loc><priority>%s</priority></url>\n' % (SITE, p, v) for p, v in pri.items()) + '</urlset>\n'
    wr('sitemap.xml', sm)
    wr('robots.txt', 'User-agent: *\nAllow: /\nDisallow: /cloudflare-worker.js\n\nSitemap: %s/sitemap.xml\n' % SITE)
    pages_idx = [{'t': 'Home', 'd': 'Page', 'u': '/', 'k': 'glacier client'}, {'t': 'Features', 'd': 'Page', 'u': '/features/', 'k': 'hud modules config'}, {'t': 'Downloads', 'd': 'Page', 'u': '/downloads/', 'k': 'download latest launcher'}, {'t': 'Community', 'd': 'Page', 'u': '/community/', 'k': 'discord showcases'}, {'t': 'Help', 'd': 'Page', 'u': '/docs/', 'k': 'docs documentation'}, {'t': 'FAQ', 'd': 'Page', 'u': '/faq/', 'k': 'questions'}, {'t': 'All Mods', 'd': 'Page', 'u': '/mods/', 'k': 'modules'}, {'t': 'Gallery', 'd': 'Page', 'u': '/gallery/', 'k': 'screenshots'}, {'t': 'Donate', 'd': 'Page', 'u': '/donate/', 'k': 'support paypal kofi'}, {'t': 'Config Editor', 'd': 'External', 'u': CONFIG, 'k': 'config json editor'}, {'t': 'Discord', 'd': 'External', 'u': DISCORD, 'k': 'community support'}]
    wr('assets/data/search-index.json', json.dumps(pages_idx + SEARCH, ensure_ascii=False, separators=(',', ':')))
    print('built %d pages (%d rewritten), version %s' % (len(files), len(changed), VERSION))


if __name__ == '__main__':
    build()
