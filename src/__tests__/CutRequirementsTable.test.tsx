import React from "react";
import { render, screen } from "@testing-library/react";
import CutRequirementsTable from "../app/projects/tools/20-series-cut-calculator/CutRequirementsTable";

test("renders CutRequirementsTable with rows", () => {
  const requirements = [{ id: "1", length: 450, quantity: 4 }];
  render(<CutRequirementsTable requirements={requirements} onRequirementsChange={() => {}} />);
  expect(screen.getByText(/Cut Requirements/i)).toBeInTheDocument();
  expect(screen.getByText(/#1/)).toBeInTheDocument();
});
