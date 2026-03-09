/**
 * Shared Service Interval Calculations
 * Single source of truth for next-service-due logic.
 */

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

  const currentMileage = parseInt(vehicle?.mileage) || 0;
  const estimates = vehicle?.estimatedLastService || {};
  const maintenanceRecords = vehicle?.maintenanceRecords || [];

  // "Current on Maintenance" = all factory intervals done up to current mileage
  if (vehicle?.maintenanceHistoryStatus === 'current') {
    return currentMileage + interval;
  }

  const lastService = estimates[serviceType];

  if (lastService === 'never') {
    return interval;
  }

  if (!lastService) {
    return currentMileage + interval;
  }

  const lastServiceDate = new Date(lastService);
  const maintenanceType = RECORD_TYPE_MAP[serviceType];
  const serviceRecords = maintenanceRecords.filter(r => {
    if (!r.type) return false;
    const recordType = r.type.toLowerCase();
    if (serviceType === 'airFilter' || serviceType === 'cabinFilter') {
      return recordType.includes('filter');
    }
    if (serviceType === 'coolant' || serviceType === 'brakeFluid') {
      return recordType.includes(serviceType.toLowerCase().replace('fluid', '')) && recordType.includes('fluid');
    }
    return recordType.includes(maintenanceType?.toLowerCase().split(' ')[0]);
  });

  if (serviceRecords.length > 0) {
    const sortedRecords = serviceRecords.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const diffA = Math.abs(dateA - lastServiceDate);
      const diffB = Math.abs(dateB - lastServiceDate);
      return diffA - diffB;
    });

    if (sortedRecords[0].mileage) {
      const lastServiceMileage = parseInt(sortedRecords[0].mileage);
      return lastServiceMileage + interval;
    }
  }

  const daysSince = (new Date() - lastServiceDate) / (1000 * 60 * 60 * 24);
  const createdAt = vehicle?.createdAt ? new Date(vehicle.createdAt) : new Date();
  const daysSinceCreation = (new Date() - createdAt) / (1000 * 60 * 60 * 24);
  const estimatedMilesPerDay = daysSinceCreation > 0 ? currentMileage / daysSinceCreation : 0;
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
      interval: parseInt(serviceIntervals[key]),
      nextService: getNextServiceMileage(vehicle, key, parseInt(serviceIntervals[key])),
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
  const currentMileage = parseInt(vehicle?.mileage) || 0;

  return Object.keys(serviceIntervals)
    .filter(key => serviceIntervals[key])
    .map(key => {
      const interval = parseInt(serviceIntervals[key]);
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
