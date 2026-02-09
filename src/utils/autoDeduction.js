/**
 * Maps maintenance types to inventory item keywords/categories
 * This helps identify which inventory items should be deducted
 */
const MAINTENANCE_TO_INVENTORY_MAP = {
  'Oil Change': {
    keywords: ['oil', 'engine oil', 'motor oil'],
    quantity: 1, // Typically 1 oil change = 1 container (or vehicle-specific capacity)
    unit: 'container'
  },
  'Filter Replacement': {
    keywords: ['filter', 'air filter', 'cabin filter', 'oil filter', 'engine air filter', 'cabin air filter'],
    quantity: 1,
    unit: 'filter'
  },
  'Cabin Air Filter': {
    keywords: ['cabin filter', 'cabin air filter', 'air filter'],
    quantity: 1,
    unit: 'filter'
  },
  'Engine Air Filter': {
    keywords: ['air filter', 'engine air filter', 'engine filter'],
    quantity: 1,
    unit: 'filter'
  },
  'Brake Service': {
    keywords: ['brake', 'brake fluid', 'brake pad', 'brake rotor'],
    quantity: 1,
    unit: 'item'
  },
  'Fluid Top-off': {
    keywords: ['fluid', 'coolant', 'transmission fluid', 'power steering', 'washer fluid'],
    quantity: 1,
    unit: 'container'
  },
  'Tune-up': {
    keywords: ['spark plug', 'sparkplug', 'ignition'],
    quantity: 1,
    unit: 'set'
  }
};

/**
 * Find matching inventory items for a maintenance type
 * @param {string} maintenanceType - Type of maintenance (e.g., "Oil Change")
 * @param {Array} inventory - Array of inventory items
 * @param {string} vehicleId - Optional vehicle ID to filter vehicle-specific items
 * @param {Object} vehicle - Optional vehicle object for recommended oil matching
 * @returns {Array} Matching inventory items with deduction info
 */
export function findMatchingInventoryItems(maintenanceType, inventory, vehicleId = null, vehicle = null) {
  const mapping = MAINTENANCE_TO_INVENTORY_MAP[maintenanceType];
  if (!mapping) {
    return []; // No mapping for this maintenance type
  }

  const matches = [];
  const lowerKeywords = mapping.keywords.map(k => k.toLowerCase());
  const recommendedOil = vehicle?.recommendedFluids?.engineOil || null;

  inventory.forEach(item => {
    const itemName = (item.name || '').toLowerCase();
    const itemCategory = (item.category || '').toLowerCase();
    
    // Check if item name or category matches any keyword
    const matchesKeyword = lowerKeywords.some(keyword => 
      itemName.includes(keyword) || itemCategory.includes(keyword)
    );

    if (matchesKeyword) {
      // For oil changes, check if it matches the recommended oil type
      if (maintenanceType === 'Oil Change' && recommendedOil) {
        if (!matchesRecommendedOil(item, recommendedOil)) {
          return; // Skip items that don't match recommended oil
        }
      }
      
      // Check if item is vehicle-specific
      const isVehicleSpecific = item.vehicleIds && item.vehicleIds.length > 0;
      const isForThisVehicle = vehicleId && item.vehicleIds && item.vehicleIds.includes(vehicleId);
      
      // Include if:
      // 1. Item is general (no vehicle association), OR
      // 2. Item is specific to this vehicle
      if (!isVehicleSpecific || isForThisVehicle) {
        matches.push({
          item: item,
          quantityToDeduct: mapping.quantity,
          unit: mapping.unit
        });
      }
    }
  });

  return matches;
}

/**
 * Parse oil capacity from string (e.g., "5.0 quarts" -> 5.0)
 * @param {string} capacityString - Capacity string like "5.0 quarts" or "4.5 liters"
 * @returns {number|null} Numeric capacity value in quarts, or null if unable to parse
 */
