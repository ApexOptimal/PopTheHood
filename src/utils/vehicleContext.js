/**
 * Vehicle Context Utility
 * Aggregates vehicle information, modifications, and recent maintenance history
 * for diagnostic purposes
 */

import { getBuildSheet } from './buildSheet';

/**
 * Get recent maintenance records
 * Returns last 5 records OR anything from last 30 days/500 miles
 * @param {Array} maintenanceRecords - Array of maintenance record objects
 * @param {number} currentMileage - Current vehicle mileage
 * @returns {Array} Filtered and formatted recent maintenance records
 */
export function getRecentMaintenanceHistory(maintenanceRecords, currentMileage = 0) {
  if (!maintenanceRecords || !Array.isArray(maintenanceRecords) || maintenanceRecords.length === 0) {
    return [];
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const fiveHundredMilesAgo = currentMileage - 500;

  // Filter records from last 30 days or 500 miles
  const recentRecords = maintenanceRecords.filter(record => {
    if (!record.date) return false;
    
    const recordDate = new Date(record.date);
    const recordMileage = parseFloat(record.mileage) || 0;
    
    const isRecentDate = recordDate >= thirtyDaysAgo;
    const isRecentMileage = recordMileage >= fiveHundredMilesAgo && recordMileage <= currentMileage;
    
    return isRecentDate || isRecentMileage;
  });

  // Sort by date (most recent first)
  recentRecords.sort((a, b) => {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB - dateA;
  });

  // Take last 5 records (or all if less than 5)
  const topRecent = recentRecords.slice(0, 5);

  // Format for display
  return topRecent.map(record => {
    const date = record.date ? new Date(record.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: record.date.includes('-') ? 'numeric' : undefined 
    }) : 'Unknown date';
    
    const serviceType = record.type || 'Maintenance';
    const mileage = record.mileage ? `${Math.round(parseFloat(record.mileage)).toLocaleString()} mi` : '';
    const description = record.description || '';
    const notes = description ? ` - ${description}` : '';
    
    return {
      formatted: `[${date}]${mileage ? ` @ ${mileage}` : ''} - ${serviceType}${notes}`,
      date: record.date,
      type: serviceType,
      description: description,
      mileage: record.mileage,
      raw: record
    };
  });
}

/**
 * Get complete vehicle context for diagnostics
 * Aggregates specs, modifications, and recent maintenance
 * @param {Object} vehicle - Vehicle object
 * @returns {Object} Complete vehicle context
 */
export function getVehicleContext(vehicle) {
  if (!vehicle) {
    return {
      basicSpecs: null,
      modifications: '',
      recentHistory: [],
      hasRecentWork: false,
      formattedContext: ''
    };
  }

  // Basic specs
  const basicSpecs = {
    year: vehicle.year || '',
    make: vehicle.make || '',
    model: vehicle.model || '',
    trim: vehicle.trim || '',
    engine: vehicle.trim ? `(${vehicle.trim})` : ''
  };

  // Modifications (stored as vehicle.buildSheet)
  const modifications = getBuildSheet(vehicle);

  // Recent maintenance history
  const currentMileage = parseFloat(vehicle.mileage) || 0;
  const recentHistory = getRecentMaintenanceHistory(
    vehicle.maintenanceRecords || [],
    currentMileage
  );

  // Format basic specs string
  const specsString = `${basicSpecs.year} ${basicSpecs.make} ${basicSpecs.model}${basicSpecs.engine ? ' ' + basicSpecs.engine : ''}`.trim();

  // Format recent history list
  const recentHistoryList = recentHistory.length > 0
    ? recentHistory.map(r => r.formatted).join('\n')
    : 'No recent maintenance recorded.';

  // Build formatted context
  let formattedContext = `VEHICLE PROFILE:\n`;
  formattedContext += `- Car: ${specsString}\n`;
  
  if (modifications) {
    formattedContext += `- Build/Mods: ${modifications}\n`;
  } else {
    formattedContext += `- Build/Mods: Stock (no modifications recorded)\n`;
  }
  
  formattedContext += `- RECENT WORK (Last 30 days/500 miles):\n${recentHistoryList}`;

  return {
    basicSpecs,
    modifications,
    recentHistory,
    hasRecentWork: recentHistory.length > 0,
    formattedContext,
    specsString
  };
}

/**
 * Extract suspected recent work from AI response
 * Looks for phrases indicating recent work is the cause
 * @param {string} aiResponse - AI diagnostic response
 * @param {Array} recentHistory - Recent maintenance records
 * @returns {Object} Suspected work info with highlighted text
 */
export function extractSuspectedRecentWork(aiResponse, recentHistory) {
  if (!aiResponse || !recentHistory || recentHistory.length === 0) {
    return {
      hasSuspectedWork: false,
      suspectedParts: [],
      highlightedText: aiResponse
    };
  }

  const suspectedKeywords = [
    'since you just',
    'after you',
    'recently',
    'just replaced',
    'just installed',
    'just changed',
    'just did',
    'after the',
    'following the',
    'after replacing',
    'after installing',
    'could be related to',
    'may be related to',
    'likely related to'
  ];

  const suspectedParts = [];
  let highlightedText = aiResponse;

  // Check if response mentions recent work
  const responseLower = aiResponse.toLowerCase();
  const hasSuspectedWork = suspectedKeywords.some(keyword => responseLower.includes(keyword));

  if (hasSuspectedWork) {
    // Extract service types from recent history
    recentHistory.forEach(record => {
      const serviceType = (record.type || '').toLowerCase();
      const description = (record.description || '').toLowerCase();
      
      // Check if AI response mentions this service
      if (responseLower.includes(serviceType) || 
          (description && responseLower.includes(description.split(' ')[0]))) {
        suspectedParts.push({
          type: record.type,
          description: record.description,
          date: record.date
        });
      }
    });
  }

  return {
    hasSuspectedWork,
    suspectedParts,
    highlightedText: aiResponse // Will be processed in component for highlighting
  };
}

/**
 * Build optimized forum search query with recent work context
 * @param {string} baseQuery - Base search query from AI
 * @param {string} vehicleModel - Vehicle model
 * @param {string} symptom - User's reported symptom
 * @param {Array} suspectedParts - Suspected recent work parts
 * @returns {string} Optimized search query
 */
export function buildOptimizedForumQuery(baseQuery, vehicleModel, symptom, suspectedParts) {
  let query = baseQuery || symptom;

  // Add vehicle model if not already present
  if (vehicleModel && !query.toLowerCase().includes(vehicleModel.toLowerCase())) {
    query = `${vehicleModel} ${query}`;
  }

  // If recent work is suspected, add it to the query
  if (suspectedParts && suspectedParts.length > 0) {
    const mostRecentPart = suspectedParts[0];
    const partName = mostRecentPart.type || mostRecentPart.description || '';
    
    if (partName) {
      // Extract key words from part name (avoid long descriptions)
      const partKeywords = partName.split(' ').slice(0, 3).join(' ');
      query = `${query} after ${partKeywords} install`;
    }
  }

  return query.trim();
}
