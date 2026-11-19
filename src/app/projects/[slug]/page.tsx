import { ArrowLeft, ArrowUpRight, Check, Download, ExternalLink, MapPin, MessageCircle, Navigation, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EnquireTrigger } from '@/components/forms/enquiry-dialog';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { directionsUrl } from '@/components/map/map-style';
import { ProjectMap } from '@/components/map/project-map';
import { Gallery } from '@/components/project/gallery';
import { ProjectCard } from '@/components/project/project-card';
import { MediaImage } from '@/components/ui/media-image';
import { Reveal } from '@/components/ui/reveal';
import { neighbourhoods } from '@/content/company';
import { media } from '@/content/media.generated';
import { getProject, projects, relatedProjects, statusLabel } from '@/content/projects';
import { absoluteUrl, site, whatsappLink } from '@/lib/site';
import { cn } from '@/lib/utils';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.name}, ${p.locality} — ${p.configuration}`;
  const image = p.cover ? media[p.cover] : undefined;
  return {
    title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: {
      title: `${p.name} · Excellaa Realty`,
      description: p.summary,
      url: absoluteUrl(`/projects/${p.slug}`),
      images: image ? [{ url: image.src, width: image.width, height: image.height, alt: p.name }] : undefined,
    },
  };
}

const collectionName = { autograph: 'The Autograph Collection', gold: 'The Gold Collection' } as const;

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const p = project;

  const hood = neighbourhoods.find((n) => n.id === p.neighbourhood);
  const related = relatedProjects(p, 3);
  const neighbours = projects
    .filter((o) => o.slug !== p.slug && o.geo && p.geo && Math.hypot(o.geo.lat - p.geo.lat, o.geo.lng - p.geo.lng) < 0.06)
    .map((o) => ({ name: o.name, slug: o.slug, lat: o.geo!.lat, lng: o.geo!.lng }));
  const enquirable = p.status !== 'completed';

  const nav = [
    { id: 'overview', label: 'Overview', show: true },
    { id: 'gallery', label: 'Gallery', show: !!p.gallery && p.gallery.length > 1 },
    { id: 'plans', label: 'Floor plans', show: !!p.floorPlans?.length },
    { id: 'amenities', label: 'Amenities', show: !!p.amenities?.length },
    { id: 'specifications', label: 'Specifications', show: !!p.specifications?.length },
    { id: 'location', label: 'Location', show: !!p.geo || !!p.address },
    { id: 'rera', label: 'MahaRERA', show: p.rera.length > 0 },
    { id: 'enquire', label: 'Enquire', show: true },
  ].filter((n) => n.show);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': p.segment === 'commercial' ? 'Place' : 'ApartmentComplex',
    name: p.name,
    description: p.summary,
    url: absoluteUrl(`/projects/${p.slug}`),
    image: p.cover ? absoluteUrl(media[p.cover].src) : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: p.address,
      addressLocality: p.city === 'Pune district' ? 'Pune' : p.city,
      addressCountry: 'IN',
    },
    geo: p.geo?.precision === 'site' ? { '@type': 'GeoCoordinates', latitude: p.geo.lat, longitude: p.geo.lng } : undefined,
    containedInPlace: hood ? { '@type': 'Place', name: `${hood.name}, Pune` } : undefined,
    brand: { '@type': 'Organization', name: site.name },
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="grain relative flex min-h-[92svh] items-end overflow-hidden bg-navy-950 text-ivory">
        {p.cover && (
          <MediaImage mediaKey={p.cover} alt={`${p.name}, ${p.locality}`} fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/45 to-navy-950/50" />
        <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-navy-950/75 to-transparent" />
        <div className="container-wide relative pb-16 pt-36 sm:pb-20">
          <Link href="/projects" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-ivory/70 transition hover:text-champagne">
            <ArrowLeft className="size-4" /> All projects
          </Link>
          <Reveal>
            <p className="eyebrow mt-10 flex items-center gap-2 text-champagne">
              <MapPin className="size-3.5" /> {p.locality}
              {p.locality === p.city ? '' : `, ${p.city}`}
            </p>
            {p.collection && <p className="mt-4 font-display text-xl italic text-champagne/90">{collectionName[p.collection]}</p>}
            <h1 className="display mt-3 text-[3.4rem] sm:text-8xl lg:text-[8rem]">{p.name}</h1>
            {p.tagline && <p className="mt-4 font-display text-2xl italic text-ivory/85 sm:text-3xl">{p.tagline}</p>}
          </Reveal>
          <Reveal delay={0.1} className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <dl className="grid grid-cols-2 gap-x-10 gap-y-5 sm:flex sm:flex-wrap">
              <div>
                <dt className="eyebrow text-[0.6rem] text-mist">Configuration</dt>
                <dd className="mt-1 text-lg">{p.configuration}</dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.6rem] text-mist">Status</dt>
                <dd className="mt-1 flex items-center gap-2 text-lg">
                  <span className={cn('size-2 rounded-full', p.status === 'ongoing' ? 'bg-gold-500' : p.status === 'upcoming' ? 'bg-ivory' : 'bg-mist')} />
                  {statusLabel[p.status]}
                </dd>
              </div>
              {p.rera[0] && (
                <div>
                  <dt className="eyebrow text-[0.6rem] text-mist">MahaRERA</dt>
                  <dd className="mt-1 text-lg">{p.rera.map((r) => r.number).join(' · ')}</dd>
                </div>
              )}
            </dl>
            <div className="flex flex-wrap gap-3">
              {enquirable ? (
                <>
                  <EnquireTrigger intent="site-visit" project={p.name} title={`Visit ${p.name}`} className="inline-flex h-12 items-center bg-gold-500 px-7 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-navy-950 transition hover:bg-gold-400">
                    Book a site visit
                  </EnquireTrigger>
                  <EnquireTrigger intent="pricing" project={p.name} title="Request pricing" className="inline-flex h-12 items-center border border-ivory/35 px-7 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ivory transition hover:border-champagne hover:text-champagne">
                    Request pricing
                  </EnquireTrigger>
                </>
              ) : (
                <EnquireTrigger intent="general" title={`Enquire about ${p.name}`} className="inline-flex h-12 items-center bg-gold-500 px-7 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-navy-950 transition hover:bg-gold-400">
                  Enquire about resale & similar homes
                </EnquireTrigger>
              )}
              {p.brochure && (
                <a href={p.brochure.href} download className="inline-flex h-12 items-center gap-2 border border-ivory/35 px-6 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ivory transition hover:border-champagne hover:text-champagne">
                  <Download className="size-4" /> Brochure
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Section nav ── */}
      <nav aria-label="Project sections" className="sticky top-[4.5rem] z-30 border-b border-navy-900/10 bg-ivory/90 backdrop-blur-xl">
        <div className="container-wide no-scrollbar flex gap-1 overflow-x-auto">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="shrink-0 px-4 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink/60 transition hover:text-navy-900">
              {n.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Overview ── */}
      <section id="overview" className="bg-ivory py-24 sm:py-32">
        <div className="container-wide grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow text-gold-600">Overview</p>
            <p className="display mt-6 text-3xl leading-snug text-navy-900 sm:text-[2.6rem]">{p.summary}</p>
            {p.story && (
              <div className="mt-10 space-y-5 text-[1.02rem] leading-relaxed text-ink/70 md:columns-2 md:gap-10 md:space-y-0 [&>p]:mb-5 [&>p]:break-inside-avoid">
                {p.story.map((s) => (
                  <p key={s.slice(0, 24)}>{s}</p>
                ))}
              </div>
            )}
            {p.partners && <p className="mt-6 border-l-2 border-gold-500 pl-4 text-sm text-ink/70">{p.partners}</p>}
            {p.legacy && (
              <p className="mt-8 text-sm text-stone">
                Excellaa’s current website lists this completed project with its locality and photograph only. Further details can be shared on request.
              </p>
            )}
          </Reveal>
          <div className="lg:col-span-5">
            {p.facts && (
              <dl className="grid grid-cols-2 gap-px bg-navy-900/10">
                {p.facts.map((f) => (
                  <div key={f.label} className="bg-ivory p-5">
                    <dt className="eyebrow text-[0.6rem] text-stone">{f.label}</dt>
                    <dd className="display mt-2 text-2xl leading-tight text-navy-900">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {p.highlights && (
              <ul className="mt-8 space-y-3">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-ink/80">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-600" /> {h}
                  </li>
                ))}
              </ul>
            )}
            {(p.microsite || p.brochure) && (
              <div className="mt-8 flex flex-wrap gap-4 text-sm">
                {p.brochure && (
                  <a href={p.brochure.href} download className="inline-flex items-center gap-2 text-navy-900 link-underline">
                    <Download className="size-4" /> {p.brochure.label} {p.brochure.size && <span className="text-stone">({p.brochure.size})</span>}
                  </a>
                )}
                {p.microsite && (
                  <a href={p.microsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-navy-900 link-underline">
                    <ExternalLink className="size-4" /> Current project microsite
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      {p.gallery && p.gallery.length > 1 && (
        <section id="gallery" className="bg-navy-950 py-24 text-ivory sm:py-32">
          <div className="container-wide">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-champagne">Architectural gallery</p>
                <h2 className="display mt-4 text-5xl sm:text-6xl">Through the lens</h2>
              </div>
              <p className="hidden text-sm text-mist sm:block">{p.gallery.length} images · artist’s impressions</p>
            </div>
            <div className="mt-12">
              <Gallery items={p.gallery} projectName={p.name} />
            </div>
          </div>
        </section>
      )}

      {/* ── Floor plans ── */}
      {p.floorPlans && p.floorPlans.length > 0 && (
        <section id="plans" className="bg-sand/60 py-24 sm:py-32">
          <div className="container-wide">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-gold-600">Floor plans</p>
                <h2 className="display mt-4 text-5xl text-navy-900 sm:text-6xl">Plans & layouts</h2>
              </div>
              {p.brochure ? (
                <a href={p.brochure.href} download className="inline-flex h-12 items-center gap-2 bg-navy-900 px-6 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ivory">
                  <Download className="size-4" /> Download brochure
                </a>
              ) : enquirable ? (
                <EnquireTrigger intent="brochure" project={p.name} title="Request the brochure" className="inline-flex h-12 items-center gap-2 bg-navy-900 px-6 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ivory">
                  <Download className="size-4" /> Request brochure
                </EnquireTrigger>
              ) : null}
            </div>
            <div className="mt-12">
              <Gallery items={p.floorPlans} projectName={p.name} variant="plans" />
            </div>
          </div>
        </section>
      )}

      {/* ── Amenities ── */}
      {p.amenities && p.amenities.length > 0 && (
        <section id="amenities" className="bg-ivory py-24 sm:py-32">
          <div className="container-wide">
            <p className="eyebrow text-gold-600">Amenities</p>
            <h2 className="display mt-4 text-5xl text-navy-900 sm:text-6xl">Everyday, elevated</h2>
            <div className={cn('mt-14 grid gap-12', p.amenities.length > 1 && 'lg:grid-cols-2')}>
              {p.amenities.map((g) => (
                <Reveal key={g.title}>
                  <h3 className="display border-b border-navy-900/15 pb-4 text-3xl text-navy-900">{g.title}</h3>
                  <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {g.items.map((a) => (
                      <li key={a} className="flex items-start gap-3 text-[0.95rem] text-ink/75">
                        <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-gold-500" /> {a}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Specifications ── */}
      {p.specifications && p.specifications.length > 0 && (
        <section id="specifications" className="bg-navy-900 py-24 text-ivory sm:py-32">
          <div className="container-wide">
            <p className="eyebrow text-champagne">Specifications</p>
            <h2 className="display mt-4 text-5xl sm:text-6xl">Crafted to specification</h2>
            <div className="mt-14 grid gap-px bg-champagne/15 sm:grid-cols-2 lg:grid-cols-3">
              {p.specifications.map((s) => (
                <div key={s.title} className="bg-navy-900 p-7">
                  <h3 className="eyebrow text-champagne">{s.title}</h3>
                  <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-mist">
                    {s.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Location ── */}
      {(p.geo || p.address) && (
        <section id="location" className="bg-ivory py-24 sm:py-32">
          <div className="container-wide grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-gold-600">Location</p>
              <h2 className="display mt-4 text-5xl text-navy-900">{hood?.name ?? p.locality}</h2>
              {hood && <p className="mt-5 leading-relaxed text-ink/70">{hood.blurb}</p>}
              {p.address && (
                <p className="mt-6 flex items-start gap-3 text-sm text-ink/80">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold-600" /> {p.address}
                </p>
              )}
              {p.geo && (
                <a href={directionsUrl(p.geo.lat, p.geo.lng)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy-900 link-underline">
                  <Navigation className="size-4" /> Get directions
                </a>
              )}
              {p.geo?.precision === 'locality' && <p className="mt-3 text-xs text-stone">Map pin marks the locality; the exact site is shared when you book a visit.</p>}
              {p.nearby && (
                <div className="mt-10 space-y-8">
                  {p.nearby.map((g) => (
                    <div key={g.category}>
                      <p className="eyebrow text-[0.62rem] text-stone">{g.category}</p>
                      <ul className="mt-3 divide-y divide-navy-900/10 border-y border-navy-900/10">
                        {g.places.map((pl) => (
                          <li key={pl.name} className="flex justify-between gap-4 py-2.5 text-sm text-ink/80">
                            <span>{pl.name}</span>
                            {pl.distance && <span className="shrink-0 text-gold-600">{pl.distance}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="lg:col-span-8">
              {p.geo ? (
                <ProjectMap name={p.name} geo={p.geo} neighbours={neighbours} />
              ) : (
                <div className="grid h-full min-h-[320px] place-items-center bg-navy-900 p-10 text-center text-mist">
                  <p>
                    {p.name} is located in {p.locality}, {p.city}.<br />Ask our team for directions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── MahaRERA ── */}
      {p.rera.length > 0 && (
        <section id="rera" className="border-y border-navy-900/10 bg-sand/60 py-16">
          <div className="container-wide flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-5">
              <ShieldCheck className="size-10 shrink-0 text-gold-600" strokeWidth={1.2} />
              <div>
                <p className="eyebrow text-gold-600">MahaRERA registration</p>
                <ul className="mt-3 space-y-1">
                  {p.rera.map((r) => (
                    <li key={r.number} className="display text-3xl text-navy-900">
                      {r.number} {r.label && <span className="font-sans text-sm text-stone">· {r.label}</span>}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 max-w-2xl text-xs leading-relaxed text-stone">
                  Registration as published by Excellaa Realty. Verify the certificate and project details on the MahaRERA portal. Images are artist’s impressions; amenities and specifications are as per the agreement for sale.
                </p>
              </div>
            </div>
            <a href={site.maharera} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 shrink-0 items-center gap-2 border border-navy-900/25 px-6 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-navy-900 transition hover:bg-navy-900 hover:text-ivory">
              Verify on MahaRERA <ArrowUpRight className="size-4" />
            </a>
          </div>
        </section>
      )}

      {/* ── Enquire ── */}
      <section id="enquire" className="bg-navy-900 py-24 text-ivory sm:py-32">
        <div className="container-wide grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-champagne">{p.name}</p>
            <h2 className="display mt-4 text-5xl sm:text-6xl">{enquirable ? 'Visit, ask, decide.' : 'Looking for something similar?'}</h2>
            <p className="mt-5 max-w-md leading-relaxed text-mist">
              {enquirable
                ? 'Book a guided site visit, request current pricing and availability, or ask for the brochure — an Excellaa advisor will be in touch.'
                : 'This project has been delivered. Tell us what you are looking for and we will suggest ongoing Excellaa homes that match.'}
            </p>
            <div className="mt-8 flex flex-col gap-3 text-sm">
              <a href={site.contact.salesPhone.href} className="text-ivory/85 hover:text-champagne">Sales · {site.contact.salesPhone.display}</a>
              <a href={whatsappLink(`Hi, I would like to know more about ${p.name}.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-ivory/85 hover:text-champagne">
                <MessageCircle className="size-4 text-champagne" /> WhatsApp about {p.name}
              </a>
            </div>
          </div>
          <div className="lg:col-span-7">
            <EnquiryForm
              tone="dark"
              project={enquirable ? p.name : undefined}
              lockProject={enquirable}
              defaultIntent={enquirable ? 'site-visit' : 'general'}
              intents={enquirable ? ['site-visit', 'pricing', 'brochure', 'general'] : ['general', 'site-visit']}
              source={`project:${p.slug}`}
            />
          </div>
        </div>
      </section>

      {/* ── Related ── */}
      <section className="bg-ivory py-24 sm:py-32">
        <div className="container-wide">
          <div className="flex items-end justify-between gap-6">
            <h2 className="display text-5xl text-navy-900 sm:text-6xl">You may also like</h2>
            <Link href="/projects" className="hidden text-sm text-navy-900 link-underline sm:inline">
              All projects
            </Link>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ProjectCard key={r.slug} project={r} aspect="aspect-[4/3]" />
            ))}
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
