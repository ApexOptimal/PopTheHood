import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useVINScanner } from '../../hooks/useVINScanner';
import { cleanVIN, isValidVIN } from '../../utils/vinDecoder';
import { theme } from '../../theme';

export default function QuickAddScreen({ onVehicleDecoded, onSkip }) {
  const [vinText, setVinText] = useState('');
  const [decodedResult, setDecodedResult] = useState(null);
  const [error, setError] = useState(null);
  const { scanVIN, decodeVINText, isScanning, isDecoding, isProcessing } = useVINScanner();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;
  const revealSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const animateReveal = () => {
    revealAnim.setValue(0);
    revealSlide.setValue(20);
    Animated.parallel([
      Animated.timing(revealAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(revealSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  };

  const handleVINSubmit = async () => {
    setError(null);
    const cleaned = cleanVIN(vinText);
    if (!isValidVIN(cleaned)) {
      setError('Please enter a valid 17-character VIN');
      return;
    }

    const result = await decodeVINText(cleaned);
    if (result) {
      setDecodedResult(result);
      animateReveal();
    } else {
      setError('Could not decode this VIN. Please check and try again.');
    }
  };

  const handleScan = async () => {
    setError(null);
    const result = await scanVIN();
    if (result) {
      setVinText(result.vin);
      setDecodedResult(result);
      animateReveal();
    }
  };

  const handleContinue = () => {
    onVehicleDecoded(decodedResult);
  };

  const { decodedData, recalls } = decodedResult || {};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.iconCircle}>
              <Ionicons name="car-sport" size={40} color={theme.colors.primary} />
            </View>
            <Text style={styles.title}>Let's Find Your Car</Text>
            <Text style={styles.subtitle}>
              Enter your VIN to instantly load your vehicle's specs, service intervals, and recall info.
            </Text>
          </Animated.View>

          <Animated.View style={[styles.inputSection, { opacity: fadeAnim }]}>
            <Text style={styles.inputLabel}>Vehicle Identification Number</Text>
            <View style={styles.vinInputRow}>
              <TextInput
                style={styles.vinInput}
                value={vinText}
                onChangeText={(text) => {
                  setVinText(text.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, ''));
                  setError(null);
                }}
                placeholder="Enter 17-character VIN"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={17}
                returnKeyType="done"
                onSubmitEditing={handleVINSubmit}
              />
              <TouchableOpacity style={styles.scanButton} onPress={handleScan} disabled={isProcessing}>
                <Ionicons name="camera" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.vinCount}>{vinText.length}/17</Text>

            {error && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={16} color={theme.colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.decodeButton, (!vinText || isProcessing) && styles.decodeButtonDisabled]}
              onPress={handleVINSubmit}
              disabled={!vinText || isProcessing}
            >
              {isDecoding ? (
                <ActivityIndicator color={theme.colors.textPrimary} />
              ) : (
                <Text style={styles.decodeButtonText}>Decode VIN</Text>
              )}
            </TouchableOpacity>

            {isScanning && (
              <View style={styles.scanningRow}>
                <ActivityIndicator color={theme.colors.primary} size="small" />
                <Text style={styles.scanningText}>Scanning image for VIN...</Text>
              </View>
            )}

            <Text style={styles.vinHint}>
              Find your VIN on the door jam sticker, registration, or dashboard near the windshield.
            </Text>
          </Animated.View>

          {/* Vehicle Reveal */}
          {decodedResult && (
            <Animated.View style={[styles.revealCard, { opacity: revealAnim, transform: [{ translateY: revealSlide }] }]}>
              <View style={styles.revealHeader}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                <Text style={styles.revealTitle}>Vehicle Found</Text>
              </View>

              <Text style={styles.vehicleName}>
                {decodedData.year} {decodedData.make} {decodedData.model}
                {decodedData.trim ? ` ${decodedData.trim}` : ''}
              </Text>

              <View style={styles.specGrid}>
                {decodedData.engine && (
                  <SpecItem icon="speedometer-outline" label="Engine" value={decodedData.engine} />
                )}
                {decodedData.fuelType && (
                  <SpecItem icon="flash-outline" label="Fuel" value={decodedData.fuelType} />
                )}
                {decodedData.driveType && (
                  <SpecItem icon="git-branch-outline" label="Drive" value={decodedData.driveType} />
                )}
                {decodedData.bodyClass && (
                  <SpecItem icon="car-outline" label="Body" value={decodedData.bodyClass} />
                )}
              </View>

              {recalls && recalls.length > 0 && (
                <View style={styles.recallBadge}>
                  <Ionicons name="warning" size={16} color={theme.colors.warning} />
                  <Text style={styles.recallText}>
                    {recalls.length} open recall{recalls.length > 1 ? 's' : ''} found
                  </Text>
                </View>
              )}

              <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.continueButtonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </Animated.View>
          )}

          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipText}>Skip — I'll add later</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SpecItem({ icon, label, value }) {
  return (
    <View style={styles.specItem}>
      <Ionicons name={icon} size={18} color={theme.colors.primary} />
      <View style={styles.specTextGroup}>
        <Text style={styles.specLabel}>{label}</Text>
        <Text style={styles.specValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: { flex: 1 },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
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
  inputSection: {
    marginBottom: theme.spacing.xl,
  },
  inputLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  vinInputRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  vinInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  scanButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vinCount: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  errorText: {
    ...theme.typography.bodySmall,
    color: theme.colors.danger,
  },
  decodeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  decodeButtonDisabled: {
    opacity: 0.5,
  },
  decodeButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
  scanningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  scanningText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  vinHint: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  revealCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  revealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  revealTitle: {
    ...theme.typography.h4,
    color: theme.colors.success,
  },
  vehicleName: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  specGrid: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  specTextGroup: {
    flex: 1,
  },
  specLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  specValue: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  recallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: 'rgba(255, 136, 0, 0.15)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.lg,
  },
  recallText: {
    ...theme.typography.bodySmall,
    color: theme.colors.warning,
    fontWeight: '600',
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
