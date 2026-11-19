'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import type { Map as MLMap } from 'maplibre-gl';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { GeoPoint } from '@/content/types';
import { loadMaplibre } from './load-maplibre';
import { enhanceMap, loadExcellaaStyle, PUNE_BOUNDS } from './map-style';

interface Neighbour {
  name: string;
  slug: string;
  lat: number;
  lng: number;
}

/** Single-project 3D map with the site marker and other Excellaa addresses nearby. */
export function ProjectMap({ name, geo, neighbours = [] }: { name: string; geo: GeoPoint; neighbours?: Neighbour[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => {
      if (e.some((x) => x.isIntersecting)) {
        setInView(true);
        io.disconnect();
      }
    }, { rootMargin: '300px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !ref.current || mapRef.current) return;
    let cancelled = false;
    setState('loading');
    (async () => {
      try {
        const [maplibregl, style] = await Promise.all([loadMaplibre(), loadExcellaaStyle()]);
        if (cancelled || !ref.current) return;
        const outsidePune = geo.lng < PUNE_BOUNDS[0][0] || geo.lng > PUNE_BOUNDS[1][0];
        const map = new maplibregl.Map({
          container: ref.current,
          style,
          center: [geo.lng, geo.lat],
          zoom: geo.precision === 'site' ? 14.6 : 13.4,
          pitch: 60,
          bearing: -20,
          cooperativeGestures: true,
          attributionControl: { compact: true },
          maxBounds: outsidePune ? undefined : PUNE_BOUNDS,
        });
        mapRef.current = map;
        map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
        map.on('load', () => {
          enhanceMap(map, { exaggeration: 1.4 });
          for (const n of neighbours) {
            const e = document.createElement('a');
            e.href = `/projects/${n.slug}`;
            e.className = 'group relative block';
            e.setAttribute('aria-label', n.name);
            e.innerHTML = `<span class="block size-3 rounded-full border-2 border-navy-950 bg-ivory/80"></span><span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap bg-navy-950/85 px-2 py-0.5 text-[11px] text-ivory opacity-0 transition group-hover:opacity-100">${n.name}</span>`;
            new maplibregl.Marker({ element: e }).setLngLat([n.lng, n.lat]).addTo(map);
          }
          const el = document.createElement('div');
          el.className = 'relative';
          el.innerHTML = `
            <span class="absolute -inset-3 rounded-full bg-gold-500/30 animate-ping"></span>
            <span class="relative block size-5 rounded-full border-[3px] border-navy-950 bg-gold-500 shadow-[0_0_0_6px_rgba(234,161,0,0.25)]"></span>
            <span class="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap bg-gold-500 px-3 py-1 text-xs font-semibold tracking-wide text-navy-950">${name}</span>`;
          new maplibregl.Marker({ element: el }).setLngLat([geo.lng, geo.lat]).addTo(map);
          map.easeTo({ bearing: 20, duration: 9000, easing: (t) => t });
          setState('ready');
        });
      } catch (err) {
        console.error(err);
        if (!cancelled) setState('error');
      }
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- map is created once per mount
  }, [inView]);

  return (
    <div className="relative h-[480px] overflow-hidden bg-navy-950 lg:h-[37.5rem]">
      <div ref={ref} style={{ position: 'absolute', inset: 0 }} />
      {state !== 'ready' && (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,#140a52_0%,#05011a_70%)] text-sm text-mist">
          {state === 'error' ? 'Map unavailable — use the directions link.' : (
            <span className="flex items-center gap-3"><Loader2 className="size-4 animate-spin text-champagne" /> Loading location…</span>
          )}
        </div>
      )}
    </div>
  );
}
