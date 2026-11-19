import { ArrowRight } from 'lucide-react';
import { EnquireCareers } from '@/components/sections/careers-apply';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { careers } from '@/content/company';
import { site } from '@/lib/site';

export function Careers() {
  return (
    <section id="careers" className="bg-ivory py-28 sm:py-40">
      <div className="container-wide grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Careers"
            title={
              <>
                Build the city <em className="text-gold-600">with us.</em>
              </>
            }
          />
          <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center gap-6">
            <EnquireCareers roles={careers.openings.map((o) => o.title)} />
            <a href={`mailto:${site.contact.careersEmail}`} className="inline-flex items-center gap-2 text-sm text-navy-900 link-underline">
              {site.contact.careersEmail} <ArrowRight className="size-4" />
            </a>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow text-stone">{careers.openings.length} open positions</p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {careers.openings.map((o) => (
              <li key={o.title} className="rounded-full border border-navy-900/15 px-5 py-2.5 text-sm text-navy-900">
                {o.title}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
