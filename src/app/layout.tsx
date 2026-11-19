import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { EnquiryProvider } from '@/components/forms/enquiry-dialog';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { MobileActions } from '@/components/layout/mobile-actions';
import { site } from '@/lib/site';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Excellaa Realty — Luxury Homes & Landmark Projects in Pune',
    template: '%s · Excellaa Realty',
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'Excellaa Realty',
    'Excellaa',
    'Kalyanee Fortune Group',
    'Autograph Collection',
    'Excellaa Polaris',
    'Excellaa Primarc',
    'flats in Bavdhan',
    'luxury apartments Pune',
    'real estate developer Pune',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    url: site.url,
    title: 'Excellaa Realty — Building with Ethos',
    description: site.description,
  },
  twitter: { card: 'summary_large_image', title: 'Excellaa Realty — Building with Ethos', description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#05011a',
  width: 'device-width',
  initialScale: 1,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: site.name,
  alternateName: site.formerly,
  url: site.url,
  logo: `${site.url}/brand/excellaa-logo.png`,
  slogan: site.tagline,
  foundingDate: '1987',
  telephone: '+91-20-71969111',
  email: site.contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2-F & 2-EB, 2nd Floor, B Wing, Gulmohar Apartments, East Street, Camp',
    addressLocality: 'Pune',
    postalCode: '411001',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  areaServed: ['Pune', 'Mumbai', 'Gujarat'],
  sameAs: site.social.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a href="#main" className="sr-only z-[100] bg-gold-500 px-4 py-2 text-navy-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <EnquiryProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <MobileActions />
        </EnquiryProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </body>
    </html>
  );
}
