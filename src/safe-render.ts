/**
 * Safe rendering utilities — always use textContent (not innerHTML)
 * to prevent XSS when rendering user-provided data like player names
 * or scores.
 */

/**
 * Render a score value safely using textContent.
 * @param score - The score number or string
 * @returns Sanitized string safe for textContent
 */
export function renderScore(score: number | string | null | undefined): string {
  if (score === null || score === undefined) {
    return '';
  }
  // Sanitize: remove any HTML tags
  const sanitized = String(score).replace(/<[^>]*>/g, '');
  return sanitized;
}

/**
 * Render a player name safely using textContent.
 * Escapes HTML entities to prevent XSS.
 * @param name - The player name string
 * @returns Sanitized string safe for textContent
 */
export function renderName(name: string | null | undefined): string {
  if (name === null || name === undefined) {
    return '';
  }
  // Escape HTML entities
  const sanitized = name
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  return sanitized;
}
