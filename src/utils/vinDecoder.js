/**
 * VIN Decoder using NHTSA API
 * Decodes VIN to get vehicle year, make, model, and trim information
 */

/**
 * Decode VIN using NHTSA API
 * @param {string} vin - 17-character Vehicle Identification Number
 * @returns {Promise<Object>} Vehicle information including year, make, model, trim
 */
export async function decodeVIN(vin) {
  if (!vin || vin.length !== 17) {
    throw new Error('Invalid VIN. Must be exactly 17 characters.');
  }

  try {
    console.log('🔍 Decoding VIN:', vin);
    
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const json = await response.json();
    
    // NHTSA returns an array of results. We usually just want the first one.
    if (!json.Results || json.Results.length === 0) {
      throw new Error('No results found for this VIN.');
    }
    
    const data = json.Results[0];
    
    // Log the raw API response for debugging
    console.log('📋 NHTSA API Response:', {
      Make: data.Make,
      Model: data.Model,
      ModelYear: data.ModelYear,
      Trim: data.Trim,
      ErrorCode: data.ErrorCode,
      ErrorText: data.ErrorText,
    });
    
    // Check if there's an error code from NHTSA
    if (data.ErrorCode && data.ErrorCode !== '0' && data.ErrorCode !== 0) {
      const errorMsg = data.ErrorText || `NHTSA API error code: ${data.ErrorCode}`;
      console.error('❌ NHTSA API Error:', errorMsg);
      throw new Error(`VIN decode failed: ${errorMsg}`);
    }
    
    // Check if NHTSA actually found data (sometimes it returns success with empty fields)
    if (!data.Make || !data.Model) {
      // Log what we did get for debugging
      console.warn('⚠️ Incomplete VIN data:', {
        Make: data.Make || 'MISSING',
        Model: data.Model || 'MISSING',
        ModelYear: data.ModelYear || 'MISSING',
        Trim: data.Trim || 'MISSING',
      });
      throw new Error('Could not identify vehicle details from this VIN. The VIN may not be in the NHTSA database, or it may be for a non-US vehicle.');
    }
    
    // Map NHTSA response to our format (trim whitespace; NHTSA sometimes returns "Trim" with spaces or in Model)
    const rawTrim = (data.Trim && typeof data.Trim === 'string') ? data.Trim.trim() : null;
    const decodedData = {
      year: data.ModelYear ? String(data.ModelYear) : null,
      make: data.Make || null,
      model: data.Model || null,
      trim: rawTrim && rawTrim.length > 0 ? rawTrim : null,
      // Additional useful data we can use
      engine: data.DisplacementL && data.EngineCylinders 
        ? `${data.DisplacementL}L ${data.EngineCylinders} Cyl` 
        : data.EngineModel || null,
      fuelType: data.FuelTypePrimary || null,
      driveType: data.DriveType || null,
      bodyClass: data.BodyClass || null,
      plantCity: data.PlantCity || null,
      plantCountry: data.PlantCountry || null,
    };
    
    console.log('✅ VIN decoded successfully:', decodedData);
    
    return decodedData;
  } catch (error) {
    console.error('VIN decode error:', error);
    throw error;
  }
}

/**
 * Clean and validate VIN string
 * @param {string} vin - VIN string to clean
 * @returns {string} Cleaned VIN (uppercase, no spaces)
 */
export function cleanVIN(vin) {
  if (!vin) return '';
  return vin.toUpperCase().replace(/\s+/g, '').trim();
}

/**
 * Validate VIN format
 * @param {string} vin - VIN to validate
 * @returns {boolean} True if VIN is valid format (17 characters, alphanumeric)
 */
export function isValidVIN(vin) {
  if (!vin) return false;
  const cleaned = cleanVIN(vin);
  // VIN must be 17 characters, alphanumeric (excluding I, O, Q)
  const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinPattern.test(cleaned);
}
