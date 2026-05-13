import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import CadCamFabricationService from "@/app/projects/services/cad-cam-fabrication/page";

describe("CAD/CAM and fabrication service page", () => {
  test("renders the new fabrication service sections", () => {
    render(<CadCamFabricationService />);

    expect(
      screen.getByRole("heading", { name: /cad, cam, and fabrication support/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /what i can help with/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /what this is not/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /frequently asked questions/i })).toBeInTheDocument();
  });
});
