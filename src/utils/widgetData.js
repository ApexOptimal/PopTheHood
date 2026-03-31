/**
 * Builds the data payload for home screen widgets (iOS WidgetKit / Android App Widget).
 * The main app should call getWidgetPayload(vehicles, shoppingList, todos) whenever
 * this data changes and write the result to the platform-specific shared storage
 * (iOS: App Group UserDefaults; Android: SharedPreferences or file in getFilesDir()).
 *
 * Supports:
 * - Quick Look (small): single most urgent item + miles remaining (timeline-friendly).
 * - Garage Status (medium): top 2 services + estimated odometer (average daily mileage).
 * - Modifications widget (medium/large): shopping list + to-do + deep link targets.
 */

import { getPredictedMileage } from './mileageTracking';

const SERVICE_LABELS = {
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

function getServiceLabel(serviceType) {
  return SERVICE_LABELS[serviceType] || serviceType;
}

function getLastServiceMileage(vehicle, serviceType, lastServiceDate) {
  if (!lastServiceDate) return null;
  const records = vehicle.maintenanceRecords || [];
  const serviceRecords = records.filter((r) => {
    if (!r.type) return false;
    const t = r.type.toLowerCase();
    if (serviceType === 'oilChange') return t.includes('oil');
    if (serviceType === 'tireRotation') return t.includes('tire') || t.includes('rotation');
    if (serviceType === 'brakeInspection') return t.includes('brake') && !t.includes('fluid');
    if (serviceType === 'airFilter' || serviceType === 'cabinFilter') return t.includes('filter');
    if (serviceType === 'sparkPlugs') return t.includes('spark');
    if (serviceType === 'transmission') return t.includes('transmission');
    if (serviceType === 'coolant') return t.includes('coolant');
    if (serviceType === 'brakeFluid') return t.includes('brake') && t.includes('fluid');
    return false;
  });
  if (serviceRecords.length > 0) {
    const lastDate = new Date(lastServiceDate);
    const sorted = [...serviceRecords].sort((a, b) => {
      const dA = new Date(a.date);
      const dB = new Date(b.date);
      return Math.abs(dA - lastDate) - Math.abs(dB - lastDate);
    });
    if (sorted[0].mileage) return parseInt(sorted[0].mileage, 10);
  }
  const currentMileage = parseInt(vehicle.mileage, 10) || 0;
  const daysSince = (Date.now() - new Date(lastServiceDate)) / (1000 * 60 * 60 * 24);
  const createdAt = vehicle.createdAt ? new Date(vehicle.createdAt) : new Date();
  const daysSinceCreation = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);
  const milesPerDay = daysSinceCreation > 0 ? currentMileage / daysSinceCreation : 0;
  return Math.max(0, Math.round(currentMileage - milesPerDay * daysSince));
}

/**
 * Build next-upcoming maintenance items (up to 2) with vehicle name for each.
 * @param {Array} vehicles - app vehicles array
 * @returns {Array<{ id, serviceName, dueInMiles, dueInDays, urgency, vehicleName }>}
 */
