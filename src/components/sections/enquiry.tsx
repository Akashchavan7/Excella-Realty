import { MapPin, MessageCircle, Phone, PhoneCall } from 'lucide-react';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { MediaImage } from '@/components/ui/media-image';
import { Reveal } from '@/components/ui/reveal';
import { site, whatsappLink } from '@/lib/site';

export function Enquiry() {
  return (
    <section id="enquire" className="relative bg-ivory text-navy-900">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[300px] overflow-hidden text-ivory sm:min-h-[420px] lg:min-h-full">
          <MediaImage mediaKey="polaris/arrival-port" alt="Exclusive arrival port at Excellaa Polaris" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-navy-950/20" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12">
            <p className="eyebrow text-champagne">06 · Visit us</p>
            <h2 className="display mt-4 text-5xl sm:text-7xl">
              Come home to <em className="text-champagne">Excellaa.</em>
            </h2>
            <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-3">
              <a href={site.contact.salesPhone.href} className="flex items-center gap-3 border border-ivory/20 bg-navy-950/50 px-4 py-4 backdrop-blur-md transition hover:border-champagne">
                <Phone className="size-5 text-champagne" />
                <span>
                  <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-mist">Sales</span>
                  <span className="text-sm">{site.contact.salesPhone.display}</span>
                </span>
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 border border-ivory/20 bg-navy-950/50 px-4 py-4 backdrop-blur-md transition hover:border-champagne">
                <MessageCircle className="size-5 text-champagne" />
                <span>
                  <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-mist">WhatsApp</span>
                  <span className="text-sm">{site.contact.whatsapp.display}</span>
                </span>
              </a>
              <a href={site.contact.tollFree.href} className="flex items-center gap-3 border border-ivory/20 bg-navy-950/50 px-4 py-4 backdrop-blur-md transition hover:border-champagne">
                <PhoneCall className="size-5 text-champagne" />
                <span>
                  <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-mist">Toll-free</span>
                  <span className="text-sm">{site.contact.tollFree.display}</span>
                </span>
              </a>
            </div>
            <a href={site.offices[0].mapUrl} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-start gap-3 text-sm text-mist hover:text-champagne">
              <MapPin className="mt-0.5 size-4 shrink-0 text-champagne" /> {site.offices[0].label}: {site.offices[0].lines.join(', ')}
            </a>
          </div>
        </div>
        <Reveal className="px-5 py-12 sm:px-12 sm:py-24 xl:px-20">
          <p className="eyebrow text-gold-600">Enquire</p>
          <p className="display mt-4 text-4xl sm:text-5xl">Schedule a site visit or request details</p>
          <div className="hairline my-7 sm:my-10" />
          <EnquiryForm tone="light" source="home-enquiry" />
        </Reveal>
      </div>
    </section>
  );
}
