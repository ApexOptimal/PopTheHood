/**
 * Simple client-side rate limiter.
 * Tracks calls by feature key with a configurable cooldown and daily cap.
 */

const state = {};

function getOrCreate(key, { cooldownMs = 3000, dailyLimit = 50 } = {}) {
  if (!state[key]) {
    state[key] = { lastCall: 0, todayCount: 0, resetDay: new Date().toDateString(), cooldownMs, dailyLimit };
  }
  const s = state[key];
  const today = new Date().toDateString();
  if (s.resetDay !== today) {
    s.todayCount = 0;
    s.resetDay = today;
  }
  return s;
}

/**
 * Check whether a call to `key` is allowed.
 * @returns {{ allowed: boolean, reason?: string, retryAfterMs?: number }}
 */
export function checkRateLimit(key, options) {
  const s = getOrCreate(key, options);
  const now = Date.now();
  const elapsed = now - s.lastCall;

  if (elapsed < s.cooldownMs) {
    return { allowed: false, reason: 'Please wait a moment before trying again.', retryAfterMs: s.cooldownMs - elapsed };
  }
  if (s.todayCount >= s.dailyLimit) {
    return { allowed: false, reason: `You've reached the daily limit for this feature. Try again tomorrow.` };
  }
  return { allowed: true };
}

/**
 * Record that a call to `key` was made. Call this after the request starts.
 */
export function recordCall(key, options) {
  const s = getOrCreate(key, options);
  s.lastCall = Date.now();
  s.todayCount += 1;
}
