import { MetadataRoute } from 'next';

const routes = [
  '',
  '/about',
  '/contact',
  '/blog',
  '/projects/apps',
  '/projects/engineering',
  '/projects/games',
  '/projects/services',
  '/projects/tools',
  '/projects/websites',
  '/projects/apps/todo-app',
  '/projects/engineering/wireless-car',
  '/projects/games/basic-bases',
  '/projects/games/basic-bases/basic-bases-privacy',
  '/projects/services/3d-printing',
  '/projects/tools/20-series-cut-calculator',
  '/projects/tools/box-shipping-calculator',
  '/projects/tools/cnc-calibration-tool',
  '/projects/tools/cnc-technical-ai',
  '/projects/tools/linear-cut-calculator',
  '/projects/websites/deejpotter',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://deejpotter.com';
  const now = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/contact' ? 0.9 : route.startsWith('/projects/websites') ? 0.85 : 0.7,
  }));
}
