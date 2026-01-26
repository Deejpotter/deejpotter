import React from 'react';
import { render } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import axe from 'axe-core';

import { Page } from '../stories/Page';
import { Header } from '../stories/Header';

async function runAxe(container: HTMLElement) {
  return new Promise<axe.AxeResults>((resolve, reject) => {
    axe.run(
      container,
      {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      },
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
}

describe('accessibility (axe) smoke tests', () => {
  test('Page has no critical/serious violations (smoke)', async () => {
    const { container } = render(<Page />);
    const results = await runAxe(container);
    const seriousOrCritical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    expect(seriousOrCritical.length).toBe(0);
  });

  test('Header has no critical/serious violations (smoke)', async () => {
    const { container } = render(
      <Header
        user={undefined}
        onLogin={() => {}}
        onLogout={() => {}}
        onCreateAccount={() => {}}
      />
    );
    const results = await runAxe(container);
    const seriousOrCritical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    expect(seriousOrCritical.length).toBe(0);
  });
});
