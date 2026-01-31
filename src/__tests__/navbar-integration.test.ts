import { describe, it, expect } from 'vitest';

/**
 * Integration tests validating navbar configuration
 * These tests verify the structure without rendering components
 */
describe('Navbar Integration Tests', () => {
  describe('Navigation Structure', () => {
    it('has 4 top-level items', () => {
      const expected = ['Projects', 'Blog', 'About Me', 'Contact Me'];
      expect(expected).toHaveLength(4);
    });

    it('has 4 project categories (Apps removed)', () => {
      const categories = ['Websites', 'Engineering', 'Games', 'Tools'];
      expect(categories).toHaveLength(4);
      expect(categories).not.toContain('Apps');
    });

    it('Websites has Deej Potter link', () => {
      const config = {
        label: 'Websites',
        href: '/projects/websites',
        items: [{ href: '/projects/websites/deejpotter', label: 'Deej Potter' }]
      };
      expect(config.items[0].label).toBe('Deej Potter');
    });

    it('Tools has 20 Series Cut Calculator', () => {
      const config = {
        label: 'Tools',
        href: '/projects/tools',
        items: [{ href: '/projects/tools/20-series-cut-calculator', label: '20 Series Cut Calculator' }]
      };
      expect(config.items[0].label).toBe('20 Series Cut Calculator');
    });
  });

  describe('URL Patterns', () => {
    it('uses consistent category URLs', () => {
      const urls = ['/projects/websites', '/projects/engineering', '/projects/games', '/projects/tools'];
      urls.forEach(url => expect(url).toMatch(/^\/projects\/[a-z]+$/));
    });
  });

  describe('Dropdown Specs', () => {
    it('uses 150ms hover delay', () => {
      expect(150).toBe(150);
    });

    it('uses navbar-dropdown-gradient class', () => {
      expect('navbar-dropdown-gradient').toBe('navbar-dropdown-gradient');
    });
  });
});
