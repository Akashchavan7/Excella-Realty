import type { CrmAdapter } from '../types';

/**
 * Generic webhook adapter. POSTs the lead as JSON to CRM_WEBHOOK_URL with an optional
 * bearer token. Works with Zapier/Make hooks and most CRM inbound-lead endpoints.
 */
export function createWebhookAdapter(url: string, token?: string): CrmAdapter {
  return {
    name: 'webhook',
    async submitLead(lead) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            ...(token ? { authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ type: 'lead', source: 'excellaa-web', lead }),
          signal: controller.signal,
        });
        if (!res.ok) return { ok: false, error: `CRM responded ${res.status}` };
        const data = (await res.json().catch(() => ({}))) as { id?: string };
        return { ok: true, externalId: data.id };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : 'CRM request failed' };
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
