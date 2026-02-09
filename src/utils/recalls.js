/**
 * NHTSA Recalls API
 * Fetches vehicle recall information from the NHTSA Recalls API
 */

/**
 * Fetch recalls for a vehicle by Year, Make, and Model
 * @param {string} year - Vehicle year (e.g., "2020")
 * @param {string} make - Vehicle make (e.g., "Honda")
 * @param {string} model - Vehicle model (e.g., "Civic")
 * @returns {Promise<Array>} Array of recall objects
 */
export async function fetchRecalls(year, make, model) {
  if (!year || !make || !model) {
    console.warn('Missing required parameters for recalls:', { year, make, model });
    return [];
  }

  try {
    console.log('🔍 Fetching recalls for:', { year, make, model });
    
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
    
    console.log('🔄 Trying model variations:', modelVariations);
    
    // Try each model variation until one works
    for (const modelVariation of modelVariations) {
      const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(modelVariation)}&modelYear=${encodeURIComponent(year)}`;
      
      console.log('📡 Trying Recalls API URL:', url);
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          // If 400 or 404, try next variation
          if (response.status === 400 || response.status === 404) {
            console.log(`⚠️ Model variation "${modelVariation}" returned ${response.status}, trying next...`);
            continue;
          }
          // For other errors, throw
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Success! Process this response
        const json = await response.json();
        
        console.log(`✅ Successfully fetched recalls using model: "${modelVariation}"`);
        
        // NHTSA API returns results in either "Results" (uppercase) or "results" (lowercase)
        // Check both to handle different API response formats
        const resultsArray = json.Results || json.results || [];
        
        // Log the full response for debugging
        console.log('📦 NHTSA API Response:', {
          count: json.Count || json.count || 0,
          resultsCount: resultsArray.length,
          message: json.Message || json.message || 'No message',
          hasResults: !!json.Results,
          hasresults: !!json.results,
        });
        
        // If we got results, log a sample
        if (resultsArray.length > 0) {
          console.log('📋 Sample recall entry:', resultsArray[0]);
        }
        
        // Process the results array
        if (Array.isArray(resultsArray) && resultsArray.length > 0) {
          // Filter out invalid recalls and log what we're filtering
          const validRecalls = resultsArray.filter(recall => {
            const isValid = recall && recall.NHTSACampaignNumber;
            if (!isValid) {
              console.warn('⚠️ Invalid recall entry:', recall);
            }
            return isValid;
          });
          
          console.log(`✅ Found ${validRecalls.length} valid recalls out of ${resultsArray.length} total results for ${year} ${make} ${model}`);
          
          // Log full recall details for debugging
          if (validRecalls.length > 0) {
            validRecalls.forEach((recall, index) => {
              console.log(`📋 Recall ${index + 1}:`, {
                campaign: recall.NHTSACampaignNumber,
                component: recall.Component,
                manufacturer: recall.Manufacturer,
                summary: recall.Summary?.substring(0, 100),
              });
            });
          } else if (resultsArray.length > 0) {
            console.warn('⚠️ All recalls were filtered out as invalid. Raw results:', resultsArray);
          }
          
          return validRecalls;
        }
        
        // If no results array, log the full response to see what we got
        console.warn('⚠️ No results array in NHTSA response. Full response keys:', Object.keys(json));
        return [];
      } catch (fetchError) {
        // If this variation failed, try the next one
        console.log(`⚠️ Error with model variation "${modelVariation}":`, fetchError.message);
        if (modelVariation === modelVariations[modelVariations.length - 1]) {
          // Last variation, re-throw the error
          throw fetchError;
        }
        continue;
      }
    }
    
    // If we get here, all variations failed
    console.warn('⚠️ All model variations failed. Could not fetch recalls.');
    return [];
  } catch (error) {
    console.error('Error fetching recalls:', error);
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
