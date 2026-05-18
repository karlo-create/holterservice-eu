/**
 * Partner registry.
 *
 * Empty for v1 — founder will supply the real list. Populating this array
 * automatically:
 *   - renders cards on /partneri
 *   - emits LocalBusiness JSON-LD per partner on that page
 *
 * Keep the schema below stable so server-rendered JSON-LD stays valid as
 * partners are added. See PLACEHOLDERS.md.
 */

export interface Partner {
  /** Unique slug (used for anchors). */
  slug: string;
  /** Klinika / ustanova naziv. */
  name: string;
  /** Mjesto (e.g. "Lastovo"). */
  city: string;
  /** Puna adresa. */
  address?: string;
  /** Telefon u E.164 ili HR formatu. */
  phone?: string;
  /** E-pošta za naručivanje. */
  email?: string;
  /** Web partnerske klinike. */
  website?: string;
  /** Lat/lon for map plotting later. */
  lat?: number;
  lng?: number;
}

export const partners: Partner[] = [
  // PLACEHOLDER: real partner list. Example structure (commented out):
  // {
  //   slug: 'lastovo-primarna-zdravstvena-zastita',
  //   name: 'Dom zdravlja Lastovo',
  //   city: 'Lastovo',
  //   address: 'Primjer 1, 20290 Lastovo',
  //   phone: '+385 20 000 000',
  //   email: 'info@example.hr',
  // },
];
