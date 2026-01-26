# Documentation Update Plan - 2026-01-26

## Current Project State Changes to Document

### 1. Testing Framework Change
- **REMOVED**: Vitest (all packages uninstalled)
- **CURRENT**: Storybook as primary UI testing platform
- Files affected: README.md, ARCHITECTURE.md, copilot-instructions.md, TESTING.md

### 2. Navigation Structure Update
- **REMOVED**: "Apps" category from Projects dropdown
- **CURRENT**: 4 categories: Websites, Engineering, Games, Tools
- **CLARIFICATION**: Tools = single-page web utilities on deejpotter.com
- Files affected: README.md, ARCHITECTURE.md

### 3. Styling System - Tailwind CSS v4
- **CURRENT**: Tailwind CSS v4 (CSS-based config, not JS)
- **CONFIG LOCATION**: src/styles/globals.css (@theme block)
- **CUSTOM GRADIENTS**: 6 gradient utilities in @layer components
- Files affected: README.md, ARCHITECTURE.md, GRADIENT-GUIDE.md

### 4. Dropdown Menu Implementation
- **ARCHITECTURE**: Parent div hover zone with timeout system
- **PATTERN**: Event handlers on wrapper, dropdown at body level
- **STYLING**: navbar-dropdown-gradient with backdrop-filter blur
- Files affected: ARCHITECTURE.md, copilot-instructions.md

### 5. Full-Width Section Layout
- **PATTERN**: Sections stretch full-width, content constrained inside
- **IMPLEMENTATION**: Each section has px padding + max-w-7xl container
- **MAIN ELEMENT**: No width constraints (w-full only)
- Files affected: ARCHITECTURE.md

## Detailed Plan

### Step 1: Update README.md
**Logic**: Primary entry point for developers - must reflect current tech stack and testing approach

**Sub-steps**:
1.1. Update Technologies section - remove Vitest, add Storybook
1.2. Update Testing section - describe Storybook-first approach
1.3. Update Navigation structure description
1.4. Update Tailwind CSS version to v4 with CSS-based config
1.5. Remove any references to old frameworks/tools
1.6. Add quick start commands that work with current setup

### Step 2: Update ARCHITECTURE.md
**Logic**: Technical reference doc - needs accurate component patterns and file structure

**Sub-steps**:
2.1. Update Testing section - remove Vitest, document Storybook
2.2. Document navbar dropdown pattern (hover zone + timeout)
2.3. Document full-width section layout pattern
2.4. Update Tailwind CSS v4 configuration location
2.5. Document NavbarContext structure (4 categories, no Apps)
2.6. Update component patterns section

### Step 3: Update .github/copilot-instructions.md
**Logic**: AI agent reference - must have accurate workflows and patterns

**Sub-steps**:
3.1. Remove Vitest test commands
3.2. Add Storybook testing workflow
3.3. Update architecture patterns (dropdown, full-width sections)
3.4. Update Tailwind CSS configuration approach
3.5. Document navigation structure conventions
3.6. Update "must-know commands" section

### Step 4: Update docs/TESTING.md
**Logic**: Testing strategy doc - needs complete rewrite for Storybook-first

**Sub-steps**:
4.1. Remove all Vitest references
4.2. Document Storybook as primary testing platform
4.3. Add Playwright for E2E (if used)
4.4. Update test running commands
4.5. Document testing best practices for stories
4.6. Add note about Vitest removal date

### Step 5: Update GRADIENT-GUIDE.md
**Logic**: Usage guide for gradients - needs current implementation details

**Sub-steps**:
5.1. Update configuration location (globals.css @layer components)
5.2. Add navbar-dropdown-gradient documentation
5.3. Update usage examples
5.4. Document dark mode gradient variants

### Step 6: Clean up obsolete documentation files
**Logic**: Remove outdated migration plans and implementation notes

**Sub-steps**:
6.1. Archive or remove TAILWIND-MIGRATION-PLAN.md (completed)
6.2. Archive IMPLEMENTATION-COMPLETE.md (outdated)
6.3. Review and consolidate NextjsRefactor.md if needed

### Step 7: Update package.json scripts documentation
**Logic**: Ensure documented commands match current package.json

**Sub-steps**:
7.1. Verify dev, build, lint commands
7.2. Remove test script references (Vitest removed)
7.3. Add storybook commands if present
7.4. Document docs generation command

## Implementation Order

1. ✅ Record plan in TODOs.md
2. 🔄 Implement Step 1 (README.md)
3. 🔄 Implement Step 2 (ARCHITECTURE.md)
4. 🔄 Implement Step 3 (copilot-instructions.md)
5. 🔄 Implement Step 4 (TESTING.md)
6. 🔄 Implement Step 5 (GRADIENT-GUIDE.md)
7. 🔄 Implement Step 6 (Clean obsolete docs)
8. 🔄 Implement Step 7 (Verify package.json commands)

---

## Key Documentation Principles

1. **Show current state only** - don't mention old ways
2. **Accurate commands** - verify all commands work
3. **Pattern documentation** - explain the "why" not just "what"
4. **Consistent terminology** - use same terms across all docs
5. **Examples included** - provide code snippets where helpful

## Files to Update

- [x] TODOs.md (this file)
- [ ] README.md
- [ ] ARCHITECTURE.md  
- [ ] .github/copilot-instructions.md
- [ ] docs/TESTING.md
- [ ] GRADIENT-GUIDE.md
- [ ] Clean obsolete files

---

*Plan created: 2026-01-26 17:11*
*Status: Ready for implementation*
