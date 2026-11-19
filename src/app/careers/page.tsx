import type { Metadata } from 'next';
import { Careers } from '@/components/sections/careers';
import { PageHero } from '@/components/ui/page-hero';

export const metadata: Metadata = {
  title: 'Careers at Excellaa Realty',
  description: 'Join the Excellaa Realty team — current openings across sales, pre-sales, CRM and HR in Pune.',
  alternates: { canonical: '/careers' },
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={
          <>
            Join <em className="text-champagne">Excellaa.</em>
          </>
        }
        image="polaris/business-centre"
      />
      <Careers />
    </>
  );
}
