import React, { useState, useRef, useEffect, useMemo } from 'react';
import { theme } from '../theme';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceWithSeparators } from '../utils/unitConverter';
import { getPredictedMileage } from '../utils/mileageTracking';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ANIMATION_DURATION = 375;

export default function MileageUpdateModal({ vehicle, onUpdate, onSkip }) {
  const prediction = useMemo(() => getPredictedMileage(vehicle), [vehicle]);
  const [showAdjustInput, setShowAdjustInput] = useState(false);
  const [mileage, setMileage] = useState(() => {
    if (prediction) return String(prediction.predicted);
    return vehicle.mileage != null && vehicle.mileage !== '' ? String(vehicle.mileage) : '';
  });

  // Animation state
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // When prediction exists and user hasn't toggled to adjust, keep input in sync
  useEffect(() => {
    if (prediction && !showAdjustInput) {
      setMileage(String(prediction.predicted));
    }
  }, [prediction, showAdjustInput]);

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

  const handleConfirm = () => {
    const value = mileage.trim();
    if (value) {
      onUpdate(value, false);
    } else {
      onUpdate(null, true);
    }
  };

  const showPredictedFlow = prediction && !showAdjustInput;

  return (
    <Modal
      visible={true}
      animationType="none"
      transparent={true}
      onRequestClose={() => handleAnimatedClose(onSkip)}
    >
      <Animated.View style={{ flex: 1, width: '100%', opacity: fadeAnim }}>
        <Animated.View style={{ flex: 1, width: '100%', transform: [{ translateY: slideAnim }] }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <View style={styles.overlay}>
              <View style={styles.modal}>
                <Text style={styles.title}>Update Mileage</Text>
                <Text style={styles.subtitle}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </Text>

                {vehicle.mileage != null && vehicle.mileage !== '' && (
                  <Text style={styles.currentMileage}>
                    Last: {formatDistanceWithSeparators(vehicle.mileage)}
                  </Text>
                )}

                {showPredictedFlow ? (
                  <>
                    <View style={styles.predictedBlock}>
                      <Text style={styles.predictedLabel}>Predicted mileage</Text>
                      <Text style={styles.predictedValue}>
                        {formatDistanceWithSeparators(prediction.predicted)}
                      </Text>
                      <Text style={styles.predictedHint}>
                        ~{Math.round(prediction.avgMilesPerDay)} mi/day · {prediction.daysSinceLastUpdate} days since last update
                      </Text>
                    </View>
                    <View style={styles.buttons}>
                      <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => handleAnimatedClose(() => onUpdate(null, true))}
                        accessibilityLabel="Skip mileage update"
                        accessibilityRole="button"
                      >
                        <Text style={styles.skipButtonText}>Skip</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.adjustButton}
                        onPress={() => setShowAdjustInput(true)}
                        accessibilityLabel="Adjust mileage"
                        accessibilityRole="button"
                      >
                        <Text style={styles.adjustButtonText}>Adjust</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => {
                          onUpdate(String(prediction.predicted), false);
                        }}
                        accessibilityLabel="Confirm mileage"
                        accessibilityRole="button"
                      >
                        <Text style={styles.confirmButtonText}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <TextInput
                      style={styles.input}
                      value={mileage}
                      onChangeText={setMileage}
                      placeholder="Enter odometer reading"
                      accessibilityLabel="Mileage"
                      placeholderTextColor={theme.colors.textTertiary}
                      keyboardType="numeric"
                    />
                    <View style={styles.buttons}>
                      <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => handleAnimatedClose(() => onUpdate(null, true))}
                        accessibilityLabel="Skip mileage update"
                        accessibilityRole="button"
                      >
                        <Text style={styles.skipButtonText}>Skip</Text>
                      </TouchableOpacity>
                      {prediction && showAdjustInput && (
                        <TouchableOpacity
                          style={styles.adjustButton}
                          onPress={() => {
                            setShowAdjustInput(false);
                            setMileage(String(prediction.predicted));
                          }}
                          accessibilityLabel="Use predicted mileage"
                          accessibilityRole="button"
                        >
                          <Text style={styles.adjustButtonText}>Use predicted</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.updateButton}
                        onPress={handleConfirm}
                        accessibilityLabel="Update mileage"
                        accessibilityRole="button"
                      >
                        <Text style={styles.updateButtonText}>Update</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modal: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  currentMileage: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  predictedBlock: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  predictedLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  predictedValue: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  predictedHint: {
    fontSize: 13,
    color: theme.colors.textTertiary,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    color: theme.colors.textPrimary,
    fontSize: 16,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    backgroundColor: theme.colors.surfaceElevated,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  adjustButton: {
    flex: 1,
    backgroundColor: theme.colors.surfaceElevated,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  adjustButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
