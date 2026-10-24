// Hero media: the motion tour plays once, swaps to the official v7 teaser
// (YouTube, muted), and swaps back when the teaser ends. Always playing unless
// the viewer pauses; the pills switch manually.
const TEASER_ID = 'vkaY68eebOA';

let ytReady;
function loadYT() {
    if (ytReady) return ytReady;
    ytReady = new Promise(resolve => {
        if (window.YT && window.YT.Player) return resolve(window.YT);
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(window.YT); };
        const s = document.createElement('script');
        s.src = 'https://www.youtube.com/iframe_api';
        s.async = true;
        document.head.appendChild(s);
    });
    return ytReady;
}

export function setupHeroMedia() {
    const root = document.getElementById('heroMedia');
    if (!root) return;
    const video = root.querySelector('.hero-motion');
    const teaser = root.querySelector('.hero-teaser');
    const pills = [...root.querySelectorAll('.hero-pill')];
    const toggle = root.querySelector('.hero-media-toggle');
    const icon = toggle.querySelector('i');
    let mode = 'tour';
    let paused = false;
    let player = null;

    const paint = () => {
        pills.forEach(p => p.classList.toggle('is-on', p.dataset.media === mode));
        icon.className = `fas fa-${paused ? 'play' : 'pause'}`;
        toggle.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
        video.classList.toggle('is-on', mode === 'tour');
        teaser.classList.toggle('is-on', mode === 'teaser');
        teaser.setAttribute('aria-hidden', String(mode !== 'teaser'));
    };

    async function showTeaser() {
        mode = 'teaser';
        video.pause();
        paint();
        const YT = await loadYT();
        if (mode !== 'teaser') return;
        if (!player) {
            teaser.innerHTML = '<div id="heroTeaserFrame"></div>';
            player = new YT.Player('heroTeaserFrame', {
                videoId: TEASER_ID,
                host: 'https://www.youtube-nocookie.com',
                playerVars: { autoplay: 1, mute: 1, playsinline: 1, rel: 0, modestbranding: 1 },
                events: {
                    onReady: e => { e.target.mute(); if (!paused) e.target.playVideo(); },
                    onStateChange: e => { if (e.data === YT.PlayerState.ENDED) showTour(); },
                },
            });
        } else if (!paused) {
            player.playVideo();
        }
    }

    function showTour() {
        mode = 'tour';
        player?.pauseVideo?.();
        video.currentTime = 0;
        if (!paused) video.play().catch(() => {});
        paint();
    }

    video.addEventListener('ended', () => { if (!paused) showTeaser(); });
    pills.forEach(p => p.addEventListener('click', () => (p.dataset.media === 'teaser' ? showTeaser() : showTour())));
    toggle.addEventListener('click', () => {
        paused = !paused;
        if (mode === 'tour') (paused ? video.pause() : video.play().catch(() => {}));
        else if (player?.getPlayerState) (paused ? player.pauseVideo() : player.playVideo());
        paint();
    });
    const start = () => { if (mode === 'tour' && !paused) video.play().catch(() => {}); };
    video.addEventListener('canplay', start);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
    start();
    paint();
}
