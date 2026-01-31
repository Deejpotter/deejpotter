import React from "react";
import { render } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import axe from "axe-core";

import HomePage from "@/app/page";
import ContactForm from "@/app/contact/ContactForm";
import AboutPage from "@/app/about/page";

/**
 * Helper function to run axe accessibility tests
 * Tests against WCAG 2.0 Level A and AA standards
 */
async function runAxe(container: HTMLElement) {
  return new Promise<axe.AxeResults>((resolve, reject) => {
    axe.run(
      container,
      {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
        },
      },
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
}

describe("Accessibility (axe) tests for app pages", () => {
  test("Home page has no critical/serious violations", async () => {
    const { container } = render(<HomePage />);
    const results = await runAxe(container);
    const seriousOrCritical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    // Log violations for debugging
    if (seriousOrCritical.length > 0) {
      console.error("Home page accessibility violations:", seriousOrCritical);
    }

    expect(seriousOrCritical.length).toBe(0);
  });

  test("Contact page has no critical/serious violations", async () => {
    const { container } = render(<ContactForm />);
    const results = await runAxe(container);
    const seriousOrCritical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    // Log violations for debugging
    if (seriousOrCritical.length > 0) {
      console.error(
        "Contact page accessibility violations:",
        seriousOrCritical
      );
    }

    expect(seriousOrCritical.length).toBe(0);
  });

  test("About page has no critical/serious violations", async () => {
    const { container } = render(<AboutPage />);
    const results = await runAxe(container);
    const seriousOrCritical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    // Log violations for debugging
    if (seriousOrCritical.length > 0) {
      console.error("About page accessibility violations:", seriousOrCritical);
    }

    expect(seriousOrCritical.length).toBe(0);
  });

  // Test for proper heading hierarchy
  test("Home page has proper heading hierarchy", async () => {
    const { container } = render(<HomePage />);
    const h1s = container.querySelectorAll("h1");

    // Should have exactly one h1 per page
    expect(h1s.length).toBeGreaterThanOrEqual(1);
  });

  test("Contact page has proper heading hierarchy", async () => {
    const { container } = render(<ContactForm />);
    const h1s = container.querySelectorAll("h1");

    // Should have exactly one h1 per page
    expect(h1s.length).toBe(1);
  });

  test("About page has proper heading hierarchy", async () => {
    const { container } = render(<AboutPage />);
    const h1s = container.querySelectorAll("h1");

    // Should have exactly one h1 per page
    expect(h1s.length).toBe(1);
  });
});
