# Prompt: Reskin config.glacierclient.xyz to the Glacier Launcher design

Copy everything below the line into your AI assistant (or hand it to a developer) along with the config site's code. It is a CSS-first reskin: **keep all existing HTML structure and JS behaviour intact — only restyle.**

---

You are restyling the **Glacier Config Editor** (config.glacierclient.xyz) to match the new Glacier Launcher design language used on glacierclient.xyz. It is a glassmorphism, Discord-inspired dark UI with a fixed blurred Minecraft background. Do a **CSS-only reskin**: do not change the HTML structure or JS logic, only replace styles. Keep all IDs, classes, and behaviour working.

## 1. Design tokens — declare these `:root` variables first

```css
:root {
    /* Accent (Discord blurple) */
    --accent: #7289da;
    --accent-hover: #8ea0e0;
    --accent-glow: rgba(114, 137, 218, 0.42);
    --accent-bg: rgba(114, 137, 218, 0.10);

    /* Base backgrounds */
    --bg: #23272a;
    --bg-panel: #2c2f33;

    /* Text */
    --text: #ffffff;
    --text-dim: #99aab5;

    /* Semantic */
    --green: #43b581;
    --red: #f04747;
    --orange: #faa61a;

    /* Sizing / motion */
    --r-sm: 8px;
    --r-md: 12px;
    --pill: 9999px;
    --t: 0.15s ease;
    --blur: 14px;
    --ctl-h: 40px;               /* shared height for header controls */

    /* Fixed-background overlay (dark mode) */
    --overlay-top: rgba(20, 22, 26, 0.58);
    --overlay-mid: rgba(20, 22, 26, 0.40);
    --overlay-bot: rgba(16, 18, 22, 0.86);

    /* Glass surfaces (translucent, blurred — for elevated chrome) */
    --glass: rgba(35, 39, 42, 0.45);
    --glass-strong: rgba(28, 31, 35, 0.62);
    --glass-border: rgba(255, 255, 255, 0.10);
    --glass-border-hover: rgba(255, 255, 255, 0.18);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);

    /* Solid surfaces (opaque launcher panel greys — for list rows / cards) */
    --surface: #26292e;
    --surface-hover: #2f333a;
    --surface-border: rgba(255, 255, 255, 0.06);
    --surface-inset: #1f2227;
}
```

Font: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`. Use `--t` (0.15s ease) for every state transition. Use `cubic-bezier(0.2, 0.8, 0.2, 1)` for larger entrance animations.

## 2. The fixed blurred background

Add a Minecraft background image (use the launcher's `assets/BG.png`, a blurred night scene). It must be one **static** layer — no animation behind glass (animating it causes flicker when blurred elements repaint).

```css
html { background: var(--bg); }
body { background: transparent; }

