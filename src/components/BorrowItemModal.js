import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ANIMATION_DURATION = 375;

export default function BorrowItemModal({ item, visible, onLend, onCancel }) {
  const [formData, setFormData] = useState({
    borrowedBy: '',
    contactPhone: '',
    contactEmail: '',
    notes: ''
  });
  const [photo, setPhoto] = useState(null);
  
  // Animation state
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Slide in on mount
  useEffect(() => {
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
  }, []);
  
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

  // Calculate return reminder date (7 days from now)
  const returnReminderDate = new Date();
  returnReminderDate.setDate(returnReminderDate.getDate() + 7);

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
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
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
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  const handleSubmit = () => {
    if (!formData.borrowedBy.trim()) {
      Alert.alert('Error', 'Please enter the name of the person borrowing the item');
      return;
    }

    const borrowData = {
      borrowedBy: formData.borrowedBy.trim(),
      borrowedDate: new Date().toISOString(),
      returnReminderDate: returnReminderDate.toISOString(),
      borrowedPhoto: photo || null,
      contactPhone: formData.contactPhone.trim() || null,
      contactEmail: formData.contactEmail.trim() || null,
      notes: formData.notes.trim() || null,
      isBorrowed: true
    };

    onLend(item.id, borrowData);
    
    // Reset form
    setFormData({
      borrowedBy: '',
      contactPhone: '',
      contactEmail: '',
      notes: ''
    });
    setPhoto(null);
  };

  if (!visible || !item) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={() => handleAnimatedClose(onCancel)}
    >
      <Animated.View style={{ flex: 1, width: '100%', opacity: fadeAnim }}>
        <Animated.View style={{ flex: 1, width: '100%', transform: [{ translateY: slideAnim }] }}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              Lend Item: {item?.name || 'Item'}
            </Text>
            <TouchableOpacity
              onPress={() => handleAnimatedClose(onCancel)}
              style={styles.closeButton}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <Ionicons name="person" size={16} color={theme.colors.primary} /> Borrower Name *
              </Text>
              <TextInput
                style={styles.input}
                value={formData.borrowedBy}
                onChangeText={(text) => setFormData({ ...formData, borrowedBy: text })}
                placeholder="e.g., John Smith, Neighbor Bob"
                accessibilityLabel="Borrower Name"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.label}>Phone (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.contactPhone}
                  onChangeText={(text) => setFormData({ ...formData, contactPhone: text })}
                  placeholder="(555) 123-4567"
                  accessibilityLabel="Phone"
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={styles.label}>Email (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.contactEmail}
                  onChangeText={(text) => setFormData({ ...formData, contactEmail: text })}
                  placeholder="email@example.com"
                  accessibilityLabel="Email"
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <Ionicons name="camera" size={16} color={theme.colors.primary} /> Photo (Optional)
              </Text>
              {photo ? (
                <View style={styles.photoContainer}>
                  <Image source={{ uri: photo }} style={styles.photoPreview} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={handleRemovePhoto}
                    accessibilityLabel="Remove photo"
                    accessibilityRole="button"
                  >
                    <Ionicons name="trash" size={20} color={theme.colors.textPrimary} />
                    <Text style={styles.removePhotoText}>Remove Photo</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.photoButtons}>
                  <TouchableOpacity
                    style={styles.photoButton}
                    onPress={handleTakePhoto}
                    accessibilityLabel="Take photo"
                    accessibilityRole="button"
                  >
                    <Ionicons name="camera" size={24} color={theme.colors.primary} />
                    <Text style={styles.photoButtonText}>Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.photoButton}
                    onPress={handlePickImage}
                    accessibilityLabel="Select image from library"
                    accessibilityRole="button"
                  >
                    <Ionicons name="image" size={24} color={theme.colors.primary} />
                    <Text style={styles.photoButtonText}>Select Image</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.helpText}>
                Snap a photo of the person holding the item or select an image
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="e.g., Needs it for weekend project, will return Monday"
                accessibilityLabel="Notes"
                placeholderTextColor="#666"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.reminderBox}>
              <View style={styles.reminderHeader}>
                <Ionicons name="calendar" size={16} color={theme.colors.successBright} />
                <Text style={styles.reminderTitle}>Return Reminder</Text>
              </View>
              <Text style={styles.reminderText}>
                A reminder will be set for: <Text style={styles.reminderDate}>
                  {returnReminderDate.toLocaleDateString()}
                </Text> (7 days from today)
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => handleAnimatedClose(onCancel)}
                accessibilityLabel="Cancel"
                accessibilityRole="button"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
                accessibilityLabel="Lend item"
                accessibilityRole="button"
              >
                <Text style={styles.submitButtonText}>Lend Item</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 500,
    height: '85%',
    maxHeight: '85%',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceElevated,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  keyboardView: {
    flex: 1,
    minHeight: 0,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    minHeight: 500,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.surfaceElevated,
    borderRadius: 12,
    padding: 14,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  closeButton: {
    padding: 4,
  },
  removePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.danger,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  removePhotoText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  photoButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 6,
    fontWeight: '500',
  },
  reminderBox: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceElevated,
    marginBottom: 20,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  reminderText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  reminderDate: {
    fontWeight: '700',
    color: theme.colors.successBright,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    paddingBottom: 10,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.surfaceElevated,
  },
  cancelButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  submitButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
