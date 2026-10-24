// Hero deck: two stacked cards (motion tour, official v7 teaser). The front card
// plays; when it ends the cards trade places. Always playing unless the viewer
// pauses. Clicking the card behind brings it forward.
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
    const cards = Object.fromEntries([...root.querySelectorAll('.hero-card')].map(c => [c.dataset.card, c]));
    const video = cards.tour.querySelector('video');
    const teaser = cards.teaser.querySelector('.hero-teaser');
    const toggle = root.querySelector('.hero-media-toggle');
    const icon = toggle.querySelector('i');
    let front = 'tour';
    let paused = false;
    let player = null;

    const paint = () => {
        for (const [name, el] of Object.entries(cards)) el.dataset.pos = name === front ? 'front' : 'back';
        icon.className = `fas fa-${paused ? 'play' : 'pause'}`;
        toggle.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
    };

    async function playTeaser() {
        const YT = await loadYT();
        if (front !== 'teaser') return;
        if (!player) {
            teaser.innerHTML = '<div id="heroTeaserFrame"></div>';
            player = new YT.Player('heroTeaserFrame', {
                videoId: TEASER_ID,
                host: 'https://www.youtube-nocookie.com',
                playerVars: { autoplay: 1, mute: 1, playsinline: 1, rel: 0, modestbranding: 1, controls: 0 },
                events: {
                    onReady: e => { e.target.mute(); if (!paused && front === 'teaser') e.target.playVideo(); },
                    onStateChange: e => { if (e.data === YT.PlayerState.ENDED) bring('tour'); },
                },
            });
        } else if (!paused) {
            player.seekTo?.(0);
            player.playVideo();
        }
    }

    function bring(name) {
        if (name === front) return;
        front = name;
        paint();
        if (name === 'tour') {
            player?.pauseVideo?.();
            video.currentTime = 0;
            if (!paused) video.play().catch(() => {});
        } else {
            video.pause();
            playTeaser();
        }
    }

    video.addEventListener('ended', () => { if (!paused) bring('teaser'); });
    for (const [name, el] of Object.entries(cards)) {
        const act = () => { if (front !== name) bring(name); };
        el.addEventListener('click', act);
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); }
        });
    }
    toggle.addEventListener('click', () => {
        paused = !paused;
        if (front === 'tour') (paused ? video.pause() : video.play().catch(() => {}));
        else if (player?.getPlayerState) (paused ? player.pauseVideo() : player.playVideo());
        paint();
    });
    const start = () => { if (front === 'tour' && !paused) video.play().catch(() => {}); };
    video.addEventListener('canplay', start);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
    start();
    paint();
}
