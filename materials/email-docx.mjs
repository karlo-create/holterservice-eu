/*
 * Word (.docx) generator for the Holterservice outreach email templates (VEY-282).
 *
 * Produces materials/dist/email-templates.docx with the same content and brand
 * styling as email-templates.html / .pdf. The founder fills the placeholders
 * ({{TELEFON}}, [ime], [dr. Prezime], [mjesto], [veci grad]) by hand in Word and
 * exports to PDF.
 *
 * Called from materials/build.mjs (npm run materials). Run standalone with:
 *     node materials/email-docx.mjs
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  BorderStyle,
} from 'docx';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';

// Brand tokens, mirrored from materials/assets/tokens.css.
const PRIMARY = '1457A4';
const FOREGROUND = '111827';
const MUTED = '4B5563';
const BORDER = 'DDE4EE';
const SUBJECT_FILL = 'F0F5FA';

// Content data. Text is taken verbatim from the approved VEY-281 plan.
const SETS = [
  {
    title: 'SET 1: Topli outreach (salje dr. Obad, 1 mail, bez follow-upa)',
    intro:
      'Za kontakte iz mreze dr. Obada. Salje i potpisuje dr. Obad osobno, jedan mail bez follow-upa.',
    emails: [
      {
        label: 'Topli mail (dr. Obad, bez follow-upa)',
        subject: 'Holterservice, mislim da bi vam moglo koristiti',
        body: [
          'Poštovani [ime],',
          'javljam se osobno. Pokrenuo sam Holterservice, projekt kroz koji ustanovama izvan Splita omogućujemo da pacijentima ponude Holter EKG i 24-satno mjerenje tlaka, a da nalaz čita i potpisuje specijalist kardiologije, bez ulaganja u opremu s vaše strane.',
          'Model je jednostavan. Mi dajemo Schiller uređaje na korištenje, obučavamo vaše osoblje i osiguravamo specijalističko očitanje. Vi se brinete za pacijenta i postavljanje uređaja. Bez kapitalnog ulaganja i bez fiksnih mjesečnih naknada, a vi zadržavate svoj dio na svakoj realiziranoj pretrazi.',
          'Mislim da bi se ovo dobro uklopilo u vaš rad. Imate li 15 minuta ovaj ili sljedeći tjedan da vam pokažem kako izgleda u praksi? Slobodno odgovorite na ovaj mail ili me nazovite.',
          'Srdačan pozdrav,',
        ],
        signature: [
          'prof. dr. sc. Ante Obad',
          'specijalist kardiologije, Poliklinika dr. Obad',
          '{{TELEFON}} | poliklinika-obad.hr',
        ],
      },
    ],
  },
  {
    title:
      'SET 2: Hladni outreach (potpisuje Karlo, sekvenca 3 maila, staje na prvi odgovor)',
    intro:
      'Sekvenca od 3 maila koju potpisuje Karlo kao Product Manager. Staje na prvi odgovor.',
    emails: [
      {
        label: 'Mail 1, prvi kontakt (dan 0)',
        subject: 'Holter EKG i KMAT za vaše pacijente, bez ulaganja u opremu',
        body: [
          'Poštovani [dr. Prezime],',
          '[jedna rečenica personalizacije, npr. "Pacijenti iz [mjesto] za Holter danas najčešće putuju do [veći grad], pretpostavljam da to vidite i u svojoj praksi."]',
          'Iza ovog maila stoji prof. dr. sc. Ante Obad, specijalist kardiologije i voditelj Poliklinike dr. Obad u Splitu, ustanove koja od 1995. radi kao nastavna baza Sveučilišta u Splitu.',
          'Kroz Holterservice omogućujemo ustanovama izvan velikih centara da pacijentima ponude Holter EKG i Holter KMAT (24-satno mjerenje tlaka) bez ulaganja u opremu i bez vlastitog kardiologa.',
          'Kako funkcionira: mi dajemo Schiller uređaje na korištenje i obučavamo osoblje. Vaš tim postavlja uređaj pacijentu, to je sve što radite. Snimak nam šaljete, a nalaz čita i potpisuje specijalist kardiologije. Bez kapitalnog ulaganja i bez fiksnih mjesečnih naknada. Vi naplaćujete pretragu pacijentu i zadržavate svoj dio na svakoj realiziranoj pretrazi.',
          'Ima li smisla da se čujemo 15 minuta da vidimo odgovara li ovo vašoj praksi? Javite mi se na mail ili telefon iz potpisa i naći ćemo termin koji vam paše.',
          'Srdačan pozdrav,',
        ],
        signature: [
          'Karlo Mrvić',
          'Product Manager, Holterservice u ime Poliklinike dr. Obad',
          '{{TELEFON}} | partneri@holterservice.eu | holterservice.eu',
        ],
      },
      {
        label: 'Mail 2, follow-up (dan 4 do 5)',
        subject: 'Kratko podsjećanje, Holter EKG i KMAT za vašu ustanovu',
        body: [
          'Poštovani [dr. Prezime],',
          'javljam se kratko na prošli mail. Razumijem da je raspored gust, pa idem na bit.',
          'Vaša ustanova može pacijentima ponuditi nalaz specijalista kardiologije bez vlastitog uređaja, softvera i kardiologa. Mi pokrivamo opremu, prijenos podataka, očitanje koje potpisuje specijalist i tehničku podršku. Vaš dio je samo postavljanje uređaja pacijentu.',
          'Pripremu nove ustanove odradimo u pravilu unutar jednog do dva tjedna od dogovora.',
          'Ako vam odgovara, predlažem kratak poziv ovaj ili sljedeći tjedan. Odgovorite na ovaj mail ili me nazovite na broj iz potpisa i dogovorit ćemo termin.',
          'Srdačan pozdrav,',
        ],
        signature: [
          'Karlo Mrvić',
          'Product Manager, Holterservice u ime Poliklinike dr. Obad',
          '{{TELEFON}} | partneri@holterservice.eu | holterservice.eu',
        ],
      },
      {
        label: 'Mail 3, zatvaranje (dan 10 do 12)',
        subject: 'Da zatvorim petlju, Holter EKG za vašu ustanovu',
        body: [
          'Poštovani [dr. Prezime],',
          'javio sam se ranije oko mogućnosti da u svojoj ustanovi ponudite Holter EKG i mjerenje tlaka bez ulaganja u opremu.',
          'Pretpostavljam da trenutno nije pravo vrijeme, što potpuno razumijem. Ostavljam vam kontakt, pa ako se okolnosti promijene ili se ukaže potreba, slobodno se javite.',
          'Ako sam pak nešto promašio i tema vas zanima, dovoljan je jedan red odgovora pa ćemo naći termin.',
          'Srdačan pozdrav,',
        ],
        signature: [
          'Karlo Mrvić',
          'Product Manager, Holterservice u ime Poliklinike dr. Obad',
          '{{TELEFON}} | partneri@holterservice.eu | holterservice.eu',
        ],
      },
    ],
  },
];

function docTitle() {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: 'Holterservice', bold: true, color: PRIMARY, size: 32 }),
      new TextRun({ text: '  Predlošci e-pošte', color: MUTED, size: 32 }),
    ],
  });
}

function introLine() {
  return new Paragraph({
    spacing: { after: 240 },
    children: [
      new TextRun({
        text:
          'Prilagodite placeholdere ({{TELEFON}}, [ime], [dr. Prezime], [mjesto], [veći grad]) prije slanja.',
        color: MUTED,
        size: 20,
        italics: true,
      }),
    ],
  });
}

function setHeading(text) {
  return new Paragraph({
    spacing: { before: 240, after: 60 },
    border: { bottom: { color: BORDER, style: BorderStyle.SINGLE, size: 8, space: 4 } },
    children: [new TextRun({ text, bold: true, color: PRIMARY, size: 26 })],
  });
}

function setIntro(text) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text, color: MUTED, size: 20 })],
  });
}

function emailLabel(text) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    border: { top: { color: PRIMARY, style: BorderStyle.SINGLE, size: 18, space: 6 } },
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, color: PRIMARY, size: 18 }),
    ],
  });
}

function subjectLine(text) {
  return new Paragraph({
    spacing: { after: 120 },
    shading: { fill: SUBJECT_FILL },
    children: [
      new TextRun({ text: 'Predmet: ', bold: true, color: FOREGROUND, size: 22 }),
      new TextRun({ text, color: FOREGROUND, size: 22 }),
    ],
  });
}

function bodyParagraph(text) {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    children: [new TextRun({ text, color: FOREGROUND, size: 22 })],
  });
}

function signatureParagraph(lines) {
  return new Paragraph({
    spacing: { before: 80, after: 200 },
    border: { top: { color: BORDER, style: BorderStyle.SINGLE, size: 6, space: 6 } },
    children: lines.flatMap((line, i) => {
      const run = new TextRun({ text: line, color: MUTED, size: 18, break: i > 0 ? 1 : 0 });
      return [run];
    }),
  });
}

export async function buildEmailDocx(distDir) {
  if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });

  const children = [docTitle(), introLine()];
  for (const set of SETS) {
    children.push(setHeading(set.title));
    children.push(setIntro(set.intro));
    for (const email of set.emails) {
      children.push(emailLabel(email.label));
      children.push(subjectLine(email.subject));
      for (const p of email.body) children.push(bodyParagraph(p));
      children.push(signatureParagraph(email.signature));
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Calibri' } },
      },
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 1000, bottom: 1000, left: 1100, right: 1100 } },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = join(distDir, 'email-templates.docx');
  writeFileSync(outPath, buffer);
  return outPath;
}

// Allow standalone execution: node materials/email-docx.mjs
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dist = join(dirname(fileURLToPath(import.meta.url)), 'dist');
  buildEmailDocx(dist)
    .then((p) => console.log(`  ok  email-templates.docx -> ${p}`))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
