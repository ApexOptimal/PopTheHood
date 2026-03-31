/**
 * Shared Service Interval Calculations
 * Single source of truth for next-service-due logic.
 */
import { normalizeServiceType, parseValidDate } from './serviceCalculations';

/** Maps interval keys to maintenance form type strings */
export const SERVICE_TYPE_TO_MAINTENANCE_TYPE = {
  oilChange: 'Oil Change',
  tireRotation: 'Tire Rotation',
  brakeInspection: 'Brake Service',
  airFilter: 'Engine Air Filter',
  cabinFilter: 'Cabin Air Filter',
  sparkPlugs: 'Spark Plugs',
  transmission: 'Transmission Service',
  coolant: 'Coolant Flush',
  brakeFluid: 'Brake Fluid Change',
};

/** Display labels for interval keys */
export const SERVICE_INTERVAL_LABELS = {
  oilChange: 'Oil Change',
  tireRotation: 'Tire Rotation',
  brakeInspection: 'Brake Inspection',
  airFilter: 'Engine Air Filter',
  cabinFilter: 'Cabin Air Filter',
  sparkPlugs: 'Spark Plugs',
  transmission: 'Transmission Service',
  coolant: 'Coolant Flush',
  brakeFluid: 'Brake Fluid Change',
};

/**
 * Internal map used to match maintenance records to service types.
 */
const RECORD_TYPE_MAP = {
  oilChange: 'Oil Change',
  tireRotation: 'Tire Rotation',
  brakeInspection: 'Brake Service',
  airFilter: 'Filter Replacement',
  cabinFilter: 'Cabin Air Filter',
  sparkPlugs: 'Spark Plugs',
  transmission: 'Transmission Service',
  coolant: 'Coolant Flush',
  brakeFluid: 'Brake Fluid Change',
};

/**
 * Calculate the next service mileage for a given service type.
 * Extracted from VehicleDetailScreen.ServiceIntervalsSection.
 *
 * @param {object} vehicle - Full vehicle object
 * @param {string} serviceType - Interval key (e.g., 'oilChange')
 * @param {number} interval - Mileage interval for this service
 * @returns {number|null}
 */
export function getNextServiceMileage(vehicle, serviceType, interval) {
  if (!interval) return null;

  const currentMileage = parseInt(vehicle?.mileage, 10) || 0;
  const estimates = vehicle?.estimatedLastService || {};
  const maintenanceRecords = vehicle?.maintenanceRecords || [];

  // Always check for actual maintenance records first — they have real mileage data
  const serviceRecords = maintenanceRecords.filter(r => {
    if (!r.type) return false;
    return normalizeServiceType(r.type, serviceType);
  });

  if (serviceRecords.length > 0) {
    // Find the most recent record with mileage (sort by date descending)
    const recordsWithMileage = serviceRecords
      .filter(r => r.mileage)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (recordsWithMileage.length > 0) {
      const lastServiceMileage = parseInt(recordsWithMileage[0].mileage, 10);
      return lastServiceMileage + interval;
    }
  }

  // "Current on Maintenance" = all factory intervals done up to the mileage when vehicle was added
  if (vehicle?.maintenanceHistoryStatus === 'current') {
    const baseMileage = vehicle.mileageHistory?.[0]?.mileage || currentMileage;
    const milesSinceBase = Math.max(0, currentMileage - baseMileage);
    const cyclesCompleted = Math.floor(milesSinceBase / interval);
    return baseMileage + (cyclesCompleted + 1) * interval;
  }

  const lastService = estimates[serviceType];

  if (lastService === 'never') {
    return interval;
  }

  if (!lastService) {
    return currentMileage + interval;
  }

  const lastServiceDate = parseValidDate(lastService);
  if (!lastServiceDate) return currentMileage + interval;

  // Check for records matching the estimatedLastService date (records without mileage)
  if (serviceRecords.length > 0) {
    const sortedRecords = serviceRecords.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const diffA = Math.abs(dateA - lastServiceDate);
      const diffB = Math.abs(dateB - lastServiceDate);
      return diffA - diffB;
    });

    if (sortedRecords[0].mileage) {
      const lastServiceMileage = parseInt(sortedRecords[0].mileage, 10);
      return lastServiceMileage + interval;
    }
  }

  const daysSince = (new Date() - lastServiceDate) / (1000 * 60 * 60 * 24);
  const createdAtDate = parseValidDate(vehicle?.createdAt);
  if (!createdAtDate) return currentMileage + interval;
  const daysSinceCreation = (new Date() - createdAtDate) / (1000 * 60 * 60 * 24);
  // Use creation-based rate only if vehicle has been tracked long enough for a meaningful rate;
  // otherwise fall back to national average (~41 miles/day ≈ 15k/year)
  const estimatedMilesPerDay = daysSinceCreation > 30 && currentMileage > 0
    ? currentMileage / daysSinceCreation
    : 41;
  const lastServiceMileage = Math.max(0, currentMileage - (estimatedMilesPerDay * daysSince));
  return lastServiceMileage + interval;
}

/**
 * Build a sorted list of all upcoming services for a vehicle.
 *
 * @param {object} vehicle - Full vehicle object
 * @returns {Array<{type: string, label: string, maintenanceType: string, interval: number, nextService: number|null}>}
 */
export function getUpcomingServices(vehicle) {
  const serviceIntervals = vehicle?.serviceIntervals || {};
  return Object.keys(serviceIntervals)
    .filter(key => serviceIntervals[key])
    .map(key => ({
      type: key,
      label: SERVICE_INTERVAL_LABELS[key] || key,
      maintenanceType: SERVICE_TYPE_TO_MAINTENANCE_TYPE[key] || key,
      interval: parseInt(serviceIntervals[key], 10),
      nextService: getNextServiceMileage(vehicle, key, parseInt(serviceIntervals[key], 10)),
    }))
    .filter(item => item.nextService !== null)
    .sort((a, b) => a.nextService - b.nextService);
}

/**
 * Build timeline data for each service interval, including last-done mileage
 * and progress percentage through the current interval.
 *
 * @param {object} vehicle - Full vehicle object
 * @returns {Array<{type, label, interval, lastDone, nextService, progress, isOverdue}>}
 */
export function getServiceTimeline(vehicle) {
  const serviceIntervals = vehicle?.serviceIntervals || {};
  const currentMileage = parseInt(vehicle?.mileage, 10) || 0;

  return Object.keys(serviceIntervals)
    .filter(key => serviceIntervals[key])
    .map(key => {
      const interval = parseInt(serviceIntervals[key], 10);
      const nextService = getNextServiceMileage(vehicle, key, interval);
      if (nextService === null) return null;

      const lastDone = Math.max(0, nextService - interval);
      const range = nextService - lastDone;
      const elapsed = currentMileage - lastDone;
      const progress = range > 0 ? Math.min(Math.max(elapsed / range, 0), 1.5) : 0;
      const isOverdue = currentMileage >= nextService;

      return {
        type: key,
        label: SERVICE_INTERVAL_LABELS[key] || key,
        maintenanceType: SERVICE_TYPE_TO_MAINTENANCE_TYPE[key] || key,
        interval,
        lastDone,
        nextService,
        progress,
        isOverdue,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.nextService - b.nextService);
}
