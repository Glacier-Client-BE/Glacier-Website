// Glacier Client site entry. Native ES modules, no bundler.
import { initShell } from './lib/shell.js';
import { initScene } from './lib/scene.js';
import { initData } from './lib/data.js';
import { initMods, initFaq, initToc, initGallery, initSearch, initRail } from './lib/pages.js';

initShell();
initScene();
initMods();
initFaq();
initToc();
initGallery();
initSearch();
initRail();
initData();
