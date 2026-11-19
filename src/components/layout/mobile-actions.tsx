'use client';

import { CalendarCheck, MessageCircle, Phone } from 'lucide-react';
import { useEnquiry } from '@/components/forms/enquiry-dialog';
import { site, whatsappLink } from '@/lib/site';

/** Persistent call / WhatsApp / enquire bar on small screens. */
export function MobileActions() {
  const { open } = useEnquiry();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-champagne/20 bg-navy-950/95 pb-[env(safe-area-inset-bottom)] text-ivory backdrop-blur-xl sm:hidden">
      <a href={site.contact.salesPhone.href} className="flex h-14 flex-col items-center justify-center gap-1 text-[0.65rem] tracking-wide">
        <Phone className="size-4 text-champagne" /> Call
      </a>
      <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex h-14 flex-col items-center justify-center gap-1 border-x border-ivory/10 text-[0.65rem] tracking-wide">
        <MessageCircle className="size-4 text-champagne" /> WhatsApp
      </a>
      <button type="button" onClick={() => open({ intent: 'site-visit' })} className="flex h-14 flex-col items-center justify-center gap-1 bg-gold-500 text-[0.65rem] font-semibold tracking-wide text-navy-950">
        <CalendarCheck className="size-4" /> Site visit
      </button>
    </div>
  );
}
