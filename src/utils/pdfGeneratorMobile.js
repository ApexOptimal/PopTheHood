import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

/**
 * Generate HTML content for maintenance records PDF (mobile)
 * @param {Object} vehicle - Vehicle object with maintenance records
 * @param {boolean} includeBuildSheet - Whether to include build sheet in PDF
 * @returns {string} HTML content
 */
function generateMaintenanceHTML(vehicle, includeBuildSheet = false) {
  const records = vehicle?.maintenanceRecords || [];
  const sortedRecords = [...records].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // Newest first
  });

  const vehicleTitle = `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}${vehicle.trim ? ` ${vehicle.trim}` : ''}`.trim();

  let recordsHTML = '';
  if (sortedRecords.length === 0) {
    recordsHTML = '<p style="color: #666; padding: 20px;">No maintenance records found.</p>';
  } else {
    recordsHTML = sortedRecords.map(record => {
      const recordDate = record.date ? new Date(record.date).toLocaleDateString() : 'No date';
      let detailsHTML = '';

      if (record.mileage) {
        detailsHTML += `<p><strong>Mileage:</strong> ${parseInt(record.mileage).toLocaleString()} miles</p>`;
      }
      if (record.cost !== null && record.cost !== undefined) {
        // Use diyPartsCost if available and it's a DIY service, otherwise use regular cost
        const displayCost = record.isDIY && record.diyPartsCost !== null && record.diyPartsCost !== undefined
          ? parseFloat(record.diyPartsCost)
          : parseFloat(record.cost);
        detailsHTML += `<p><strong>Cost:</strong> $${displayCost.toFixed(2)}</p>`;
      }
      if (record.location) {
        detailsHTML += `<p><strong>Location:</strong> ${record.location}</p>`;
      }

      let descriptionHTML = '';
      if (record.description) {
        descriptionHTML = `<p style="margin-top: 10px; color: #555;"><strong>Notes:</strong> ${record.description.replace(/\n/g, '<br>')}</p>`;
      }

      return `
        <div style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${recordDate} - ${record.type || 'Maintenance'}</h3>
          ${detailsHTML}
          ${descriptionHTML}
        </div>
      `;
    }).join('');
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 40px;
            color: #333;
            background: #fff;
          }
          .header {
            background-color: #2d2d2d;
            color: #fff;
            padding: 30px;
            margin: -40px -40px 40px -40px;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: bold;
          }
          .header h2 {
            margin: 0;
            font-size: 18px;
            font-weight: normal;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
            border-bottom: 2px solid #2d2d2d;
            padding-bottom: 5px;
          }
          .info-row {
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
          }
          .info-value {
            color: #555;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          @media print {
            body {
              padding: 20px;
            }
            .header {
              margin: -20px -20px 30px -20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Maintenance History Report</h1>
          <h2>${vehicleTitle}</h2>
        </div>

        <div class="section">
          <div class="section-title">Vehicle Information</div>
          ${vehicle.year ? `<div class="info-row"><span class="info-label">Year:</span><span class="info-value">${vehicle.year}</span></div>` : ''}
          ${vehicle.make ? `<div class="info-row"><span class="info-label">Make:</span><span class="info-value">${vehicle.make}</span></div>` : ''}
          ${vehicle.model ? `<div class="info-row"><span class="info-label">Model:</span><span class="info-value">${vehicle.model}</span></div>` : ''}
          ${vehicle.trim ? `<div class="info-row"><span class="info-label">Trim:</span><span class="info-value">${vehicle.trim}</span></div>` : ''}
          ${vehicle.vin ? `<div class="info-row"><span class="info-label">VIN:</span><span class="info-value">${vehicle.vin}</span></div>` : ''}
          ${includeBuildSheet && vehicle.buildSheet ? `
            <div class="section" style="margin-top: 20px;">
              <div class="section-title">Build Sheet</div>
              ${vehicle.buildSheet.engine ? `<div class="info-row"><span class="info-label">Engine:</span><span class="info-value">${vehicle.buildSheet.engine.replace(/\n/g, '<br>')}</span></div>` : ''}
              ${vehicle.buildSheet.intake ? `<div class="info-row"><span class="info-label">Intake:</span><span class="info-value">${vehicle.buildSheet.intake.replace(/\n/g, '<br>')}</span></div>` : ''}
              ${vehicle.buildSheet.exhaust ? `<div class="info-row"><span class="info-label">Exhaust:</span><span class="info-value">${vehicle.buildSheet.exhaust.replace(/\n/g, '<br>')}</span></div>` : ''}
              ${vehicle.buildSheet.fueling ? `<div class="info-row"><span class="info-label">Fueling:</span><span class="info-value">${vehicle.buildSheet.fueling.replace(/\n/g, '<br>')}</span></div>` : ''}
              ${vehicle.buildSheet.ecu ? `<div class="info-row"><span class="info-label">ECU/Tuning:</span><span class="info-value">${vehicle.buildSheet.ecu.replace(/\n/g, '<br>')}</span></div>` : ''}
              ${vehicle.buildSheet.suspension ? `<div class="info-row"><span class="info-label">Suspension:</span><span class="info-value">${vehicle.buildSheet.suspension.replace(/\n/g, '<br>')}</span></div>` : ''}
              ${vehicle.buildSheet.body ? `<div class="info-row"><span class="info-label">Body:</span><span class="info-value">${vehicle.buildSheet.body.replace(/\n/g, '<br>')}</span></div>` : ''}
            </div>
          ` : ''}
          ${vehicle.licensePlate ? `<div class="info-row"><span class="info-label">License Plate:</span><span class="info-value">${vehicle.licensePlate}</span></div>` : ''}
          ${vehicle.nickname ? `<div class="info-row"><span class="info-label">Nickname:</span><span class="info-value">${vehicle.nickname}</span></div>` : ''}
          ${vehicle.mileage ? `<div class="info-row"><span class="info-label">Current Mileage:</span><span class="info-value">${parseInt(vehicle.mileage).toLocaleString()} miles</span></div>` : ''}
        </div>

        <div class="section">
          <div class="section-title">Maintenance Records (${sortedRecords.length})</div>
          ${recordsHTML}
        </div>

        <div class="footer">
          Generated ${new Date().toLocaleDateString()}
        </div>
      </body>
    </html>
  `;

  return html;
}

/**
 * Generate PDF from HTML using expo-print (mobile)
 * @param {Object} vehicle - Vehicle object with maintenance records
 * @param {boolean} includeBuildSheet - Whether to include build sheet in PDF
 */
export async function generateMaintenancePDFMobile(vehicle, includeBuildSheet = false) {
  try {
    const html = generateMaintenanceHTML(vehicle, includeBuildSheet);

    // Generate PDF using expo-print
    const { uri } = await Print.printToFileAsync({ html });

    // Share the file directly (printToFileAsync creates a file that can be shared)
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Export Maintenance Records',
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }

    return { success: true, fileUri: uri };
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
