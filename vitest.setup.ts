import '@testing-library/jest-dom';
import { vi } from 'vitest';
import * as React from 'react';

// Make React available globally for tests that rely on it.
// Some JSX transforms and component test utilities expect React in the global scope.
// Modern React (19+) doesn't require this for JSX, but testing libraries like
// React Testing Library and certain test scenarios may still need it.
// @ts-ignore - Intentionally adding React to globalThis for test compatibility
globalThis.React = React;

// Ensure fetch exists in the test environment
if (typeof globalThis.fetch === 'undefined') {
  // @ts-ignore
  globalThis.fetch = vi.fn();
}
