import { z } from 'zod';

/**
 * Shared zod schema for the partner inquiry form (VEY-170).
 *
 * Used by:
 *   - Client: `src/components/PartnerForm.astro` (validation before POST).
 *   - Server: `src/pages/api/partner-inquiry.ts` (authoritative validation
 *     before sending email).
 *
 * Croatian copy is the source of truth for user-facing field labels;
 * server-side error messages are also in Croatian so they can be surfaced
 * to the form when JSON errors come back.
 */
export const PARTNER_TYPES = [
  'Agencija',
  'Klinika',
  'Dom zdravlja',
  'Ostalo',
] as const;

export type PartnerType = (typeof PARTNER_TYPES)[number];

const trimmed = (max: number, label: string) =>
  z
    .string({ message: `${label} je obavezno polje.` })
    .trim()
    .min(1, `${label} je obavezno polje.`)
    .max(max, `${label} može imati najviše ${max} znakova.`);

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal('').transform(() => undefined));

export const PartnerInquirySchema = z.object({
  // Required fields
  ustanova: trimmed(200, 'Naziv ustanove'),
  tipUstanove: z.enum(PARTNER_TYPES, {
    message: 'Odaberite tip ustanove.',
  }),
  mjesto: trimmed(120, 'Mjesto'),
  kontaktOsoba: trimmed(120, 'Kontakt osoba'),
  email: z
    .string({ message: 'E-pošta je obavezno polje.' })
    .trim()
    .min(1, 'E-pošta je obavezno polje.')
    .max(200, 'E-pošta može imati najviše 200 znakova.')
    .email('Unesite ispravnu e-pošta adresu.'),
  // Optional
  telefon: optionalTrimmed(60),
  procjenaPacijenata: optionalTrimmed(40),
  poruka: z
    .string()
    .trim()
    .max(1000, 'Poruka može imati najviše 1000 znakova.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  // GDPR consent — must be true
  gdpr: z
    .union([z.literal(true), z.literal('on'), z.literal('true')], {
      message: 'Morate prihvatiti uvjete obrade podataka.',
    })
    .transform(() => true as const),
  // Honeypot — must be empty. Field name `website` is intentional bait
  // for naive form-fillers; humans never see it.
  website: z
    .string()
    .max(0, 'Spam zaštita: ostavite polje prazno.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export type PartnerInquiry = z.infer<typeof PartnerInquirySchema>;

/**
 * Flatten a ZodError into `{ fieldName: 'message' }` for the form UI.
 */
export function flattenIssues(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_form';
    if (!out[path]) out[path] = issue.message;
  }
  return out;
}
