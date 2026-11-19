// Copies MapLibre's module worker into /public so the browser can load it at a stable URL.
// Bundlers rewrite the library's import.meta.url-relative worker path, so we serve it ourselves.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const dist = path.dirname(require.resolve('maplibre-gl/package.json'));
const src = path.join(dist, 'dist', 'maplibre-gl-worker.mjs');
const outDir = path.join(process.cwd(), 'public', 'maplibre');
fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(src, path.join(outDir, 'maplibre-gl-worker.mjs'));
console.log('[maplibre] worker copied to public/maplibre/');
