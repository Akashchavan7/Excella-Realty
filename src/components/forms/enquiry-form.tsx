'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check, Loader2, MessageCircle, Phone } from 'lucide-react';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { projects } from '@/content/projects';
import { site, whatsappLink } from '@/lib/site';
import { cn } from '@/lib/utils';
import {
  enquirySchema,
  intentLabels,
  preferredTimes,
  type Enquiry,
  type EnquiryInput,
  type EnquiryIntent,
} from '@/lib/validation/enquiry';

const enquirableProjects = projects.filter((p) => !p.legacy && p.status !== 'completed');

interface Props {
  tone?: 'light' | 'dark';
  defaultIntent?: EnquiryIntent;
  intents?: EnquiryIntent[];
  project?: string;
  lockProject?: boolean;
  source: string;
  className?: string;
  roles?: string[];
}

export function EnquiryForm({
  tone = 'light',
  defaultIntent = 'site-visit',
  intents = ['site-visit', 'pricing', 'brochure', 'general'],
  project,
  lockProject,
  source,
  className,
  roles,
}: Props) {
  const uid = useId();
  const dark = tone === 'dark';
  const [state, setState] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput, unknown, Enquiry>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      intent: defaultIntent,
      project: project ?? '',
      name: '',
      phone: '',
      email: '',
      message: '',
      company: '',
      source,
    },
    mode: 'onTouched',
  });

  const intent = watch('intent');
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(values: Enquiry) {
    setServerError(null);
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; fields?: Record<string, string[]> };
      if (!res.ok || !data.ok) {
        if (data.fields) {
          for (const [field, messages] of Object.entries(data.fields)) {
            setError(field as keyof EnquiryInput, { message: messages[0] });
          }
        }
        setServerError(data.error ?? 'Something went wrong. Please try again.');
        setState('error');
        return;
      }
      setState('success');
    } catch {
      setServerError('Network error. Please call or WhatsApp us instead.');
      setState('error');
    }
  }

  const label = cn('eyebrow mb-2 block text-[0.62rem]', dark ? 'text-champagne/80' : 'text-stone');
  const input = cn(
    'w-full border-0 border-b bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:opacity-50 focus:ring-0',
    dark
      ? 'border-ivory/20 text-ivory placeholder:text-mist focus:border-champagne [color-scheme:dark]'
      : 'border-navy-900/20 text-ink placeholder:text-stone focus:border-navy-900',
  );
  const errorText = 'mt-2 text-xs text-[#e9765b]';

  if (state === 'success') {
    const selected = watch('project');
    return (
      <div className={cn('flex flex-col items-start gap-6', className)} role="status" aria-live="polite">
        <span className="grid size-14 place-items-center rounded-full bg-gold-500 text-navy-950">
          <Check className="size-6" />
        </span>
        <div>
          <h3 className={cn('display text-4xl', dark ? 'text-ivory' : 'text-navy-900')}>Thank you.</h3>
          <p className={cn('mt-3 max-w-md leading-relaxed', dark ? 'text-mist' : 'text-ink/70')}>
            Your enquiry has been received. An Excellaa property advisor will reach out shortly
            {intent === 'site-visit' ? ' to confirm your site visit.' : '.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="gold" size="sm">
            <a
              href={whatsappLink(`Hi, I just submitted an enquiry${selected ? ` for ${selected}` : ''} on the Excellaa website.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle /> Continue on WhatsApp
            </a>
          </Button>
          <Button
            variant={dark ? 'outlineLight' : 'outlineDark'}
            size="sm"
            onClick={() => {
              reset();
              setState('idle');
            }}
          >
            New enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn('space-y-7', className)} aria-describedby={`${uid}-status`}>
      {intents.length > 1 && (
        <fieldset>
          <legend className={label}>I would like to</legend>
          <div className="flex flex-wrap gap-2">
            {intents.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setValue('intent', i, { shouldValidate: false })}
                aria-pressed={intent === i}
                className={cn(
                  'rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300',
                  intent === i
                    ? 'border-gold-500 bg-gold-500 text-navy-950'
                    : dark
                      ? 'border-ivory/20 text-ivory/80 hover:border-champagne hover:text-champagne'
                      : 'border-navy-900/15 text-ink/75 hover:border-navy-900',
                )}
              >
                {intentLabels[i]}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <input type="hidden" {...register('intent')} />
      <input type="hidden" {...register('source')} />

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className={label}>
            Full name *
          </label>
          <input id={`${uid}-name`} autoComplete="name" className={input} placeholder="Your name" {...register('name')} aria-invalid={!!errors.name} />
          {errors.name && <p className={errorText}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className={label}>
            Phone *
          </label>
          <input
            id={`${uid}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={input}
            placeholder="+91 98xxx xxxxx"
            {...register('phone')}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <p className={errorText}>{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className={label}>
            Email
          </label>
          <input id={`${uid}-email`} type="email" autoComplete="email" className={input} placeholder="you@example.com" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p className={errorText}>{errors.email.message}</p>}
        </div>

        {intent === 'careers' ? (
          <div>
            <label htmlFor={`${uid}-role`} className={label}>
              Position
            </label>
            <select id={`${uid}-role`} className={cn(input, 'cursor-pointer')} {...register('role')}>
              <option value="">Select a position</option>
              {(roles ?? []).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
              <option value="Other">Other / open application</option>
            </select>
          </div>
        ) : (
          <div>
            <label htmlFor={`${uid}-project`} className={label}>
              Project
            </label>
            {lockProject ? (
              <>
                <p id={`${uid}-project`} className={cn(input, 'opacity-90')}>
                  {project}
                </p>
                <input type="hidden" {...register('project')} />
              </>
            ) : (
              <select id={`${uid}-project`} className={cn(input, 'cursor-pointer')} {...register('project')}>
                <option value="">Any / help me choose</option>
                {enquirableProjects.map((p) => (
                  <option key={p.slug} value={p.name}>
                    {p.name} — {p.locality}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {intent === 'site-visit' && (
          <>
            <div>
              <label htmlFor={`${uid}-date`} className={label}>
                Preferred date *
              </label>
              <input id={`${uid}-date`} type="date" min={today} className={input} {...register('preferredDate')} aria-invalid={!!errors.preferredDate} />
              {errors.preferredDate && <p className={errorText}>{errors.preferredDate.message}</p>}
            </div>
            <div>
              <label htmlFor={`${uid}-time`} className={label}>
                Preferred time
              </label>
              <select id={`${uid}-time`} className={cn(input, 'cursor-pointer')} {...register('preferredTime')}>
                <option value="">Any time</option>
                {preferredTimes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {intent === 'nri' && (
          <div className="sm:col-span-2">
            <label htmlFor={`${uid}-country`} className={label}>
              Country of residence *
            </label>
            <input id={`${uid}-country`} autoComplete="country-name" className={input} placeholder="e.g. United Arab Emirates" {...register('country')} aria-invalid={!!errors.country} />
            {errors.country && <p className={errorText}>{errors.country.message}</p>}
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-message`} className={label}>
            Message
          </label>
          <textarea
            id={`${uid}-message`}
            rows={2}
            className={cn(input, 'resize-none')}
            placeholder={intent === 'careers' ? 'Experience, current role, notice period' : 'Configuration, budget or anything you’d like us to know'}
            {...register('message')}
          />
          {errors.message && <p className={errorText}>{errors.message.message}</p>}
        </div>
      </div>

      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input id={`${uid}-company`} tabIndex={-1} autoComplete="off" {...register('company')} />
      </div>

      <div>
        <label className={cn('flex cursor-pointer items-start gap-3 text-sm leading-relaxed', dark ? 'text-mist' : 'text-ink/70')}>
          <input type="checkbox" className="mt-1 size-4 shrink-0 cursor-pointer accent-[#eaa100]" {...register('consent')} />
          <span>I agree to be contacted by Excellaa Realty by phone, WhatsApp or email about this enquiry. This overrides DND/NDNC registration.</span>
        </label>
        {errors.consent && <p className={errorText}>{errors.consent.message}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <Button type="submit" variant="gold" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          {isSubmitting ? 'Sending' : intentLabels[intent as EnquiryIntent] ?? 'Submit'}
          {!isSubmitting && <ArrowRight className="transition-transform duration-500 group-hover/btn:translate-x-1" />}
        </Button>
        <a href={site.contact.salesPhone.href} className={cn('inline-flex items-center gap-2 text-sm', dark ? 'text-mist hover:text-champagne' : 'text-ink/70 hover:text-navy-900')}>
          <Phone className="size-4" /> or call {site.contact.salesPhone.display}
        </a>
      </div>
      <p id={`${uid}-status`} role="alert" className={cn('text-sm', serverError ? 'text-[#e9765b]' : 'sr-only')}>
        {serverError ?? ''}
      </p>
    </form>
  );
}
