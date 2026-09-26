import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import ThreeDPrintingService from "@/app/projects/services/3d-printing/page";

// The page reads materials from MongoDB; keep the test off the database
vi.mock("@/lib/db-config", () => ({
  getEnabledMaterials: vi.fn(async () => [
    { id: "PLA", label: "PLA", ratePerGram: 0.18 },
    { id: "other", label: "Other (I'll describe it)", ratePerGram: null },
  ]),
}));

describe("3D printing service page", () => {
  test("renders the updated Tailwind sections", async () => {
    // Async server component: resolve it, then render the result
    render(await ThreeDPrintingService());

    expect(
      screen.getByRole("heading", { name: /on-demand 3d printing/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /good fit for/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /request a print quote/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /check your quote status/i })).toBeInTheDocument();
  });
});
