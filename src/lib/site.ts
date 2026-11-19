/**
 * Single source of truth for company-wide contact details and URLs.
 * Every value here was taken from excellaa.com (November 2026). Several numbers
 * differ between pages on the current site; see docs/CONTENT-AUDIT.md before launch.
 */
export const site = {
  name: 'Excellaa Realty',
  legalName: 'Excellaa Realty',
  formerly: 'Kalyanee Fortune Group',
  tagline: 'Building with Ethos',
  description:
    'Excellaa Realty — formerly the Kalyanee Fortune Group — has crafted over 50 lakh sq. ft. of homes and workplaces across Pune, Mumbai and Gujarat for 34+ years. Explore ongoing, upcoming and completed projects, including The Autograph Collection in Bavdhan.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.excellaa.com').replace(/\/$/, ''),
  locale: 'en_IN',
  proposalBy: 'NIVON Tech Studio',
  contact: {
    salesPhone: { display: '020 7196 9111', href: 'tel:+912071969111' },
    tollFree: { display: '1800 103 3130', href: 'tel:18001033130' },
    whatsapp: {
      display: '+91 85307 77566',
      number: '918530777566',
    },
    officePhones: [
      { display: '+91 88802 00900', href: 'tel:+918880200900' },
      { display: '+91 97641 88388', href: 'tel:+919764188388' },
    ],
    email: 'info@excellaa.com',
    careersEmail: 'hr@excellaa.com',
  },
  offices: [
    {
      city: 'Pune',
      label: 'Corporate Office',
      lines: ['2-F & 2-EB, 2nd Floor, B Wing, Gulmohar Apartments', 'East Street, Camp, Pune 411001'],
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=18.511509,73.878880',
    },
    {
      city: 'Mumbai',
      label: 'Mumbai Office',
      lines: ['3AA Edena, 3rd Floor, 97 Maharshi Karve Road', 'Marine Lines, Mumbai 400020'],
      mapUrl:
        'https://www.google.com/maps/search/?api=1&query=Edena+97+Maharshi+Karve+Road+Marine+Lines+Mumbai',
    },
  ],
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/the_excellaa/' },
    { label: 'Facebook', href: 'https://www.facebook.com/Excellaa/' },
    { label: 'YouTube', href: 'https://www.youtube.com/channel/UCBxSl11Ck9VfWVwreB5KEMQ' },
  ],
  maharera: 'https://maharera.maharashtra.gov.in',
} as const;

export function whatsappLink(message = 'Hi, I would like to enquire about Excellaa projects.') {
  return `https://wa.me/${site.contact.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export function absoluteUrl(path = '/') {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}
