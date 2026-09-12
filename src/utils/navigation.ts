/**
 * Google Maps URL normalization and navigation utilities
 */

/**
 * Ensures a Google Maps URL is valid, securely formatted, and properly handles
 * short links (maps.app.goo.gl), standard web links, or fallback address queries.
 */
export function normalizeGoogleMapsUrl(
  rawUrl?: string,
  fallbackVenue?: string,
  fallbackAddress?: string
): string {
  const trimmed = (rawUrl || '').trim();

  if (trimmed) {
    // Already fully qualified with http/https
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    // Common link without protocol (e.g. maps.app.goo.gl/xxx or goo.gl/maps/xxx or maps.google.com/...)
    if (
      trimmed.startsWith('maps.app.goo.gl') ||
      trimmed.startsWith('goo.gl/maps') ||
      trimmed.startsWith('maps.google.') ||
      trimmed.startsWith('www.google.com/maps') ||
      trimmed.startsWith('google.com/maps') ||
      trimmed.startsWith('www.')
    ) {
      return `https://${trimmed}`;
    }

    // If coordinates format: e.g. "18.5204, 73.8567"
    if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(trimmed)) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed.replace(/\s+/g, ''))}`;
    }

    // If it looks like a domain or URL without protocol
    if (trimmed.includes('.') && !trimmed.includes(' ')) {
      return `https://${trimmed}`;
    }

    // Otherwise, treat as a textual place query
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
  }

  // Fallback if no URL is provided: generate search query from venue and address
  const queryParts = [fallbackVenue, fallbackAddress].filter(Boolean);
  const query = queryParts.join(', ') || 'Pune, Maharashtra';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Checks if a string looks like a valid Google Maps URL or standard web link
 */
export function isValidMapsUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return (
    /^https?:\/\//i.test(trimmed) ||
    trimmed.includes('maps.app.goo.gl') ||
    trimmed.includes('goo.gl/maps') ||
    trimmed.includes('google.com/maps')
  );
}
