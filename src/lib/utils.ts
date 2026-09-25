/**
 * Shared utility functions used across the codebase.
 */

/**
 * Escape HTML entities to prevent XSS when rendering user-provided content.
 * Use this whenever user input is interpolated into HTML strings.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
