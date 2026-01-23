import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/projects/websites/deejpotter', '/projects/engineering/wireless-car', '/contact'];

for (const p of pages) {
  test(`a11y: ${p}`, async ({ page, baseURL }) => {
    const targetUrl = baseURL ? new URL(p, baseURL).toString() : p;
    await page.goto(targetUrl);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    // Fail on any violation with impact 'critical' or 'serious'
    const violations = accessibilityScanResults.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(violations.length).toBe(0);
  });
}
