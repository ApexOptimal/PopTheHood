import React, { useState, useRef, useEffect } from 'react';
import { theme } from '../theme';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { copyToPermanentStorage } from '../utils/fileStorage';
import { resizeForReceipt } from '../utils/imageResize';
import { getMaintenanceVerification } from '../utils/maintenanceVerification';
import { getUpcomingServices } from '../utils/serviceIntervals';
import { formatDistanceWithSeparators } from '../utils/unitConverter';
import logger from '../utils/logger';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ANIMATION_DURATION = 375; // 25% slower than default 300ms

export default function MaintenanceFormModal({ vehicle, initialData, isEditing, onSubmit, onCancel, onScanReceipt, receiptPrefill }) {
  // All hooks must be called before any conditional returns
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [formData, setFormData] = useState({
    type: initialData?.type || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    description: initialData?.description || '',
    cost: initialData?.cost !== null && initialData?.cost !== undefined ? String(initialData.cost) : '',
    mileage: initialData?.mileage !== null && initialData?.mileage !== undefined ? String(Math.round(parseFloat(initialData.mileage))) : '',
    location: initialData?.location || '',
    autoDeduct: initialData?.autoDeduct !== undefined ? initialData.autoDeduct : true,
    isDIY: initialData?.isDIY === true,
    shopPrice: initialData?.shopPrice !== null && initialData?.shopPrice !== undefined ? String(initialData.shopPrice) : '',
    diyPartsCost: initialData?.diyPartsCost !== null && initialData?.diyPartsCost !== undefined ? String(initialData.diyPartsCost) : '',
    receipt: initialData?.receipt || null
  });

  const [showVerification, setShowVerification] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [verificationAnswers, setVerificationAnswers] = useState({});

  const upcomingServices = React.useMemo(() => {
    if (!vehicle || isEditing) return [];
    return getUpcomingServices(vehicle).slice(0, 2);
  }, [vehicle, isEditing]);
  const vehicleMileage = parseInt(vehicle?.mileage, 10) || 0;

  // When receipt scan prefill arrives, merge into form data
  useEffect(() => {
    if (!receiptPrefill) return;
    setFormData(prev => ({
      ...prev,
      type: receiptPrefill.type || prev.type,
      date: receiptPrefill.date || prev.date,
      cost: receiptPrefill.cost !== undefined && receiptPrefill.cost !== null ? String(receiptPrefill.cost) : prev.cost,
      mileage: receiptPrefill.mileage !== undefined && receiptPrefill.mileage !== null && receiptPrefill.mileage !== '' ? String(receiptPrefill.mileage) : prev.mileage,
    }));
  }, [receiptPrefill]);

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

  if (!vehicle) return null;

  const maintenanceTypes = [
    'Oil Change',
    'Tire Rotation',
    'Brake Service',
    'Filter Replacement',
    'Cabin Air Filter',
    'Engine Air Filter',
    'Spark Plugs',
    'Transmission Service',
    'Coolant Flush',
    'Brake Fluid Change',
    'Fluid Top-off',
    'Repair',
    'Tune-up',
    'Other'
  ];

  const handleSubmit = () => {
    if (!formData.type) {
      Alert.alert('Error', 'Please select a maintenance type');
      return;
    }

    // Validate mileage
    if (formData.mileage !== '' && formData.mileage !== null && formData.mileage !== undefined) {
      const mileageVal = parseInt(String(formData.mileage), 10);
      if (isNaN(mileageVal) || mileageVal <= 0) {
        Alert.alert('Invalid Mileage', 'Mileage must be a positive number.');
        return;
      }
    }

    // Validate date
    if (formData.date) {
      const dateObj = new Date(formData.date);
      if (isNaN(dateObj.getTime())) {
        Alert.alert('Invalid Date', 'Please enter a valid date in YYYY-MM-DD format.');
        return;
      }
    }

    // Check if verification is needed (only for new maintenance, not editing)
    if (!isEditing) {
      const verification = getMaintenanceVerification(vehicle, formData.type);
      if (verification && verification.questions.length > 0) {
        setVerificationData(verification);
        setVerificationAnswers({});
        setShowVerification(true);
        return;
      }
    }
    
    // No verification needed or editing, proceed with submission
    submitMaintenance();
  };

  const submitMaintenance = () => {
    const roundedMileage = formData.mileage !== '' && formData.mileage !== null && formData.mileage !== undefined
      ? Math.round(parseFloat(formData.mileage))
      : null;

    onSubmit({
      ...formData,
      mileage: roundedMileage,
      cost: formData.cost ? parseFloat(formData.cost) : null,
      shopPrice: formData.shopPrice ? parseFloat(formData.shopPrice) : null,
      diyPartsCost: formData.diyPartsCost ? parseFloat(formData.diyPartsCost) : null,
      receipt: formData.receipt,
    });
    
    // Reset verification state
    setShowVerification(false);
    setVerificationData(null);
    setVerificationAnswers({});
  };

  const handleVerificationConfirm = () => {
    // All questions should be answered (or at least acknowledged)
    const allAnswered = verificationData.questions.every((q, index) => 
      verificationAnswers[index] === true
    );
    
    if (!allAnswered) {
      Alert.alert(
        'Verification Required',
        'Please confirm that you followed all the correct procedures and torque values.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Close verification modal and submit
    setShowVerification(false);
    submitMaintenance();
  };

  const handleSelectReceipt = () => {
    Alert.alert(
      'Select Receipt',
      'Choose how you want to add the receipt',
      [
        {
          text: 'Take Photo',
          onPress: handleTakePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: handlePickImage,
        },
        {
          text: 'Choose PDF/File',
          onPress: handlePickDocument,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaType?.Images ?? 'images',
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        // Copy to permanent storage
        const permanentUri = await resizeForReceipt(result.assets[0].uri);

        setFormData({ ...formData, receipt: { uri: permanentUri, type: 'image' } });
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
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        // Copy to permanent storage
        const permanentUri = await resizeForReceipt(result.assets[0].uri);

        setFormData({ ...formData, receipt: { uri: permanentUri, type: 'image' } });
      }
    } catch (error) {
      logger.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handlePickDocument = async () => {
    try {
      const DocumentPicker = require('expo-document-picker');
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const fileType = result.assets[0].mimeType?.includes('pdf') ? 'pdf' : 'image';
        
        // Copy to permanent storage
        let permanentUri;
        if (fileType === 'pdf') {
          const filename = result.assets[0].name || `receipt_${Date.now()}.pdf`;
          permanentUri = await copyToPermanentStorage(result.assets[0].uri, 'receipts', filename);
        } else {
          permanentUri = await resizeForReceipt(result.assets[0].uri);
        }
        
        setFormData({ 
          ...formData, 
          receipt: { 
            uri: permanentUri, 
            type: fileType,
            name: result.assets[0].name || 'receipt'
          } 
        });
      }
    } catch (error) {
      logger.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select document. Please try again.');
    }
  };

  const handleRemoveReceipt = () => {
    Alert.alert(
      'Remove Receipt',
      'Are you sure you want to remove this receipt?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setFormData({ ...formData, receipt: null }),
        },
      ]
    );
  };

  return (
    <>
      <Modal
        visible={!showVerification}
        animationType="none"
        transparent={true}
        onRequestClose={() => handleAnimatedClose(onCancel)}
      >
        <Animated.View style={{ flex: 1, width: '100%', opacity: fadeAnim }}>
          <Animated.View style={{ flex: 1, width: '100%', transform: [{ translateY: slideAnim }] }}>
        <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditing ? 'Edit Maintenance' : 'Add Maintenance'}
            </Text>
            <View style={styles.headerButtons}>
              {!isEditing && (
                <TouchableOpacity
                  style={styles.headerAddButton}
                  onPress={handleSubmit}
                  accessibilityLabel="Add maintenance"
                  accessibilityRole="button"
                >
                  <Ionicons name="add-circle" size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.headerAddButtonText}>Add Maintenance</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => handleAnimatedClose(onCancel)}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={true}
            >
            <Text style={styles.vehicleInfo}>
              {vehicle?.year || ''} {vehicle?.make || ''} {vehicle?.model || ''}
            </Text>

            {onScanReceipt && (
              <TouchableOpacity
                style={styles.scanReceiptButton}
                onPress={onScanReceipt}
                activeOpacity={0.8}
                accessibilityLabel="Scan receipt"
                accessibilityRole="button"
              >
                <Ionicons name="document-text" size={22} color={theme.colors.primary} />
                <Text style={styles.scanReceiptButtonText}>Scan Receipt</Text>
              </TouchableOpacity>
            )}

            {/* Upcoming Services - Quick Complete */}
            {upcomingServices.length > 0 && !isEditing && (
              <View style={styles.upcomingServicesSection}>
                <Text style={styles.upcomingServicesTitle}>Next Services Due</Text>
                <View style={styles.upcomingServicesRow}>
                  {upcomingServices.map((service) => {
                    const isOverdue = vehicleMileage >= service.nextService;
                    return (
                      <TouchableOpacity
                        key={service.type}
                        style={[
                          styles.upcomingServiceCard,
                          isOverdue && styles.upcomingServiceCardOverdue,
                        ]}
                        accessibilityLabel={`Complete ${service.label} service`}
                        accessibilityRole="button"
                        onPress={() => {
                          setFormData(prev => ({
                            ...prev,
                            type: service.maintenanceType,
                            mileage: String(vehicleMileage),
                            date: new Date().toISOString().split('T')[0],
                          }));
                        }}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.upcomingServiceName,
                            isOverdue && styles.upcomingServiceNameOverdue,
                          ]}
                          numberOfLines={1}
                        >
                          {service.label}
                        </Text>
                        <Text
                          style={[
                            styles.upcomingServiceMileage,
                            isOverdue && styles.upcomingServiceMileageOverdue,
                          ]}
                        >
                          {formatDistanceWithSeparators(service.nextService)}
                        </Text>
                        {isOverdue ? (
                          <View style={styles.overdueBadge}>
                            <Text style={styles.overdueBadgeText}>Overdue</Text>
                          </View>
                        ) : (
                          <Text style={styles.upcomingServiceRemaining}>
                            in {formatDistanceWithSeparators(service.nextService - vehicleMileage)}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Maintenance Type *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                {maintenanceTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeChip,
                      formData.type === type && styles.typeChipActive
                    ]}
                    onPress={() => setFormData({ ...formData, type })}
                    accessibilityLabel={`Select maintenance type ${type}`}
                    accessibilityRole="button"
                  >
                    <Text style={[
                      styles.typeChipText,
                      formData.type === type && styles.typeChipTextActive
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.textTertiary}
                accessibilityLabel="Date"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Mileage</Text>
              <TextInput
                style={styles.input}
                value={formData.mileage}
                onChangeText={(text) => setFormData({ ...formData, mileage: text })}
                placeholder="Mileage at time of service"
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="numeric"
                accessibilityLabel="Mileage"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Additional details"
                placeholderTextColor={theme.colors.textTertiary}
                multiline
                numberOfLines={3}
                accessibilityLabel="Description"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Cost ($)</Text>
              <TextInput
                style={styles.input}
                value={formData.cost}
                onChangeText={(text) => setFormData({ ...formData, cost: text })}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="decimal-pad"
                accessibilityLabel="Cost"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                placeholder="Where was service performed?"
                placeholderTextColor={theme.colors.textTertiary}
                accessibilityLabel="Location"
              />
            </View>

            <View style={styles.switchGroup}>
              <Text style={styles.label}>Automatically deduct consumables</Text>
              <Switch
                value={formData.autoDeduct}
                onValueChange={(value) => setFormData({ ...formData, autoDeduct: value })}
                accessibilityLabel="Automatically deduct consumables"
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={formData.autoDeduct ? theme.colors.textPrimary : theme.colors.textSecondary}
              />
            </View>

            <View style={styles.switchGroup}>
              <Text style={styles.label}>DIY Service</Text>
              <Switch
                value={formData.isDIY}
                onValueChange={(value) => setFormData({ ...formData, isDIY: value })}
                accessibilityLabel="DIY Service"
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={formData.isDIY ? theme.colors.textPrimary : theme.colors.textSecondary}
              />
            </View>

            {formData.isDIY && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Shop Price ($)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.shopPrice}
                    onChangeText={(text) => setFormData({ ...formData, shopPrice: text })}
                    placeholder="What would a shop charge?"
                    accessibilityLabel="Shop Price"
                    placeholderTextColor={theme.colors.textTertiary}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>DIY Parts Cost ($)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.diyPartsCost}
                    onChangeText={(text) => setFormData({ ...formData, diyPartsCost: text })}
                    placeholder="Cost of parts/materials"
                    accessibilityLabel="DIY Parts Cost"
                    placeholderTextColor={theme.colors.textTertiary}
                    keyboardType="decimal-pad"
                  />
                </View>
              </>
            )}

            {/* Receipt Section */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Receipt (Optional)</Text>
              {formData.receipt ? (
                <View style={styles.receiptContainer}>
                  {formData.receipt.type === 'image' ? (
                    <Image source={{ uri: formData.receipt.uri }} style={styles.receiptPreview} />
                  ) : (
                    <View style={styles.receiptFilePreview}>
                      <Ionicons name="document" size={48} color={theme.colors.primary} />
                      <Text style={styles.receiptFileName} numberOfLines={1}>
                        {formData.receipt.name || 'Receipt.pdf'}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.removeReceiptButton}
                    onPress={handleRemoveReceipt}
                    accessibilityLabel="Remove receipt"
                    accessibilityRole="button"
                  >
                    <Ionicons name="trash" size={20} color={theme.colors.textPrimary} />
                    <Text style={styles.removeReceiptText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addReceiptButton}
                  onPress={handleSelectReceipt}
                  accessibilityLabel="Add receipt"
                  accessibilityRole="button"
                >
                  <Ionicons name="receipt" size={20} color={theme.colors.primary} />
                  <Text style={styles.addReceiptText}>Add Receipt</Text>
                </TouchableOpacity>
              )}
            </View>
            </ScrollView>
          </KeyboardAvoidingView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              accessibilityLabel="Cancel"
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              accessibilityLabel={isEditing ? 'Update maintenance' : 'Add maintenance'}
              accessibilityRole="button"
            >
              <Text style={styles.submitButtonText}>
                {isEditing ? 'Update' : 'Add'} Maintenance
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </Animated.View>
      </Animated.View>
      </Modal>

      {/* Verification Modal */}
      {showVerification && verificationData && (
        <Modal
          visible={showVerification}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowVerification(false)}
        >
          <View style={styles.verificationOverlay}>
            <View style={styles.verificationModal}>
              <View style={styles.verificationHeader}>
                <Text style={styles.verificationTitle}>Verification Required</Text>
                <TouchableOpacity
                  onPress={() => setShowVerification(false)}
                  accessibilityLabel="Close verification"
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.verificationContent}>
                <Text style={styles.verificationSubtitle}>
                  Please confirm that you used the correct procedures and torque values for this {formData.type}:
                </Text>

                {verificationData.questions.map((question, index) => (
                  <View key={index} style={styles.verificationQuestion}>
                    <View style={styles.verificationQuestionHeader}>
                      <Text style={styles.verificationQuestionText}>{question.question}</Text>
                      <TouchableOpacity
                        style={[
                          styles.verificationCheckbox,
                          verificationAnswers[index] && styles.verificationCheckboxChecked
                        ]}
                        accessibilityLabel={`Confirm ${question.question}`}
                        accessibilityRole="checkbox"
                        onPress={() => setVerificationAnswers({
                          ...verificationAnswers,
                          [index]: !verificationAnswers[index]
                        })}
                      >
                        {verificationAnswers[index] && (
                          <Ionicons name="checkmark" size={20} color={theme.colors.textPrimary} />
                        )}
                      </TouchableOpacity>
                    </View>
                    <View style={styles.verificationSpecContainer}>
                      <Text style={styles.verificationSpecLabel}>
                        {question.type === 'procedure' ? 'Procedure:' : 'Torque Value:'}
                      </Text>
                      <Text style={styles.verificationSpecValue}>{question.value}</Text>
                    </View>
                    {question.note && (
                      <Text style={styles.verificationNote}>{question.note}</Text>
                    )}
                  </View>
                ))}

                {Object.keys(verificationData.torqueValues).length > 0 && (
                  <View style={styles.verificationTorqueSummary}>
                    <Text style={styles.verificationTorqueSummaryTitle}>Torque Values Summary:</Text>
                    {Object.entries(verificationData.torqueValues).map(([key, value]) => (
                      <View key={key} style={styles.verificationTorqueRow}>
                        <Text style={styles.verificationTorqueLabel}>{key}:</Text>
                        <Text style={styles.verificationTorqueValue}>{value}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>

              <View style={styles.verificationFooter}>
                <TouchableOpacity
                  style={styles.verificationCancelButton}
                  onPress={() => setShowVerification(false)}
                  accessibilityLabel="Cancel"
                  accessibilityRole="button"
                >
                  <Text style={styles.verificationCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.verificationConfirmButton}
                  onPress={handleVerificationConfirm}
                  accessibilityLabel="Confirm and submit"
                  accessibilityRole="button"
                >
                  <Text style={styles.verificationConfirmButtonText}>Confirm & Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 150 : 50,
  },
  modal: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '75%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  headerAddButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  keyboardView: {
    flex: 1,
    minHeight: 400,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  scanReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0,102,204,0.1)',
    marginBottom: 16,
  },
  scanReceiptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  vehicleInfo: {
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 20,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeScroll: {
    marginTop: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceElevated,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  typeChipText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  typeChipTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.surfaceElevated,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  addReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  addReceiptText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  receiptContainer: {
    marginTop: 8,
  },
  receiptPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'contain',
    backgroundColor: theme.colors.background,
  },
  receiptFilePreview: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  receiptFileName: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  removeReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.danger,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  removeReceiptText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  verificationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  verificationModal: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  verificationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  verificationContent: {
    padding: 20,
    maxHeight: 400,
  },
  verificationSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  verificationQuestion: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  verificationQuestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  verificationQuestionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  verificationCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  verificationCheckboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  verificationSpecContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  verificationSpecLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginRight: 8,
  },
  verificationSpecValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  verificationNote: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    marginTop: 8,
  },
  verificationTorqueSummary: {
    marginTop: 20,
    padding: 16,
    backgroundColor: theme.colors.primaryDark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  verificationTorqueSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  verificationTorqueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  verificationTorqueLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  verificationTorqueValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  verificationFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  verificationCancelButton: {
    flex: 1,
    backgroundColor: theme.colors.surfaceElevated,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  verificationCancelButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  verificationConfirmButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  verificationConfirmButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  // Upcoming Services styles
  upcomingServicesSection: {
    marginBottom: 20,
  },
  upcomingServicesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  upcomingServicesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  upcomingServiceCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  upcomingServiceCardOverdue: {
    borderColor: theme.colors.danger,
    backgroundColor: 'rgba(255, 68, 68, 0.08)',
  },
  upcomingServiceName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  upcomingServiceNameOverdue: {
    color: theme.colors.danger,
  },
  upcomingServiceMileage: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  upcomingServiceMileageOverdue: {
    color: theme.colors.danger,
  },
  overdueBadge: {
    backgroundColor: theme.colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  overdueBadgeText: {
    color: theme.colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  upcomingServiceRemaining: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
