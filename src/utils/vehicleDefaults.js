/**
 * Vehicle Defaults - Auto-populate service intervals, fluids, and specs
 * Extracted from VehicleFormModal's useEffect logic for reuse across onboarding and form.
 */

import {
  vehicleData,
  getTrimDetails,
  defaultServiceIntervals,
  defaultFluids,
  defaultTorqueSpecs,
  defaultTires,
  defaultHardware,
  defaultLighting,
  defaultPartsSKUs,
  vehicleSpecificSpecs,
} from '../data/vehicleData';

/**
 * Get all vehicle defaults for a given make/model/year/trim combination.
 * Returns pre-populated service intervals, fluids, torque, tires, hardware, lighting, and parts SKUs.
 */
export function getVehicleDefaults(make, model, year, trim) {
  if (!make || !model || !year) return null;

  const trimDetails = trim ? getTrimDetails(make, model, trim) : null;
  const isTurbo = trimDetails?.turbo || false;

  const isPerformance = trim && (
    trim.includes('GT350') || trim.includes('GT500') ||
    trim.includes('Hellcat') || trim.includes('Demon') ||
    trim.includes('M3') || trim.includes('M4') || trim.includes('M5') || trim.includes('M8') ||
    trim.includes('AMG') || trim.includes('RS') ||
    trim.includes('Type R') || trim.includes('STI') ||
    trim.includes('Evolution') || trim.includes('ZL1') ||
    trim.includes('Scat Pack') || trim.includes('1LE') ||
    trim.includes('GT3') || trim.includes('GT2') || trim.includes('Turbo S')
  );

  // Service intervals
  let intervals = defaultServiceIntervals[make] || defaultServiceIntervals.default;
  if (isPerformance && defaultServiceIntervals.performance) {
    intervals = { ...intervals, ...defaultServiceIntervals.performance };
  } else if (isTurbo && defaultServiceIntervals.turbo) {
    intervals = {
      ...intervals,
      oilChange: defaultServiceIntervals.turbo.oilChange,
      sparkPlugs: defaultServiceIntervals.turbo.sparkPlugs,
    };
  }

  // Fluids
  let fluids = defaultFluids[make] || defaultFluids.default;
  let hasVehicleSpecificFluids = false;

  if (vehicleSpecificSpecs[make]?.[model]) {
    const modelSpecs = vehicleSpecificSpecs[make][model];
    const yearInt = parseInt(year);

    for (const key in modelSpecs) {
      if (matchesYearRange(key, yearInt)) {
        const yearSpecs = modelSpecs[key];
        if (trim && yearSpecs.trims?.[trim]?.recommendedFluids) {
          fluids = { ...fluids, ...yearSpecs.trims[trim].recommendedFluids };
          hasVehicleSpecificFluids = true;
        } else if (yearSpecs.recommendedFluids) {
          fluids = { ...fluids, ...yearSpecs.recommendedFluids };
          hasVehicleSpecificFluids = true;
        }
        break;
      }
    }
  }

  if (!hasVehicleSpecificFluids) {
    const isSupercharged = trim && (
      trim.includes('GT500') || trim.includes('Hellcat') ||
      trim.includes('Demon') || trim.includes('ZL1') ||
      trim.includes('ZR1') || trim.includes('TRX')
    );

    if (isSupercharged && defaultFluids.supercharged) {
      fluids = {
        ...fluids,
        engineOil: defaultFluids.supercharged.engineOil,
        engineOilCapacity: defaultFluids.supercharged.engineOilCapacity,
        brakeFluid: defaultFluids.supercharged.brakeFluid,
        differential: defaultFluids.supercharged.differential,
      };
    } else if (isTurbo && defaultFluids.turbo && !fluids.engineOil?.includes('Turbo Rated')) {
      fluids = { ...fluids, engineOil: defaultFluids.turbo.engineOil };
    }
  }

  // Torque, tires, hardware, lighting, parts SKUs
  let torque = defaultTorqueSpecs[make] || defaultTorqueSpecs.default;
  let tires = defaultTires[make] || defaultTires.default;
  let hardware = defaultHardware[make] || defaultHardware.default;
  let lighting = defaultLighting[make] || defaultLighting.default;
  let partsSKUs = defaultPartsSKUs[make] || defaultPartsSKUs.default;

  // Apply vehicle-specific overrides
  if (vehicleSpecificSpecs[make]?.[model]) {
    const modelSpecs = vehicleSpecificSpecs[make][model];
    const yearInt = parseInt(year);

    for (const key in modelSpecs) {
      if (matchesYearRange(key, yearInt)) {
        const yearSpecs = modelSpecs[key];

        if (trim && yearSpecs.trims?.[trim]) {
          const trimSpecs = yearSpecs.trims[trim];
          tires = { ...tires, ...yearSpecs.tires, ...trimSpecs.tires };
          hardware = { ...hardware, ...yearSpecs.hardware, ...trimSpecs.hardware };
          lighting = { ...lighting, ...yearSpecs.lighting, ...trimSpecs.lighting };
          if (trimSpecs.torqueValues) {
            torque = {
              suspension: { ...torque.suspension, ...yearSpecs.torqueValues?.suspension, ...trimSpecs.torqueValues?.suspension },
              engine: { ...torque.engine, ...yearSpecs.torqueValues?.engine, ...trimSpecs.torqueValues?.engine },
            };
          } else if (yearSpecs.torqueValues) {
            torque = {
              suspension: { ...torque.suspension, ...yearSpecs.torqueValues.suspension },
              engine: { ...torque.engine, ...yearSpecs.torqueValues.engine },
            };
          }
          if (trimSpecs.partsSKUs) {
            partsSKUs = { ...partsSKUs, ...yearSpecs.partsSKUs, ...trimSpecs.partsSKUs };
          } else if (yearSpecs.partsSKUs) {
            partsSKUs = { ...partsSKUs, ...yearSpecs.partsSKUs };
          }
        } else {
          if (yearSpecs.tires) tires = { ...tires, ...yearSpecs.tires };
          if (yearSpecs.hardware) hardware = { ...hardware, ...yearSpecs.hardware };
          if (yearSpecs.lighting) lighting = { ...lighting, ...yearSpecs.lighting };
          if (yearSpecs.torqueValues) {
            torque = {
              suspension: { ...torque.suspension, ...yearSpecs.torqueValues.suspension },
              engine: { ...torque.engine, ...yearSpecs.torqueValues.engine },
            };
          }
          if (yearSpecs.partsSKUs) partsSKUs = { ...partsSKUs, ...yearSpecs.partsSKUs };
        }
        break;
      }
    }
  }

  return {
    serviceIntervals: {
      oilChange: intervals.oilChange,
      tireRotation: intervals.tireRotation,
      brakeInspection: intervals.brakeInspection,
      airFilter: intervals.airFilter,
      cabinFilter: intervals.cabinFilter,
      sparkPlugs: intervals.sparkPlugs,
      transmission: intervals.transmission,
      coolant: intervals.coolant,
      brakeFluid: intervals.brakeFluid,
    },
    recommendedFluids: fluids,
    torqueValues: torque,
    tires,
    hardware,
    lighting,
    partsSKUs,
  };
}

function matchesYearRange(rangeKey, year) {
  const rangeStr = String(rangeKey);
  if (!rangeStr.includes('-')) {
    return parseInt(rangeStr) === year;
  }
  const [start, end] = rangeStr.split('-').map(y => parseInt(y.trim()));
  return !isNaN(start) && !isNaN(end) && year >= start && year <= end;
}
