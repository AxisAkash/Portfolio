import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const output = process.env.QA_OUTPUT || '.qa';
const widths = [360, 768, 1280, 1440, 1920];
const themes = ['dark', 'light'];
const errors = [];
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
for (const theme of themes) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    await page.addInitScript((value) => localStorage.setItem('ak-theme', value), theme);
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`${theme}/${width}: ${message.text()}`); });
    page.on('pageerror', (error) => errors.push(`${theme}/${width}: ${error.message}`));
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${output}/${theme}-${width}-home.webp`, type: 'webp', quality: 65 });
    const homeScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (homeScroll) errors.push(`${theme}/${width}: horizontal overflow on home`);

    await page.locator('#skills').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.locator('[data-skill-id="express"]').click();
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${output}/${theme}-${width}-skills.webp`, type: 'webp', quality: 65 });
    const highlighted = await page.locator('[data-project-card="sofol"].skill-highlight').count();
    if (!highlighted) errors.push(`${theme}/${width}: skill highlight did not reach SOFOL`);

    await page.locator('[data-open-project="sofol"]').click();
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${output}/${theme}-${width}-dialog.webp`, type: 'webp', quality: 65 });
    const dialogOpen = await page.locator('dialog[open]').count();
    if (!dialogOpen) errors.push(`${theme}/${width}: dialog did not open`);
    await page.keyboard.press('Escape');
    await page.close();
  }
}
await browser.close();
console.log(`Captured ${themes.length * widths.length * 3} visual QA screenshots in ${output}`);
console.log(errors.length ? errors.join('\n') : 'No console, overflow, highlight, or dialog errors detected.');
