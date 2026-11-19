'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { EnquiryForm } from '@/components/forms/enquiry-form';

/** "Apply now" button that opens the career application form in a dialog. */
export function EnquireCareers({ roles }: { roles: string[] }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="inline-flex h-12 items-center bg-navy-900 px-8 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory transition hover:bg-navy-800">
        Apply now
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-navy-950/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-[95] max-h-[92dvh] overflow-y-auto bg-navy-900 px-6 pb-10 pt-8 text-ivory shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(760px,94vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:px-12 sm:py-12">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="eyebrow text-champagne">Careers</p>
              <Dialog.Title className="display mt-3 text-4xl sm:text-5xl">Tell us about yourself</Dialog.Title>
              <Dialog.Description className="sr-only">Career application form</Dialog.Description>
            </div>
            <Dialog.Close className="grid size-11 shrink-0 place-items-center rounded-full border border-ivory/20 text-ivory/80 transition hover:border-champagne hover:text-champagne" aria-label="Close">
              <X className="size-5" />
            </Dialog.Close>
          </div>
          <div className="hairline my-8" />
          <EnquiryForm tone="dark" defaultIntent="careers" intents={['careers']} roles={roles} source="careers" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
