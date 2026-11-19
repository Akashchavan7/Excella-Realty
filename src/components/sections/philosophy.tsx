'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { MediaImage } from '@/components/ui/media-image';
import { SectionHeading } from '@/components/ui/section-heading';
import { philosophy } from '@/content/company';
import { cn } from '@/lib/utils';

export function Philosophy() {
  const [active, setActive] = useState(0);
  const item = philosophy[active]!;
  return (
    <section id="philosophy" className="bg-sand/60 py-28 sm:py-36">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Our Philosophy"
          title={
            <>
              Five principles, <em className="text-gold-600">one ethos.</em>
            </>
          }
        />
        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <ol className="lg:col-span-6">
            {philosophy.map((p, i) => (
              <li key={p.key} className="border-t border-navy-900/15 last:border-b">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-expanded={active === i}
                  className="flex w-full items-baseline gap-6 py-6 text-left"
                >
                  <span className="eyebrow w-8 shrink-0 text-stone">0{i + 1}</span>
                  <span className="flex-1">
                    <span className={cn('display block text-4xl transition-colors duration-500 sm:text-5xl', active === i ? 'text-navy-900' : 'text-navy-900/35')}>
                      {p.title}
                    </span>
                    <AnimatePresence initial={false}>
                      {active === i && (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="block overflow-hidden"
                        >
                          <span className="block max-w-xl pt-4 leading-relaxed text-ink/70">{p.text}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="relative aspect-[4/3] overflow-hidden lg:col-span-6 lg:aspect-auto lg:min-h-[560px]">
            <AnimatePresence mode="sync">
              <motion.div key={item.key} className="absolute inset-0" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
                <MediaImage mediaKey={item.image} alt={item.title} fill sizes="(min-width:1024px) 46vw, 92vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
            <p className="display absolute bottom-6 left-6 text-3xl text-ivory">{item.title}</p>
          </div>
        </div>

      </div>
    </section>
  );
}
