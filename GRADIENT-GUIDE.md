# Gradient Utilities Guide

## Overview

This project includes six custom gradient utilities defined in `src/styles/globals.css` using Tailwind CSS v4's `@layer components` feature.

**Location**: `src/styles/globals.css` (lines 72-150)

**Configuration**: CSS-based (NOT JavaScript) - Tailwind v4 uses `@theme` and `@layer` blocks instead of `tailwind.config.js`.

## Available Gradients

### 1. Primary Light Gradient
**Class**: `.primary-light-gradient`

**Effect**: Green to transparent (top to bottom)

**Use Case**: Hero sections, headers

**CSS**:
```css
.primary-light-gradient {
  background: linear-gradient(
    180deg, 
    rgba(30, 153, 82, 1) 40%, 
    rgba(30, 153, 82, 0.8) 65%, 
    rgba(253, 253, 253, 0) 100%
  );
}
```

**Example**:
```tsx
<section className="primary-light-gradient text-white py-20">
  <div className="max-w-7xl mx-auto">
    <h1>Welcome to My Portfolio</h1>
  </div>
</section>
```

### 2. Light Primary Gradient
**Class**: `.light-primary-gradient`

**Effect**: Transparent to green (inverted)

**Use Case**: Footer sections, bottom accents

**CSS**:
```css
.light-primary-gradient {
  background: linear-gradient(
    180deg, 
    rgba(253, 253, 253, 0) 40%, 
    rgba(30, 153, 82, 0.8) 65%, 
    rgb(30, 153, 82) 100%
  );
}
```

### 3. Secondary Light Gradient
**Class**: `.secondary-light-gradient`

**Effect**: Purple to transparent

**Use Case**: Alternative section backgrounds

**CSS**:
```css
.secondary-light-gradient {
  background: linear-gradient(
    180deg, 
    rgba(58, 44, 51, 1) 50%, 
    rgba(58, 44, 51, 0.796) 65%, 
    rgba(253, 253, 253, 0) 100%
  );
}
```

### 4. Info Light Gradient
**Class**: `.info-light-gradient`

**Effect**: Cyan to transparent

**Use Case**: Info boxes, callouts

**CSS**:
```css
.info-light-gradient {
  background: linear-gradient(
    180deg, 
    rgba(115, 194, 212, 1) 50%, 
    rgba(115, 194, 212, 0.799) 65%, 
    rgba(253, 253, 253, 0) 100%
  );
}
```

### 5. Primary Transparent Gradient
**Class**: `.primary-transparent-gradient`

**Effect**: Transparent → green → transparent

**Use Case**: Overlays, dividers

**CSS**:
```css
.primary-transparent-gradient {
  background: linear-gradient(
    180deg, 
    rgba(30, 153, 82, 0) 0%, 
    rgba(30, 153, 82, 1) 10%, 
    rgba(30, 153, 82, 0.9) 75%, 
    rgba(253, 253, 253, 0.5) 100%
  );
}
```

### 6. Navbar Dropdown Gradient
**Class**: `.navbar-dropdown-gradient`

**Effect**: Transparent to green with blur

**Use Case**: Dropdown menus, overlays

**CSS**:
```css
.navbar-dropdown-gradient {
  background: linear-gradient(
    180deg,
    rgba(30, 153, 82, 0) 0%,
    rgba(30, 153, 82, 0.95) 100%
  );
  backdrop-filter: blur(8px);
}
```

**Example**:
```tsx
<div className="fixed left-0 right-0 top-16 navbar-dropdown-gradient">
  <div className="max-w-7xl mx-auto px-4">
    {/* Dropdown content */}
  </div>
</div>
```

## Dark Mode Variants

### Primary Dark Gradient
**Class**: `.dark .primary-dark-gradient`

**Effect**: Green to dark (instead of transparent)

**Auto-applies**: Only in dark mode

**CSS**:
```css
.dark .primary-dark-gradient {
  background: linear-gradient(
    180deg, 
    rgba(30, 153, 82, 1) 40%, 
    rgba(30, 153, 82, 0.8) 65%, 
    rgba(24, 24, 33, 0) 100%
  );
}
```

### Dark Primary Gradient
**Class**: `.dark .dark-primary-gradient`

**Effect**: Dark to green (inverted)

**CSS**:
```css
.dark .dark-primary-gradient {
  background: linear-gradient(
    180deg, 
    rgba(24, 24, 33, 0) 40%, 
    rgba(30, 153, 82, 0.8) 65%, 
    rgb(30, 153, 82) 100%
  );
}
```

## Usage Patterns

### Full-Width Section with Gradient

```tsx
<section className="primary-light-gradient text-white py-20 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto text-center">
    <h1 className="text-5xl font-bold">Hero Title</h1>
    <p className="text-xl">Subtitle text</p>
  </div>
</section>
```

### Combining with Tailwind Utilities

```tsx
<div className="info-light-gradient rounded-lg shadow-lg p-6">
  <h3 className="text-white font-bold">Information</h3>
  <p className="text-white/90">Details here</p>
</div>
```

### Responsive Gradients

```tsx
{/* Different gradient on mobile vs desktop */}
<section className="primary-light-gradient md:secondary-light-gradient">
  {/* Content */}
</section>
```

## Customizing Gradients

### Location
Edit `src/styles/globals.css` in the `@layer components` section.

### Adding New Gradient

```css
@layer components {
  .my-custom-gradient {
    background: linear-gradient(
      180deg,
      rgba(r, g, b, a) 0%,
      rgba(r, g, b, a) 100%
    );
  }
}
```

### Modifying Existing Gradient

1. Open `src/styles/globals.css`
2. Find gradient class in `@layer components`
3. Adjust rgba values and percentages
4. Save and test in browser

## Color Reference

**Primary Green**: `rgba(30, 153, 82, 1)` or `#1E9952`  
**Secondary Purple**: `rgba(58, 44, 51, 1)` or `#3A2C33`  
**Info Cyan**: `rgba(115, 194, 212, 1)` or `#73C2D4`  
**Light**: `rgba(253, 253, 253, 1)` or `#FDFDFD`  
**Dark**: `rgba(24, 24, 33, 1)` or `#181821`  

## Best Practices

1. **Use with text contrast in mind** - always test readability
2. **Pair with appropriate text colors** - usually white or near-white
3. **Combine with spacing utilities** - use `py-*` and `px-*`
4. **Test in dark mode** - ensure gradients work in both themes
5. **Use semantic class names** - prefer descriptive gradient names

## Examples in Codebase

- **Hero Section**: `src/components/home/home.tsx` (line 38)
- **Navbar Dropdown**: `src/components/TopNavbar/TopNavbar.tsx` (line 147)

---

*Last updated: 2026-01-26*
*Configuration migrated to Tailwind CSS v4 CSS-based system*
