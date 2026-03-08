import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

const OIL_OPTIONS = [
  { key: 'recent', label: 'Within 3 months', icon: 'checkmark-circle', color: theme.colors.success },
  { key: '3-6months', label: '3–6 months ago', icon: 'time', color: theme.colors.warning },
  { key: '6plus', label: '6+ months / Not sure', icon: 'alert-circle', color: theme.colors.danger },
];

export default function MaintenanceBaselineScreen({ vehicleData, onContinue, onBack, hasVehicle }) {
  const [mileage, setMileage] = useState('');
  const [lastOilChange, setLastOilChange] = useState(null);
  const [hasCheckEngineLight, setHasCheckEngineLight] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinue = () => {
    onContinue({
      mileage: mileage ? parseInt(mileage.replace(/,/g, '')) : null,
      estimatedLastOilChange: lastOilChange,
      hasCheckEngineLight,
    });
  };

  const formatMileage = (text) => {
    const digits = text.replace(/[^0-9]/g, '');
    if (!digits) return '';
    return parseInt(digits).toLocaleString();
  };

  const vehicleName = vehicleData
    ? `${vehicleData.decodedData?.year || ''} ${vehicleData.decodedData?.make || ''} ${vehicleData.decodedData?.model || ''}`.trim()
    : null;

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
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Ionicons name="medical" size={36} color={theme.colors.primary} />
              </View>
              <Text style={styles.title}>Quick Health Check</Text>
              <Text style={styles.subtitle}>
                {hasVehicle
                  ? `Answer 3 quick questions about ${vehicleName || 'your vehicle'} to get a maintenance health score.`
                  : 'Answer a few questions so we can tailor your experience.'}
              </Text>
            </View>

            {/* Question 1: Mileage */}
            <View style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>1</Text>
                </View>
                <Text style={styles.questionLabel}>Current Mileage</Text>
              </View>
              <TextInput
                style={styles.mileageInput}
                value={mileage}
                onChangeText={(text) => setMileage(formatMileage(text))}
                placeholder={hasVehicle ? 'e.g. 45,000' : 'Skip if no vehicle'}
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>

            {/* Question 2: Last Oil Change */}
            <View style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>2</Text>
                </View>
                <Text style={styles.questionLabel}>Last Oil Change</Text>
              </View>
              <View style={styles.optionsGroup}>
                {OIL_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.optionButton,
                      lastOilChange === opt.key && styles.optionButtonSelected,
                    ]}
                    onPress={() => setLastOilChange(opt.key)}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={20}
                      color={lastOilChange === opt.key ? opt.color : theme.colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        lastOilChange === opt.key && styles.optionTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Question 3: Check Engine Light */}
            <View style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>3</Text>
                </View>
                <Text style={styles.questionLabel}>Any Check Engine Lights?</Text>
              </View>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !hasCheckEngineLight && styles.toggleButtonActive,
                  ]}
                  onPress={() => setHasCheckEngineLight(false)}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={!hasCheckEngineLight ? theme.colors.success : theme.colors.textMuted}
                  />
                  <Text style={[styles.toggleText, !hasCheckEngineLight && styles.toggleTextActive]}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    hasCheckEngineLight && styles.toggleButtonDanger,
                  ]}
                  onPress={() => setHasCheckEngineLight(true)}
                >
                  <Ionicons
                    name="warning"
                    size={20}
                    color={hasCheckEngineLight ? theme.colors.danger : theme.colors.textMuted}
                  />
                  <Text style={[styles.toggleText, hasCheckEngineLight && styles.toggleTextDanger]}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  backButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignSelf: 'flex-start',
    padding: theme.spacing.sm,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
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
  questionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionNumberText: {
    ...theme.typography.buttonSmall,
    color: theme.colors.textPrimary,
  },
  questionLabel: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
  },
  mileageInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  optionsGroup: {
    gap: theme.spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  optionButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  optionTextSelected: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.md,
  },
  toggleButtonActive: {
    borderColor: theme.colors.success,
    backgroundColor: 'rgba(0, 170, 102, 0.1)',
  },
  toggleButtonDanger: {
    borderColor: theme.colors.danger,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  toggleText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: theme.colors.success,
  },
  toggleTextDanger: {
    color: theme.colors.danger,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  continueButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
});
