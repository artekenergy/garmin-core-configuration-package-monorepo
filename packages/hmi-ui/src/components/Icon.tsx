/**
 * Icon Component
 *
 * Renders icons from registry with inline SVG or URL modes.
 * Sanitizes SVG to prevent XSS.
 * Falls back to preset glyphs or default placeholder.
 *
 * ES2017 compliant.
 */

import { h } from 'preact';
import type { IconSpec } from '../types/icon';
import { getIcon } from '../utils/icon-registry';
import { getFallbackIcon, DEFAULT_FALLBACK_SVG } from '../utils/icon-fallbacks';

export interface IconProps {
  /** Icon ID from schema */
  iconId?: string;
  /** Direct icon spec (bypasses registry) */
  icon?: IconSpec;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Preset fallback (for tabs) */
  preset?: string;
  /** Accessible title */
  title?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * Sanitize SVG markup
 * Removes script tags and event handlers
 */
function sanitizeSVG(svg: string): string {
  return svg
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s*on\w+="[^"]*"/gi, '')
    .replace(/\s*on\w+='[^']*'/gi, '');
}

export function Icon(props: IconProps) {
  const { iconId, icon, size = 'md', preset, title, className = '' } = props;

  // Resolve icon spec
  let iconSpec: IconSpec | undefined = icon;

  // If no direct icon spec, try to resolve from registry or handle special cases
  if (!iconSpec && iconId) {
    // Emoji or short text (1-3 characters) - render directly
    if (iconId.length <= 3) {
      iconSpec = {
        id: iconId,
        svg:
          '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-size="20">' +
          iconId +
          '</text>',
      };
    } else {
      // Try registry lookup
      iconSpec = getIcon(iconId);
    }
  }

  // Size class
  const sizeClass = 'gcg-icon--' + size;

  let content: h.JSX.Element;
  if (iconSpec) {
    // Use resolved icon from registry or direct spec
    if (iconSpec.svg) {
      const sanitized = sanitizeSVG(iconSpec.svg);
      content = <span dangerouslySetInnerHTML={{ __html: sanitized }} />;
    } else if (iconSpec.url) {
      content = <img src={iconSpec.url} alt="" role="presentation" />;
    } else {
      // Icon spec exists but no data
      content = <span dangerouslySetInnerHTML={{ __html: DEFAULT_FALLBACK_SVG }} />;
    }
  } else {
    // Try preset fallback
    const fallbackSvg = getFallbackIcon(preset);
    if (fallbackSvg) {
      content = <span dangerouslySetInnerHTML={{ __html: fallbackSvg }} />;
    } else {
      // Ultimate fallback
      content = <span dangerouslySetInnerHTML={{ __html: DEFAULT_FALLBACK_SVG }} />;
    }
  }

  return (
    <span
      class={'gcg-icon ' + sizeClass + (className ? ' ' + className : '')}
      title={title}
      data-icon-id={iconId}
      aria-hidden={!title}
    >
      {content}
    </span>
  );
}
