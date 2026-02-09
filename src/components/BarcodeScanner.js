import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { lookupBarcode } from '../utils/barcodeLookup';
import { identifyItemFromImage, identifyItemFromImageAndBarcode } from '../utils/visionAI';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ANIMATION_DURATION = 375;

export default function BarcodeScanner({ visible, onScan, onClose }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation state
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Slide in when visible changes to true
  useEffect(() => {
    if (visible) {
      slideAnim.setValue(SCREEN_HEIGHT);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);
  
  const handleAnimatedClose = (callback) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  useEffect(() => {
    if (visible) {
      setScanned(false);
      setIsLoading(false);
    }
  }, [visible]);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || isLoading) return;

    setScanned(true);
    setIsLoading(true);

    try {
      const productData = await lookupBarcode(data);
      
      // Check if we got a generic "Product X" result that needs AI identification
      if (productData.name && (
          productData.name.includes('Product ') || 
          productData.name.includes('Scanned Product') ||
          productData.name.includes('Automotive Product') ||
          productData.needsVerification
        )) {
        // Offer to take photo for AI identification
        setIsLoading(false);
        Alert.alert(
          'Product Not Found in Database',
          'Barcode not found. Would you like to take a photo for AI identification?',
          [
            {
              text: 'Take Photo',
              onPress: () => handleTakePhoto(data),
            },
            {
              text: 'Use Barcode Result',
              onPress: () => {
                onScan(productData);
                setScanned(false);
              },
            },
            {
              text: 'Cancel',
              onPress: () => setScanned(false),
              style: 'cancel',
            },
          ]
        );
        return;
      }
      
      setIsLoading(false);
      onScan(productData);
      // Don't close automatically - let user scan again or close manually
      setScanned(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        'Scan Failed',
        'Could not look up product information. Would you like to take a photo for AI identification?',
        [
          {
            text: 'Take Photo',
            onPress: () => handleTakePhoto(data),
          },
          {
            text: 'Try Again',
            onPress: () => setScanned(false),
          },
          {
            text: 'Cancel',
            onPress: onClose,
            style: 'cancel',
          },
        ]
      );
    }
  };

  const handleTakePhoto = async (barcode = null) => {
    console.log('========== handleTakePhoto STARTED ==========');
    console.log('Barcode parameter:', barcode);
    
    try {
      setIsLoading(true);
      console.log('Requesting camera permissions...');
      
      // Request camera permissions for photo
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        console.log('Camera permission denied');
        Alert.alert('Permission Required', 'Camera permission is needed to take photos');
        setIsLoading(false);
        setScanned(false);
        return;
      }

      console.log('Camera permission granted. Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaType?.Images ?? 'images',
        allowsEditing: false,
        quality: 0.8,
        base64: false,
        exif: false,
      });

      console.log('Camera result:', result.canceled ? 'CANCELED' : 'SUCCESS');
      
      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('Photo was canceled or no assets');
        setIsLoading(false);
        setScanned(false);
        return;
      }

      // Use Gemini AI to identify product from image
      const imageUri = result.assets[0].uri;
      console.log('========== PHOTO TAKEN ==========');
      console.log('Image URI:', imageUri);
      
      if (!imageUri) {
        throw new Error('Could not get image URI from camera');
      }
      
      console.log('Calling AI identification function...');
      console.log('Barcode provided:', barcode || 'none');
      
      const productData = barcode 
        ? await identifyItemFromImageAndBarcode(imageUri, barcode)
        : await identifyItemFromImage(imageUri);
      
      console.log('AI identification SUCCESS!');
      console.log('Product data:', JSON.stringify(productData, null, 2));
      console.log('==================================');
      
      setIsLoading(false);
      onScan(productData);
      setScanned(false);
    } catch (error) {
      console.error('========== ERROR IN PHOTO AI ==========');
      console.error('Error occurred at:', new Date().toISOString());
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      console.error('Full error object:', error);
      if (error?.toString) {
        console.error('Error toString:', error.toString());
      }
      console.error('========================================');
      
      setIsLoading(false);
      Alert.alert(
        'AI Identification Failed',
        error.message || 'Could not identify product from photo. Please enter manually.',
        [
          {
            text: 'Try Again',
            onPress: () => setScanned(false),
          },
          {
            text: 'Cancel',
            onPress: () => setScanned(false),
            style: 'cancel',
          },
        ]
      );
    }
  };

  if (!visible) return null;

  if (!permission) {
    return (
      <Modal visible={visible} transparent={true} animationType="none">
        <Animated.View style={[styles.container, { width: '100%', opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.content}>
            <Text style={styles.message}>Requesting camera permission...</Text>
            <ActivityIndicator size="large" color="#0066cc" />
          </View>
        </Animated.View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} transparent={true} animationType="none">
        <Animated.View style={[styles.container, { width: '100%', opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.content}>
            <Ionicons name="camera-outline" size={64} color="#0066cc" style={styles.icon} />
            <Text style={styles.title}>Camera Permission Required</Text>
            <Text style={styles.message}>
              We need access to your camera to scan barcodes.
            </Text>
            <TouchableOpacity style={styles.button} onPress={requestPermission}>
              <Text style={styles.buttonText}>Grant Permission</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => handleAnimatedClose(onClose)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent={false} animationType="none">
      <Animated.View style={[styles.container, { width: '100%', opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scan Barcode</Text>
          <TouchableOpacity onPress={() => handleAnimatedClose(onClose)}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: [
                'ean13',
                'ean8',
                'upc_a',
                'upc_e',
                'code128',
                'code39',
                'code93',
                'codabar',
                'itf14',
              ],
            }}
          />
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#0066cc" />
                <Text style={styles.loadingText}>Looking up product...</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.instructions}>
            Position the barcode within the frame
          </Text>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={() => handleTakePhoto(null)}
            disabled={isLoading}
          >
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.photoButtonText}>Take Photo for AI ID</Text>
          </TouchableOpacity>
          {scanned && !isLoading && (
            <Text style={styles.scanAgainText}>
              Scan another item or tap close to finish
            </Text>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    pointerEvents: 'box-none',
  },
  scanArea: {
    width: 280,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#0066cc',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  instructions: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 8,
  },
  scanAgainText: {
    color: '#0066cc',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  cancelButtonText: {
    color: '#b0b0b0',
    fontSize: 16,
  },
});
