# Placeholders — holterservice.eu

This is the running list of stubs/unknowns that the founder (and/or designer)
needs to supply before launch. Each entry includes _where_ in the code the
placeholder lives so updates are mechanical.

Keep this file as the single source of truth — if you add a `PLACEHOLDER`
comment in code, add a row here too.

---

## 1. Brand & visual direction

- **Inspiration references.** Founder will supply moodboard / reference sites
  after the Obad meeting. Designer will translate these into tokens.
- **Brand assets.** Logo, exact color palette, type pairing.
  Until provided, the site uses a neutral premium-medical default (cyan
  primary `#0e7490`, system body font, Source Serif for headings).
  - Files: `src/styles/tokens.css`, `public/favicon.svg`, `public/og-default.svg`.
- **Photography.** No stock medical clichés. Awaiting real photography of
  ustanova / dr. Obad / a partner clinic interaction. Currently no hero image;
  the homepage relies on type + a subtle radial gradient.

## 2. Business / clinical wording (do NOT invent)

- **Revenue split with partners.** `/za-partnere` mentions a model where
  partner keeps a dogovoreni dio cijene. Exact percentage / model intentionally
  vague — founder must confirm wording before launch.
  - File: `src/pages/za-partnere.astro`
- **Certification language.** Site mentions a "certifikat osposobljenosti"
  for partner staff. Exact name, scope, and issuing-authority phrasing
  unconfirmed.
  - Files: `src/pages/index.astro`, `src/pages/za-partnere.astro`,
    `src/pages/o-nama.astro`
- **Scope of service.** Currently states "Holterservice ne ordinira terapiju".
  Confirm this is accurate; adjust if there is some additional clinical
  service.
  - File: `src/pages/usluga.astro`
- **Nalaz turnaround time.** Page says "u roku od nekoliko radnih dana".
  Founder to confirm if a stricter promise (e.g. 3–5 dana) is appropriate.
  - File: `src/pages/za-pacijente.astro`
- **Dr. Obad bio.** Titule, ustanova, biografija — currently "specijalist
  kardiologije iz provjerene ustanove" used as a placeholder.
  - File: `src/pages/o-nama.astro`

## 3. Partner registry

- **Partner list.** `src/data/partners.ts` is empty. Populating it
  automatically:
  - Renders cards on `/partneri`
  - Emits `LocalBusiness` JSON-LD per partner
  - Removes the "uskoro" empty-state on that page
- **Mapa partnera.** When the partner list lands, decide whether to embed an
  interactive map (e.g. Leaflet + OSM tiles). Until then `/partneri` shows a
  static placeholder block.

## 4. Contact details

- **Telefon, e-pošta, adresa.** Currently `info@holterservice.eu` (likely
  valid eventually) and "uskoro" for phone/address. Touch points:
  - `src/components/Footer.astro`
  - `src/pages/kontakt.astro`
  - `src/pages/impressum.astro`
- **Inquiry form backend.** `src/components/PartnerForm.astro` ships as a
  `mailto:` form (no server). When a real endpoint is wired up, swap the
  `action`. Document recipient + retention in `/privatnost`.

## 5. Legal copy

- **Politika privatnosti / Impressum / Kolačići.** Templates aligned with
  GDPR + HR e-trgovina, but final wording needs pravna provjera.
  - Voditelj obrade: naziv, adresa, OIB — unknown.
  - Nadležna tijela (HLK, Ministarstvo zdravstva itd.) — unknown.
  - Rok čuvanja podataka (currently 24 mjeseca) — confirm or adjust.
  - Files: `src/pages/privatnost.astro`, `src/pages/kolacici.astro`,
    `src/pages/impressum.astro`

## 6. Sample report

- **Sample report image.** Designer may want to show a redacted sample nalaz
  on `/usluga`. Not currently rendered. Add as `public/sample-report.png` and
  reference once approved by founder.

## 7. OG image

- **`/og-default.svg`** ships an SVG OG image as a placeholder. Some social
  scrapers prefer PNG/JPG at exactly 1200×630. Replace with a rasterized
  `/og-default.png` when designer ships proper brand assets and update the
  default in `src/components/Seo.astro`.

## 8. Analytics

- **None installed.** Cookie policy currently states only technically
  necessary cookies. If analytics (e.g. Plausible, Umami) is added later,
  update `/kolacici` table and re-evaluate consent banner need.
