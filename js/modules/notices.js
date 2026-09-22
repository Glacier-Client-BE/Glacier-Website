'use strict';

// One floating notice at a time. The stale-build bar, the release
// announcement and the donation prompt each enqueue a `show` callback here
// instead of revealing themselves directly; the next one only appears once the
// visible one reports it's done (dismissed or clicked through), so they can
// never stack on screen together.

const queue = [];
let active = null;

export function enqueueNotice(id, show) {
    if (active === id || queue.some(n => n.id === id)) return;
    queue.push({ id, show });
    if (!active) next();
}

export function noticeDone(id) {
    if (active !== id) {
        const i = queue.findIndex(n => n.id === id);
        if (i !== -1) queue.splice(i, 1);
        return;
    }
    active = null;
    next();
}

function next() {
    const n = queue.shift();
    if (!n) return;
    active = n.id;
    n.show();
}
