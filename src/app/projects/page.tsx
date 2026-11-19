import { ArrowRight, Map } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectFilterGrid } from '@/components/project/project-filter-grid';
import { MediaImage } from '@/components/ui/media-image';
import { projects } from '@/content/projects';

export const metadata: Metadata = {
  title: 'Projects — Ongoing, Upcoming & Completed',
  description:
    'Explore every Excellaa Realty project: The Autograph Collection in Bavdhan, Excellaa Virtu, Florence, Tremont and landmark completed addresses across Pune, Mumbai and Gujarat.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsPage() {
  const ordered = [...projects].sort((a, b) => Number(!!a.legacy) - Number(!!b.legacy));
  return (
    <>
      <section className="grain relative overflow-hidden bg-navy-950 pb-20 pt-40 text-ivory sm:pb-28 sm:pt-48">
        <div className="absolute inset-0 opacity-40">
          <MediaImage mediaKey="ganga-acropolis/towers" alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/60" />
        <div className="container-wide relative">
          <p className="eyebrow text-champagne">Portfolio · {projects.length} addresses</p>
          <h1 className="display mt-6 max-w-5xl text-[3.2rem] sm:text-8xl lg:text-[7.5rem]">
            Every project, <em className="text-champagne">one ethos.</em>
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-mist">
            Ongoing and upcoming homes, delivered landmarks, and the legacy projects of the Kalyanee Fortune Group across Pune, Mumbai and Gujarat.
          </p>
          <Link href="/#explore" className="mt-10 inline-flex items-center gap-3 border border-ivory/30 px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] transition hover:border-champagne hover:text-champagne">
            <Map className="size-4" /> Explore on the Pune map <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
      <section className="bg-ivory py-20 sm:py-28">
        <div className="container-wide">
          <ProjectFilterGrid projects={ordered} />
        </div>
      </section>
    </>
  );
}
