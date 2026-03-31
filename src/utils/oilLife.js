/**
 * Oil Life Calculator
 * Calculates oil life percentage based on last oil change and interval
 */
import { parseValidDate } from './serviceCalculations';
import { theme } from '../theme';

/**
 * Calculate oil life percentage for a vehicle
 * @param {Object} vehicle - Vehicle object
 * @returns {Object} Oil life data with percentage, color, status
 */
export function calculateOilLife(vehicle) {
  if (!vehicle) {
    return {
      percentage: null,
      color: theme.colors.textMuted,
      status: 'Unknown',
      milesRemaining: null,
      needsChange: false
    };
  }

  const oilChangeInterval = vehicle.serviceIntervals?.oilChange;
  const currentMileage = parseInt(vehicle.mileage, 10) || 0;
  const maintenanceRecords = vehicle.maintenanceRecords || [];
  const estimatedLastService = vehicle.estimatedLastService || {};

  // Find last oil change from maintenance records
  let lastOilChangeMileage = null;
  let lastOilChangeDate = null;

  // First, check maintenance records for actual oil changes
  const oilChanges = maintenanceRecords
    .filter(record => {
      const type = (record.type || '').toLowerCase();
      return type.includes('oil') && record.mileage !== null && record.mileage !== undefined;
    })
    .sort((a, b) => {
      const mileageA = parseInt(a.mileage, 10) || 0;
      const mileageB = parseInt(b.mileage, 10) || 0;
      return mileageB - mileageA; // Sort descending
    });

  if (oilChanges.length > 0) {
    lastOilChangeMileage = parseInt(oilChanges[0].mileage, 10);
    lastOilChangeDate = oilChanges[0].date;
  } else {
    // If no maintenance records, try to estimate from estimatedLastService
    const lastServiceDate = estimatedLastService.oilChange;
    if (lastServiceDate && lastServiceDate !== 'never') {
      lastOilChangeDate = lastServiceDate;
      // Estimate mileage based on time and average driving
      const lastServiceDateObj = new Date(lastServiceDate);
      const createdAt = parseValidDate(vehicle.createdAt) || new Date();
      const daysSinceCreation = (new Date() - createdAt) / (1000 * 60 * 60 * 24);
      const daysSinceService = (new Date() - lastServiceDateObj) / (1000 * 60 * 60 * 24);

      if (daysSinceCreation > 30) {
        // Only use creation-based rate if vehicle has been in the system long enough
        const estimatedMilesPerDay = currentMileage / daysSinceCreation;
        lastOilChangeMileage = Math.max(0, currentMileage - (estimatedMilesPerDay * daysSinceService));
      } else {
        // For newly added vehicles, use national average (~41 miles/day ≈ 15k/year)
        const AVG_MILES_PER_DAY = 41;
        lastOilChangeMileage = Math.max(0, currentMileage - (AVG_MILES_PER_DAY * daysSinceService));
      }
    }
  }

  // If no interval set, return unknown
  if (!oilChangeInterval || oilChangeInterval === 0) {
    return {
      percentage: null,
      color: theme.colors.textMuted,
      status: 'No interval set',
      milesRemaining: null,
      needsChange: false,
      lastOilChangeMileage,
      lastOilChangeDate
    };
  }

  // If no last oil change found, assume it needs changing
  if (lastOilChangeMileage === null) {
    return {
      percentage: 0,
      color: theme.colors.danger,
      status: 'Needs oil change',
      milesRemaining: 0,
      needsChange: true,
      lastOilChangeMileage: null,
      lastOilChangeDate: null
    };
  }

  // Calculate miles since last oil change
  const milesSinceLastChange = currentMileage - lastOilChangeMileage;

  // Calculate oil life percentage
  const milesRemaining = Math.max(0, oilChangeInterval - milesSinceLastChange);
  const percentage = Math.max(0, Math.min(100, (milesRemaining / oilChangeInterval) * 100));

  // Determine color and status based on percentage
  let color, status;
  if (percentage > 50) {
    color = theme.colors.successIndicator; // Green
    status = 'Good';
  } else if (percentage >= 15) {
    color = theme.colors.warning; // Orange
    status = 'Warning';
  } else {
    color = theme.colors.danger; // Red
    status = 'Needs Change';
  }

  const needsChange = percentage < 15 || milesRemaining <= 0;

  return {
    percentage: Math.round(percentage),
    color,
    status,
    milesRemaining: Math.max(0, Math.round(milesRemaining)),
    needsChange,
    lastOilChangeMileage,
    lastOilChangeDate,
    oilChangeInterval
  };
}
