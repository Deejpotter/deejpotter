# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: results-display.spec.ts >> calculate cuts and render results (PoC)
- Location: e2e\results-display.spec.ts:9:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /Calculate Cuts/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /Calculate Cuts/i })

```

```yaml
- banner:
  - navigation "Primary":
    - button "Projects ▾"
    - link "Blog":
      - /url: /blog
    - link "About Me":
      - /url: /about
    - link "Contact Me":
      - /url: /contact
  - link "Deej Potter Logo Deej Potter":
    - /url: /
    - img "Deej Potter Logo"
    - text: Deej Potter
  - button "Switch to dark mode":
    - img
  - button "Shopping cart with 0 items":
    - img
- main:
  - heading "20 Series Cut Calculator" [level=1]
  - paragraph: Optimize aluminum extrusion cuts using the Best Fit Decreasing algorithm. Supports multiple stock lengths and accounts for blade kerf to minimize waste.
  - heading "Configuration" [level=2]
  - text: Kerf Width (mm) *
  - spinbutton "Kerf width in millimeters": "4"
  - paragraph: Blade thickness - accounts for material lost during each cut (typically 3-5mm)
  - heading "Available Stock" [level=5]
  - button "Add new stock item": Add Stock Length Add Stock Length
  - table:
    - rowgroup:
      - row "ID Length (mm) * Quantity Available * Actions":
        - columnheader "ID"
        - columnheader "Length (mm) *"
        - columnheader "Quantity Available *"
        - columnheader "Actions"
    - rowgroup:
      - row "#1 3050 10 Remove stock 1":
        - cell "#1":
          - strong: "#1"
        - cell "3050":
          - spinbutton "Length for stock 1": "3050"
        - cell "10":
          - spinbutton "Quantity for stock 1": "10"
        - cell "Remove stock 1":
          - button "Remove stock 1" [disabled]: Remove
  - text: "Total stock pieces: 10 | Total stock length available: 30,500mm"
  - heading "Cut Requirements" [level=5]
  - button "Add new cut requirement": Add Row ＋ Add Row
  - table:
    - rowgroup:
      - row "ID Length (mm) * Quantity * Actions":
        - columnheader "ID"
        - columnheader "Length (mm) *"
        - columnheader "Quantity *"
        - columnheader "Actions"
    - rowgroup:
      - row "#1 450 4 Remove requirement 1":
        - cell "#1":
          - strong: "#1"
        - cell "450":
          - spinbutton "Length for requirement 1": "450"
        - cell "4":
          - spinbutton "Quantity for requirement 1": "4"
        - cell "Remove requirement 1":
          - button "Remove requirement 1" [disabled]: ✖
  - text: "Total cuts: 4 | Total length needed: 1,800mm"
  - button "Calculate optimal cuts": Calculate Cuts
  - button "Reset calculator": Reset
  - heading "Feedback" [level=6]
  - paragraph: Got some feedback for me?
  - link "Let me know":
    - /url: /contact
  - heading "Connect with me" [level=6]
  - link "Facebook":
    - /url: https://www.facebook.com/deej.potter.7/
  - link "LinkedIn":
    - /url: https://www.linkedin.com/in/daniel-potter-5224a4119
  - heading "Policies" [level=6]
  - link "Privacy policy":
    - /url: /privacy
  - link "Terms and conditions":
    - /url: /terms
- alert
```

# Test source

```ts
  1  | // Playwright PoC: ResultsDisplay visual smoke test
  2  | // Purpose: Proof-of-concept E2E test that drives the 20-series cut calculator, waits
  3  | // for the results to render, and captures a screenshot for visual verification.
  4  | // Rationale: Keep the PoC small and deterministic: it verifies behavior and captures
  5  | // an artifact that can be used later as a visual baseline. Use Playwright for E2E + visual checks.
  6  | 
  7  | import { test, expect } from "@playwright/test";
  8  | 
  9  | test("calculate cuts and render results (PoC)", async ({ page }) => {
  10 |   await page.goto("/projects/tools/20-series-cut-calculator");
  11 | 
  12 |   // Ensure the page loaded and the Calculate button is available
  13 |   const calcBtn = page.getByRole("button", { name: /Calculate Cuts/i });
> 14 |   await expect(calcBtn).toBeVisible();
     |                         ^ Error: expect(locator).toBeVisible() failed
  15 | 
  16 |   // Click calculate and wait for the Results Summary section
  17 |   await calcBtn.click();
  18 | 
  19 |   const resultsSummary = page.locator('section:has-text("Results Summary")');
  20 |   await expect(resultsSummary).toBeVisible({ timeout: 5000 });
  21 | 
  22 |   // Capture a screenshot artifact for manual review / baseline creation
  23 |   await page.screenshot({
  24 |     path: "test-results/results-display-poc.png",
  25 |     fullPage: false,
  26 |   });
  27 | 
  28 |   // Quick sanity assertions on the results table
  29 |   await expect(resultsSummary.locator("text=Stock Pieces")).toBeVisible();
  30 | });
  31 | 
```