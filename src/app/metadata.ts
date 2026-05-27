import { Metadata } from 'next';

/**
 * Default metadata for the portfolio site
 * Individual pages can override these values
 */
export const defaultMetadata: Metadata = {
  title: {
    default: 'Deej Potter | Websites, 3D Printing & Fabrication',
    template: '%s | Deej Potter'
  },
  description: 'Website design, 3D printing, laser cutting, and CNC milling for small businesses and hobbyists. Upload a file, see your model in 3D, and get an instant price. Based in Frankston VIC.',
  keywords: [
    'Website Designer',
    'Website Developer',
    'Web Design',
    'Web Development',
    'CAD/CAM',
    'Fabrication',
    '3D Printing',
    'Laser Cutting',
    'Milling',
    'Next.js',
    'React',
    'TypeScript',
    'Portfolio Website',
    'Landing Pages',
    'Custom Web Tools'
  ],
  authors: [{ name: 'Daniel Potter', url: 'https://deejpotter.com' }],
  creator: 'Daniel Potter',
  publisher: 'Daniel Potter',
  metadataBase: new URL('https://deejpotter.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://deejpotter.com',
    siteName: 'Deej Potter',
    title: 'Deej Potter | Websites, 3D Printing & Fabrication',
    description: 'Website design, 3D printing, laser cutting, and CNC milling. Upload a file, see your model in 3D, get an instant price. Frankston VIC.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Deej Potter - Website Designer and Developer'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deej Potter | Website Designer and Developer',
    description: 'Website designer, maker, and developer building practical websites, portfolio sites, custom digital tools, and light fabrication work.',
    images: ['/og-image.png'],
    creator: '@deejpotter'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    // Add Google Search Console verification code when available
    // google: 'your-google-verification-code',
  }
};

/**
 * Helper to generate page-specific metadata
 * @param title - Page title (will be templated with site name)
 * @param description - Page description for SEO
 * @param path - Relative path from root (e.g., '/contact')
 * @param ogImage - Optional custom OG image path
 */
export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  ogImage?: string
): Metadata {
  const url = `https://deejpotter.com${path}`;
  const image = ogImage || '/og-image.png';

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      title,
      description,
      images: [image]
    }
  };
}
