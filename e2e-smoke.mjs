// End-to-end smoke test for Pangkalan in headless Chromium (Playwright).
// Runs against `vite preview` on http://localhost:4173/pangkalan-kiroween-2026/.
// Verifies: add driver -> queue position + next turn -> fare calc 12.5 km =
// Rp 32.500 -> start trip -> finish trip -> trip log + daily summary ->
// localStorage persistence after reload. Dev-only test, not shipped in build.
import { chromium } from 'playwright-core';

const CHROME_PATH = `${process.env.HOME}/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome`;
const BASE = 'http://localhost:4173/pangkalan-kiroween-2026/';

async function main() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  console.log('H1:', await page.textContent('h1'));

  // 1. Add a driver
  await page.fill('input[aria-label="Nama pengemudi baru"]', 'Budi');
  await page.click('button:has-text("Tambah")');
  await page.waitForSelector('.driver-name');
  console.log('Queue driver:', await page.textContent('.driver-name'));
  console.log('Next turn:', await page.textContent('.next-name'));

  // 2. Fare calculator: 12.5 km -> Rp 32.500
  await page.fill('#distance-input', '12.5');
  await page.waitForSelector('.fare-amount');
  const fare = await page.textContent('.fare-amount');
  console.log('Fare 12.5 km:', fare);
  if (!fare.includes('32.500')) throw new Error(`Fare wrong: ${fare}`);

  // 3. Start trip, then finish it
  await page.click('button:has-text("Mulai Trip")');
  await page.waitForSelector('input[aria-label="Tujuan trip"]');
  await page.fill('input[aria-label="Tujuan trip"]', 'Bandara');
  await page.fill('input[aria-label="Jarak trip"]', '12.5');
  await page.click('button:has-text("Selesai Trip")');
  await page.waitForSelector('.trip-item');
  console.log('Trip logged:', await page.textContent('.trip-item .trip-meta'));

  // 4. Daily summary
  const summary = await page.textContent('.summary-box');
  console.log('Summary:', summary.replace(/\s+/g, ' ').trim());
  if (!summary.includes('1') || !summary.includes('32.500')) {
    throw new Error(`Summary wrong: ${summary}`);
  }

  // 5. Persistence after reload: driver back in queue, trip still logged
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.driver-name');
  console.log('After reload — queue:', await page.textContent('.driver-name'));
  console.log('After reload — trips:', await page.locator('.trip-item').count());
  const stored = await page.evaluate(
    () => localStorage.getItem('pangkalan-state-v1'),
  );
  const parsed = JSON.parse(stored);
  console.log('localStorage drivers:', parsed.drivers.length, 'trips:', parsed.trips.length);
  if (parsed.drivers.length !== 1 || parsed.trips.length !== 1) {
    throw new Error('Persistence check failed');
  }

  console.log('Console errors:', errors.length ? errors : 'none');
  if (errors.length) throw new Error(`Console errors: ${errors.join(' | ')}`);
  await browser.close();
  console.log('SMOKE TEST PASSED');
}

main().catch((e) => {
  console.error('SMOKE TEST FAILED:', e);
  process.exit(1);
});
