/*
 * HTML to PDF build pipeline for Holterservice Phase 1 promo materials (VEY-274).
 *
 * Renders each template in materials/src to a print-ready PDF in materials/dist
 * using the Chromium bundled with Playwright (already a repo dependency).
 *
 * Usage:  npm run materials      (from repo root)
 *     or  node materials/build.mjs
 */

import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';
import { buildEmailDocx } from './email-docx.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, 'src');
const DIST = join(__dirname, 'dist');

// One entry per output PDF. `source` is the template; `page` are Playwright
// page.pdf() options that set the print geometry.
const JOBS = [
  {
    source: 'pitch-deck.html',
    out: 'pitch-deck.pdf',
    page: { width: '1280px', height: '720px', printBackground: true },
  },
  {
    source: 'partner-1pager.html',
    out: 'partner-1pager.pdf',
    page: { format: 'A4', printBackground: true },
  },
  {
    source: 'how-it-works.html',
    out: 'how-it-works.pdf',
    page: { format: 'A4', printBackground: true },
  },
  {
    source: 'poster.html',
    out: 'poster-a4.pdf',
    page: { format: 'A4', printBackground: true },
  },
  {
    source: 'poster.html',
    out: 'poster-a3.pdf',
    page: { format: 'A3', printBackground: true },
  },
  {
    source: 'patient-leaflet.html',
    out: 'patient-leaflet.pdf',
    page: { format: 'A5', printBackground: true },
  },
  {
    source: 'knjizica.html',
    out: 'knjizica-za-pacijenta.pdf',
    page: { format: 'A5', printBackground: true },
  },
  {
    source: 'email-templates.html',
    out: 'email-templates.pdf',
    page: { format: 'A4', printBackground: true },
  },
];

async function main() {
  if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const job of JOBS) {
    const srcPath = join(SRC, job.source);
    if (!existsSync(srcPath)) {
      console.error(`  ! missing template: ${job.source}`);
      continue;
    }
    const url = pathToFileURL(srcPath).href;
    await page.goto(url, { waitUntil: 'networkidle' });
    // Ensure web fonts are fully loaded before snapshotting to PDF.
    await page.evaluate(() => document.fonts.ready);
    const outPath = join(DIST, job.out);
    await page.pdf({
      path: outPath,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      ...job.page,
    });
    console.log(`  ok  ${job.source} -> dist/${job.out}`);
  }

  await browser.close();

  // Editable Word version of the outreach emails (VEY-282).
  await buildEmailDocx(DIST);
  console.log('  ok  email-templates.html -> dist/email-templates.docx');

  console.log('Done. PDFs and DOCX written to materials/dist/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
