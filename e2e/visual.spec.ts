import { test, expect } from "@playwright/test";

// Visual snapshot tests for critical UI: hero & navbar.
// We disable animations/transitions to make snapshots deterministic.

test.beforeEach(async ({ page }) => {
  await page.addStyleTag({
    content: `* { animation: none !important; transition: none !important; }`,
  });
});

test("Hero matches baseline", async ({ page }) => {
  await page.goto('/test/hero');
  const hero = page.locator("section.bg-gradient-to-b");
  await expect(hero).toBeVisible();
  await expect(hero).toHaveScreenshot("hero.png", { animations: "disabled" });
});

test("Navbar matches baseline", async ({ page }) => {
  await page.goto("/");
  const navbar = page.locator("header");
  await expect(navbar).toBeVisible();
  await expect(navbar).toHaveScreenshot("navbar.png", {
    animations: "disabled",
  });
});
