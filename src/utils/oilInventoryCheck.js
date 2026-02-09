/**
 * Check if inventory has the required oil for a vehicle's oil change
 * @param {Object} vehicle - Vehicle object with recommendedFluids
 * @param {Array} inventory - Array of inventory items
 * @returns {Object} Status object with hasEnough, available, required, message
 */
export function checkOilInventory(vehicle, inventory) {
  if (!vehicle || !vehicle.recommendedFluids) {
    return {
      hasEnough: false,
      available: 0,
      required: 0,
      message: 'Vehicle oil specifications not available',
      oilType: null,
      oilCapacity: null
    };
  }

  const requiredOilType = vehicle.recommendedFluids.engineOil || '';
  const oilCapacityString = vehicle.recommendedFluids.engineOilCapacity || '';
  
  // Parse required capacity (e.g., "5.0 quarts" -> 5.0)
  const capacityMatch = oilCapacityString.match(/(\d+\.?\d*)/);
  const requiredQuarts = capacityMatch ? parseFloat(capacityMatch[1]) : null;
  
  if (!requiredOilType || !requiredQuarts) {
    return {
      hasEnough: false,
      available: 0,
      required: requiredQuarts || 0,
      message: 'Oil specifications incomplete',
      oilType: requiredOilType,
      oilCapacity: oilCapacityString
    };
  }

  // Find matching oil in inventory
  // Look for items that contain the oil type (e.g., "5W-30", "0W-20") and are in the Fluids category
  const oilTypeParts = requiredOilType.toLowerCase().split(/\s+/);
  const oilViscosity = oilTypeParts.find(part => part.match(/^\d+w-\d+$/i)) || '';
  
  let totalAvailableQuarts = 0;
  const matchingItems = [];
  
  inventory.forEach(item => {
    const itemName = (item.name || '').toLowerCase();
    const itemCategory = (item.category || '').toLowerCase();
    
    // Check if item is oil-related
    const isOil = itemName.includes('oil') || itemName.includes('motor oil') || itemCategory === 'fluids';
    
    if (isOil) {
      // Check if oil type matches (look for viscosity like "5w-30" or "0w-20")
      const itemHasViscosity = oilViscosity && itemName.includes(oilViscosity.toLowerCase());
      // Also check for generic matches if viscosity not found
      const isGenericMatch = !oilViscosity || itemName.includes('motor oil') || itemName.includes('engine oil');
      
      if (itemHasViscosity || (isGenericMatch && !oilViscosity)) {
        // Check if item is vehicle-specific
        const isVehicleSpecific = item.vehicleIds && item.vehicleIds.length > 0;
        const isForThisVehicle = vehicle.id && item.vehicleIds && item.vehicleIds.includes(vehicle.id);
        
        // Include if: general item OR specific to this vehicle
        if (!isVehicleSpecific || isForThisVehicle) {
          const quantity = parseFloat(item.quantity) || 0;
          const unit = (item.unit || '').toLowerCase();
          
          // Convert to quarts based on unit
          let quarts = 0;
          if (unit.includes('quart')) {
            quarts = quantity;
          } else if (unit.includes('liter') || unit.includes('litre')) {
            quarts = quantity * 1.05669; // 1 liter ≈ 1.05669 quarts
          } else if (unit.includes('gallon')) {
            quarts = quantity * 4;
          } else if (unit.includes('container') || unit.includes('bottle') || unit.includes('unit')) {
            // Assume 1 container = 5 quarts (standard oil container)
            quarts = quantity * 5;
          } else {
            // Default: assume it's in quarts
            quarts = quantity;
          }
          
          totalAvailableQuarts += quarts;
          matchingItems.push({
            name: item.name,
            quantity: quantity,
            unit: item.unit || 'units',
            quarts: quarts
          });
        }
      }
    }
  });

  const hasEnough = totalAvailableQuarts >= requiredQuarts;
  const shortfall = Math.max(0, requiredQuarts - totalAvailableQuarts);
  
  let message = '';
  if (hasEnough) {
    message = `✓ You have ${totalAvailableQuarts.toFixed(1)} quarts of ${requiredOilType} in stock (need ${requiredQuarts.toFixed(1)} quarts)`;
  } else {
    message = `⚠ Need to purchase: ${shortfall.toFixed(1)} more quarts of ${requiredOilType} (have ${totalAvailableQuarts.toFixed(1)}/${requiredQuarts.toFixed(1)} quarts)`;
  }

  return {
    hasEnough,
    available: totalAvailableQuarts,
    required: requiredQuarts,
    message,
    oilType: requiredOilType,
    oilCapacity: oilCapacityString,
    matchingItems
  };
}
