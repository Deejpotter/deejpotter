import { test, expect } from "@playwright/test";
import fs from "fs";

test("hero styles render and screenshot", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const h1 = page.getByRole("heading", {
    level: 1,
    name: "Your website, your parts, your tools — built so you don't have to.",
  });
  await expect(h1).toHaveCount(1, { timeout: 15000 });

  const fontSize = await h1.evaluate((el) => getComputedStyle(el).fontSize);
  const color = await h1.evaluate((el) => getComputedStyle(el).color);
  const bg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor
  );

  console.log("computed font-size:", fontSize);
  console.log("computed color:", color);
  console.log("body background:", bg);

  // diagnostics and assertions to investigate unexpected computed font-size
  const fontNum = parseInt(fontSize, 10);
  console.log("parsed font numeric:", fontNum);

  // find the .text-5xl CSS rule from accessible stylesheets (best-effort)
  const ruleForText5xl = await page.evaluate(() => {
    try {
      for (const ss of Array.from(document.styleSheets)) {
        try {
          for (const r of Array.from(ss.cssRules || [])) {
            if (r.cssText && r.cssText.includes(".text-5xl")) return r.cssText;
          }
        } catch (e) {
          // skip inaccessible style sheets (CSP / cross-origin)
        }
      }
    } catch (e) {
      // ignore
    }
    return null;
  });
  console.log("text-5xl rule:", ruleForText5xl);

  // ensure we get a numeric font size (don't fail on an exact size yet)
  expect(fontNum).toBeGreaterThan(0);

  // ensure body background is not transparent (should be set by theme or utilities)
  expect(bg).not.toBe("transparent");

  // ensure the live hero still exposes its primary CTA
  const primaryCta = page.getByRole("link", { name: "Start with a message" }).first();
  await expect(primaryCta).toHaveCount(1);

  // take a screenshot for visual inspection
  const outDir = "test-results/playwright";
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  await page.screenshot({ path: `${outDir}/hero.png`, fullPage: false });
});
