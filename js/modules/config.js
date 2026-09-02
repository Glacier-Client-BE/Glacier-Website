'use strict';

// Static configuration & copy. Values that never change at runtime live here so
// the behavioural modules stay focused on logic.

export const USE_MONETIZATION = true;
export const LINKVERTISE_USER_ID = 499358;

// Base URL of the Cloudflare Worker that tracks live download clicks.
// Leave empty to disable live counts (cards then show the static base numbers).
// Expected API:  GET <base>/counts -> { "v6.2": 12, ... }
//                POST <base>/increment/<key> -> { count: 13 }
export const COUNTER_API = 'https://glacier-downloads.pepeoncloudeflare.workers.dev';

// Text/key are derived from the latest client in downloads.json at runtime
// (see applyVersioning); only the static bits live here.
export const NOTIFICATION = { section: 'downloads' };

export const META = {
    home: 'Free Minecraft Bedrock client with a 37+ module mod menu and draggable HUD. Installs like a resource pack on Mobile, PC, and Console.',
    features: 'Every Glacier Client feature and all 37+ modules in one place: draggable HUD, live config editor, custom themes, auto-updates, and screenshots.',
    gallery: 'Minecraft Bedrock client screenshots: see the Glacier mod menu, custom start screen, and pause screen in game.',
    community: 'Join the Glacier Client Discord and watch creator showcases of the Minecraft Bedrock client in action.',
    downloads: 'Download Glacier Client free for Minecraft Bedrock Edition. Latest and legacy .mcpack versions for Mobile, PC, and Console.',
    faq: 'Minecraft Bedrock client FAQ: how to install Glacier, open the mod menu, supported versions, and troubleshooting.',
    mods: 'Browse all 37+ Glacier modules for Minecraft Bedrock: coordinates, FPS counter, armour HUD, hitboxes, and more.',
    license: 'Read the Glacier Client license to understand permitted and restricted usage.',
    tos: 'Read the Glacier Client Terms of Service governing use of the client and our community services.',
    privacy: 'Read the Glacier Client Privacy Policy to see what data is collected and how it is used.',
    mediakit: 'Glacier Client media kit and brand guidelines: logos, screenshots, colors, typography, and UI components.',
    donate: 'Support Glacier Client development through PayPal or Ko-fi.',
    docs: 'Glacier Client help: installation guide, config.json reference, supported Minecraft Bedrock versions, troubleshooting, and answers to common questions.',
    'best-bedrock-client': 'Why Glacier Client is one of the best free Minecraft Bedrock clients: 37+ modules, a draggable HUD, and zero performance impact.'
};

// Per-page browser titles, applied on every section switch.
export const TITLES = {
    home: 'Glacier Client | Free Minecraft Bedrock Client & Mod Menu',
    features: 'Features | Minecraft Bedrock Mod Menu | Glacier Client',
    gallery: 'Screenshots | Minecraft Bedrock Client | Glacier Client',
    community: 'Community & Creator Showcases | Glacier Client',
    downloads: 'Download Glacier Client | Free Minecraft Bedrock Client',
    faq: 'FAQ | Minecraft Bedrock Client Help | Glacier Client',
    mods: 'All 37+ Modules | Minecraft Bedrock Mods | Glacier Client',
    license: 'License | Glacier Client',
    tos: 'Terms of Service | Glacier Client',
    privacy: 'Privacy Policy | Glacier Client',
    mediakit: 'Media Kit & Brand Guidelines | Glacier Client',
    donate: 'Donate | Glacier Client',
    docs: 'Help & Documentation | Glacier Client',
    'best-bedrock-client': 'Best Minecraft Bedrock Client | Glacier Client'
};

// Pages that were folded into a parent tab when the nav was condensed to six
// destinations. Their URLs stay live so inbound links and search results never
// break: the router opens the parent section, keeps the original path, title and
// meta description, and scrolls to the block that absorbed the page.
export const MERGED = {
    mods:    { into: 'features', anchor: 'features-modules' },
    gallery: { into: 'features', anchor: 'features-screenshots' },
    faq:     { into: 'docs',     anchor: 'docs-faq' }
};

export const ALL = new Set(['home', 'features', 'gallery', 'community', 'downloads', 'faq', 'mods', 'license', 'tos', 'privacy', 'mediakit', 'donate', 'docs', 'best-bedrock-client']);
