import { createHash, randomUUID } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { getCrmAdapter, type Lead } from '@/lib/crm';
import { enquirySchema } from '@/lib/validation/enquiry';

export const runtime = 'nodejs';

// Basic per-instance rate limit (5 submissions / 10 minutes / IP). Replace with a shared
// store (Redis, Upstash, the CRM's own throttling) when deployed across several instances.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > LIMIT;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'unknown';
  const ipHash = createHash('sha256').update(ip).digest('hex').slice(0, 16);

  if (rateLimited(ipHash)) {
    return NextResponse.json({ ok: false, error: 'Too many requests. Please call us or try again shortly.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Please check the highlighted fields', fields: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // Honeypot: pretend success so bots learn nothing.
  if (parsed.data.company) return NextResponse.json({ ok: true, id: randomUUID() });

  const { company: _honeypot, ...data } = parsed.data;
  void _honeypot;
  const lead: Lead = {
    ...data,
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    meta: {
      userAgent: req.headers.get('user-agent') ?? undefined,
      referrer: req.headers.get('referer') ?? undefined,
      ipHash,
    },
  };

  const result = await getCrmAdapter().submitLead(lead);
  if (!result.ok) {
    console.error('[crm] lead submission failed', { id: lead.id, error: result.error });
    return NextResponse.json(
      { ok: false, error: 'We could not record your enquiry right now. Please call or WhatsApp us.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id: lead.id });
}
