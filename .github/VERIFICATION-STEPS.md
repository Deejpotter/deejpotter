# Manual Verification Steps

Since PowerShell 6+ is not available in the environment, please run these commands manually to verify the implementation:

## 1. Install Dependencies

```bash
cd C:\Users\Deej\repos\deejpotter
yarn install
```

**Expected:** Should install mongodb-memory-server@^10.1.2 and resolve dependencies successfully.

---

## 2. Run Tests with Coverage

```bash
yarn test:coverage
```

**Expected Results:**

- All tests should pass (unit/component + api + utilities)
- Newly added tests should pass:
  - `src/__tests__/cutOptimizer.test.ts`
  - `src/__tests__/apiMongoCrud.test.ts`
  - `src/__tests__/apiMongoCrudMutations.test.ts` (mocked DB flows)
  - `src/__tests__/ContactForm.test.tsx`
- Coverage should meet 60% thresholds (configured in `vitest.config.ts`):
  - Lines: ≥60%
  - Functions: ≥60%
  - Branches: ≥60%
  - Statements: ≥60%

**How to inspect coverage report:**

- Open `coverage/lcov-report/index.html` in your browser after the run to inspect per-file coverage and prioritize missing tests.

**Potential Issues to Check:**

- If accessibility tests fail, check console for violation details
- If integration tests fail, verify MongoDB Memory Server installed correctly
- If coverage is below 60%, inspect `coverage/lcov-report/index.html` to find low-coverage modules and add targeted tests
- If Vitest exits with non-zero due to failing coverage thresholds, open PR with focused tests for the low-coverage files and re-run tests

**Playwright PoC:**

- Run the Playwright PoC that exercises the cut calculator and captures a screenshot: `npx playwright test e2e/results-display.spec.ts` (make sure the dev server is running locally with `yarn dev` if not using the webServer config in Playwright).

---

## 3. Run Linter

```bash
yarn lint
```

**Expected:** Should pass with no errors. May show warnings that can be addressed later.

---

## 4. Build for Production

```bash
yarn build
```

**Expected Results:**

- TypeDoc should generate successfully
- Next.js build should complete without errors
- Check for these specific outputs:
  - "Route (app)" pages compiled successfully
  - "Route (pages)" - none (we use App Router)
  - Static pages generated
  - No TypeScript errors
  - No unhandled errors

**Potential Issues:**

- If metadata import errors occur, check that all pages are importing from correct paths
- If ContactForm import fails, verify file exists at `src/app/contact/ContactForm.tsx`
- If build fails on integration tests, those are only run with `yarn test`, not `yarn build`

---

## 5. Start Development Server

```bash
yarn dev
```

Then navigate to `http://localhost:3000` and verify:

### Home Page (/)

- [ ] Page loads without errors
- [ ] Heading "Welcome to My Portfolio" displays
- [ ] No console errors
- [ ] Styles apply correctly (Tailwind CSS)

### About Page (/about)

- [ ] Page loads without errors
- [ ] Heading "About Me" displays
- [ ] Content sections render with proper spacing
- [ ] No console errors
- [ ] Cards have proper styling (white bg in light mode, dark bg in dark mode)

### Contact Page (/contact)

- [ ] Page loads without errors
- [ ] Heading "Get in Touch" displays
- [ ] Form displays with all fields (name, email, message)
- [ ] No console errors
- [ ] Form styling correct (Tailwind classes applied)
- [ ] Try submitting form - should show validation errors for empty fields
- [ ] Fill valid data - should show "Submitting..." then error (expected - no backend)

---

## 6. Check Metadata (SEO)

### Using Browser DevTools

1. Open each page (/, /about, /contact)
2. View page source (Ctrl+U or right-click > View Page Source)
3. Look for meta tags in `<head>`:

```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://deejpotter.com/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://deejpotter.com/...">
```

### Using Online Tools

