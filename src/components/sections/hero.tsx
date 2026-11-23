'use client';

import { useReducedMotion, useScroll } from 'motion/react';
import { ArrowDown, ArrowRight, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useEnquiry } from '@/components/forms/enquiry-dialog';
import { Button } from '@/components/ui/button';
import { Counter } from '@/components/ui/counter';
import { heroFilm, heroIntro, heroStops, legacyFigures } from '@/content/hero-film';
import { cn } from '@/lib/utils';

/**
 * Scroll-driven hero film. The section is pinned while the visitor scrolls, and the scroll position
 * sets the current time of a chain of short clips: fly in through a window, cross the living room,
 * step out of the balcony into the sky and on to the next project. Clips load a few at a time and
 * crossfade at their soft ends (a curtain, open sky). Reduced motion and Save-Data get the same
 * story as stills.
 */

// Scroll lengths, in viewport heights.
const VH_PER_SECOND = 12; // pace of the footage
const INTRO_HOLD = 40; // opening frame held while the intro reads
const STOP_HOLD = 30; // each later exterior held for its title
const FADE = 22; // the next clip fades in over the end of the current one
const FINALE_HOLD = 80; // Pune at night, held under the closing figures

const fps = heroFilm.fps;
const segs = (() => {
  let pos = 0;
  return heroFilm.segments.map((s, i) => {
    const hold = s.kind === 'in' ? (i === 0 ? INTRO_HOLD : STOP_HOLD) : 0;
    const play = s.duration * VH_PER_SECOND;
    const seg = { ...s, start: pos, hold, play, end: pos + hold + play };
    pos = seg.end;
    return seg;
  });
})();
const last = segs.length - 1;
const FILM_END = segs[last]!.end;
const TOTAL = FILM_END + FINALE_HOLD;

/** Fade in from a to b, hold, fade out from c to d (positions in vh along the film). */
type Band = readonly [number, number, number, number];
const band = (pos: number, [a, b, c, d]: Band) =>
  pos <= a || pos >= d ? 0 : pos < b ? (pos - a) / (b - a) : pos <= c ? 1 : (d - pos) / (d - c);

const inSegs = segs.filter((s) => s.kind === 'in');
const roomSegs = segs.filter((s) => s.kind === 'room');

const overlays = {
  hint: [-1, 0, 6, 16] as Band,
  intro: [-1, 0, INTRO_HOLD * 0.45, INTRO_HOLD * 0.8] as Band,
  stops: inSegs.map((s, i): Band =>
    i === 0
      ? [INTRO_HOLD * 0.55, INTRO_HOLD * 0.9, s.hold + s.play * 0.2, s.hold + s.play * 0.36]
      : [s.start - 6, s.start + 8, s.start + s.hold + s.play * 0.14, s.start + s.hold + s.play * 0.3],
  ),
  rooms: roomSegs.map((s): Band => [s.start + s.play * 0.04, s.start + s.play * 0.12, s.start + s.play * 0.42, s.start + s.play * 0.56]),
  finale: [FILM_END - 40, FILM_END - 8, TOTAL + 1, TOTAL + 2] as Band,
};

const chapters = [
  ...heroStops.map((stop, i) => {
    const room = roomSegs[i]!;
    return { label: stop.name.replace('Excellaa ', ''), from: inSegs[i]!.start, to: room.end };
  }),
  { label: 'Legacy', from: FILM_END, to: TOTAL },
];

function segOpacity(i: number, pos: number) {
  const s = segs[i]!;
  if (pos >= s.start && pos < s.end) return 1;
  if (i === 0 && pos < s.end) return 1;
  if (i === last && pos >= s.end) return 1;
  if (pos >= s.start - FADE && pos < s.start) return (pos - (s.start - FADE)) / FADE;
  return 0;
}

function segTime(i: number, pos: number) {
  const s = segs[i]!;
  const t = ((pos - s.start - s.hold) / s.play) * s.duration;
  return Math.min(Math.max(t, 0), s.duration - 1 / fps);
}

/**
 * The generated clips are 720p, but each segment opens on the image it was generated from at full
 * resolution. That still covers the clip while the film rests on its first frame (the held exterior,
 * the room as it fades in) and hands over to the clip within the first few vh of movement.
 */
