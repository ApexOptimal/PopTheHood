/**
 * Unit conversion utilities for metric/imperial system
 * All internal storage remains in imperial (miles, quarts, ft-lb)
 * Conversions only apply to display values
 */

// Conversion constants
const MILES_TO_KM = 1.60934;
const KM_TO_MILES = 1 / MILES_TO_KM;
const QUARTS_TO_LITERS = 0.946353;
const LITERS_TO_QUARTS = 1 / QUARTS_TO_LITERS;
const GALLONS_TO_LITERS = 3.78541;
const LITERS_TO_GALLONS = 1 / GALLONS_TO_LITERS;
const FT_LB_TO_NM = 1.35582;
const NM_TO_FT_LB = 1 / FT_LB_TO_NM;

import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache for synchronous access
// Default to 'imperial' immediately, will be updated from AsyncStorage if different
let unitSystemCache = 'imperial';
let unitSystemCacheInitialized = false;

// Initialize unit system cache
const initializeUnitSystemCache = async () => {
  if (unitSystemCacheInitialized) return;
  
  try {
    const stored = await AsyncStorage.getItem('unitSystem');
    if (stored === 'metric' || stored === 'imperial') {
      unitSystemCache = stored;
    }
    unitSystemCacheInitialized = true;
  } catch (error) {
    console.error('Error loading unit system:', error);
    // Keep default 'imperial' on error
    unitSystemCacheInitialized = true;
  }
};

// Initialize on load (fire and forget)
initializeUnitSystemCache();

/**
 * Get the current unit system preference
 * @returns {string} 'imperial' or 'metric'
 */
export function getUnitSystem() {
  // Return cached value (always has a default of 'imperial' until async load completes)
  return unitSystemCache;
}

/**
 * Get the current unit system preference (async)
 * @returns {Promise<string>} 'imperial' or 'metric'
 */
export async function getUnitSystemAsync() {
  if (!unitSystemCacheInitialized) {
    await initializeUnitSystemCache();
  }
  return getUnitSystem();
}

/**
 * Set the unit system preference
 * @param {string} system - 'imperial' or 'metric'
 */
export async function setUnitSystem(system) {
  if (system === 'metric' || system === 'imperial') {
    try {
      unitSystemCache = system;
      await AsyncStorage.setItem('unitSystem', system);
    } catch (error) {
      console.error('Error saving unit system:', error);
    }
  }
}

/**
 * Convert miles to kilometers
 * @param {number} miles - Distance in miles
 * @returns {number} Distance in kilometers
 */
function milesToKm(miles) {
  return miles * MILES_TO_KM;
}

/**
 * Convert kilometers to miles
 * @param {number} km - Distance in kilometers
 * @returns {number} Distance in miles
 */
function kmToMiles(km) {
  return km * KM_TO_MILES;
}

/**
 * Convert quarts to liters
 * @param {number} quarts - Volume in quarts
 * @returns {number} Volume in liters
 */
function quartsToLiters(quarts) {
  return quarts * QUARTS_TO_LITERS;
}

/**
 * Convert liters to quarts
 * @param {number} liters - Volume in liters
 * @returns {number} Volume in quarts
 */
function litersToQuarts(liters) {
  return liters * LITERS_TO_QUARTS;
}

/**
 * Convert gallons to liters
 * @param {number} gallons - Volume in gallons
 * @returns {number} Volume in liters
 */
function gallonsToLiters(gallons) {
  return gallons * GALLONS_TO_LITERS;
}

/**
 * Convert liters to gallons
 * @param {number} liters - Volume in liters
 * @returns {number} Volume in gallons
 */
function litersToGallons(liters) {
  return liters * LITERS_TO_GALLONS;
}

/**
 * Convert ft-lb to N⋅m
 * @param {number} ftLb - Torque in ft-lb
 * @returns {number} Torque in N⋅m
 */
function ftLbToNm(ftLb) {
  return ftLb * FT_LB_TO_NM;
}

/**
 * Convert N⋅m to ft-lb
 * @param {number} nm - Torque in N⋅m
 * @returns {number} Torque in ft-lb
 */
function nmToFtLb(nm) {
  return nm * NM_TO_FT_LB;
}

/**
 * Format distance with appropriate unit
 * @param {number} miles - Distance in miles (internal storage)
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted string with unit
 */
export function formatDistance(miles, decimals = 0) {
  if (miles === null || miles === undefined || isNaN(miles)) {
    return 'N/A';
  }
  
  const system = getUnitSystem();
  const value = parseFloat(miles);
  
  if (system === 'metric') {
    const km = milesToKm(value);
    return `${km.toFixed(decimals).replace(/\.?0+$/, '')} km`;
  } else {
    return `${value.toFixed(decimals).replace(/\.?0+$/, '')} mi`;
  }
}

/**
 * Format distance with thousand separators
 * @param {number} miles - Distance in miles (internal storage)
 * @returns {string} Formatted string with unit and separators
 */
