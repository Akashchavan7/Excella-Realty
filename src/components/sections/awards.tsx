import { MediaImage } from '@/components/ui/media-image';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { awards } from '@/content/company';

export function Awards() {
  const top = awards.slice(0, 6);
  const image = awards.find((a) => a.image);
  return (
    <section id="awards" className="bg-ivory pb-28 sm:pb-40">
      <div className="container-wide">
        <div className="hairline mb-24" />
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Awards"
              title={
                <>
                  Recognised by <em className="text-gold-600">the city we build.</em>
                </>
              }
            />
            {image?.image && (
              <Reveal delay={0.1} className="relative mt-12 aspect-[962/824] max-w-md overflow-hidden bg-sand">
                <MediaImage mediaKey={image.image} alt={`${image.title} ${image.year}`} fill sizes="(min-width:1024px) 30vw, 90vw" className="object-cover" />
              </Reveal>
            )}
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {top.map((a, i) => (
              <li key={`${a.year}-${a.title}-${i}`} className="border-b border-navy-900/12 first:border-t">
                <Reveal delay={i * 0.04} className="grid grid-cols-[88px_1fr] items-baseline gap-6 py-6 sm:grid-cols-[120px_1fr]">
                  <span className="display text-3xl text-gold-600">{a.year}</span>
                  <span>
                    <span className="display block text-2xl leading-tight text-navy-900 sm:text-[1.7rem]">{a.title}</span>
                    <span className="mt-1 block text-sm text-ink/55">{a.detail}</span>
                  </span>
                </Reveal>
              </li>
            ))}
            <li className="pt-5 text-sm text-stone">+ {awards.length - top.length} more recognitions since 2013</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
