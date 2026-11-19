'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ChevronDown, Menu, MessageCircle, Phone, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useEnquiry } from '@/components/forms/enquiry-dialog';
import { MediaImage } from '@/components/ui/media-image';
import { projects } from '@/content/projects';
import { site, whatsappLink } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { primaryNav } from './nav';

const ongoing = projects.filter((p) => p.status === 'ongoing');
const upcoming = projects.filter((p) => p.status === 'upcoming');
const completed = projects.filter((p) => p.status === 'completed' && !p.legacy);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const { open } = useEnquiry();

  useEffect(() => {
    const onScroll = () => {
      // Stay transparent over the pinned home hero; solid everywhere else once scrolled.
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      const limit = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight - 10 : 40;
      setScrolled(window.scrollY > Math.max(40, limit));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus when the route changes (state-from-props pattern, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMegaOpen(false);
    setMobileOpen(false);
  }

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };

  const solid = scrolled || megaOpen;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[var(--ease-lux)]',
        solid ? 'bg-navy-950/92 shadow-[0_1px_0_rgba(214,182,121,0.15)] backdrop-blur-xl' : 'bg-gradient-to-b from-navy-950/70 to-transparent',
      )}
      onMouseLeave={closeMega}
    >
      <div className={cn('container-wide flex items-center justify-between gap-8 transition-all duration-700', solid ? 'h-[4.5rem]' : 'h-[5.5rem]')}>
        <Logo reversed className={cn('transition-all duration-700', solid ? 'h-9' : 'h-11')} />

        <nav aria-label="Primary" className="hidden items-center gap-1 xl:flex">
          {primaryNav.map((item) =>
            'mega' in item && item.mega ? (
              <div key={item.label} onMouseEnter={openMega}>
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-4 py-3 text-[0.8rem] font-medium tracking-wide text-ivory/85 transition hover:text-champagne"
                  aria-expanded={megaOpen}
                  aria-controls="mega-projects"
                  onClick={() => setMegaOpen((v) => !v)}
                  onFocus={openMega}
                >
                  {item.label}
                  <ChevronDown className={cn('size-3.5 transition-transform duration-500', megaOpen && 'rotate-180')} />
                </button>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={closeMega}
                className="px-4 py-3 text-[0.8rem] font-medium tracking-wide text-ivory/85 transition hover:text-champagne"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={site.contact.salesPhone.href}
            className="hidden items-center gap-2 px-3 text-[0.8rem] text-ivory/80 transition hover:text-champagne lg:flex"
          >
            <Phone className="size-4" /> {site.contact.salesPhone.display}
          </a>
          <button
            type="button"
            onClick={() => open({ intent: 'site-visit' })}
            className="hidden h-11 items-center bg-gold-500 px-6 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-navy-950 transition hover:bg-gold-400 sm:flex"
          >
            Book a site visit
          </button>
          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button type="button" className="grid size-11 place-items-center rounded-full border border-ivory/25 text-ivory xl:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </button>
            </Dialog.Trigger>
            <MobileMenu onEnquire={() => { setMobileOpen(false); open({ intent: 'site-visit' }); }} />
          </Dialog.Root>
        </div>
      </div>

      <AnimatePresence>
        {megaOpen && (
          <motion.div
            id="mega-projects"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
            className="absolute inset-x-0 top-full hidden border-t border-champagne/15 bg-navy-950/97 backdrop-blur-xl xl:block"
          >
            <div className="container-wide grid grid-cols-12 gap-10 py-12">
              <MegaColumn title="Ongoing" items={ongoing} className="col-span-3" />
              <MegaColumn title="Upcoming" items={upcoming} className="col-span-2" />
              <MegaColumn title="Completed" items={completed} className="col-span-3" />
              <Link href="/projects/excellaa-polaris" className="group col-span-4 block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <MediaImage mediaKey="polaris/infinity-pool" alt="Excellaa Polaris rooftop infinity pool" fill sizes="30vw" className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-lux)] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent" />
                  <div className="absolute inset-x-6 bottom-6">
                    <p className="eyebrow text-champagne">The Autograph Collection · Bavdhan</p>
                    <p className="display mt-2 text-4xl text-ivory">Excellaa Polaris</p>
                  </div>
                </div>
              </Link>
              <div className="col-span-12 flex items-center justify-between border-t border-ivory/10 pt-6">
                <p className="text-sm text-mist">Redevelopment and land development enquiries are welcome.</p>
                <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-champagne link-underline">
                  View all projects <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MegaColumn({ title, items, className }: { title: string; items: typeof projects; className?: string }) {
  return (
    <div className={className}>
      <p className="eyebrow text-champagne/80">{title}</p>
      <ul className="mt-5 space-y-3">
        {items.map((p) => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}`} className="group flex items-baseline justify-between gap-4">
              <span className="display text-2xl text-ivory transition group-hover:text-champagne">{p.name}</span>
              <span className="shrink-0 text-xs text-mist">{p.locality.split(',')[0]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileMenu({ onEnquire }: { onEnquire: () => void }) {
  const [projectsOpen, setProjectsOpen] = useState(false);
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[60] bg-navy-950/60" />
      <Dialog.Content className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-navy-950 text-ivory">
        <Dialog.Title className="sr-only">Menu</Dialog.Title>
        <Dialog.Description className="sr-only">Site navigation</Dialog.Description>
        <div className="container-wide flex h-[72px] items-center justify-between">
          <Logo reversed className="h-9" />
          <Dialog.Close className="grid size-11 place-items-center rounded-full border border-ivory/25" aria-label="Close menu">
            <X className="size-5" />
          </Dialog.Close>
        </div>
        <nav aria-label="Mobile" className="container-wide flex-1 py-8">
          <ul className="divide-y divide-ivory/10">
            {primaryNav.map((item) =>
              'mega' in item && item.mega ? (
                <li key={item.label} className="py-4">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between display text-4xl"
                    aria-expanded={projectsOpen}
                    onClick={() => setProjectsOpen((v) => !v)}
                  >
                    Projects <ChevronDown className={cn('size-6 text-champagne transition-transform', projectsOpen && 'rotate-180')} />
                  </button>
                  {projectsOpen && (
                    <div className="mt-5 grid gap-6 sm:grid-cols-3">
                      {[
                        { t: 'Ongoing', items: ongoing },
                        { t: 'Upcoming', items: upcoming },
                        { t: 'Completed', items: completed },
                      ].map((g) => (
                        <div key={g.t}>
                          <p className="eyebrow text-champagne/80">{g.t}</p>
                          <ul className="mt-3 space-y-2">
                            {g.items.map((p) => (
                              <li key={p.slug}>
                                <Dialog.Close asChild>
                                  <Link href={`/projects/${p.slug}`} className="text-lg text-ivory/90">
                                    {p.name} <span className="text-sm text-mist">· {p.locality.split(',')[0]}</span>
                                  </Link>
                                </Dialog.Close>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Dialog.Close asChild>
                        <Link href="/projects" className="text-champagne">
                          All projects →
                        </Link>
                      </Dialog.Close>
                    </div>
                  )}
                </li>
              ) : (
                <li key={item.label} className="py-4">
                  <Dialog.Close asChild>
                    <Link href={item.href} className="display block text-4xl">
                      {item.label}
                    </Link>
                  </Dialog.Close>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="container-wide grid grid-cols-2 gap-3 pb-10">
          <a href={site.contact.salesPhone.href} className="flex h-12 items-center justify-center gap-2 border border-ivory/20 text-sm">
            <Phone className="size-4" /> Call
          </a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-2 border border-ivory/20 text-sm">
            <MessageCircle className="size-4" /> WhatsApp
          </a>
          <button type="button" onClick={onEnquire} className="col-span-2 h-12 bg-gold-500 text-xs font-semibold uppercase tracking-[0.22em] text-navy-950">
            Book a site visit
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
