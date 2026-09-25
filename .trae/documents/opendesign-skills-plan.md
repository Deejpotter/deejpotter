# Plan: OpenDesign Design-System Skills

## Summary

Create 3 skills for working with OpenDesign DESIGN.md files, using the **canonical skill architecture** (`~/.agents/skills/` → junctions to consumer tools):
1. **opendesign-create** — Generate new design-system DESIGN.md files
2. **opendesign-update** — Modify existing design-system DESIGN.md files
3. **opendesign-apply** — Read and apply a design-system to build UI components

All skills target the **OpenDesign 9-section format**, and write directly to the OD data catalog at `C:\Users\Deej\AppData\Roaming\Open Design\namespaces\release-stable-win\data\design-systems\`.

---

## Current State Analysis

- **Open Design desktop app** installed at `C:\Users\Deej\AppData\Local\Programs\Open Design\`
- **OD data catalog** at `C:\Users\Deej\AppData\Roaming\Open Design\namespaces\release-stable-win\data\design-systems\`
- **151 official design-systems** bundled inside the app
- **2 user design-systems** already in catalog: `deejpotter` and `deejpotter-dev-styles-design-system`
- **Project path configured**: `C:/Users/Deej/repos/deejpotter`
- **Canonical skill location**: `~/.agents/skills/` with 66+ existing skills
- **Skill format**: Directory with `SKILL.md` (YAML frontmatter + markdown body)
- The project uses **Tailwind CSS v4** with design tokens in `src/styles/globals.css`

---

## Step 1: Create the `opendesign-create` skill

### 1.1 — Logic & Reasoning

The `create` skill is the most complex because it must handle multiple input sources (brand description, screenshot, existing codebase, or verbal brief) and produce a complete 9-section DESIGN.md. The extraction logic differs per source type, so the skill needs distinct sub-workflows for each.

### 1.2 — Sub-steps

#### 1.2.1 — Create skill directory and SKILL.md

- Create `~/.agents/skills/opendesign-create/`
- Write `SKILL.md` with frontmatter: `name: "opendesign-create"`, description covering create/generate/define triggers
- Create junctions to all consumer locations

#### 1.2.2 — Define the input-gathering workflow

The skill must first determine **what source** the user is providing. Three paths:

**Path A: From brand description / verbal brief**
1. Ask the user: "Describe the brand, product, or visual style you want"
2. Ask clarifying questions:
   - What is the product/brand name?
   - What is the target audience?
   - What mood/personality? (playful, professional, minimal, bold, etc.)
   - Any existing brand colors or fonts?
   - What kind of UI will this be used for? (landing page, dashboard, mobile app, etc.)
3. If user provides a brand name (e.g., "Stripe", "Linear"), search for the brand's actual visual identity online to get real color values and typography
4. If user provides a visual direction (e.g., "modern minimal", "brutalist", "warm editorial"), reference the 5 OD visual directions for palette guidance
5. Generate the complete 9-section DESIGN.md

**Path B: From screenshot or image**
1. User provides one or more screenshots of an existing app/site
2. Analyze the image visually:
   - **Colors**: Identify the dominant palette — primary accent, background, surface, text colors, success/danger states. Use hex color picker logic to extract approximate hex values from the visual
   - **Typography**: Identify font families (serif vs sans-serif, display vs body), approximate sizes (heading vs body ratio), weights (light/regular/bold), line spacing (tight/normal/relaxed)
   - **Spacing**: Estimate the spacing scale by comparing padding/margins relative to text size (e.g., if body is 16px and padding looks 2x that, spacing unit is ~32px)
   - **Layout**: Count columns, identify grid pattern, note max-width constraints, sidebar vs content split
   - **Components**: Identify button styles (filled/outlined/ghost, radius, padding), card styles (shadow, border, radius), input styles (border, focus state)
   - **Elevation**: Note shadow depth — flat (no shadow), subtle (light drop shadow), elevated (pronounced shadow)
   - **Motion**: If animated, note transition style (bouncy, smooth, instant)
3. Map extracted values to the 9-section DESIGN.md format

**Path C: From existing codebase**
1. Scan the project's source code for design tokens:
   - **Tailwind config**: Read `tailwind.config.js` / `tailwind.config.cjs` for `theme.extend.colors`, `theme.extend.fontFamily`, `theme.extend.spacing`, `theme.extend.borderRadius`
   - **CSS variables**: Read `globals.css` / `:root` / `@theme` blocks for `--color-*`, `--font-*`, `--spacing-*`, `--radius-*`
   - **SCSS variables**: Read `_variables.scss` / `_colors.scss` for `$primary`, `$font-family-*`, etc.
   - **Design token files**: Look for `tokens.json`, `tokens.yaml`, `theme.json`, `design-tokens/`
2. Scan component files for styling patterns:
   - Read 3-5 representative components (Button, Card, Input, Layout, Header)
   - Extract: border-radius values, shadow values, padding patterns, color usage patterns
   - Note component variants (primary/secondary/ghost buttons, etc.)
3. Scan for typography usage:
   - Read CSS for `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing` declarations
   - Identify the type scale (list all font-size values used)
4. Scan for layout patterns:
   - Read grid/flex usage in layout components
   - Note max-width values, breakpoint definitions, column counts
5. Synthesize all extracted values into the 9-section DESIGN.md

#### 1.2.3 — Define the 9-section generation workflow

For each section, provide the agent with specific guidance on what to write:

**Section 1: Visual Theme & Atmosphere**
- Open with the category tag: `> Category: <category>`
- One-line summary of the visual identity
- Bullet list: visual style, color stance, design intent

**Section 2: Color**
- List every color with: `**Name:** \`#HEX\` — Purpose description.`
- Minimum required: Primary, Secondary, Surface/Background, Text
- Recommended additions: Success, Warning, Danger, Neutral
- Usage notes: which color for CTA, backgrounds, body copy

