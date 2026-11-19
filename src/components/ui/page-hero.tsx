import { MediaImage } from '@/components/ui/media-image';
import type { MediaKey } from '@/content/media.generated';

/** Compact dark banner used at the top of inner pages. */
export function PageHero({ eyebrow, title, image }: { eyebrow: string; title: React.ReactNode; image: MediaKey }) {
  return (
    <section className="grain relative overflow-hidden bg-navy-950 pb-16 pt-40 text-ivory sm:pb-20 sm:pt-48">
      <div className="absolute inset-0 opacity-40">
        <MediaImage mediaKey={image} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/60" />
      <div className="container-wide relative">
        <p className="eyebrow text-champagne">{eyebrow}</p>
        <h1 className="display mt-5 max-w-5xl text-[3.2rem] sm:text-8xl lg:text-[7rem]">{title}</h1>
      </div>
    </section>
  );
}