export function getNextMaintenanceForWidget(vehicles = []) {
  const upcoming = [];
  const now = Date.now();
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;

  vehicles.forEach((vehicle) => {
    const intervals = vehicle.serviceIntervals || {};
    const estimates = vehicle.estimatedLastService || {};
    const ignored = vehicle.ignoredReminders || {};
    const skippedServices = vehicle.skippedServices || {};
    const currentMileage = parseInt(vehicle.mileage, 10) || 0;
    const vehicleName = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || vehicle.nickname || 'Vehicle';

    Object.keys(intervals).forEach((serviceType) => {
      const interval = parseInt(intervals[serviceType], 10);
      if (!interval || ignored[serviceType]) return;

      const lastService = estimates[serviceType];
      const skipMileage = skippedServices[serviceType];
      let nextMileage = null;
      let nextDate = null;

      if (lastService === 'never' || !lastService) {
        nextMileage = interval;
        nextDate = new Date(now + oneYearMs);
      } else {
        const lastDate = new Date(lastService);
        const lastMileage = getLastServiceMileage(vehicle, serviceType, lastDate);
        if (lastMileage != null && !Number.isNaN(lastMileage)) {
          nextMileage = lastMileage + interval;
        } else {
          nextMileage = currentMileage + interval;
        }
        nextDate = new Date(lastDate.getTime() + 365 * 24 * 60 * 60 * 1000);
      }
      if (skipMileage != null) {
        nextMileage = Math.max(nextMileage, skipMileage + interval);
      }

      const milesUntil = nextMileage - currentMileage;
      const daysUntil = Math.round((nextDate - now) / (1000 * 60 * 60 * 24));
      const urgency = milesUntil <= 0 ? 1 : Math.min(1, Math.max(0, 1 - milesUntil / (interval * 0.5)));

      upcoming.push({
        id: `${vehicle.id}-${serviceType}`,
        vehicleId: vehicle.id,
        serviceType,
        serviceName: getServiceLabel(serviceType),
        dueInMiles: Math.max(0, milesUntil),
        dueInDays: Math.max(0, daysUntil),
        nextServiceMileage: nextMileage,
        currentMileageAtSnapshot: currentMileage,
        urgency: Math.min(1, Math.max(0, urgency)),
        vehicleName,
      });
    });
  });

  upcoming.sort((a, b) => (a.urgency !== b.urgency ? b.urgency - a.urgency : a.dueInMiles - b.dueInMiles));
  return upcoming.slice(0, 2);
}

/**
 * Build shopping list slice for widgets (first 3 items).
 * @param {Array} shoppingList - app shopping list
 * @returns {Array<{ id, name, checked }>}
 */
export function getShoppingListForWidget(shoppingList = []) {
  return shoppingList.slice(0, 3).map((item) => ({
    id: item.id,
    name: item.name || item.title || '',
    checked: !!item.completed,
  }));
}

/**
 * Build to-do list for widgets.
 * @param {Array} todos - app todos
 * @returns {Array<{ id, title, completed }>}
 */
export function getToDoListForWidget(todos = []) {
  return todos.map((item) => ({
    id: item.id,
    title: item.title || '',
    completed: !!item.completed,
  }));
}

/**
 * Estimated odometer and average daily mileage for the primary vehicle (for Garage Status widget).
 * Uses getPredictedMileage (average daily mileage calculation).
 * @param {Array} vehicles
 * @returns {{ estimatedOdometer: number, averageMilesPerDay: number, vehicleName: string }|null}
 */
export function getEstimatedOdometerForWidget(vehicles = []) {
  const vehicle = vehicles[0] || null;
  if (!vehicle) return null;
  const pred = getPredictedMileage(vehicle);
  if (!pred) {
    const m = parseInt(vehicle.mileage, 10);
    if (isNaN(m)) return null;
    return {
      estimatedOdometer: m,
      averageMilesPerDay: 0,
      vehicleName: [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Vehicle',
    };
  }
  return {
    estimatedOdometer: pred.predicted,
    averageMilesPerDay: pred.avgMilesPerDay,
    vehicleName: [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Vehicle',
  };
}

/**
 * Full payload for widgets. Write this JSON to App Group (iOS) or SharedPreferences/file (Android).
 * Timeline: widget can compute "miles remaining" at time T = dueInMiles - (averageMilesPerDay * daysSince(snapshotAt, T)).
 * Refresh interval: 4–12 hours (battery-friendly); app pushes on data change.
 * @param {{ vehicles: Array, shoppingList: Array, todos: Array }} appState
 * @returns {{ nextMaintenance, shoppingList, todoList, estimatedOdometer, snapshotAt, updatedAt }}
 */
export function getWidgetPayload(appState = {}) {
  const { vehicles = [], shoppingList = [], todos = [] } = appState;
  const snapshotAt = new Date().toISOString();
  const nextMaintenance = getNextMaintenanceForWidget(vehicles);
  const estimatedOdometer = getEstimatedOdometerForWidget(vehicles);
  return {
    nextMaintenance,
    shoppingList: getShoppingListForWidget(shoppingList),
    todoList: getToDoListForWidget(todos),
    estimatedOdometer: estimatedOdometer
      ? {
          ...estimatedOdometer,
          snapshotAt,
        }
      : null,
    snapshotAt,
    updatedAt: snapshotAt,
  };
}
