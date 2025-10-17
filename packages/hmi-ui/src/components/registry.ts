import type { FunctionComponent } from 'preact';
import { Toggle } from './Toggle';
import { Button } from './Button';
import { Dimmer } from './Dimmer';
import { Gauge } from './Gauge';
import { Indicator } from './Indicator';
import { Slider } from './Slider';
import { MultiplusControl } from './MultiplusControl';

export const COMPONENT_REGISTRY: Record<string, FunctionComponent<any>> = {
  toggle: Toggle,
  button: Button,
  dimmer: Dimmer,
  gauge: Gauge,
  indicator: Indicator,
  slider: Slider,
  'multiplus-control': MultiplusControl,
};
