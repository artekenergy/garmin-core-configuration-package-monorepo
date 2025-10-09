/**
 * Home Tab Layout Component
 *
 * Special layout for the Home tab that supports:
 * - 1 section: Full width
 * - 2 sections: Side-by-side (50/50 split)
 *
 * ES2017 compliant.
 */

import { Section } from './Section';
import type { Section as SectionType } from '@gcg/schema';

export interface HomeLayoutProps {
  sections: SectionType[];
}

export function HomeLayout(props: HomeLayoutProps) {
  const { sections } = props;

  // Filter to enabled sections only
  const enabledSections = sections.filter(function (section) {
    return section.enabled !== false;
  });

  const sectionCount = enabledSections.length;

  if (sectionCount === 0) {
    return (
      <div className="gcg-home-layout gcg-home-layout--empty">
        <p>No sections configured</p>
      </div>
    );
  }

  // Single section: Full width
  if (sectionCount === 1) {
    return (
      <div className="gcg-home-layout gcg-home-layout--single">
        <Section section={enabledSections[0]!} />
      </div>
    );
  }

  // Two sections: Side-by-side
  return (
    <div className="gcg-home-layout gcg-home-layout--dual">
      <div className="gcg-home-layout__section">
        <Section section={enabledSections[0]!} />
      </div>
      <div className="gcg-home-layout__section">
        <Section section={enabledSections[1]!} />
      </div>
    </div>
  );
}
