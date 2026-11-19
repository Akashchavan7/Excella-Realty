import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ProjectArc } from '@/components/project/project-arc';
import { SectionHeading } from '@/components/ui/section-heading';
import { projects } from '@/content/projects';

export function FeaturedProjects() {
  const showcase = projects.filter((p) => !p.legacy);
  return (
    <section id="projects" className="bg-ivory pb-16 sm:pb-32">
      <div className="container-wide">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            index="02"
            eyebrow="Featured Projects"
            title={
              <>
                Addresses that <em className="text-gold-600">define</em> a city.
              </>
            }
          />
          <Link href="/projects" className="group inline-flex shrink-0 items-center gap-3 text-sm font-medium text-navy-900">
            <span className="link-underline">View all {projects.length} projects</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      <div className="mt-10">
        <ProjectArc projects={showcase} />
      </div>
    </section>
  );
}
