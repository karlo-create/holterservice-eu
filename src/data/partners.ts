/**
 * Partner registry.
 *
 * Populating this array automatically:
 *   - renders cards + map pins on /partneri
 *   - emits LocalBusiness JSON-LD per partner on that page
 *
 * Keep the schema below stable so server-rendered JSON-LD stays valid as
 * partners are added. See PLACEHOLDERS.md.
 */

export type PartnerType = 'agencija' | 'klinika' | 'dom-zdravlja';

export const PARTNER_TYPE_LABEL: Record<PartnerType, string> = {
  agencija: 'Agencija',
  klinika: 'Klinika',
  'dom-zdravlja': 'Dom zdravlja',
};

export interface Partner {
  /** Unique slug (used for anchors). */
  slug: string;
  /** Klinika / ustanova / agencija naziv. */
  name: string;
  /** Mjesto (e.g. "Zagreb"). */
  city: string;
  /** Regija / županija (e.g. "Grad Zagreb", "Splitsko-dalmatinska"). */
  region: string;
  /** Tip partnera. */
  type: PartnerType;
  /** Puna adresa. */
  address?: string;
  /** Telefon u HR formatu. */
  phone?: string;
  /** E-pošta za naručivanje. */
  email?: string;
  /** Web partnerske klinike. */
  website?: string;
  /** Geo coordinates for map plotting. */
  coordinates: { lat: number; lng: number };
  /** Short 1–2 sentence description. */
  description?: string;
}

export const partners: Partner[] = [
  // PLACEHOLDER: real partner list. Founder/dr. Obad supplies:
  // name, address, phone, email, website, description + consent.
  // Three partners expected: Virovitica, Hvar, Zagreb.
  //
  // Example:
  // {
  //   slug: 'virovitica-partner',
  //   name: 'Naziv klinike',
  //   city: 'Virovitica',
  //   region: 'Virovitičko-podravska',
  //   type: 'klinika',
  //   address: 'Ulica 1, 33000 Virovitica',
  //   phone: '+385 33 000 000',
  //   email: 'info@example.hr',
  //   website: 'https://example.hr',
  //   coordinates: { lat: 45.8311, lng: 17.3833 },
  //   description: 'Kratak opis partnera u 1–2 rečenice.',
  // },
];

/**
 * Known partner cities for SEO meta (long-tail) and map preview.
 * Coordinates are public/known geographic data — safe to ship without consent.
 */
export const PARTNER_CITIES: ReadonlyArray<{
  city: string;
  region: string;
  coordinates: { lat: number; lng: number };
}> = [
  { city: 'Zagreb', region: 'Grad Zagreb', coordinates: { lat: 45.8150, lng: 15.9819 } },
  { city: 'Virovitica', region: 'Virovitičko-podravska', coordinates: { lat: 45.8311, lng: 17.3833 } },
  { city: 'Hvar', region: 'Splitsko-dalmatinska', coordinates: { lat: 43.1729, lng: 16.4413 } },
];
