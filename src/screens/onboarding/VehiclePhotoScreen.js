import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { resizeForVehicle } from '../../utils/imageResize';
import { theme } from '../../theme';
import logger from '../../utils/logger';

export default function VehiclePhotoScreen({ vehicleData, onContinue, onSkip }) {
  const [photoUri, setPhotoUri] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const { decodedData } = vehicleData || {};
  const vehicleName = decodedData
    ? `${decodedData.year} ${decodedData.make} ${decodedData.model}${decodedData.trim ? ` ${decodedData.trim}` : ''}`
    : 'Your Vehicle';

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaType?.Images ?? 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const permanentUri = await resizeForVehicle(result.assets[0].uri);
        setPhotoUri(permanentUri);
      }
    } catch (error) {
      logger.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType?.Images ?? 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const permanentUri = await resizeForVehicle(result.assets[0].uri);
        setPhotoUri(permanentUri);
      }
    } catch (error) {
      logger.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const showImagePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handleTakePhoto();
          if (buttonIndex === 2) handlePickImage();
        }
      );
    } else {
      Alert.alert('Add Photo', 'Choose a source', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: handleTakePhoto },
        { text: 'Choose from Library', onPress: handlePickImage },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.iconCircle}>
            <Ionicons name="camera" size={40} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Add a Photo</Text>
          <Text style={styles.subtitle}>
            Snap a pic of your {vehicleName} to personalize your garage.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.photoSection, { opacity: fadeAnim }]}>
          {photoUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: photoUri }} style={styles.preview} />
              <TouchableOpacity
                style={styles.changeButton}
                onPress={showImagePicker}
                accessibilityLabel="Change photo"
                accessibilityRole="button"
              >
                <Ionicons name="camera-reverse-outline" size={20} color={theme.colors.textPrimary} />
                <Text style={styles.changeButtonText}>Change Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={showImagePicker}
              accessibilityLabel="Add vehicle photo"
              accessibilityRole="button"
              activeOpacity={0.7}
            >
              <View style={styles.addPhotoIcon}>
                <Ionicons name="camera-outline" size={48} color={theme.colors.textMuted} />
              </View>
              <Text style={styles.addPhotoText}>Tap to add a photo</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, !photoUri && styles.continueButtonDisabled]}
            onPress={() => onContinue(photoUri)}
            disabled={!photoUri}
            accessibilityLabel="Continue with photo"
            accessibilityRole="button"
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => onSkip()}
            accessibilityLabel="Skip adding photo"
            accessibilityRole="button"
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  photoSection: {
    flex: 1,
    justifyContent: 'center',
  },
  addPhotoButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.md,
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoIcon: {
    marginBottom: theme.spacing.md,
  },
  addPhotoText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  previewContainer: {
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
  },
  changeButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: theme.spacing.xl,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  skipText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
});
