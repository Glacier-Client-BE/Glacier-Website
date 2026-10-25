// "A peek inside" video: always plays (muted, looping) until the viewer
// pauses it with the toggle. Their choice is kept for the page session.
export function setupPeek() {
    const video = document.querySelector('.peek-video');
    const btn = document.querySelector('.peek-toggle');
    if (!video || !btn) return;
    const icon = btn.querySelector('i');
    let userPaused = false;
    const paint = () => {
        icon.className = `fas fa-${userPaused ? 'play' : 'pause'}`;
        btn.setAttribute('aria-label', userPaused ? 'Play video' : 'Pause video');
    };
    let onScreen = true;
    const play = () => { if (!userPaused && onScreen) video.play().catch(() => {}); };
    // Pause decoding while the video is off-screen; it resumes by itself on return.
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) play(); else video.pause(); }, { threshold: 0.1 }).observe(video);
    }
    play();
    video.addEventListener('canplay', play);
    // Autoplay can be deferred by the browser until the tab is shown.
    document.addEventListener('visibilitychange', () => { if (!document.hidden) play(); });
    btn.addEventListener('click', () => {
        userPaused = !userPaused;
        if (userPaused) video.pause(); else play();
        paint();
    });
    paint();
}
