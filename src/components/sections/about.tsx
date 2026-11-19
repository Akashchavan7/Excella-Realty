import { Counter } from '@/components/ui/counter';
import { MediaImage } from '@/components/ui/media-image';
import { Reveal } from '@/components/ui/reveal';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { stats } from '@/content/company';

export function About({ more = false }: { more?: boolean }) {
  return (
    <section id="about" className="relative overflow-hidden bg-ivory py-20 sm:py-40">
      <div className="container-wide">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal className="flex items-center gap-4">
              {more && <span className="eyebrow text-stone">01</span>}
              <span className="h-px w-10 bg-gold-600/60" />
              <p className="eyebrow text-gold-600">Defined by Excellence</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display mt-6 text-[2.6rem] text-navy-900 sm:text-6xl lg:text-[5rem]">
                Better tomorrows begin with <em className="text-gold-600">innovating today.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/70">
                Excellaa Realty — formerly the Kalyanee Fortune Group — has been crafting homes across Pune, Mumbai and Gujarat for over three decades.
              </p>
              {more && (
                <Link href="/about" className="group mt-8 inline-flex items-center gap-3 text-sm font-medium text-navy-900">
                  <span className="link-underline">Our story, philosophy and leadership</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </Reveal>
          </div>
          <Reveal className="relative aspect-[16/10] overflow-hidden lg:col-span-4 lg:col-start-9 lg:aspect-[4/5]">
            <MediaImage mediaKey="primarc/tower" alt="Excellaa Primarc tower in Bavdhan at dusk" fill sizes="(min-width:1024px) 30vw, 90vw" className="object-cover" />
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-x-4 gap-y-8 border-t border-navy-900/10 pt-10 sm:mt-24 sm:pt-14 md:grid-cols-5">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className={i >= 3 ? 'max-md:col-span-1' : ''}>
              <p className="display text-[1.9rem] text-navy-900 sm:text-6xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="eyebrow mt-2 text-[0.5rem] text-stone sm:mt-3 sm:text-[0.62rem]">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
