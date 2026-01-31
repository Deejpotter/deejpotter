// Test setup for Vitest + React Testing Library
// Purpose: Provide a stable test environment using jsdom and include helpful matchers.
import '@testing-library/jest-dom';

// Simple stub for HTMLCanvasElement.getContext used by some components in tests
// This keeps tests deterministic without adding the full `canvas` native dependency.
// If you need more advanced 2D context behavior later, consider adding the `canvas` package.
if (typeof HTMLCanvasElement !== 'undefined' && !HTMLCanvasElement.prototype.getContext) {
  // @ts-ignore
  HTMLCanvasElement.prototype.getContext = () => ({
    measureText: () => ({ width: 0 }),
    fillRect: () => {},
    clearRect: () => {},
  });
}
