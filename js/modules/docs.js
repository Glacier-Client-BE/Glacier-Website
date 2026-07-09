'use strict';

// Highlights the active Docs TOC link as its section scrolls into view.
export function setupDocsToc() {
    const nav = document.querySelector('.docs-toc');
    if (!nav) return;
    const links = [...nav.querySelectorAll('.docs-toc-link')];
    if (!links.length) return;

    const targets = links
        .map(l => document.getElementById(l.getAttribute('href').slice(1)))
        .filter(Boolean);
    if (!targets.length) return;

    const setActive = id => {
        for (const l of links) l.classList.toggle('active', l.getAttribute('href') === '#' + id);
    };

    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (entry.isIntersecting) setActive(entry.target.id);
        }
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    for (const t of targets) observer.observe(t);

    for (const l of links) {
        l.addEventListener('click', e => {
            e.preventDefault();
            const target = document.getElementById(l.getAttribute('href').slice(1));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}
