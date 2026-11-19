import { ArrowUpRight } from 'lucide-react';
import { MediaImage } from '@/components/ui/media-image';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { events, journal } from '@/content/company';

export function Journal() {
  const articles = journal.slice(0, 3);
  return (
    <section id="journal" className="bg-sand/60 py-28 sm:py-40">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Media & Journal"
          title={
            <>
              Notes on <em className="text-gold-600">living in Pune.</em>
            </>
          }
        />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {articles.map((a, i) => (
            <Reveal key={a.href} delay={i * 0.08}>
              <a href={a.href} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <MediaImage mediaKey={a.image} alt="" fill sizes="(min-width:768px) 30vw, 92vw" className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-lux)] group-hover:scale-105" />
                </div>
                <p className="eyebrow mt-5 text-[0.62rem] text-gold-600">{a.topic}</p>
                <h3 className="display mt-2 flex items-start justify-between gap-4 text-[1.7rem] leading-tight text-navy-900">
                  {a.title}
                  <ArrowUpRight className="mt-1 size-5 shrink-0 text-gold-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </h3>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {events.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.08} className="group relative aspect-[16/9] overflow-hidden">
              <MediaImage mediaKey={e.images[0]!} alt={e.title} fill sizes="(min-width:768px) 46vw, 92vw" className="object-cover transition-transform duration-[1.6s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 text-ivory">
                <p className="eyebrow text-[0.62rem] text-champagne">Event</p>
                <h3 className="display mt-1 text-3xl">{e.title}</h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