function parseOilCapacity(capacityString) {
  if (!capacityString) return null;
  
  // Extract numeric value from string (handles formats like "5.0 quarts", "4.5L", etc.)
  const match = capacityString.match(/(\d+\.?\d*)/);
  if (!match) return null;
  
  const value = parseFloat(match[1]);
  if (isNaN(value)) return null;
  
  // Check if it's in liters (common formats: "L", "liters", "litres")
  const isLiters = capacityString.toLowerCase().includes('l') && !capacityString.toLowerCase().includes('quart');
  
  // Convert liters to quarts (1 liter = 1.05669 quarts)
  if (isLiters) {
    return value * 1.05669;
  }
  
  // Already in quarts
  return value;
}

/**
 * Check if inventory item matches the recommended oil type for the vehicle
 * @param {Object} item - Inventory item
 * @param {string} recommendedOil - Recommended oil string like "5W-30 Synthetic" or "0W-20"
 * @returns {boolean} True if item matches recommended oil
 */
function matchesRecommendedOil(item, recommendedOil) {
  if (!recommendedOil) return false;
  
  const itemName = (item.name || '').toLowerCase();
  const itemCategory = (item.category || '').toLowerCase();
  
  // Extract viscosity from recommended oil (e.g., "5W-30", "0W-20", "10W-40")
  const viscosityMatch = recommendedOil.match(/(\d+W-\d+)/i);
  if (!viscosityMatch) {
    // No specific viscosity, check for general match
    return itemName.includes('oil') || itemName.includes('motor oil');
  }
  
  const viscosity = viscosityMatch[1].toLowerCase();
  
  // Check if item name contains the viscosity (e.g., "5w-30", "5w30", etc.)
  // Handle variations like "5W-30", "5w30", "5w 30"
  const normalizedViscosity = viscosity.replace(/-/g, '').replace(/\s+/g, '');
  const normalizedItemName = itemName.replace(/-/g, '').replace(/\s+/g, '');
  
  if (normalizedItemName.includes(normalizedViscosity)) {
    return true;
  }
  
  // Also check for common variations (e.g., "Motor Oil 5W-30" matches "5W-30")
  // Split viscosity to check parts separately (e.g., "5w" and "30")
  const parts = viscosity.split('w');
  if (parts.length === 2 && normalizedItemName.includes(parts[0]) && normalizedItemName.includes(parts[1])) {
    return true;
  }
  
  return false;
}

/**
 * Deduct consumables from inventory based on maintenance type
 * @param {string} maintenanceType - Type of maintenance
 * @param {Array} inventory - Current inventory array
 * @param {string} vehicleId - Vehicle ID for filtering vehicle-specific items
 * @param {Object} vehicle - Optional vehicle object for capacity-based deductions
 * @returns {Object} { updatedInventory, deductedItems, warnings }
 */