**Section 3: Typography**
- Scale: list all size values (e.g., `14/16/18/24/32/40`)
- Families: primary, display, mono
- Weights: list available weights
- Usage notes: heading vs body vs label behavior

**Section 4: Spacing & Grid**
- Baseline grid unit (e.g., 8pt)
- Rhythm and alignment rules

**Section 5: Layout & Composition**
- Content block patterns
- Hierarchy rules (headline → support → action)
- Whitespace philosophy

**Section 6: Components**
- Buttons: primary/secondary color mapping
- Inputs: focus states, labels, errors
- Cards: radii, spacing, elevation

**Section 7: Motion & Interaction**
- Transition durations (e.g., 150–250ms)
- Easing type
- Required states: hover, focus-visible, active, disabled, loading

**Section 8: Voice & Brand**
- Tone description
- Microcopy rules (action-oriented, no filler)
- Headline vs UI label behavior

**Section 9: Anti-patterns**
- Kill list of forbidden patterns (4-6 items)
- Must reference actual tokens from earlier sections

#### 1.2.4 — Define quality checklist

Before saving, validate:
- All color values are valid hex codes
- Typography scale is progressive (sizes increase)
- Anti-patterns reference specific tokens, not vague rules
- Each section has at least 2-3 lines of content
- No section contradicts another (e.g., anti-pattern doesn't forbid something the Components section requires)

#### 1.2.5 — Define the save workflow

1. Create directory: `C:\Users\Deej\AppData\Roaming\Open Design\namespaces\release-stable-win\data\design-systems\<name>\`
2. Write the DESIGN.md file
3. Report to user: design-system created, path, how to see it in OD gallery

---

## Step 2: Create the `opendesign-update` skill

### 2.1 — Logic & Reasoning

The `update` skill must read an existing DESIGN.md, understand its current state, apply targeted changes, and ensure cross-section consistency. The key challenge is that changing one section (e.g., colors) may require cascading updates to other sections (Components, Anti-patterns).

### 2.2 — Sub-steps

#### 2.2.1 — Create skill directory and SKILL.md

- Create `~/.agents/skills/opendesign-update/`
- Write `SKILL.md` with frontmatter: `name: "opendesign-update"`, description covering update/modify/edit/refine triggers
- Create junctions to all consumer locations

#### 2.2.2 — Define the read-and-understand workflow

1. List all design-systems in the OD catalog: `C:\Users\Deej\AppData\Roaming\Open Design\namespaces\release-stable-win\data\design-systems\`
2. If user specifies a name, read that DESIGN.md; otherwise, ask which one
3. Parse the 9 sections and summarize the current state to the user

#### 2.2.3 — Define the targeted-edit workflows

**Color changes:**
1. Update Section 2 (Color) with new hex values
2. Check Section 6 (Components) — update any hardcoded color references
3. Check Section 9 (Anti-patterns) — update any color-specific rules
4. Check Section 7 (Motion) — update any color-specific transition references

**Typography changes:**
1. Update Section 3 (Typography) with new font families, sizes, weights
2. Check Section 5 (Layout) — update any text-related layout rules
3. Check Section 6 (Components) — update component text styling
4. Check Section 8 (Voice) — ensure tone still matches new type personality

**Spacing/Layout changes:**
1. Update Section 4 (Spacing & Grid) with new values
2. Check Section 5 (Layout) — update grid/column rules
3. Check Section 6 (Components) — update component padding/margin patterns

**Component changes:**
1. Update Section 6 (Components) with new recipes
2. Check Section 2 (Color) — ensure referenced colors exist
3. Check Section 7 (Motion) — ensure component states are covered

**Anti-pattern changes:**
1. Update Section 9 (Anti-patterns)
2. Verify no anti-pattern contradicts an active rule in Sections 2-8

#### 2.2.4 — Define consistency validation

After all edits, run a consistency check:
- Every color referenced in Sections 6-9 must exist in Section 2
- Every font referenced in Sections 5-8 must exist in Section 3
- Every spacing value referenced must exist in Section 4
- No anti-pattern forbids a pattern that Sections 2-8 actively recommend

#### 2.2.5 — Define the save-and-report workflow

1. Write updated DESIGN.md to the OD catalog path
2. Show user a diff summary: what sections changed, what values were updated
3. Note any cascading changes that were made for consistency

---

## Step 3: Create the `opendesign-apply` skill

### 3.1 — Logic & Reasoning

The `apply` skill teaches agents to read a DESIGN.md as a constraint document and use it when building UI. Unlike create/update, this skill doesn't modify the DESIGN.md — it reads it and applies its rules to code generation. The key is mapping the prose-based rules to concrete implementation decisions.

### 3.2 — Sub-steps

#### 3.2.1 — Create skill directory and SKILL.md

- Create `~/.agents/skills/opendesign-apply/`
- Write `SKILL.md` with frontmatter: `name: "opendesign-apply"`, description covering apply/use/implement/follow triggers
- Create junctions to all consumer locations

#### 3.2.2 — Define the locate-and-read workflow

1. List available design-systems: `C:\Users\Deej\AppData\Roaming\Open Design\namespaces\release-stable-win\data\design-systems\*\DESIGN.md`
2. Present list to user, or use specified name
3. Read the full DESIGN.md
4. Extract and index all tokens:
   - Color map: `{ name → hex }`
   - Typography map: `{ name → { fontFamily, fontSize, fontWeight, ... } }`
   - Spacing scale: `{ name → value }`
   - Component recipes: `{ name → { properties } }`
   - Anti-patterns list: `[ "forbidden pattern 1", ... ]`

#### 3.2.3 — Define the apply-to-Tailwind workflow

For Tailwind CSS v4 projects:
1. Map DESIGN.md colors → `@theme { --color-*: ... }` CSS custom properties
2. Map DESIGN.md typography → `@theme { --font-family-*, --font-size-*, --font-weight-* }`
3. Map DESIGN.md spacing → `@theme { --spacing-* }`
4. Map DESIGN.md rounded → `@theme { --radius-* }`
5. Generate the `@theme` block in `globals.css` or a new theme file

#### 3.2.4 — Define the apply-to-components workflow

When generating any UI component:
1. **Before writing any code**, read the active DESIGN.md
2. **Color decisions**: Use only colors from the Color section. Never introduce off-palette colors.
3. **Typography decisions**: Use only font families and sizes from the Typography section. Match heading/body/label roles.
4. **Spacing decisions**: Use the Spacing & Grid scale. Align to the baseline grid.
5. **Component decisions**: Follow the Components section recipes. Use specified border-radius, padding, colors for each component type.
6. **Motion decisions**: Use the Motion & Interaction section's durations and easing.
7. **Copy decisions**: Follow Voice & Brand rules for all text content.
8. **Anti-pattern check**: Before finalizing, verify nothing violates the Anti-patterns kill list.

#### 3.2.5 — Define the output validation checklist

After generating UI:
- All colors are from the DESIGN.md palette ✓
- All typography matches the type scale ✓
- Spacing follows the grid ✓
- Component styles match recipes ✓
- No anti-patterns violated ✓
- Voice/tone matches brand guidelines ✓

---

## Step 4: Create the `agentic` reference design-system

### 4.1 — Logic & Reasoning

Having a reference design-system in the OD catalog serves two purposes: it validates that the skills can write to the correct path, and it gives the user a working example to learn from.

### 4.2 — Sub-steps

#### 4.2.1 — Create the directory

Create `C:\Users\Deej\AppData\Roaming\Open Design\namespaces\release-stable-win\data\design-systems\agentic\`

#### 4.2.2 — Write the DESIGN.md

Write the Agentic design system (from the user's original example) to `DESIGN.md` in that directory, following the 9-section format exactly.

#### 4.2.3 — Verify it appears in OD gallery

Confirm the design-system shows up in the Open Design desktop app's design-system picker.

---

## Assumptions & Decisions

1. **Format**: OpenDesign's 9-section format (Visual Theme, Color, Typography, Spacing & Grid, Layout & Composition, Components, Motion & Interaction, Voice & Brand, Anti-patterns)
2. **OD catalog path (this PC)**: `C:\Users\Deej\AppData\Roaming\Open Design\namespaces\release-stable-win\data\design-systems\<name>\DESIGN.md`
3. **OD catalog structure**: Each design-system is a subdirectory with at minimum `DESIGN.md`
4. **Skill creation**: Via skill-creator workflow — canonical `~/.agents/skills/` + junctions
5. **Three input modes for create**: brand description, screenshot/image, codebase analysis
6. **Screenshot extraction**: Visual analysis of colors (hex extraction), typography (family/size/weight identification), spacing (relative measurement), layout (column/grid identification), components (style recipe extraction)
7. **Codebase extraction**: Parse Tailwind config, CSS variables, SCSS variables, component files for token values and patterns

---

## Verification Steps

1. Verify each skill directory exists at `~/.agents/skills/opendesign-{create,update,apply}/`
2. Verify junctions exist at consumer locations
3. Verify each SKILL.md has valid YAML frontmatter
4. Verify each SKILL.md body covers its full workflow (input gathering, processing, output)
5. Verify `agentic/DESIGN.md` exists in OD catalog and follows 9-section format
6. Verify the agentic design-system appears in OD desktop gallery
7. Test each skill by invoking it conceptually
