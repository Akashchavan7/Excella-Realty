import type { Metadata } from 'next';
import { About } from '@/components/sections/about';
import { Awards } from '@/components/sections/awards';
import { Group } from '@/components/sections/group';
import { Philosophy } from '@/components/sections/philosophy';
import { PageHero } from '@/components/ui/page-hero';

export const metadata: Metadata = {
  title: 'About Excellaa Realty — Legacy, Philosophy & Leadership',
  description: 'Excellaa Realty, formerly the Kalyanee Fortune Group: 34+ years, 22+ projects and 50 lakh+ sq. ft. across Pune, Mumbai and Gujarat.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Excellaa"
        title={
          <>
            Building with <em className="text-champagne">Ethos.</em>
          </>
        }
        image="primarc/sky-deck"
      />
      <About />
      <Philosophy />
      <Group />
      <Awards />
    </>
  );
}