export function deductConsumables(maintenanceType, inventory, vehicleId = null, vehicle = null) {
  const matches = findMatchingInventoryItems(maintenanceType, inventory, vehicleId, vehicle);
  const updatedInventory = [...inventory];
  const deductedItems = [];
  const warnings = [];

  matches.forEach(({ item, quantityToDeduct }) => {
    const index = updatedInventory.findIndex(i => i.id === item.id);
    if (index === -1) return;

    const currentQuantity = parseFloat(item.quantity) || 0;
    const itemUnit = (item.unit || 'units').toLowerCase();
    
    // For oil changes, use vehicle's oil capacity if available
    let deductAmount = parseFloat(quantityToDeduct) || 1;
    let capacityInfo = null;
    if (maintenanceType === 'Oil Change' && vehicle && vehicle.recommendedFluids) {
      const oilCapacity = parseOilCapacity(vehicle.recommendedFluids.engineOilCapacity);
      if (oilCapacity !== null) {
        // Round up to nearest quart for usage amount
        // e.g., 4.5 quarts -> 5 quarts
        // e.g., 4.2 quarts -> 5 quarts
        // e.g., 7.4 quarts -> 8 quarts
        // e.g., 5.0 quarts -> 5 quarts (stays 5)
        const quartsNeeded = Math.ceil(oilCapacity);
        
        // Convert quarts needed to the inventory item's unit for deduction
        // If item is stored in quarts, deduct that many quarts directly
        // If item is stored in containers/bottles (typically 5 quarts each), convert
        if (itemUnit.includes('quart') || itemUnit === 'qt' || itemUnit === 'qts') {
          // Item is stored in quarts - deduct the rounded quart amount
          deductAmount = quartsNeeded;
        } else if (itemUnit.includes('container') || itemUnit.includes('bottle')) {
          // Item is stored in containers/bottles - assume standard 5-quart containers
          // Convert quarts to containers and round up
          // e.g., 5 quarts = 1 container, 6 quarts = 2 containers, 4 quarts = 1 container (rounded up)
          const containersNeeded = Math.ceil(quartsNeeded / 5);
          deductAmount = containersNeeded;
        } else {
          // For other units (units, etc.), assume 1 unit = 1 quart for deduction
          // This handles cases where user stores oil with unit "units" meaning quarts
          deductAmount = quartsNeeded;
        }
        
        capacityInfo = {
          original: oilCapacity,
          quartsNeeded: quartsNeeded,
          deductAmount: deductAmount,
          capacityString: vehicle.recommendedFluids.engineOilCapacity,
          recommendedOil: vehicle.recommendedFluids.engineOil,
          itemUnit: itemUnit
        };
      }
    }

    if (currentQuantity >= deductAmount) {
      // Deduct the quantity
      updatedInventory[index] = {
        ...updatedInventory[index],
        quantity: Math.max(0, currentQuantity - deductAmount)
      };

      deductedItems.push({
        name: item.name,
        quantityDeducted: deductAmount,
        remainingQuantity: Math.max(0, currentQuantity - deductAmount),
        unit: item.unit || 'units',
        capacityInfo: capacityInfo // Store capacity info for message display
      });
    } else {
      // Not enough quantity
      warnings.push({
        name: item.name,
        requested: deductAmount,
        available: currentQuantity,
        unit: item.unit || 'units',
        capacityInfo: capacityInfo
      });
    }
  });

  return {
    updatedInventory,
    deductedItems,
    warnings
  };
}

/**
 * Get a user-friendly message about what was deducted
 * @param {Array} deductedItems - Items that were deducted
 * @param {Array} warnings - Items that couldn't be fully deducted
 * @returns {string} Message to display to user
 */
export function getDeductionMessage(deductedItems, warnings) {
  if (deductedItems.length === 0 && warnings.length === 0) {
    return null;
  }

  let message = '';

  if (deductedItems.length > 0) {
    message += 'Deducted from inventory:\n';
    deductedItems.forEach(item => {
      let itemMessage = `• ${item.name}: -${item.quantityDeducted} ${item.unit}`;
      // Show oil capacity info if available
      if (item.capacityInfo) {
        itemMessage += `\n  Oil capacity: ${item.capacityInfo.capacityString}`;
        itemMessage += `\n  Usage: ${item.capacityInfo.original.toFixed(2)} quarts → rounded up to ${item.capacityInfo.quartsNeeded} quarts`;
        if (item.capacityInfo.itemUnit !== 'quarts' && item.capacityInfo.itemUnit !== 'qt' && item.capacityInfo.itemUnit !== 'qts') {
          itemMessage += ` (${item.quantityDeducted} ${item.unit} deducted)`;
        }
        if (item.capacityInfo.recommendedOil) {
          itemMessage += `\n  Matched to recommended oil: ${item.capacityInfo.recommendedOil}`;
        }
      }
      itemMessage += `\n  Remaining: ${item.remainingQuantity} ${item.unit}`;
      message += itemMessage + '\n';
    });
  }

  if (warnings.length > 0) {
    if (message) message += '\n';
    message += 'Insufficient inventory:\n';
    warnings.forEach(warning => {
      let warningMessage = `• ${warning.name}: Only ${warning.available} ${warning.unit} available (${warning.requested} ${warning.unit} needed`;
      // Show oil capacity info if available
      if (warning.capacityInfo) {
        warningMessage += `\n  Oil capacity: ${warning.capacityInfo.capacityString}`;
        warningMessage += `\n  Required: ${warning.capacityInfo.quartsNeeded} quarts (rounded up from ${warning.capacityInfo.original.toFixed(2)} quarts)`;
        if (warning.capacityInfo.recommendedOil) {
          warningMessage += `\n  Recommended oil: ${warning.capacityInfo.recommendedOil}`;
        }
      }
      warningMessage += ')\n';
      message += warningMessage;
    });
  }

  return message;
}
