/**
 * Company content transcribed from excellaa.com (About, Group, Management, Awards,
 * Testimonials, Events, Articles, Careers, NRI Corner, Redevelopment, Land Development).
 * Customer quotes are verbatim from Excellaa's testimonial cards (only spacing after
 * punctuation is normalised). Conflicting figures are listed in docs/CONTENT-AUDIT.md.
 */
import type { MediaKey } from './media.generated';
import type { Neighbourhood } from './types';

export const stats = [
  { value: 34, suffix: '+', label: 'Years of legacy' },
  { value: 22, suffix: '+', label: 'Projects delivered' },
  { value: 50, suffix: ' lakh+', label: 'Sq. ft. transformed' },
  { value: 4500, suffix: '+', label: 'Families delighted' },
  { value: 10, suffix: '+', label: 'Prestigious awards' },
] as const;

export const about = {
  eyebrow: 'Defined by Excellence',
  title: 'The road to building better tomorrows begins with innovating today.',
  lead:
    'Excellaa Realty — previously famed as the Kalyanee Fortune Group — has been delivering outstanding spaces for over three decades, crafting more than 50 lakh sq. ft. of prime real estate across Pune, Mumbai and Gujarat.',
  body: [
    'It is this zeal to make a difference that has driven Excellaa Realty to conceive and execute real estate developments designed to fulfil rising lifestyle aspirations while creating value-plus assets that promise to grow in appreciation.',
    'The perennial principles of quality, integrity, innovation, community and a people-first approach define the very basis on which Excellaa Realty was founded. Our ethos — Building with Ethos — sums up every endeavour we undertake.',
  ],
  mission:
    'To make an extraordinary impact on the lives of our customers through the business of real estate. We always raise the bar by exceeding expectations, acting with integrity and building life-long relationships with our clients, employees, partners and stakeholders.',
  vision:
    'To achieve the highest possible standards of excellence in the real estate segment through superior service, attention to detail, quality construction, transparency and mutual trust.',
};

export const values = [
  { title: 'Integrity', text: 'All our team members always do what is ethical, right and fair at all times.' },
  {
    title: 'Quality',
    text: 'We constantly strive for professional excellence, maintaining the highest standards of quality consistent with the goals of each project.',
  },
  {
    title: 'Innovation',
    text: 'We foster an environment that inspires innovation in our processes and results, and give talented people the freedom to innovate at every step.',
  },
  {
    title: 'Community',
    text: 'We believe in giving back to the community we serve, delivering sustainable solutions and working with local partners whenever possible.',
  },
  {
    title: 'People',
    text: 'People are our most valuable asset. We treat them with utmost respect and encourage a balance between business and personal life.',
  },
] as const;

export const philosophy = [
  {
    key: 'architecture',
    title: 'Architecture',
    text: 'Full-height windows, tall ceilings and sky decks that open every home to the horizon.',
    image: 'primarc/tower' as MediaKey,
  },
  {
    key: 'quality',
    title: 'Quality',
    text: 'Outstanding construction and timely delivery — from imported marble to IGBC Platinum pre-certification.',
    image: 'primarc/grand-lobby' as MediaKey,
  },
  {
    key: 'innovation',
    title: 'Innovation',
    text: 'Young ideas and veteran leadership — smart homes, EV charging and solar power.',
    image: 'polaris/infinity-pool' as MediaKey,
  },
  {
    key: 'trust',
    title: 'Trust',
    text: 'Integrity and transparency, with every project MahaRERA-registered.',
    image: 'panama-park/entrance' as MediaKey,
  },
  {
    key: 'relationships',
    title: 'Relationships',
    text: 'A lifelong relationship with every customer.',
    image: 'florence/landscape' as MediaKey,
  },
] as const;

export const group = {
  title: 'Part of a diversified group, since 1987.',
  body: [
    'The promoters are also associated with textiles, diamonds, engineering and contracting. In a drive to create their own mark in the burgeoning real estate world, the idea of Excellaa was conceived — committed to offering the best investment opportunities in real estate with quality, commitment and trust, along with affordability.',
    'Over the years the Group has developed budget-friendly, amenity-rich and luxury residential spaces, and creates value for its clients and partners through quality environments, with a vision to maximise returns on investment for its customers.',
  ],
  companies: [
    'M.S. Textiles',
    'Evershine Residency Pvt. Ltd.',
    'Vinit Impex',
    'Sunmark Holidays',
    'Kalyanee Constructions',
    'Fortune Properties',
    'Kalyanee Fortune Constructions',
    'Kalyanee Fortune Properties',
  ],
  speciality: [
    'Reliable, quality constructions',
    'Trustworthy commitments',
    'Better execution of projects',
    'Dedicated work',
    'After-sales service',
    'Values and ethics that match our clients’',
  ],
  verticals: ['Real estate', 'Textiles', 'Diamonds', 'Engineering', 'Contracting'],
};

