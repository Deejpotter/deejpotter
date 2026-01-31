import React from "react";
import CutRequirementsTable from "@/app/projects/tools/20-series-cut-calculator/CutRequirementsTable";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof CutRequirementsTable> = {
  title: "Cut Calculator/CutRequirementsTable",
  component: CutRequirementsTable,
};

export default meta;

type Story = StoryObj<typeof CutRequirementsTable>;

const sampleRequirements = [
  { id: "1", length: 450, quantity: 4 },
  { id: "2", length: 1200, quantity: 2 },
];

export const Default: Story = {
  args: {
    requirements: sampleRequirements,
    onRequirementsChange: () => {},
  },
};

export const Empty: Story = {
  args: {
    requirements: [],
    onRequirementsChange: () => {},
  },
};
