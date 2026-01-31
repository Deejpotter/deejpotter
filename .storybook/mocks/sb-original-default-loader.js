export function defaultLoader({ src }) {
  // Minimal loader that returns the source unmodified for tests
  return typeof src === 'string' ? src : String(src);
}
