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

const ANNUAL_MILEAGE_OPTIONS = [
  { key: 'under10k', label: 'Under 10,000 mi/yr' },
  { key: '10to15k', label: '10,000–15,000 mi/yr' },
  { key: '15to25k', label: '15,000–25,000 mi/yr' },
  { key: 'over25k', label: '25,000+ mi/yr' },
  { key: 'seasonal', label: 'Seasonal / Weekend only' },
];

const MONTHS = [
  { key: 'jan', label: 'J' },
  { key: 'feb', label: 'F' },
  { key: 'mar', label: 'M' },
  { key: 'apr', label: 'A' },
  { key: 'may', label: 'M' },
  { key: 'jun', label: 'J' },
  { key: 'jul', label: 'J' },
  { key: 'aug', label: 'A' },
  { key: 'sep', label: 'S' },
  { key: 'oct', label: 'O' },
  { key: 'nov', label: 'N' },
  { key: 'dec', label: 'D' },
];

const OWNERSHIP_OPTIONS = [
  { key: 'justGot', label: 'Just got it' },
  { key: 'under1yr', label: 'Less than a year' },
  { key: '1to3yr', label: '1–3 years' },
  { key: 'over3yr', label: '3+ years' },
];

const DIY_OPTIONS = [
  { key: 'never', label: 'Never' },
  { key: 'basic', label: 'Basic stuff (oil, filters)' },
  { key: 'most', label: 'Most things' },
  { key: 'everything', label: 'Everything' },
];

export default function MaintenanceBaselineScreen({ vehicleData, onContinue, onBack, hasVehicle }) {
  const [mileage, setMileage] = useState('');
  const [lastOilChange, setLastOilChange] = useState(null);
  const [hasCheckEngineLight, setHasCheckEngineLight] = useState(false);
  const [annualMileage, setAnnualMileage] = useState(null);
  const [seasonalMonths, setSeasonalMonths] = useState([]);
  const [seasonalEstimatedMiles, setSeasonalEstimatedMiles] = useState('');
  const [ownershipDuration, setOwnershipDuration] = useState(null);
  const [diyComfort, setDiyComfort] = useState(null);

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
      annualMileage,
      ...(annualMileage === 'seasonal' ? {
        seasonalMonths,
        seasonalEstimatedMiles: seasonalEstimatedMiles ? parseInt(seasonalEstimatedMiles.replace(/,/g, '')) : null,
      } : {}),
      ownershipDuration,
      diyComfort,
    });
  };

  const toggleMonth = (monthKey) => {
    setSeasonalMonths(prev =>
      prev.includes(monthKey)
        ? prev.filter(m => m !== monthKey)
        : [...prev, monthKey]
    );
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            accessibilityLabel="Back"
            accessibilityRole="button"
          >
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
                  ? `Answer a few quick questions about ${vehicleName || 'your vehicle'} to get a maintenance health score.`
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
                accessibilityLabel="Current Mileage"
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
                    accessibilityLabel={`Last oil change: ${opt.label}`}
                    accessibilityRole="button"
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
                  accessibilityLabel="No check engine lights"
                  accessibilityRole="button"
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
                  accessibilityLabel="Yes, check engine lights on"
                  accessibilityRole="button"
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

            {/* Question 4: Annual Mileage */}
            <View style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>4</Text>
                </View>
                <Text style={styles.questionLabel}>How much do you drive?</Text>
              </View>
              <View style={styles.optionsGroup}>
                {ANNUAL_MILEAGE_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.optionButton,
                      annualMileage === opt.key && styles.optionButtonSelected,
                    ]}
                    onPress={() => setAnnualMileage(opt.key)}
                    accessibilityLabel={opt.label}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.optionText,
                        annualMileage === opt.key && styles.optionTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {annualMileage === 'seasonal' && (
                <View style={styles.seasonalSection}>
                  <Text style={styles.seasonalLabel}>Which months do you drive it?</Text>
                  <View style={styles.monthGrid}>
                    {MONTHS.map((m) => (
                      <TouchableOpacity
                        key={m.key}
                        style={[
                          styles.monthCircle,
                          seasonalMonths.includes(m.key) && styles.monthCircleActive,
                        ]}
                        onPress={() => toggleMonth(m.key)}
                        accessibilityLabel={m.key}
                        accessibilityRole="button"
                      >
                        <Text
                          style={[
                            styles.monthText,
                            seasonalMonths.includes(m.key) && styles.monthTextActive,
                          ]}
                        >
                          {m.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.seasonalLabel}>Estimated miles per year</Text>
                  <TextInput
                    style={styles.mileageInput}
                    value={seasonalEstimatedMiles}
                    onChangeText={(text) => setSeasonalEstimatedMiles(formatMileage(text))}
                    placeholder="e.g. 3,000"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="numeric"
                    returnKeyType="done"
                    accessibilityLabel="Estimated seasonal miles per year"
                  />
                </View>
              )}
            </View>

            {/* Question 5: Ownership Duration */}
            <View style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>5</Text>
                </View>
                <Text style={styles.questionLabel}>How long have you had this vehicle?</Text>
              </View>
              <View style={styles.optionsGroup}>
                {OWNERSHIP_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.optionButton,
                      ownershipDuration === opt.key && styles.optionButtonSelected,
                    ]}
                    onPress={() => setOwnershipDuration(opt.key)}
                    accessibilityLabel={opt.label}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.optionText,
                        ownershipDuration === opt.key && styles.optionTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Question 6: DIY Comfort */}
            <View style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>6</Text>
                </View>
                <Text style={styles.questionLabel}>Do you work on your own vehicle?</Text>
              </View>
              <View style={styles.optionsGroup}>
                {DIY_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.key}
                    style={[
                      styles.optionButton,
                      diyComfort === opt.key && styles.optionButtonSelected,
                    ]}
                    onPress={() => setDiyComfort(opt.key)}
                    accessibilityLabel={opt.label}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.optionText,
                        diyComfort === opt.key && styles.optionTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              accessibilityLabel="Continue"
              accessibilityRole="button"
            >
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
  seasonalSection: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  seasonalLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'center',
  },
  monthCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthCircleActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  monthText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  monthTextActive: {
    color: theme.colors.textPrimary,
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
