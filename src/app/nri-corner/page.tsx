import type { Metadata } from 'next';
import { NriCorner } from '@/components/sections/nri-corner';

export const metadata: Metadata = {
  title: 'NRI Corner — Invest in Pune with Excellaa Realty',
  description: 'Support for NRIs and persons of Indian origin buying property in Pune with Excellaa Realty.',
  alternates: { canonical: '/nri-corner' },
};

export default function NriPage() {
  return (
    <div className="bg-navy-950 pt-16">
      <NriCorner />
    </div>
  );
}
