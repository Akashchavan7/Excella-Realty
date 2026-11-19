import type { Map as MLMap, StyleSpecification, LayerSpecification } from 'maplibre-gl';

/**
 * Base map: OpenFreeMap "dark" vector style (OpenStreetMap data, free for commercial use,
 * no API key) recoloured to the Excellaa palette, plus Terrarium elevation tiles from the
 * AWS Open Data registry for real 3D terrain of the Sahyadri ridges around Pune.
 */
export const BASE_STYLE_URL = 'https://tiles.openfreemap.org/styles/dark';
const TERRARIUM_TILES = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';

export const PUNE_VIEW = { center: [73.795, 18.528] as [number, number], zoom: 10.95, pitch: 56, bearing: -16 };
export const PUNE_BOUNDS: [[number, number], [number, number]] = [
  [73.35, 18.25],
  [74.25, 18.85],
];

const C = {
  background: '#1c1759',
  land: '#221c66',
  park: '#23266e',
  water: '#3a3aa6',
  waterLine: '#4a49b8',
  building: '#332b85',
  roadMajor: '#7a70d6',
  roadMid: '#584eb4',
  roadMinor: '#3f3692',
  rail: '#4a4199',
  boundary: '#6258bd',
  label: '#c3bfe6',
  labelPlace: '#cfcbee',
  halo: '#15104a',
};

function recolourLayer(layer: LayerSpecification): LayerSpecification | null {
  const id = layer.id.toLowerCase();
  const l = structuredClone(layer) as LayerSpecification & { paint?: Record<string, unknown>; layout?: Record<string, unknown> };
  l.paint = l.paint ?? {};

  switch (l.type) {
    case 'background':
      l.paint['background-color'] = C.background;
      break;
    case 'fill':
      if (id.includes('water')) l.paint['fill-color'] = C.water;
      else if (id.includes('building')) l.paint['fill-color'] = C.building;
      else if (/park|wood|grass|forest|landcover|scrub/.test(id)) {
        l.paint['fill-color'] = C.park;
        l.paint['fill-opacity'] = 0.6;
      } else {
        l.paint['fill-color'] = C.land;
        l.paint['fill-opacity'] = 0.5;
      }
      delete l.paint['fill-pattern'];
      delete l.paint['fill-outline-color'];
      break;
    case 'line':
      if (id.includes('water') || id.includes('river')) l.paint['line-color'] = C.waterLine;
      else if (id.includes('boundary') || id.includes('admin')) l.paint['line-color'] = C.boundary;
      else if (id.includes('rail')) l.paint['line-color'] = C.rail;
      else if (/motorway|trunk/.test(id)) l.paint['line-color'] = C.roadMajor;
      else if (/primary|secondary/.test(id)) l.paint['line-color'] = C.roadMid;
      else l.paint['line-color'] = C.roadMinor;
      break;
    case 'symbol': {
      if (id.includes('poi') || id.includes('shield') || id.includes('housenumber')) return null;
      const place = id.includes('place') || id.includes('suburb') || id.includes('neighbourhood');
      l.paint['text-color'] = place ? C.labelPlace : C.label;
      l.paint['text-halo-color'] = C.halo;
      l.paint['text-halo-width'] = 1.2;
      if (place) l.paint['text-opacity'] = 0.75;
      break;
    }
    case 'fill-extrusion':
      return null; // replaced by our own extrusion layer
    default:
      break;
  }
  return l;
}

export async function loadExcellaaStyle(): Promise<StyleSpecification> {
  const res = await fetch(BASE_STYLE_URL, { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Map style failed: ${res.status}`);
  const base = (await res.json()) as StyleSpecification;
  const layers = base.layers.map(recolourLayer).filter((l): l is LayerSpecification => !!l);

  return {
    ...base,
    sources: {
      ...base.sources,
      'terrain-dem': {
        type: 'raster-dem',
        tiles: [TERRARIUM_TILES],
        encoding: 'terrarium',
        tileSize: 256,
        maxzoom: 14,
        attribution: 'Terrain: Mapzen / AWS Open Data',
      },
      'hillshade-dem': {
        type: 'raster-dem',
        tiles: [TERRARIUM_TILES],
        encoding: 'terrarium',
        tileSize: 256,
        maxzoom: 14,
      },
    },
    layers,
  };
}

/** Text font stack that the base style's glyph server provides. */
export function findTextFont(style: StyleSpecification): string[] {
  for (const l of style.layers) {
    const f = (l as { layout?: { 'text-font'?: unknown } }).layout?.['text-font'];
    if (Array.isArray(f) && f.every((x) => typeof x === 'string')) return f as string[];
  }
  return ['Noto Sans Regular'];
}

/** Adds hillshade, 3D buildings, terrain and sky once the style has loaded. */
export function enhanceMap(map: MLMap, opts: { exaggeration?: number } = {}) {
  const firstSymbol = map.getStyle().layers.find((l) => l.type === 'symbol')?.id;

  if (!map.getLayer('excellaa-hillshade')) {
    map.addLayer(
      {
        id: 'excellaa-hillshade',
        type: 'hillshade',
        source: 'hillshade-dem',
        paint: {
          'hillshade-shadow-color': '#0d0838',
          'hillshade-highlight-color': '#6f64d2',
          'hillshade-accent-color': '#231c6c',
          'hillshade-exaggeration': 0.55,
          'hillshade-illumination-direction': 315,
        },
      },
      firstSymbol,
    );
  }

  const vectorSource = Object.entries(map.getStyle().sources).find(([, s]) => s.type === 'vector')?.[0];
  if (vectorSource && !map.getLayer('excellaa-buildings-3d')) {
    map.addLayer(
      {
        id: 'excellaa-buildings-3d',
        type: 'fill-extrusion',
        source: vectorSource,
        'source-layer': 'building',
        minzoom: 13.5,
        paint: {
          'fill-extrusion-color': ['interpolate', ['linear'], ['coalesce', ['get', 'render_height'], 8], 0, '#3a3192', 60, '#6258c4'],
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 13.5, 0, 15, ['coalesce', ['get', 'render_height'], 8]],
          'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
          'fill-extrusion-opacity': 0.85,
        },
      },
      firstSymbol,
    );
  }

  map.setTerrain({ source: 'terrain-dem', exaggeration: opts.exaggeration ?? 1.5 });
  map.setSky({
    'sky-color': '#17124f',
    'horizon-color': '#4a40a8',
    'fog-color': '#1c1759',
    'sky-horizon-blend': 0.6,
    'horizon-fog-blend': 0.7,
    'fog-ground-blend': 0.4,
  });
}

export function directionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
