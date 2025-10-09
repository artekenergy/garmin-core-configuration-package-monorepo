/**
 * Hardware configuration constants
 * Defines available channels for CORE and CORE LITE systems
 */

import type { OutputChannel, HalfBridgePair } from '@gcg/schema';

/**
 * CORE system - 20 output channels
 */
export const CORE_CHANNELS: Pick<OutputChannel, 'source' | 'channel'>[] = [
  { source: 'core', channel: 1 },
  { source: 'core', channel: 2 },
  { source: 'core', channel: 3 }, // Can pair with 4
  { source: 'core', channel: 4 }, // Can pair with 3
  { source: 'core', channel: 5 },
  { source: 'core', channel: 9 },
  { source: 'core', channel: 10 },
  { source: 'core', channel: 11 },
  { source: 'core', channel: 12 }, // Can pair with 13
  { source: 'core', channel: 13 }, // Can pair with 12
  { source: 'core', channel: 17 },
  { source: 'core', channel: 18 },
  { source: 'core', channel: 19 },
  { source: 'core', channel: 20 },
  { source: 'core', channel: 21 },
  { source: 'core', channel: 25 },
  { source: 'core', channel: 26 },
  { source: 'core', channel: 27 },
  { source: 'core', channel: 28 },
  { source: 'core', channel: 29 },
];

/**
 * CORE LITE system - 10 output channels (6 CORE-LITE + 4 Genesis)
 */
export const CORE_LITE_CHANNELS: Pick<OutputChannel, 'source' | 'channel'>[] = [
  { source: 'core-lite', channel: 1 },
  { source: 'core-lite', channel: 2 },
  { source: 'core-lite', channel: 3 },
  { source: 'core-lite', channel: 4 },
  { source: 'core-lite', channel: 5 },
  { source: 'core-lite', channel: 6 },
];

/**
 * Generate Genesis board channels based on number of boards
 * Each board has 4 channels
 */
export function generateGenesisChannels(
  boardCount: number
): Pick<OutputChannel, 'source' | 'channel'>[] {
  const channels: Pick<OutputChannel, 'source' | 'channel'>[] = [];
  for (let board = 1; board <= boardCount; board++) {
    for (let channel = 1; channel <= 4; channel++) {
      channels.push({
        source: 'genesis',
        channel: (board - 1) * 4 + channel, // Board 1: 1-4, Board 2: 5-8, etc.
      });
    }
  }
  return channels;
}

/**
 * Half-bridge pairs - CORE only
 * These channel pairs can be used for bidirectional motor control
 */
export const HALF_BRIDGE_PAIRS: Omit<HalfBridgePair, 'enabled'>[] = [
  { source: 'core', channelA: 3, channelB: 4 },
  { source: 'core', channelA: 12, channelB: 13 },
];

/**
 * Control type to component mapping
 */
export const CONTROL_COMPONENT_MAP = {
  'not-used': null,
  'push-button': {
    component: 'button' as const,
    action: 'momentary' as const,
    width: 3,
  },
  'toggle-button': {
    component: 'toggle' as const,
    width: 3,
  },
  dimmer: {
    component: 'dimmer' as const,
    width: 6,
  },
  slider: {
    component: 'dimmer' as const,
    width: 6,
  },
  'half-bridge': {
    component: 'dimmer' as const,
    width: 6,
  },
  'special-function': {
    component: 'button' as const,
    action: 'momentary' as const,
    width: 3,
  },
} as const;

/**
 * Generate channel ID from source and channel number
 */
export function generateChannelId(source: string, channel: number): string {
  return `${source}-${String(channel).padStart(2, '0')}`;
}

/**
 * Parse channel ID into source and channel number
 */
export function parseChannelId(id: string): { source: string; channel: number } | null {
  const match = id.match(/^([a-z-]+)-(\d+)$/);
  if (!match || !match[1] || !match[2]) return null;

  return {
    source: match[1],
    channel: parseInt(match[2], 10),
  };
}

/**
 * Check if a channel is part of a half-bridge pair
 */
export function findHalfBridgePair(
  source: string,
  channel: number
): Omit<HalfBridgePair, 'enabled'> | null {
  return (
    HALF_BRIDGE_PAIRS.find(
      (pair) => pair.source === source && (pair.channelA === channel || pair.channelB === channel)
    ) || null
  );
}

/**
 * Check if a channel is the primary channel in a half-bridge pair
 */
export function isPrimaryChannel(
  source: string,
  channel: number,
  pair: Omit<HalfBridgePair, 'enabled'>
): boolean {
  return pair.source === source && pair.channelA === channel;
}
