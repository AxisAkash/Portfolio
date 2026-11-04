import { chromium } from 'playwright';

const targets = [
  { slug: 'car-rent-management', url: 'https://car-rental-system.fwh.is' },
  { slug: 'ai-calculator', url: 'https://axisakash.github.io/Ai_Calculator/' },
];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
const warningPattern = /just a moment|checking your browser|access denied|forbidden|suspended|account has been|free hosting|site is down|error 5\d\d/i;

const browser = await chromium.launch({ headless: true });
for (const target of targets) {
  const page = await browser.newPage();
  page.on('console', (message) => console.log(`[${target.slug}] console ${message.type()}: ${message.text()}`));
  try {
    const response = await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);
    const bodyText = await page.locator('body').innerText().catch(() => '');
    const title = await page.title();
    const blocked = !response || response.status() >= 400 || warningPattern.test(`${title}\n${bodyText.slice(0, 5000)}`);
    console.log(`${target.slug}: status=${response?.status() ?? 'no response'} title=${JSON.stringify(title)} blocked=${blocked}`);
    if (blocked) continue;
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);
      const path = `assets/projects/${target.slug}/${viewport.name}.webp`;
      await page.screenshot({ path, type: 'webp', quality: 68 });
      console.log(`saved ${path}`);
    }
  } catch (error) {
    console.log(`${target.slug}: failed=${error.message}`);
  } finally {
    await page.close();
  }
}
await browser.close();
