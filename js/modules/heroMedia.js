// Hero deck: stacked cards (motion tour, then YouTube videos). The front card
// plays; when it ends the next one comes forward. Always playing unless the
// viewer pauses. Clicking a card behind brings it forward.
const ORDER = ['tour', 'trailer', 'teaser'];

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
    const order = ORDER.filter(n => cards[n]);
    const video = cards.tour.querySelector('video');
    const toggle = root.querySelector('.hero-media-toggle');
    const icon = toggle.querySelector('i');
    const players = {};
    let front = 'tour';
    let paused = false;

    const next = name => order[(order.indexOf(name) + 1) % order.length];

    const paint = () => {
        const start = order.indexOf(front);
        order.forEach((name, i) => {
            const depth = (i - start + order.length) % order.length;
            cards[name].dataset.pos = depth === 0 ? 'front' : depth === 1 ? 'back' : 'back2';
        });
        icon.className = `fas fa-${paused ? 'play' : 'pause'}`;
        toggle.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
    };

    async function playYT(name) {
        const YT = await loadYT();
        if (front !== name) return;
        const p = players[name];
        if (!p) {
            const box = cards[name].querySelector('.hero-teaser');
            const frameId = `heroFrame-${name}`;
            box.innerHTML = `<div id="${frameId}"></div>`;
            players[name] = new YT.Player(frameId, {
                videoId: cards[name].dataset.videoId,
                host: 'https://www.youtube-nocookie.com',
                playerVars: { autoplay: 1, mute: 1, playsinline: 1, rel: 0, modestbranding: 1, controls: 0 },
                events: {
                    onReady: e => { e.target.mute(); if (!paused && front === name) e.target.playVideo(); },
                    onStateChange: e => { if (e.data === YT.PlayerState.ENDED) bring(next(name)); },
                },
            });
        } else if (!paused) {
            p.seekTo?.(0);
            p.playVideo?.();
        }
    }

    function bring(name) {
        if (name === front) return;
        players[front]?.pauseVideo?.();
        front = name;
        paint();
        if (name === 'tour') {
            video.currentTime = 0;
            if (!paused) video.play().catch(() => {});
        } else {
            video.pause();
            playYT(name);
        }
    }

    video.addEventListener('ended', () => { if (!paused) bring(next('tour')); });
    for (const [name, el] of Object.entries(cards)) {
        const act = () => { if (front !== name) bring(name); };
        el.addEventListener('click', act);
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); }
        });
    }
    toggle.addEventListener('click', () => {
        paused = !paused;
        const p = players[front];
        if (front === 'tour') (paused ? video.pause() : video.play().catch(() => {}));
        else if (p?.getPlayerState) (paused ? p.pauseVideo() : p.playVideo());
        paint();
    });
    // Off-screen video is paused (saves decoding on phones) and resumes on its own when it scrolls back into view.
    let onScreen = true;
    const start = () => { if (front === 'tour' && !paused && onScreen) video.play().catch(() => {}); };
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(([e]) => {
            onScreen = e.isIntersecting;
            if (!onScreen) { video.pause(); players[front]?.pauseVideo?.(); return; }
            if (paused) return;
            if (front === 'tour') start(); else players[front]?.playVideo?.();
        }, { threshold: 0.1 }).observe(root);
    }
    video.addEventListener('canplay', start);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
    start();
    paint();
}
