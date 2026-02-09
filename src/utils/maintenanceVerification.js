import { defaultTorqueSpecs } from '../data/vehicleData';
import { getVehicleSpecificSpecs } from '../utils/vehicleSpecsImport';

/**
 * Get torque values and procedures for a specific maintenance type and vehicle
 * @param {Object} vehicle - The vehicle object
 * @param {string} maintenanceType - The type of maintenance (e.g., 'Oil Change', 'Spark Plugs')
 * @returns {Object|null} Object with relevant torque values/procedures or null
 */
export function getMaintenanceVerification(vehicle, maintenanceType) {
  if (!vehicle || !maintenanceType) return null;

  // Get vehicle-specific torque specs if available
  let torqueSpecs = null;
  if (vehicle.make && vehicle.model && vehicle.year) {
    const specificSpecs = getVehicleSpecificSpecs(vehicle.make, vehicle.model, vehicle.year, vehicle.trim);
    if (specificSpecs && specificSpecs.torqueValues) {
      torqueSpecs = specificSpecs.torqueValues;
    }
  }

  // Fall back to vehicle's stored torque values or make defaults
  if (!torqueSpecs) {
    if (vehicle.torqueValues) {
      torqueSpecs = vehicle.torqueValues;
    } else {
      const makeTorque = defaultTorqueSpecs[vehicle.make] || defaultTorqueSpecs.default;
      torqueSpecs = {
        suspension: { ...makeTorque.suspension },
        engine: { ...makeTorque.engine },
        brake: { ...makeTorque.brake }
      };
    }
  }

  // Ensure brake section exists (fallback to default if not present)
  if (!torqueSpecs.brake) {
    const makeTorque = defaultTorqueSpecs[vehicle.make] || defaultTorqueSpecs.default;
    torqueSpecs.brake = { ...makeTorque.brake };
  }

  const maintenanceTypeLower = maintenanceType.toLowerCase();
  const verification = {
    questions: [],
    torqueValues: {}
  };

  // Oil Change
  if (maintenanceTypeLower.includes('oil')) {
    if (torqueSpecs.engine?.oilFilter) {
      verification.questions.push({
        type: 'procedure',
        question: 'Did you tighten the oil filter hand tight + 3/4 turn?',
        expected: 'Hand tight + 3/4 turn',
        value: torqueSpecs.engine.oilFilter
      });
    }
    if (torqueSpecs.engine?.oilDrainPlug) {
      verification.questions.push({
        type: 'torque',
        question: 'Did you torque the oil drain plug correctly?',
        expected: torqueSpecs.engine.oilDrainPlug,
        value: torqueSpecs.engine.oilDrainPlug
      });
      verification.torqueValues['Oil Drain Plug'] = torqueSpecs.engine.oilDrainPlug;
    }
  }

  // Spark Plugs
  if (maintenanceTypeLower.includes('spark')) {
    if (torqueSpecs.engine?.sparkPlugs) {
      verification.questions.push({
        type: 'torque',
        question: 'Did you torque the spark plugs correctly?',
        expected: torqueSpecs.engine.sparkPlugs,
        value: torqueSpecs.engine.sparkPlugs
      });
      verification.torqueValues['Spark Plugs'] = torqueSpecs.engine.sparkPlugs;
    }
  }

  // Tire Rotation
  if (maintenanceTypeLower.includes('tire') || maintenanceTypeLower.includes('rotation')) {
    if (torqueSpecs.suspension?.wheelLugNuts) {
      verification.questions.push({
        type: 'torque',
        question: 'Did you torque the wheel lug nuts correctly?',
        expected: torqueSpecs.suspension.wheelLugNuts,
        value: torqueSpecs.suspension.wheelLugNuts
      });
      verification.torqueValues['Wheel Lug Nuts'] = torqueSpecs.suspension.wheelLugNuts;
    }
  }

  // Brake Service
  if (maintenanceTypeLower.includes('brake')) {
    // Caliper bracket bolts (most critical for brake pad replacement)
    if (torqueSpecs.brake?.caliperBracketBolts) {
      verification.questions.push({
        type: 'torque',
        question: 'Did you torque the caliper bracket bolts correctly?',
        expected: torqueSpecs.brake.caliperBracketBolts,
        value: torqueSpecs.brake.caliperBracketBolts
      });
      verification.torqueValues['Caliper Bracket Bolts'] = torqueSpecs.brake.caliperBracketBolts;
    }
    
    // Caliper slide pins (if removed during service)
    if (torqueSpecs.brake?.caliperSlidePins) {
      verification.questions.push({
        type: 'torque',
        question: 'Did you torque the caliper slide pins correctly? (if removed)',
        expected: torqueSpecs.brake.caliperSlidePins,
        value: torqueSpecs.brake.caliperSlidePins
      });
      verification.torqueValues['Caliper Slide Pins'] = torqueSpecs.brake.caliperSlidePins;
    }
    
    // Brake line fittings (if brake lines were disconnected)
    if (torqueSpecs.brake?.brakeLineFittings) {
      verification.questions.push({
        type: 'torque',
        question: 'Did you torque the brake line fittings correctly? (if disconnected)',
        expected: torqueSpecs.brake.brakeLineFittings,
        value: torqueSpecs.brake.brakeLineFittings
      });
      verification.torqueValues['Brake Line Fittings'] = torqueSpecs.brake.brakeLineFittings;
    }
    
    // Wheel lug nuts (always required after brake service)
    if (torqueSpecs.suspension?.wheelLugNuts) {
      verification.questions.push({
        type: 'torque',
        question: 'Did you torque the wheel lug nuts correctly?',
        expected: torqueSpecs.suspension.wheelLugNuts,
        value: torqueSpecs.suspension.wheelLugNuts
      });
      verification.torqueValues['Wheel Lug Nuts'] = torqueSpecs.suspension.wheelLugNuts;
    }
  }

  // Transmission Service
  if (maintenanceTypeLower.includes('transmission')) {
    // Transmission service typically involves drain plug
    if (torqueSpecs.engine?.oilDrainPlug) {
      // Use oil drain plug torque as reference for transmission drain plug
      verification.questions.push({
        type: 'torque',
        question: 'Did you torque the transmission drain plug correctly?',
        expected: torqueSpecs.engine.oilDrainPlug,
        value: torqueSpecs.engine.oilDrainPlug,
        note: 'Typically similar to oil drain plug torque'
      });
      verification.torqueValues['Transmission Drain Plug'] = torqueSpecs.engine.oilDrainPlug;
    }
  }

  // Coolant Flush
  if (maintenanceTypeLower.includes('coolant')) {
    // Coolant service might involve drain plug
    if (torqueSpecs.engine?.oilDrainPlug) {
      verification.questions.push({
        type: 'torque',
        question: 'Did you torque the coolant drain plug correctly?',
        expected: torqueSpecs.engine.oilDrainPlug,
        value: torqueSpecs.engine.oilDrainPlug,
        note: 'Typically similar to oil drain plug torque'
      });
      verification.torqueValues['Coolant Drain Plug'] = torqueSpecs.engine.oilDrainPlug;
    }
  }

  // If no specific questions were added, return null
  if (verification.questions.length === 0) {
    return null;
  }

  return verification;
}
