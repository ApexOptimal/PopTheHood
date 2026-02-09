/**
 * Build Sheet / Modifications Utility
 * Extracts vehicle modifications from maintenance records and build sheet field
 */

/**
 * Keywords that indicate modifications in maintenance records
 */
const MODIFICATION_KEYWORDS = [
  'install', 'installed', 'upgrade', 'upgraded', 'aftermarket',
  'stage', 'tune', 'tuned', 'turbo', 'supercharger', 'ecu',
  'coilover', 'coilovers', 'suspension', 'exhaust', 'intake',
  'intercooler', 'downpipe', 'headers', 'cam', 'cams', 'camshaft',
  'piston', 'pistons', 'rod', 'rods', 'forged', 'built engine',
  'injector', 'injectors', 'fuel pump', 'fuel system', 'methanol',
  'nitrous', 'boost controller', 'wastegate', 'blow off valve',
  'bov', 'recirculation valve', 'bypass valve', 'maf', 'map sensor',
  'wideband', 'o2 sensor', 'cat delete', 'catless', 'test pipe',
  'midpipe', 'axleback', 'catback', 'full exhaust', 'header',
  'downpipe', 'turbo kit', 'supercharger kit', 'cold air intake',
  'short ram intake', 'ram air', 'intake manifold', 'throttle body',
  'ecu flash', 'ecu tune', 'chip', 'piggyback', 'standalone ecu',
  'coilover', 'lowering springs', 'sway bar', 'strut bar', 'chassis brace',
  'roll cage', 'roll bar', 'bucket seat', 'racing seat', 'harness',
  'brake kit', 'big brake kit', 'bbk', 'brake pads', 'brake rotors',
  'brake lines', 'brake fluid', 'clutch', 'flywheel', 'lightweight',
  'wheel', 'rims', 'tires', 'track', 'racing', 'performance',
  'modified', 'mod', 'mods', 'build', 'built'
];

/**
 * Extract modifications from maintenance records
 * Scans maintenance record types and descriptions for modification keywords
 * @param {Array} maintenanceRecords - Array of maintenance record objects
 * @returns {Array} Array of modification strings found
 */
export function extractModificationsFromRecords(maintenanceRecords) {
  if (!maintenanceRecords || !Array.isArray(maintenanceRecords)) {
    return [];
  }

  const modifications = [];
  const foundMods = new Set(); // Avoid duplicates

  maintenanceRecords.forEach(record => {
    // Check maintenance type
    const type = (record.type || '').toLowerCase();
    const description = (record.description || '').toLowerCase();
    const combined = `${type} ${description}`;

    // Look for modification keywords
    MODIFICATION_KEYWORDS.forEach(keyword => {
      if (combined.includes(keyword.toLowerCase())) {
        // Extract the relevant part of the description
        const keywordIndex = combined.indexOf(keyword.toLowerCase());
        const contextStart = Math.max(0, keywordIndex - 50);
        const contextEnd = Math.min(combined.length, keywordIndex + keyword.length + 50);
        const context = combined.substring(contextStart, contextEnd).trim();
        
        // Try to extract a meaningful modification phrase
        const sentences = description.split(/[.!?]/);
        sentences.forEach(sentence => {
          if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
            const mod = sentence.trim();
            if (mod.length > 5 && mod.length < 200) {
              foundMods.add(mod);
            }
          }
        });

        // Also add the type if it contains modification keywords
        if (type.includes(keyword.toLowerCase()) && type.length > 3) {
          foundMods.add(record.type);
        }
      }
    });
  });

  return Array.from(foundMods);
}

/**
 * Convert build sheet object to string
 * Handles both object format (from form) and string format
 * @param {Object|string} buildSheet - Build sheet object or string
 * @returns {string} Formatted build sheet string
 */
function formatBuildSheet(buildSheet) {
  if (!buildSheet) return '';
  
  // If it's already a string, return it
  if (typeof buildSheet === 'string') {
    return buildSheet.trim();
  }
  
  // If it's an object, format it nicely
  if (typeof buildSheet === 'object') {
    const parts = [];
    const categories = {
      engine: 'Engine',
      intake: 'Intake',
      exhaust: 'Exhaust',
      fueling: 'Fueling',
      ecu: 'ECU/Tuning',
      suspension: 'Suspension',
      body: 'Body',
    };
    
    Object.keys(categories).forEach(key => {
      if (buildSheet[key] && buildSheet[key].trim()) {
        parts.push(`${categories[key]}: ${buildSheet[key].trim()}`);
      }
    });
    
    return parts.join('\n');
  }
  
  return '';
}

