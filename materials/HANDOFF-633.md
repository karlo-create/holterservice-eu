# VEY-633 — Knjižica za pacijenta (HR), designer handoff

Parent: VEY-629 (founder request, 2026-08-19).
Branch: `eng/VEY-633-knjizica-pacijent`. Commits `6915bfc`, `193e6d0`.

12-page A5 booklet, Croatian, Holterservice-branded, modelled 1:1 on the
UbiqVue Holter "Patient Kit and Guide" photos the founder attached to VEY-629.

## Deliverables

| File | What |
|---|---|
| `materials/src/knjizica.html` | Booklet source, 12 pages |
| `materials/dist/knjizica-za-pacijenta.pdf` | Print-ready PDF, 12 pages, 668 KB |
| `materials/dist/knjizica-preview/p01.png` … `p12.png` | Per-page preview at 2x for review |
| `materials/assets/qr/` | Three real QR codes plus a regeneration note |
| `materials/build.mjs` | Booklet job wired in, so `npm run materials` builds it |

## Page order (mirrors the reference exactly)

1. Naslovnica — Paket i upute za pacijenta, HS-24 nosivi EKG senzor
2. Holter snimanje, jednostavno — uvod, Što je obuhvaćeno A/B/C, videoupute QR
3. Postavljanje: 1 obrijte dlake, 2 pripremite kožu
4. 3 osušite kožu, 4 nanesite ljepilo (rukavice)
5. 5 nanesite ljepilo (maramica), 6 izvadite senzor
6. 7 skinite zaštitnu foliju, 8 postavite senzor
7. 9 pritisnite senzor uz kožu (A–E) + upozorenja (jedan sat, sačuvajte upute)
8. Povezivanje: 1 preuzmite aplikaciju (QR iOS/Android), 2 prijava i uključivanje
9. Korištenje aplikacije: važne upute, bilježenje simptoma, napomene
10. Skidanje: upozorenje (obje potvrde u aplikaciji) + 1 skinite senzor
11. 2 zbrinite senzor + kolofon
12. Zadnja korica

## Design decisions

- **Format.** A5 portrait, 12 pages, saddle-stitch friendly (multiple of 4). The
  reference is a squarer format; A5 is the practical Croatian print size and
  matches the existing `materials` pipeline.
- **Brand.** Existing tokens only: trust blue `#1457a4`, ink `#111827`, cool
  off-white panels, self-hosted Inter + Source Serif 4. No UbiqVue or
  LifeSignals marks anywhere.
- **Illustrations.** Every illustration and icon is authored as inline SVG line
  art in the reference's single-weight style (sensor patch, male and female
  torsos, hands, razor, wipes, pouch, phone screens, e-waste bin). No stock
  photography and no generated imagery, so everything stays editable and prints
  crisp at any size.
- **Section colour coding** follows the reference: one tint for postavljanje,
  one for povezivanje and aplikacija, a warm tint for skidanje.
- **Anatomy.** The sensor sits on the patient's left chest, below the collarbone
  and left of the sternum, so it appears on the viewer's right in every
  illustration. Consistent across all pages.
- **Verified.** 12 pages render with zero content overflow at print geometry, no
  console errors, and fonts fully loaded before the PDF snapshot.

## Open questions for the founder

These were deliberately not answered by guessing.

1. **QR targets.** All three QR codes currently encode
   `https://holterservice.eu/za-pacijente`. The video QR needs a real
   instructional-video URL, and the two store QRs need real App Store and
   Google Play links once they exist.
2. **App name.** Currently "Holterservice Holter" in the search pill and
   "Holterservice aplikacija" in body copy. Founder should confirm.
3. **Product name.** Currently "HS-24 — nosivi EKG senzor". Placeholder.
4. **Kolofon.** The reference carries a regulatory block (REF, manufacturer,
   EC REP, doc number). That was left out and replaced with an izdavač block,
   because inventing regulatory identifiers on medical-adjacent print would be
   wrong. If this ships with a real device, that block needs real data.
5. **Self-application vs partner clinic.** The booklet describes the patient
   applying the sensor themselves, because the founder asked for the same text
   translated. Today `holterservice.eu/za-pacijente` describes partner-clinic
   staff applying the device. The founder already flagged this as intentional
   packaging ("nije promijenio način rada nego ga samo pakiramo"), so it was
   built as asked. This is the single biggest copy decision to confirm before
   print.

## Not done yet

Bleed and crop marks are not in the file. They go in once the format and
printer are locked, because bleed depends on the printer's spec.

## How to rebuild

```
npm run materials          # builds every material including the booklet
```

Preview PNGs were captured with Playwright at `deviceScaleFactor: 2`, one
screenshot per `section.page`.
