import '@testing-library/jest-dom';

// Expose vi globally for legacy jest-style tests that expect a global jest.fn shim if needed
// Prefer using `vi` directly in tests.
// @ts-ignore
if (typeof globalThis.vi === 'undefined') {
  // @ts-ignore
  globalThis.vi = (await import('vitest')).vi;
}

// Ensure fetch exists in the test environment
if (typeof globalThis.fetch === 'undefined') {
  // @ts-ignore
  globalThis.fetch = vi.fn();
}
