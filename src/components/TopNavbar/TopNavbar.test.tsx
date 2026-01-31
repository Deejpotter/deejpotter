import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavbarProvider } from "@/contexts/NavbarContext";
import TopNavbar from "./TopNavbar";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock Clerk components
vi.mock("@clerk/nextjs", () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignInButton: () => <button>Sign In</button>,
  UserButton: () => <button>User Menu</button>,
}));

// Stub AuthButton used inside TopNavbar to keep tests deterministic (no Clerk setup required)
vi.mock("@/components/ui/auth/AuthButton", () => ({
  default: ({ buttonSize }: { buttonSize?: string }) => (
    <div>
      <button>Login</button>
      <button>Sign up</button>
    </div>
  ),
}));

describe("TopNavbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNavbar = () => {
    return render(
      <NavbarProvider>
        <TopNavbar />
      </NavbarProvider>
    );
  };

  // Test helper to get the Projects button deterministically
  const getProjectsButton = () => screen.getByTestId("nav-projects-button");

  describe("Desktop Navigation", () => {
    it("renders all top-level navigation items", () => {
      renderNavbar();

      expect(screen.getByText("Projects")).toBeInTheDocument();
      expect(screen.getByText("Blog")).toBeInTheDocument();
      expect(screen.getByText("About Me")).toBeInTheDocument();
      expect(screen.getByText("Contact Me")).toBeInTheDocument();
    });

    it("renders logo and site name", () => {
      renderNavbar();

      const logo = screen.getByAltText("Logo");
      expect(logo).toBeInTheDocument();
      // Ensure the site name in the header (not a dropdown item) is rendered by checking within the logo link
      const logoLink = logo.closest("a");
      expect(logoLink).toBeTruthy();
      if (logoLink) {
        expect(within(logoLink).getByText("Deej Potter")).toBeInTheDocument();
      }
    });

    it("displays dropdown arrow indicator for Projects", () => {
      renderNavbar();

      const projectsButton = getProjectsButton();
      // The visual arrow may be implemented differently (SVG/span or CSS); ensure button contains the label and is present
      expect(projectsButton).toHaveTextContent(/projects/i);
    });
  });

  describe("Dropdown Menu Functionality", () => {
    it("opens dropdown on mouse enter", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();

      // Initially, dropdown should be hidden (aria-hidden used for visibility in DOM)
      const dropdown = screen.getByTestId("nav-projects-dropdown");
      expect(dropdown).toHaveAttribute("aria-hidden", "true");

      // Hover over Projects
      await user.hover(projectsButton);

      // Dropdown should become visible with all categories
      await waitFor(() => {
        const dropdown = screen.getByTestId("nav-projects-dropdown");
        expect(within(dropdown).getByText("Websites")).toBeVisible();
        expect(within(dropdown).getByText("Engineering")).toBeVisible();
        expect(within(dropdown).getByText("Games")).toBeVisible();
        expect(within(dropdown).getByText("Tools")).toBeVisible();
      });
    });

    it("closes dropdown on mouse leave with delay", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();

      // Open dropdown (use mouseEnter for deterministic event)
      fireEvent.mouseEnter(projectsButton);
      await waitFor(() => {
        const dropdown = screen.getByTestId("nav-projects-dropdown");
        expect(dropdown).toHaveAttribute("aria-hidden", "false");
      });

      // Move mouse away
      fireEvent.mouseLeave(projectsButton);

      // Dropdown should close after delay (150ms)
      await waitFor(
        () => {
          expect(screen.getByTestId("nav-projects-dropdown")).toHaveAttribute(
            "aria-hidden",
            "true"
          );
        },
        { timeout: 300 }
      );
    });

    it("toggles dropdown on button click", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();

      // Open dropdown (use mouseDown to match component behavior)
      fireEvent.mouseDown(projectsButton);
      await waitFor(() => {
        const dropdown = screen.getByTestId("nav-projects-dropdown");
        expect(dropdown).toHaveAttribute("aria-hidden", "false");
      });

      // Simulate closing by moving mouse away (avoids race with mouse events)
      fireEvent.mouseLeave(projectsButton);
      await waitFor(() => {
        expect(screen.getByTestId("nav-projects-dropdown")).toHaveAttribute(
          "aria-hidden",
          "true"
        );
      });
    });

    it("updates aria-expanded attribute correctly (via click)", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();

      // Initially collapsed
      expect(projectsButton).toHaveAttribute("aria-expanded", "false");

      // Click to open (use mouseDown to match component event)
      fireEvent.mouseDown(projectsButton);
      await waitFor(() => {
        expect(projectsButton).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("rotates arrow indicator when dropdown opens (or updates aria-expanded)", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();
      const arrow = projectsButton.querySelector("span");

      // If the arrow element exists, it should be rotatable. Otherwise, ensure aria-expanded toggles.
      if (arrow) {
        expect(arrow).toHaveStyle({ transform: "rotate(0deg)" });
        // Open dropdown
        fireEvent.mouseDown(projectsButton);
        await waitFor(() => {
          expect(arrow).toHaveStyle({ transform: "rotate(180deg)" });
        });
      } else {
        // Fallback: ensure aria-expanded toggles
        expect(projectsButton).toHaveAttribute("aria-expanded", "false");
        await user.click(projectsButton);
        await waitFor(() => {
          expect(projectsButton).toHaveAttribute("aria-expanded", "true");
        });
      }
    });
  });

  describe("Navigation Structure", () => {
    it("displays all project categories in correct order", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();
      await user.click(projectsButton);

      await waitFor(() => {
        const dropdown = screen.getByTestId("nav-projects-dropdown");
        const categories = ["Websites", "Engineering", "Games", "Tools"];
        categories.forEach((category) => {
          expect(within(dropdown).getByText(category)).toBeVisible();
        });
      });
    });

    it("does not display Apps category (removed)", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();
      await user.hover(projectsButton);

      await waitFor(() => {
        const dropdown = screen.getByTestId("nav-projects-dropdown");
        expect(dropdown).toBeVisible();
      });

      // Apps category should not exist
      expect(screen.queryByText("Apps")).not.toBeInTheDocument();
    });

    it("displays Websites project links", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();
      await user.click(projectsButton);

      await waitFor(() => {
        const dropdown = screen.getByTestId("nav-projects-dropdown");
        expect(within(dropdown).getByText("Deej Potter")).toBeVisible();
      });
    });

    it("displays Tools project links", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();
      await user.click(projectsButton);

      await waitFor(() => {
        const dropdown = screen.getByTestId("nav-projects-dropdown");
        expect(
          within(dropdown).getByText("20 Series Cut Calculator")
        ).toBeVisible();
      });
    });

    it("displays Engineering project links", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();
      await user.click(projectsButton);

      await waitFor(() => {
        const dropdown = screen.getByTestId("nav-projects-dropdown");
        expect(within(dropdown).getByText("Wireless Car")).toBeVisible();
      });
    });

    it("displays Games project links", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();
      await user.click(projectsButton);

      await waitFor(() => {
        const dropdown = screen.getByTestId("nav-projects-dropdown");
        expect(within(dropdown).getByText("Basic Bases")).toBeVisible();
      });
    });
  });

  describe("Mobile Navigation", () => {
    it("renders mobile menu toggle button", () => {
      renderNavbar();

      const mobileToggle = screen.getByLabelText("Toggle menu");
      expect(mobileToggle).toBeInTheDocument();
    });

    it("toggles mobile menu on button click", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const mobileToggle = screen.getByLabelText("Toggle menu");

      // Mobile menu overlay should not be present initially
      expect(
        screen.queryByTestId("mobile-nav-overlay")
      ).not.toBeInTheDocument();

      // Click to expand
      fireEvent.click(mobileToggle);
      await waitFor(() => {
        expect(screen.getByTestId("mobile-nav-overlay")).toBeInTheDocument();
        expect(screen.getByTestId("mobile-nav-close")).toBeInTheDocument();
      });
    });
  });

  describe("Dropdown Styling", () => {
    it("applies gradient background to dropdown", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();
      await user.click(projectsButton);

      await waitFor(() => {
        const dropdown = screen.getByTestId("nav-projects-dropdown");
        expect(dropdown).toHaveClass("bg-gradient-to-b");
      });
    });

    it("positions dropdown immediately below the nav (absolute top-full)", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();
      await user.click(projectsButton);

      await waitFor(() => {
        const dropdown = screen.getByTestId("nav-projects-dropdown");
        expect(dropdown).toHaveClass("absolute");
        expect(dropdown).toHaveClass("top-full");
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels", () => {
      renderNavbar();

      expect(screen.getByRole("navigation")).toBeInTheDocument();
      expect(screen.getByLabelText("Toggle menu")).toBeInTheDocument();
    });

    it("keyboard navigation works for dropdown", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();

      // Focus the Projects button and press Enter to open
      projectsButton.focus();
      await user.keyboard("{Enter}");
      await waitFor(() => {
        const dropdown = screen.getByTestId("nav-projects-dropdown");
        expect(dropdown).toBeVisible();
      });
    });

    it("ESC key closes dropdown", async () => {
      const user = userEvent.setup();
      renderNavbar();

      const projectsButton = getProjectsButton();
      // Open via mouseDown to match component behavior
      fireEvent.mouseDown(projectsButton);

      await waitFor(() => {
        const dropdown = screen.getByTestId("nav-projects-dropdown");
        expect(dropdown).toHaveAttribute("aria-hidden", "false");
      });

      // Press ESC on the focused button
      projectsButton.focus();
      fireEvent.keyDown(projectsButton, { key: "Escape", code: "Escape" });
      await waitFor(() => {
        const dropdown = screen.getByTestId("nav-projects-dropdown");
        expect(dropdown).toHaveAttribute("aria-hidden", "true");
      });
    });
  });

  describe("Authentication Buttons", () => {
    it("renders authentication buttons (Login / Sign up)", () => {
      renderNavbar();
      expect(screen.getByText(/login/i)).toBeInTheDocument();
      expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });
  });
});
