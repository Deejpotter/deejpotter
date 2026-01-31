# Deejpotter Project Architecture

## Overview
Next.js 16 portfolio website using App Router with React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack

### Core Framework
- **Next.js 16.1.3** - React framework with App Router for SSR/SSG
- **React 19.3.0-canary** - UI library with latest features
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Tailwind CSS 4.1.18** - Utility-first CSS with CSS-based configuration

### Backend & Data
- **MongoDB Atlas** - Cloud database
- **Next.js API Routes** (Route Handlers) - Serverless API endpoints
- **Clerk** - Authentication and user management

### Development Tools
- **Storybook 10.3.0** - Component development and UI testing
- **Playwright 1.57.0** - End-to-end testing
- **ESLint** - Code quality and formatting
- **TypeDoc** - API documentation generation
- **Yarn** - Package manager with Corepack

## Project Structure

```
deejpotter/
├── .github/              # GitHub Actions, agents, instructions
│   ├── workflows/        # CI/CD pipelines
│   ├── agents/          # AI agent configurations
│   ├── instructions/    # Developer guidelines
│   └── TODOs.md         # Project task tracker
├── .storybook/          # Storybook configuration
├── docs/                # Documentation (TESTING.md)
├── e2e/                 # Playwright E2E tests
├── public/              # Static assets
│   ├── docs/           # TypeDoc generated API docs
│   ├── images/         # Images and graphics
│   └── basicBases/     # Unity WebGL game builds
└── src/
    ├── app/            # Next.js App Router
    │   ├── api/        # API Route Handlers
    │   ├── layout.tsx  # Root layout with providers
    │   ├── page.tsx    # Homepage
    │   ├── metadata.ts # SEO metadata helpers
    │   └── */          # Route segments (about, contact, projects, blog)
    ├── components/     # React components
    │   ├── home/       # Homepage sections
    │   ├── TopNavbar/  # Navigation component
    │   ├── MainFooter/ # Footer component
    │   └── */          # Other components
    ├── contexts/       # React Context providers
    │   ├── AuthProvider.tsx    # Clerk auth wrapper
    │   └── NavbarContext.tsx   # Navigation state
    ├── lib/            # Utility functions
    ├── styles/         # Global CSS
    │   └── globals.css # Tailwind v4 config + custom styles
    ├── types/          # TypeScript type definitions
    └── stories/        # Storybook stories
```

## Tailwind CSS v4 Configuration

### CSS-Based Config (Not JavaScript)
Tailwind v4 uses a CSS-based configuration system instead of `tailwind.config.js`:

**Location**: `src/styles/globals.css`

**Structure**:
```css
@import "tailwindcss";
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";

@theme {
  /* Custom colors, fonts, spacing defined here */
  --color-primary: #1E9952;
  --font-family-nunito: var(--font-nunito);
}

@layer components {
  /* Custom component classes */
  .primary-light-gradient { ... }
  .navbar-dropdown-gradient { ... }
}
```

### Custom Gradients
Six gradient utilities defined in `@layer components`:
- `primary-light-gradient` - Hero section gradient (green to transparent)
- `light-primary-gradient` - Inverted gradient
- `secondary-light-gradient` - Purple variant
- `info-light-gradient` - Cyan variant
- `primary-transparent-gradient` - Overlay effects
- `navbar-dropdown-gradient` - Dropdown with backdrop blur

See `GRADIENT-GUIDE.md` for usage examples.

## Navigation Architecture

### Structure
Projects dropdown has 4 categories (Apps category removed):
1. **Websites** - External portfolio sites
2. **Engineering** - Hardware projects
3. **Games** - WebGL games
4. **Tools** - Single-page web utilities

### Dropdown Pattern
**Implementation**: `src/components/TopNavbar/TopNavbar.tsx`

