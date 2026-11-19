'use client';

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { ArrowDown, ArrowRight, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useEnquiry } from '@/components/forms/enquiry-dialog';
import { Button } from '@/components/ui/button';
import { Counter } from '@/components/ui/counter';
import { MediaImage } from '@/components/ui/media-image';
import { media, type MediaKey } from '@/content/media.generated';
import { cn } from '@/lib/utils';

/**
 * Scroll-told hero: the section is pinned while the visitor scrolls through five
 * chapters of the Excellaa story, ending on the brand word and company figures.
 * All imagery and copy come from Excellaa's published projects.
 */
interface Chapter {
  key: string;
  label: string;
  image: MediaKey;
  line1: string;
  line2: string;
  text: string;
  project?: { name: string; slug: string; place: string };
  align: 'left' | 'right';
}

const chapters: Chapter[] = [
  {
    key: 'arrival',
    label: 'Arrival',
    image: 'polaris/lobby',
    line1: 'Arrive like',
    line2: 'you belong.',
    text: 'A grandiose, five-star entrance lobby — every homecoming at Excellaa Polaris begins with ceremony.',
    project: { name: 'Excellaa Polaris', slug: 'excellaa-polaris', place: 'Bavdhan' },
    align: 'left',
  },
  {
    key: 'city',
    label: 'Across Pune',
    image: 'ganga-acropolis/towers',
    line1: 'Rising across',
    line2: 'the city.',
    text: 'From Baner–Sus to Dhanori and Mundhwa — 22+ landmark projects delivered for 4,500+ families.',
    project: { name: 'Ganga Acropolis', slug: 'ganga-acropolis', place: 'Baner–Sus' },
    align: 'right',
  },
  {
    key: 'living',
    label: 'Living',
    image: 'polaris/lounge',
    line1: 'Made for',
    line2: 'slower mornings.',
    text: 'Residences designed for a slower, more meaningful life — abundant natural light, imported marble, undisturbed views.',
    project: { name: 'The Autograph Collection', slug: 'excellaa-polaris', place: 'Bavdhan' },
    align: 'left',
  },
  {
    key: 'above',
    label: 'Above it all',
    image: 'polaris/infinity-pool',
    line1: 'Above',
    line2: 'it all.',
    text: 'A rooftop climatised infinity pool at 321 ft, crowning 45+ multi-level amenities across 50,000 sq ft.',
    project: { name: 'Excellaa Polaris', slug: 'excellaa-polaris', place: 'Bavdhan' },
    align: 'right',
  },
];