export function formatDistanceWithSeparators(miles) {
  if (miles === null || miles === undefined || isNaN(miles)) {
    return 'N/A';
  }
  
  const system = getUnitSystem();
  const value = parseFloat(miles);
  
  if (system === 'metric') {
    const km = milesToKm(value);
    return `${Math.round(km).toLocaleString()} km`;
  } else {
    return `${Math.round(value).toLocaleString()} mi`;
  }
}

/**
 * Parse distance input from user (converts to miles for storage)
 * @param {string|number} input - User input (could be in km or miles)
 * @param {string} inputUnit - 'km' or 'mi' (default: based on current system)
 * @returns {number} Distance in miles (for storage)
 */
export function parseDistanceInput(input, inputUnit = null) {
  if (!input || input === '') return null;
  
  const value = parseFloat(input);
  if (isNaN(value)) return null;
  
  const system = getUnitSystem();
  const unit = inputUnit || (system === 'metric' ? 'km' : 'mi');
  
  if (unit === 'km' || unit.toLowerCase() === 'kilometer' || unit.toLowerCase() === 'kilometers') {
    return kmToMiles(value);
  } else {
    return value; // Already in miles
  }
}

/**
 * Convert distance for display (miles to current system)
 * @param {number} miles - Distance in miles (internal storage)
 * @returns {number} Distance in current display unit
 */
export function convertDistanceForDisplay(miles) {
  if (miles === null || miles === undefined || isNaN(miles)) {
    return null;
  }
  
  const system = getUnitSystem();
  if (system === 'metric') {
    return milesToKm(parseFloat(miles));
  } else {
    return parseFloat(miles);
  }
}

/**
 * Format volume with appropriate unit
 * @param {number} quarts - Volume in quarts (internal storage)
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted string with unit
 */
export function formatVolume(quarts, decimals = 1) {
  if (quarts === null || quarts === undefined || isNaN(quarts)) {
    return 'N/A';
  }
  
  const system = getUnitSystem();
  const value = parseFloat(quarts);
  
  if (system === 'metric') {
    const liters = quartsToLiters(value);
    return `${liters.toFixed(decimals)} L`;
  } else {
    return `${value.toFixed(decimals)} qt`;
  }
}

/**
 * Parse volume input from user (converts to quarts for storage)
 * @param {string|number} input - User input
 * @param {string} inputUnit - 'L', 'qt', 'gal' etc.
 * @returns {number} Volume in quarts (for storage)
 */
export function parseVolumeInput(input, inputUnit = null) {
  if (!input || input === '') return null;
  
  const value = parseFloat(input);
  if (isNaN(value)) return null;
  
  if (!inputUnit) {
    // Try to detect from string
    const str = String(input).toLowerCase();
    if (str.includes('l') || str.includes('liter') || str.includes('litre')) {
      inputUnit = 'L';
    } else if (str.includes('gal')) {
      inputUnit = 'gal';
    } else {
      // Default based on system
      const system = getUnitSystem();
      inputUnit = system === 'metric' ? 'L' : 'qt';
    }
  }
  
  const unit = inputUnit.toLowerCase();
  if (unit === 'l' || unit === 'liter' || unit === 'litre') {
    return litersToQuarts(value);
  } else if (unit === 'gal' || unit === 'gallon') {
    return value * 4; // 1 gallon = 4 quarts
  } else {
    return value; // Assume quarts
  }
}

/**
 * Format torque with appropriate unit
 * @param {number} ftLb - Torque in ft-lb (internal storage)
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted string with unit
 */
export function formatTorque(ftLb, decimals = 0) {
  if (ftLb === null || ftLb === undefined || isNaN(ftLb)) {
    return 'N/A';
  }
  
  const system = getUnitSystem();
  const value = parseFloat(ftLb);
  
  if (system === 'metric') {
    const nm = ftLbToNm(value);
    return `${nm.toFixed(decimals)} N⋅m`;
  } else {
    return `${value.toFixed(decimals)} ft-lb`;
  }
}

/**
 * Format a torque string that may contain ranges (e.g., "80-100 ft-lb" -> "108-136 N⋅m")
 * @param {string} torqueString - Torque string like "80-100 ft-lb" or "50 ft-lb"
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted torque string with converted units
 */