const STILL_HANDOVER = [1, 7] as const;
function stillOpacity(i: number, pos: number) {
  const s = segs[i]!;
  const into = pos - s.start - s.hold;
  const [a, b] = STILL_HANDOVER;
  return into <= a ? 1 : into >= b ? 0 : 1 - (into - a) / (b - a);
}

function activeSegment(pos: number) {
  let a = 0;
  segs.forEach((s, i) => {
    if (pos >= s.start - FADE) a = i;
  });
  return a;
}

type Mode = 'pending' | 'video' | 'stills';

// Captions sit straight on the footage, which is never tinted. Each text block carries a soft neutral halo that
// fades with it, so the picture is untouched whenever no words are on screen.
const captionClass = 'absolute inset-0 [text-shadow:0_1px_18px_rgba(0,0,0,0.5)]';

// Portrait screens get the centre-cropped clips; the answer follows rotation.
const PORTRAIT = '(max-aspect-ratio: 1/1)';
const subscribePortrait = (cb: () => void) => {
  const mq = window.matchMedia(PORTRAIT);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const noopSubscribe = () => () => {};
const saveData = () => Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { open } = useEnquiry();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const onClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const mobile = useSyncExternalStore(subscribePortrait, () => window.matchMedia(PORTRAIT).matches, () => false);
  const lite = useSyncExternalStore(noopSubscribe, saveData, () => false);
  const mode: Mode = !onClient ? 'pending' : reduce || lite ? 'stills' : 'video';

  const [loaded, setLoaded] = useState<number[]>([0, 1]);
  const [chapter, setChapter] = useState(0);
  const [finaleOn, setFinaleOn] = useState(false);

  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const stills = useRef<(HTMLImageElement | null)[]>([]);
  const dirty = useRef(true);

  // One animation loop drives clip times, layer opacities, overlays and the chapter rail.
  useEffect(() => {
    let raf = 0;
    let smooth = scrollYProgress.get();
    let lastPos = -1;
    let lastActive = -1;
    let lastChapter = -1;
    let lastFinale = false;
    const overlayEls = Array.from(ref.current?.querySelectorAll<HTMLElement>('[data-overlay]') ?? []);

    let lastTime = performance.now();

    const tick = (now: number) => {
      // Ease towards the scroll position at the same rate whatever the display's refresh rate.
      const dt = Math.min(0.1, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;
      const target = scrollYProgress.get();
      smooth += (target - smooth) * (mode === 'stills' ? 1 : 1 - Math.pow(0.86, dt * 60));
      if (Math.abs(target - smooth) < 1e-5) smooth = target;
      const pos = smooth * TOTAL;

      if (pos !== lastPos || dirty.current) {
        dirty.current = false;
        lastPos = pos;

        segs.forEach((_, i) => {
          const o = segOpacity(i, pos);
          const layer = layers.current[i];
          if (layer) layer.style.opacity = String(o);
          const still = stills.current[i];
          if (still) still.style.opacity = mode === 'video' ? String(stillOpacity(i, pos)) : '1';
          const v = videos.current[i];
          if (!v || o === 0 || v.readyState < 1) return;
          const t = segTime(i, pos);
          if (!v.seeking && Math.abs(v.currentTime - t) > 0.5 / fps) v.currentTime = t;
          else if (v.seeking) dirty.current = true;
        });

        overlayEls.forEach((el) => {
          const [kind, idx] = (el.dataset.overlay ?? '').split(':');
          const b = kind === 'stop' ? overlays.stops[+idx!]! : kind === 'room' ? overlays.rooms[+idx!]! : overlays[kind as 'hint' | 'intro' | 'finale'];
          const o = band(pos, b);
          el.style.opacity = String(o);
          el.style.transform = `translate3d(0, ${(1 - o) * 14}px, 0)`;
          el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
          el.inert = o < 0.5;
        });

        chapters.forEach((c, i) => {
          const f = fills.current[i];
          if (f) f.style.transform = `scaleX(${Math.min(1, Math.max(0, (pos - c.from) / (c.to - c.from)))})`;
        });

        const active = activeSegment(pos);
        if (active !== lastActive) {
          lastActive = active;
          setLoaded((prev) => {
            const want = [active - 1, active, active + 1, active + 2].filter((i) => i >= 0 && i <= last);
            return want.every((i) => prev.includes(i)) ? prev : [...new Set([...prev, ...want])];
          });
        }
        const ch = Math.max(0, chapters.findLastIndex((c) => pos >= c.from - FADE));
        if (ch !== lastChapter) {
          lastChapter = ch;
          setChapter(ch);
        }
        const fin = pos > FILM_END - 40;
        if (fin !== lastFinale) {
          lastFinale = fin;
          setFinaleOn(fin);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollYProgress, mode]);

  const jumpTo = (vh: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop + (el.offsetHeight - window.innerHeight) * (Math.min(vh, TOTAL) / TOTAL);
    const far = Math.abs(top - window.scrollY) > window.innerHeight * 3;
    window.scrollTo({ top, behavior: reduce || far ? 'auto' : 'smooth' });
  };

  return (
    <section ref={ref} data-hero className="relative bg-navy-950 text-ivory" style={{ height: `${TOTAL + 100}svh` }} aria-label="A journey through Excellaa homes">
      <div className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden">
        {/* Film layers: later clips sit on top so each can fade in over the one before. */}
        {segs.map((s, i) => (
          <div key={s.id} ref={(el) => void (layers.current[i] = el)} className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }} aria-hidden>
            {mode === 'video' && (
              <video
                ref={(el) => void (videos.current[i] = el)}
                className="absolute inset-0 size-full object-cover"
                src={loaded.includes(i) ? (mobile ? s.srcMobile : s.src) : undefined}
                poster={s.still}
                preload={loaded.includes(i) ? 'auto' : 'none'}
                muted
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                tabIndex={-1}
                onLoadedData={(e) => {
                  // iOS only paints seeked frames once a video has played; start and stop it straight away.
                  const v = e.currentTarget;
                  v.play().then(() => v.pause()).catch(() => {});
                  dirty.current = true;
                }}
                onSeeked={() => void (dirty.current = true)}
              />
            )}
            {/* Served as-is: the stills are already sized for the screen and recompressing them softens them. */}
            {(i === 0 || mode === 'stills' || loaded.includes(i)) && (
              <Image
                ref={(el) => void (stills.current[i] = el)}
                src={s.still}
                alt=""
                fill
                unoptimized
                priority={i === 0}
                className="object-cover"
                style={{ opacity: 1 }}
              />
            )}
          </div>
        ))}

        {/* No tint over the footage: only a faint neutral band under the chapter rail. Captions carry their own shade. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Opening */}
        <div data-overlay="intro" className={captionClass} style={{ opacity: 1 }}>
          <CaptionBlock>
            <p className="eyebrow text-champagne">{heroIntro.eyebrow}</p>
            <h1 className="display mt-5 text-[3.3rem] sm:text-8xl lg:text-[8.4rem]">
              <span className="block">{heroIntro.line1}</span>
              <span className="block font-light italic text-champagne">{heroIntro.line2}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/90 sm:text-lg">{heroIntro.text}</p>
          </CaptionBlock>
        </div>

        {/* Each project, as the camera arrives */}
        {heroStops.map((stop, i) => (
          <div key={stop.slug} data-overlay={`stop:${i}`} className={captionClass} style={{ opacity: 0, visibility: 'hidden' }}>
            <CaptionBlock>
              <p className="eyebrow flex items-center gap-3 text-champagne">
                <span>0{i + 1}</span>
                <span className="h-px w-8 bg-champagne/60" />
                <span>{stop.locality}</span>
              </p>
              <h2 className="display mt-5 text-[3rem] sm:text-7xl lg:text-[7rem]">{stop.name}</h2>
              <p className="display mt-3 text-2xl font-light italic text-champagne sm:text-4xl">{stop.tagline}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.22em] text-ivory/90">
                <span>{stop.configuration}</span>
                <Link href={`/projects/${stop.slug}`} className="inline-flex items-center gap-2 text-ivory transition hover:text-champagne">
                  Explore {stop.name.replace('Excellaa ', '')} <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </CaptionBlock>
          </div>
        ))}

        {/* Inside each home */}
        {heroStops.map((stop, i) => (
          <div key={`${stop.slug}-room`} data-overlay={`room:${i}`} className={captionClass} style={{ opacity: 0, visibility: 'hidden' }}>
            <CaptionBlock>
              <p className="eyebrow text-champagne">{stop.name}</p>
              <p className="display mt-3 max-w-2xl text-3xl leading-tight sm:text-5xl">{stop.room}</p>
            </CaptionBlock>
          </div>
        ))}

        {/* Closing: the legacy, over Pune at night */}
        <div data-overlay="finale" className={captionClass} style={{ opacity: 0, visibility: 'hidden' }}>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgba(0,0,0,0.5),transparent_75%)]" />
          <div className="flex h-full flex-col items-center justify-center px-5 pb-36 pt-20 text-center sm:pb-24">
            <p
              className="display select-none text-[18.5vw] font-medium leading-[0.85] tracking-[-0.03em] sm:text-[15vw]"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(247,243,234,0.35), rgba(214,182,121,0.35)), url(${heroFilm.finalFrame})`,
                backgroundSize: 'cover',
                backgroundPosition: '50% 60%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextStroke: '1px rgba(214,182,121,0.45)',
              }}
              aria-label="Excellaa"
            >
              EXCELLAA
            </p>
            <p className="eyebrow mt-4 text-champagne">Building with Ethos · Since 1987</p>
            {finaleOn && (
              <div className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
                {legacyFigures.map((x) => (
                  <div key={x.label}>
                    <p className="display text-4xl sm:text-5xl">
                      <Counter value={x.value} suffix={x.suffix} duration={1.6} />
                    </p>
                    <p className="mt-2 text-[0.65rem] uppercase tracking-[0.22em] text-mist">{x.label}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <a href="#projects">
                  Find your address <ArrowRight className="transition-transform duration-500 group-hover/btn:translate-x-1" />
                </a>
              </Button>
              <Button variant="outlineLight" size="lg" onClick={() => open({ intent: 'site-visit' })}>
                Book a site visit
              </Button>
            </div>
          </div>
        </div>

        <p
          data-overlay="hint"
          className="pointer-events-none absolute left-1/2 top-[18%] hidden -translate-x-1/2 items-center gap-2 text-[0.6rem] uppercase tracking-[0.35em] text-ivory/70 md:flex"
          style={{ opacity: 1 }}
        >
          Scroll to step inside <ArrowDown className="size-3.5 animate-bounce" />
        </p>

        {/* Chapter rail */}
        <div className="absolute inset-x-0 bottom-14 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] sm:bottom-0">
          <div className="container-wide flex items-end gap-4 pb-6 sm:gap-6">
            <nav aria-label="Hero chapters" className="grid flex-1 gap-2" style={{ gridTemplateColumns: `repeat(${chapters.length}, minmax(0, 1fr))` }}>
              {chapters.map((c, i) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => jumpTo(i === 0 ? 0 : c.from)}
                  className="group text-left"
                  aria-label={`Go to ${c.label}`}
                  aria-current={chapter === i ? 'step' : undefined}
                >
                  <span className="relative block h-px overflow-hidden bg-ivory/20">
                    <span ref={(el) => void (fills.current[i] = el)} className="absolute inset-0 origin-left bg-champagne" style={{ transform: 'scaleX(0)' }} />
                  </span>
                  <span className={cn('mt-2 hidden truncate text-[0.62rem] uppercase tracking-[0.2em] transition-colors sm:block', chapter === i ? 'text-champagne' : 'text-ivory/70 group-hover:text-ivory')}>
                    0{i + 1} {c.label}
                  </span>
                </button>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-4">
              <span className="font-display text-xl tabular-nums text-ivory/80">
                0{chapter + 1}
                <span className="text-ivory/40"> / 0{chapters.length}</span>
              </span>
              <a href="#about" className="hidden items-center gap-2 border border-ivory/25 px-3 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-ivory/75 transition hover:border-champagne hover:text-champagne sm:inline-flex">
                <LayoutGrid className="size-3.5" /> Skip intro
              </a>
            </div>
          </div>
        </div>

        <p className="pointer-events-none absolute right-5 top-24 text-[0.58rem] uppercase tracking-[0.22em] text-ivory/70 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] sm:right-10 xl:right-14">
          Artist&rsquo;s impression<span className="hidden sm:inline"> · AI-assisted visualisation</span>
        </p>
      </div>
    </section>
  );
}

function CaptionBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-wide flex h-full flex-col items-start justify-end pb-44 sm:pb-36">
      <div className="relative isolate">
        <div aria-hidden className="pointer-events-none absolute -inset-x-16 -inset-y-12 -z-10 rounded-[50%] bg-black/45 blur-3xl sm:-inset-x-24 sm:-inset-y-16" />
        {children}
      </div>
    </div>
  );
}
