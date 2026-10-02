import { Metadata } from 'next';

/**
 * Default metadata for the portfolio site
 * Individual pages can override these values
 */
export const defaultMetadata: Metadata = {
  title: {
    default: 'Deej Potter | Developer and Maker',
    template: '%s | Deej Potter'
  },
  description: "Deej Potter's personal projects: web apps, ESP32 firmware, AI agents, browser games and maker tools. Code on GitHub.",
  keywords: [
    'Deej Potter',
    'Developer',
    'Maker',
    'Next.js',
    'React',
    'TypeScript',
    'ESP32',
    'LVGL',
    'AI agents',
    'Open source'
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
    title: 'Deej Potter | Developer and Maker',
    description: "Deej Potter's personal projects: web apps, ESP32 firmware, AI agents, browser games and maker tools. Code on GitHub.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Deej Potter, developer and maker'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deej Potter | Developer and Maker',
    description: "Deej Potter's personal projects: web apps, ESP32 firmware, AI agents, browser games and maker tools. Code on GitHub.",
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
