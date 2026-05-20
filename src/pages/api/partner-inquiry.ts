import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import {
  PartnerInquirySchema,
  flattenIssues,
  type PartnerInquiry,
} from '../../lib/partner-inquiry-schema';
import { rateLimit, clientKey } from '../../lib/rate-limit';

// On-demand SSR route — do NOT prerender.
export const prerender = false;

// Hard cap per IP per hour. Matches VEY-170 acceptance criteria.
const HOURLY_LIMIT = 3;

// Founder-configurable values (env-driven). Sensible fallbacks so the
// app boots in environments that haven't filled these in yet.
const NOTIFICATION_TO =
  import.meta.env.PARTNER_INQUIRY_TO ?? 'partneri@holterservice.eu';
const NOTIFICATION_FROM =
  import.meta.env.PARTNER_INQUIRY_FROM ??
  'Holterservice <upiti@holterservice.eu>';
const REPLY_TO_SUPPORT = 'partneri@holterservice.eu';
const CAL_LINK =
  import.meta.env.PUBLIC_CAL_LINK ?? 'https://cal.com/holterservice';

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildNotificationEmail(data: PartnerInquiry, meta: { ip: string }) {
  const rows: Array<[string, string | undefined]> = [
    ['Naziv ustanove', data.ustanova],
    ['Tip ustanove', data.tipUstanove],
    ['Mjesto', data.mjesto],
    ['Kontakt osoba', data.kontaktOsoba],
    ['E-pošta', data.email],
    ['Telefon', data.telefon],
    ['Procjena pacijenata / mj.', data.procjenaPacijenata],
    ['Poruka', data.poruka],
    ['IP (rate-limit ključ)', meta.ip],
  ];

  const text = rows
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const html = `
    <h2>Novi upit za partnerstvo</h2>
    <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.5;">
      ${rows
        .filter(([, v]) => v !== undefined && v !== '')
        .map(
          ([k, v]) => `
        <tr>
          <td style="vertical-align:top;color:#555;padding-right:16px;border-bottom:1px solid #eee;"><strong>${escapeHtml(k)}</strong></td>
          <td style="vertical-align:top;border-bottom:1px solid #eee;">${escapeHtml(String(v))}</td>
        </tr>`
        )
        .join('')}
    </table>
  `;

  return { text, html };
}

