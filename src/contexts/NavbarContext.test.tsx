import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { NavbarProvider, useNavbar } from './NavbarContext';

describe('NavbarContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NavbarProvider>{children}</NavbarProvider>
  );

  describe('Navigation Structure', () => {
    it('provides correct navigation structure', () => {
      const { result } = renderHook(() => useNavbar(), { wrapper });
      
      expect(result.current.navItems).toHaveLength(4);
      expect(result.current.navItems[0].label).toBe('Projects');
      expect(result.current.navItems[1].label).toBe('Blog');
      expect(result.current.navItems[2].label).toBe('About Me');
      expect(result.current.navItems[3].label).toBe('Contact Me');
    });

    it('Projects dropdown has 4 categories (no Apps)', () => {
      const { result } = renderHook(() => useNavbar(), { wrapper });
      
      const projects = result.current.navItems.find(item => item.label === 'Projects');
      expect(projects?.items).toHaveLength(4);
      
      const categoryLabels = projects?.items?.map(item => item.label);
      expect(categoryLabels).toEqual(['Websites', 'Engineering', 'Games', 'Tools']);
    });

    it('does not include Apps category', () => {
      const { result } = renderHook(() => useNavbar(), { wrapper });
      
      const projects = result.current.navItems.find(item => item.label === 'Projects');
      const hasApps = projects?.items?.some(item => item.label === 'Apps');
      
      expect(hasApps).toBe(false);
    });

    it('Websites category has Deej Potter link', () => {
      const { result } = renderHook(() => useNavbar(), { wrapper });
      
      const projects = result.current.navItems.find(item => item.label === 'Projects');
      const websites = projects?.items?.find(item => item.label === 'Websites');
      
      expect(websites?.href).toBe('/projects/websites');
      expect(websites?.items).toHaveLength(1);
      expect(websites?.items?.[0].label).toBe('Deej Potter');
      expect(websites?.items?.[0].href).toBe('/projects/websites/deejpotter');
    });

    it('Tools category has 20 Series Cut Calculator', () => {
      const { result } = renderHook(() => useNavbar(), { wrapper });
      
      const projects = result.current.navItems.find(item => item.label === 'Projects');
      const tools = projects?.items?.find(item => item.label === 'Tools');
      
      expect(tools?.href).toBe('/projects/tools');
      expect(tools?.items).toHaveLength(1);
      expect(tools?.items?.[0].label).toBe('20 Series Cut Calculator');
      expect(tools?.items?.[0].href).toBe('/projects/tools/20-series-cut-calculator');
    });

    it('Engineering category has Wireless Car', () => {
      const { result } = renderHook(() => useNavbar(), { wrapper });
      
      const projects = result.current.navItems.find(item => item.label === 'Projects');
      const engineering = projects?.items?.find(item => item.label === 'Engineering');
      
      expect(engineering?.href).toBe('/projects/engineering');
      expect(engineering?.items).toHaveLength(1);
      expect(engineering?.items?.[0].label).toBe('Wireless Car');
    });

    it('Games category has Basic Bases', () => {
      const { result } = renderHook(() => useNavbar(), { wrapper });
      
      const projects = result.current.navItems.find(item => item.label === 'Projects');
      const games = projects?.items?.find(item => item.label === 'Games');
      
      expect(games?.href).toBe('/projects/games');
      expect(games?.items).toHaveLength(1);
      expect(games?.items?.[0].label).toBe('Basic Bases');
    });
  });

  describe('Dropdown State Management', () => {
    it('initializes with no open dropdowns', () => {
      const { result } = renderHook(() => useNavbar(), { wrapper });
      
      expect(result.current.openDropdowns).toEqual([]);
    });

    it('initializes with navbar collapsed', () => {
      const { result } = renderHook(() => useNavbar(), { wrapper });
      
      expect(result.current.isNavCollapsed).toBe(true);
    });

    it('toggles dropdown open and closed', () => {
      const { result } = renderHook(() => useNavbar(), { wrapper });
      
      // Open dropdown
      act(() => {
        result.current.toggleDropdown('Projects');
      });
      expect(result.current.openDropdowns).toContain('Projects');
      
      // Close dropdown
      act(() => {
        result.current.toggleDropdown('Projects');
      });
      expect(result.current.openDropdowns).not.toContain('Projects');
    });

    it('allows multiple dropdowns to be open', () => {
      const { result } = renderHook(() => useNavbar(), { wrapper });
      
      act(() => {
        result.current.toggleDropdown('Projects');
        result.current.toggleDropdown('Other');
      });
      
      expect(result.current.openDropdowns).toContain('Projects');
      expect(result.current.openDropdowns).toContain('Other');
    });

    it('closes all dropdowns', () => {
      const { result } = renderHook(() => useNavbar(), { wrapper });
      
      act(() => {
        result.current.toggleDropdown('Projects');
        result.current.toggleDropdown('Other');
      });
      
      expect(result.current.openDropdowns).toHaveLength(2);
      
      act(() => {
        result.current.closeAllDropdowns();
      });
      
      expect(result.current.openDropdowns).toEqual([]);
      expect(result.current.isNavCollapsed).toBe(true);
    });

    it('toggles navbar collapse state', () => {
      const { result } = renderHook(() => useNavbar(), { wrapper });
      
      expect(result.current.isNavCollapsed).toBe(true);
      
      act(() => {
        result.current.toggleNavCollapse();
      });
      
      expect(result.current.isNavCollapsed).toBe(false);
      
      act(() => {
        result.current.toggleNavCollapse();
      });
      
      expect(result.current.isNavCollapsed).toBe(true);
    });

    it('closes dropdowns when toggling navbar collapse', () => {
      const { result } = renderHook(() => useNavbar(), { wrapper });
      
      act(() => {
        result.current.toggleDropdown('Projects');
      });
      
      expect(result.current.openDropdowns).toContain('Projects');
      
      act(() => {
        result.current.toggleNavCollapse();
      });
      
      expect(result.current.openDropdowns).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    it('throws error when used outside provider', () => {
      expect(() => {
        renderHook(() => useNavbar());
      }).toThrow('useNavbar must be used within a NavbarProvider');
    });
  });
});
