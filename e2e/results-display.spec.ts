// Playwright PoC: ResultsDisplay visual smoke test
// Purpose: Proof-of-concept E2E test that drives the 20-series cut calculator, waits
// for the results to render, and captures a screenshot for visual verification.
// Rationale: Keep the PoC small and deterministic: it verifies behavior and captures
// an artifact that can be used later as a visual baseline. Use Playwright for E2E + visual checks.

import { test, expect } from '@playwright/test';

test('calculate cuts and render results (PoC)', async ({ page }) => {
  await page.goto('/projects/tools/20-series-cut-calculator');

  // Ensure the page loaded and the Calculate button is available
  const calcBtn = page.getByRole('button', { name: /Calculate Cuts/i });
  await expect(calcBtn).toBeVisible();

  // Click calculate and wait for the Results Summary section
  await calcBtn.click();

  const resultsSummary = page.locator('section:has-text("Results Summary")');
  await expect(resultsSummary).toBeVisible({ timeout: 5000 });

  // Capture a screenshot artifact for manual review / baseline creation
  await page.screenshot({ path: 'test-results/results-display-poc.png', fullPage: false });

  // Quick sanity assertions on the results table
  await expect(resultsSummary.locator('text=Stock Pieces')).toBeVisible();
});