body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
        radial-gradient(circle at 18% 22%, rgba(114,137,218,0.18) 0%, transparent 48%),
        radial-gradient(circle at 82% 78%, rgba(67,181,129,0.12) 0%, transparent 50%),
        linear-gradient(180deg, var(--overlay-top) 0%, var(--overlay-mid) 35%, var(--overlay-bot) 100%),
        url('assets/BG.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -1;
    transform: translateZ(0);          /* own composite layer — stops flicker */
    backface-visibility: hidden;
}
```

## 3. Surface rules — two tiers

- **Glass** (translucent + `backdrop-filter: blur(var(--blur))`): use for floating chrome — the header pills, top toolbar, sidebars, modal/popups, hero-like banners. Background `var(--glass)`, border `1px solid var(--glass-border)`, shadow `var(--glass-shadow)`. Hover: `var(--glass-strong)` + `border-color: var(--glass-border-hover)` + `transform: translateY(-3px)`.
- **Solid** (opaque grey, no blur): use for content rows / setting cards / list items — the bulk of a config editor. Background `var(--surface)`, border `1px solid var(--surface-border)`, radius `var(--r-md)`. Hover: `background: var(--surface-hover)`. **Do not** add a left accent bar on hover — just lighten the grey.

A config editor's setting rows should look like the launcher's Settings panel: solid `--surface` cards, each with a title (`var(--text)`, 15px/600), a dim description (`var(--text-dim)`, 13px), and the control (toggle/dropdown/slider) right-aligned. Group rows under uppercase section labels:

```css
.section-label {                 /* e.g. "INJECTION", "APPEARANCE" */
    display: flex; align-items: center; gap: 14px;
    color: var(--text-dim);
    font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
}
.section-label::after {          /* trailing divider line */
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--glass-border), transparent);
}
```

## 4. Components

**Buttons**
- Primary: `background: var(--accent)`, white text, `border-radius: var(--r-sm)`, height 48px, `box-shadow: 0 0 22px var(--accent-glow)`. Hover: `background: var(--accent-hover)` + `translateY(-2px)`.
- Secondary: `background: rgba(255,255,255,0.1)`, `color: var(--text-dim)`, `1px solid rgba(255,255,255,0.15)`, blur(8px). Hover: lighten bg, `color: var(--text)`. **In light mode, secondary text must stay accent/dark — never white on its light hover background.**
- Icon button: `var(--ctl-h)` square, circle, `rgba(255,255,255,0.05)` glass, hover `rgba(255,255,255,0.12)` + accent glow.

**Tabs / segmented controls** (e.g. config categories) — two valid active styles:
- *Pill switch* (like the launcher edition switcher): a glass pill container `border-radius: var(--pill)`, `height: var(--ctl-h)`, `padding: 3px`; items are pills, the active one is **solid `var(--accent)`** filling the container height.
- *Soft tabs* (like the Settings All/Inject/Looks tabs): wider glass pills, the active one uses a **soft tint** — `background: var(--accent-bg)`, `color: var(--accent-hover)`, `border-color: rgba(114,137,218,0.45)`, `box-shadow: inset 0 0 0 1px rgba(114,137,218,0.25), 0 0 18px var(--accent-glow)`. Tabs may carry a Font Awesome icon at 0.92rem, opacity 0.85 (1 when active).

**Inputs / search** (config filter field):
```css
input, select, textarea {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: var(--r-md);
    color: var(--text);
    padding: 12px 16px;
    backdrop-filter: blur(var(--blur));
    transition: border-color var(--t), box-shadow var(--t), background var(--t);
}
input:focus {
    outline: none;
    border-color: var(--accent);
    background: var(--glass-strong);
    box-shadow: 0 0 0 2px var(--accent-glow);
}
::placeholder { color: var(--text-dim); }
```

**Toggles / switches**: off = `var(--surface-inset)` track; on = `var(--accent)` track with `0 0 10px var(--accent-glow)`. **Sliders**: `var(--surface-inset)` track, `var(--accent)` fill + thumb.

**Modals / popups**: backdrop `rgba(10,12,15,0.75)` + `blur(6px)`; box `rgba(28,31,35,0.8)` + `blur(var(--blur))`, `border: 1px solid rgba(255,255,255,0.12)`, `border-radius: 16px`. Fade/scale in over 0.15–0.2s.

**Collapsible dropdown** (`<details>` style — e.g. grouped options): summary row is dim text + a chevron icon that `rotate(180deg)` when `[open]`; the body lists `--surface-inset` rows.

**Badges**: small pill, `var(--accent-bg)` bg, `var(--accent-hover)` text, `1px solid rgba(114,137,218,0.4)`, uppercase 0.7rem/700. Use orange variant (`rgba(250,166,26,0.12)` bg / `var(--orange)` text) for "coming soon"/warning.

## 5. Header / top bar (if the config app has one)

Transparent bar (`background: transparent`, no border) floating over the BG. Only the controls carry backgrounds — glass pills for nav/search, a glass circle for icon buttons, all sharing `height: var(--ctl-h)`. Add a fade scrim that appears on scroll:
```css
header::before {
    content: ''; position: absolute; inset: -10px 0 auto 0; height: 96px;
    background: linear-gradient(180deg, var(--overlay-bot), transparent);
    z-index: -1; opacity: 0; transition: opacity 0.25s ease;
}
header.scrolled::before { opacity: 1; }
```

## 6. Light mode (`[data-theme="light"]`)

Keep **BG.png fully visible** (do NOT override `body::before`; do NOT brighten/blur it). Override only:

```css
[data-theme="light"] {
    --bg: #f5f6f8; --text: #0e1116; --text-dim: #5b6470;
    --glass: rgba(255,255,255,0.55); --glass-strong: rgba(255,255,255,0.72);
    --glass-border: rgba(0,0,0,0.08); --glass-border-hover: rgba(0,0,0,0.14);
    --surface: #ffffff; --surface-hover: #f0f1f4;
    --surface-border: rgba(0,0,0,0.08); --surface-inset: #eceef1;
    --overlay-top: rgba(15,17,21,0.30);
    --overlay-mid: rgba(15,17,21,0.16);
    --overlay-bot: rgba(15,17,21,0.58);
}
[data-theme="light"] body { background: transparent; }
```

Critical rule for light mode over a dark photo: **text inside panels is dark; text floating directly on the background is light.** So:
- Panels (cards, rows, modals) → `rgba(255,255,255,0.86)`, content text `#1a1d20`.
- Bare-on-background text (page/section titles, header chrome, any copy not in a panel) → `#fff` / `rgba(255,255,255,0.85)`, add `text-shadow: 0 1px 12px rgba(0,0,0,0.5)` for legibility.
- Any solid dropdown/menu panel (e.g. a mobile menu) keeps **dark** text since it's an opaque light surface, not over the image.

## 7. Motion & polish

- Hover lift `translateY(-1px to -3px)`; active press `scale(0.96)`.
- Glow accents: `0 0 20px var(--accent-glow)`.
- Entrance: fade + scale 0.98→1 over 0.2–0.3s.
- Focus rings: `2px` accent outline / `box-shadow: 0 0 0 2px var(--accent-glow)`.
- Respect `prefers-reduced-motion`.
- Put `contain: layout paint` / `content-visibility: auto` on long scrollable lists.

## 8. Don'ts

- No left-border accent bars that appear on hover (the previous design had them; we removed them).
- No animated full-screen layers behind blurred elements (flicker).
- No white text on light backgrounds in light mode.
- Don't restructure HTML or rewrite JS — restyle only.

Deliver a single updated stylesheet (and add `assets/BG.png`). Match the look of glacierclient.xyz: dark glass chrome + solid grey setting rows over a blurred Minecraft backdrop, with a working light theme that keeps the background visible.
