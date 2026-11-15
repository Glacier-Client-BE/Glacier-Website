# Glacier-Website | Glacier Productions

- https://glacierclient.xyz
- https://glacier-client-be.github.io/Glacier-Website/

Static site for GitHub Pages. No framework and no bundler.

## How it is built

| Path | What it is |
| --- | --- |
| `tools/build.py` | Generates every page (`index.html`, `features/`, `downloads/` ...), `sitemap.xml`, `robots.txt` and `assets/data/search-index.json`. |
| `tools/en.json` | English strings. The keys match `js/modules/i18n.js`, so the 21 translations keep working. |
| `tools/content/` | Legal text, page titles and descriptions, structured data. |
| `css/site.css` | The design system (dark and light themes). |
| `js/site.js`, `js/lib/` | Native ES modules: shell, 3D scene, downloads, mods, search. |
| `js/modules/i18n*.js` | Translation tables, loaded only when a non-English language is used. |
| `assets/data/*.json` | Downloads, launcher releases, mods and FAQ. The workflows keep these fresh. |
| `config/` | The config editor, deployed to config.glacierclient.xyz. It still uses `css/styles.css` and `js/modules/heroMedia.js`. |

After editing copy, data or templates run:

```bash
python tools/build.py
```

CI (`stamp-version.yml`) stamps every page with a cache-busting token on each push to `main`.

## Monetization

Downloads go through LootLabs and Linkvertise (see `js/lib/util.js`, `js/lib/data.js`). Do not remove the gates.