function buildAutoresponderEmail(data: PartnerInquiry) {
  const firstName = data.kontaktOsoba.split(/\s+/)[0] || data.kontaktOsoba;
  const safeName = escapeHtml(firstName);
  const safeCal = escapeHtml(CAL_LINK);

  const text = `Poštovani/a ${firstName},

Zaprimili smo vaš upit za partnerstvo s Holterservice. Javit ćemo vam se unutar 24 sata radnim danom radi dogovora kratkog razgovora.

Želite ubrzati proces? Rezervirajte 15-minutni razgovor odmah:
${CAL_LINK}

Srdačan pozdrav,
Tim Holterservice
prof. dr. sc. Ante Obad · Karlo Mrvić (PM)
Move Do d.o.o. · Put Žnjana 8E, 21000 Split · OIB: 71670543114
`;

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.55;color:#1a1a1a;max-width:560px;">
      <p>Poštovani/a ${safeName},</p>
      <p>Zaprimili smo vaš upit za partnerstvo s Holterservice. Javit ćemo vam se unutar 24 sata radnim danom radi dogovora kratkog razgovora.</p>
      <p>Želite ubrzati proces? Rezervirajte 15-minutni razgovor odmah:</p>
      <p>
        <a href="${safeCal}" style="display:inline-block;background:#1457a4;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;">Rezerviraj razgovor</a>
      </p>
      <p style="color:#555;font-size:13px;margin-top:32px;">
        Srdačan pozdrav,<br>
        <strong>Tim Holterservice</strong><br>
        prof. dr. sc. Ante Obad · Karlo Mrvić (PM)<br>
        Move Do d.o.o. · Put Žnjana 8E, 21000 Split · OIB: 71670543114
      </p>
    </div>
  `;

  return { text, html };
}

async function parseRequestBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return request.json();
  }
  // Accept form posts as a graceful fallback (e.g. JS-disabled clients).
  const form = await request.formData();
  const out: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    out[key] = typeof value === 'string' ? value : value.name;
  }
  return out;
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    // Fail loud so QA can spot misconfig instantly. Still returns JSON
    // so the form can render the error.
    console.error(
      '[partner-inquiry] RESEND_API_KEY missing — refusing to send.'
    );
    return jsonResponse(
      {
        ok: false,
        error:
          'Slanje upita trenutno nije moguće. Pošaljite e-mail na partneri@holterservice.eu ili pokušajte kasnije.',
        code: 'email_provider_not_configured',
      },
      503
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await parseRequestBody(request);
  } catch {
    return jsonResponse(
      { ok: false, error: 'Neispravan format zahtjeva.', code: 'bad_payload' },
      400
    );
  }

  const parsed = PartnerInquirySchema.safeParse(rawBody);
  if (!parsed.success) {
    // Silent 200 for honeypot — don't tip off bots that we caught them.
    const honeypotTripped = parsed.error.issues.some(
      (i) => i.path[0] === 'website'
    );
    if (honeypotTripped) {
      return jsonResponse({ ok: true, spam: true }, 200);
    }
    return jsonResponse(
      {
        ok: false,
        error: 'Provjerite obavezna polja.',
        code: 'validation_error',
        fieldErrors: flattenIssues(parsed.error),
      },
      400
    );
  }

  const data = parsed.data;
  const ip = clientKey(request);
  const limit = rateLimit(`partner-inquiry:${ip}`, HOURLY_LIMIT);
  if (!limit.ok) {
    const minutes = Math.max(
      1,
      Math.ceil((limit.resetAt - Date.now()) / 60000)
    );
    return jsonResponse(
      {
        ok: false,
        error: `Previše upita s ove IP adrese. Pokušajte ponovno za ~${minutes} min.`,
        code: 'rate_limited',
      },
      429
    );
  }

  const resend = new Resend(apiKey);
  const notification = buildNotificationEmail(data, { ip });
  const autoresponder = buildAutoresponderEmail(data);

  // Notification first — if this fails the user gets an error and we
  // never auto-respond falsely. Autoresponder failure is logged but
  // doesn't fail the request (the inquiry has reached us; the
  // autoresponder is a nicety).
  const notifyResult = await resend.emails.send({
    from: NOTIFICATION_FROM,
    to: [NOTIFICATION_TO],
    subject: `Novi upit za partnerstvo — ${data.ustanova} (${data.mjesto})`,
    text: notification.text,
    html: notification.html,
    replyTo: data.email,
  });

  if (notifyResult.error) {
    console.error('[partner-inquiry] notify failed', notifyResult.error);
    return jsonResponse(
      {
        ok: false,
        error:
          'Došlo je do greške pri slanju. Pokušajte ponovno ili nam pišite na partneri@holterservice.eu.',
        code: 'email_send_failed',
      },
      502
    );
  }

  const autoResult = await resend.emails.send({
    from: NOTIFICATION_FROM,
    to: [data.email],
    subject: 'Vaš upit primljen — Holterservice',
    text: autoresponder.text,
    html: autoresponder.html,
    replyTo: REPLY_TO_SUPPORT,
  });

  if (autoResult.error) {
    console.warn(
      '[partner-inquiry] autoresponder failed (non-fatal)',
      autoResult.error
    );
  }

  return jsonResponse(
    {
      ok: true,
      redirect: '/za-partnere/hvala',
    },
    200
  );
};

// Reject anything other than POST with a clear status.
export const ALL: APIRoute = () =>
  jsonResponse(
    { ok: false, error: 'Metoda nije dopuštena.', code: 'method_not_allowed' },
    405
  );
