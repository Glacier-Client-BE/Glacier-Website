#!/usr/bin/env python3
"""Builds the crawlable, search-engine-friendly side of the site.

The site is a single-page app. GitHub Pages answers every path except "/" with HTTP 404 (it serves 404.html), which
search engines will not index. This script gives every section its own real page with a clean URL (a directory with an
index.html, so the address is /downloads/ and never shows ".html"), unique <title>/description/canonical/Open Graph
tags, and JSON-LD structured data. It also writes sitemap.xml and robots.txt.

Single source of truth: titles and descriptions come from js/modules/config.js (TITLES / META), FAQ answers from
assets/data/faq.json, and the page body from index.html. Idempotent: run it after every change; it only rewrites files
whose content changed.   Usage:  python .github/scripts/build-seo.py [--list]
"""
import html
import json
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SITE = 'https://glacierclient.xyz'
OG_IMAGE = SITE + '/assets/og-image.jpg'

# Sections folded into a parent tab: their pages exist so old links keep working, but they point search engines at
# the parent so the same content is not indexed twice.
MERGED = {'mods': 'features', 'gallery': 'features', 'faq': 'docs'}
# Pages worth listing in the sitemap, in priority order.
SITEMAP = [('', 1.0, 'weekly'), ('downloads', 0.9, 'weekly'), ('features', 0.9, 'monthly'), ('docs', 0.8, 'monthly'),
           ('best-bedrock-client', 0.8, 'monthly'), ('community', 0.6, 'monthly'), ('donate', 0.4, 'yearly'),
           ('mediakit', 0.3, 'yearly'), ('license', 0.2, 'yearly'), ('tos', 0.2, 'yearly'), ('privacy', 0.2, 'yearly')]
NAV = [('Home', ''), ('Features', 'features'), ('Downloads', 'downloads'), ('Community', 'community'), ('Help', 'docs'),
       ('Donate', 'donate'), ('Best Bedrock Client', 'best-bedrock-client'), ('Config Editor', 'https://config.glacierclient.xyz/')]


def read(path):
    with open(os.path.join(ROOT, path), encoding='utf-8') as f:
        return f.read()


def write(path, text):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    if os.path.exists(full):
        with open(full, encoding='utf-8') as f:
            if f.read() == text:
                return False
    with open(full, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)
    return True


def js_map(src, name):
    """Parse `export const NAME = { key: 'value', ... };` from config.js."""
    m = re.search(r'export const ' + name + r' = \{(.*?)\n\};', src, re.S)
    out = {}
    for k, v in re.findall(r"^\s*'?([\w-]+)'?:\s*'((?:[^'\\]|\\.)*)'", m.group(1), re.M):
        out[k] = v.replace("\\'", "'")
    return out


def url_for(route):
    return SITE + '/' + (route + '/' if route else '')


def plain(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()


def ld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + '</script>'


def jsonld_for(route, title, desc, faqs):
    url = url_for(route)
    org = {'@type': 'Organization', '@id': SITE + '/#org', 'name': 'Glacier Client', 'url': SITE + '/',
           'logo': SITE + '/assets/logo.png',
           'sameAs': ['https://discord.glacierclient.xyz/', 'https://github.com/Glacier-Client-BE', 'https://youtube.com/@glacierclient',
                      'https://x.com/glacierclientbe', 'https://www.instagram.com/glacierclientmcbe']}
    site = {'@type': 'WebSite', '@id': SITE + '/#site', 'name': 'Glacier Client', 'alternateName': ['Glacier', 'Glacier Bedrock Client'],
            'url': SITE + '/', 'inLanguage': 'en', 'publisher': {'@id': SITE + '/#org'}}
    graph = [org, site]
    if route == '':
        graph.append({
            '@type': 'SoftwareApplication', '@id': SITE + '/#app', 'name': 'Glacier Client',
            'alternateName': 'Glacier Client for Minecraft Bedrock', 'description': desc, 'url': SITE + '/',
            'applicationCategory': 'GameApplication', 'applicationSubCategory': 'Minecraft Bedrock resource pack / client',
            'operatingSystem': 'Android, iOS, Windows, Xbox, PlayStation, Nintendo Switch',
            'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'USD'},
            'image': OG_IMAGE, 'screenshot': [SITE + '/assets/mod_menu.png', SITE + '/assets/start_screen.png', SITE + '/assets/pause_screen.png'],
            'downloadUrl': SITE + '/downloads/', 'publisher': {'@id': SITE + '/#org'}})
        graph.append({'@type': 'ItemList', '@id': SITE + '/#nav', 'name': 'Glacier Client site navigation', 'itemListElement': [
            {'@type': 'SiteNavigationElement', 'position': i + 1, 'name': n, 'url': r if r.startswith('http') else url_for(r)} for i, (n, r) in enumerate(NAV)]})
        graph.append({'@type': 'WebPage', '@id': url + '#webpage', 'url': url, 'name': title, 'description': desc,
                      'isPartOf': {'@id': SITE + '/#site'}, 'about': {'@id': SITE + '/#app'}, 'primaryImageOfPage': OG_IMAGE})
    else:
        name = title.split('|')[0].strip()
        graph.append({'@type': 'WebPage', '@id': url + '#webpage', 'url': url, 'name': title, 'description': desc,
                      'isPartOf': {'@id': SITE + '/#site'}, 'primaryImageOfPage': OG_IMAGE,
                      'breadcrumb': {'@id': url + '#crumbs'}})
        graph.append({'@type': 'BreadcrumbList', '@id': url + '#crumbs', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Glacier Client', 'item': SITE + '/'},
            {'@type': 'ListItem', 'position': 2, 'name': name, 'item': url}]})
    if route in ('', 'docs', 'faq') and faqs:
        graph.append({'@type': 'FAQPage', '@id': url + '#faq', 'mainEntity': [
            {'@type': 'Question', 'name': q['question'], 'acceptedAnswer': {'@type': 'Answer', 'text': plain(q['answer'])}} for q in faqs]})
    return ld({'@context': 'https://schema.org', '@graph': graph})


