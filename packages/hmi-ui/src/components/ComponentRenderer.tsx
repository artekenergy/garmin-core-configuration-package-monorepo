/**
 * Component Renderer
 *
 * Renders UI components from schema definitions.
 * Maps component types to their Preact implementations.
 *
 * ES2017 compliant.
 */

import type { Component } from '@gcg/schema';
import { Toggle } from './Toggle';
import { Button } from './Button';
import { Dimmer } from './Dimmer';
import { Indicator } from './Indicator';
import { Gauge } from './Gauge';
import { Slider } from './Slider';
import { MultiplusControl } from './MultiplusControl';

interface ComponentRendererProps {
  component: Component;
}

/**
 * Render a single component based on its type
 */
export function ComponentRenderer(props: ComponentRendererProps) {
  const { component } = props;

  switch (component.type) {
    case 'toggle':
      return <Toggle component={component} />;

    case 'button':
      return <Button component={component} />;

    case 'dimmer':
      return <Dimmer component={component} />;

    case 'gauge':
      return <Gauge component={component} />;

    case 'indicator':
      return <Indicator component={component} />;

    case 'slider':
      return <Slider component={component} />;

    case 'multiplus-control':
      return <MultiplusControl component={component} />;

    default: {
      const unknownComponent = component as { type: string };
      return (
        <div style={{ padding: '1rem', background: 'rgba(255, 0, 0, 0.1)' }}>
          Unknown component type: {unknownComponent.type}
        </div>
      );
    }
  }
}
