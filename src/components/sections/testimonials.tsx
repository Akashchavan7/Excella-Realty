'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { SectionHeading } from '@/components/ui/section-heading';
import { testimonials as allTestimonials, videoTestimonials } from '@/content/company';

// Keep the homepage carousel light: only the shorter quotes.
const testimonials = allTestimonials.filter((t) => t.quote.length <= 330);

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const t = testimonials[index]!;
  const go = useCallback((d: number) => setIndex((i) => (i + d + testimonials.length) % testimonials.length), []);

  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => go(1), 9000);
    return () => clearInterval(id);
  }, [paused, reduce, go]);

  return (
    <section id="testimonials" className="relative overflow-hidden bg-sand/60 py-20 text-navy-900 sm:py-36">
      <span className="display pointer-events-none absolute -top-16 right-6 select-none text-[28rem] leading-none text-gold-500/[0.12]" aria-hidden>
        “
      </span>
      <div className="container-wide relative">
        <SectionHeading index="05" eyebrow="Testimonials" title={<>In the words of <em className="text-gold-600">our families.</em></>} />

        <div
          className="mt-16 grid gap-12 lg:grid-cols-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="min-h-[300px] lg:col-span-8" aria-live="polite" aria-roledescription="carousel">
            <AnimatePresence mode="wait">
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <blockquote className={`display leading-[1.25] text-navy-900 ${t.quote.length > 420 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-[2.6rem]'}`}>
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="text-lg font-medium text-gold-600">{t.name}</span>
                  <span className="h-px w-8 bg-gold-600/50" />
                  <Link href={`/projects/${t.projectSlug}`} className="text-sm text-stone hover:text-navy-900">
                    {t.project}
                    {t.unit ? ` · ${t.unit}` : ''}
                  </Link>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="flex flex-col justify-between gap-10 lg:col-span-4">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => go(-1)} className="grid size-14 place-items-center rounded-full border border-navy-900/20 transition hover:bg-navy-900 hover:text-ivory" aria-label="Previous testimonial">
                <ArrowLeft className="size-5" />
              </button>
              <button type="button" onClick={() => go(1)} className="grid size-14 place-items-center rounded-full border border-navy-900/20 transition hover:bg-navy-900 hover:text-ivory" aria-label="Next testimonial">
                <ArrowRight className="size-5" />
              </button>
              <p className="ml-2 font-display text-2xl text-stone">
                <span className="text-navy-900">{String(index + 1).padStart(2, '0')}</span> / {String(testimonials.length).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 sm:mt-24">
          <p className="eyebrow text-gold-600">Video stories</p>
          <div className="no-scrollbar -mx-5 mt-6 flex snap-x gap-5 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
            {videoTestimonials.flatMap((g) => g.ids.slice(0, 2).map((id) => ({ id, g }))).map(({ id, g }) => (
              <VideoCard key={id} id={id} project={g.project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Lightweight YouTube facade: loads the player only when clicked. */
function VideoCard({ id, project }: { id: string; project: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="w-[78vw] shrink-0 snap-start md:w-auto">
      <div className="relative aspect-video overflow-hidden bg-navy-950">
        {play ? (
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={`${project} customer testimonial`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0" aria-label={`Play ${project} customer testimonial`}>
            <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes="(min-width:768px) 22vw, 78vw" className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
            <span className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
            <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold-500 text-navy-950 transition group-hover:scale-110">
              <Play className="ml-0.5 size-5 fill-current" />
            </span>
          </button>
        )}
      </div>
      <p className="mt-3 text-sm text-stone">{project} · Resident story</p>
    </div>
  );
}
