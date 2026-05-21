# Placeholders — what the founder needs to deliver

**Last updated:** 2026-05-20 (VEY-172)

This is the single source of truth for every stub on holterservice.eu that is
waiting on founder/legal/designer input. Each item lists **what** to deliver,
**where on the site** it lands, and **which file(s)** the engineer will touch
when the asset/text arrives.

If you add a new `PLACEHOLDER` comment in code, add a row here too.

> **Reading guide**
> - ⏳ = pending — needs founder/designer/legal action
> - ✅ = resolved — kept here for historical traceability
> - 🟡 = partial — currently shipped with a working placeholder; replace when real asset lands

---

## 1. Dr. Obad — photo & copy approval (VEY-172)

### 1.1 ⏳ Photo of dr. Obad
- **What to deliver:** high-res photo, **min 800×800 px**, square or 4:5 portrait. Editorial style (no stock cliché). Founder must include permission/release to use on website.
- **Backup source:** [poliklinika-obad.hr/profile/izv-prof-dr-sc-ante-obad-dr-med-spec/](https://poliklinika-obad.hr/profile/izv-prof-dr-sc-ante-obad-dr-med-spec/) — if reused, founder must still confirm permission.
- **Where it appears on the site:**
  - `/o-nama` — large photo, ~280 px square, top of the "Osnivač i specijalist" card.
  - `/` (homepage) — small circular thumbnail, 60–80 px, inside the right-side "Specijalistički nalaz" credential card.
- **Files to update once delivered:**
  - Drop the file at `public/dr-obad.jpg` (or `.webp`).
  - `src/pages/o-nama.astro` — swap `<figure class="about-photo about-photo--placeholder">…</figure>` for `<figure class="about-photo"><img src="/dr-obad.jpg" alt="prof. dr. sc. Ante Obad, dr. med." width="800" height="800" /></figure>`.
  - `src/pages/index.astro` — swap the `<div class="cred-avatar">` SVG silhouette for an `<img>` with circular crop.

### 1.2 ⏳ Copy approval — dr. Obad bio + Poliklinika Dr. Obad block
- **What to deliver:** founder confirms with dr. Obad that the live copy on `/o-nama` is factually accurate and OK to publish.
- **Specifically check:**
  - Career mentions (KBC Split, KB Dubrava).
  - Doctorate year + topic ("2009, kardiovaskularna fiziologija").
  - Academic roles ("izvanredni profesor", "zamjenik pročelnika", "pomoćnik za inovacije i razvoj").
  - Poliklinika founding year (1995), founder name ("mr. sc. Marko Obad, dr. med.").
  - "Nastavna baza Sveučilišta u Splitu" wording.
- **Where it lives:** `src/pages/o-nama.astro` (lines 26–96).

---

## 2. Brand & visual assets

### 2.1 ⏳ Logo / wordmark
- **What to deliver:** real SVG wordmark + favicon. Current header uses a small ECG-line SVG + the word "Holterservice" as a text mark — placeholder only.
- **Files to update:**
  - `public/favicon.svg` — replace with real favicon.
  - `src/components/Header.astro` — swap the ECG + text mark for the real logo SVG.

### 2.2 🟡 Brand colors (already in place, founder may refine)
- ✅ Current: deep cobalt navy `#1e4576` (primary), warm off-white `#f7f5f2` (sections), warm border `#e4e1db`. All tokens in `src/styles/tokens.css`.
- **If founder wants to adjust:** send hex codes; engineer updates `src/styles/tokens.css`.

### 2.3 🟡 Typography (already in place, founder may refine)
- ✅ Current: Source Serif 4 (headings) + Inter (body), self-hosted via fontsource (`src/styles/global.css`).
- **If founder wants licensed typefaces:** send font files + license; engineer swaps fontsource imports.

### 2.4 ⏳ Photography (general)
- **What to deliver:** original photography of (a) ustanova interior, (b) partner clinic interaction, (c) optional: redacted sample Holter nalaz. Editorial / "premium specialist medical" tone — no stock medical clichés.
- **Where it could appear:**
  - Homepage hero — currently relies on type + ECG waveform. Optional editorial image.
  - `/usluga` — optional redacted sample nalaz (see §7 below).
  - `/o-nama` — could anchor the page if multiple photos available.

### 2.5 🟡 Open Graph (social share) image
- ✅ Current: `public/og-default.svg` placeholder.
- **What to deliver:** rasterized 1200×630 PNG/JPG (some social scrapers prefer raster).
- **Files to update:** drop at `public/og-default.png`; update `defaultOgImage` in `src/components/Seo.astro`.

---

## 3. Business / clinical wording (do NOT invent)

### 3.1 ⏳ Revenue split with partners
- **What to deliver:** confirm the exact wording for the partner revenue model. Currently `/za-partnere` says "klinika zadržava dogovoreni dio cijene", intentionally vague.
- **Where it lives:** `src/pages/za-partnere.astro` (~line 108).

### 3.2 ⏳ Certification language
- **What to deliver:** confirm the exact name/scope/issuing authority for "certifikat osposobljenosti" for partner staff.
- **Where it appears:** `src/pages/index.astro`, `src/pages/za-partnere.astro`, `src/pages/o-nama.astro`.

### 3.3 ⏳ Scope of service confirmation
- **What to deliver:** confirm "Holterservice ne ordinira terapiju" is accurate. Adjust if there's any additional clinical service.
- **Where it lives:** `src/pages/usluga.astro`.

### 3.4 ⏳ Nalaz turnaround time
- **What to deliver:** confirm if "u roku od nekoliko radnih dana" is final, or whether a stricter promise (e.g. 3–5 dana) should be made.
- **Where it lives:** `src/pages/za-pacijente.astro` (~line 65).

---

## 4. Partner registry

### 4.1 ⏳ List of partner clinics
- **What to deliver:** for each partner clinic — name, city/region, address (or area served if no public address), optional website URL, optional phone. Populating this auto-renders cards on `/partneri` and emits `LocalBusiness` JSON-LD per partner.
- **Where it lives:** `src/data/partners.ts` — currently an empty `partners: []` array with an example structure commented out.
- **Effect once populated:**
  - `/partneri` cards render.
  - Empty-state ("uskoro") on `/partneri` disappears.
  - Each partner gets its own `LocalBusiness` schema in the page head.

### 4.2 ⏳ Map of partners (decision)
- **Decision needed:** once partner list lands, decide whether to embed an interactive map (Leaflet + OpenStreetMap) or keep the static "uskoro" block.
- **Where it lives:** `src/pages/partneri.astro` (`.map-placeholder`, ~line 98).

---

## 5. Contact details

### 5.1 ⏳ Telefon
- **What to deliver:** real phone number (with country code).
- **Where it appears:**
  - `src/components/Footer.astro` (~line 45)
  - `src/pages/kontakt.astro` (~line 29)
  - `src/pages/impressum.astro` (~line 25)

### 5.2 ⏳ Adresa ustanove
- **What to deliver:** full registered address.
- **Where it appears:**
  - `src/pages/kontakt.astro` (~line 34)
  - `src/pages/impressum.astro` (~line 29)

### 5.3 🟡 E-pošta
- ✅ Currently `info@holterservice.eu` (sitewide). Confirm this mailbox is live before launch.

### 5.4 ⏳ Inquiry form backend
- **What to deliver:** decision — keep `mailto:` form or wire a real POST endpoint (Formspree / Resend / serverless function). If a real endpoint, also document recipient + retention in `/privatnost`.
- **Where it lives:** `src/components/PartnerForm.astro`.

---

## 6. Legal copy (Impressum / Privatnost / Kolačići)

Templates are GDPR-aligned + HR e-trgovina, but final wording needs **pravna provjera by a lawyer**.

### 6.1 ⏳ Voditelj obrade — naziv, adresa, OIB
- **Where it appears:** `src/pages/impressum.astro` (~lines 25–53), `src/pages/privatnost.astro` (~lines 38–46).

### 6.2 ⏳ Titule odgovorne osobe
- Currently "dr. Obad (titule uskoro)". After VEY-172 ships, this should be updated to the full "prof. dr. sc. Ante Obad, dr. med."
- **Where it lives:** `src/pages/impressum.astro` (~line 41).

### 6.3 ⏳ Nadležna tijela
- **What to deliver:** confirmed list of supervisory bodies (HLK, Ministarstvo zdravstva itd.) for the impressum.
- **Where it lives:** `src/pages/impressum.astro` (~line 63).

### 6.4 ⏳ Rok čuvanja podataka
- Currently 24 mjeseca placeholder. Confirm or adjust to ustanova policy.
- **Where it lives:** `src/pages/privatnost.astro` (~line 93).

### 6.5 ⏳ Pravna provjera — Privatnost / Kolačići
- Lawyer must sign off on the final text of `/privatnost` and `/kolacici`.

---

## 7. Sample report (optional)

### 7.1 ⏳ Redacted sample nalaz image
- **What to deliver:** anonymized image of a real Holter nalaz, with all patient identifiers removed. Optional but high-impact for `/usluga`.
- **File to drop:** `public/sample-report.png` (or `.jpg`).
- **Where it appears:** `src/pages/usluga.astro` — engineer will add a `<figure>` once approved.

---

## 8. Analytics

> **Note:** Plausible details below describe planned/in-flight work on parallel branches (VEY-170, VEY-177). The VEY-172 branch itself does not yet contain that wiring; this doc reflects the consolidated state once the in-flight branches merge to main.

### 8.1 🟡 Plausible (cookieless) — opt-in via env var
- **Status:** wired on parallel branches. Set `PUBLIC_PLAUSIBLE_DOMAIN=holterservice.eu` (Vercel project env) to enable. When unset, no script loads, no events fire. Plausible is cookieless → no consent banner required.
- **What to deliver:** founder decision — enable Plausible at launch (recommended), or stay with no analytics.
- **Custom events wired on those branches:** `partner_form_view`, `partner_form_submit_attempt`, `partner_email_click`, `partner_phone_click`, `partner_calendar_book_click`, `patient_partner_card_click`.

### 8.2 ⏳ Form-submit events (depend on §5.4)
- `partner_form_submit_success` / `partner_form_submit_error` can only fire once the form has a real POST backend. Wire them when §5.4 is resolved.

### 8.3 ⏳ If founder picks GA4 instead
- Requires full cookie consent flow (banner + reject-all + cookie table update). Significantly more work. **Recommendation: stay with Plausible.**

---

## 9. Schiller device + GDPR (VEY-174)

- **Exact Schiller device model.** `/usluga` "Tehnologija koju koristimo"
  section currently says only "Schiller medilog profesionalni Holter EKG
  monitori". The exact model (medilog AR / AR12Plus / FD) must be confirmed
  by founder + dr. Obad before launch; once confirmed, add the model name to
  the opening paragraph.
  - File: `src/pages/usluga.astro`
- **Schiller logo.** DO NOT add the Schiller logo on the site until written
  permission from Schiller AG is received. No logo is rendered today.
- **Device photo.** No device photo is rendered on `/usluga`. If Poliklinika
  Dr. Obad has its own device photos, render one in the tech section. Do
  NOT use Schiller press-kit images without permission.
- **DPA template.** GDPR section references "Sporazum o partnerstvu" and
  "Ugovor o obradi osobnih podataka". Founder to confirm whether an existing
  DPA template is used or a new one is needed before launch.
  - File: `src/pages/za-partnere.astro`

---

## Quick checklist — single page version

Sorted by what unblocks ship-readiness fastest:

- [ ] **Dr. Obad photo** (≥800×800, square/4:5) + usage permission → `/o-nama` + `/` (§1.1)
- [ ] **Copy approval** from dr. Obad on bio + Poliklinika block → `/o-nama` (§1.2)
- [ ] **Telefon** → footer, `/kontakt`, `/impressum` (§5.1)
- [ ] **Adresa ustanove** → `/kontakt`, `/impressum` (§5.2)
- [ ] **Voditelj obrade** (naziv, adresa, OIB) → `/impressum`, `/privatnost` (§6.1)
- [ ] **Partner list** → `src/data/partners.ts` (§4.1)
- [ ] **Revenue split wording** → `/za-partnere` (§3.1)
- [ ] **Certifikat osposobljenosti** — exact name → 3 pages (§3.2)
- [ ] **Real logo / wordmark / favicon** → header + favicon (§2.1)
- [ ] **Pravna provjera** of `/privatnost` + `/kolacici` by lawyer (§6.5)
- [ ] **Photography** (ustanova / partner / sample report) — optional but desired (§2.4, §7.1)
- [ ] **Raster OG image** (1200×630 PNG/JPG) (§2.5)
- [ ] **Plausible env var** decision at launch (§8.1)
- [ ] **Form backend** — `mailto:` vs real POST (§5.4)
- [ ] **Schiller device model + DPA template** confirmation (§9)

---

## Notes for engineer (when assets land)

- Every entry above points to the exact file. Most placeholders are visually marked `uskoro` (italic muted text) or are `<figure class="about-photo--placeholder">`. Removing them is mechanical: drop asset → swap markup → done.
- If a placeholder is removed but a new dependency is introduced (e.g. real POST endpoint depends on a new env var), update this doc + add the env var to the Vercel project.
- Historical "RESOLVED" entries (brand colors, typography, design direction from VEY-157) are not repeated above to keep the founder-facing list short. Git history is the source of truth for those.
