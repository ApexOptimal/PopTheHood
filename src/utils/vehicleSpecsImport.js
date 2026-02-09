import {
  getTrimDetails,
  defaultServiceIntervals,
  defaultFluids,
  defaultTorqueSpecs,
  defaultTires,
  defaultHardware,
  defaultLighting,
  defaultPartsSKUs,
  vehicleSpecificSpecs
} from '../data/vehicleData';

/**
 * Check if a year falls within a range string (e.g., "2015-2021") or matches a single year
 * @param {number} year - The year to check
 * @param {string|number} range - Range string like "2015-2021", single year string "2015", or number 2015
 * @returns {boolean} True if year falls within range
 */
function yearInRange(year, range) {
  if (range === null || range === undefined) return false;
  
  // Convert to string to handle both string and number inputs
  const rangeStr = String(range);
  
  // Handle single year (no dash)
  if (!rangeStr.includes('-')) {
    return parseInt(rangeStr) === year;
  }
  
  // Handle year range (e.g., "2015-2021")
  const [start, end] = rangeStr.split('-').map(y => parseInt(y.trim()));
  if (isNaN(start) || isNaN(end)) return false;
  return year >= start && year <= end;
}

/**
 * Get vehicle-specific specs for a given make/model/year/trim
 * Priority: Trim-specific > Base specs for year range > null
 * @param {string} make - Vehicle make
 * @param {string} model - Vehicle model
 * @param {number} year - Vehicle year
 * @param {string} trim - Vehicle trim (optional)
 * @returns {Object|null} Vehicle-specific specs or null if not found
 */
export function getVehicleSpecificSpecs(make, model, year, trim) {
  if (!vehicleSpecificSpecs[make] || !vehicleSpecificSpecs[make][model]) {
    return null;
  }
  
  const modelSpecs = vehicleSpecificSpecs[make][model];
  
  // Check each year range/key to find a match
  for (const key in modelSpecs) {
    if (yearInRange(year, key)) {
      const yearSpecs = modelSpecs[key];
      
      // First, check for trim-specific specs (most specific)
      if (trim && yearSpecs.trims && yearSpecs.trims[trim]) {
        // Merge trim-specific with base specs (trim overrides base)
        const trimSpecs = yearSpecs.trims[trim];
        const mergedSpecs = { ...yearSpecs };
        delete mergedSpecs.trims; // Remove trims object from result
        return mergeSpecs(mergedSpecs, trimSpecs);
      }
      
      // Return base specs for this year range (trim-specific not found or no trim provided)
      // Remove trims object before returning
      const baseSpecs = { ...yearSpecs };
      delete baseSpecs.trims;
      return Object.keys(baseSpecs).length > 0 ? baseSpecs : null;
    }
  }
  
  return null;
}

/**
 * Deep merge two spec objects, with spec2 taking precedence
 * @param {Object} spec1 - Base specs
 * @param {Object} spec2 - Override specs
 * @returns {Object} Merged specs
 */
function mergeSpecs(spec1, spec2) {
  const merged = { ...spec1 };
  
  for (const key in spec2) {
    if (typeof spec2[key] === 'object' && !Array.isArray(spec2[key]) && spec2[key] !== null && !(spec2[key] instanceof Date)) {
      // Recursively merge nested objects (like tires, hardware, etc.)
      merged[key] = mergeSpecs(spec1[key] || {}, spec2[key]);
    } else {
      // Override with spec2 value
      merged[key] = spec2[key];
    }
  }
  
  return merged;
}

/**
 * Import/update vehicle specifications (service intervals, fluids, torque values)
 * based on make, model, year, and trim
 * @param {Object} vehicle - The vehicle object
 * @returns {Object} Updated vehicle object with imported specs
 */
