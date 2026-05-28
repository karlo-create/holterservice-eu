/**
 * FAQ copy for /za-partnere and /za-pacijente.
 *
 * The same items are used to render the accordion body and to emit
 * FAQPage JSON-LD into <head>. Keep this file as the single source of
 * truth so the visible copy and the schema can never drift apart.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export const partnerFaq: FaqItem[] = [
  {
    question:
      'Tko snosi odgovornost ako se uređaj pokvari ili izgubi?',
    answer:
      'Uređaj ostaje vlasništvo Holterservicea. U slučaju kvara mi smo obvezni izvršiti popravak ili zamjenu. U slučaju gubitka uvjeti su definirani Sporazumom o partnerstvu i ovise o okolnostima.',
  },
  {
    question:
      'Koliko dugo traje onboarding od potpisa do prve pretrage?',
    answer:
      'Tipično 2 tjedna. Tjedan dana dostava + edukacija osoblja, tjedan dana priprema lokalnih protokola.',
  },
  {
    question:
      'Trebam li medicinsko osoblje da bih postavljao uređaj?',
    answer:
      'Ne nužno. Obučavamo i medicinsko i ne-medicinsko osoblje (npr. njegovateljice). Po potrebi izdajemo certifikat osposobljenosti.',
  },
  {
    question:
      'Koliko brzo pacijent dobiva nalaz?',
    answer:
      'Standardno 3–5 radnih dana od trenutka kad uređaj stigne u laboratorij Poliklinike Dr. Obad. Hitan nalaz dostupan je unutar 24 h, uz dodatnu cijenu — dogovara se bilateralno s partnerskom klinikom.',
  },
  {
    question:
      'Imam li ekskluzivu na svojem području?',
    answer:
      'Razgovaramo o tome od slučaja do slučaja. Za otoke i manja mjesta ekskluzivnost ima smisla i moguća je. U urbanim zonama tipično ne.',
  },
  {
    question:
      'Mogu li raskinuti suradnju?',
    answer:
      'Da. Otkazni rok i uvjeti definirani su Sporazumom o partnerstvu. Cilj je da partnerstvo bude održivo, ne zaključano.',
  },
  {
    question:
      'Što s pacijentovim podacima i medicinskom tajnom?',
    answer:
      'Voditelj obrade je Poliklinika Dr. Obad. Detalji u sekciji "Zaštita podataka pacijenata" iznad i u Sporazumu o partnerstvu.',
  },
];

export const patientFaq: FaqItem[] = [
  {
    question:
      'Koliko košta pretraga?',
    answer:
      'Cijenu određuje partnerska klinika — ovisi o partneru i dostupna je na upit. Za točan iznos kontaktirajte odabranog partnera.',
  },
  {
    question:
      'Pokriva li HZZO ovu pretragu?',
    answer:
      'Holterservice radi kao privatna usluga preko partnerskih klinika. HZZO pokrivenost ovisi o statusu partnera i Vašoj uputnici. Pitajte partnera pri naručivanju.',
  },
  {
    question:
      'Mogu li tuširati uređaj?',
    answer:
      'Ne. Uređaj je otporan na prskanje ali ne na uranjanje. Tuširanje izbjegavajte tijekom nošenja, osim ako vas partner izričito ne uputi drugačije.',
  },
  {
    question:
      'Što ako mi se otkače elektroda?',
    answer:
      'Nazovite partnersku kliniku. Ne pokušavajte sami namještati. Većina kratkih prekida ne ugrožava kvalitetu nalaza.',
  },
  {
    question:
      'Koliko traje da dobijem nalaz?',
    answer:
      'Standardno 3–5 radnih dana od trenutka kad uređaj stigne u laboratorij Poliklinike Dr. Obad. Hitan nalaz dostupan je unutar 24 h, uz dodatnu cijenu — dogovara se s partnerskom klinikom.',
  },
  {
    question:
      'Mogu li uzimati lijekove i jesti normalno?',
    answer:
      'Da. Pretraga ne mijenja vaše uobičajene navike. Upravo zato Holter EKG hvata stvarno stanje srca tijekom vašeg običnog dana.',
  },
  {
    question:
      'Što ako se ne mogu vratiti u kliniku za 24 sata?',
    answer:
      'Dogovorite drugi termin. Snimka može trajati i nekoliko dana ako je tako dogovoreno.',
  },
];

/**
 * Build the FAQPage JSON-LD structured data object from a list of items.
 * Stringify the return value and inject inside a
 * <script type="application/ld+json"> tag in <head>.
 */
export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
