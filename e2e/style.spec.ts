import { test, expect } from '@playwright/test';

test.describe('Visual regression: basic components', () => {
  test('Navbar should match baseline', async ({ page }) => {
    await page.goto('http://localhost:3000');
    // wait for navbar to render
    const navbar = page.locator('nav.navbar');
    await expect(navbar).toBeVisible();
    await expect(navbar).toHaveScreenshot('navbar.png', { fullPage: false });
  });

  test('Contact form should render consistently', async ({ page }) => {
    await page.goto('http://localhost:3000/contact');
    const form = page.locator('form');
    await expect(form).toBeVisible();
    await expect(form).toHaveScreenshot('contact-form.png', { fullPage: false });
  });
});