/**
 * Centralized env var access.
 * Reads from process.env first (set at bundle time), then falls back to
 * Constants.expoConfig.extra (baked in by app.config.js when process.env is empty).
 */
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};

export function getEnv(key) {
  return process.env[key] ?? extra[key] ?? '';
}
