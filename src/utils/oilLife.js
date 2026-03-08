/**
 * Oil Life Calculator
 * Calculates oil life percentage based on last oil change and interval
 */

/**
 * Calculate oil life percentage for a vehicle
 * @param {Object} vehicle - Vehicle object
 * @returns {Object} Oil life data with percentage, color, status
 */
export function calculateOilLife(vehicle) {
  if (!vehicle) {
    return {
      percentage: null,
      color: '#909090',
      status: 'Unknown',
      milesRemaining: null,
      needsChange: false
    };
  }

  const oilChangeInterval = vehicle.serviceIntervals?.oilChange;
  const currentMileage = parseInt(vehicle.mileage) || 0;
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
      const mileageA = parseInt(a.mileage) || 0;
      const mileageB = parseInt(b.mileage) || 0;
      return mileageB - mileageA; // Sort descending
    });

  if (oilChanges.length > 0) {
    lastOilChangeMileage = parseInt(oilChanges[0].mileage);
    lastOilChangeDate = oilChanges[0].date;
  } else {
    // If no maintenance records, try to estimate from estimatedLastService
    const lastServiceDate = estimatedLastService.oilChange;
    if (lastServiceDate && lastServiceDate !== 'never') {
      lastOilChangeDate = lastServiceDate;
      // Estimate mileage based on time and average driving
      const lastServiceDateObj = new Date(lastServiceDate);
      const createdAt = vehicle.createdAt ? new Date(vehicle.createdAt) : new Date();
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
      color: '#909090',
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
      color: '#ff4444',
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
    color = '#00aa00'; // Green
    status = 'Good';
  } else if (percentage >= 15) {
    color = '#ff8800'; // Orange
    status = 'Warning';
  } else {
    color = '#ff4444'; // Red
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
