'use client';

import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MediaImage } from '@/components/ui/media-image';
import { statusLabel } from '@/content/projects';
import type { Project, ProjectStatus } from '@/content/types';
import { cn } from '@/lib/utils';

type Filter = 'all' | ProjectStatus;

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

/**
 * Arc carousel: the active project stands upright in the centre while its neighbours
 * fan out along a curve. Drag, scroll sideways or use the arrow keys; Enter opens.
 */
export function ProjectArc({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');
  const startIndex = (n: number) => Math.min(2, Math.max(0, n - 1));
  const [active, setActive] = useState(() => startIndex(projects.length));
  const [cardW, setCardW] = useState(300);
  const pos = useMotionValue(startIndex(projects.length));
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; start: number; moved: boolean } | null>(null);
  const wheelLock = useRef(0);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: projects.length, ongoing: 0, upcoming: 0, completed: 0 };
    for (const p of projects) c[p.status]++;
    return c;
  }, [projects]);
  const visible = useMemo(() => (filter === 'all' ? projects : projects.filter((p) => p.status === filter)), [filter, projects]);
  const last = visible.length - 1;

  useEffect(() => {
    const onResize = () => setCardW(window.innerWidth < 640 ? Math.round(window.innerWidth * 0.6) : window.innerWidth < 1280 ? 270 : 310);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const target = Math.max(0, Math.min(last, i));
      setActive(target);
      animate(pos, target, reduce ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 26 });
    },
    [last, pos, reduce],
  );

  const changeFilter = (f: Filter) => {
    const start = startIndex(counts[f]);
    setFilter(f);
    setActive(start);
    pos.set(start);
  };

  const spacing = cardW * 1.32;

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, start: pos.get(), moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 6 && !d.moved) {
      d.moved = true;
      stageRef.current?.setPointerCapture(e.pointerId);
    }
    if (d.moved) pos.set(Math.max(-0.4, Math.min(last + 0.4, d.start - dx / spacing)));
  };
  const onPointerUp = () => {
    const d = drag.current;
    if (!d) return;
    if (d.moved) goTo(Math.round(pos.get()));
    // keep the "moved" flag for the click handler that fires right after
    setTimeout(() => (drag.current = null), 0);
  };

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) || Math.abs(e.deltaX) < 12) return;
    const now = Date.now();
    if (now - wheelLock.current < 380) return;
    wheelLock.current = now;
    goTo(active + (e.deltaX > 0 ? 1 : -1));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); }
    if (e.key === 'Enter' && visible[active]) router.push(`/projects/${visible[active].slug}`);
  };

  const onCardClick = (i: number) => {
    if (drag.current?.moved) return;
    if (i === active) router.push(`/projects/${visible[i]!.slug}`);
    else goTo(i);
  };

  const current = visible[active];

  return (
    <div>
      <div className="container-wide flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Filter projects by status" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              type="button"
              aria-selected={filter === f.id}
              onClick={() => changeFilter(f.id)}
              className={cn(
                'shrink-0 rounded-full border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-300',
                filter === f.id ? 'border-navy-900 bg-navy-900 text-ivory' : 'border-navy-900/15 text-ink/70 hover:border-navy-900/50',
              )}
            >
              {f.label} <span className="opacity-60">({counts[f.id]})</span>
            </button>
          ))}
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous project" className="grid size-12 place-items-center rounded-full border border-navy-900/20 text-navy-900 transition hover:bg-navy-900 hover:text-ivory disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-navy-900">
            <ArrowLeft className="size-5" />
          </button>
          <button type="button" onClick={() => goTo(active + 1)} disabled={active === last} aria-label="Next project" className="grid size-12 place-items-center rounded-full border border-navy-900/20 text-navy-900 transition hover:bg-navy-900 hover:text-ivory disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-navy-900">
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        role="listbox"
        aria-label="Projects"
        aria-activedescendant={current ? `arc-${current.slug}` : undefined}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        className="relative mt-6 cursor-grab touch-pan-y select-none overflow-hidden outline-none active:cursor-grabbing"
        style={{ height: cardW * 1.3 + 250 }}
      >
        {visible.map((p, i) => (
          <ArcCard key={`${filter}-${p.slug}`} project={p} index={i} pos={pos} cardW={cardW} spacing={spacing} active={i === active} onClick={() => onCardClick(i)} />
        ))}
      </div>

      <div className="container-wide -mt-4 flex flex-col items-center gap-3 text-center">
        {current && (
          <p className="text-sm text-ink/70" aria-live="polite">
            <span className="font-medium text-navy-900">{current.configuration}</span>
            <span className="mx-2 text-stone">·</span>
            <span className={cn(current.status === 'ongoing' ? 'text-gold-600' : 'text-stone')}>{statusLabel[current.status]}</span>
          </p>
        )}
        <p className="text-xs text-stone">
          <span className="hidden sm:inline">Drag, scroll sideways or use the arrow keys. Press Enter to open.</span>
          <span className="sm:hidden">Swipe to browse. Tap the centre card to open.</span>
        </p>
      </div>
    </div>
  );
}

