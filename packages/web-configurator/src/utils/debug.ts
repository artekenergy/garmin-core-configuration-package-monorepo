/**
 * Debug utility for conditional logging
 *
 * Automatically removes debug logs in production builds.
 * Keeps warnings and errors for production diagnostics.
 */

const IS_DEV = import.meta.env.DEV;

export const debug = {
  /**
   * Debug logging - removed in production
   */
  log: (...args: unknown[]) => {
    if (IS_DEV) {
      console.log(...args);
    }
  },

  /**
   * Warning - kept in production
   */
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },

  /**
   * Error - kept in production
   */
  error: (...args: unknown[]) => {
    console.error(...args);
  },

  /**
   * Info - removed in production
   */
  info: (...args: unknown[]) => {
    if (IS_DEV) {
      console.info(...args);
    }
  },

  /**
   * Grouped debug output - removed in production
   */
  group: (label: string, fn: () => void) => {
    if (IS_DEV) {
      console.group(label);
      fn();
      console.groupEnd();
    }
  },

  /**
   * Table output - removed in production
   */
  table: (data: unknown) => {
    if (IS_DEV) {
      console.table(data);
    }
  },
};
