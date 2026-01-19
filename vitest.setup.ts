import '@testing-library/jest-dom';
import { vi } from 'vitest';
import * as React from 'react';

// Make React available globally for tests that rely on it (some JSX transforms require it)
// @ts-ignore
globalThis.React = React;

// Ensure fetch exists in the test environment
if (typeof globalThis.fetch === 'undefined') {
  // @ts-ignore
  globalThis.fetch = vi.fn();
}
