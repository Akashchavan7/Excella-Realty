import type { Enquiry } from '@/lib/validation/enquiry';

/** A validated lead as handed to any CRM adapter. */
export interface Lead extends Omit<Enquiry, 'company' | 'consent'> {
  id: string;
  receivedAt: string;
  consent: true;
  meta: {
    userAgent?: string;
    referrer?: string;
    ipHash?: string;
  };
}

export interface CrmResult {
  ok: boolean;
  /** Identifier returned by the CRM, if any. */
  externalId?: string;
  error?: string;
}

/**
 * The integration boundary. Implement this interface for Salesforce, LeadSquared,
 * Zoho, HubSpot or an in-house CRM, then register it in `src/lib/crm/index.ts`.
 */
export interface CrmAdapter {
  readonly name: string;
  submitLead(lead: Lead): Promise<CrmResult>;
}
