'use strict';

// Shared mutable application state. A single object, imported by reference, so
// any module can read or update cross-cutting values without a web of circular
// imports or read-only export bindings. Module-private state (e.g. the toast
// key, the tilt capability cache) stays local to its own module instead.
export const state = {
    // Cached DOM references, populated once in init().
    dom: null,

    // Loaded JSON data.
    modsData: [],
    faqData: [],
    downloadsData: { clients: { working: [], legacy: [] }, extensions: { working: [], legacy: [] } },

    // Rendered mod cards (element + searchable text), for filtering/search.
    modCards: [],

    // Download deep-link index: slug -> { tab, el }. Plus any pending deep link
    // requested before the cards finished rendering.
    dlIndex: new Map(),
    pendingDeepLink: null,

    // Eased scroll position that lerps toward window.scrollY each frame. Scroll-
    // linked effects (side rail, top progress bar, parallax) read from this
    // instead of the raw value so they glide and settle rather than tracking 1:1
    // — the "Apple-esque" feel — while native scrolling stays untouched.
    smoothY: 0,
    scrollSubs: []
};
