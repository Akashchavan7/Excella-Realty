import { PuneExplorer } from '@/components/map/pune-explorer';
import { SectionHeading } from '@/components/ui/section-heading';

export function ExplorePune() {
  return (
    <section id="explore" className="relative bg-sand/60 py-20 sm:py-36">
      <div className="container-wide relative">
        <SectionHeading
          index="03"
          eyebrow="Explore Pune"
          title={
            <>
              A city, mapped by <em className="text-gold-600">our addresses.</em>
            </>
          }
        />
        <div className="mt-8 sm:mt-14">
          <PuneExplorer />
        </div>
      </div>
    </section>
  );
}
