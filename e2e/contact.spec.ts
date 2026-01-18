import { test, expect } from '@playwright/test';

// This E2E test navigates to the contact page, intercepts the /__forms.html POST and returns 200, then asserts success UI.
test('contact form submits and shows success', async ({ page }) => {
  await page.route('**/__forms.html', route => {
    route.fulfill({ status: 200, body: 'ok' });
  });

  await page.goto('http://localhost:3000/contact');
  await page.fill('#message', 'Hello from E2E');
  await page.click('text=Submit form');

  await expect(page.locator('text=Form submitted successfully!')).toBeVisible();
});
