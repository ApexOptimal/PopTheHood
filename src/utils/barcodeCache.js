import { storage } from './storage';

const BARCODE_CACHE_KEY = 'barcodeProductCache';

/**
 * Get cached product information for a barcode
 * @param {string} barcode - The barcode/SKU
 * @returns {Object|null} Cached product data or null if not found
 */
export function getCachedProduct(barcode) {
  const cache = storage.get(BARCODE_CACHE_KEY) || {};
  return cache[barcode] || null;
}

/**
 * Save product information for a barcode
 * @param {string} barcode - The barcode/SKU
 * @param {Object} productData - Product information (name, category, unit, etc.)
 */
export async function cacheProduct(barcode, productData) {
  if (!barcode) return;
  
  const cache = storage.get(BARCODE_CACHE_KEY) || {};
  cache[barcode] = {
    ...productData,
    cachedAt: new Date().toISOString(),
    scanCount: (cache[barcode]?.scanCount || 0) + 1
  };
  await storage.set(BARCODE_CACHE_KEY, cache);
}

/**
 * Get all cached products
 * @returns {Object} All cached products
 */
export function getAllCachedProducts() {
  return storage.get(BARCODE_CACHE_KEY) || {};
}

/**
 * Clear a specific cached product
 * @param {string} barcode - The barcode to clear
 */
export async function clearCachedProduct(barcode) {
  const cache = storage.get(BARCODE_CACHE_KEY) || {};
  delete cache[barcode];
  await storage.set(BARCODE_CACHE_KEY, cache);
}

/**
 * Clear all cached products
 */
export async function clearAllCachedProducts() {
  await storage.remove(BARCODE_CACHE_KEY);
}
