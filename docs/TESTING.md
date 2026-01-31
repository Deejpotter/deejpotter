# Testing Strategy

## Overview

This project uses **Storybook** as the primary UI testing platform, with **Playwright** for end-to-end testing.

**Note**: Vitest was removed from the project on 2026-01-26.

## Testing Approach

### Component Testing with Storybook

**Primary tool** for UI component development and testing.

**Location**: `src/stories/`

**Run Storybook**:
```bash
yarn storybook
```

Access at: `http://localhost:6006`

**Purpose**:
- Visual component development
- Interactive component testing
- Props exploration
- Accessibility testing
- Responsive design verification

**Example Story**:
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { TopNavbar } from './TopNavbar';

const meta: Meta<typeof TopNavbar> = {
  title: 'Components/TopNavbar',
  component: TopNavbar,
};

export default meta;
type Story = StoryObj<typeof TopNavbar>;

export const Default: Story = {};

export const WithDropdownOpen: Story = {
  play: async ({ canvasElement }) => {
    // Interaction testing
  },
};
```

### End-to-End Testing with Playwright

**Location**: `e2e/`

**Run E2E Tests**:
```bash
yarn test:e2e
```

**Purpose**:
- Full user flow testing
- Cross-browser compatibility
- Visual regression testing
- Accessibility audits with axe-core

**Example Test**:
```typescript
import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome to My Portfolio' })).toBeVisible();
});

test('dropdown menu works', async ({ page }) => {
  await page.goto('/');
  await page.hover('button:has-text("Projects")');
  await expect(page.getByText('Websites')).toBeVisible();
});
```

## Test Coverage

### What Gets Tested

**UI Components** (Storybook):
- TopNavbar with dropdown functionality
- Footer component
- Hero sections with gradients
- Card components
- Form components
- Button variants

**User Flows** (Playwright):
- Homepage navigation
- Contact form submission
- Project browsing
- Authentication flows
- Responsive behavior

**Accessibility** (Both):
- ARIA attributes
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus management

## Running Tests

### Local Development

**Start Storybook**:
```bash
yarn storybook
```
- Opens on port 6006
- Hot reload enabled
- Interact with components live

**Run Playwright**:
```bash
# Run all E2E tests
yarn test:e2e

# Run in UI mode (interactive)
yarn test:e2e --ui

# Run specific test file
yarn test:e2e e2e/homepage.spec.ts

# Debug mode
yarn test:e2e --debug
```

### CI/CD Pipeline

GitHub Actions runs tests automatically:
1. Lint code
2. Build project
3. Run Storybook tests
4. Run Playwright E2E tests

See `.github/workflows/ci.yml`

## Best Practices

### Writing Storybook Stories

1. **One story per state**:
   - Default
   - Loading
   - Error
   - Empty

2. **Use args for props**:
```typescript
export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Click Me',
  },
};
```

3. **Document interactions**:
```typescript
export const WithInteraction: Story = {
  play: async ({ canvasElement, step }) => {
    await step('Click button', async () => {
      const button = within(canvasElement).getByRole('button');
      await userEvent.click(button);
    });
  },
};
```

### Writing Playwright Tests

1. **Use data-testid sparingly** - prefer role-based selectors:
```typescript
// Good
await page.getByRole('button', { name: 'Submit' }).click();

// Avoid (unless necessary)
await page.locator('[data-testid="submit-btn"]').click();
```

2. **Wait for navigation**:
```typescript
await Promise.all([
  page.waitForNavigation(),
  page.click('text=Projects'),
]);
```

3. **Test user scenarios, not implementation**:
```typescript
// Good - tests user behavior
test('user can contact site owner', async ({ page }) => {
  await page.goto('/contact');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('textarea[name="message"]', 'Hello!');
  await page.click('button[type="submit"]');
  await expect(page.getByText('Message sent')).toBeVisible();
});

// Avoid - tests implementation details
test('form state updates on input change', async ({ page }) => {
  // ...
});
```

## Accessibility Testing

### Storybook Addon

**Enabled**: `@storybook/addon-a11y`

Automatically checks stories for:
- Missing ARIA labels
- Color contrast issues
- Keyboard navigation
- Focus management

### Playwright Axe Integration

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('homepage is accessible', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});
```

## Visual Regression Testing

### Playwright Screenshots

```typescript
test('dropdown matches design', async ({ page }) => {
  await page.goto('/');
  await page.hover('button:has-text("Projects")');
  await expect(page).toHaveScreenshot('dropdown-open.png');
});
```

**Update snapshots**:
```bash
yarn test:e2e --update-snapshots
```

## Debugging

### Storybook

1. Open browser DevTools (F12)
2. Inspect component in Elements tab
3. Use Console for component state
4. Storybook's "Actions" addon logs events

### Playwright

**Debug mode**:
```bash
yarn test:e2e --debug
```

**Headed mode** (see browser):
```bash
yarn test:e2e --headed
```

**Slow motion**:
```bash
yarn test:e2e --slow-mo=1000
```

**Trace viewer**:
```bash
yarn test:e2e --trace on
npx playwright show-trace trace.zip
```

## Common Issues

### Storybook

**Port already in use**:
```bash
# Kill process on port 6006
npx kill-port 6006
```

**Build errors**:
```bash
# Clear Storybook cache
rm -rf node_modules/.cache/storybook
```

### Playwright

**Browser not found**:
```bash
npx playwright install
```

**Timeouts**:
- Increase timeout in test: `test.setTimeout(60000)`
- Check for slow network requests
- Ensure elements are visible before interacting

## Migration from Vitest

**Removed**: 2026-01-26

**Previously**:
- `yarn test` ran Vitest unit tests
- Component tests with @testing-library/react

**Now**:
- Use Storybook for component testing
- Use Playwright for integration/E2E

**If you need unit tests**:
- Add Vitest back to `package.json`
- Create `vitest.config.ts`
- Add test files: `*.test.ts` or `*.spec.ts`

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Axe Accessibility Testing](https://www.deque.com/axe/)

---

*Last updated: 2026-01-26*
*Vitest removed, Storybook is primary testing platform*
