/**
 * Fallback Icon Map
 *
 * Provides default SVG icons for common tab presets
 * when icons are not available in the schema.
 *
 * ES2017 compliant.
 */

const FALLBACK_MAP: Record<string, string> = {
  home: '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/></svg>',
  power:
    '<svg viewBox="0 0 24 24"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42A6.92 6.92 0 0 1 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.12.94-4.02 2.42-5.32L6 5.17A8.94 8.94 0 0 0 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9a8.94 8.94 0 0 0-3.17-6.83z" fill="currentColor"/></svg>',
  lighting:
    '<svg viewBox="0 0 24 24"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" fill="currentColor"/></svg>',
  hvac: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>',
  switching:
    '<svg viewBox="0 0 24 24"><path d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="currentColor"/></svg>',
  plumbing:
    '<svg viewBox="0 0 24 24"><path d="M5 3h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm0 16h14V5H5v14z" fill="currentColor"/></svg>',
};

/**
 * Get fallback icon SVG for a preset tab ID
 */
export function getFallbackIcon(presetId?: string): string | undefined {
  if (!presetId) {
    return undefined;
  }
  return FALLBACK_MAP[presetId.toLowerCase()];
}

/**
 * Default fallback glyph when no icon or fallback available
 */
export const DEFAULT_FALLBACK_SVG =
  '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" fill="currentColor" opacity="0.3"/></svg>';
