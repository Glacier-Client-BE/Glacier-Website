// "A peek inside" video: autoplays muted; plays only while on screen, and the
// toggle lets reduced-motion users (or anyone) stop it.
export function setupPeek() {
    const video = document.querySelector('.peek-video');
    const btn = document.querySelector('.peek-toggle');
    if (!video || !btn) return;
    let userPaused = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const icon = btn.querySelector('i');
    const paint = () => {
        icon.className = `fas fa-${userPaused ? 'play' : 'pause'}`;
        btn.setAttribute('aria-label', userPaused ? 'Play video' : 'Pause video');
    };
    const sync = visible => {
        if (visible && !userPaused) video.play().catch(() => {});
        else video.pause();
    };
    let visible = false;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(visible); }, { threshold: 0.25 }).observe(video);
    btn.addEventListener('click', () => { userPaused = !userPaused; paint(); sync(visible); });
    paint();
}