**Key Design**:
- **Hover Zone**: Parent `<div>` handles `onMouseEnter`/`onMouseLeave`
- **Click Handler**: Button handles `onClick` for toggle
- **Timeout System**: 150ms delay prevents flicker when moving mouse
- **Rendering**: Dropdown rendered at body level (not nested) to avoid z-index conflicts
- **Positioning**: `fixed left-0 right-0 top-16` for full-width
- **Styling**: `navbar-dropdown-gradient` class with backdrop blur

**Event Flow**:
```tsx
<div onMouseEnter={() => handleOpenMenu(label)} onMouseLeave={handleCloseMenu}>
  <button onClick={() => handleToggleMenu(label)} aria-expanded={isOpen}>
    {label}
    <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
  </button>
</div>

{/* Dropdown at body level, outside nav structure */}
{openMenu === label && (
  <div className="fixed left-0 right-0 top-16 navbar-dropdown-gradient z-50">
    {/* Content */}
  </div>
)}
```

## Layout Patterns

### Full-Width Sections
**Pattern**: Sections stretch edge-to-edge, content constrained inside

**Implementation**:
```tsx
<main className="w-full">  {/* No max-width constraint */}
  <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">  {/* Full-width bg */}
    <div className="max-w-7xl mx-auto">  {/* Centered content */}
      {/* Content here */}
    </div>
  </section>
</main>
```

**Why**: Allows backgrounds/gradients to extend full-width while keeping content readable.

### Responsive Breakpoints
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up
- `2xl:` - 1536px and up

## Component Patterns

### Server vs Client Components
- **Default**: Server Components (no `"use client"`)
- **Use `"use client"`** for:
  - Event handlers (onClick, onHover)
  - React hooks (useState, useEffect, useContext)
  - Browser APIs

### Context Providers
**NavbarContext** (`src/contexts/NavbarContext.tsx`):
- Manages dropdown state with useReducer
- Provides navigation structure
- 4 project categories (no Apps)

**AuthProvider** (`src/contexts/AuthProvider.tsx`):
- Wraps Clerk authentication
- Client-side only

## API Routes

**Location**: `src/app/api/*/route.ts`

**Example**: `src/app/api/mongo-crud/route.ts`
- MongoDB CRUD operations
- Uses environment variables `MONGODB_URI` and `DB_NAME`
- Exports GET, POST, PUT, DELETE handlers

## Testing Strategy

### Storybook (Primary UI Testing)
- **Location**: `src/stories/`
- **Run**: `yarn storybook`
- **Purpose**: Component development and visual testing

### Playwright (E2E Testing)
- **Location**: `e2e/`
- **Run**: `yarn test:e2e` (if configured)
- **Purpose**: End-to-end user flows

**Note**: Vitest was removed 2026-01-26. Storybook is now the primary testing platform.

## Build & Deployment

### Development
```bash
yarn dev          # Next.js dev server on localhost:3000
yarn storybook    # Storybook on localhost:6006
```

### Production
```bash
yarn build        # Next.js production build (runs prebuild → docs generation)
yarn start        # Start production server
```

### Linting & Docs
```bash
yarn lint         # ESLint
yarn lint:fix     # Auto-fix issues
yarn docs         # Generate TypeDoc (output: public/docs/)
```

## Environment Variables

Required for local development:
```
MONGODB_URI=mongodb+srv://...
DB_NAME=your_database_name
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

See `.env.example` for complete list.

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):
1. Lint code
2. Build project
3. Generate docs
4. Run tests (Storybook)

## Key Conventions

1. **File Naming**: kebab-case for files, PascalCase for components
2. **Imports**: Use `@/` alias for `src/`
3. **Types**: Export types from `src/types/`
4. **Comments**: Explain intent, not implementation
5. **Server First**: Use Server Components unless client features needed

## Migration Notes

- **From Angular to Next.js**: Completed
- **From Netlify Identity to Clerk**: Completed  
- **From Bootstrap to Tailwind v4**: Completed
- **From Vitest to Storybook**: Completed 2026-01-26

---

*Last updated: 2026-01-26*
