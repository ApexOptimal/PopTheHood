/**
 * Service Calculations - Validation & shared logic
 * NOTE: This file must NOT import from serviceIntervals.js to avoid require cycles.
 */

/**
 * Validate a date string. Returns a Date object or null if invalid.
 */
export function parseValidDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d;
}

/**
 * Validate mileage input. Returns parsed integer or null.
 * Rejects negative, zero, and non-numeric values.
 */
export function validateMileage(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = parseInt(String(value), 10);
  if (isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

/**
 * Check if a new service mileage is valid relative to the vehicle's previous records.
 * Returns { valid: true } or { valid: false, message: string }.
 */
export function validateServiceMileage(mileage, vehicle) {
  const parsed = validateMileage(mileage);
  if (mileage !== null && mileage !== undefined && mileage !== '' && parsed === null) {
    return { valid: false, message: 'Mileage must be a positive number.' };
  }
  if (parsed === null) return { valid: true }; // mileage is optional

  const currentVehicleMileage = parseInt(String(vehicle?.mileage), 10);
  if (!isNaN(currentVehicleMileage) && parsed > currentVehicleMileage + 1000) {
    return {
      valid: false,
      message: `Service mileage (${parsed.toLocaleString()}) is much higher than vehicle's current mileage (${currentVehicleMileage.toLocaleString()}). Please update the vehicle mileage first.`
    };
  }

  return { valid: true };
}

/**
 * Normalize a service type string for matching.
 * Single source of truth for fuzzy-matching service types across the app.
 */
export function normalizeServiceType(recordType, serviceType) {
  if (!recordType || !serviceType) return false;
  const rt = recordType.toLowerCase();

  switch (serviceType) {
    case 'oilChange':
      return rt.includes('oil') && !rt.includes('transmission');
    case 'tireRotation':
      return rt.includes('tire') || rt.includes('rotation');
    case 'brakeInspection':
      return rt.includes('brake') && !rt.includes('fluid');
    case 'airFilter':
      return rt.includes('filter') && (rt.includes('engine') || rt.includes('air')) && !rt.includes('cabin');
    case 'cabinFilter':
      return rt.includes('cabin') && rt.includes('filter');
    case 'sparkPlugs':
      return rt.includes('spark');
    case 'transmission':
      return rt.includes('transmission');
    case 'coolant':
      return rt.includes('coolant');
    case 'brakeFluid':
      return rt.includes('brake') && rt.includes('fluid');
    default:
      return false;
  }
}

/**
 * Derive upcoming maintenance items across all vehicles.
 * Single source of truth - used by DashboardScreen and ServiceAlerts.
 * Imports serviceIntervals lazily to avoid require cycle.
 */
export function deriveMaintenanceItems(vehicles, maxItems = 4) {
  const { getNextServiceMileage, SERVICE_INTERVAL_LABELS } = require('./serviceIntervals');
  const items = [];

  vehicles.forEach((vehicle) => {
    if (vehicle.maintenanceHistoryStatus === 'current') return;

    const intervals = vehicle.serviceIntervals || {};
    const ignored = vehicle.ignoredReminders || {};
    const currentMileage = parseInt(vehicle.mileage, 10) || 0;
    const vehicleName = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Vehicle';

    Object.keys(intervals).forEach((serviceType) => {
      const interval = parseInt(intervals[serviceType], 10);
      if (!interval) return;
      if (ignored[serviceType]) return;

      const nextServiceMileage = getNextServiceMileage(vehicle, serviceType, interval);
      if (nextServiceMileage === null) return;

      const milesRemaining = nextServiceMileage - currentMileage;

      if (milesRemaining > -interval) {
        const urgency = Math.max(0, Math.min(1, 1 - milesRemaining / interval));

        let dueInDays = null;
        if (vehicle.mileageHistory && vehicle.mileageHistory.length >= 2) {
          const history = [...vehicle.mileageHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
          const newest = history[0];
          const oldest = history[history.length - 1];
          const daysBetween = (new Date(newest.date) - new Date(oldest.date)) / (1000 * 60 * 60 * 24);
          const milesBetween = newest.mileage - oldest.mileage;
          if (daysBetween > 0 && milesBetween > 0) {
            const milesPerDay = milesBetween / daysBetween;
            dueInDays = milesRemaining > 0 ? Math.round(milesRemaining / milesPerDay) : 0;
          }
        }

        items.push({
          id: `${vehicle.id}-${serviceType}`,
          serviceName: SERVICE_INTERVAL_LABELS[serviceType] || serviceType,
          dueInMiles: Math.max(0, Math.round(milesRemaining)),
          dueInDays,
          urgency,
          vehicleName,
        });
      }
    });
  });

  items.sort((a, b) => b.urgency - a.urgency);
  return items.slice(0, maxItems);
}
