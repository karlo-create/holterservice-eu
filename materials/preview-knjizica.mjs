/*
 * Per-page PNG preview of the patient booklet (VEY-633).
 *
 * Renders materials/src/knjizica.html in print emulation and screenshots each
 * `.page` section at 2x into materials/dist/knjizica-preview/pNN.png, so the
 * review evidence always comes from the same source the PDF is built from.
 *
 * Usage:  node materials/preview-knjizica.mjs
 */

import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, 'src', 'knjizica.html');
const OUT = join(__dirname, 'dist', 'knjizica-preview');

// A5 portrait at 96dpi, the geometry build.mjs prints the booklet at.
const A5 = { width: 559, height: 794 };

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: A5, deviceScaleFactor: 2 });
page.on('console', (m) => {
  if (m.type() === 'error') console.error('  console error:', m.text());
});

await page.goto(pathToFileURL(SRC).href, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
await page.evaluate(() => document.fonts.ready);

const sections = await page.locator('section.page').all();
for (const [i, section] of sections.entries()) {
  const name = `p${String(i + 1).padStart(2, '0')}.png`;
  await section.screenshot({ path: join(OUT, name) });
  console.log(`  ok  page ${i + 1} -> dist/knjizica-preview/${name}`);
}

await browser.close();
console.log(`Done. ${sections.length} pages written to materials/dist/knjizica-preview/`);
