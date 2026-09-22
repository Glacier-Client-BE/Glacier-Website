# Glacier-Website | Glacier Productions
- https://glacier-client-be.github.io/Glacier-Website/

- https://glacierclient.xyz
## JavaScript build

`index.html` loads one bundled file, `js/dist/app.min.js`, built from `js/bundle.js`
(which pulls in `js/main.js`, every module under `js/modules/`, and `js/kinetic.js`).
Edit the source files, then run `npm install && npm run build`. The
`stamp-version.yml` workflow also rebuilds the bundle on every push to `main`.
