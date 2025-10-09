/**
 * Section Component
 *
 * Renders a titled section with a responsive grid of components.
 * Grid adapts to display size:
 * - Default: 4 columns
 * - Serv 10 (1084x606): 3 columns
 * - Serv 7 (958x489): 2 columns
 *
 * ES2017 compliant.
 */

import type { Section as SectionType } from '@gcg/schema';
import { ComponentRenderer } from './ComponentRenderer';

export interface SectionProps {
  section: SectionType;
  hideTitle?: boolean;
}

export function Section(props: SectionProps) {
  const { section, hideTitle } = props;

  return (
    <div className="gcg-section">
      {/* Section Title */}
      {!hideTitle && <h2 className="gcg-section__title">{section.title}</h2>}

      {/* Component Grid */}
      <div className="gcg-section__grid">
        {section.components.map(function (component) {
          return <ComponentRenderer key={component.id} component={component} />;
        })}
      </div>
    </div>
  );
}
