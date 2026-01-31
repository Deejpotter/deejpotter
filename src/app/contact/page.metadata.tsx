import { Metadata } from 'next';
import { generatePageMetadata } from '../metadata';
import ContactForm from './ContactForm';

// Generate page-specific metadata with SEO optimization
export const metadata: Metadata = generatePageMetadata(
  'Contact',
  'Get in touch with Deej Potter. Have questions about my work or want to collaborate? Fill out the contact form and I\'ll get back to you soon.',
  '/contact'
);

export default function ContactPage() {
  return <ContactForm />;
}
