import { Platform } from 'react-native';
import logger from './logger';

/**
 * Export maintenance records as CSV
 * @param {Object} vehicle - Vehicle object with maintenance records
 */
export async function exportMaintenanceToCSV(vehicle) {
  try {
    if (Platform.OS === 'web') {
      // For web, download directly
      const records = vehicle?.maintenanceRecords || [];
      
      const headers = [
        'Date',
        'Type',
        'Mileage',
        'Cost',
        'Location',
        'Service Type',
        'Shop Price',
        'DIY Parts Cost',
        'DIY Labor Cost',
        'Savings',
        'Description'
      ];
      
      const rows = records.map(record => {
        const date = record.date ? new Date(record.date).toLocaleDateString() : '';
        const mileage = record.mileage ? parseInt(record.mileage).toLocaleString() : '';
        const cost = record.cost ? parseFloat(record.cost).toFixed(2) : '';
        const location = record.location || '';
        const serviceType = record.isDIY ? 'DIY' : 'Shop';
        const shopPrice = record.shopPrice ? parseFloat(record.shopPrice).toFixed(2) : '';
        const diyPartsCost = record.diyPartsCost ? parseFloat(record.diyPartsCost).toFixed(2) : '';
        const diyLaborCost = record.isDIY && record.cost ? parseFloat(record.cost).toFixed(2) : '';
        
        let savings = '';
        if (record.isDIY && record.shopPrice && record.diyPartsCost) {
          const shop = parseFloat(record.shopPrice);
          const parts = parseFloat(record.diyPartsCost);
          const labor = parseFloat(record.cost || 0);
          savings = (shop - (parts + labor)).toFixed(2);
        }
        
        const description = record.description ? record.description.replace(/"/g, '""') : '';
        
        return [
          date,
          record.type || '',
          mileage,
          cost,
          location,
          serviceType,
          shopPrice,
          diyPartsCost,
          diyLaborCost,
          savings,
          `"${description}"`
        ];
      });
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Maintenance_Records_${vehicle.make || 'Vehicle'}_${vehicle.model || ''}_${vehicle.year || ''}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true };
    }
    
    // Dynamically import these modules only when needed on native platforms
    // Use legacy API for writeAsStringAsync compatibility
    let FileSystem, Sharing;
    try {
      FileSystem = require('expo-file-system/legacy');
      Sharing = require('expo-sharing');
    } catch (e) {
      throw new Error('File system or sharing not available on this platform');
    }
    
    const records = vehicle?.maintenanceRecords || [];
    
    // CSV Headers
    const headers = [
      'Date',
      'Type',
      'Mileage',
      'Cost',
      'Location',
      'Service Type',
      'Shop Price',
      'DIY Parts Cost',
      'DIY Labor Cost',
      'Savings',
      'Description'
    ];
    
    // Build CSV rows
    const rows = records.map(record => {
      const date = record.date ? new Date(record.date).toLocaleDateString() : '';
      const mileage = record.mileage ? parseInt(record.mileage).toLocaleString() : '';
      const cost = record.cost ? parseFloat(record.cost).toFixed(2) : '';
      const location = record.location || '';
      const serviceType = record.isDIY ? 'DIY' : 'Shop';
      const shopPrice = record.shopPrice ? parseFloat(record.shopPrice).toFixed(2) : '';
      const diyPartsCost = record.diyPartsCost ? parseFloat(record.diyPartsCost).toFixed(2) : '';
      const diyLaborCost = record.isDIY && record.cost ? parseFloat(record.cost).toFixed(2) : '';
      
      let savings = '';
      if (record.isDIY && record.shopPrice && record.diyPartsCost) {
        const shop = parseFloat(record.shopPrice);
        const parts = parseFloat(record.diyPartsCost);
        const labor = parseFloat(record.cost || 0);
        savings = (shop - (parts + labor)).toFixed(2);
      }
      
      const description = record.description ? record.description.replace(/"/g, '""') : '';
      
      return [
        date,
        record.type || '',
        mileage,
        cost,
        location,
        serviceType,
        shopPrice,
        diyPartsCost,
        diyLaborCost,
        savings,
        `"${description}"` // Wrap description in quotes to handle commas
      ];
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Generate filename
    const vehicleName = `${vehicle.make || 'Vehicle'}_${vehicle.model || ''}_${vehicle.year || ''}`.replace(/\s+/g, '_');
    const filename = `Maintenance_Records_${vehicleName}_${new Date().toISOString().split('T')[0]}.csv`;
    const fileUri = FileSystem.documentDirectory + filename;
    
    // Write file (UTF8 is the default encoding)
    await FileSystem.writeAsStringAsync(fileUri, csvContent);
    
    // Share file
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Maintenance Records',
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }
    
    return { success: true, fileUri };
  } catch (error) {
    logger.error('Error exporting CSV:', error);
    throw error;
  }
}

/**
 * Export maintenance records as PDF
 * @param {Object} vehicle - Vehicle object with maintenance records
 * @param {boolean} includeBuildSheet - Whether to include modifications in PDF
 */
export async function exportMaintenanceToPDF(vehicle, includeBuildSheet = false) {
  try {
    if (Platform.OS === 'web') {
      // Generate PDF using existing pdfGenerator (jsPDF only works on web)
      // Dynamically require to avoid loading jsPDF on mobile platforms
      const { generateMaintenancePDF } = require('./pdfGenerator');
      generateMaintenancePDF(vehicle, includeBuildSheet);
      return { success: true };
    } else {
      // Generate PDF using expo-print for mobile platforms
      const { generateMaintenancePDFMobile } = require('./pdfGeneratorMobile');
      return await generateMaintenancePDFMobile(vehicle, includeBuildSheet);
    }
  } catch (error) {
    logger.error('Error exporting PDF:', error);
    throw error;
  }
}
