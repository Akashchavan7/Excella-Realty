import { z } from 'zod';

export const enquiryIntents = ['site-visit', 'pricing', 'brochure', 'nri', 'careers', 'general'] as const;
export type EnquiryIntent = (typeof enquiryIntents)[number];

export const intentLabels: Record<EnquiryIntent, string> = {
  'site-visit': 'Schedule a site visit',
  pricing: 'Request pricing',
  brochure: 'Request brochure',
  nri: 'NRI enquiry',
  careers: 'Career application',
  general: 'General enquiry',
};

export const preferredTimes = ['Morning (9 am – 12 pm)', 'Afternoon (12 – 4 pm)', 'Evening (4 – 8 pm)'] as const;

/** Shared by the client form (react-hook-form) and the API route. */
export const enquirySchema = z
  .object({
    name: z.string().trim().min(2, 'Please enter your full name').max(80, 'Name is too long'),
    phone: z
      .string()
      .trim()
      .transform((v) => v.replace(/[\s()-]/g, ''))
      .pipe(z.string().regex(/^\+?\d{10,15}$/, 'Enter a valid phone number with country code if outside India')),
    email: z
      .union([z.literal(''), z.string().trim().email('Enter a valid email address')])
      .optional()
      .transform((v) => v || undefined),
    intent: z.enum(enquiryIntents),
    project: z.string().trim().max(80).optional().transform((v) => v || undefined),
    country: z.string().trim().max(60).optional().transform((v) => v || undefined),
    preferredDate: z.string().trim().max(20).optional().transform((v) => v || undefined),
    preferredTime: z.string().trim().max(40).optional().transform((v) => v || undefined),
    role: z.string().trim().max(80).optional().transform((v) => v || undefined),
    message: z.string().trim().max(1000, 'Message is too long').optional().transform((v) => v || undefined),
    consent: z.literal(true, { error: 'Please accept to be contacted about your enquiry' }),
    /** Honeypot. Real users never see or fill this field. */
    company: z.string().max(0).optional(),
    source: z.string().max(120).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.intent === 'site-visit' && !v.preferredDate) {
      ctx.addIssue({ code: 'custom', path: ['preferredDate'], message: 'Choose a preferred visit date' });
    }
    if (v.intent === 'nri' && !v.country) {
      ctx.addIssue({ code: 'custom', path: ['country'], message: 'Tell us your country of residence' });
    }
  });

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;
