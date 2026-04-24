#!/usr/bin/env node
// Generate public/cv-{en,es}.pdf by pointing Puppeteer at the /cv/print/[lang]
// route. Expects a Next server already running (dev or prod).
//
// Usage:
//   # using default dev server on port 3456
//   npm run generate-pdfs
//
//   # against a different port / host
//   BASE_URL=http://localhost:3000 node scripts/generate-pdfs.mjs

import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3456';
const OUT_DIR = path.join(process.cwd(), 'public');
const LANGS = ['en', 'es'];

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  // Fail fast with a friendlier message if the server is down.
  try {
    const res = await fetch(`${BASE_URL}/cv/print/en`, { method: 'HEAD' });
    if (!res.ok) throw new Error(`HEAD ${res.status}`);
  } catch (err) {
    console.error(`\n[generate-pdfs] Cannot reach ${BASE_URL}.`);
    console.error(`  Start the dev server first:  npx next dev -p 3456`);
    console.error(`  Or pass a different URL:     BASE_URL=http://localhost:3000 npm run generate-pdfs\n`);
    console.error(`  Underlying error: ${err?.message || err}`);
    process.exit(1);
  }

  console.log(`[generate-pdfs] Launching headless browser…`);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const lang of LANGS) {
      const url = `${BASE_URL}/cv/print/${lang}`;
      const outPath = path.join(OUT_DIR, `cv-${lang}.pdf`);

      console.log(`[generate-pdfs] ${lang.toUpperCase()}  ${url}`);
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60_000 });

      // Make sure web fonts finished loading before PDF snapshot.
      await page.evaluate(() => document.fonts?.ready);

      await page.pdf({
        path: outPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true, // let the @page rule in print.css drive the size/margin
        displayHeaderFooter: false,
      });

      const stat = await fs.stat(outPath);
      console.log(`[generate-pdfs]   → ${path.relative(process.cwd(), outPath)}  (${(stat.size / 1024).toFixed(1)} KB)`);
      await page.close();
    }
  } finally {
    await browser.close();
  }

  console.log(`\n[generate-pdfs] Done.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
