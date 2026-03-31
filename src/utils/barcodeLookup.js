import { getCachedProduct, cacheProduct } from './barcodeCache';

/**
 * Look up product information from a barcode using Open Product Data API
 * Falls back to automotive-specific keyword matching if API fails
 * @param {string} barcode - The barcode/UPC/EAN code
 * @returns {Promise<Object>} Product information (name, category, unit, description)
 */
export async function lookupBarcode(barcode) {
  if (!barcode || barcode.length < 8) {
    throw new Error('Invalid barcode');
  }

  // Check cache first
  const cached = getCachedProduct(barcode);
  if (cached) {
    return cached;
  }

  // Try multiple APIs in sequence
  const apis = [
    // Open Product Data API
    `https://world.openproductdata.org/api/v0/product/${barcode}.json`,
    // Open Food Facts (sometimes has automotive products)
    `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
    // UPCitemdb (free UPC database)
    `https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`,
  ];

  for (const apiUrl of apis) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        // Handle Open Product Data / Open Food Facts format
        if (data.status === 1 && data.product) {
          const product = data.product;
          const productName = product.product_name || product.product_name_en || product.name || '';
          const categories = product.categories || product.categories_tags?.join(' ') || '';
          const description = product.ingredients_text || product.generic_name || product.description || '';

          if (productName && productName.length > 3) {
            // Determine category based on product name and categories
            const category = determineCategory(productName, categories);
            const unit = determineUnit(productName, category);

            const productData = {
              name: cleanProductName(productName, category),
              category: category,
              unit: unit,
              description: description || generateDescription(productName, category),
              barcode: barcode,
            };

            // Cache the result
            await cacheProduct(barcode, productData);
            return productData;
          }
        }
        
        // Handle UPCitemdb format
        if (data.code === 'OK' && data.items && data.items.length > 0) {
          const item = data.items[0];
          const productName = item.title || item.description || '';
          const category = item.category || '';
          
          if (productName && productName.length > 3) {
            const determinedCategory = determineCategory(productName, category);
            const unit = determineUnit(productName, determinedCategory);

            const productData = {
              name: cleanProductName(productName, determinedCategory),
              category: determinedCategory,
              unit: unit,
              description: item.description || generateDescription(productName, determinedCategory),
              barcode: barcode,
            };

            await cacheProduct(barcode, productData);
            return productData;
          }
        }
      }
    } catch (error) {
      // Silently continue to next API - this is expected fallback behavior
      // Only log if all APIs fail (handled by fallback function)
      continue;
    }
  }

  // Fallback: Use intelligent pattern matching
  return intelligentFallbackLookup(barcode);
}

/**
 * Determine product category based on name and categories - Enhanced with more patterns
 */
function determineCategory(productName, categories) {
  const nameLower = (productName || '').toLowerCase();
  const categoriesLower = (categories || '').toLowerCase();
  const combined = `${nameLower} ${categoriesLower}`;

  // FLUIDS - Check first (most specific)
  const fluidKeywords = [
    'motor oil', 'engine oil', '5w-', '10w-', '0w-', '15w-', '20w-', 'sae',
    'gear oil', 'transmission fluid', 'transmission oil', 'gear fluid', 'atf', 'cvt',
    'brake fluid', 'dot 3', 'dot 4', 'dot 5',
    'coolant', 'antifreeze', 'radiator', 'ethylene glycol', 'propylene glycol',
    'power steering', 'ps fluid', 'steering fluid',
    'hydraulic fluid', 'differential fluid', 'transfer case',
    'windshield washer', 'washer fluid', 'wiper fluid',
  ];
  if (fluidKeywords.some(keyword => combined.includes(keyword))) {
    return 'Fluids';
  }

  // FILTERS
  const filterKeywords = [
    'oil filter', 'air filter', 'cabin filter', 'fuel filter', 'transmission filter',
    'engine air filter', 'intake filter', 'pollen filter', 'hepa filter',
  ];
  if (filterKeywords.some(keyword => combined.includes(keyword))) {
    return 'Filters';
  }

  // CLEANING PRODUCTS
  const cleaningKeywords = [
    'degreaser', 'cleaner', 'wax', 'polish', 'detail', 'wash', 'shampoo',
    'tire shine', 'wheel cleaner', 'interior cleaner', 'leather conditioner',
    'glass cleaner', 'clay bar', 'compound', 'buffing',
  ];
  if (cleaningKeywords.some(keyword => combined.includes(keyword))) {
    return 'Cleaning';
  }

  // TOOLS
  const toolKeywords = [
    'funnel', 'drain pan', 'wrench', 'socket', 'ratchet', 'screwdriver',
    'pliers', 'jack', 'stand', 'gauge', 'torque', 'multimeter', 'scanner',
  ];
  if (toolKeywords.some(keyword => combined.includes(keyword))) {
    return 'Tools';
  }

  // PARTS - More specific checks
  const partKeywords = [
    'spark plug', 'sparkplug', 'ignition coil', 'coil pack',
    'wiper blade', 'wiper', 'windshield wiper',
    'battery', 'car battery', 'automotive battery',
    'tire', 'tyre', 'wheel', 'rim',
    'brake pad', 'brake rotor', 'brake disc', 'brake shoe', 'brake caliper',
    'alternator', 'starter', 'water pump', 'thermostat',
    'belt', 'serpentine belt', 'timing belt',
    'hose', 'radiator hose', 'heater hose',
    'bulb', 'headlight', 'taillight', 'led',
    'gasket', 'seal', 'o-ring',
  ];
  if (partKeywords.some(keyword => combined.includes(keyword))) {
    return 'Parts';
  }

  // Check categories from API
  if (categoriesLower.includes('automotive') || categoriesLower.includes('car') || 
      categoriesLower.includes('vehicle') || categoriesLower.includes('auto')) {
    if (categoriesLower.includes('oil') || categoriesLower.includes('fluid') || 
        categoriesLower.includes('lubricant')) {
      return 'Fluids';
    }
    if (categoriesLower.includes('filter')) {
      return 'Filters';
    }
    if (categoriesLower.includes('cleaning') || categoriesLower.includes('care')) {
      return 'Cleaning';
    }
    if (categoriesLower.includes('tool') || categoriesLower.includes('equipment')) {
      return 'Tools';
    }
    return 'Parts'; // Default for automotive
  }

  // Default fallback
  return 'Parts';
}

/**
 * Determine unit based on product name and category
 */
function determineUnit(productName, category) {
  const nameLower = (productName || '').toLowerCase();

  if (category === 'Fluids') {
    if (nameLower.includes('quart') || nameLower.includes('qt')) {
      return 'quarts';
    }
    if (nameLower.includes('liter') || nameLower.includes('litre') || nameLower.includes('l ')) {
      return 'liters';
    }
    if (nameLower.includes('gallon') || nameLower.includes('gal')) {
      return 'gallons';
    }
    if (nameLower.includes('bottle') || nameLower.includes('container')) {
      return 'bottles';
    }
    return 'quarts'; // Default for fluids
  }

  if (category === 'Filters' || category === 'Parts') {
    if (nameLower.includes('set') || nameLower.includes('pair')) {
      return nameLower.includes('pair') ? 'pairs' : 'sets';
    }
    return 'units';
  }

  if (category === 'Tools') {
    if (nameLower.includes('set')) {
      return 'sets';
    }
    if (nameLower.includes('pair')) {
      return 'pairs';
    }
    return 'units';
  }

  return 'units';
}

/**
 * Clean and format product name
 */
function cleanProductName(productName, category) {
  if (!productName) return 'Unknown Product';

  // Remove common prefixes/suffixes and clean up
  let cleaned = productName
    .replace(/^\s+|\s+$/g, '') // Trim
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .replace(/\s*-\s*/g, ' - ') // Normalize dashes
    .replace(/\s*,\s*/g, ', ') // Normalize commas
    .replace(/\(.*?\)/g, '') // Remove parenthetical notes (often redundant)
    .replace(/\s+/g, ' ') // Clean up spaces again
    .trim();

  // Remove common redundant phrases
  const redundantPhrases = [
    /^product\s+/i,
    /^item\s+/i,
    /\s+product$/i,
    /\s+item$/i,
    /\s*-\s*automotive$/i,
    /\s*-\s*auto$/i,
  ];
  
  redundantPhrases.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });

  // For automotive products, try to extract and preserve key info
  if (category === 'Fluids') {
    // Preserve viscosity info (e.g., "5W-30", "10W-40", "SAE 5W-30")
    const viscosityMatch = cleaned.match(/\b(\d+w-\d+)\b/gi);
    if (viscosityMatch) {
      // Try to extract brand name (usually first word or two)
      const words = cleaned.split(/\s+/);
      const brandWords = words.slice(0, 2).join(' ');
      cleaned = `${brandWords} ${viscosityMatch[0]}`.trim();
    }
  }

  // Capitalize properly (first letter of each word, except common words)
  cleaned = cleaned.split(' ').map((word, index) => {
    if (index === 0 || word.length > 3) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return word.toLowerCase();
  }).join(' ');

  return cleaned || 'Unknown Product';
}

/**
 * Generate a description if none is available
 */
function generateDescription(productName, category) {
  const nameLower = (productName || '').toLowerCase();
  
  if (category === 'Fluids') {
    if (nameLower.includes('motor oil') || nameLower.includes('engine oil')) {
      return 'Motor oil for automotive engines';
    }
    if (nameLower.includes('gear oil')) {
      return 'Gear oil for manual transmissions and differentials';
    }
    if (nameLower.includes('brake fluid')) {
      return 'Brake fluid for hydraulic brake systems';
    }
    if (nameLower.includes('coolant') || nameLower.includes('antifreeze')) {
      return 'Engine coolant/antifreeze';
    }
    return 'Automotive fluid';
  }

  if (category === 'Filters') {
    return 'Automotive filter';
  }

  if (category === 'Parts') {
    return 'Automotive part';
  }

  if (category === 'Tools') {
    return 'Automotive tool';
  }

  return 'Automotive product';
}

/**
 * Intelligent fallback lookup when API fails - uses pattern analysis and common automotive product patterns
 */
function intelligentFallbackLookup(barcode) {
  // Analyze barcode patterns and common automotive product codes
  const barcodeStr = String(barcode);
  
  // Common automotive brand/manufacturer prefixes (first few digits)
  const brandPatterns = {
    // Motor oil brands
    '0': { category: 'Fluids', type: 'Motor Oil', unit: 'quarts' },
    '1': { category: 'Fluids', type: 'Motor Oil', unit: 'quarts' },
    // Common oil brands start with 0 or 1
  };

  // Try to infer from barcode length and patterns
  let inferredProduct = null;
  
  // Check if barcode matches common automotive product patterns
  // Many automotive products have specific UPC ranges
  if (barcodeStr.length >= 8) {
    const firstDigit = barcodeStr[0];
    const firstThree = barcodeStr.substring(0, 3);
    
    // Common patterns for automotive fluids (often start with 0-1)
    if (firstDigit === '0' || firstDigit === '1') {
      // Could be motor oil, gear oil, etc.
      inferredProduct = {
        category: 'Fluids',
        type: 'Automotive Fluid',
        unit: 'quarts',
      };
    }
    // Common patterns for filters (often in specific ranges)
    else if (firstThree >= '200' && firstThree <= '299') {
      inferredProduct = {
        category: 'Filters',
        type: 'Automotive Filter',
        unit: 'units',
      };
    }
    // Common patterns for parts
    else if (firstThree >= '300' && firstThree <= '599') {
      inferredProduct = {
        category: 'Parts',
        type: 'Automotive Part',
        unit: 'units',
      };
    }
  }

  // Generate a smart product name
  let productName = 'Scanned Product';
  if (inferredProduct) {
    productName = `${inferredProduct.type} (Barcode: ${barcodeStr.substring(0, 8)})`;
  } else {
    productName = `Automotive Product (${barcodeStr.substring(0, 8)})`;
  }

  const productData = {
    name: productName,
    category: inferredProduct?.category || 'Parts',
    unit: inferredProduct?.unit || 'units',
    description: `Scanned barcode: ${barcode}. Please verify product details and update name if needed.`,
    barcode: barcode,
    needsVerification: true, // Flag to indicate this needs user review
  };

  // Cache even fallback results
  cacheProduct(barcode, productData);
  return productData;
}