export const leadershipIntro =
  'Excellaa Realty’s multifaceted leadership team draws its strength from the guidance of MD Kishore Jain and the complementary capabilities of its directors: Nilesh Agarwal and Rohit Jain’s command over technical operations, Hitesh Jain’s financial acumen, and Sanjay Agarwal and Mitesh Jain’s understanding of land acquisition, sales and marketing.';

export const leadership: { name: string; role: string; focus?: string; image: MediaKey }[] = [
  { name: 'Kishore Jain', role: 'Managing Director', image: 'leadership/kishore-jain' },
  { name: 'Nilesh S. Agarwal', role: 'Director', focus: 'Technical operations', image: 'leadership/nilesh-agarwal' },
  { name: 'Sanjay S. Agarwal', role: 'Director', focus: 'Land acquisition, sales & marketing', image: 'leadership/sanjay-agarwal' },
  { name: 'Rohit Jain', role: 'Director', focus: 'Technical operations', image: 'leadership/rohit-jain' },
  { name: 'Hitesh Jain', role: 'Director', focus: 'Finance', image: 'leadership/hitesh-jain' },
  { name: 'Khushal Sanghvi', role: 'Director', image: 'leadership/khushal-sanghvi' },
  { name: 'Rakshit Sanghvi', role: 'Director', image: 'leadership/rakshit-sanghvi' },
  { name: 'Deepak Jain', role: 'Director', image: 'leadership/deepak-jain' },
  { name: 'Mohanlal Jain', role: 'Director', image: 'leadership/mohanlal-jain' },
];

export const awards: { title: string; detail: string; year: string; image?: MediaKey }[] = [
  { year: '2022', title: 'Real Estate Icon of Pune', detail: 'Times of India', image: 'awards/icon-of-pune-2022' },
  { year: '2021', title: 'Times Realty Icons', detail: 'Times of India', image: 'awards/times-realty-icons-2021' },
  { year: '2021', title: 'Real Estate Developer Award', detail: 'Developer of the Year 2021', image: 'awards/developer-award-2021' },
  { year: '2019', title: 'Best Smart Project of the Year', detail: 'Panama Park — West India (Pune)' },
  { year: '2019', title: 'Best Emerging Developer, Pune', detail: 'Times Realty Icons', image: 'awards/best-emerging-developer' },
  { year: '2018–19', title: 'Real Estate Icon of Pune', detail: 'Icons of Pune', image: 'awards/icons-of-pune' },
  { year: '2016–17', title: 'Best Mid-range Project of the Year', detail: 'West Pune' },
  { year: '2016', title: 'Best Mid-range Apartment Project — West Pune', detail: 'Kalash · SiliconIndia Pune Real Estate Awards', image: 'awards/siliconindia-2016-kalash' },
  { year: '2016', title: 'Real Estate Icon of Pune', detail: 'Icons of Pune' },
  { year: '2015–16', title: 'Best Mid-range Project of the Year', detail: 'West Pune' },
  { year: '2014', title: 'Mid-range Housing Project of the Year — West Pune', detail: 'Fortune 108 · SiliconIndia Pune Real Estate Awards', image: 'awards/siliconindia-2014-fortune-108' },
  { year: '2013–14', title: 'Best Mid-range Project of the Year', detail: 'West Pune' },
];

