/**
 * Warning Lights Reference Library
 * Comprehensive list of common dashboard warning symbols
 */

export const warningLights = [
  {
    id: "check_engine",
    name: "Check Engine",
    iconName: "engine-outline",
    color: "yellow",
    description: "Indicates a malfunction in the engine management system. This could be related to emissions, fuel system, ignition, or exhaust components.",
    action: "Safe to drive if not flashing. Have the vehicle scanned for diagnostic codes as soon as possible. If flashing, reduce speed and avoid heavy acceleration.",
    severity: "medium"
  },
  {
    id: "oil_pressure",
    name: "Oil Pressure",
    iconName: "oil-level", // Note: May need custom image for oil pressure symbol - using MaterialCommunityIcons
    color: "red",
    description: "Warns that engine oil pressure is critically low. This is one of the most serious warnings.",
    action: "STOP DRIVING IMMEDIATELY. Turn off the engine and check oil level. Low oil pressure can cause severe engine damage within seconds.",
    severity: "high"
  },
  {
    id: "battery",
    name: "Battery/Charging",
    iconName: "battery-alert",
    color: "red",
    description: "Indicates a problem with the charging system. The battery is not being charged properly.",
    action: "Drive to a safe location and turn off unnecessary electrical loads. Have the alternator and battery tested. Vehicle may stall if battery dies.",
    severity: "high"
  },
  {
    id: "brake",
    name: "Brake System",
    iconName: "alert-circle",
    color: "red",
    description: "Warns of a problem with the brake system. Could indicate low brake fluid, worn pads, or ABS malfunction.",
    action: "Drive with extreme caution. Test brakes at low speed. Have brake system inspected immediately. Do not ignore this warning.",
    severity: "high"
  },
  {
    id: "coolant_temp",
    name: "Coolant Temperature",
    iconName: "thermometer",
    color: "red",
    description: "Engine is overheating. Coolant temperature is dangerously high.",
    action: "Pull over safely and turn off engine immediately. Do not open radiator cap while hot. Let engine cool before checking coolant level. Overheating can cause severe engine damage.",
    severity: "high"
  },
  {
    id: "tire_pressure",
    name: "Tire Pressure",
    iconName: "circle-outline",
    color: "yellow",
    description: "One or more tires have low air pressure. TPMS (Tire Pressure Monitoring System) has detected underinflation.",
    action: "Check tire pressures when safe. Inflate to manufacturer's recommended PSI (found on driver's door jamb). Low pressure reduces fuel economy and can cause tire failure.",
    severity: "low"
  },
  {
    id: "abs",
    name: "ABS",
    iconName: "car-brake-abs", // Note: May need custom image for ABS symbol
    color: "yellow",
    description: "Anti-lock Brake System malfunction detected. Standard brakes still function, but ABS assistance is disabled.",
    action: "Brakes will still work normally, but without anti-lock assistance. Drive carefully, especially in wet conditions. Have ABS system diagnosed and repaired.",
    severity: "medium"
  },
  {
    id: "traction_control",
    name: "Traction Control",
    iconName: "car-traction-control", // Note: May need custom image for traction control symbol
    color: "yellow",
    description: "Traction control system is disabled or malfunctioning. Vehicle stability control may also be affected.",
    action: "Drive with extra caution, especially in slippery conditions. System may have been manually disabled - check for a button. If not intentional, have system checked.",
    severity: "medium"
  },
  {
    id: "airbag",
    name: "Airbag System",
    iconName: "airbag",
    color: "red",
    description: "Airbag system malfunction detected. Airbags may not deploy in a collision.",
    action: "Have the airbag system inspected immediately. While vehicle is drivable, safety systems are compromised. This is a critical safety issue.",
    severity: "high"
  },
  {
    id: "seatbelt",
    name: "Seatbelt Reminder",
    iconName: "seatbelt",
    color: "red",
    description: "Reminder that seatbelt is not fastened. Some vehicles also use this for passenger seatbelt detection.",
    action: "Fasten your seatbelt immediately. This is both a legal requirement and critical for safety.",
    severity: "low"
  },
  {
    id: "fuel",
    name: "Low Fuel",
    iconName: "fuel",
    color: "yellow",
    description: "Fuel level is low. Typically appears when fuel tank is 1/8 full or less.",
    action: "Refuel as soon as possible. Running out of fuel can damage the fuel pump and leave you stranded.",
    severity: "low"
  },
  {
    id: "door_ajar",
    name: "Door Ajar",
    iconName: "car-door",
    color: "yellow",
    description: "One or more doors, hood, or trunk are not fully closed.",
    action: "Check all doors, hood, and trunk. Ensure they are securely latched. Driving with doors open is unsafe and may drain the battery if interior lights stay on.",
    severity: "low"
  },
  {
    id: "washer_fluid",
    name: "Washer Fluid",
    iconName: "water",
    color: "yellow",
    description: "Windshield washer fluid reservoir is low or empty.",
    action: "Add windshield washer fluid when convenient. This does not affect vehicle operation but reduces visibility cleaning capability.",
    severity: "low"
  },
  {
    id: "maintenance",
    name: "Maintenance Required",
    iconName: "wrench",
    color: "yellow",
    description: "Scheduled maintenance is due. Typically based on mileage or time intervals.",
    action: "Schedule service according to your vehicle's maintenance schedule. This is a reminder, not a malfunction indicator.",
    severity: "low"
  },
  {
    id: "transmission",
    name: "Transmission",
    iconName: "car-shift-pattern", // Note: May need custom image for transmission symbol
    color: "red",
    description: "Transmission system malfunction detected. Could indicate overheating, fluid issues, or mechanical problems.",
    action: "Avoid heavy acceleration. Have transmission checked immediately. Continued driving with transmission problems can cause expensive damage.",
    severity: "high"
  },
  {
    id: "power_steering",
    name: "Power Steering",
    iconName: "steering",
    color: "red",
    description: "Power steering system malfunction. Steering will be much harder, especially at low speeds.",
    action: "Steering will require significantly more effort. Drive carefully and have the power steering system inspected. Electric power steering failures can be dangerous.",
    severity: "high"
  },
  {
    id: "esp",
    name: "ESP/Stability",
    iconName: "car-sport",
    color: "yellow",
    description: "Electronic Stability Program (ESP) or Vehicle Stability Control (VSC) is disabled or malfunctioning.",
    action: "Drive with extra caution, especially on curves and in adverse weather. System may have been manually disabled - check for a button.",
    severity: "medium"
  },
  {
    id: "fog_light",
    name: "Fog Light",
    iconName: "lightbulb-outline",
    color: "green",
    description: "Fog lights are currently on. This is an indicator, not a warning.",
    action: "Remember to turn off fog lights when not needed. They can blind other drivers in clear conditions.",
    severity: "low"
  },
  {
    id: "cruise_control",
    name: "Cruise Control",
    iconName: "speedometer",
    color: "green",
    description: "Cruise control system is active. Vehicle will maintain set speed.",
    action: "Use cruise control responsibly. Be ready to disengage immediately if needed. Not recommended in heavy traffic or adverse weather.",
    severity: "low"
  },
  {
    id: "lane_departure",
    name: "Lane Departure",
    iconName: "car-outline",
    color: "yellow",
    description: "Lane departure warning system is active or has detected unintentional lane drift.",
    action: "Check your lane position. If system is malfunctioning, have it inspected. Keep hands on wheel and maintain proper lane position.",
    severity: "low"
  },
  {
    id: "parking_brake",
    name: "Parking Brake",
    iconName: "hand-left-outline",
    color: "red",
    description: "Parking brake (handbrake) is engaged or partially engaged.",
    action: "Release the parking brake fully before driving. Driving with parking brake engaged can damage brake components and reduce fuel economy.",
    severity: "medium"
  },
  {
    id: "diesel_particulate",
    name: "DPF/Diesel Filter",
    iconName: "filter-outline",
    color: "yellow",
    description: "Diesel Particulate Filter (DPF) needs regeneration or is clogged. Common on diesel vehicles.",
    action: "Drive at highway speeds for 20-30 minutes to allow regeneration. If light persists, have DPF system serviced. Ignoring can cause expensive repairs.",
    severity: "medium"
  },
  {
    id: "adblue",
    name: "AdBlue/DEF",
    iconName: "water-outline",
    color: "yellow",
    description: "Diesel Exhaust Fluid (DEF/AdBlue) is low. Required for emissions control on modern diesel vehicles.",
    action: "Refill AdBlue/DEF fluid soon. Vehicle may not start or will enter limp mode if completely empty. Available at most auto parts stores and fuel stations.",
    severity: "medium"
  }
];

/**
 * Get warning light by ID
 */
export function getWarningLightById(id) {
  return warningLights.find(light => light.id === id);
}

/**
 * Filter warning lights by color/severity
 */
export function filterWarningLights(filter) {
  if (filter === 'all') return warningLights;
  if (filter === 'red' || filter === 'danger') {
    return warningLights.filter(light => light.color === 'red' || light.severity === 'high');
  }
  if (filter === 'yellow' || filter === 'warning') {
    return warningLights.filter(light => light.color === 'yellow' || light.severity === 'medium');
  }
  return warningLights;
}
