import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { EnquireTrigger } from '@/components/forms/enquiry-dialog';
import { MediaImage } from '@/components/ui/media-image';
import { Reveal } from '@/components/ui/reveal';

const signatures = [
  'Expansive sky deck',
  'Exclusive arrival port',
  'Climatised infinity pool',
  'Imported marble',
  '11 ft ceilings',
  'Full-height windows',
  'IGBC Platinum pre-certified',
  'Five-star lobby',
];

const residences = [
  {
    slug: 'excellaa-polaris',
    name: 'Excellaa Polaris',
    place: 'Bavdhan',
    config: '4.25 – 4.75 BHK · 31 storeys',
    image: 'polaris/infinity-pool' as const,
  },
  {
    slug: 'excellaa-primarc',
    name: 'Excellaa Primarc',
    place: 'Bavdhan',
    config: '3 BHK Grand Suites',
    image: 'primarc/sky-deck' as const,
  },
];

export function AutographCollection() {
  return (
    <section id="autograph" className="relative overflow-hidden bg-ivory text-navy-900">
      <div className="container-wide py-20 sm:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="eyebrow text-gold-600">04 · A lifestyle for a select few</p>
            <p className="mt-10 font-display text-2xl italic text-gold-600">The</p>
            <h2 className="display text-[3.4rem] leading-[0.9] sm:text-8xl xl:text-[8rem]">
              Autograph <span className="italic text-gold-600">Collection</span>
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ink/65">
              Thoughtfully designed spaces, mindfully crafted interiors and amenities that leave nothing further to be desired.
            </p>
          </Reveal>
        </div>

        <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 sm:mt-20 md:mx-0 md:grid md:grid-cols-2 md:gap-10 md:overflow-visible md:px-0">
          {residences.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1} className="w-[80vw] shrink-0 snap-start md:w-auto">
              <Link href={`/projects/${p.slug}`} className="group block">
                <p className="eyebrow mb-4 text-gold-600">{p.place}</p>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <MediaImage mediaKey={p.image} alt={`${p.name} — The Autograph Collection`} fill sizes="(min-width:768px) 46vw, 92vw" className="object-cover transition-transform duration-[1.8s] ease-[var(--ease-lux)] group-hover:scale-105" />
                </div>
                <div className="mt-6 flex items-end justify-between gap-6">
                  <div>
                    <h3 className="display text-4xl sm:text-5xl">{p.name}</h3>
                    <p className="mt-2 text-sm text-ink/60">{p.config}</p>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full border border-navy-900/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-navy-900 group-hover:bg-navy-900 group-hover:text-ivory">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center sm:mt-16">
          <EnquireTrigger
            intent="site-visit"
            title="Experience The Autograph Collection"
            className="inline-flex h-12 items-center bg-navy-900 px-8 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory transition hover:bg-navy-800"
          >
            Request a private preview
          </EnquireTrigger>
        </Reveal>
      </div>

      <div className="border-y border-navy-900/10 py-5" aria-label="Signature specifications">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {[...signatures, ...signatures].map((s, i) => (
            <span key={i} className="display flex items-center gap-12 text-xl text-navy-900/55">
              {s} <span className="size-1.5 rotate-45 bg-gold-500" aria-hidden />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
