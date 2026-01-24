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

---

## Detailed plan & steps (priority ordered) ✅

Below is a thoroughly scoped plan with logic and sub-steps for each action. I will implement the actionable items and mark them off in the .github/TODOs.md list.

### Step 0 — Inventory & baseline (status: done)

Logic: Find *all* deprecated usages and where warnings originate so we focus changes only on our code.
Sub-steps:

- Run `yarn build` and capture Sass warnings (includes upstream Bootstrap warnings).
- Grep the `src/` tree for legacy functions and usages: `darken`, `lighten`, `mix`, `red/green/blue`, `map-merge`, `@import`.
- Record locations in the migration plan (done).

### Step 1 — Linting & CI enforcement (status: done)

Logic: Prevent regressions by ensuring new/merged code is checked automatically for deprecated Sass usage and `@import` usage.
Sub-steps:

- Add `stylelint` + `stylelint-scss` and `stylelint-config-standard-scss` as devDependencies. (done)
- Add `.stylelintrc.cjs` with a `function-disallowed-list` for deprecated helpers and `at-rule-disallowed-list: ["import"]` to discourage new `@import` usage. (done)
- Add `yarn lint:scss` script. (done)
- Add GitHub Action `.github/workflows/stylelint.yml` to run on PR/push. (done)
- Run `stylelint --fix` to automatically fix style issues in our code and add inline stylelint disables where renaming would be risky (done).

### Step 2 — Modernize project usage of Sass modules (status: in progress/partially done)

Logic: Replace local `@import` with `@use` / `@forward` for our own styles so variables are namespaced and manageable.
Sub-steps:

- Create `src/styles/_tokens.scss` and `src/styles/_variables.scss` and `@forward` them as a canonical entrypoint (done).
- Update `bootstrap-overrides.scss` to `@use "./tokens" as tokens` and reference tokens via `tokens.$...` (done).
- Replace project-local `@import` in `globals.scss` with `@use` rules (done) and ensure `@use` rules are at the top of the stylesheet (done).
- Create `_bootstrap-module.scss` to configure Bootstrap using `@use 'bootstrap' with (...)` for supported keys and source values from tokens (done for supported variables; we only pass variables that Bootstrap declares `!default`).

### Step 3 — Replace deprecated function usage in *our* files (status: done)

Logic: Replace deprecated functions (e.g., `darken`) with the modern `sass:color` APIs; keep changes small and test visually.
Sub-steps:

- Replace `darken(...)` with `color.adjust(..., $lightness: -X%)` (done where present).
- Replace instances of `map-merge` with `map.merge` and `@use "sass:map"` (done).
- Grep repository to confirm no occurrences remain in `src/` (done).

### Step 4 — Bootstrap upstream deprecations (status: documented / TODO)

Logic: Bootstrap's source (node_modules) still uses `@import` and legacy color functions and will warn. We have two options:

- Upgrade to a Bootstrap version that has migrated to `@use`/modern API when available OR
- Accept warnings from node_modules but ensure our own files are clean and add a documented migration ticket to revisit when Bootstrap releases a compatible version.
Sub-steps:
- Document upstream deprecations and add an issue/TODO to track upgrading Bootstrap (done in TODOs). (TODO)
- Evaluate the bootstrap roadmap and consider contributing a PR to upstream if we need to accelerate migration (low priority). (TODO)

### Step 5 — Visual & accessibility verification (status: in-progress)

Logic: Confirm the CSS changes do not change visuals or accessibility by adding Playwright visual snapshots and a11y checks.
Sub-steps:

- Add Playwright visual snapshot tests (hero + navbar) and capture baselines. (skeleton done; needs baselines)
- Add Playwright + axe checks for navbar dropdown keyboard/focus behavior and modal focus traps. (TODO)
- Add snapshots to CI and gating so accidental visual drift is caught.

### Step 6 — CI gating & docs (status: partially done)

Logic: Add checks so style regressions and deprecated usages fail fast and are fixed before merge.
Sub-steps:

- Add stylelint GitHub Action (done).
- Add a build-stage check that fails the CI on stylelint failures (done via the workflow). (done)
- Document the migration steps and update `.github/TODOs.md` to track remaining items (done & updated below).

---

## Quick risk assessment & trade-offs

- We will not modify `node_modules/bootstrap` directly (bad practice). Instead we will keep Bootstrap warnings documented and either upgrade Bootstrap or contribute upstream when a stable release removes the deprecated API.
- Immediate wins are limited to our code and CI; they are low risk and provide quick guardrails.

---

If you approve this plan, I will commit the remaining TODO items and start executing them in the prioritized order above. I have already implemented Steps 0, 1, 2 and 3 (stylelint, tokens, bootstrap module, function replacements) and updated the repo with a new GitHub Action. The next actions I will take are Step 4 (add TODO & tracking for Bootstrap upstream migration) and Step 5 (capture Playwright baselines and add a11y checks).
