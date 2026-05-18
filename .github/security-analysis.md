# Security Vulnerability Analysis - 2026-01-26

## Executive Summary
9 vulnerabilities identified:
- 1 Critical (form-data)
- 3 High (next x2, glob)
- 5 Moderate (mdast-util-to-hast, js-yaml x2, @babel/runtime, nanoid)

**Good News**: All vulnerabilities are in transitive dependencies or dev dependencies
**Action Required**: Update package resolutions and verify Next.js compatibility

---

## Critical Severity (1)

### CVE-2025-7783: form-data - Unsafe Random Function
- **Package**: form-data
- **Current**: < 4.0.4 (transitive, dev dependency)
- **Fixed**: 4.0.4
- **CVSS Score**: 9.4
- **Scope**: Development only (not runtime)
- **Issue**: Uses Math.random() for boundary generation - predictable, allows injection
- **Impact**: Command injection if attacker can observe Math.random() values
- **Fix**: Already in package.json resolutions as "form-data": "^4.0.4" ✅
- **Action**: Run yarn install to apply resolution

---

## High Severity (3)

### Alert #160 & #159: Next.js DoS with Server Components
- **Package**: next
- **Current**: 16.1.3 (direct dependency)
- **CVE**: CVE-2025-67779 (alert 160), CVE-2025-55184 (alert 159)
- **CVSS Score**: 7.5
- **Issue**: Denial of service via crafted HTTP requests to Server Components
- **Affected**: Next.js 13.3+ with App Router
- **Fixed Versions**:
  - Alert 160: 16.0.10+ or 16.1.0-canary.19+
  - Alert 159: 16.0.9+ or 16.1.0-canary.17+
- **Current Status**: Version 16.1.3 **is vulnerable** (needs 16.1.4+)
- **Fix**: Upgrade to next@^16.1.4 or latest

### CVE-2025-64756: glob - Command Injection via CLI
- **Package**: glob (transitive, dev dependency)
- **Current**: < 10.5.0
- **Fixed**: 10.5.0, 11.1.0
- **CVSS Score**: 7.5
- **Scope**: CLI only (not library API)
- **Issue**: glob -c option allows command injection via malicious filenames
- **Impact**: Arbitrary code execution in CI/CD pipelines
- **Our Usage**: Check if we use glob CLI anywhere
- **Fix**: Force resolution to glob@^10.5.0

---

## Moderate Severity (5)

### CVE-2025-66400: mdast-util-to-hast - Unsanitized Class Attribute
- **Package**: mdast-util-to-hast (transitive, dev)
- **Current**: 13.0.0 - 13.2.0
- **Fixed**: 13.2.1
- **CVSS Score**: 6.9
- **Issue**: Character references can inject classnames in markdown code blocks
- **Impact**: XSS if .xss classes exist
- **Fix**: Update via parent dependency or force resolution

### CVE-2025-64718: js-yaml - Prototype Pollution (x2 alerts)
- **Package**: js-yaml (alerts 155 & 156 - dev and runtime)
- **Current**: < 3.14.2 or 4.0.0-4.1.0
- **Fixed**: 3.14.2, 4.1.1
- **CVSS Score**: 5.3
- **Issue**: Prototype pollution via merge (<<) operator
- **Impact**: Object prototype modification if parsing untrusted YAML
- **Fix**: Already in resolutions as "js-yaml": "^3.14.2" ✅
- **Action**: Verify resolution is applied

### CVE-2025-27789: @babel/runtime - Inefficient RegExp
- **Package**: @babel/runtime (transitive, runtime)
- **Current**: < 7.26.10
- **Fixed**: 7.26.10
- **CVSS Score**: 6.2
- **Issue**: Quadratic complexity in .replace() polyfill for named capturing groups
- **Impact**: DoS if untrusted strings passed to .replace()
- **Fix**: Already in resolutions as "@babel/runtime": "^7.26.10" ✅
- **Action**: Verify and rebuild

### CVE-2024-55565: nanoid - Predictable Results
- **Package**: nanoid (transitive, runtime)
- **Current**: < 3.3.8
- **Fixed**: 3.3.8, 5.0.9
- **CVSS Score**: 4.3
- **Issue**: Fractional values cause infinite loop or return zeroes
- **Impact**: Denial of service or predictable IDs
- **Fix**: Already in resolutions as "nanoid": "^3.3.8" ✅
- **Action**: Verify resolution

---

## Resolution Analysis

### Current package.json Resolutions:
```json
"resolutions": {
  "@babel/helpers": "^7.26.10",
  "@babel/runtime": "^7.26.10",  ✅ Fixes CVE-2025-27789
  "form-data": "^4.0.4",          ✅ Fixes CVE-2025-7783
  "cross-spawn": "^7.0.5",
  "js-yaml": "^3.14.2",           ✅ Fixes CVE-2025-64718
  "nanoid": "^3.3.8"              ✅ Fixes CVE-2024-55565
}
```

**Status**: 5/9 vulnerabilities already have resolutions! ✅

### Missing Fixes:
1. **next** - needs upgrade from 16.1.3 to latest (16.1.4+)
2. **glob** - needs resolution to ^10.5.0 or ^11.1.0
3. **mdast-util-to-hast** - needs resolution to ^13.2.1
4. **@babel/helpers** - already in resolutions but needs verification

---

## Fix Implementation Plan

### Phase 1: Update package.json
1. Upgrade Next.js: "next": "^16.1.4"
2. Add missing resolutions:
   - "glob": "^10.5.0"
   - "mdast-util-to-hast": "^13.2.1"

### Phase 2: Install & Rebuild
1. Run yarn install
2. Clear .next build cache
3. Rebuild application

### Phase 3: Testing
1. Run yarn test (Vitest)
2. Run yarn test:e2e (Playwright)
3. Run yarn build
4. Manual smoke test

### Phase 4: Verification
1. Run yarn npm audit
2. Check GitHub Dependabot alerts
3. Verify CI passes

### Phase 5: Documentation
1. Update TODOs.md with completion
2. Commit with security fix message
3. Create PR if on branch

---

## Risk Assessment

### Critical/High Priority (Immediate)
- **Next.js DoS**: Direct dependency, runtime risk
- **form-data**: Already fixed via resolution, just needs install

### Medium Priority (This Week)
- **glob**: Dev only, CLI-specific
- **js-yaml**: Already fixed, verify
- **@babel/runtime**: Already fixed, rebuild needed

### Low Priority (Monitor)
- **mdast-util-to-hast**: Dev only, MDX processing
- **nanoid**: Already fixed

---

## Compatibility Concerns

### Next.js 16.1.3 → 16.1.4+
- Check release notes: https://github.com/vercel/next.js/releases
- Test App Router functionality
- Verify React 19 compatibility (current: 19.2.3)
- Check Clerk integration (@clerk/nextjs 6.36.8)

### Dependency Tree
- glob: Check if used by any dev tools (typedoc, eslint, playwright)
- mdast-util-to-hast: Used by gray-matter for MDX
- All others: Transitive, should auto-resolve
