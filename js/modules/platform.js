// Platform hint under the hero buttons + a header Download button that appears
// once the hero has scrolled out of view.

const HINTS = [
    [/android/i, 'Android', 'Open the .mcpack with Minecraft to import it.'],
    [/iphone|ipad|ipod/i, 'iOS', 'Open the .mcpack in Minecraft to import it.'],
    [/windows/i, 'Windows', 'Double-click the .mcpack to import it.'],
    [/mac|linux/i, 'Desktop', 'Packs need Minecraft Bedrock; see Help for Mac/Linux.'],
];

export function setupPlatformHint() {
    const el = document.getElementById('heroPlatform');
    if (!el) return;
    const ua = navigator.userAgent || '';
    const hit = HINTS.find(([re]) => re.test(ua));
    if (!hit) return;
    el.textContent = `Detected ${hit[1]} · ${hit[2]}`;
    el.hidden = false;
}

export function setupStickyCta() {
    const hero = document.getElementById('hero-section');
    const cta = document.getElementById('headerCta');
    if (!hero || !cta || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(([e]) => cta.classList.toggle('is-visible', !e.isIntersecting),
        { threshold: 0 }).observe(hero);
}
