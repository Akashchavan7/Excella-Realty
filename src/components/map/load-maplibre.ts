let loader: Promise<typeof import('maplibre-gl')> | null = null;

/** Loads MapLibre on demand and points it at the worker served from /public/maplibre. */
export function loadMaplibre() {
  loader ??= import('maplibre-gl').then((maplibregl) => {
    maplibregl.setWorkerUrl(new URL('/maplibre/maplibre-gl-worker.mjs', window.location.origin).href);
    return maplibregl;
  });
  return loader;
}
