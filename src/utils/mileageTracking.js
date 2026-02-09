/**
 * Calculate average miles per month from mileage history
 * @param {Array} mileageHistory - Array of {date, mileage} objects
 * @returns {number} Average miles per month
 */
export function calculateAverageMilesPerMonth(mileageHistory) {
  if (!mileageHistory || mileageHistory.length < 2) {
    return null; // Need at least 2 data points
  }

  // Sort by date
  const sorted = [...mileageHistory].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  // Calculate total miles and total months
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  
  const totalMiles = last.mileage - first.mileage;
  const daysDiff = (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24);
  const monthsDiff = daysDiff / 30.44; // Average days per month

  if (monthsDiff <= 0) return null;

  return Math.round(totalMiles / monthsDiff);
}

/**
 * Calculate average miles per day from mileage history (for "ghost drive" prediction).
 * @param {Array} mileageHistory - Array of {date, mileage} objects
 * @returns {number|null} Average miles per day, or null if not enough data
 */
export function calculateAverageMilesPerDay(mileageHistory) {
  if (!mileageHistory || mileageHistory.length < 2) {
    return null;
  }

  const sorted = [...mileageHistory].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const totalMiles = last.mileage - first.mileage;
  const daysDiff = (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24);

  if (daysDiff <= 0) return null;

  return totalMiles / daysDiff;
}

/**
 * Get effective mileage history: explicit mileage updates plus maintenance record mileages.
 * Gives more data points for average daily calculation (e.g. after one update + service records).
 * @param {Object} vehicle - Vehicle with mileageHistory and maintenanceRecords
 * @returns {Array} Sorted array of {date, mileage}
 */
export function getEffectiveMileageHistory(vehicle) {
  const history = vehicle.mileageHistory || [];
  const records = vehicle.maintenanceRecords || [];
  const byDate = new Map();

  history.forEach(({ date, mileage }) => {
    const key = new Date(date).toISOString();
    const m = parseInt(mileage, 10);
    if (!isNaN(m)) byDate.set(key, { date, mileage: m });
  });

  records.forEach((r) => {
    if (r.date && r.mileage != null && r.mileage !== '') {
      const date = new Date(r.date).toISOString();
      const mileage = parseInt(r.mileage, 10);
      if (!isNaN(mileage)) {
        if (!byDate.has(date)) byDate.set(date, { date: r.date, mileage });
      }
    }
  });

  return Array.from(byDate.values()).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
}

/**
 * Get predicted current mileage by "ghost driving" from last known value at average daily rate.
 * @param {Object} vehicle - Vehicle with mileage, mileageLastUpdated, and history (or maintenance records)
 * @returns {{ predicted: number, avgMilesPerDay: number, daysSinceLastUpdate: number }|null}
 */
export function getPredictedMileage(vehicle) {
  const lastMileage = vehicle.mileage != null && vehicle.mileage !== ''
    ? parseInt(vehicle.mileage, 10)
    : null;
  if (lastMileage === null || isNaN(lastMileage)) return null;

  const effectiveHistory = getEffectiveMileageHistory(vehicle);
  const avgMilesPerDay = calculateAverageMilesPerDay(effectiveHistory);
  if (avgMilesPerDay == null || avgMilesPerDay < 0) return null;

  const lastUpdate = vehicle.mileageLastUpdated || vehicle.createdAt;
  if (!lastUpdate) return null;

  const lastDate = new Date(lastUpdate);
  const now = new Date();
  const daysSince = (now - lastDate) / (1000 * 60 * 60 * 24);
  if (daysSince <= 0) return null;

  const predicted = Math.round(lastMileage + avgMilesPerDay * daysSince);
  if (predicted < lastMileage) return null;

  return {
    predicted,
    avgMilesPerDay,
    daysSinceLastUpdate: Math.floor(daysSince),
  };
}

/**
 * Predict when a service will be due based on mileage trends
 * @param {Object} vehicle - Vehicle object
 * @param {number} targetMileage - Target mileage for service
 * @returns {Date|null} Predicted date when service will be due
 */
export function predictServiceDate(vehicle, targetMileage) {
  const currentMileage = parseInt(vehicle.mileage) || 0;
  const mileageHistory = vehicle.mileageHistory || [];
  
  if (currentMileage >= targetMileage) {
    return null; // Already past due
  }

  const milesNeeded = targetMileage - currentMileage;
  const avgMilesPerMonth = calculateAverageMilesPerMonth(mileageHistory);

  if (!avgMilesPerMonth || avgMilesPerMonth <= 0) {
    return null; // Can't predict without history
  }

  const monthsUntilDue = milesNeeded / avgMilesPerMonth;
  const predictedDate = new Date();
  predictedDate.setMonth(predictedDate.getMonth() + monthsUntilDue);

  return predictedDate;
}

/**
 * Get mileage history for a vehicle
 * @param {Object} vehicle - Vehicle object
 * @returns {Array} Mileage history array
 */
export function getMileageHistory(vehicle) {
  return vehicle.mileageHistory || [];
}

/**
 * Add a mileage entry to history
 * @param {Object} vehicle - Vehicle object
 * @param {number} mileage - New mileage value
 * @returns {Object} Updated vehicle with new history entry
 */
export function addMileageEntry(vehicle, mileage) {
  const history = vehicle.mileageHistory || [];
  const newEntry = {
    date: new Date().toISOString(),
    mileage: parseInt(mileage)
  };

  // Add to history (keep last 50 entries to prevent storage bloat)
  const updatedHistory = [...history, newEntry]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-50); // Keep last 50 entries

  return {
    ...vehicle,
    mileage: parseInt(mileage),
    mileageHistory: updatedHistory,
    mileageLastUpdated: new Date().toISOString()
  };
}

/**
 * Check if monthly mileage update is due
 * @param {Object} vehicle - Vehicle object
 * @returns {boolean} True if monthly update is due
 */
export function isMonthlyMileageUpdateDue(vehicle) {
  const lastUpdate = vehicle.mileageLastUpdated || vehicle.createdAt;
  if (!lastUpdate) return true;

  const lastUpdateDate = new Date(lastUpdate);
  const now = new Date();
  const daysSinceUpdate = (now - lastUpdateDate) / (1000 * 60 * 60 * 24);
  
  // Prompt once per month (30 days)
  return daysSinceUpdate >= 30;
}

/**
 * Check if 2-week mileage update reminder is due
 * @param {Object} vehicle - Vehicle object
 * @returns {boolean} True if 2-week reminder is due
 */
export function isTwoWeekMileageUpdateDue(vehicle) {
  const lastUpdate = vehicle.mileageLastUpdated || vehicle.createdAt;
  if (!lastUpdate) return true;

  const lastUpdateDate = new Date(lastUpdate);
  const now = new Date();
  const daysSinceUpdate = (now - lastUpdateDate) / (1000 * 60 * 60 * 24);
  
  // Prompt after 2 weeks (14 days)
  return daysSinceUpdate >= 14;
}
