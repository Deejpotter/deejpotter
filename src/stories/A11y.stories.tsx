import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import axe from 'axe-core';
import React from 'react';
import { Page } from './Page';
import { Header } from './Header';

const meta = {
  title: 'Test/A11y',
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

async function runAxeOnElement(el: HTMLElement) {
  return new Promise<axe.AxeResults>((resolve, reject) => {
    axe.run(
      el,
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

export const PageA11y: Story = {
  render: () => <Page />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const results = await runAxeOnElement(canvasElement);
    const seriousOrCritical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    await expect(seriousOrCritical.length).toBe(0);
  }
};

export const HeaderA11y: Story = {
  render: () => (
    <Header user={undefined} onLogin={() => {}} onLogout={() => {}} onCreateAccount={() => {}} />
  ),
  play: async ({ canvasElement }) => {
    const results = await runAxeOnElement(canvasElement);
    const seriousOrCritical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    await expect(seriousOrCritical.length).toBe(0);
  }
};
