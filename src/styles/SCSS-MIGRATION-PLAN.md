SCSS Migration Plan — Modernize to `@use` / `@forward`

Goal
- Replace deprecated `@import` and global functions with modern `@use` / `@forward` Sass modules and remove / update deprecated function usage (map-merge, darken, red/green/blue, deprecated if() syntax).
- Split large override files into smaller modules for maintainability and future Tailwind migration compatibility.

High-level steps
1. Audit & inventory
  - Find all uses of deprecated functions (`map-merge`, `darken`, `red`, `green`, `blue`, `if()` syntax, etc.).
  - List files that import bootstrap SCSS and custom overrides.

2. Quick fixes (low risk)
  - Replace `map-merge(...)` with `@use "sass:map"; map.merge(...)` (done: map-merge -> map.merge).
  - Add `@use "sass:map";` at top of override files that need it (done).

3. Modularization
  - Create `_variables.scss` with all variable overrides (colors, spacers, sizes, theme colors).
  - Create `_mixins.scss` and `_utilities.scss` for any custom mixins or utilities.
  - Create `_theme.scss` for color theme adjustments and `@forward` the parts.
  - Create a single `styles.scss` that `@use` the split modules and is imported by `globals.scss`.

4. Function replacements and correctness
  - Replace `darken($c, $n)` with `color.scale($c, $lightness: -<value>)` or `color.adjust` per guidance.
  - Replace `red($col)` / `green($col)` / `blue($col)` with `color.channel($col, "red", $space: rgb)` or adjust strategy.
  - Replace deprecated `if()` with modern CSS `if()` or keep as function `@use "sass:meta"` as needed.

5. Tests & snapshots
  - Add Playwright visual snapshots for the hero and navbar in default viewport and mobile.
  - Add Playwright+aXe accessibility checks for navbar dropdown behavior and focus/keyboard.

6. Rollout & CI
  - Add a `yarn` script `scss:migrate-check` to run a linters or scripts that detect deprecated functions (optional codemod)
  - Add CI job that runs scss linter / flagging and snapshots.

Subtasks and ordering (first pass)
- Create migration doc (this file) — done.
- Replace map-merge usages (done).
- Split `bootstrap-overrides.scss` into `_variables.scss` and `bootstrap-overrides.scss` that `@use` the variables (next step).
- Replace `darken` usage in our overrides (e.g., `globals.scss` uses `darken($primary, 10)`) — Todo.
- Add Playwright snapshot tests for hero/nav — Todo.

Notes
- Upgrading Bootstrap itself might reduce some deprecations but will not remove Sass deprecation warnings in the Bootstrap source; our priority is to remove deprecations in our own files so CI is clean and maintainable.
- The migration should be incremental: make safe small changes, run the build, and add tests to validate visuals and accessibility.

Acceptance criteria
- No uses of deprecated Sass functions remain in our codebase.
- Build logs no longer show deprecation warnings originating from our files (Bootstrap upstream warnings may remain until upstream is updated).
- Visual snapshots for critical pages (home hero + navbar) are present and pass.
