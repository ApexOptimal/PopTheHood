/**
 * Image Resize Utility
 * Wraps expo-image-manipulator for consistent image compression across the app.
 * Falls back to copying the original file when the native module is unavailable
 * (e.g. in Expo Go).
 */
import { copyToPermanentStorage } from './fileStorage';
import logger from './logger';

let ImageManipulator = null;
try {
  ImageManipulator = require('expo-image-manipulator');
} catch (_) {
  // Native module unavailable (Expo Go, web, etc.)
}

/**
 * Resize an image for vehicle photos.
 * Max 1200x900 (4:3 landscape), quality 0.7 → ~200-400KB
 * @param {string} uri - Source image URI
 * @returns {Promise<string>} - Permanent storage URI of resized image
 */
export async function resizeForVehicle(uri) {
  try {
    if (ImageManipulator?.manipulateAsync) {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1200, height: 900 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return copyToPermanentStorage(result.uri, 'vehicles');
    }
  } catch (error) {
    logger.warn('Image resize unavailable, copying original:', error.message);
  }
  // Fallback: copy original to permanent storage
  return copyToPermanentStorage(uri, 'vehicles');
}

/**
 * Resize an image for receipt photos.
 * Max 800x1200 (portrait), quality 0.5 → ~80-150KB
 * @param {string} uri - Source image URI
 * @returns {Promise<string>} - Permanent storage URI of resized image
 */
export async function resizeForReceipt(uri) {
  try {
    if (ImageManipulator?.manipulateAsync) {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800, height: 1200 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );
      return copyToPermanentStorage(result.uri, 'receipts');
    }
  } catch (error) {
    logger.warn('Image resize unavailable, copying original:', error.message);
  }
  return copyToPermanentStorage(uri, 'receipts');
}
