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

/**
 * Catalogue of usluga keys a partner can offer.
 *
 * Stays in sync with the four services described on `/usluga`:
 *   - holter-ekg          → primary diagnostic service
 *   - holter-kmat         → 24h ABPM blood-pressure monitoring
 *   - video-konzultacija  → online follow-up s kardiologom
 *   - drugo-misljenje     → independent second-opinion analysis
 *
 * Order matters for the partner-card badge row (left → right).
 */
export type ServiceKey =
  | 'holter-ekg'
  | 'holter-kmat'
  | 'video-konzultacija'
  | 'drugo-misljenje';

export const SERVICE_LABEL: Record<ServiceKey, string> = {
  'holter-ekg': 'Holter EKG',
  'holter-kmat': 'Holter KMAT',
  'video-konzultacija': 'Video konzultacija',
  'drugo-misljenje': 'Drugo mišljenje',
};

/** Short form used in compact UIs (e.g. map popup). */
export const SERVICE_SHORT_LABEL: Record<ServiceKey, string> = {
  'holter-ekg': 'Holter EKG',
  'holter-kmat': 'Holter KMAT',
  'video-konzultacija': 'Video konzultacija',
  'drugo-misljenje': 'Drugo mišljenje',
};

export const SERVICE_ORDER: ReadonlyArray<ServiceKey> = [
  'holter-ekg',
  'holter-kmat',
  'video-konzultacija',
  'drugo-misljenje',
];

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
  /** Short 1 to 2 sentence description. */
  description?: string;
  /** Usluge koje partner nudi. */
  services: ServiceKey[];
}

/**
 * DEMO DATA: placeholders for Vercel preview shown to the client.
 * Real partner data (names, addresses, contacts) will replace these entries
 * once consent and details are confirmed. Coordinates are real geographic
 * data for the three target cities (Virovitica, Brač, Zagreb) and can stay.
 *
 * Service distribution: all partners list `video-konzultacija` and
 * `drugo-misljenje` because Poliklinika provides those services directly —
 * they are platform-level and always available, not partner-specific. Holter
 * modalities (EKG / KMAT) reflect what each individual partner offers on site.
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
      'Partner u programu Holter monitoringa za regiju Virovitičko-podravska. (Demo prikaz, konačni partner bit će potvrđen.)',
    services: ['holter-ekg', 'holter-kmat', 'video-konzultacija', 'drugo-misljenje'],
  },
  {
    slug: 'demo-brac',
    name: 'Ordinacija Primjer Brač',
    city: 'Brač',
    region: 'Splitsko-dalmatinska',
    type: 'dom-zdravlja',
    address: 'Riva 5, 21400 Supetar',
    phone: '+385 21 234 5678',
    email: 'info@partner-example.hr',
    website: 'https://example.hr',
    coordinates: { lat: 43.3850, lng: 16.5527 },
    description:
      'Partner u programu Holter monitoringa za područje otoka Brača i okolice. (Demo prikaz, konačni partner bit će potvrđen.)',
    services: ['holter-ekg', 'video-konzultacija', 'drugo-misljenje'],
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
      'Partner u programu Holter monitoringa za područje grada Zagreba. (Demo prikaz, konačni partner bit će potvrđen.)',
    services: ['holter-ekg', 'holter-kmat', 'video-konzultacija', 'drugo-misljenje'],
  },
];

/**
 * Service keys that are Poliklinika platform services — always available to
 * every patient regardless of which partner they choose for the on-site
 * scan. Used by partner cards and the map popup to flag those badges as
 * universal (vs. partner-specific).
 */
export const PLATFORM_SERVICES: ReadonlySet<ServiceKey> = new Set([
  'video-konzultacija',
  'drugo-misljenje',
]);

export function isPlatformService(service: ServiceKey): boolean {
  return PLATFORM_SERVICES.has(service);
}

/**
 * Known partner cities for SEO meta (long-tail) and map preview.
 * Coordinates are public/known geographic data, safe to ship without consent.
 */
export const PARTNER_CITIES: ReadonlyArray<{
  city: string;
  region: string;
  coordinates: { lat: number; lng: number };
}> = [
  { city: 'Zagreb', region: 'Grad Zagreb', coordinates: { lat: 45.8150, lng: 15.9819 } },
  { city: 'Virovitica', region: 'Virovitičko-podravska', coordinates: { lat: 45.8311, lng: 17.3833 } },
  { city: 'Brač', region: 'Splitsko-dalmatinska', coordinates: { lat: 43.3850, lng: 16.5527 } },
];

/**
 * Sort a list of service keys into canonical UI order.
 * Use before rendering badges to keep the visual order stable across
 * the partner card, the map popup, and any future surfaces.
 */
export function sortServices(services: ServiceKey[]): ServiceKey[] {
  return SERVICE_ORDER.filter((key) => services.includes(key));
}
