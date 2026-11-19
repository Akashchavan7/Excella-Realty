'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { MediaImage } from '@/components/ui/media-image';
import type { ImageItem } from '@/content/types';
import { cn } from '@/lib/utils';

interface Props {
  items: ImageItem[];
  projectName: string;
  variant?: 'editorial' | 'plans';
}

/** Editorial image grid with a keyboard-accessible full-screen lightbox. */
export function Gallery({ items, projectName, variant = 'editorial' }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go]);

  const layout = (i: number) => {
    if (variant === 'plans') return 'aspect-[4/3]';
    const pattern = ['md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto', 'aspect-[4/3]', 'aspect-[4/3]', 'aspect-[4/3]', 'md:col-span-2 aspect-[16/9]', 'aspect-[4/3]'];
    return pattern[i % pattern.length];
  };

  const current = open !== null ? items[open] : null;

  return (
    <>
      <div className={cn('grid gap-3', variant === 'plans' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:auto-rows-[minmax(0,1fr)] md:grid-cols-4')}>
        {items.map((it, i) => (
          <button
            key={`${it.image}-${i}`}
            type="button"
            onClick={() => setOpen(i)}
            className={cn('group relative overflow-hidden text-left', variant === 'plans' ? 'bg-white' : 'bg-navy-900', layout(i), variant === 'editorial' && i === 0 && 'col-span-2')}
            aria-label={`Open ${it.caption} in full screen`}
          >
            <MediaImage
              mediaKey={it.image}
              alt={`${projectName} — ${it.caption}`}
              fill
              sizes={variant === 'plans' ? '(min-width:1024px) 30vw, 90vw' : i % 6 === 0 ? '(min-width:768px) 50vw, 100vw' : '(min-width:768px) 25vw, 50vw'}
              className={cn('transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-105', variant === 'plans' ? 'object-contain p-4' : 'object-cover')}
            />
            <span className={cn('absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-sm', variant === 'plans' ? 'bg-navy-900/90 text-ivory' : 'bg-gradient-to-t from-navy-950/80 to-transparent pt-16 text-ivory opacity-100 md:opacity-0 md:transition-opacity md:duration-500 md:group-hover:opacity-100')}>
              <span>{it.caption}</span>
              <Expand className="size-4 shrink-0 text-champagne" />
            </span>
          </button>
        ))}
      </div>

      <Dialog.Root open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-navy-950/97" />
          <Dialog.Content className="fixed inset-0 z-[95] flex flex-col text-ivory outline-none" aria-describedby={undefined}>
            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
              <Dialog.Title className="text-sm text-mist">
                <span className="text-ivory">{projectName}</span> · {current?.caption}
              </Dialog.Title>
              <div className="flex items-center gap-4">
                <span className="font-display text-xl text-mist">
                  {(open ?? 0) + 1} / {items.length}
                </span>
                <Dialog.Close className="grid size-11 place-items-center rounded-full border border-ivory/25 hover:border-champagne" aria-label="Close gallery">
                  <X className="size-5" />
                </Dialog.Close>
              </div>
            </div>
            <div className="relative flex-1">
              <AnimatePresence mode="wait">
                {current && (
                  <motion.div key={open} className="absolute inset-0 px-4 sm:px-24" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <div className={cn('relative size-full', variant === 'plans' && 'bg-white')}>
                      <MediaImage mediaKey={current.image} alt={`${projectName} — ${current.caption}`} fill sizes="100vw" className="object-contain" quality={90} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {items.length > 1 && (
                <>
                  <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/25 bg-navy-950/60 hover:border-champagne sm:left-8" aria-label="Previous image">
                    <ChevronLeft className="size-5" />
                  </button>
                  <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/25 bg-navy-950/60 hover:border-champagne sm:right-8" aria-label="Next image">
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-4 sm:justify-center">
              {items.map((it, i) => (
                <button key={`${it.image}-t${i}`} type="button" onClick={() => setOpen(i)} className={cn('relative h-14 w-20 shrink-0 overflow-hidden border transition', i === open ? 'border-champagne' : 'border-transparent opacity-50 hover:opacity-90')} aria-label={`Show ${it.caption}`}>
                  <MediaImage mediaKey={it.image} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