export function formatTorqueString(torqueString, decimals = 0) {
  if (!torqueString || torqueString.trim() === '' || torqueString === 'Not set') {
    return torqueString || 'Not set';
  }
  
  const system = getUnitSystem();
  const str = torqueString.trim();
  
  // Check if it's a range (e.g., "80-100 ft-lb")
  const rangeMatch = str.match(/^(\d+\.?\d*)\s*-\s*(\d+\.?\d*)\s*(ft-lb|ftlb|ft\s*lb|N⋅m|Nm|N\s*⋅\s*m|N\s*·\s*m)/i);
  if (rangeMatch) {
    const minValue = parseFloat(rangeMatch[1]);
    const maxValue = parseFloat(rangeMatch[2]);
    const inputUnit = rangeMatch[3].toLowerCase();
    
    if (system === 'metric') {
      // Convert to N⋅m
      let minNm, maxNm;
      if (inputUnit.includes('ft') || inputUnit.includes('lb')) {
        minNm = ftLbToNm(minValue);
        maxNm = ftLbToNm(maxValue);
      } else {
        // Already in N⋅m, just format
        minNm = minValue;
        maxNm = maxValue;
      }
      return `${minNm.toFixed(decimals)}-${maxNm.toFixed(decimals)} N⋅m`;
    } else {
      // Convert to ft-lb
      let minFtLb, maxFtLb;
      if (inputUnit.includes('nm') || inputUnit.includes('n⋅m') || inputUnit.includes('n·m')) {
        minFtLb = nmToFtLb(minValue);
        maxFtLb = nmToFtLb(maxValue);
      } else {
        // Already in ft-lb, just format
        minFtLb = minValue;
        maxFtLb = maxValue;
      }
      return `${minFtLb.toFixed(decimals)}-${maxFtLb.toFixed(decimals)} ft-lb`;
    }
  }
  
  // Check if it's a single value (e.g., "50 ft-lb")
  const singleMatch = str.match(/^(\d+\.?\d*)\s*(ft-lb|ftlb|ft\s*lb|N⋅m|Nm|N\s*⋅\s*m|N\s*·\s*m)/i);
  if (singleMatch) {
    const value = parseFloat(singleMatch[1]);
    const inputUnit = singleMatch[2].toLowerCase();
    
    if (system === 'metric') {
      // Convert to N⋅m
      let nm;
      if (inputUnit.includes('ft') || inputUnit.includes('lb')) {
        nm = ftLbToNm(value);
      } else {
        // Already in N⋅m
        nm = value;
      }
      return `${nm.toFixed(decimals)} N⋅m`;
    } else {
      // Convert to ft-lb
      let ftLb;
      if (inputUnit.includes('nm') || inputUnit.includes('n⋅m') || inputUnit.includes('n·m')) {
        ftLb = nmToFtLb(value);
      } else {
        // Already in ft-lb
        ftLb = value;
      }
      return `${ftLb.toFixed(decimals)} ft-lb`;
    }
  }
  
  // If we can't parse it, return as-is (might be a custom format)
  return torqueString;
}

/**
 * Parse torque input from user (converts to ft-lb for storage)
 * @param {string|number} input - User input
 * @param {string} inputUnit - 'N⋅m' or 'ft-lb'
 * @returns {number} Torque in ft-lb (for storage)
 */
export function parseTorqueInput(input, inputUnit = null) {
  if (!input || input === '') return null;
  
  const value = parseFloat(input);
  if (isNaN(value)) return null;
  
  if (!inputUnit) {
    const str = String(input).toLowerCase();
    if (str.includes('nm') || str.includes('n⋅m') || str.includes('n·m')) {
      inputUnit = 'N⋅m';
    } else {
      inputUnit = 'ft-lb';
    }
  }
  
  const unit = inputUnit.toLowerCase();
  if (unit.includes('nm') || unit.includes('n⋅m') || unit.includes('n·m')) {
    return nmToFtLb(value);
  } else {
    return value; // Assume ft-lb
  }
}

/**
 * Get the distance unit label for current system
 * @returns {string} 'mi' or 'km'
 */
export function getDistanceUnit() {
  return getUnitSystem() === 'metric' ? 'km' : 'mi';
}

/**
 * Get the volume unit label for current system
 * @returns {string} 'L' or 'qt'
 */
export function getVolumeUnit() {
  return getUnitSystem() === 'metric' ? 'L' : 'qt';
}

/**
 * Get the torque unit label for current system
 * @returns {string} 'N⋅m' or 'ft-lb'
 */
export function getTorqueUnit() {
  return getUnitSystem() === 'metric' ? 'N⋅m' : 'ft-lb';
}

/**
 * Format a capacity string (e.g., "5.0 quarts" -> "4.7 L" or "5.0 qt")
 * @param {string} capacityString - Capacity string like "5.0 quarts" or "5.0L"
 * @returns {string} Formatted capacity string
 */
export function formatCapacityString(capacityString) {
  if (!capacityString) return '';
  
  const system = getUnitSystem();
  
  // Extract number and unit
  const match = capacityString.match(/(\d+\.?\d*)\s*(quart|liter|litre|gal|gallon|L|qt|ml|milliliter)/i);
  if (!match) {
    return capacityString; // Return as-is if can't parse
  }
  
  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  
  if (system === 'metric') {
    let liters;
    if (unit.includes('quart') || unit === 'qt') {
      liters = quartsToLiters(value);
    } else if (unit.includes('gallon') || unit === 'gal') {
      liters = gallonsToLiters(value);
    } else if (unit.includes('liter') || unit === 'l') {
      liters = value;
    } else {
      liters = value / 1000; // ml to L
    }
    return `${liters.toFixed(1)} L`;
  } else {
    // Imperial - keep original format but standardize
    if (unit.includes('quart') || unit === 'qt') {
      return `${value.toFixed(1)} qt`;
    } else if (unit.includes('gallon') || unit === 'gal') {
      return `${value.toFixed(1)} gal`;
    } else {
      // Convert liters to quarts
      const quarts = litersToQuarts(value);
      return `${quarts.toFixed(1)} qt`;
    }
  }
}