/**
 * Get build sheet string for a vehicle
 * Combines manual buildSheet field with extracted modifications from records
 * @param {Object} vehicle - Vehicle object
 * @returns {string} Combined build sheet string
 */
export function getBuildSheet(vehicle) {
  if (!vehicle) return '';

  const parts = [];

  // Add manual build sheet if present (handle both object and string formats)
  const manualBuildSheet = formatBuildSheet(vehicle.buildSheet);
  if (manualBuildSheet) {
    parts.push(manualBuildSheet);
  }

  // Extract modifications from maintenance records
  const extractedMods = extractModificationsFromRecords(vehicle.maintenanceRecords || []);
  if (extractedMods.length > 0) {
    // Format extracted mods nicely
    const modsList = extractedMods.join(', ');
    if (parts.length > 0) {
      parts.push(`\nDetected from maintenance: ${modsList}`);
    } else {
      parts.push(`Detected from maintenance: ${modsList}`);
    }
  }

  return parts.join('\n').trim();
}

/**
 * Check if a vehicle has modifications
 * @param {Object} vehicle - Vehicle object
 * @returns {boolean} True if vehicle has modifications
 */
export function hasModifications(vehicle) {
  if (!vehicle) return false;
  
  const buildSheet = getBuildSheet(vehicle);
  return buildSheet.length > 0;
}

/**
 * Extract relevant modifications for a specific issue
 * Filters modifications that might be related to the reported problem
 * @param {string} issueDescription - User's reported issue
 * @param {string} buildSheet - Full build sheet string
 * @returns {Array} Array of relevant modification strings
 */
export function getRelevantModifications(issueDescription, buildSheet) {
  if (!issueDescription || !buildSheet) return [];

  const issueLower = issueDescription.toLowerCase();
  const relevantMods = [];

  // Keywords that link issues to modification types
  const issueModMapping = {
    'idle': ['ecu', 'tune', 'maf', 'map', 'intake', 'throttle'],
    'surging': ['ecu', 'tune', 'maf', 'map', 'intake', 'fuel'],
    'stalling': ['ecu', 'tune', 'maf', 'map', 'intake', 'fuel'],
    'rough': ['ecu', 'tune', 'maf', 'map', 'intake', 'fuel', 'spark'],
    'knock': ['ecu', 'tune', 'turbo', 'boost', 'fuel', 'timing'],
    'boost': ['turbo', 'supercharger', 'ecu', 'tune', 'wastegate', 'boost controller'],
    'pressure': ['turbo', 'supercharger', 'boost', 'intercooler'],
    'overheat': ['turbo', 'supercharger', 'intercooler', 'cooling'],
    'noise': ['exhaust', 'intake', 'turbo', 'supercharger', 'bov', 'wastegate'],
    'vibration': ['suspension', 'coilover', 'mount', 'drivetrain'],
    'handling': ['suspension', 'coilover', 'sway', 'strut', 'chassis'],
    'brake': ['brake', 'bbk', 'pad', 'rotor', 'line'],
    'clutch': ['clutch', 'flywheel', 'transmission'],
    'transmission': ['clutch', 'flywheel', 'transmission'],
    'fuel': ['fuel', 'injector', 'pump', 'system'],
    'air': ['intake', 'maf', 'map', 'intercooler'],
    'exhaust': ['exhaust', 'downpipe', 'header', 'cat'],
  };

  // Find relevant modification keywords based on issue
  const relevantKeywords = [];
  Object.keys(issueModMapping).forEach(issueKeyword => {
    if (issueLower.includes(issueKeyword)) {
      relevantKeywords.push(...issueModMapping[issueKeyword]);
    }
  });

  // Search build sheet for relevant modifications
  const buildSheetLower = buildSheet.toLowerCase();
  relevantKeywords.forEach(keyword => {
    if (buildSheetLower.includes(keyword)) {
      // Extract sentences or phrases containing this keyword
      const sentences = buildSheet.split(/[.!?\n]/);
      sentences.forEach(sentence => {
        if (sentence.toLowerCase().includes(keyword) && sentence.trim().length > 5) {
          relevantMods.push(sentence.trim());
        }
      });
    }
  });

  // Remove duplicates and return
  return [...new Set(relevantMods)].slice(0, 3); // Max 3 most relevant
}
