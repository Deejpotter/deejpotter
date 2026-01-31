export function defaultLoader({ src }) {
  return typeof src === 'string' ? src : String(src);
}