export const testimonials: { name: string; project: string; projectSlug: string; unit?: string; quote: string }[] = [
  {
    name: 'Maulik Shah',
    project: 'Ganga Acropolis',
    projectSlug: 'ganga-acropolis',
    quote:
      'Before going for this project we had seen couple of projects in the vicinity from other big names. The thing that i love about this project is the way they have laid out the houses. There is complete privacy as required, everything has a proper place to it and the locality in which the project is being built, is also excellent. It’s easy to connect to any part of the city. Another thing that we loved about the builder is that he is very frank, he will tell you everything very truly and there’s some sort of trust that you automatically get when you speak with the builder which was not the case in other projects. The people working here are very helpful and the after sales service is also excellent. I strongly recommend it to everyone who is looking for an apartment in this side of the city.',
  },
  {
    name: 'Annasaheb Sanap',
    project: 'Panama Park',
    projectSlug: 'panama-park',
    unit: 'A-410',
    quote:
      'Panama park is a best investment in Dhanori area so far. From stylish flooring to spacious terrace, high quality fixtures and standard room sizes, everything here gives magnetic look to the project. We are definitely looking forward to move in ASAP.',
  },
  {
    name: 'Sanju',
    project: 'Kalash',
    projectSlug: 'kalash',
    unit: 'B-204',
    quote:
      'I work in Hinjewadi and was looking for a property which is affordable and just 20-25 min from Hinjewadi. I preferred Kalash homes instead of going to Talegaon. There is fresh air and completely surrounded by nature.',
  },
  {
    name: 'Aditya Patil',
    project: 'Ganga Acropolis',
    projectSlug: 'ganga-acropolis',
    quote:
      'It is next to the highway, so one would expect a lot of commotion, but on the contrary of it, it is extremely peaceful, with a great view. You can actually enjoy the facilities provided in serenity.',
  },
  {
    name: 'D. R. Mudaliar',
    project: 'Panama Park',
    projectSlug: 'panama-park',
    unit: 'B-503',
    quote:
      'I got a property in PMC limits the very first thing which was important for me with a very good pricing with well planned layouts in hot location. It was a great experience at Panama Park.',
  },
  {
    name: 'Ranjeet Pandey',
    project: 'Ganga Acropolis',
    projectSlug: 'ganga-acropolis',
    quote:
      'Ganga Acropolis is going to set the new benchmark in luxury segment. I personally feel that i have received best quality of sales process with 100% authentic transparency in terms of price and description of facilities in proposed project. I am delighted and happy to buy home at Ganga Acropolis.',
  },
  {
    name: 'Yuvraj Ovhal',
    project: 'Kalash',
    projectSlug: 'kalash',
    unit: 'B-203',
    quote:
      'We were so happy with the building process. The selection of materials, colors etc. The best part of the location is its just 25 mins from Hinjewadi and Chandani Chowk.',
  },
  {
    name: 'Vivek Tripathi',
    project: 'Ganga Acropolis',
    projectSlug: 'ganga-acropolis',
    quote:
      'I have been looking for a decent size 3 BHK for my family in Western Pune from last 2 year. After searching for more than 100 projects, my house hunt found a stop at Ganga Acropolis project. I liked the project in my very first visit. Ganga Acropolis is a project which is suitable from all my aspects near to city, my workspace (IT Park Hinjewadi), Schools & close to the nature (lot of greenery near-by).',
  },
  {
    name: 'Ranjita Pharate',
    project: 'Panama Park',
    projectSlug: 'panama-park',
    unit: 'A-823',
    quote:
      'Rahul explained us very well with all the phases and 30+ amenities, I was amazed to hear they have a temperature controlled swimming pool. Sample flat made up our mind to get a house here. He further showed us the place where construction was going on. Overall awesome place to live.',
  },
  {
    name: 'Amitabh Mishra',
    project: 'Ganga Acropolis',
    projectSlug: 'ganga-acropolis',
    quote:
      'Apart from a terrific location, the developers have provided us with a great set of luxurious amenities. It is not easy to get such facilities with plush infrastructure at such a rate. It is a great value for my money.',
  },
  {
    name: 'Amlesh Singh',
    project: 'Kalash',
    projectSlug: 'kalash',
    unit: 'B-606',
    quote:
      'I found the property suit my requirement, my budget and the staff at sight were also very co-operative and overall experience with Kalash Homes was a great experience for me.',
  },
  {
    name: 'Sajeev Raghavan',
    project: 'Ganga Acropolis',
    projectSlug: 'ganga-acropolis',
    quote:
      'Searching for a house is usually exhausting and sometimes frustrating task. With so many options the buyers are bound to get confused. But buying a house at Ganga Acropolis is one of the easiest decisions we have ever made. Great location, attractive price, lots of amenities and freebies by trusted developers make Ganga Acropolis one of the best options for investment or for own use. Me and my family can’t wait to move in to our dream home at Ganga Acropolis.',
  },
];

/** Customer video testimonials published on excellaa.com/testimonial1.php */
export const videoTestimonials: { project: string; projectSlug: string; ids: string[] }[] = [
  { project: 'Excellaa Tremont', projectSlug: 'excellaa-tremont', ids: ['Xv9KIWttc6E', 'PM_dk8oooSs', 'artJofSZJS0', 'LIjal_up1ww', 'z_5iG1KOzLc', 'j1Qx9rsFahQ'] },
  { project: 'Excellaa Florence', projectSlug: 'excellaa-florence', ids: ['G9wCUyAApiw', 'iBsTxZbldFg', '4-L2UVvC0gQ', 'l7njOPBZZeI', '-GD96gthBPc', '7E_7Sakpl30', 'ZmiTBZj-vTo', 'WoO2sZlOmpA'] },
];

