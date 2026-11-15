// Glacier Client site entry. Native ES modules, no bundler.
import { initShell } from './lib/shell.js?v=20261115202409';
import { initScene } from './lib/scene.js?v=20261115202409';
import { initData } from './lib/data.js?v=20261115202409';
import { initMods, initFaq, initToc, initGallery, initSearch, initRail } from './lib/pages.js?v=20261115202409';

initShell();
initScene();
initMods();
initFaq();
initToc();
initGallery();
initSearch();
initRail();
initData();
