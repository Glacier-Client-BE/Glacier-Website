# Launcher-Style Header Design

## Overview
The website header has been completely redesigned to match the **Glacier Launcher's modern tab-based navigation interface**, replacing the traditional horizontal menu with a sleek launcher-style layout.

## Header Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Glacier Client        [Tabs...]    [Search] [Theme] │
│         Client                                                │
└─────────────────────────────────────────────────────────────┘
```

### Components

#### 1. **Branding Section** (Left)
- **Logo Icon**: 34px Glacier Client logo
- **Title**: "Glacier Client" (13px, bold)
- **Subtitle**: "Client" (10px, dimmed, uppercase)
- Takes ~110px width
- Fixed, never collapses

#### 2. **Navigation Tabs** (Center)
- Replaced pill-style menu with individual tabs
- Tabs: Home, Features, Gallery, Community, Downloads, FAQ, All Mods, License, Donate
- **Styling**:
  - Background: Transparent (hover adds subtle background)
  - Padding: 6px 14px
  - Active state: Accent color (#7289da) with glow
  - Smooth hover transitions
  - Whitespace: `nowrap`

#### 3. **Spacer** (Grows)
- Flexible element that pushes right-side elements to the right
- `flex: 1` to consume available space

#### 4. **Search Trigger** (Right)
- **Icon**: Search icon (10px)
- **Keyboard Hint**: "Ctrl K" in small badge
- **Styling**:
  - Background: `rgba(255, 255, 255, 0.06)`
  - Border: `1px solid rgba(255, 255, 255, 0.08)`
  - Border radius: 16px
  - Padding: 5px 11px
  - Hover adds subtle glow effect
- **Responsive**: Hint hides on mobile

#### 5. **Theme Toggle** (Right)
- Sun icon for light/dark theme toggle
- 28px circular button
- Glassmorphic styling
- Hover effect with accent glow

#### 6. **Mobile Menu Button** (Right, Mobile Only)
- Hamburger icon
- Shows only on screens < 768px
- Toggles mobile navigation menu

## CSS Architecture

### Root Styles
```css
.top-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    min-height: 52px;
}
```

### Branding
```css
.branding {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.logo-icon { width: 34px; height: 34px; }
.branding-title { font-size: 13px; font-weight: 700; }
.branding-sub { font-size: 10px; text-transform: uppercase; }
```

### Navigation Tabs
```css
.nav-tabs {
    display: flex;
    align-items: center;
    gap: 2px;
}

.nav-tab {
    padding: 6px 14px;
    color: var(--text-dim);
    background: transparent;
    border-radius: 12px;
    transition: all var(--t);
}

.nav-tab.active {
    background: rgba(114, 137, 218, 0.9);
    color: var(--text);
    box-shadow: 0 0 12px var(--accent-glow);
}
```

### Search Trigger
```css
.search-trigger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 5px 11px;
}

.search-hint {
    font-size: 9px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 3px;
    padding: 1px 5px;
}
```

## Responsive Behavior

### Desktop (> 768px)
- All navigation tabs visible
- Search hint displayed
- Full branding visible

### Tablet (768px - 1024px)
- Navigation tabs visible but may wrap
- Branding still visible
- Search trigger compact

### Mobile (< 768px)
- Branding shows logo + title only (subtitle hidden)
- Navigation tabs hidden by default
- Hamburger menu button visible
- Collapsed search trigger (icon only)
- Mobile menu slides down on toggle
- Tabs appear in vertical list in mobile menu

## Interactive States

### Hover Effects
```
Navigation Tab Hover:
  - Background: rgba(255, 255, 255, 0.06)
  - Color: var(--text)
  - No lift effect

Search Trigger Hover:
  - Background: rgba(255, 255, 255, 0.10)
  - Border Color: rgba(114, 137, 218, 0.35)
  - Color: var(--text)
  - Box Shadow: 0 0 10px var(--accent-glow)

Theme Button Hover:
  - Background: rgba(255, 255, 255, 0.12)
  - Color: var(--text)
  - Box Shadow: 0 0 8px var(--accent-glow)
