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
export const NOTIFICATION = { cta: 'Download', section: 'downloads' };

export const META = {
    home: 'Next-gen Minecraft Bedrock client with 37+ modules, draggable HUD, and zero performance impact.',
    features: 'Explore the advanced features of Glacier Client config editor, custom themes, and auto-updates.',
    gallery: 'See Glacier Client in action with screenshots of the mod menu, start screen, and pause screen.',
    community: 'Join the Glacier Client Discord community and watch creator showcases of the client in action.',
    downloads: 'Download the latest Glacier Client version for Minecraft Bedrock Edition.',
    faq: 'Frequently asked questions about Glacier Client installation, compatibility, and usage.',
    mods: 'Browse all 37+ modules available in Glacier Client for Minecraft Bedrock Edition.',
    license: 'Read the Glacier Client license to understand permitted and restricted usage.',
    tos: 'Read the Glacier Client Terms of Service governing use of the client and our community services.',
    privacy: 'Read the Glacier Client Privacy Policy to see what data is collected and how it is used.',
    mediakit: 'Glacier Client media kit and brand guidelines: logos, screenshots, colors, typography, and UI components.',
    donate: 'Support Glacier Client development through PayPal or Ko-fi.'
};

export const MAIN = new Set(['home', 'features', 'gallery']);
export const ALL = new Set(['home', 'features', 'gallery', 'community', 'downloads', 'faq', 'mods', 'license', 'tos', 'privacy', 'mediakit', 'donate']);