export const events: { title: string; text: string; images: MediaKey[] }[] = [
  {
    title: 'Panama Park society handover',
    text: 'Homeowners gathered as Panama Park was formally handed over to its residents’ society.',
    images: ['events/panama-handover-1', 'events/panama-handover-2', 'events/panama-handover-3'],
  },
  {
    title: 'Excellaa Business Partner Meet 6.0',
    text: 'Our annual meet recognising the channel partners who help families find their Excellaa home.',
    images: ['events/partner-meet-1', 'events/partner-meet-2', 'events/partner-meet-3'],
  },
];

export const journal: { title: string; excerpt: string; href: string; image: MediaKey; topic: string }[] = [
  {
    topic: 'Neighbourhoods',
    title: 'Kothrud vs Bavdhan: which should you buy in 2026?',
    excerpt: 'Compare connectivity, lifestyle, property options and growth potential to discover which location best suits your home-buying needs.',
    href: 'https://www.excellaa.com/kothrud-vs-bavdhan-which-should-you-buy.php',
    image: 'primarc/sky-deck',
  },
  {
    topic: 'Bavdhan',
    title: 'Why Bavdhan is Pune’s fastest-growing luxury residential destination',
    excerpt: 'Premium homes, great connectivity, green living and investment potential on Pune’s western edge.',
    href: 'https://www.excellaa.com/why-bavdhan-is-punes-fastest-growing-luxury-residential-destination-2026.php',
    image: 'polaris/golf-terrace',
  },
  {
    topic: 'NRI',
    title: 'NRI guide to buying flats in Pune: ROI and best localities',
    excerpt: 'Top localities, expected ROI, rental income potential and smart investment tips for NRIs.',
    href: 'https://www.excellaa.com/nri-guide-buying-flats-pune-roi-best-localities-2026.php',
    image: 'polaris/residents-lounge',
  },
  {
    topic: 'Pimple Nilakh',
    title: 'Why Pimple Nilakh is Pune’s hidden gem for real estate investment',
    excerpt: 'Luxury homes, rising property values and a premium lifestyle in a quiet pocket of the city.',
    href: 'https://www.excellaa.com/why-pimple-nilakh-is-punes-hidden-gem-for-real-estate-investment-2026.php',
    image: 'virtu/pool',
  },
  {
    topic: 'Pirangut',
    title: 'Impact of the Pune Ring Road and metro expansion on Pirangut',
    excerpt: 'How new infrastructure is improving connectivity and driving development in Pirangut.',
    href: 'https://www.excellaa.com/impact-of-pune-ring-road-and-metro-expansion-on-piranguts-growth.php',
    image: 'florence/towers',
  },
  {
    topic: 'Buying guide',
    title: 'Flats near Kothrud in 2026: prices, floor plans & buying guide',
    excerpt: 'Nearby areas, floor plans and a practical buying checklist to help you choose your home in Pune.',
    href: 'https://www.excellaa.com/flats-near-kothrud-2026-price-floor-plans-buying-guide.php',
    image: 'primarc/lobby',
  },
];

export const careers = {
  intro:
    'Our team is made up of passionate people who love to create. We are constantly on the lookout for talented, high-performing and enthusiastic people to join us.',
  culture: [
    { title: 'Room to innovate', text: 'We hire talented, motivated people and give them the freedom to innovate at every step.' },
    { title: 'Balance', text: 'An enriched environment that promotes balance between business and personal life.' },
    { title: 'Growth', text: 'Salary as per industry standards with attractive incentives across sales roles.' },
  ],
  openings: [
    { title: 'HR Manager', team: 'Human Resources' },
    { title: 'Sales — Senior Manager', team: 'Sales', detail: '2 openings' },
    { title: 'Sales — Site Head', team: 'Sales', detail: '5–7 years’ experience' },
    { title: 'Sales — Team Leader', team: 'Sales' },
    { title: 'Sales — Executive', team: 'Sales' },
    { title: 'Sales — Sourcing Manager', team: 'Sales' },
    { title: 'Pre-sales — Executive', team: 'Pre-sales', detail: '1–2 years in real estate' },
    { title: 'Pre-sales — Senior Executive', team: 'Pre-sales' },
    { title: 'CRM — Manager', team: 'Customer relations' },
    { title: 'CRM — Head', team: 'Customer relations' },
  ],
};

