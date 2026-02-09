// jsPDF is only available on web - this file is only bundled for web platform
import jsPDF from 'jspdf';

/**
 * Generate a PDF report of vehicle maintenance history
 * @param {Object} vehicle - Vehicle object with maintenance records
 * @param {boolean} includeBuildSheet - Whether to include build sheet in PDF
 */
export function generateMaintenancePDF(vehicle, includeBuildSheet = false) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with word wrap
  const addText = (text, x, y, maxWidth, fontSize = 10, fontStyle = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length * (fontSize * 0.4); // Return height used
  };

  // Header Section
  doc.setFillColor(45, 45, 45); // Dark gray background
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Maintenance History Report', margin, 25);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  const vehicleTitle = `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}`.trim();
  if (vehicle.trim) {
    doc.text(`${vehicleTitle} ${vehicle.trim}`, margin, 35);
  } else {
    doc.text(vehicleTitle, margin, 35);
  }
  
  doc.setTextColor(0, 0, 0);
  yPosition = 60;

  // Vehicle Information Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Vehicle Information', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const vehicleInfo = [];
  if (vehicle.year) vehicleInfo.push(`Year: ${vehicle.year}`);
  if (vehicle.make) vehicleInfo.push(`Make: ${vehicle.make}`);
  if (vehicle.model) vehicleInfo.push(`Model: ${vehicle.model}`);
  if (vehicle.trim) vehicleInfo.push(`Trim: ${vehicle.trim}`);
  if (vehicle.vin) vehicleInfo.push(`VIN: ${vehicle.vin}`);
  
  // Display first part of vehicle info (Year, Make, Model, Trim, VIN)
  vehicleInfo.forEach((info, index) => {
    if (index % 2 === 0) {
      doc.text(info, margin, yPosition);
    } else {
      doc.text(info, margin + contentWidth / 2, yPosition);
      yPosition += 6;
    }
  });
  if (vehicleInfo.length % 2 !== 0) {
    yPosition += 6;
  }
  
  // Add Build Sheet if requested (after VIN)
  if (includeBuildSheet && vehicle.buildSheet) {
    const buildSheet = vehicle.buildSheet;
    const buildSheetSections = [];
    if (buildSheet.engine) buildSheetSections.push(`Engine: ${buildSheet.engine}`);
    if (buildSheet.intake) buildSheetSections.push(`Intake: ${buildSheet.intake}`);
    if (buildSheet.exhaust) buildSheetSections.push(`Exhaust: ${buildSheet.exhaust}`);
    if (buildSheet.fueling) buildSheetSections.push(`Fueling: ${buildSheet.fueling}`);
    if (buildSheet.ecu) buildSheetSections.push(`ECU/Tuning: ${buildSheet.ecu}`);
    if (buildSheet.suspension) buildSheetSections.push(`Suspension: ${buildSheet.suspension}`);
    if (buildSheet.body) buildSheetSections.push(`Body: ${buildSheet.body}`);
    
    if (buildSheetSections.length > 0) {
      checkPageBreak(30);
      yPosition += 5;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Build Sheet', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      buildSheetSections.forEach((section, index) => {
        const lines = doc.splitTextToSize(section, contentWidth);
        lines.forEach((line, lineIndex) => {
          checkPageBreak(8);
          doc.text(line, margin, yPosition);
          yPosition += 6;
        });
      });
      yPosition += 5;
    }
  }
  
  // Display remaining vehicle info (License Plate, Nickname, Mileage, Color)
  const remainingInfo = [];
  if (vehicle.licensePlate) remainingInfo.push(`License Plate: ${vehicle.licensePlate}`);
  if (vehicle.nickname) remainingInfo.push(`Nickname: ${vehicle.nickname}`);
  if (vehicle.mileage) remainingInfo.push(`Current Mileage: ${parseInt(vehicle.mileage).toLocaleString()} miles`);
  if (vehicle.color) remainingInfo.push(`Color: ${vehicle.color}`);
  
  remainingInfo.forEach((info, index) => {
    const colIndex = vehicleInfo.length % 2 + index;
    if (colIndex % 2 === 0) {
      doc.text(info, margin, yPosition);
    } else {
      doc.text(info, margin + contentWidth / 2, yPosition);
      yPosition += 6;
    }
  });
  if (remainingInfo.length > 0 && (vehicleInfo.length % 2 + remainingInfo.length) % 2 !== 0) {
    yPosition += 6;
  }
  yPosition += 5;

  // Summary Statistics
  checkPageBreak(30);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', margin, yPosition);
  yPosition += 8;

  const records = vehicle.maintenanceRecords || [];
  const totalRecords = records.length;
  
  const totalSpent = records.reduce((sum, record) => {
    const cost = parseFloat(record.cost) || 0;
    if (record.isDIY && record.diyPartsCost !== null && record.diyPartsCost !== undefined) {
      return sum + (parseFloat(record.diyPartsCost) || 0);
    }
    return sum + cost;
  }, 0);

  const totalSaved = records.reduce((sum, record) => {
    if (record.isDIY && record.shopPrice && record.diyPartsCost) {
      const shopPrice = parseFloat(record.shopPrice) || 0;
      const diyCost = parseFloat(record.diyPartsCost) || 0;
      return sum + (shopPrice - diyCost);
    }
    return sum;
  }, 0);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Maintenance Records: ${totalRecords}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Total Spent: $${totalSpent.toFixed(2)}`, margin, yPosition);
  yPosition += 6;
  
  const lastService = records.length > 0 
    ? new Date(Math.max(...records.map(r => new Date(r.date).getTime())))
    : null;
  if (lastService) {
    doc.text(`Last Service: ${lastService.toLocaleDateString()}`, margin, yPosition);
    yPosition += 6;
  }
  yPosition += 10;

  // Maintenance Records Section
  checkPageBreak(30);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Maintenance Records', margin, yPosition);
  yPosition += 8;

  if (records.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('No maintenance records found.', margin, yPosition);
  } else {
    // Sort records by date (newest first)
    const sortedRecords = [...records].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA; // Newest first
    });

    sortedRecords.forEach((record, index) => {
      checkPageBreak(40);
      
      // Record header with date and type
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      const recordDate = record.date ? new Date(record.date).toLocaleDateString() : 'No date';
      const recordTitle = `${recordDate} - ${record.type || 'Maintenance'}`;
      doc.text(recordTitle, margin, yPosition);
      yPosition += 7;

      // Record details
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const details = [];
      
      if (record.mileage) {
        details.push(`Mileage: ${parseInt(record.mileage).toLocaleString()} miles`);
      }
      if (record.cost !== null && record.cost !== undefined) {
        // Use diyPartsCost if available and it's a DIY service, otherwise use regular cost
        const displayCost = record.isDIY && record.diyPartsCost !== null && record.diyPartsCost !== undefined
          ? parseFloat(record.diyPartsCost)
          : parseFloat(record.cost);
        details.push(`Cost: $${displayCost.toFixed(2)}`);
      }
      if (record.location) {
        details.push(`Location: ${record.location}`);
      }

      details.forEach(detail => {
        doc.text(detail, margin + 5, yPosition);
        yPosition += 5;
      });

      // Description
      if (record.description) {
        yPosition += 2;
        const descHeight = addText(`Notes: ${record.description}`, margin + 5, yPosition, contentWidth - 10, 9);
        yPosition += descHeight + 3;
      }

      // Separator line
      yPosition += 3;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
    });
  }

  // Footer
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${totalPages} | Generated ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Generate filename
  const filename = `Maintenance_History_${vehicle.make || 'Vehicle'}_${vehicle.model || ''}_${new Date().toISOString().split('T')[0]}.pdf`;
  
  // Save the PDF
  doc.save(filename);
}
