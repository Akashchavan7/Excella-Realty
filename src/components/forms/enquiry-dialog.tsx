'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { EnquiryIntent } from '@/lib/validation/enquiry';
import { EnquiryForm } from './enquiry-form';

interface OpenOptions {
  intent?: EnquiryIntent;
  project?: string;
  title?: string;
}

const EnquiryContext = createContext<{ open: (o?: OpenOptions) => void } | null>(null);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<OpenOptions | null>(null);
  const open = useCallback((o: OpenOptions = {}) => setOpts(o), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <Dialog.Root open={!!opts} onOpenChange={(v) => !v && setOpts(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-navy-950/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-x-0 bottom-0 z-[95] max-h-[92dvh] overflow-y-auto bg-navy-900 px-6 pb-10 pt-8 text-ivory shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(760px,94vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:px-12 sm:py-12">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="eyebrow text-champagne">{opts?.project ?? 'Excellaa Realty'}</p>
                <Dialog.Title className="display mt-3 text-4xl sm:text-5xl">{opts?.title ?? 'Begin your enquiry'}</Dialog.Title>
                <Dialog.Description className="mt-3 text-sm text-mist">
                  Share a few details and an Excellaa property advisor will get in touch.
                </Dialog.Description>
              </div>
              <Dialog.Close className="grid size-11 shrink-0 place-items-center rounded-full border border-ivory/20 text-ivory/80 transition hover:border-champagne hover:text-champagne" aria-label="Close">
                <X className="size-5" />
              </Dialog.Close>
            </div>
            <div className="hairline my-8" />
            {opts && (
              <EnquiryForm
                tone="dark"
                defaultIntent={opts.intent ?? 'site-visit'}
                intents={opts.intent === 'nri' ? ['nri', 'site-visit', 'pricing'] : ['site-visit', 'pricing', 'brochure', 'general']}
                project={opts.project}
                source="dialog"
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error('useEnquiry must be used within EnquiryProvider');
  return ctx;
}

/** Client trigger that opens the enquiry dialog from server-rendered sections. */
export function EnquireTrigger({
  children,
  className,
  intent,
  project,
  title,
}: OpenOptions & { children: React.ReactNode; className?: string }) {
  const { open } = useEnquiry();
  return (
    <button type="button" className={className} onClick={() => open({ intent, project, title })}>
      {children}
    </button>
  );
}
