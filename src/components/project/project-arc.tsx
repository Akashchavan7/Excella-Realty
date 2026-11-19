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
 * Cover-flow carousel: the active project faces the viewer in the centre while its
 * neighbours turn away in 3D and stack behind it. It loops endlessly in both
 * directions. Drag, scroll sideways or use the arrow keys; Enter opens.
 */
export function ProjectArc({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');
  // `step` is unbounded so the carousel can keep turning; the active card is step mod count.
  const [step, setStep] = useState(0);
  const [cardW, setCardW] = useState(300);
  const pos = useMotionValue(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; start: number; moved: boolean } | null>(null);
  const wheelLock = useRef(0);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: projects.length, ongoing: 0, upcoming: 0, completed: 0 };
    for (const p of projects) c[p.status]++;
    return c;
  }, [projects]);
  const visible = useMemo(() => (filter === 'all' ? projects : projects.filter((p) => p.status === filter)), [filter, projects]);
  const count = visible.length;
  const active = count ? ((step % count) + count) % count : 0;

  useEffect(() => {
    const onResize = () => {
      // Follow the root font size so the carousel scales with the rest of the layout on big screens.
      const k = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
      setCardW(window.innerWidth < 640 ? Math.round(window.innerWidth * 0.7) : Math.round((window.innerWidth < 1280 ? 460 : 600) * k));
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const goTo = useCallback(
    (target: number) => {
      setStep(target);
      animate(pos, target, reduce ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 26 });
    },
    [pos, reduce],
  );

  const changeFilter = (f: Filter) => {
    setFilter(f);
    setStep(0);
    pos.set(0);
  };

  // Drag distance that advances the carousel by one card.
  const spacing = cardW * 0.55;

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
    if (d.moved) pos.set(d.start - dx / spacing);
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
    goTo(step + (e.deltaX > 0 ? 1 : -1));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(step + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(step - 1); }
    if (e.key === 'Enter' && visible[active]) router.push(`/projects/${visible[active].slug}`);
  };

  const onCardClick = (i: number) => {
    if (drag.current?.moved) return;
    if (i === active) {
      router.push(`/projects/${visible[i]!.slug}`);
      return;
    }
    // Turn the shorter way round the loop.
    let delta = (((i - active) % count) + count) % count;
    if (delta > count / 2) delta -= count;
    goTo(step + delta);
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
          <button type="button" onClick={() => goTo(step - 1)} aria-label="Previous project" className="grid size-12 place-items-center rounded-full border border-navy-900/20 text-navy-900 transition hover:bg-navy-900 hover:text-ivory">
            <ArrowLeft className="size-5" />
          </button>
          <button type="button" onClick={() => goTo(step + 1)} aria-label="Next project" className="grid size-12 place-items-center rounded-full border border-navy-900/20 text-navy-900 transition hover:bg-navy-900 hover:text-ivory">
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
        className="relative mt-4 cursor-grab touch-pan-y select-none overflow-hidden outline-none active:cursor-grabbing"
        style={{ height: (cardW < 400 ? cardW * 1.25 : cardW * 0.75) + Math.max(150, cardW * 0.27), perspective: Math.max(1700, cardW * 2.9) }}
      >
        {visible.map((p, i) => (
          <ArcCard key={`${filter}-${p.slug}`} project={p} index={i} count={count} pos={pos} cardW={cardW} active={i === active} onClick={() => onCardClick(i)} />
        ))}
      </div>

      <div className="container-wide mt-2 flex flex-col items-center gap-3 text-center">
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
  count,
  pos,
  cardW,
  active,
  onClick,
}: {
  project: Project;
  index: number;
  count: number;
  pos: MotionValue<number>;
  cardW: number;
  active: boolean;
  onClick: () => void;
}) {
  // Signed distance from the centre, wrapped so the list forms a loop.
  const offset = useTransform(pos, (v) => {
    let o = (((index - v) % count) + count) % count;
    if (o > count / 2) o -= count;
    return o;
  });
  // Cards fade out before the point where they wrap round to the other side.
  const limit = Math.max(1.2, Math.min(3.6, count / 2 - 0.3));
  // Within one step of the centre the card swings open; beyond that the cards stack closely.
  const x = useTransform(offset, (o) => {
    const c = Math.max(-1, Math.min(1, o));
    return c * cardW * 0.66 + (o - c) * cardW * 0.2;
  });
  const rotateY = useTransform(offset, (o) => Math.max(-1, Math.min(1, o)) * -62);
  const z = useTransform(offset, (o) => -Math.min(Math.abs(o), 1) * 260 - Math.max(0, Math.abs(o) - 1) * 40);
  const opacity = useTransform(offset, (o) => Math.max(0, Math.min(1, (limit - Math.abs(o)) / 0.5)));
  const zIndex = useTransform(offset, (o) => 20 - Math.round(Math.abs(o)));
  const filter = useTransform(offset, (o) => `brightness(${1 - Math.min(Math.abs(o), 1) * 0.28})`);

  return (
    <motion.div
      id={`arc-${project.slug}`}
      role="option"
      aria-selected={active}
      onClick={onClick}
      className="absolute left-1/2 top-6 cursor-pointer"
      style={{ width: cardW, marginLeft: -cardW / 2, x, z, rotateY, opacity, zIndex, filter }}
    >
      {/* Location — above the image */}
      <p className={cn('eyebrow mb-3 flex items-center justify-center gap-1.5 text-[0.62rem] text-gold-600 transition-opacity duration-500', active ? 'opacity-100' : 'opacity-0')}>
        <MapPin className="size-3" aria-hidden /> {project.locality.split(',')[0]}
      </p>
      <div className={cn('relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[4/3] bg-navy-900 shadow-xl shadow-navy-900/20 transition-shadow duration-500', active && 'shadow-2xl shadow-navy-900/35')}>
        {project.cover ? (
          <MediaImage mediaKey={project.cover} alt={`${project.name}, ${project.locality}`} fill sizes="(min-width:1700px) 36vw, (min-width:1280px) 600px, (min-width:640px) 460px, 70vw" draggable={false} className="pointer-events-none object-cover" />
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
      <p className={cn('display mt-4 text-center text-[1.9rem] leading-tight text-navy-900 transition-opacity duration-500', active ? 'opacity-100' : 'opacity-0')}>{project.name}</p>
      <p className={cn('mt-1 text-center text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-navy-900 transition-opacity duration-500', active ? 'opacity-100' : 'opacity-0')}>
        Explore project
      </p>
    </motion.div>
  );
}
