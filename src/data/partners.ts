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

/**
 * DEMO DATA — placeholders for Vercel preview shown to dr. Obad.
 * Real partner data (names, addresses, contacts) will replace these entries
 * once consent and details are confirmed. Coordinates are real geographic
 * data for the three target cities (Virovitica, Hvar, Zagreb) and can stay.
 */
export const partners: Partner[] = [
  {
    slug: 'demo-virovitica',
    name: 'Poliklinika Primjer Virovitica',
    city: 'Virovitica',
    region: 'Virovitičko-podravska',
    type: 'klinika',
    address: 'Trg kralja Tomislava 1, 33000 Virovitica',
    phone: '+385 33 123 4567',
    email: 'info@partner-example.hr',
    website: 'https://example.hr',
    coordinates: { lat: 45.8311, lng: 17.3833 },
    description:
      'Partner u programu Holter monitoringa za regiju Virovitičko-podravska. (Demo prikaz — konačni partner bit će potvrđen.)',
  },
  {
    slug: 'demo-hvar',
    name: 'Ordinacija Primjer Hvar',
    city: 'Hvar',
    region: 'Splitsko-dalmatinska',
    type: 'dom-zdravlja',
    address: 'Riva 5, 21450 Hvar',
    phone: '+385 21 234 5678',
    email: 'info@partner-example.hr',
    website: 'https://example.hr',
    coordinates: { lat: 43.1729, lng: 16.4413 },
    description:
      'Partner u programu Holter monitoringa za područje otoka Hvara i okolice. (Demo prikaz — konačni partner bit će potvrđen.)',
  },
  {
    slug: 'demo-zagreb',
    name: 'Agencija Primjer Zagreb',
    city: 'Zagreb',
    region: 'Grad Zagreb',
    type: 'agencija',
    address: 'Ilica 100, 10000 Zagreb',
    phone: '+385 1 234 5678',
    email: 'info@partner-example.hr',
    website: 'https://example.hr',
    coordinates: { lat: 45.8150, lng: 15.9819 },
    description:
      'Partner u programu Holter monitoringa za područje grada Zagreba. (Demo prikaz — konačni partner bit će potvrđen.)',
  },
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
