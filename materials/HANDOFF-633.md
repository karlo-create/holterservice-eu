# VEY-633 — Knjižica za pacijenta (HR), designer handoff

Parent: VEY-629 (founder request, 2026-08-19).
Branch: `eng/VEY-633-knjizica-pacijent`.

12-page A5 booklet, Croatian, Holterservice-branded, built to the reference
patient kit guide the founder supplied on VEY-629, under the four decisions the
PM confirmed with the founder at 10:12 (D1 faithful transposition, D2 both app
pages with a generic name, D3 one QR to holterservice.eu/za-pacijente, D4 no
third-party regulatory block plus a visible concept-material notice).

## Deliverables

| File | What |
|---|---|
| `materials/src/knjizica.html` | Booklet source, 12 pages |
| `materials/dist/knjizica-za-pacijenta.pdf` | Print-ready PDF, 12 pages, 716 KB |
| `materials/dist/knjizica-preview/p01.png` … `p12.png` | Per-page preview at 2x |
| `materials/assets/qr/qr-upute.svg` | The one scannable QR, plus a regeneration note |
| `materials/build.mjs` | Booklet job wired in, so `npm run materials` builds it |

## PM audit findings, how each was resolved

**1. Three identical QR files under Apple and Android icons.** Resolved. The two
store codes are deleted from disk; `materials/assets/qr/` now holds exactly one
file, `qr-upute.svg`, encoding `https://holterservice.eu/za-pacijente`. Page 8
shows that single code once, centered. The Apple and Android glyphs stay under
it as availability marks, not as separate scan targets. The search pill no
longer names a nonexistent listing, it reads `holterservice.eu/za-pacijente`,
and the caption sends the patient to that page for download instructions.

**2. Missing concept-material notice.** Resolved, in two places. Colophon on
page 11: "Ovaj vodič je informativni i promotivni materijal Holterservicea.
Nije uputa za uporabu medicinskog proizvoda i ne zamjenjuje upute proizvođača
uređaja ni savjet vašeg liječnika." Back cover, short form: "Informativni i
promotivni materijal. Nije uputa za uporabu medicinskog proizvoda."

**3. Document labelled itself as an IFU.** Resolved. "Upute za pacijenta" is
gone from every visible surface. Cover H1 is now "Paket i vodič za pacijenta",
the running footer on all ten inner pages is "Holterservice · Vodič za
pacijenta", and the colophon reads "Vodič za pacijenta, verzija 1.0, kolovoz
2026." The page 7 warning now says "Sačuvajte ovaj vodič do kraja snimanja."

**4. `HS-24` invented model code.** Resolved. Removed from both places. The
cover now reads "Nosivi EKG senzor" with the subline "Holter EKG, 24-satno
snimanje". In the colophon the bordered code boxes are gone entirely, replaced
by plain uppercase labels (Sadržaj, Izdavač, Verzija), so nothing on that page
reads as a REF slot any more.

**Minor.** The reference product is no longer named in the HTML source header.

## Page order (mirrors the reference exactly)

1. Naslovnica — Paket i vodič za pacijenta, nosivi EKG senzor
2. Holter snimanje, jednostavno — uvod, Što je obuhvaćeno A/B/C, videoupute QR
3. Postavljanje: 1 obrijte dlake, 2 pripremite kožu
4. 3 osušite kožu, 4 nanesite ljepilo (rukavice)
5. 5 nanesite ljepilo (maramica), 6 izvadite senzor
6. 7 skinite zaštitnu foliju, 8 postavite senzor
7. 9 pritisnite senzor uz kožu (A–E) + upozorenja (jedan sat, sačuvajte vodič)
8. Povezivanje: 1 preuzmite aplikaciju (jedan QR), 2 prijava i uključivanje
9. Korištenje aplikacije: važne upute, bilježenje simptoma, napomene
10. Skidanje: upozorenje (obje potvrde u aplikaciji) + 1 skinite senzor
11. 2 zbrinite senzor + kolofon + napomena o naravi materijala
12. Zadnja korica

## Design decisions

- **Format.** A5 portrait, 12 pages, saddle-stitch friendly (multiple of 4). The
  reference is a squarer format; A5 is the practical Croatian print size and
  matches the existing `materials` pipeline.
- **Brand.** Existing tokens only: trust blue `#1457a4`, ink `#111827`, cool
  off-white panels, self-hosted Inter + Source Serif 4.
- **Illustrations.** Every illustration and icon is authored as inline SVG line
  art in the reference's single-weight style (sensor patch, male and female
  torsos, hands, razor, wipes, pouch, phone screens, e-waste bin). No stock
  photography and no generated imagery, so everything stays editable and prints
  crisp at any size. Third-party sample sachets visible in the founder's photos
  (Hollister, Skin Tac, Hygynx, McKesson) were not reproduced.
- **App screens** are our own mockups, not traced from the reference UI.
- **Section colour coding** follows the reference: one tint for postavljanje,
  one for povezivanje and aplikacija, a warm tint for skidanje.
- **Anatomy.** The sensor sits on the patient's left chest, below the collarbone
  and left of the sternum, so it appears on the viewer's right in every
  illustration. Consistent across all pages.
- **Verified.** 12 pages render with zero content overflow at print geometry, no
  console errors, fonts fully loaded before the PDF snapshot, and no occurrence
  of `HS-24`, `Holterservice Holter`, `Upute za pacijenta`, or the reference
  product name anywhere in the source.

## Not done yet

Bleed and crop marks are not in the file. They go in once the format and printer
are locked, because bleed depends on the printer's spec.

## How to rebuild

```
npm run materials          # builds every material including the booklet
```

Preview PNGs are captured with Playwright at `deviceScaleFactor: 2`, one
screenshot per `section.page`.
