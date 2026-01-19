Title: Accessibility audit & fixes (axe + Playwright)

Description:
Run an automated accessibility audit across key pages (home, projects, blog post, contact) and fix the highest-impact violations. This includes:

- Add Playwright-based accessibility tests that inject `axe-core` and fail on high/critical violations.
- Fix modal accessibility: ensure background content is aria-hidden when modal is open, focus trapping confirmed, ESC closes modal.
- Fix popover accessibility: `aria-expanded` on trigger, correct role and focus management.
- Add a11y checks to CI as a separate job (non-blocking initially or as gate per decision).

Owner: @dev
Priority: High

Acceptance criteria:
- Playwright a11y test exists and runs in CI (or as part of e2e job).
- Top 5 accessibility violations are fixed and documented in the PR description.
- Accessibility improvements are covered by unit or E2E tests.