function ArcCard({
  project,
  index,
  pos,
  cardW,
  spacing,
  active,
  onClick,
}: {
  project: Project;
  index: number;
  pos: MotionValue<number>;
  cardW: number;
  spacing: number;
  active: boolean;
  onClick: () => void;
}) {
  const offset = useTransform(pos, (v) => index - v);
  const x = useTransform(offset, (o) => o * spacing);
  const y = useTransform(offset, (o) => Math.min(o * o * 26, 220));
  const rotate = useTransform(offset, (o) => Math.max(-28, Math.min(28, o * 8)));
  const scale = useTransform(offset, (o) => 1 - Math.min(Math.abs(o), 2) * 0.06);
  const opacity = useTransform(offset, (o) => (Math.abs(o) > 3.2 ? 0 : 1));
  const zIndex = useTransform(offset, (o) => 20 - Math.round(Math.abs(o)));

  return (
    <motion.div
      id={`arc-${project.slug}`}
      role="option"
      aria-selected={active}
      onClick={onClick}
      className="absolute left-1/2 top-10 cursor-pointer"
      style={{ width: cardW, marginLeft: -cardW / 2, x, y, rotate, scale, opacity, zIndex, transformOrigin: '50% 120%' }}
    >
      {/* Location — above the image */}
      <p className="eyebrow mb-3 flex items-center justify-center gap-1.5 text-[0.6rem] text-gold-600">
        <MapPin className="size-3" aria-hidden /> {project.locality.split(',')[0]}
      </p>
      <div className={cn('relative aspect-[3/4] overflow-hidden rounded-2xl bg-navy-900 shadow-xl shadow-navy-900/15 transition-shadow duration-500', active && 'shadow-2xl shadow-navy-900/30')}>
        {project.cover ? (
          <MediaImage mediaKey={project.cover} alt={`${project.name}, ${project.locality}`} fill sizes="320px" draggable={false} className="pointer-events-none object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <span className="absolute inset-4 rounded-xl border border-champagne/40" aria-hidden />
            <p className="eyebrow text-champagne">Coming soon</p>
            <p className="display mt-3 text-3xl text-ivory">{project.name}</p>
          </div>
        )}
        <span
          className={cn(
            'absolute left-3 top-3 rounded-full px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.18em]',
            project.status === 'ongoing' && 'bg-gold-500 text-navy-950',
            project.status === 'upcoming' && 'bg-ivory/90 text-navy-900',
            project.status === 'completed' && 'bg-navy-950/75 text-ivory',
          )}
        >
          {statusLabel[project.status]}
        </span>
        <span className={cn('absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-ivory text-navy-900 transition-all duration-500', active ? 'scale-100 opacity-100' : 'scale-75 opacity-0')} aria-hidden>
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <p className="display mt-4 text-center text-[1.7rem] leading-tight text-navy-900">{project.name}</p>
      <p className={cn('mt-1 text-center text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-navy-900 transition-opacity duration-500', active ? 'opacity-100' : 'opacity-0')}>
        Explore project
      </p>
    </motion.div>
  );
}
