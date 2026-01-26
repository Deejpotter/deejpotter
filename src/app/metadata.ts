import { Metadata } from 'next';

/**
 * Default metadata for the portfolio site
 * Individual pages can override these values
 */
export const defaultMetadata: Metadata = {
  title: {
    default: 'Deej Potter | Full-Stack Developer',
    template: '%s | Deej Potter'
  },
  description: 'Full-stack developer portfolio showcasing web projects, technical apps, and engineering work. Formerly a chef, now building modern web applications with Next.js, React, and TypeScript.',
  keywords: ['Full-Stack Developer', 'Web Development', 'Next.js', 'React', 'TypeScript', 'Portfolio', 'Software Engineer'],
  authors: [{ name: 'Daniel Potter', url: 'https://deejpotter.com' }],
  creator: 'Daniel Potter',
  publisher: 'Daniel Potter',
  metadataBase: new URL('https://deejpotter.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://deejpotter.com',
    siteName: 'Deej Potter Portfolio',
    title: 'Deej Potter | Full-Stack Developer',
    description: 'Full-stack developer portfolio showcasing web projects, technical apps, and engineering work.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Deej Potter - Full-Stack Developer'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deej Potter | Full-Stack Developer',
    description: 'Full-stack developer portfolio showcasing web projects, technical apps, and engineering work.',
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
