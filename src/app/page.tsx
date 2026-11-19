import { About } from '@/components/sections/about';
import { AutographCollection } from '@/components/sections/autograph-collection';
import { Enquiry } from '@/components/sections/enquiry';
import { ExplorePune } from '@/components/sections/explore-pune';
import { FeaturedProjects } from '@/components/sections/featured-projects';
import { Hero } from '@/components/sections/hero';
import { Testimonials } from '@/components/sections/testimonials';

// The homepage stays deliberately short. About detail, awards, media, NRI Corner and
// careers live on their own pages, reached from the navigation.
export default function HomePage() {
  return (
    <>
      <Hero />
      <About more />
      <FeaturedProjects />
      <ExplorePune />
      <AutographCollection />
      <Testimonials />
      <Enquiry />
    </>
  );
}
