import { Check, Globe2 } from 'lucide-react';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { MediaImage } from '@/components/ui/media-image';
import { Reveal } from '@/components/ui/reveal';
import { nri } from '@/content/company';

export function NriCorner() {
  return (
    <section id="nri" className="relative overflow-hidden bg-navy-950 text-ivory">
      <div className="absolute inset-0 opacity-30">
        <MediaImage mediaKey="polaris/residents-lounge" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/95 to-navy-950/80" />
      <div className="container-wide relative grid items-center gap-16 py-28 sm:py-40 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-champagne">
              <Globe2 className="size-3.5" /> NRI Corner
            </p>
            <h2 className="display mt-6 text-[2.6rem] sm:text-6xl lg:text-7xl">
              Invest with ease. <em className="text-champagne">Zero hurdles.</em>
            </h2>
          </Reveal>
          <ul className="mt-10 space-y-4">
            {nri.points.slice(0, 3).map((p, i) => (
              <li key={p.title}>
                <Reveal delay={i * 0.06} className="flex items-center gap-4 text-lg text-ivory/90">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-champagne/40 text-champagne">
                    <Check className="size-4" />
                  </span>
                  {p.title}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
        <Reveal delay={0.1} className="border border-champagne/20 bg-navy-900/80 p-6 backdrop-blur-xl sm:p-10 lg:col-span-6">
          <EnquiryForm tone="dark" defaultIntent="nri" intents={['nri']} source="nri-corner" />
        </Reveal>
      </div>
    </section>
  );
}
