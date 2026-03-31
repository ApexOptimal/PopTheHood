/**
 * File Storage Utility
 * Moves files to permanent document directories so they're included in device backups
 */

import * as FileSystem from 'expo-file-system/legacy';
import logger from './logger';

// Get the document directory path (permanent, backed up)
const getDocumentDirectory = () => {
  return FileSystem.documentDirectory;
};

// Get the app's data directory path
const getDataDirectory = () => {
  const baseDir = getDocumentDirectory();
  return `${baseDir}pop-the-hood/`;
};

// Ensure the app's data directory exists
const ensureDataDirectory = async () => {
  try {
    const dataDir = getDataDirectory();
    const dirInfo = await FileSystem.getInfoAsync(dataDir);
    
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dataDir, { intermediates: true });
    }
    
    // Create subdirectories
    const subdirs = ['vehicles', 'receipts'];
    for (const subdir of subdirs) {
      const subdirPath = `${dataDir}${subdir}/`;
      const subdirInfo = await FileSystem.getInfoAsync(subdirPath);
      if (!subdirInfo.exists) {
        await FileSystem.makeDirectoryAsync(subdirPath, { intermediates: true });
      }
    }
    
    return dataDir;
  } catch (error) {
    logger.error('Error ensuring data directory:', error);
    throw error;
  }
};

/**
 * Copy a file to permanent storage
 * @param {string} sourceUri - Source file URI (from ImagePicker or DocumentPicker)
 * @param {string} subdirectory - Subdirectory name ('vehicles' or 'receipts')
 * @param {string} filename - Optional custom filename (defaults to timestamp-based name)
 * @returns {Promise<string>} - Promise that resolves to the new permanent file URI
 */
export const copyToPermanentStorage = async (sourceUri, subdirectory = 'vehicles', filename = null) => {
  try {
    // Ensure directory exists
    const dataDir = await ensureDataDirectory();
    const targetDir = `${dataDir}${subdirectory}/`;
    
    // Generate filename if not provided
    if (!filename) {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 9);
      
      // Get file extension from source URI
      const extension = sourceUri.split('.').pop().split('?')[0] || 'jpg';
      filename = `${timestamp}_${random}.${extension}`;
    }
    
    const targetUri = `${targetDir}${filename}`;
    
    // Copy file to permanent location
    await FileSystem.copyAsync({
      from: sourceUri,
      to: targetUri,
    });
    
    logger.log(`File copied to permanent storage: ${targetUri}`);
    return targetUri;
  } catch (error) {
    logger.error('Error copying file to permanent storage:', error);
    // If copy fails, return original URI as fallback
    return sourceUri;
  }
};

/**
 * Delete a file from permanent storage
 * @param {string} fileUri - File URI to delete
 * @returns {Promise<boolean>} - Promise that resolves to true if successful
 */
export const deleteFromPermanentStorage = async (fileUri) => {
  try {
    // Only delete if it's in our app's directory
    const dataDir = getDataDirectory();
    if (fileUri && fileUri.startsWith(dataDir)) {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
        logger.log(`File deleted from permanent storage: ${fileUri}`);
        return true;
      }
    }
    return false;
  } catch (error) {
    logger.error('Error deleting file from permanent storage:', error);
    return false;
  }
};

/**
 * Check if a file exists in permanent storage
 * @param {string} fileUri - File URI to check
 * @returns {Promise<boolean>} - Promise that resolves to true if file exists
 */
export const fileExists = async (fileUri) => {
  try {
    if (!fileUri) return false;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    return fileInfo.exists;
  } catch (error) {
    logger.error('Error checking file existence:', error);
    return false;
  }
};

/**
 * Get storage usage information
 * @returns {Promise<Object>} - Promise that resolves to storage info object
 */
export const getStorageInfo = async () => {
  try {
    const dataDir = getDataDirectory();
    const dirInfo = await FileSystem.getInfoAsync(dataDir);
    
    if (!dirInfo.exists) {
      return { exists: false, size: 0, sizeMB: '0.00' };
    }
    
    // Calculate directory size (approximate)
    let totalSize = 0;
    
    const calculateSize = async (dir) => {
      try {
        const items = await FileSystem.readDirectoryAsync(dir);
        for (const item of items) {
          const itemPath = `${dir}${item}`;
          const itemInfo = await FileSystem.getInfoAsync(itemPath);
          if (itemInfo.exists) {
            if (itemInfo.isDirectory) {
              await calculateSize(`${itemPath}/`);
            } else {
              // Estimate file size (FileSystem.getInfoAsync doesn't always provide size)
              totalSize += itemInfo.size || 100000; // Use actual size if available, else estimate
            }
          }
        }
      } catch (error) {
        // Directory might be empty or inaccessible
        logger.log(`Could not read directory ${dir}:`, error.message);
      }
    };
    
    await calculateSize(dataDir);
    
    return {
      exists: true,
      size: totalSize,
      sizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      path: dataDir,
    };
  } catch (error) {
    logger.error('Error getting storage info:', error);
    return { exists: false, size: 0, sizeMB: '0.00', error: error.message };
  }
};

/**
 * Clean up orphaned files (files not referenced in any vehicle or maintenance record)
 * This is a utility function that can be called periodically
 * @param {Array} vehicles - Array of vehicle objects
 * @returns {Promise<number>} - Promise that resolves to number of files deleted
 */
export const cleanupOrphanedFiles = async (vehicles = []) => {
  try {
    const dataDir = getDataDirectory();
    const vehiclesDir = `${dataDir}vehicles/`;
    const receiptsDir = `${dataDir}receipts/`;
    
    // Collect all referenced file URIs
    const referencedFiles = new Set();
    
    // Add vehicle images
    vehicles.forEach(vehicle => {
      if (vehicle.images && Array.isArray(vehicle.images)) {
        vehicle.images.forEach(img => {
          if (img.data) referencedFiles.add(img.data);
        });
      }
      
      // Add maintenance record receipts
      if (vehicle.maintenanceRecords && Array.isArray(vehicle.maintenanceRecords)) {
        vehicle.maintenanceRecords.forEach(record => {
          if (record.receipt && record.receipt.uri) {
            referencedFiles.add(record.receipt.uri);
          }
        });
      }
    });
    
    let deletedCount = 0;
    
    // Check vehicle images directory
    try {
      const vehicleFiles = await FileSystem.readDirectoryAsync(vehiclesDir);
      for (const file of vehicleFiles) {
        const fileUri = `${vehiclesDir}${file}`;
        if (!referencedFiles.has(fileUri)) {
          await deleteFromPermanentStorage(fileUri);
          deletedCount++;
        }
      }
    } catch (error) {
      // Directory might not exist yet
      logger.log('Vehicles directory not found or empty');
    }
    
    // Check receipts directory
    try {
      const receiptFiles = await FileSystem.readDirectoryAsync(receiptsDir);
      for (const file of receiptFiles) {
        const fileUri = `${receiptsDir}${file}`;
        if (!referencedFiles.has(fileUri)) {
          await deleteFromPermanentStorage(fileUri);
          deletedCount++;
        }
      }
    } catch (error) {
      // Directory might not exist yet
      logger.log('Receipts directory not found or empty');
    }
    
    logger.log(`Cleaned up ${deletedCount} orphaned files`);
    return deletedCount;
  } catch (error) {
    logger.error('Error cleaning up orphaned files:', error);
    return 0;
  }
};
