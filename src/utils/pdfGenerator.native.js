// Native stub - jsPDF is not available on native platforms
// Use pdfGeneratorMobile.js instead which uses expo-print

/**
 * Stub for native platforms - throws error if called directly
 * The exportMaintenance.js should use pdfGeneratorMobile.js for native platforms
 */
export function generateMaintenancePDF(vehicle, includeBuildSheet = false) {
  throw new Error('jsPDF PDF generation is not available on native platforms. Use generateMaintenancePDFMobile from pdfGeneratorMobile.js instead.');
}
