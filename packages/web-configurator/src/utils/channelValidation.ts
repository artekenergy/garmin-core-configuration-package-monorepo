/**
 * Channel Validation Utilities
 *
 * Validates that component bindings reference valid hardware channels
 */

import type { UISchema, Component } from '@gcg/schema';
import type { HardwareChannel } from '../context/SchemaContext';

export interface ChannelValidationError {
  componentId: string;
  componentLabel: string;
  tabId: string;
  sectionId: string;
  bindingPath: string; // e.g., "bindings.state.channel"
  channelName: string;
  reason: string;
}

/**
 * Extract channel name from a binding
 */
function getChannelFromBinding(binding: any): string | null {
  if (!binding || typeof binding !== 'object') return null;

  // EmpirBus bindings have a 'channel' field
  if (binding.type === 'empirbus' && typeof binding.channel === 'string') {
    return binding.channel;
  }

  return null;
}

/**
 * Validate a single component's bindings
 */
function validateComponentBindings(
  component: Component,
  tabId: string,
  sectionId: string,
  availableChannels: HardwareChannel[]
): ChannelValidationError[] {
  const errors: ChannelValidationError[] = [];

  // Some components don't have bindings (e.g., multiplus-test-controls)
  if (!('bindings' in component) || !component.bindings) return errors;

  // Create a map of available channel IDs for quick lookup
  const channelMap = new Map<string, HardwareChannel>();
  availableChannels.forEach((ch) => {
    channelMap.set(ch.id, ch);
  });

  // Check each binding type
  const bindingTypes = ['state', 'intensity', 'value', 'action'];

  for (const bindingType of bindingTypes) {
    const binding = (component.bindings as any)[bindingType];
    if (!binding) continue;

    const channelName = getChannelFromBinding(binding);
    if (!channelName) continue;

    // Check if channel exists
    if (!channelMap.has(channelName)) {
      errors.push({
        componentId: component.id,
        componentLabel: component.label,
        tabId,
        sectionId,
        bindingPath: `bindings.${bindingType}.channel`,
        channelName,
        reason: `Channel "${channelName}" not found in hardware config`,
      });
      continue;
    }

    // Validate control type compatibility
    const channel = channelMap.get(channelName)!;
    const componentType = component.type;

    // Check if component type is compatible with channel control type
    if (componentType === 'dimmer' && channel.control !== 'dimmer') {
      errors.push({
        componentId: component.id,
        componentLabel: component.label,
        tabId,
        sectionId,
        bindingPath: `bindings.${bindingType}.channel`,
        channelName,
        reason: `Dimmer component requires dimmer channel, but "${channelName}" is ${channel.control}`,
      });
    }

    if (componentType === 'toggle' && channel.control === 'not-used') {
      errors.push({
        componentId: component.id,
        componentLabel: component.label,
        tabId,
        sectionId,
        bindingPath: `bindings.${bindingType}.channel`,
        channelName,
        reason: `Channel "${channelName}" is marked as not-used`,
      });
    }
  }

  return errors;
}

/**
 * Validate all component bindings in the schema
 */
export function validateAllChannelBindings(
  schema: UISchema,
  availableChannels: HardwareChannel[]
): ChannelValidationError[] {
  const errors: ChannelValidationError[] = [];

  // Iterate through all tabs
  for (const tab of schema.tabs) {
    // Iterate through all sections in each tab
    for (const section of tab.sections) {
      // Iterate through all components in each section
      for (const component of section.components) {
        const componentErrors = validateComponentBindings(
          component,
          tab.id,
          section.id,
          availableChannels
        );
        errors.push(...componentErrors);
      }
    }
  }

  return errors;
}

/**
 * Get a list of all channel names referenced in the schema
 */
export function getReferencedChannels(schema: UISchema): Set<string> {
  const channels = new Set<string>();

  for (const tab of schema.tabs) {
    for (const section of tab.sections) {
      for (const component of section.components) {
        // Some components don't have bindings (e.g., multiplus-test-controls)
        if (!('bindings' in component) || !component.bindings) continue;

        const bindingTypes = ['state', 'intensity', 'value', 'action'];
        for (const bindingType of bindingTypes) {
          const binding = (component.bindings as any)[bindingType];
          const channelName = getChannelFromBinding(binding);
          if (channelName) {
            channels.add(channelName);
          }
        }
      }
    }
  }

  return channels;
}

/**
 * Get available channels filtered by component type compatibility
 */
export function getCompatibleChannels(
  componentType: string,
  availableChannels: HardwareChannel[]
): HardwareChannel[] {
  switch (componentType) {
    case 'dimmer':
      // Dimmers can only use dimmer channels
      return availableChannels.filter((ch) => ch.control === 'dimmer');

    case 'toggle':
    case 'button':
      // Toggles and buttons can use toggle, button, or dimmer channels
      return availableChannels.filter(
        (ch) =>
          ch.control === 'toggle-button' || ch.control === 'push-button' || ch.control === 'dimmer'
      );

    case 'gauge':
      // Gauges typically read sensor values, not output channels
      // But they could read dimmer intensity as a value
      return availableChannels;

    default:
      // Return all channels for unknown types
      return availableChannels;
  }
}
