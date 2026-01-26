# Tailwind Migration Plan — Convert visual overrides to Tailwind

Goal

- Replace custom SCSS-based visual overrides (navbar, gradient hero, dropdown gradients, popovers, scrollbars) with Tailwind utilities or small, well-scoped CSS where Tailwind doesn't cover it.
- Keep visual parity; add Playwright visual baseline snapshots for hero + navbar and add a CI check.

High-level steps

1. Audit visuals (what makes the designs special)

- Inventory exact styles: colors, gradients, shadows, radii, font sizes, spacing, and interactive states.
- Identify components relying on custom SCSS.

2. Tailwind setup check & augment

- Ensure `tailwind.config.cjs` contains the project's tokens (colors, spacing, box-shadow, fonts). (done)
- Add custom utilities (if necessary) for gradient combinations used in `GradientHeroSection` and dropdowns.

3. Component migration (iterative)

- Convert `GradientHeroSection` to accept `from`/`to` color keys and apply `bg-gradient-to-b from-<color> to-<color>`.
- Replace custom dropdown gradient CSS in `TopNavbar` with `bg-gradient-to-b` classes; test hover/focus states.
- Convert any custom popover styles to Tailwind utilities; add small scoped CSS only if necessary.

4. Visual & accessibility verification

- Capture Playwright visual snapshots for pages using the hero and navbar, and add Axe-based accessibility checks for navbar interactions.
- Add tests to CI to ensure baselines are validated.

5. Cleanup

- Remove now-unused SCSS files (custom-gradients.scss, bootstrap-overrides parts that are purely visual) in a follow-up PR after visual tests pass.

Acceptance criteria

- Visual parity verified by Playwright snapshots (or approved diffs).
- No project-local SCSS remains for the components migrated.
- CI enforces style (stylelint) and visual snapshot checks.

---

I'll now add concrete sub-steps and a TODO list to `.github/TODOs.md` and then implement the first migration tasks: (A) update `GradientHeroSection` to use Tailwind gradients and (B) update `TopNavbar` dropdown gradient to use Tailwind utilities. After that I'll run `yarn build` and update visual tests for baselines.