export const nri = {
  title: 'Invest with ease. Experience zero hurdles.',
  lead:
    'Excellaa Realty lends full support to NRIs and persons of Indian origin buying property in India — from choosing the right location to documentation and possession.',
  points: [
    {
      title: 'No special permission',
      text: 'NRIs require no special sanction or permission to buy residential or commercial property in India.',
    },
    {
      title: 'Rental income',
      text: 'NRIs may rent out their property and repatriate rental proceeds, subject to applicable taxes.',
    },
    {
      title: 'Selling through Indian channels',
      text: 'An NRI who is an Indian citizen can sell immovable property (other than agricultural land, plantation property or farmhouse) to another NRI through Indian channels, with proceeds credited to an NRI account in India.',
    },
    {
      title: 'Who qualifies',
      text: 'A person resident outside India, as defined under Section 2(w) of FEMA, 1999 — including those staying in India for 182 days or less in the preceding financial year.',
    },
  ],
  disclaimer: 'Summary of the NRI Corner on excellaa.com. Please consult a qualified advisor for current FEMA and tax rules.',
};

export const verticals = [
  {
    key: 'redevelopment',
    title: 'Redevelopment',
    text: 'Transform your old place into one of the most talked-about buildings in the area — modern amenities integrated with old memories, designed with sustainable solutions from the planning stage.',
  },
  {
    key: 'land',
    title: 'Land development',
    text: 'Plotting, reinvented. Beyond regular plots, Excellaa presents themed plotted developments — European living, village, resort or sports — with amenities to match.',
  },
] as const;

export const neighbourhoods: Neighbourhood[] = [
  {
    id: 'bavdhan',
    name: 'Bavdhan',
    blurb:
      'Once a suburb of Kothrud, now one of Pune’s most sought-after addresses — a green gateway to Baner and Hinjawadi, minutes from Chandani Chowk and the Mumbai–Bengaluru highway.',
    image: 'polaris/infinity-pool',
    center: [73.7652, 18.5076],
    zoom: 14.2,
  },
  {
    id: 'pirangut',
    name: 'Pirangut',
    blurb: 'A rapidly developing suburb in the lap of nature, about 15 minutes from Hinjawadi, Sus and Chandani Chowk.',
    image: 'florence/entrance',
    center: [73.6775, 18.5112],
    zoom: 13.4,
  },
  {
    id: 'pimple-nilakh',
    name: 'Pimple Nilakh',
    blurb: 'A quiet residential pocket off the Aundh–Wakad Road, close to Aundh and Baner.',
    image: 'virtu/elevation',
    center: [73.7838, 18.5884],
    zoom: 14.5,
  },
  {
    id: 'baner-sus',
    name: 'Baner – Sus',
    blurb: 'Close to the Hinjewadi IT parks and Baner’s MNCs, with the uptown lifestyle of Baner next door.',
    image: 'ganga-acropolis/towers',
    center: [73.7735, 18.5578],
    zoom: 13.8,
  },
  {
    id: 'wakad',
    name: 'Wakad',
    blurb: 'Home to Fortune 108, recognised as West Pune’s mid-range housing project of the year in 2014.',
    image: 'legacy/fortune-108',
    center: [73.7645, 18.6022],
    zoom: 14,
  },
  {
    id: 'keshav-nagar-mundhwa',
    name: 'Keshav Nagar – Mundhwa',
    blurb:
      'East Pune’s vibrant address — Amanora, Phoenix Marketcity and the EON, Magarpatta and Zensar IT hubs minutes away; Koregaon Park and Kharadi within 5 km.',
    image: 'tremont/sky-pool',
    center: [73.9278, 18.5207],
    zoom: 14,
  },
  {
    id: 'dhanori-lohegaon',
    name: 'Dhanori – Lohegaon',
    blurb: 'Pune’s fast-growing north-east, close to the international airport, the railway station and the Pune–Nagar Highway.',
    image: 'panama-park/towers',
    center: [73.9003, 18.5965],
    zoom: 13.4,
  },
  {
    id: 'vishrantwadi',
    name: 'Vishrantwadi',
    blurb: 'An established northern neighbourhood where the Group delivered Sai Paradise at Kalas.',
    image: 'legacy/sai-paradise',
    center: [73.8783, 18.5726],
    zoom: 14.5,
  },
  {
    id: 'ambegaon',
    name: 'Ambegaon Budruk',
    blurb: 'One of Pune’s fastest-growing southern suburbs — two minutes from Sinhagad Road, close to Katraj and Warje.',
    image: 'plazzo/building',
    center: [73.8271, 18.4571],
    zoom: 14.6,
  },
];
