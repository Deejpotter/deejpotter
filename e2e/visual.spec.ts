import { test, expect } from "@playwright/test";

test.describe("Visual snapshots", () => {
  test("Home hero and navbar snapshot", async ({ page }) => {
    await page.goto("/");
    // Wait for hero title to be visible
    await page.waitForSelector(
      "h1, h2, .hero, .gradient-hero, .hero-title, [data-hero]"
    );
    // capture navbar area
    const nav = await page.locator("nav.navbar");
    await expect(nav).toHaveScreenshot("navbar.png", {
      animations: "disabled",
    });

    // capture hero area (center region)
    const hero = await page.locator(
      "section[data-hero], .hero, .gradient-hero"
    );
    if (await hero.count()) {
      await expect(hero.first()).toHaveScreenshot("home-hero.png", {
        animations: "disabled",
      });
    } else {
      // Fallback: grab top fold screenshot
      await expect(page).toHaveScreenshot("home-topfold.png", {
        fullPage: false,
        animations: "disabled",
      });
    }
  });
});
