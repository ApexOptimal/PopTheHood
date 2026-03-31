import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { extractVINFromImage } from '../utils/visionAI';
import { decodeVIN, cleanVIN, isValidVIN } from '../utils/vinDecoder';
import { fetchRecalls } from '../utils/recalls';
import logger from '../utils/logger';

/**
 * Hook for VIN scanning and decoding.
 * Handles camera permissions, image capture, Gemini AI extraction, and NHTSA decode.
 * Returns raw decoded data — caller handles form state / UI updates.
 */
export function useVINScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to scan VINs.');
        return false;
      }
    }
    return true;
  };

  /**
   * Launch camera or photo library to scan a VIN from an image.
   * Returns { vin, decodedData, recalls } on success, or null on cancel/failure.
   */
  const scanVIN = () => {
    return new Promise((resolve) => {
      Alert.alert(
        'Scan VIN',
        'Take a photo of the VIN from the door jam or paperwork',
        [
          {
            text: 'Camera',
            onPress: async () => {
              const hasPermission = await requestCameraPermission();
              if (!hasPermission) { resolve(null); return; }
              try {
                const result = await ImagePicker.launchCameraAsync({
                  mediaTypes: ImagePicker.MediaType?.Images ?? 'images',
                  allowsEditing: false,
                  quality: 0.8,
                  base64: false,
                });
                if (result.canceled || !result.assets?.length) { resolve(null); return; }
                const extracted = await processImage(result.assets[0].uri);
                resolve(extracted);
              } catch (error) {
                logger.error('Camera error:', error);
                resolve(null);
              }
            },
          },
          {
            text: 'Photo Library',
            onPress: async () => {
              try {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaType?.Images ?? 'images',
                  allowsEditing: false,
                  quality: 0.8,
                  base64: false,
                });
                if (result.canceled || !result.assets?.length) { resolve(null); return; }
                const extracted = await processImage(result.assets[0].uri);
                resolve(extracted);
              } catch (error) {
                logger.error('Photo library error:', error);
                resolve(null);
              }
            },
          },
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
        ]
      );
    });
  };

  /** Extract VIN from image URI, then decode it. */
  const processImage = async (imageUri) => {
    setIsScanning(true);
    try {
      const extractedVIN = await extractVINFromImage(imageUri);
      if (extractedVIN && extractedVIN.length === 17) {
        const result = await decodeVINText(extractedVIN);
        return result;
      }
      return null;
    } catch (error) {
      logger.error('Error processing VIN image:', error);
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  /**
   * Decode a manually entered VIN string.
   * Returns { vin, decodedData, recalls } on success, or null if invalid.
   */
  const decodeVINText = async (vinText) => {
    const cleaned = cleanVIN(vinText);
    if (!isValidVIN(cleaned)) return null;

    setIsDecoding(true);
    try {
      const decodedData = await decodeVIN(cleaned);

      // Fetch recalls in parallel
      let recalls = [];
      if (decodedData.year && decodedData.make && decodedData.model) {
        try {
          recalls = await fetchRecalls(
            parseInt(decodedData.year),
            decodedData.make,
            decodedData.model
          );
        } catch (e) {
          logger.warn('Failed to fetch recalls:', e);
        }
      }

      return { vin: cleaned, decodedData, recalls };
    } catch (error) {
      logger.error('VIN decode error:', error);
      return null;
    } finally {
      setIsDecoding(false);
    }
  };

  return {
    scanVIN,
    decodeVINText,
    isScanning,
    isDecoding,
    isProcessing: isScanning || isDecoding,
  };
}
