'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import type { Project, ProjectStatus } from '@/content/types';
import { cn } from '@/lib/utils';
import { ProjectCard } from './project-card';

type Filter = 'all' | ProjectStatus;

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

export function ProjectFilterGrid({
  projects,
  tone = 'light',
  initial = 'all',
}: {
  projects: Project[];
  tone?: 'light' | 'dark';
  initial?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(initial);
  const dark = tone === 'dark';
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: projects.length, ongoing: 0, upcoming: 0, completed: 0 };
    for (const p of projects) c[p.status]++;
    return c;
  }, [projects]);
  const visible = filter === 'all' ? projects : projects.filter((p) => p.status === filter);

  return (
    <div>
      <div role="tablist" aria-label="Filter projects by status" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {filters.map((f) => (
          <button
            key={f.id}
            role="tab"
            type="button"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'relative shrink-0 rounded-full border px-5 py-2.5 text-xs font-medium tracking-[0.12em] uppercase transition-colors duration-500',
              filter === f.id
                ? dark
                  ? 'border-gold-500 text-navy-950'
                  : 'border-navy-900 text-ivory'
                : dark
                  ? 'border-ivory/20 text-ivory/75 hover:border-champagne hover:text-champagne'
                  : 'border-navy-900/15 text-ink/70 hover:border-navy-900/50',
            )}
          >
            {filter === f.id && (
              <motion.span
                layoutId={`filter-pill-${tone}`}
                className={cn('absolute inset-0 rounded-full', dark ? 'bg-gold-500' : 'bg-navy-900')}
                transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              />
            )}
            <span className="relative">
              {f.label} <span className="opacity-60">({counts[f.id]})</span>
            </span>
          </button>
        ))}
      </div>

      <motion.div layout className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6, delay: Math.min(i, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={p} tone={tone} priority={i < 2} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
