import 'server-only';
import { logAdapter } from './adapters/log';
import { createWebhookAdapter } from './adapters/webhook';
import type { CrmAdapter } from './types';

export type { CrmAdapter, CrmResult, Lead } from './types';

/** Resolves the CRM adapter from environment configuration (see .env.example). */
export function getCrmAdapter(): CrmAdapter {
  const provider = process.env.CRM_PROVIDER ?? 'log';
  if (provider === 'webhook') {
    const url = process.env.CRM_WEBHOOK_URL;
    if (!url) throw new Error('CRM_PROVIDER=webhook requires CRM_WEBHOOK_URL');
    return createWebhookAdapter(url, process.env.CRM_WEBHOOK_TOKEN || undefined);
  }
  return logAdapter;
}