const STEPS = chapters.length + 1; // + final legacy chapter
const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { open } = useEnquiry();
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(STEPS - 1, Math.max(0, Math.floor(v * STEPS * 0.999)));
    setStep((s) => (s === next ? s : next));
  });

  const final = step === STEPS - 1;
  const chapter = chapters[Math.min(step, chapters.length - 1)]!;

  const jumpTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop + (el.offsetHeight - window.innerHeight) * ((i + 0.15) / STEPS);
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section ref={ref} data-hero className="relative bg-navy-950 text-ivory" style={{ height: `${STEPS * 90 + 10}svh` }} aria-label="The Excellaa story">
      <div className="grain sticky top-0 h-[100svh] min-h-[600px] overflow-hidden">
        {/* Scene images, each scrubbed with its own slow zoom */}
        {chapters.map((c, i) => (
          <SceneImage key={c.key} chapter={c} index={i} active={step === i || (final && i === chapters.length - 1)} progress={scrollYProgress} reduce={!!reduce} priority={i === 0} dim={final} />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/20 to-navy-950/55" />
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            chapter.align === 'left' ? 'bg-gradient-to-r from-navy-950/75 via-navy-950/10 to-transparent' : 'bg-gradient-to-l from-navy-950/75 via-navy-950/10 to-transparent',
            final && 'opacity-0',
          )}
        />
        <motion.div className="absolute inset-0 bg-navy-950" initial={false} animate={{ opacity: final ? 0.82 : 0 }} transition={{ duration: 1, ease }} />

        {/* Chapter copy */}
        <div className="container-wide relative flex h-full flex-col justify-end pb-44 sm:pb-36">
          <AnimatePresence mode="wait">
            {!final && (
              <motion.div
                key={chapter.key}
                className={cn('max-w-3xl', chapter.align === 'right' && 'sm:ml-auto sm:text-right')}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.p variants={fadeUp(0)} className={cn('eyebrow flex items-center gap-3 text-champagne', chapter.align === 'right' && 'sm:justify-end')}>
                  <span>0{step + 1}</span>
                  <span className="h-px w-8 bg-champagne/60" />
                  <span>{chapter.label}</span>
                </motion.p>
                <h1 className="display mt-5 text-[3.3rem] sm:text-8xl lg:text-[8.4rem]" aria-live="polite">
                  <MaskLine delay={0.05}>{chapter.line1}</MaskLine>
                  <MaskLine delay={0.15} className="font-light italic text-champagne">
                    {chapter.line2}
                  </MaskLine>
                </h1>
                <motion.p variants={fadeUp(0.3)} className={cn('mt-6 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg', chapter.align === 'right' && 'sm:ml-auto')}>
                  {chapter.text}
                </motion.p>
                {chapter.project && (
                  <motion.div variants={fadeUp(0.4)} className="mt-6">
                    <Link href={`/projects/${chapter.project.slug}`} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-ivory/70 transition hover:text-champagne">
                      {chapter.project.name} · {chapter.project.place} <ArrowRight className="size-3.5" />
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Final chapter: brand word filled with imagery, then the legacy */}
        <AnimatePresence>
          {final && (
            <motion.div key="legacy" className="absolute inset-0 flex flex-col items-center justify-center px-5 pb-36 pt-20 text-center sm:pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              <BrandWord progress={scrollYProgress} reduce={!!reduce} />
              <motion.p variants={fadeUp(0.25)} initial="hidden" animate="show" className="eyebrow mt-4 text-champagne">
                Building with Ethos · Since 1987
              </motion.p>
              <motion.div variants={fadeUp(0.35)} initial="hidden" animate="show" className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
                {[
                  { v: 34, s: '+', l: 'Years of legacy' },
                  { v: 22, s: '+', l: 'Projects delivered' },
                  { v: 50, s: ' lakh+', l: 'Sq. ft. transformed' },
                  { v: 4500, s: '+', l: 'Families delighted' },
                ].map((x) => (
                  <div key={x.l}>
                    <p className="display text-4xl sm:text-5xl">
                      <Counter value={x.v} suffix={x.s} duration={1.6} />
                    </p>
                    <p className="mt-2 text-[0.65rem] uppercase tracking-[0.22em] text-mist">{x.l}</p>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp(0.45)} initial="hidden" animate="show" className="mt-10 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <a href="#projects">
                    Find your address <ArrowRight className="transition-transform duration-500 group-hover/btn:translate-x-1" />
                  </a>
                </Button>
                <Button variant="outlineLight" size="lg" onClick={() => open({ intent: 'site-visit' })}>
                  Book a site visit
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chapter progress */}
        <div className="absolute inset-x-0 bottom-14 sm:bottom-0">
          <div className="container-wide flex items-end gap-4 pb-6 sm:gap-6">
            <nav aria-label="Story chapters" className="grid flex-1 gap-2" style={{ gridTemplateColumns: `repeat(${STEPS}, minmax(0, 1fr))` }}>
              {[...chapters.map((c) => c.label), 'Legacy'].map((label, i) => (
                <button key={label} type="button" onClick={() => jumpTo(i)} className="group text-left" aria-label={`Go to chapter ${i + 1}: ${label}`} aria-current={step === i ? 'step' : undefined}>
                  <span className="relative block h-px overflow-hidden bg-ivory/20">
                    <SegmentFill progress={scrollYProgress} index={i} />
                  </span>
                  <span className={cn('mt-2 hidden truncate text-[0.62rem] uppercase tracking-[0.2em] transition-colors sm:block', step === i ? 'text-champagne' : 'text-ivory/45 group-hover:text-ivory/80')}>
                    0{i + 1} {label}
                  </span>
                </button>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-4">
              <span className="font-display text-xl tabular-nums text-ivory/80">
                0{step + 1}<span className="text-ivory/40"> / 0{STEPS}</span>
              </span>
              <a href="#about" className="hidden items-center gap-2 border border-ivory/25 px-3 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-ivory/75 transition hover:border-champagne hover:text-champagne sm:inline-flex">
                <LayoutGrid className="size-3.5" /> Skip intro
              </a>
            </div>
          </div>
        </div>

        <motion.p
          className="pointer-events-none absolute left-1/2 top-[18%] hidden -translate-x-1/2 items-center gap-2 text-[0.6rem] uppercase tracking-[0.35em] text-ivory/60 md:flex"
          initial={false}
          animate={{ opacity: step === 0 ? 1 : 0 }}
        >
          Scroll to explore <ArrowDown className="size-3.5 animate-bounce" />
        </motion.p>
      </div>
    </section>
  );
}

function fadeUp(delay: number) {
  return {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, delay, ease } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.35 } },
  };
}

function MaskLine({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={cn('block', className)}
        variants={{
          hidden: { y: '105%' },
          show: { y: 0, transition: { duration: 1.1, delay, ease } },
          exit: { y: '-105%', transition: { duration: 0.45, ease } },
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function SceneImage({
  chapter,
  index,
  active,
  progress,
  reduce,
  priority,
  dim,
}: {
  chapter: Chapter;
  index: number;
  active: boolean;
  progress: MotionValue<number>;
  reduce: boolean;
  priority: boolean;
  dim: boolean;
}) {
  const start = index / STEPS;
  const end = (index + 1) / STEPS;
  const scale = useTransform(progress, [start - 0.08, end + 0.04], reduce ? [1.02, 1.02] : [1.18, 1.02]);
  const y = useTransform(progress, [start, end], reduce ? ['0%', '0%'] : ['0%', '-3%']);
  return (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{ opacity: active ? 1 : 0, filter: dim ? 'blur(6px)' : 'blur(0px)' }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
      aria-hidden={!active}
    >
      <motion.div className="absolute inset-0" style={{ scale, y }}>
        <MediaImage mediaKey={chapter.image} alt={chapter.project ? `${chapter.project.name}, ${chapter.project.place}` : chapter.label} fill priority={priority} sizes="100vw" className="object-cover" />
      </motion.div>
    </motion.div>
  );
}

function SegmentFill({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const scaleX = useTransform(progress, [index / STEPS, (index + 1) / STEPS], [0, 1], { clamp: true });
  return <motion.span className="absolute inset-0 origin-left bg-champagne" style={{ scaleX }} />;
}

function BrandWord({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean }) {
  const scale = useTransform(progress, [(STEPS - 1) / STEPS, 1], reduce ? [1, 1] : [1.5, 1]);
  const bgPos = useTransform(progress, [(STEPS - 1) / STEPS, 1], ['50% 20%', '50% 70%']);
  const img = media['polaris/infinity-pool'].src;
  return (
    <motion.p
      className="display select-none text-[18.5vw] font-medium leading-[0.85] tracking-[-0.03em] sm:text-[17vw]"
      style={{
        scale,
        backgroundImage: `linear-gradient(180deg, rgba(247,243,234,0.15), rgba(214,182,121,0.25)), url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: bgPos,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        WebkitTextStroke: '1px rgba(214,182,121,0.35)',
      }}
      aria-label="Excellaa"
    >
      EXCELLAA
    </motion.p>
  );
}
