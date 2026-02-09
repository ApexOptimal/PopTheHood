import React, { useState, useRef, useEffect, useMemo } from 'react';
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
                      >
                        <Text style={styles.skipButtonText}>Skip</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.adjustButton}
                        onPress={() => setShowAdjustInput(true)}
                      >
                        <Text style={styles.adjustButtonText}>Adjust</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => {
                          onUpdate(String(prediction.predicted), false);
                        }}
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
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                    />
                    <View style={styles.buttons}>
                      <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => handleAnimatedClose(() => onUpdate(null, true))}
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
                        >
                          <Text style={styles.adjustButtonText}>Use predicted</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.updateButton}
                        onPress={handleConfirm}
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
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#b0b0b0',
    marginBottom: 16,
  },
  currentMileage: {
    fontSize: 14,
    color: '#0066cc',
    marginBottom: 16,
  },
  predictedBlock: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0066cc',
  },
  predictedLabel: {
    fontSize: 12,
    color: '#b0b0b0',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  predictedValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  predictedHint: {
    fontSize: 13,
    color: '#888',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#4d4d4d',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#3d3d3d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  adjustButton: {
    flex: 1,
    backgroundColor: '#3d3d3d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  adjustButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
