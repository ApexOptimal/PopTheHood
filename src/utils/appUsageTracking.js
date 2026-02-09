/**
 * Track app usage time for paywall triggering
 * Tracks time since onboarding completion
 */

import { storage } from './storage';

const ONBOARDING_COMPLETION_TIME_KEY = 'onboardingCompletionTime';
const TOTAL_USAGE_TIME_KEY = 'totalUsageTime';
const LAST_SESSION_START_KEY = 'lastSessionStart';

/**
 * Record when onboarding was completed
 */
export async function recordOnboardingCompletion() {
  const now = new Date().toISOString();
  await storage.set(ONBOARDING_COMPLETION_TIME_KEY, now);
  await storage.set(LAST_SESSION_START_KEY, now);
}

/**
 * Get the time when onboarding was completed
 * @returns {Date|null} Onboarding completion time or null
 */
export async function getOnboardingCompletionTime() {
  const timeStr = await storage.getAsync(ONBOARDING_COMPLETION_TIME_KEY);
  return timeStr ? new Date(timeStr) : null;
}

/**
 * Start tracking a new session
 */
export async function startSession() {
  const now = new Date().toISOString();
  await storage.set(LAST_SESSION_START_KEY, now);
}

/**
 * Get total usage time in milliseconds since onboarding
 * @returns {number} Total usage time in milliseconds
 */
export async function getTotalUsageTime() {
  const onboardingTime = await getOnboardingCompletionTime();
  if (!onboardingTime) {
    return 0;
  }

  // Get saved total usage time (stored as string, convert to number)
  const savedTotalTimeStr = await storage.getAsync(TOTAL_USAGE_TIME_KEY);
  const savedTotalTime = savedTotalTimeStr ? parseFloat(savedTotalTimeStr) : 0;
  
  // Get last session start time
  const lastSessionStartStr = await storage.getAsync(LAST_SESSION_START_KEY);
  if (!lastSessionStartStr) {
    return savedTotalTime;
  }

  const lastSessionStart = new Date(lastSessionStartStr);
  const now = new Date();
  
  // Calculate time since last session start
  const currentSessionTime = Math.max(0, now - lastSessionStart);
  
  // Total = saved time + current session time
  return savedTotalTime + currentSessionTime;
}

/**
 * Save current session time and update total
 */
export async function saveSessionTime() {
  const lastSessionStartStr = await storage.getAsync(LAST_SESSION_START_KEY);
  if (!lastSessionStartStr) {
    return;
  }

  const lastSessionStart = new Date(lastSessionStartStr);
  const now = new Date();
  const sessionTime = Math.max(0, now - lastSessionStart);

  const savedTotalTimeStr = await storage.getAsync(TOTAL_USAGE_TIME_KEY);
  const savedTotalTime = savedTotalTimeStr ? parseFloat(savedTotalTimeStr) : 0;
  const newTotalTime = savedTotalTime + sessionTime;

  await storage.set(TOTAL_USAGE_TIME_KEY, newTotalTime);
  await storage.set(LAST_SESSION_START_KEY, now.toISOString());
}

/**
 * Check if user has used the app for at least the specified minutes
 * @param {number} minutes - Minimum minutes required
 * @returns {Promise<boolean>} True if usage time >= minutes
 */
export async function hasUsedAppForMinutes(minutes) {
  const totalTimeMs = await getTotalUsageTime();
  const requiredTimeMs = minutes * 60 * 1000;
  return totalTimeMs >= requiredTimeMs;
}

/**
 * Check if paywall should be shown
 * Requires: onboarding completed AND 3+ minutes of usage
 * @returns {Promise<boolean>} True if paywall should be shown
 */
export async function shouldShowPaywall() {
  const onboardingTime = await getOnboardingCompletionTime();
  if (!onboardingTime) {
    return false; // Onboarding not completed
  }

  // Check if paywall has already been shown (don't show repeatedly)
  const paywallShown = await storage.getAsync('paywallShown');
  if (paywallShown) {
    return false; // Already shown
  }

  // Check if user has used app for 3+ minutes
  return await hasUsedAppForMinutes(3);
}

/**
 * Mark paywall as shown
 */
export async function markPaywallShown() {
  await storage.set('paywallShown', true);
}

/**
 * Reset paywall state (for testing)
 */
export async function resetPaywallState() {
  await storage.remove('paywallShown');
}