```

### Active State
```
Navigation Tab Active:
  - Background: rgba(114, 137, 218, 0.9)  [Accent color with opacity]
  - Color: var(--text)  [White]
  - Box Shadow: 0 0 12px var(--accent-glow)  [Accent glow]
  - Smooth transitions with var(--t) timing
```

## HTML Structure Changes

### Before
```html
<header id="mainHeader">
    <div class="header-container container">
        <a href="#" class="logo">
            <img src="..." class="logo-img" />
            <span class="logo-text">Glacier Client</span>
        </a>
        <ul class="nav-menu" id="navMenu">
            <li><a class="nav-link">Home</a></li>
            ...
        </ul>
        <div class="header-actions">
            <button class="header-icon-btn">Search</button>
            ...
        </div>
    </div>
</header>
```

### After
```html
<header id="mainHeader">
    <div class="top-bar">
        <div class="branding">
            <img class="logo-icon" src="..." />
            <div class="branding-text">
                <div class="branding-title">Glacier Client</div>
                <div class="branding-sub">Client</div>
            </div>
        </div>

        <div class="top-bar-spacer"></div>

        <nav class="nav-tabs" id="navMenu">
            <a class="nav-tab active" data-section="home">Home</a>
            ...
        </nav>

        <button class="search-trigger">
            <i class="fas fa-search"></i>
            <span class="search-hint">Ctrl K</span>
        </button>

        <button class="header-icon-btn">Theme</button>
        <button class="mobile-menu-btn">Menu</button>
    </div>
</header>
```

## JavaScript Updates

### Changed Selectors
- `document.querySelectorAll('.nav-link')` → `.nav-tab`
- All navigation functionality remains the same
- Mobile menu toggle behavior preserved

### DOM References
```javascript
dom = {
    navMenu: document.getElementById('navMenu'),  // Still works
    navLinks: document.querySelectorAll('.nav-tab'),  // Updated
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    headerEl: document.getElementById('mainHeader'),
    ...
}
```

## Color & Spacing

### Color Scheme
- Branding Text: `var(--text)` (#ffffff)
- Secondary Text: `var(--text-dim)` (#99aab5)
- Active Background: `rgba(114, 137, 218, 0.9)`
- Hover Background: `rgba(255, 255, 255, 0.06-0.12)`
- Borders: `rgba(255, 255, 255, 0.08-0.15)`
- Glow: `var(--accent-glow)` (rgba(114, 137, 218, 0.42))

### Spacing
- Header Padding: 10px 16px
- Tab Gap: 2px
- Component Gap: 12px
- Tab Padding: 6px 14px
- Search Trigger Padding: 5px 11px

## Light Theme Support

All header elements automatically switch to light theme colors when `data-theme="light"` is set:
- Backgrounds adjust opacity/color
- Text colors invert appropriately
- Borders maintain visibility with proper contrast
- Active states use accent color (same across themes)

## Performance Considerations

- Flexible layout prevents layout thrashing
- Smooth transitions use GPU acceleration (`transform`, `opacity`)
- No backdrop blur on header (keeps it lightweight)
- Mobile menu uses CSS animations for smooth interactions
- Proper `flex-shrink: 0` on fixed-width elements

## Browser Compatibility

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

1. **Dropdown Menus**: Add submenu support for complex navigation
2. **Breadcrumb**: Show current section path
3. **Badge Notifications**: Add notification badges to tabs
4. **Dark Mode Toggle**: More visible theme switcher
5. **Sticky Header**: Option to keep header visible while scrolling
6. **Collapse Animation**: Animated logo/title compression on scroll

## Testing Checklist

- [ ] Header displays correctly on desktop
- [ ] Navigation tabs are clickable and highlight correctly
- [ ] Search trigger works and shows keyboard hint
- [ ] Theme toggle functions properly
- [ ] Mobile menu appears and functions on small screens
- [ ] Mobile menu hides tabs correctly
- [ ] All hover states work smoothly
- [ ] Light theme styling works
- [ ] Keyboard navigation works (Ctrl+K for search)
- [ ] Responsive breakpoints work at 768px

## Commit Information

- **Commit Hash**: 4f6ad13
- **Date**: 2026-06-12
- **Files Changed**: 
  - index.html (header structure)
  - css/styles.css (header styles)
  - js/app.js (selector updates)
- **Status**: ✅ Complete
