import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavbarProvider } from "@/contexts/NavbarContext";
import TopNavbar from "./TopNavbar";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt={alt} {...props} />
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/components/ui/auth/AuthButton", () => ({
  default: ({ buttonSize }: { buttonSize?: string }) => (
    <button type="button">Auth {buttonSize ?? "default"}</button>
  ),
}));

describe("TopNavbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderNavbar = () =>
    render(
      <NavbarProvider>
        <TopNavbar />
      </NavbarProvider>
    );

  const getProjectsButton = () =>
    screen.getByRole("button", { name: /projects/i });

  it("renders the main navigation items and branding", () => {
    renderNavbar();

    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("About Me")).toBeInTheDocument();
    expect(screen.getByText("Contact Me")).toBeInTheDocument();
    expect(screen.getAllByAltText("Deej Potter Logo")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Deej Potter").length).toBeGreaterThan(0);
  });

  it("opens the Projects dropdown on click and shows the expected categories", async () => {
    renderNavbar();

    const projectsButton = getProjectsButton();
    expect(projectsButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("nav-projects-dropdown")).not.toBeInTheDocument();

    fireEvent.click(projectsButton);

    const dropdown = await screen.findByTestId("nav-projects-dropdown");
    expect(projectsButton).toHaveAttribute("aria-expanded", "true");

    const categories = ["Websites", "Engineering", "Games", "Tools"];
    for (const category of categories) {
      expect(within(dropdown).getByText(category)).toBeVisible();
    }

    expect(within(dropdown).getByText("Deej Potter")).toBeVisible();
    expect(within(dropdown).getByText("Wireless Car")).toBeVisible();
    expect(within(dropdown).getByText("Basic Bases")).toBeVisible();
    expect(within(dropdown).getByText("20 Series Cut Calculator")).toBeVisible();
  });

  it("closes the Projects dropdown when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderNavbar();

    fireEvent.click(getProjectsButton());
    expect(await screen.findByTestId("nav-projects-dropdown")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByTestId("nav-projects-dropdown")).not.toBeInTheDocument();
      expect(getProjectsButton()).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("closes a hover-opened dropdown after the mouse leaves and the delay expires", async () => {
    renderNavbar();

    const triggerWrapper = getProjectsButton().parentElement;
    expect(triggerWrapper).not.toBeNull();

    fireEvent.mouseEnter(triggerWrapper!);
    expect(await screen.findByTestId("nav-projects-dropdown")).toBeInTheDocument();

    fireEvent.mouseLeave(triggerWrapper!);

    await waitFor(
      () => {
        expect(screen.queryByTestId("nav-projects-dropdown")).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it("toggles the mobile navigation drawer", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const mobileNav = screen.getByRole("navigation", {
      name: /mobile navigation/i,
      hidden: true,
    });
    const toggleButton = screen.getByLabelText("Toggle navigation");

    expect(mobileNav).toHaveAttribute("data-expanded", "false");

    await user.click(toggleButton);

    await waitFor(() => {
      expect(mobileNav).toHaveAttribute("data-expanded", "true");
      expect(screen.getByLabelText("Close navigation")).toBeInTheDocument();
      expect(screen.getByText("Auth default")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Close navigation"));

    await waitFor(() => {
      expect(mobileNav).toHaveAttribute("data-expanded", "false");
      expect(screen.queryByLabelText("Close navigation")).not.toBeInTheDocument();
    });
  });
});
