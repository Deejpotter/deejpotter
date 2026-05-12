import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ThreeDPrintingService from "@/app/projects/services/3d-printing/page";

describe("3D printing service page", () => {
  test("renders the updated Tailwind sections", () => {
    render(<ThreeDPrintingService />);

    expect(
      screen.getByRole("heading", { name: /on-demand 3d printing/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /good fit for/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /request a print quote/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /check your quote status/i })).toBeInTheDocument();
  });
});