def set_meta(doc, attr, key, value):
    """Set content of <meta {attr}="{key}" content="..."> (adds it before </head> when missing)."""
    esc = html.escape(value, quote=True)
    pat = re.compile(r'(<meta\s+' + attr + r'="' + re.escape(key) + r'"\s+content=")[^"]*(")', re.S)
    if pat.search(doc):
        return pat.sub(lambda m: m.group(1) + esc + m.group(2), doc, count=1)
    return doc.replace('</head>', '    <meta ' + attr + '="' + key + '" content="' + esc + '" />\n</head>', 1)


def page(template, route, title, desc, faqs):
    canon_route = MERGED.get(route, route)
    canon = url_for(canon_route)
    d = template
    d = re.sub(r'<title>.*?</title>', lambda m: '<title>' + html.escape(title, quote=False) + '</title>', d, count=1, flags=re.S)
    d = set_meta(d, 'name', 'description', desc)
    d = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + canon + m.group(2), d, count=1)
    for k, v in (('og:title', title), ('og:description', desc), ('og:url', canon)):
        d = set_meta(d, 'property', k, v)
    d = set_meta(d, 'name', 'twitter:title', title)
    d = set_meta(d, 'name', 'twitter:description', desc)
    for k, v in (('og:image', OG_IMAGE), ('og:image:type', 'image/jpeg'), ('og:image:width', '1200'), ('og:image:height', '630'),
                 ('og:image:alt', 'Glacier Client: free Minecraft Bedrock client with a 37+ module mod menu'), ('og:site_name', 'Glacier Client'),
                 ('og:locale', 'en_US')):
        d = set_meta(d, 'property', k, v)
    d = set_meta(d, 'name', 'twitter:image', OG_IMAGE)
    d = set_meta(d, 'name', 'twitter:image:alt', 'Glacier Client: free Minecraft Bedrock client with a 37+ module mod menu')
    d = set_meta(d, 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    d = set_meta(d, 'name', 'theme-color', '#7289da')
    if route in MERGED:
        d = set_meta(d, 'name', 'robots', 'noindex, follow')   # duplicate of its parent tab; the canonical points there
    # structured data: drop whatever was there, write the generated block
    d = re.sub(r'\s*<script\s+type="application/ld\+json">.*?</script>', '', d, flags=re.S)
    d = re.sub(r'\s*<!-- seo:jsonld:start -->.*?<!-- seo:jsonld:end -->', '', d, flags=re.S)
    block = '    <!-- seo:jsonld:start -->\n    ' + jsonld_for(route, title, desc, faqs) + '\n    <!-- seo:jsonld:end -->\n'
    d = d.replace('    <link rel="icon"', block + '    <link rel="icon"', 1)
    if route:
        # Served from /<route>/index.html: every relative URL (assets, modules, data fetches) must still resolve from "/".
        if '<base ' not in d:
            d = d.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    <base href="/" />', 1)
        d = re.sub(r'href="#([^"]*)"', lambda m: 'href="/' + route + '/#' + m.group(1) + '"', d)
    return d


def main():
    cfg = read('js/modules/config.js')
    titles, metas = js_map(cfg, 'TITLES'), js_map(cfg, 'META')
    faqs = json.loads(read('assets/data/faq.json'))
    all_ids = re.search(r"export const ALL = new Set\(\[(.*?)\]\)", cfg, re.S).group(1)
    routes = [r for r in re.findall(r"'([\w-]+)'", all_ids) if r != 'home']

    # home page: strip any previous generated state from index.html, then regenerate its head in place
    index = read('index.html')
    index = re.sub(r'\s*<!-- seo:jsonld:start -->.*?<!-- seo:jsonld:end -->', '', index, flags=re.S)
    home = page(index, '', titles['home'], metas['home'], faqs)
    changed = [write('index.html', home)]
    # crawlable internal links use the canonical trailing-slash URLs
    for r in routes:
        home = home.replace('href="/' + r + '"', 'href="/' + r + '/"')
    changed[0] = write('index.html', home) or changed[0]

    written = []
    for r in routes:
        out = page(home, r, titles.get(r, titles['home']), metas.get(r, metas['home']), faqs)
        if write(r + '/index.html', out):
            written.append(r)

    urls = ''.join(
        '  <url>\n    <loc>%s</loc>\n    <changefreq>%s</changefreq>\n    <priority>%.1f</priority>\n  </url>\n' % (url_for(r), cf, p)
        for r, p, cf in SITEMAP)
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '</urlset>\n'
    write('sitemap.xml', sm)
    write('robots.txt', 'User-agent: *\nAllow: /\nDisallow: /cloudflare-worker.js\n\nSitemap: ' + SITE + '/sitemap.xml\n')

    if '--list' in sys.argv:
        print('\n'.join(routes))
    else:
        print('index.html:', 'updated' if changed[0] else 'unchanged', '| route pages written:', len(written), '/', len(routes))


if __name__ == '__main__':
    main()
