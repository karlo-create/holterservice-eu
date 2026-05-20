# Placeholders — holterservice.eu

This is the running list of stubs/unknowns that the founder (and/or designer)
needs to supply before launch. Each entry includes _where_ in the code the
placeholder lives so updates are mechanical.

Keep this file as the single source of truth — if you add a `PLACEHOLDER`
comment in code, add a row here too.

---

## 1. Brand & visual direction

- **Inspiration references.** ~~Founder will supply moodboard / reference
  sites.~~ **RESOLVED (VEY-157):** Designer applied a "premium specialist
  medical" direction — Swiss/Berlin private-clinic reference — without
  founder moodboard. Founder may refine further.
- **Brand colors.** ~~Cyan primary `#0e7490`, system body font.~~
  **RESOLVED (VEY-157):** Updated to deep cobalt navy `#1e4576` (primary),
  warm off-white `#f7f5f2` (section backgrounds), warm border `#e4e1db`.
  All tokens in `src/styles/tokens.css`. Founder may adjust to match real
  brand identity once it is confirmed.
- **Type pairing.** ~~System body font, Source Serif for headings.~~
  **RESOLVED (VEY-157):** Source Serif 4 (headings, Google Fonts) + Inter
  (body, Google Fonts). Both loaded via `<link>` in `BaseLayout.astro`.
  Founder may replace with licensed typefaces if brand guidelines demand it.
- **Logo / wordmark.** `public/favicon.svg` still uses a generic SVG
  placeholder. Header uses `◇ Holterservice` text mark as v1 placeholder.
  **Still needed:** real wordmark / SVG logo from founder or brand designer.
  - Files: `public/favicon.svg`, `src/components/Header.astro`
- **Photography.** No stock medical clichés. Awaiting real photography of
  ustanova / dr. Obad / a partner clinic interaction. Currently no hero image;
  the homepage relies on type + a subtle radial gradient.
  **Still needed:** original photography or curated editorial-quality images.

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
- **Inquiry form backend.** ~~`src/components/PartnerForm.astro` ships as a
  `mailto:` form.~~ **RESOLVED (VEY-170):** Form now POSTs to
  `/api/partner-inquiry` (Astro + Vercel serverless), validates with zod,
  applies a 3/IP/hour rate limit + honeypot, and sends both a notification
  to `partneri@holterservice.eu` and an autoresponder to the submitter via
  Resend. **Still needed from founder:**
  - `RESEND_API_KEY` env var (Production + Preview in Vercel).
  - Verified sender domain `holterservice.eu` in Resend (SPF/DKIM/DMARC).
  - `partneri@holterservice.eu` inbox provisioned and tested.
  - Real `PUBLIC_CAL_LINK` (Cal.com 15-min discovery event) — currently
    placeholder `https://cal.com/holterservice`.
  - Update `/privatnost` to mention the new recipient + retention.
  - Set `PUBLIC_PLAUSIBLE_DOMAIN=holterservice.eu` once the Plausible
    site is created (or leave empty for v1 launch).

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

- **Plausible wired but inert by default (VEY-170).** `BaseLayout.astro`
  only injects the Plausible script when `PUBLIC_PLAUSIBLE_DOMAIN` is set,
  so default builds still ship zero analytics. Custom events
  (`partner_form_view`, `partner_form_submit_attempt`,
  `partner_form_submit_success`, `partner_form_submit_error`,
  `partner_form_thank_you_view`, `partner_calendar_book_click`) are sent
  via `window.plausible(...)`. Founder action:
  - Create Plausible site for `holterservice.eu`, set
    `PUBLIC_PLAUSIBLE_DOMAIN=holterservice.eu` in Vercel.
  - Enable "Custom events" in the Plausible site settings to see the
    above events.
  - Plausible is cookieless — `/kolacici` still accurate as-is. If a
    different provider is chosen instead, update `/kolacici`.
