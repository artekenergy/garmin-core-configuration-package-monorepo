/**
 * Binding Resolver
 *
 * Resolves schema bindings to EmpirBus channel IDs and encodes
 * them as low/high byte pairs for WebSocket messages.
 *
 * ES2017 compliant.
 */

import type { Binding } from '@gcg/schema';
import { schemaSignal } from '../state/schema-signal';

/**
 * Resolve a binding to a signal ID using the loaded schema
 *
 * @param binding - The binding to resolve
 * @param action - The action type: 'toggle', 'momentary', or 'dimmer'
 */
export function resolveBindingToChannelId(
  binding: Binding,
  action?: 'toggle' | 'momentary' | 'dimmer'
): number | null {
  if (!binding) {
    return null;
  }

  // EmpirBus binding type
  if (binding.type === 'empirbus') {
    const channelRef = binding.channel;

    // If it's already a number, return it
    if (typeof channelRef === 'number') {
      return channelRef;
    }

    // If it's a string, look up in hardware.outputs
    if (typeof channelRef === 'string') {
      const schema = schemaSignal.value;
      if (!schema || !schema.hardware || !schema.hardware.outputs) {
        console.warn('No hardware config available to resolve channel:', channelRef);
        return null;
      }

      // Find the output with matching id
      const output = schema.hardware.outputs.find(function (out) {
        return out.id === channelRef;
      });

      if (!output) {
        console.warn('Could not resolve channel reference:', channelRef);
        return null;
      }

      // If output has signals and action is specified, return the signal ID
      if (output.signals && action && output.signals[action]) {
        console.log(
          'Resolved',
          channelRef,
          'with action',
          action,
          'to signal',
          output.signals[action]
        );
        return output.signals[action];
      }

      // Fallback to channel number for backward compatibility
      if (typeof output.channel === 'number') {
        console.warn(
          'Using fallback channel number for',
          channelRef,
          '- consider adding signals to schema'
        );
        return output.channel;
      }

      console.warn('Could not resolve channel reference:', channelRef);
      return null;
    }
  }

  // NMEA2000 binding type
  if (binding.type === 'nmea2000') {
    // NMEA signals use PGN + instance as signal ID
    // This would need proper NMEA signal ID calculation
    // TODO: Implement NMEA signal ID resolution
    return null;
  }

  // Static binding type
  if (binding.type === 'static') {
    // Static bindings don't send messages
    return null;
  }

  return null;
}

/**
 * Encode channel ID as low/high byte pair
 */
export function encodeChannelId(channelId: number): { lo: number; hi: number } {
  return {
    lo: channelId & 0xff,
    hi: (channelId >> 8) & 0xff,
  };
}

/**
 * Create a toggle/switch command message (messagetype: 17, messagecmd: 1)
 */
export function createToggleMessage(channelId: number, state: boolean) {
  const { lo, hi } = encodeChannelId(channelId);
  return {
    messagetype: 17,
    messagecmd: 1,
    size: 3,
    data: [lo, hi, state ? 1 : 0],
  };
}

/**
 * Create a dimmer command message (messagetype: 17, messagecmd: 3)
 */
export function createDimmerMessage(
  channelId: number,
  valuePercent: number,
  dimmerIndex: number = 0
) {
  const { lo, hi } = encodeChannelId(channelId);
  const idx = Number(dimmerIndex) | 0;
  const pct = Math.max(0, Math.min(100, Number(valuePercent) || 0));

  // Use 0.1% resolution (multiply by 10)
  const t = Math.round(pct * 10);
  const tLo = t & 0xff;
  const tHi = (t >> 8) & 0xff;

  return {
    messagetype: 17,
    messagecmd: 3,
    size: 5,
    data: [lo, hi, idx, tLo, tHi],
  };
}
