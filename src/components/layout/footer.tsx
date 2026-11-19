import { ArrowUpRight, Mail, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import { projects } from '@/content/projects';
import { site, whatsappLink } from '@/lib/site';
import { Logo } from './logo';

const quickLinks = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Explore Pune', href: '/#explore' },
  { label: 'NRI Corner', href: '/nri-corner' },
  { label: 'Careers', href: '/careers' },
  { label: 'Media', href: '/media' },
  { label: 'Contact', href: '/#enquire' },
];

export function Footer() {
  const current = projects.filter((p) => p.status === 'ongoing');
  return (
    <footer className="relative overflow-hidden border-t border-champagne/10 bg-navy-950 pb-16 text-ivory sm:pb-0">
      <p
        className="display pointer-events-none absolute inset-x-0 bottom-14 select-none whitespace-nowrap text-center text-[21vw] leading-[0.8] text-ivory/[0.045] sm:-bottom-[2vw]"
        aria-hidden
      >
        Excellaa
      </p>

      <div className="container-wide relative pt-12 sm:pt-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo reversed className="h-10 sm:h-11" />
            <p className="display mt-5 max-w-md text-2xl leading-tight text-ivory/95 sm:text-3xl">
              Building with <em className="text-champagne">Ethos</em> — since 1987.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {site.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs tracking-wide text-ivory/70 transition hover:text-champagne"
                >
                  {s.label} <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links: one wrapped row on phones, two short columns on desktop */}
          <nav aria-label="Footer" className="lg:col-span-4">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm lg:hidden">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ivory/80 hover:text-champagne">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="hidden grid-cols-2 gap-8 lg:grid">
              <div>
                <p className="eyebrow text-champagne">Ongoing</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {current.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/projects/${p.slug}`} className="text-ivory/75 transition hover:text-champagne">
                        {p.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/projects" className="text-champagne">
                      All projects →
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="eyebrow text-champagne">Explore</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {quickLinks
                    .filter((l) => l.href !== '/projects')
                    .map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-ivory/75 transition hover:text-champagne">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </nav>

          {/* Contact + offices */}
          <div className="text-sm lg:col-span-4">
            <p className="eyebrow hidden text-champagne lg:block">Talk to us</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-ivory/85 lg:mt-4 lg:block lg:space-y-2">
              <li>
                <a href={site.contact.salesPhone.href} className="inline-flex items-center gap-2 hover:text-champagne">
                  <Phone className="size-4 text-champagne" /> {site.contact.salesPhone.display}
                </a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-champagne">
                  <MessageCircle className="size-4 text-champagne" /> {site.contact.whatsapp.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-2 hover:text-champagne">
                  <Mail className="size-4 text-champagne" /> {site.contact.email}
                </a>
              </li>
            </ul>
            <ul className="mt-5 space-y-2 text-xs leading-relaxed text-ivory/60">
              {site.offices.map((o) => (
                <li key={o.city}>
                  <a href={o.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-champagne">
                    <span className="text-champagne/90">{o.city}</span> · {o.lines.join(', ')}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hairline mt-8 sm:mt-10" />
        <div className="flex flex-col gap-1 py-4 text-[0.68rem] leading-relaxed text-mist/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Images are artist’s impressions. Details as registered on{' '}
            <a href={site.maharera} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-champagne hover:underline">
              MahaRERA
            </a>
            .
          </p>
          <p>
            © {new Date().getFullYear()} Excellaa Realty · Proposal by {site.proposalBy}
          </p>
        </div>
      </div>
    </footer>
  );
}
