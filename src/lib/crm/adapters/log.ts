import type { CrmAdapter } from '../types';

/** Development adapter: writes leads to the server log. */
export const logAdapter: CrmAdapter = {
  name: 'log',
  async submitLead(lead) {
    console.info('[crm:log] lead received', {
      id: lead.id,
      intent: lead.intent,
      project: lead.project,
      receivedAt: lead.receivedAt,
    });
    return { ok: true, externalId: lead.id };
  },
};
