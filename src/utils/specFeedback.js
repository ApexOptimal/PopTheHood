/**
 * Spec Corrections Feedback
 * Computes diffs between user-edited vehicle specs and database defaults,
 * then anonymously submits them to Supabase for database accuracy assessment.
 * No PII is collected — only make/model/year/trim + spec field diffs.
 */
import { supabase } from './supabase';
import { importVehicleSpecs } from './vehicleSpecsImport';
import { isOnline } from './network';
import { storage } from './storage';
import logger from './logger';

const DEBOUNCE_MS = 10000;
const PENDING_KEY = 'pendingSpecCorrections';

let debounceTimer = null;

// Categories with flat key-value structure
const FLAT_CATEGORIES = [
  'serviceIntervals',
  'recommendedFluids',
  'tires',
  'hardware',
  'lighting',
  'partsSKUs',
];

// Get app version safely
function getAppVersion() {
  try {
    const Constants = require('expo-constants').default;
    return Constants.expoConfig?.version || Constants.manifest?.version || '';
  } catch {
    return '';
  }
}

/**
 * Compute the diff between a saved vehicle's specs and what the database would provide.
 * Returns an array of correction objects, or [] if nothing differs.
 */
export function computeSpecDiff(vehicle) {
  if (!vehicle?.make || !vehicle?.model || !vehicle?.year) return [];

  // Reproduce database defaults using a clean vehicle shell
  const baseline = importVehicleSpecs({
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    trim: vehicle.trim || '',
  });

  const corrections = [];
  const base = {
    make: vehicle.make,
    model: vehicle.model,
    year: parseInt(vehicle.year) || 0,
    trim: vehicle.trim || '',
  };

  // Compare flat categories
  for (const category of FLAT_CATEGORIES) {
    const defaults = baseline[category] || {};
    const userVals = vehicle[category] || {};

    for (const field of Object.keys(defaults)) {
      const defaultVal = String(defaults[field] ?? '').trim();
      const userVal = String(userVals[field] ?? '').trim();

      // Skip if either side is empty or they match
      if (!defaultVal || !userVal || defaultVal === userVal) continue;

      corrections.push({
        ...base,
        category,
        field_name: field,
        default_value: defaultVal,
        user_value: userVal,
      });
    }
  }

  // Compare torqueValues (nested: suspension, engine, brake)
  const defaultTorque = baseline.torqueValues || {};
  const userTorque = vehicle.torqueValues || {};

  for (const sub of ['suspension', 'engine', 'brake']) {
    const defaultSub = defaultTorque[sub] || {};
    const userSub = userTorque[sub] || {};

    for (const field of Object.keys(defaultSub)) {
      const defaultVal = String(defaultSub[field] ?? '').trim();
      const userVal = String(userSub[field] ?? '').trim();

      if (!defaultVal || !userVal || defaultVal === userVal) continue;

      corrections.push({
        ...base,
        category: 'torqueValues',
        field_name: `${sub}.${field}`,
        default_value: defaultVal,
        user_value: userVal,
      });
    }
  }

  return corrections;
}

/**
 * Flush any pending offline corrections, then submit new ones.
 */
export async function submitSpecCorrections(vehicle) {
  // Check opt-out
  const optOut = storage.get('specFeedbackOptOut');
  if (optOut) return;

  // Must have Supabase configured
  if (!supabase) return;

  // Must be online
  const online = await isOnline();

  const appVersion = getAppVersion();

  // Flush pending queue if online
  if (online) {
    try {
      const pending = storage.get(PENDING_KEY) || [];
      if (pending.length > 0) {
        await supabase.from('spec_corrections').insert(pending);
        await storage.set(PENDING_KEY, []);
      }
    } catch (e) {
      logger.error('specFeedback: failed to flush pending corrections', e);
    }
  }

  // Compute diff for this vehicle
  const corrections = computeSpecDiff(vehicle);
  if (corrections.length === 0) return;

  // Stamp with app version
  const rows = corrections.map(c => ({ ...c, app_version: appVersion }));

  if (!online) {
    // Queue for later
    try {
      const pending = storage.get(PENDING_KEY) || [];
      await storage.set(PENDING_KEY, [...pending, ...rows]);
    } catch (e) {
      logger.error('specFeedback: failed to queue corrections', e);
    }
    return;
  }

  // Insert
  try {
    const { error } = await supabase.from('spec_corrections').insert(rows);
    if (error) {
      logger.error('specFeedback: insert failed', error);
    }
  } catch (e) {
    logger.error('specFeedback: insert exception', e);
  }
}

/**
 * Debounced entry point — call this after saving a vehicle.
 */
export function scheduleSpecFeedback(vehicle) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    submitSpecCorrections(vehicle).catch(() => {});
  }, DEBOUNCE_MS);
}
