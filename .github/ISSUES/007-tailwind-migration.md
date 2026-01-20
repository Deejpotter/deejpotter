Title: Tailwind migration (phased)

Description:
Migrate styles from Bootstrap/SCSS to Tailwind CSS incrementally to improve performance, DX, and maintainability.

Phases:
1. Setup (this PR)
   - Install Tailwind, PostCSS, Autoprefixer, and recommended plugins (forms, typography).
   - Add `tailwind.config.cjs`, `postcss.config.cjs`, and `src/styles/globals.css` with Tailwind directives.
   - Import `src/styles/globals.css` in `src/app/layout.tsx` and remove or phase out `src/app/globals.scss` import.
   - Add a small smoke test converting `Navbar` or `GradientHeroSection` to Tailwind to verify visual parity.

2. Component conversion (multiple PRs)
   - Convert layout, Navbar, Footer, hero, tiles, Modal, Popover, and other shared components.
   - Replace Bootstrap JS-dependent interactions with simple React patterns or Headless UI components when needed.
   - Add Playwright visual snapshots to ensure parity.

3. Cleanup
   - Remove Bootstrap and SCSS overrides once components are migrated and visual parity is verified.
   - Update docs and README with Tailwind workflows and lint rules.

Owner: @dev
Priority: High

Acceptance criteria:
- Tailwind base CSS is active and dev server runs without SCSS import errors.
- At least one shared component (Navbar or Hero) is converted and visually consistent.
- CI build passes and E2E smoke tests run successfully.
