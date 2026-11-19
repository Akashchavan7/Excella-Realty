import type { Metadata } from 'next';
import { Journal } from '@/components/sections/journal';
import { PageHero } from '@/components/ui/page-hero';

export const metadata: Metadata = {
  title: 'Media & Journal — Excellaa Realty',
  description: 'Articles on living and investing in Pune, and events from Excellaa Realty.',
  alternates: { canonical: '/media' },
};

export default function MediaPage() {
  return (
    <>
      <PageHero
        eyebrow="Media & Journal"
        title={
          <>
            Stories from <em className="text-champagne">Excellaa.</em>
          </>
        }
        image="events/panama-handover-1"
      />
      <Journal />
    </>
  );
}
