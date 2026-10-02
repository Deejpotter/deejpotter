import React from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Home from "@/components/home/home";
import { projects } from "@/content/projects";

describe("Home component", () => {
  test("shows every project with its links", () => {
    render(<Home />);

    for (const project of projects) {
      expect(screen.getByRole("heading", { name: project.name })).toBeInTheDocument();
    }
    const card = screen.getByRole("heading", { name: "CNC Tools" }).closest("article")!;
    expect(within(card).getByRole("link", { name: /live/i })).toHaveAttribute(
      "href",
      "https://onlinecnctools.netlify.app",
    );
  });

  test("private projects say so instead of linking anywhere", () => {
    render(<Home />);
    const card = screen.getByRole("heading", { name: "Day Planner" }).closest("article")!;
    expect(within(card).queryByRole("link")).toBeNull();
    expect(within(card).getByText(/private repo/i)).toBeInTheDocument();
  });

  test("sends work enquiries to Lumendot and has no contact form link", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /go to lumendot/i })).toHaveAttribute(
      "href",
      "https://lumendot.com",
    );
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).not.toContain("/contact");
  });
});
