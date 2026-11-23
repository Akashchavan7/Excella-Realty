/**
 * Copy and media for the homepage hero film: the camera flies into a home at each project, walks
 * through its living room and out of the balcony to the next. Project facts come from projects.ts;
 * room captions only restate published features (see docs/CONTENT-AUDIT.md). The footage is
 * AI-assisted visualisation built from Excellaa's renders, and the hero labels it as such.
 */
import { heroFilmFps, heroFilmSegments } from './hero-film.generated';
import { getProject } from './projects';

export const heroIntro = {
  eyebrow: 'Excellaa Realty · Building with Ethos since 1987',
  line1: 'Arrive like',
  line2: 'you belong.',
  text: 'Step inside four Excellaa addresses across Pune, from Bavdhan to Mundhwa. Scroll to begin.',
};

const stopCopy = [
  {
    slug: 'excellaa-primarc',
    configuration: '3 BHK Grand Suites',
    room: 'Inside a Grand Suite: 11 ft ceilings, imported marble and a private deck facing the Sahyadris.',
  },
  {
    slug: 'excellaa-florence',
    configuration: '1 & 2 BHK Homes',
    room: 'Inside a 2 BHK home, opening onto palms and the green hills of Pirangut.',
  },
  {
    slug: 'excellaa-virtu',
    configuration: 'Exclusive 3 BHK Suites',
    room: 'Inside a 3 BHK suite from The Gold Collection.',
  },
  {
    slug: 'excellaa-tremont',
    configuration: '3 BHK Residences · Tremont 2.0',
    room: 'Inside a 3 BHK residence, above the evening lights of East Pune.',
  },
] as const;

export const heroStops = stopCopy.map((s) => {
  const p = getProject(s.slug);
  if (!p) throw new Error(`hero-film: unknown project ${s.slug}`);
  return { ...s, name: p.name, locality: p.locality, tagline: p.tagline ?? p.summary };
});

export type HeroStop = (typeof heroStops)[number];

export const heroFilm = {
  fps: heroFilmFps,
  segments: heroFilmSegments.map((s) => ({
    ...s,
    stopIndex: stopCopy.findIndex((c) => c.slug === s.stop),
    src: `/hero/${s.id}.mp4`,
    srcMobile: `/hero/${s.id}-m.mp4`,
    /** The full-resolution image the segment was generated from: identical to its first frame, but sharper. */
    still: `/hero/${s.id}.webp`,
  })),
  /** Last frame of the film: Pune at night, under the closing figures. */
  finalFrame: `/hero/${heroFilmSegments[heroFilmSegments.length - 1]!.id}-end.webp`,
};

export const legacyFigures = [
  { value: 34, suffix: '+', label: 'Years of legacy' },
  { value: 22, suffix: '+', label: 'Projects delivered' },
  { value: 50, suffix: ' lakh+', label: 'Sq. ft. transformed' },
  { value: 4500, suffix: '+', label: 'Families delighted' },
] as const;