export function importVehicleSpecs(vehicle) {
  if (!vehicle.make || !vehicle.model || !vehicle.year) {
    return vehicle; // Can't import without basic info
  }

  // Check for vehicle-specific specs first (most specific, including trim)
  const specificSpecs = getVehicleSpecificSpecs(vehicle.make, vehicle.model, vehicle.year, vehicle.trim);

  // Get trim details to determine if turbo or high-performance
  const trimDetails = vehicle.trim ? getTrimDetails(vehicle.make, vehicle.model, vehicle.trim) : null;
  const isTurbo = trimDetails?.turbo || false;
  
  // Check if this is a high-performance trim (GT350, GT500, Hellcat, M-series, AMG, RS, Type R, STI, etc.)
  const isPerformance = vehicle.trim && (
    vehicle.trim.includes('GT350') || vehicle.trim.includes('GT500') || 
    vehicle.trim.includes('Hellcat') || vehicle.trim.includes('Demon') ||
    vehicle.trim.includes('M3') || vehicle.trim.includes('M4') || vehicle.trim.includes('M5') || vehicle.trim.includes('M8') ||
    vehicle.trim.includes('AMG') || vehicle.trim.includes('RS') ||
    vehicle.trim.includes('Type R') || vehicle.trim.includes('STI') ||
    vehicle.trim.includes('Evolution') || vehicle.trim.includes('ZL1') ||
    vehicle.trim.includes('Scat Pack') || vehicle.trim.includes('1LE') ||
    vehicle.trim.includes('GT3') || vehicle.trim.includes('GT2') || vehicle.trim.includes('Turbo S')
  );

  // Get service intervals - check for model-specific first (e.g., Evolution), then performance, then turbo
  let makeIntervals = defaultServiceIntervals[vehicle.make] || defaultServiceIntervals.default;
  
  // Check for Evolution-specific intervals
  if (vehicle.model === 'Lancer' && vehicle.trim && vehicle.trim.includes('Evolution')) {
    makeIntervals = defaultServiceIntervals['Mitsubishi Evolution'] || defaultServiceIntervals.performance;
  } else if (isPerformance && defaultServiceIntervals.performance) {
    // Use performance intervals for high-performance vehicles
    makeIntervals = {
      ...makeIntervals,
      oilChange: defaultServiceIntervals.performance.oilChange,
      tireRotation: defaultServiceIntervals.performance.tireRotation,
      brakeInspection: defaultServiceIntervals.performance.brakeInspection,
      airFilter: defaultServiceIntervals.performance.airFilter,
      sparkPlugs: defaultServiceIntervals.performance.sparkPlugs,
      transmission: defaultServiceIntervals.performance.transmission,
      coolant: defaultServiceIntervals.performance.coolant,
      brakeFluid: defaultServiceIntervals.performance.brakeFluid
    };
  } else if (isTurbo && defaultServiceIntervals.turbo) {
    makeIntervals = {
      ...makeIntervals,
      oilChange: defaultServiceIntervals.turbo.oilChange,
      sparkPlugs: defaultServiceIntervals.turbo.sparkPlugs
    };
  }

  // Get fluids (vehicle-specific override first, then turbo/supercharged defaults, then make default)
  let makeFluids = defaultFluids[vehicle.make] || defaultFluids.default;
  
  // Check if vehicle-specific specs have recommendedFluids (highest priority)
  if (specificSpecs && specificSpecs.recommendedFluids) {
    // Merge vehicle-specific fluids with make defaults (vehicle-specific overrides)
    makeFluids = { ...makeFluids, ...specificSpecs.recommendedFluids };
  } else {
    // If no vehicle-specific fluids, apply turbo/supercharged defaults
    // Supercharged engines (GT500, Hellcat, Demon, ZL1, TRX) may need different oil
    const isSupercharged = vehicle.trim && (
      vehicle.trim.includes('GT500') || vehicle.trim.includes('Hellcat') || 
      vehicle.trim.includes('Demon') || vehicle.trim.includes('ZL1') ||
      vehicle.trim.includes('ZR1') || vehicle.trim.includes('TRX')
    );
    
    if (isSupercharged && defaultFluids.supercharged) {
      // Supercharged engines typically need high-performance synthetic oil
      makeFluids = {
        ...makeFluids,
        engineOil: defaultFluids.supercharged.engineOil,
        engineOilCapacity: defaultFluids.supercharged.engineOilCapacity,
        brakeFluid: defaultFluids.supercharged.brakeFluid,
        differential: defaultFluids.supercharged.differential
      };
    } else if (isTurbo && defaultFluids.turbo) {
      // Turbo engines may need different oil viscosity
      makeFluids = {
        ...makeFluids,
        engineOil: defaultFluids.turbo.engineOil
      };
    }
  }

  // Get torque specs (vehicle-specific override first, then make default)
  let makeTorque = defaultTorqueSpecs[vehicle.make] || defaultTorqueSpecs.default;
  // Merge vehicle-specific torque specs if available (including trim-specific overrides)
  if (specificSpecs && specificSpecs.torqueValues) {
    makeTorque = {
      suspension: { ...makeTorque.suspension, ...(specificSpecs.torqueValues.suspension || {}) },
      engine: { ...makeTorque.engine, ...(specificSpecs.torqueValues.engine || {}) },
      brake: { ...(makeTorque.brake || {}), ...(specificSpecs.torqueValues.brake || {}) }
    };
  }

  // Get tire specs (vehicle-specific override first, then make default)
  let makeTires = defaultTires[vehicle.make] || defaultTires.default;
  if (specificSpecs && specificSpecs.tires) {
    // Merge vehicle-specific tire specs with make defaults
    makeTires = { ...makeTires, ...specificSpecs.tires };
  }

  // Get hardware specs (vehicle-specific override first, then make default)
  let makeHardware = defaultHardware[vehicle.make] || defaultHardware.default;
  if (specificSpecs && specificSpecs.hardware) {
    makeHardware = { ...makeHardware, ...specificSpecs.hardware };
  }

  // Get lighting specs (vehicle-specific override first, then make default)
  let makeLighting = defaultLighting[vehicle.make] || defaultLighting.default;
  if (specificSpecs && specificSpecs.lighting) {
    makeLighting = { ...makeLighting, ...specificSpecs.lighting };
  }

  // Get parts SKUs (vehicle-specific override first, then make default)
  let makePartsSKUs = defaultPartsSKUs[vehicle.make] || defaultPartsSKUs.default;
  if (specificSpecs && specificSpecs.partsSKUs) {
    makePartsSKUs = { ...makePartsSKUs, ...specificSpecs.partsSKUs };
  }

  // Convert intervals to strings (matching form format)
  const serviceIntervals = {
    oilChange: makeIntervals.oilChange.toString(),
    tireRotation: makeIntervals.tireRotation.toString(),
    brakeInspection: makeIntervals.brakeInspection.toString(),
    airFilter: makeIntervals.airFilter.toString(),
    cabinFilter: makeIntervals.cabinFilter.toString(),
    sparkPlugs: makeIntervals.sparkPlugs.toString(),
    transmission: makeIntervals.transmission.toString(),
    coolant: makeIntervals.coolant.toString(),
    brakeFluid: makeIntervals.brakeFluid.toString()
  };

  // Return updated vehicle with imported specs
  return {
    ...vehicle,
    serviceIntervals,
    recommendedFluids: makeFluids,
    torqueValues: {
      suspension: { ...makeTorque.suspension },
      engine: { ...makeTorque.engine },
      brake: { ...(makeTorque.brake || {}) }
    },
    tires: { ...makeTires },
    hardware: { ...makeHardware },
    lighting: { ...makeLighting },
    partsSKUs: { ...makePartsSKUs }
  };
}
