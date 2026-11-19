import { EnquireTrigger } from '@/components/forms/enquiry-dialog';
import { MediaImage } from '@/components/ui/media-image';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { group, leadership } from '@/content/company';

export function Group() {
  return (
    <section id="group" className="bg-ivory py-28 sm:py-40">
      <div className="container-wide">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Our Group"
            title={
              <>
                A diversified group, <em className="text-gold-600">since 1987.</em>
              </>
            }
          />
          <Reveal className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">
            {group.verticals.map((v) => (
              <span key={v} className="rounded-full border border-navy-900/15 px-4 py-1.5 text-xs tracking-wide text-navy-900">
                {v}
              </span>
            ))}
          </Reveal>
        </div>

        <ul className="mt-16 grid grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-9">
          {leadership.map((l, i) => (
            <li key={l.name} className="group">
              <Reveal delay={(i % 9) * 0.04}>
                <div className="relative aspect-[4/5] overflow-hidden bg-navy-900">
                  <MediaImage
                    mediaKey={l.image}
                    alt={`${l.name}, ${l.role}`}
                    fill
                    sizes="(min-width:1024px) 11vw, 30vw"
                    className="object-cover grayscale transition duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                <p className="mt-3 text-sm font-medium leading-tight text-navy-900">{l.name}</p>
                <p className="mt-1 text-[0.62rem] uppercase tracking-[0.16em] text-stone">{l.role}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-20 flex flex-col items-start justify-between gap-8 bg-navy-900 p-8 text-ivory sm:p-12 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow text-champagne">Beyond residential</p>
            <h3 className="display mt-3 text-4xl sm:text-5xl">Redevelopment & land development</h3>
          </div>
          <EnquireTrigger
            intent="general"
            title="Redevelopment & land enquiry"
            className="inline-flex shrink-0 items-center border border-ivory/30 px-7 py-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ivory transition hover:border-champagne hover:text-champagne"
          >
            Discuss your land
          </EnquireTrigger>
        </Reveal>
      </div>
    </section>
  );
}