1. Build and deploy to staging/preview
2. Test with:
   - Twitter Card Validator: <https://cards-dev.twitter.com/validator>
   - Facebook Sharing Debugger: <https://developers.facebook.com/tools/debug/>
   - LinkedIn Post Inspector: <https://www.linkedin.com/post-inspector/>

---

## 7. Files to Review

### New Files Created

- `src/app/metadata.ts` - Centralized metadata helpers
- `src/app/contact/ContactForm.tsx` - Client component for contact form
- `src/__tests__/pages.a11y.test.tsx` - Accessibility tests
- `src/lib/mongoMemoryServer.ts` - MongoDB test utilities
- `src/app/api/mongo-crud/route.integration.test.ts` - Integration tests
- `ARCHITECTURE.md` - Project architecture documentation
- `.github/IMPLEMENTATION-SUMMARY.md` - This implementation summary
- `.github/dependabot.yml` - Enhanced (already existed, now improved)

### Modified Files

- `src/app/layout.tsx` - Uses defaultMetadata
- `src/app/contact/page.tsx` - Now server component with metadata export
- `src/app/contact/metadata.tsx` - Uses generatePageMetadata helper
- `src/app/about/metadata.tsx` - Uses generatePageMetadata helper
- `src/app/contact/page.test.tsx` - Imports ContactForm instead of page
- `vitest.config.ts` - Added coverage thresholds and exclusions
- `.github/workflows/ci.yml` - Added coverage summary upload
- `readme.md` - Updated Technologies section and added badges
- `package.json` - Added mongodb-memory-server
- `.github/TODOs.md` - Added completion notes

---

## 8. Known Issues to Address

### Missing OG Image

- Create `public/og-image.png` at 1200x630px
- Until created, social previews will show broken image

### Metadata Files Not Used

- `src/app/contact/metadata.tsx` - Can be deleted (metadata now in page.tsx)
- `src/app/about/metadata.tsx` - Can be deleted (metadata now in page.tsx)
- Or keep for reference, but they won't be used by Next.js

### Integration Tests Require MongoDB Memory Server

- First run of tests will download MongoDB binaries (~100MB)
- Subsequent runs will be much faster
- May need to configure firewall if download is blocked

---

## 9. Success Criteria

✅ **All tests pass** - No failures in test suite  
✅ **Build succeeds** - `yarn build` completes without errors  
✅ **Pages render** - All pages load correctly in browser  
✅ **Styles work** - Tailwind CSS classes apply correctly  
✅ **Metadata present** - OG tags visible in page source  
✅ **No console errors** - Browser console clean on all pages  
✅ **Forms functional** - Contact form validates and attempts submission  
✅ **Accessibility** - No critical axe violations in tests  

---

## 10. If Issues Found

### Test Failures

- Check error messages carefully
- Review stack traces
- Ensure all imports are correct
- Verify ContactForm.tsx exists and exports default

### Build Failures

- Check TypeScript errors first
- Verify all imports resolve correctly
- Ensure metadata.ts exports are correct
- Check that page.tsx files don't have "use client" if they export metadata

### Style Issues

- Verify Tailwind CSS is configured correctly
- Check that globals.css is imported in layout.tsx
- Inspect elements in browser DevTools to see which classes are applied
- Check for CSS conflicts

### Missing Features

- Some TODOs are still pending (projects metadata, blog metadata, OG images)
- This is expected and documented in .github/TODOs.md

---

## Next Steps After Verification

1. If all tests pass and build succeeds:
   - Commit changes with descriptive message
   - Push to dev branch
   - Create PR for review

2. If issues found:
   - Document them in .github/TODOs.md
   - Fix critical issues (build/test failures)
   - Note non-critical issues for future work

3. Follow-up tasks:
   - Create OG image asset
   - Add metadata to projects pages
   - Add metadata to blog pages
   - Remove unused metadata.tsx files
   - Update NextjsRefactor.md

---

**Last Updated:** 2026-01-26  
**Verification Status:** Pending manual testing
