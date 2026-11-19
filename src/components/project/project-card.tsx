import { ArrowUpRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { MediaImage } from '@/components/ui/media-image';
import { statusLabel } from '@/content/projects';
import type { Project } from '@/content/types';
import { cn } from '@/lib/utils';

const collectionLabel = { autograph: 'The Autograph Collection', gold: 'The Gold Collection' } as const;

/**
 * Editorial project card. The location sits ABOVE the image, followed by the
 * project name, configuration, status and the Explore link.
 */
export function ProjectCard({
  project,
  tone = 'light',
  aspect = 'aspect-[4/5]',
  priority,
  className,
  compact,
}: {
  project: Project;
  tone?: 'light' | 'dark';
  aspect?: string;
  priority?: boolean;
  className?: string;
  /** Tighter typography and no secondary link, for sliders. */
  compact?: boolean;
}) {
  const dark = tone === 'dark';
  return (
    <article className={cn('group relative', className)}>
      <Link href={`/projects/${project.slug}`} className="block focus-visible:outline-offset-8" aria-label={`Explore ${project.name}, ${project.locality}`}>
        {/* 1. Location — above the image */}
        <div className={cn('mb-4 flex items-center justify-between gap-4 border-b pb-3', dark ? 'border-ivory/15' : 'border-navy-900/12')}>
          <p className={cn('eyebrow flex items-center gap-2', dark ? 'text-champagne' : 'text-gold-600')}>
            <MapPin className="size-3.5" aria-hidden /> {project.locality}
            {project.locality === project.city ? '' : `, ${project.city}`}
          </p>
          {project.collection && (
            <span className={cn('hidden text-[0.65rem] italic tracking-wide sm:block', dark ? 'text-mist' : 'text-stone')}>
              {collectionLabel[project.collection]}
            </span>
          )}
        </div>

        {/* 2. Image */}
        <div className={cn('relative overflow-hidden', aspect, dark ? 'bg-navy-800' : 'bg-sand')}>
          {project.cover ? (
            <MediaImage
              mediaKey={project.cover}
              alt={`${project.name}, ${project.locality}`}
              fill
              priority={priority}
              sizes="(min-width:1280px) 30vw, (min-width:768px) 45vw, 92vw"
              className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-lux)] group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-900 p-8 text-center">
              <span className="absolute inset-5 border border-champagne/40" aria-hidden />
              <p className="eyebrow text-champagne">Coming soon</p>
              <p className="display mt-4 text-4xl text-ivory">{project.name}</p>
              <p className="mt-3 text-sm text-mist">{project.locality}</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <span
            className={cn(
              'absolute left-4 top-4 inline-flex items-center gap-2 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] backdrop-blur-md',
              project.status === 'ongoing' && 'bg-gold-500 text-navy-950',
              project.status === 'upcoming' && 'bg-ivory/90 text-navy-900',
              project.status === 'completed' && 'bg-navy-950/75 text-ivory',
            )}
          >
            {statusLabel[project.status]}
          </span>
        </div>

        {/* 3. Name, configuration, status, explore */}
        <div className={cn('flex items-start justify-between gap-6', compact ? 'mt-4' : 'mt-6')}>
          <div className="min-w-0">
            <h3 className={cn('display leading-none', compact ? 'text-[1.9rem]' : 'text-[2.1rem] sm:text-[2.4rem]', dark ? 'text-ivory' : 'text-navy-900')}>{project.name}</h3>
            <p className={cn('mt-3 text-sm', dark ? 'text-mist' : 'text-ink/65')}>{project.configuration}</p>
          </div>
          <span
            className={cn(
              'mt-1 grid size-12 shrink-0 place-items-center rounded-full border transition-all duration-500 group-hover:rotate-45',
              dark ? 'border-ivory/25 text-ivory group-hover:border-gold-500 group-hover:bg-gold-500 group-hover:text-navy-950' : 'border-navy-900/20 text-navy-900 group-hover:border-navy-900 group-hover:bg-navy-900 group-hover:text-ivory',
            )}
            aria-hidden
          >
            <ArrowUpRight className="size-5" />
          </span>
        </div>
        <p className={cn(compact ? 'mt-3' : 'mt-4', 'inline-flex text-[0.68rem] font-semibold uppercase tracking-[0.24em] link-underline', dark ? 'text-champagne' : 'text-navy-900')}>
          Explore project
        </p>
      </Link>
    </article>
  );
}
