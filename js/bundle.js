'use strict';

// Build entry for `npm run build`. Pulls main.js (and its whole module graph)
// plus the kinetic layer into one minified js/dist/app.min.js, which is what
// index.html ships. The source files stay separate modules; edit those, not
// the bundle. Order matches the old <script> tags: main.js, then kinetic.js.

import './main.js';
import './kinetic.js';
