/**
 * NHTSA Recalls API
 * Fetches vehicle recall information from the NHTSA Recalls API
 */
import logger from './logger';

/**
 * Fetch recalls for a vehicle by Year, Make, and Model
 * @param {string} year - Vehicle year (e.g., "2020")
 * @param {string} make - Vehicle make (e.g., "Honda")
 * @param {string} model - Vehicle model (e.g., "Civic")
 * @returns {Promise<Array>} Array of recall objects
 */
export async function fetchRecalls(year, make, model) {
  if (!year || !make || !model) {
    if (__DEV__) console.warn('Missing required parameters for recalls:', { year, make, model });
    return [];
  }

  try {
    if (__DEV__) console.log('Fetching recalls for:', { year, make, model });

    // Generate model name variations to try
    // NHTSA API can be picky about model names, so we try multiple variations
    const modelVariations = [
      model, // Original model name
      model.split(' ')[0], // First word (e.g., "MX-5" from "MX-5 Miata")
      model.replace(/\s+/g, ''), // Remove spaces (e.g., "MX-5Miata")
      model.split('-')[0], // Before hyphen (e.g., "MX" from "MX-5")
    ].filter((v, i, arr) => v && arr.indexOf(v) === i); // Remove duplicates and empty strings

    // Special handling for known problematic models
    if (model.toLowerCase().includes('mx-5') || model.toLowerCase().includes('miata')) {
      modelVariations.push('MX-5', 'Miata', 'MX5');
    }

    if (__DEV__) console.log('Trying model variations:', modelVariations);

    // Try each model variation until one works
    for (const modelVariation of modelVariations) {
      const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(modelVariation)}&modelYear=${encodeURIComponent(year)}`;

      if (__DEV__) console.log('Trying Recalls API URL:', url);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
          // If 400 or 404, try next variation
          if (response.status === 400 || response.status === 404) {
            if (__DEV__) console.log(`Model variation "${modelVariation}" returned ${response.status}, trying next...`);
            continue;
          }
          // For other errors, throw
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Success! Process this response
        const json = await response.json();

        if (__DEV__) console.log(`Successfully fetched recalls using model: "${modelVariation}"`);

        // NHTSA API returns results in either "Results" (uppercase) or "results" (lowercase)
        // Check both to handle different API response formats
        const resultsArray = json.Results || json.results || [];

        // Process the results array
        if (Array.isArray(resultsArray) && resultsArray.length > 0) {
          // Filter out invalid recalls
          const validRecalls = resultsArray.filter(recall => {
            return recall && recall.NHTSACampaignNumber;
          });

          if (__DEV__) console.log(`Found ${validRecalls.length} valid recalls out of ${resultsArray.length} total for ${year} ${make} ${model}`);

          return validRecalls;
        }

        if (__DEV__) console.warn('No results array in NHTSA response. Keys:', Object.keys(json));
        return [];
      } catch (fetchError) {
        // If this variation failed, try the next one
        if (__DEV__) console.log(`Error with model variation "${modelVariation}":`, fetchError.message);
        if (modelVariation === modelVariations[modelVariations.length - 1]) {
          // Last variation, re-throw the error
          throw fetchError;
        }
        continue;
      }
    }

    // If we get here, all variations failed
    if (__DEV__) console.warn('All model variations failed. Could not fetch recalls.');
    return [];
  } catch (error) {
    logger.error('Error fetching recalls:', error);
    return [];
  }
}

/**
 * Format recall information for display
 * @param {Object} recall - Recall object from NHTSA API
 * @returns {Object} Formatted recall object
 */
export function formatRecall(recall) {
  return {
    campaignNumber: recall.NHTSACampaignNumber || 'N/A',
    manufacturer: recall.Manufacturer || 'Unknown',
    component: recall.Component || 'Unknown Component',
    summary: recall.Summary || recall.ReportReceivedDate || 'No summary available',
    consequence: recall.Consequence || '',
    remedy: recall.Remedy || '',
    dateReported: recall.ReportReceivedDate || '',
    dateReportedFormatted: recall.ReportReceivedDate
      ? new Date(recall.ReportReceivedDate).toLocaleDateString()
      : '',
  };
}

/**
 * Get recall summary message
 * @param {number} recallCount - Number of recalls
 * @returns {string} Summary message
 */
export function getRecallSummaryMessage(recallCount) {
  if (recallCount === 0) {
    return 'No known recalls for this vehicle model.';
  } else if (recallCount === 1) {
    return 'Your vehicle model has 1 known recall. Check with your dealer or the NHTSA Recalls Site to see if your specific car has been repaired.';
  } else {
    return `Your vehicle model has ${recallCount} known recalls. Check with your dealer or the NHTSA Recalls Site to see if your specific car has been repaired.`;
  }
}
