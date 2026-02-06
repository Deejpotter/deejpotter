import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavbarProvider } from '@/contexts/NavbarContext';
import TopNavbar from './TopNavbar';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock Clerk — the AuthButton uses a custom useAuth hook from AuthProvider.
// When Clerk isn't initialised (no publishable key), isLoaded stays false and
// AuthButton renders a loading spinner. We keep the Clerk mock minimal.
vi.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useUser: () => ({ user: null, isLoaded: false, isSignedIn: false }),
  useAuth: () => ({ isLoaded: false, isSignedIn: false }),
}));

describe('TopNavbar Component', () => {
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

  describe('Desktop Navigation', () => {
    it('renders all top-level navigation items', () => {
      renderNavbar();
      
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('About Me')).toBeInTheDocument();
      expect(screen.getByText('Contact Me')).toBeInTheDocument();
    });

    it('renders logo and site name', () => {
      renderNavbar();
      
      const logo = screen.getByAltText('Deej Potter Logo');
      expect(logo).toBeInTheDocument();
      expect(screen.getByText('Deej Potter')).toBeInTheDocument();
    });

    it('displays dropdown arrow indicator for Projects', () => {
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      expect(projectsButton).toContainHTML('▾');
    });
  });

  describe('Dropdown Menu Functionality', () => {
    it('opens dropdown on mouse enter', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      
      // Initially, dropdown should not be visible
      expect(screen.queryByText('Websites')).not.toBeInTheDocument();
      
      // Hover over Projects
      await user.hover(projectsButton.parentElement!);
      
      // Dropdown should appear with all categories
      await waitFor(() => {
        expect(screen.getByText('Websites')).toBeInTheDocument();
      });
      expect(screen.getByText('Engineering')).toBeInTheDocument();
      expect(screen.getByText('Games')).toBeInTheDocument();
      expect(screen.getByText('Tools')).toBeInTheDocument();
    });

    it('closes dropdown on mouse leave with delay', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      
      // Open dropdown
      await user.hover(projectsButton.parentElement!);
      await waitFor(() => {
        expect(screen.getByText('Websites')).toBeInTheDocument();
      });
      
      // Move mouse away
      await user.unhover(projectsButton.parentElement!);
      
      // Dropdown should close after delay (150ms)
      await waitFor(() => {
        expect(screen.queryByText('Websites')).not.toBeInTheDocument();
      }, { timeout: 300 });
    });

    it('toggles dropdown on button click', async () => {
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      
      // Initially, dropdown should not be visible
      expect(screen.queryByText('Websites')).not.toBeInTheDocument();
      
      // Use fireEvent.click (not userEvent) to dispatch only the click event
      // without the full pointer lifecycle that triggers onMouseEnter first.
      fireEvent.click(projectsButton);
      await waitFor(() => {
        expect(screen.getByText('Websites')).toBeInTheDocument();
      });
      
      // Click to close
      fireEvent.click(projectsButton);
      await waitFor(() => {
        expect(screen.queryByText('Websites')).not.toBeInTheDocument();
      });
    });

    it('updates aria-expanded attribute correctly', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      
      // Initially collapsed
      expect(projectsButton).toHaveAttribute('aria-expanded', 'false');
      
      // Hover to open
      await user.hover(projectsButton.parentElement!);
      await waitFor(() => {
        expect(projectsButton).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('rotates arrow indicator when dropdown opens', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      const arrow = projectsButton.querySelector('span');
      
      // Initially 0 degrees
      expect(arrow).toHaveStyle({ transform: 'rotate(0deg)' });
      
      // Open dropdown
      await user.hover(projectsButton.parentElement!);
      await waitFor(() => {
        expect(arrow).toHaveStyle({ transform: 'rotate(180deg)' });
      });
    });
  });

  describe('Navigation Structure', () => {
    it('displays all project categories in correct order', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      await user.hover(projectsButton.parentElement!);
      
      await waitFor(() => {
        const categories = ['Websites', 'Engineering', 'Games', 'Tools'];
        categories.forEach(category => {
          expect(screen.getByText(category)).toBeInTheDocument();
        });
      });
    });

    it('does not display Apps category (removed)', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      await user.hover(projectsButton.parentElement!);
      
      await waitFor(() => {
        expect(screen.getByText('Websites')).toBeInTheDocument();
      });
      
      // Apps category should not exist
      expect(screen.queryByText('Apps')).not.toBeInTheDocument();
    });

    it('displays Websites project links', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      await user.hover(projectsButton.parentElement!);
      
      // "Deej Potter" appears in both the logo and the dropdown mega-menu.
      // Use getAllByText and check that the dropdown link is present.
      await waitFor(() => {
        const matches = screen.getAllByText('Deej Potter');
        // At least 2: logo text + dropdown link
        expect(matches.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('displays Tools project links', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      await user.hover(projectsButton.parentElement!);
      
      await waitFor(() => {
        expect(screen.getByText('20 Series Cut Calculator')).toBeInTheDocument();
      });
    });

    it('displays Engineering project links', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      await user.hover(projectsButton.parentElement!);
      
      await waitFor(() => {
        expect(screen.getByText('Wireless Car')).toBeInTheDocument();
      });
    });

    it('displays Games project links', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      await user.hover(projectsButton.parentElement!);
      
      await waitFor(() => {
        expect(screen.getByText('Basic Bases')).toBeInTheDocument();
      });
    });
  });

  describe('Mobile Navigation', () => {
    it('renders mobile menu toggle button', () => {
      renderNavbar();
      
      const mobileToggle = screen.getByLabelText('Toggle navigation');
      expect(mobileToggle).toBeInTheDocument();
    });

    it('toggles mobile menu on button click', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const mobileToggle = screen.getByLabelText('Toggle navigation');
      
      // Mobile nav is the one labelled "Mobile navigation"
      const mobileNav = screen.getByRole('navigation', { name: /mobile/i, hidden: true });
      expect(mobileNav).toHaveAttribute('aria-expanded', 'false');
      
      // Click to expand
      await user.click(mobileToggle);
      await waitFor(() => {
        expect(mobileNav).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Dropdown Styling', () => {
    it('applies gradient background to dropdown', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      await user.hover(projectsButton.parentElement!);
      
      await waitFor(() => {
        const dropdown = screen.getByText('Websites').closest('div[class*="navbar-dropdown-gradient"]');
        expect(dropdown).toHaveClass('navbar-dropdown-gradient');
      });
    });

    it('positions dropdown at fixed top-16', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      await user.hover(projectsButton.parentElement!);
      
      await waitFor(() => {
        const dropdown = screen.getByText('Websites').closest('div[class*="fixed"]');
        expect(dropdown).toHaveClass('fixed');
        expect(dropdown).toHaveClass('top-16');
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      renderNavbar();
      
      // Desktop nav labelled "Primary" and mobile nav labelled "Mobile navigation"
      expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: /mobile/i, hidden: true })).toBeInTheDocument();
      expect(screen.getByLabelText('Toggle navigation')).toBeInTheDocument();
    });

    it('keyboard navigation works for dropdown', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      
      // Focus the Projects button directly
      projectsButton.focus();
      
      // Enter to open dropdown
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(screen.getByText('Websites')).toBeInTheDocument();
      });
    });

    it('ESC key closes dropdown', async () => {
      const user = userEvent.setup();
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      
      // Use fireEvent.click to open without hover interference
      fireEvent.click(projectsButton);
      
      await waitFor(() => {
        expect(screen.getByText('Websites')).toBeInTheDocument();
      });
      
      // Press ESC
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByText('Websites')).not.toBeInTheDocument();
      });
    });
  });

  describe('Authentication Buttons', () => {
    it('renders auth loading state when Clerk is not initialised', () => {
      renderNavbar();
      // AuthButton shows a loading spinner when isLoaded is false
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });
});
