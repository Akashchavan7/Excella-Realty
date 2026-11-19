'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import type { Map as MLMap, Marker } from 'maplibre-gl';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronDown, Compass, Layers, Loader2, MapPin, Navigation, RotateCcw, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MediaImage } from '@/components/ui/media-image';
import { neighbourhoods } from '@/content/company';
import { projects, statusLabel } from '@/content/projects';
import type { NeighbourhoodId, Project } from '@/content/types';
import { cn } from '@/lib/utils';
import { loadMaplibre } from './load-maplibre';
import { directionsUrl, enhanceMap, findTextFont, loadExcellaaStyle, PUNE_BOUNDS, PUNE_VIEW } from './map-style';

type Filter = 'all' | 'ongoing' | 'completed';

const mapped = projects.filter((p) => p.geo && p.status !== 'upcoming');

export function PuneExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markersRef = useRef<Map<string, { marker: Marker; el: HTMLElement; project: Project }>>(new Map());
  const reduce = useReducedMotion();

  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [inView, setInView] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [filter, setFilter] = useState<Filter>('all');
  const [active, setActive] = useState<NeighbourhoodId | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [pitched, setPitched] = useState(true);
  const listRef = useRef<HTMLUListElement>(null);
  const [moreBelow, setMoreBelow] = useState(false);

  const visibleProjects = useMemo(() => mapped.filter((p) => filter === 'all' || p.status === filter), [filter]);
  const hoods = useMemo(
    () =>
      neighbourhoods
        .map((n) => ({ ...n, projects: visibleProjects.filter((p) => p.neighbourhood === n.id) }))
        .filter((n) => n.projects.length > 0),
    [visibleProjects],
  );

  // Lazy-load MapLibre when the section approaches the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!inView || !containerRef.current || mapRef.current) return;
    let cancelled = false;
    setStatus('loading');
    const markers = markersRef.current;

    (async () => {
      try {
        const [maplibregl, style] = await Promise.all([loadMaplibre(), loadExcellaaStyle()]);
        if (cancelled || !containerRef.current) return;
        const touch = window.matchMedia('(pointer: coarse)').matches;
        const map = new maplibregl.Map({
          container: containerRef.current,
          style,
          center: PUNE_VIEW.center,
          zoom: touch ? PUNE_VIEW.zoom - 1.35 : PUNE_VIEW.zoom,
          pitch: PUNE_VIEW.pitch,
          bearing: PUNE_VIEW.bearing,
          maxBounds: PUNE_BOUNDS,
          maxPitch: 75,
          cooperativeGestures: true,
          attributionControl: { compact: true },
          fadeDuration: 200,
        });
        mapRef.current = map;
        if (!touch) map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');

        map.on('load', () => {
          enhanceMap(map, { exaggeration: 1.6 });
          // Neighbourhood labels in champagne, uppercase and tracked.
          map.addSource('excellaa-hoods', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: neighbourhoods.map((n) => ({
                type: 'Feature',
                properties: { name: n.name.toUpperCase() },
                geometry: { type: 'Point', coordinates: n.center },
              })),
            },
          });
          map.addLayer({
            id: 'excellaa-hood-labels',
            type: 'symbol',
            source: 'excellaa-hoods',
            layout: {
              'text-field': ['get', 'name'],
              'text-font': findTextFont(style),
              'text-size': ['interpolate', ['linear'], ['zoom'], 9, 10, 13, 13],
              'text-letter-spacing': 0.35,
              'text-offset': [0, 2.4],
              'text-allow-overlap': false,
            },
            paint: { 'text-color': '#e9d7b0', 'text-halo-color': '#05011a', 'text-halo-width': 1.5, 'text-opacity': 0.9 },
          });

          for (const p of mapped) {
            const el = document.createElement('button');
            el.type = 'button';
            el.setAttribute('aria-label', `${p.name}, ${p.locality} — ${statusLabel[p.status]}`);
            el.className = 'excellaa-marker group relative block cursor-pointer';
            el.dataset.status = p.status;
            const ring =
              p.geo!.precision === 'locality'
                ? 'border-2 border-current bg-navy-950/70'
                : p.status === 'ongoing'
                  ? 'bg-gold-500 border-2 border-navy-950'
                  : 'bg-ivory border-2 border-navy-950';
            el.innerHTML = `
              ${p.status === 'ongoing' ? '<span class="absolute -inset-2 rounded-full bg-gold-500/35 animate-ping"></span>' : ''}
              <span class="relative block size-4 rounded-full shadow-[0_0_0_4px_rgba(5,1,26,0.35)] transition-transform duration-300 group-hover:scale-125 ${ring} ${p.status === 'ongoing' ? 'text-gold-500' : 'text-ivory'}"></span>
              <span class="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap bg-navy-950/90 px-2.5 py-1 text-[11px] tracking-wide text-ivory opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 excellaa-marker-label">${p.name}</span>`;
            el.addEventListener('click', (e) => {
              e.stopPropagation();
              setSelected(p);
              if (p.neighbourhood) setActive(p.neighbourhood);
            });
            const marker = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([p.geo!.lng, p.geo!.lat]).addTo(map);
            markers.set(p.slug, { marker, el, project: p });
          }
          map.on('click', () => setSelected(null));
          setStatus('ready');
        });
        map.on('error', (e) => {
          // Tile hiccups are non-fatal; only a failed style is.
          if (!map.isStyleLoaded() && !cancelled) console.warn('[map]', e.error?.message);
        });
      } catch (err) {
        console.error(err);
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      markers.forEach(({ marker }) => marker.remove());
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [inView, attempt]);

  // Status filter → marker visibility (DOM only).
  useEffect(() => {
    markersRef.current.forEach(({ el, project }) => {
      el.style.display = filter === 'all' || project.status === filter ? '' : 'none';
    });
  }, [filter, status]);

  const changeFilter = (f: Filter) => {
    setFilter(f);
    if (selected && f !== 'all' && selected.status !== f) setSelected(null);
    if (active && f !== 'all' && !mapped.some((p) => p.neighbourhood === active && p.status === f)) setActive(null);
  };

  // Highlight active / selected markers and keep their labels visible.
  useEffect(() => {
    markersRef.current.forEach(({ el, project }) => {
      const on = selected?.slug === project.slug || (!!active && project.neighbourhood === active);
      el.style.zIndex = selected?.slug === project.slug ? '3' : on ? '2' : '1';
      const label = el.querySelector<HTMLElement>('.excellaa-marker-label');
      if (label) label.style.opacity = on ? '1' : '';
    });
  }, [active, selected]);

  const fly = useCallback(
    (center: [number, number], zoom: number, bearing?: number) => {
      mapRef.current?.flyTo({
        center,
        zoom,
        pitch: pitched ? 62 : 0,
        bearing: bearing ?? (pitched ? -24 : 0),
        duration: reduce ? 0 : 2600,
        essential: true,
      });
    },
    [pitched, reduce],
  );

  const selectHood = (id: NeighbourhoodId) => {
    const n = neighbourhoods.find((h) => h.id === id);
    if (!n) return;
    setActive(id);
    setSelected(null);
    // A slightly different camera angle per neighbourhood keeps transitions cinematic.
    fly(n.center, n.zoom, -10 - ((neighbourhoods.indexOf(n) * 11) % 30));
  };

  const selectProject = (p: Project) => {
    setSelected(p);
    if (p.neighbourhood) setActive(p.neighbourhood);
    if (p.geo) fly([p.geo.lng, p.geo.lat], 15.2);
  };

  const resetView = () => {
    setActive(null);
    setSelected(null);
    mapRef.current?.flyTo({ ...PUNE_VIEW, pitch: pitched ? PUNE_VIEW.pitch : 0, bearing: pitched ? PUNE_VIEW.bearing : 0, duration: reduce ? 0 : 2200 });
  };

  const togglePitch = () => {
    const next = !pitched;
    setPitched(next);
    mapRef.current?.easeTo({ pitch: next ? 58 : 0, bearing: next ? -16 : 0, duration: reduce ? 0 : 1200 });
  };

  const activeHood = hoods.find((h) => h.id === active);

  // Show a "more" hint while the neighbourhood list can still be scrolled down.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const update = () => setMoreBelow(el.scrollHeight - el.clientHeight - el.scrollTop > 12);
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    for (const child of Array.from(el.children)) ro.observe(child);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [hoods.length, active]);

  return (
    <div ref={sectionRef} className="relative grid grid-cols-1 overflow-hidden border border-navy-900/10 bg-white shadow-2xl shadow-navy-900/10 lg:h-[min(86vh,54rem)] lg:grid-cols-[25rem_minmax(0,1fr)]">
      {/* ── Left: neighbourhood image sidebar (desktop) ── */}
      <aside className="relative order-2 flex min-h-0 min-w-0 flex-col border-navy-900/10 bg-white lg:order-1 lg:border-r" aria-label="Neighbourhoods">
        <div className="flex items-center justify-between gap-3 border-b border-navy-900/10 px-5 py-4">
          <p className="eyebrow text-gold-600">Neighbourhoods</p>
          <p className="text-xs text-stone">{visibleProjects.length} projects mapped</p>
        </div>
        <ul ref={listRef} className="no-scrollbar flex gap-3 overflow-x-auto p-4 lg:block lg:flex-1 lg:space-y-0 lg:overflow-y-auto lg:overscroll-contain lg:p-0">
          {hoods.map((n) => {
            const isActive = n.id === active;
            return (
              <li key={n.id} className="w-[78vw] max-w-[320px] shrink-0 lg:w-auto lg:max-w-none">
                <button
                  type="button"
                  onClick={() => (isActive ? resetView() : selectHood(n.id))}
                  aria-pressed={isActive}
                  className={cn(
                    'group relative flex w-full items-stretch gap-4 overflow-hidden text-left transition-colors duration-500 lg:border-b lg:border-navy-900/10 lg:px-5 lg:py-2.5',
                    isActive ? 'bg-sand/80' : 'hover:bg-sand/50',
                  )}
                >
                  <span className={cn('absolute inset-y-0 left-0 w-0.5 bg-gold-500 transition-transform duration-500', isActive ? 'scale-y-100' : 'scale-y-0')} />
                  <span className="relative block h-24 w-28 shrink-0 overflow-hidden lg:h-14 lg:w-20">
                    {n.image && (
                      <MediaImage mediaKey={n.image} alt="" fill sizes="120px" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 py-1 pr-3 lg:pr-0">
                    <span className="display block text-2xl leading-tight text-navy-900 lg:text-[1.35rem]">{n.name}</span>
                    <span className="mt-0.5 block text-xs text-stone">
                      {n.projects.length} {n.projects.length === 1 ? 'project' : 'projects'} ·{' '}
                      {n.projects.some((p) => p.status === 'ongoing') ? <span className="font-medium text-gold-600">Ongoing</span> : 'Delivered'}
                    </span>
                  </span>
                  <ChevronDown className={cn('mr-4 hidden size-4 shrink-0 self-center text-stone transition-transform duration-500 lg:block lg:mr-0', isActive && 'rotate-180 text-gold-600')} aria-hidden />
                </button>
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="hidden overflow-hidden bg-sand/50 lg:block"
                    >
                      <div className="space-y-3 px-5 pb-5 pt-1">
                        <p className="text-sm leading-relaxed text-ink/65">{n.blurb}</p>
                        <p className="eyebrow text-[0.58rem] text-stone">Select a project to view it on the map</p>
                        <ul className="space-y-2">
                          {n.projects.map((p) => {
                            const isSelected = selected?.slug === p.slug;
                            return (
                              <li key={p.slug}>
                                <button
                                  type="button"
                                  onClick={() => selectProject(p)}
                                  aria-pressed={isSelected}
                                  className={cn(
                                    'group/row flex w-full items-center gap-3 rounded-full border px-4 py-2.5 text-left text-sm shadow-sm transition-all duration-300',
                                    isSelected
                                      ? 'border-navy-900 bg-navy-900 text-ivory'
                                      : 'border-navy-900/15 bg-white text-navy-900 hover:-translate-y-0.5 hover:border-navy-900/50 hover:shadow-md',
                                  )}
                                >
                                  <span className={cn('size-2 shrink-0 rounded-full', p.status === 'ongoing' ? 'bg-gold-500' : isSelected ? 'bg-ivory' : 'bg-navy-900')} />
                                  <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                                  <span className={cn('text-[0.6rem] uppercase tracking-[0.16em]', isSelected ? 'text-champagne' : 'text-stone')}>{statusLabel[p.status]}</span>
                                  <span
                                    className={cn(
                                      'grid size-7 shrink-0 place-items-center rounded-full transition-all duration-300',
                                      isSelected ? 'bg-gold-500 text-navy-950' : 'bg-navy-900/5 text-navy-900 group-hover/row:bg-navy-900 group-hover/row:text-ivory',
                                    )}
                                    aria-hidden
                                  >
                                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/row:translate-x-0.5" />
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
        {moreBelow && (
          <button
            type="button"
            onClick={() => listRef.current?.scrollBy({ top: 240, behavior: 'smooth' })}
            className="absolute inset-x-0 bottom-0 hidden items-end justify-center bg-gradient-to-t from-white via-white/90 to-transparent pb-3 pt-12 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-navy-900 lg:flex"
          >
            <span className="flex items-center gap-2 rounded-full border border-navy-900/15 bg-white px-4 py-2 shadow-sm">
              More neighbourhoods <ArrowDown className="size-3.5 animate-bounce" />
            </span>
          </button>
        )}
      </aside>

      {/* ── Right: the map ── */}
      <div className="relative order-1 h-[56svh] min-h-[400px] min-w-0 lg:order-2 lg:h-full">
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

        {status !== 'ready' && (
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,#140a52_0%,#05011a_70%)]">
            {status === 'error' ? (
              <div className="max-w-sm px-6 text-center">
                <MapPin className="mx-auto size-8 text-champagne" />
                <p className="display mt-4 text-3xl text-ivory">The map couldn’t load</p>
                <p className="mt-2 text-sm text-mist">Check your connection — every neighbourhood and project is still listed alongside.</p>
                <button type="button" onClick={() => setAttempt((a) => a + 1)} className="mt-5 text-sm text-champagne underline underline-offset-4">
                  Try again
                </button>
              </div>
            ) : (
              <p className="flex items-center gap-3 text-sm text-mist">
                <Loader2 className="size-4 animate-spin text-champagne" /> Rendering Pune in 3D…
              </p>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-3 sm:inset-x-5 sm:top-5">
          <div role="tablist" aria-label="Filter map by project status" className="pointer-events-auto flex rounded-full border border-champagne/25 bg-navy-950/80 p-1 backdrop-blur-md">
            {(['all', 'ongoing', 'completed'] as Filter[]).map((f) => (
              <button
                key={f}
                role="tab"
                type="button"
                aria-selected={filter === f}
                onClick={() => changeFilter(f)}
                className={cn(
                  'rounded-full px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300',
                  filter === f ? 'bg-gold-500 text-navy-950' : 'text-ivory/80 hover:text-champagne',
                )}
              >
                {f === 'all' ? 'All' : statusLabel[f]}
              </button>
            ))}
          </div>
          <div className="pointer-events-auto flex gap-2">
            <button type="button" onClick={togglePitch} className="flex h-10 items-center gap-2 rounded-full border border-champagne/25 bg-navy-950/80 px-4 text-xs text-ivory/85 backdrop-blur-md transition hover:text-champagne" aria-pressed={pitched}>
              <Layers className="size-4" /> {pitched ? '2D' : '3D'}
            </button>
            <button type="button" onClick={resetView} className="flex h-10 items-center gap-2 rounded-full border border-champagne/25 bg-navy-950/80 px-4 text-xs text-ivory/85 backdrop-blur-md transition hover:text-champagne">
              <RotateCcw className="size-4" /> <span className="hidden sm:inline">All Pune</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="pointer-events-none absolute bottom-4 left-4 hidden gap-5 bg-navy-950/75 px-4 py-3 text-[0.68rem] tracking-wide text-mist backdrop-blur-md sm:flex">
          <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-gold-500" /> Ongoing</span>
          <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-ivory" /> Completed</span>
          <span className="flex items-center gap-2"><span className="size-2.5 rounded-full border-2 border-ivory" /> Locality-level location</span>
        </div>

        {/* Active neighbourhood caption (mobile) */}
        {activeHood && !selected && (
          <div className="absolute inset-x-3 bottom-3 bg-navy-950/90 p-4 backdrop-blur-md lg:hidden">
            <p className="display text-2xl text-ivory">{activeHood.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-mist">{activeHood.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeHood.projects.map((p) => (
                <button key={p.slug} type="button" onClick={() => selectProject(p)} className="rounded-full border border-champagne/30 px-3 py-1.5 text-xs text-ivory">
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Project popup */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 bottom-3 z-10 bg-navy-950/95 text-ivory shadow-2xl shadow-black/50 backdrop-blur-xl sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-20 sm:w-[22.5rem]"
              role="dialog"
              aria-label={`${selected.name} details`}
            >
              <button type="button" onClick={() => setSelected(null)} className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-navy-950/70 text-ivory" aria-label="Close">
                <X className="size-4" />
              </button>
              <div className="flex gap-4 p-4 sm:block sm:p-0">
                <p className="eyebrow hidden px-5 pb-3 pt-5 text-champagne sm:flex sm:items-center sm:gap-2">
                  <MapPin className="size-3.5" /> {selected.locality}
                </p>
                <div className="relative aspect-square w-24 shrink-0 overflow-hidden sm:aspect-[16/10] sm:w-full">
                  {selected.cover && <MediaImage mediaKey={selected.cover} alt={selected.name} fill sizes="360px" className="object-cover" />}
                </div>
                <div className="min-w-0 sm:p-5">
                  <p className="eyebrow text-champagne sm:hidden">{selected.locality}</p>
                  <p className="display mt-1 text-3xl leading-none sm:mt-0">{selected.name}</p>
                  <p className="mt-2 text-sm text-mist">{selected.configuration}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className={cn('px-2 py-0.5 font-semibold uppercase tracking-[0.15em]', selected.status === 'ongoing' ? 'bg-gold-500 text-navy-950' : 'bg-ivory/90 text-navy-950')}>
                      {statusLabel[selected.status]}
                    </span>
                    {selected.rera[0] && <span className="text-mist">MahaRERA {selected.rera[0].number}</span>}
                  </p>
                  {selected.geo?.precision === 'locality' && (
                    <p className="mt-2 text-[0.7rem] text-mist/80">Pin shows the locality; Excellaa publishes the exact address on the project page.</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/projects/${selected.slug}`} className="inline-flex h-10 items-center gap-2 bg-gold-500 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-navy-950">
                      Explore <ArrowUpRight className="size-4" />
                    </Link>
                    {selected.geo && (
                      <a
                        href={directionsUrl(selected.geo.lat, selected.geo.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center gap-2 border border-ivory/25 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ivory"
                      >
                        <Navigation className="size-3.5" /> Directions
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {status === 'ready' && !selected && !activeHood && (
          <p className="pointer-events-none absolute bottom-4 right-16 hidden items-center gap-2 text-xs text-mist/80 lg:flex">
            <Compass className="size-4 text-champagne" /> Choose a neighbourhood or tap a marker
          </p>
        )}
      </div>
    </div>
  );
}
