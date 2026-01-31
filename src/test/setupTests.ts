// Test setup for Vitest + React Testing Library
// Purpose: Provide a stable test environment using jsdom and include helpful matchers.
import "@testing-library/jest-dom";

// Simple stub for HTMLCanvasElement.getContext used by some components in tests
// This keeps tests deterministic without adding the full `canvas` native dependency.
// If you need more advanced 2D context behavior later, consider adding the `canvas` package.
if (
  typeof HTMLCanvasElement !== "undefined" &&
  !HTMLCanvasElement.prototype.getContext
) {
  // Provide minimal TextMetrics-compatible stub to satisfy TypeScript
  // Cast the stub to the same type as the original method to satisfy overloads
  HTMLCanvasElement.prototype.getContext = ((): any => ({
    measureText: () => ({
      width: 0,
      actualBoundingBoxAscent: 0,
      actualBoundingBoxDescent: 0,
      actualBoundingBoxLeft: 0,
      actualBoundingBoxRight: 0,
      fontBoundingBoxAscent: 0,
      fontBoundingBoxDescent: 0,
      emHeightAscent: 0,
      emHeightDescent: 0,
      hangingBaseline: 0,
      alphabeticBaseline: 0,
      ideographicBaseline: 0,
    } as unknown as TextMetrics),
    fillRect: () => {},
    clearRect: () => {},
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}
