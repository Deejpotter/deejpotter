import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/projects/websites/deejpotter', '/projects/engineering/wireless-car', '/contact'];

for (const p of pages) {
  test(`a11y: ${p}`, async ({ page, baseURL }) => {
    await page.goto(baseURL + p);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    // Fail on any violation with impact 'critical' or 'serious'
    const violations = accessibilityScanResults.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(violations.length).toBe(0);
  });
}
