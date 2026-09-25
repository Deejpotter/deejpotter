import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import CadCamFabricationService from "@/app/projects/services/cad-cam-fabrication/page";

describe("CAD/CAM and fabrication service page", () => {
  test("renders the new fabrication service sections", () => {
    render(<CadCamFabricationService />);

    expect(
      screen.getByRole("heading", { name: /cad, cam, and fabrication/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /laser cutting and engraving/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /who this is for/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /questions people ask/i })).toBeInTheDocument();
  });
});
