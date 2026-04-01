import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import {
  vehicleMakes,
  vehicleModels,
  getAvailableYears,
  getAvailableTrims,
  getTrimDetails,
} from '../../data/vehicleData';

export default function QuickAddScreen({ onVehicleDecoded, onSkip }) {
  const [mode, setMode] = useState('vin'); // 'vin' | 'manual'
  const [vinText, setVinText] = useState('');
  const [decodedResult, setDecodedResult] = useState(null);
  const [error, setError] = useState(null);
  const { scanVIN, decodeVINText, isScanning, isDecoding, isProcessing } = useVINScanner();

  // Manual entry state (Year → Make → Model → Trim)
  const [manualYear, setManualYear] = useState(null);
  const [manualMake, setManualMake] = useState('');
  const [manualModel, setManualModel] = useState('');
  const [manualTrim, setManualTrim] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchText, setSearchText] = useState('');

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear + 1; y >= 1990; y--) years.push(y);
    return years;
  }, []);

  const availableModels = useMemo(() => {
    if (!manualMake) return [];
    return vehicleModels[manualMake] || [];
  }, [manualMake]);

  const availableTrims = useMemo(() => {
    if (!manualMake || !manualModel) return [];
    return getAvailableTrims(manualMake, manualModel, manualYear);
  }, [manualMake, manualModel, manualYear]);

  const handleManualContinue = () => {
    const trimDetails = getTrimDetails(manualMake, manualModel, manualTrim) || {};
    const result = {
      decodedData: {
        make: manualMake,
        model: manualModel,
        year: manualYear,
        trim: manualTrim || '',
        engine: trimDetails.engine || '',
        fuelType: trimDetails.turbo ? 'Turbo' : 'Gasoline',
        driveType: '',
        bodyClass: '',
      },
      recalls: [],
    };
    onVehicleDecoded(result);
  };

  const manualReady = manualMake && manualModel && manualYear;

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
              {mode === 'vin'
                ? 'Enter your VIN to instantly load your vehicle\'s specs, service intervals, and recall info.'
                : 'Select your vehicle details below.'}
            </Text>
          </Animated.View>

          {/* Mode Toggle */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeTab, mode === 'vin' && styles.modeTabActive]}
              onPress={() => { setMode('vin'); setDecodedResult(null); setError(null); }}
              accessibilityLabel="Use VIN"
              accessibilityRole="button"
            >
              <Ionicons name="barcode-outline" size={16} color={mode === 'vin' ? theme.colors.textPrimary : theme.colors.textMuted} />
              <Text style={[styles.modeTabText, mode === 'vin' && styles.modeTabTextActive]}>Use VIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeTab, mode === 'manual' && styles.modeTabActive]}
              onPress={() => { setMode('manual'); setDecodedResult(null); setError(null); }}
              accessibilityLabel="Choose Make and Model"
              accessibilityRole="button"
            >
              <Ionicons name="list-outline" size={16} color={mode === 'manual' ? theme.colors.textPrimary : theme.colors.textMuted} />
              <Text style={[styles.modeTabText, mode === 'manual' && styles.modeTabTextActive]}>Use Make & Model</Text>
            </TouchableOpacity>
          </View>

          {mode === 'vin' ? (
          <Animated.View style={[styles.inputSection, { opacity: fadeAnim }]}>
            <Text style={styles.inputLabel}>Vehicle Identification Number</Text>
            <View style={styles.vinInputRow}>
              <TextInput
                style={styles.vinInput}
                value={vinText}
                accessibilityLabel="Vehicle Identification Number"
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
              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleScan}
                disabled={isProcessing}
                accessibilityLabel="Scan VIN with camera"
                accessibilityRole="button"
              >
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
              accessibilityLabel="Decode VIN"
              accessibilityRole="button"
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
          ) : (
          <Animated.View style={[styles.inputSection, { opacity: fadeAnim }]}>
            {/* Year */}
            <DropdownSelector
              label="Year"
              placeholder="Select year"
              value={manualYear ? String(manualYear) : ''}
              items={availableYears.map(String)}
              isOpen={activeDropdown === 'year'}
              onToggle={() => { setActiveDropdown(activeDropdown === 'year' ? null : 'year'); setSearchText(''); }}
              onSelect={(val) => {
                setManualYear(Number(val));
                setManualMake('');
                setManualModel('');
                setManualTrim('');
                setActiveDropdown('make');
                setSearchText('');
              }}
              searchText={searchText}
              onSearchChange={setSearchText}
            />

            {/* Make */}
            <DropdownSelector
              label="Make"
              placeholder={manualYear ? 'Select make' : 'Select a year first'}
              value={manualMake}
              items={vehicleMakes}
              isOpen={activeDropdown === 'make'}
              onToggle={() => { if (manualYear) { setActiveDropdown(activeDropdown === 'make' ? null : 'make'); setSearchText(''); } }}
              onSelect={(val) => {
                setManualMake(val);
                setManualModel('');
                setManualTrim('');
                setActiveDropdown('model');
                setSearchText('');
              }}
              disabled={!manualYear}
              searchText={searchText}
              onSearchChange={setSearchText}
              searchable
            />

            {/* Model */}
            <DropdownSelector
              label="Model"
              placeholder={manualMake ? 'Select model' : 'Select a make first'}
              value={manualModel}
              items={availableModels}
              isOpen={activeDropdown === 'model'}
              onToggle={() => { if (manualMake) { setActiveDropdown(activeDropdown === 'model' ? null : 'model'); setSearchText(''); } }}
              onSelect={(val) => {
                setManualModel(val);
                setManualTrim('');
                const trims = getAvailableTrims(manualMake, val, manualYear);
                setActiveDropdown(trims.length > 0 ? 'trim' : null);
                setSearchText('');
              }}
              disabled={!manualMake}
              searchText={searchText}
              onSearchChange={setSearchText}
              searchable
            />

            {/* Trim (optional) */}
            {manualModel && availableTrims.length > 0 && (
              <DropdownSelector
                label="Trim (optional)"
                placeholder="Select trim"
                value={manualTrim}
                items={availableTrims}
                isOpen={activeDropdown === 'trim'}
                onToggle={() => { setActiveDropdown(activeDropdown === 'trim' ? null : 'trim'); setSearchText(''); }}
                onSelect={(val) => {
                  setManualTrim(val);
                  setActiveDropdown(null);
                  setSearchText('');
                }}
                searchText={searchText}
                onSearchChange={setSearchText}
              />
            )}

            {manualReady && (
              <View style={styles.manualSummary}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                <Text style={styles.manualSummaryText}>
                  {manualYear} {manualMake} {manualModel}{manualTrim ? ` ${manualTrim}` : ''}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.decodeButton, !manualReady && styles.decodeButtonDisabled]}
              onPress={handleManualContinue}
              disabled={!manualReady}
              accessibilityLabel="Continue"
              accessibilityRole="button"
            >
              <Text style={styles.decodeButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
          )}

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
          )}

          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            accessibilityLabel="Skip, add vehicle later"
            accessibilityRole="button"
          >
            <Text style={styles.skipText}>Skip — I'll add later</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function DropdownSelector({ label, placeholder, value, items, isOpen, onToggle, onSelect, disabled, searchable, searchText, onSearchChange }) {
  const filtered = useMemo(() => {
    if (!searchable || !searchText) return items;
    const q = searchText.toLowerCase();
    return items.filter(i => i.toLowerCase().includes(q));
  }, [items, searchText, searchable]);

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.dropdownTrigger, disabled && styles.dropdownDisabled, isOpen && styles.dropdownTriggerOpen]}
        onPress={onToggle}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityLabel={`${label}, ${value || placeholder}`}
        accessibilityRole="button"
        accessibilityHint={disabled ? 'Select previous field first' : 'Opens options'}
      >
        <Text style={[styles.dropdownTriggerText, !value && styles.dropdownPlaceholder]}>
          {value || placeholder}
        </Text>
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={disabled ? theme.colors.textDisabled : theme.colors.textSecondary} />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownList}>
          {searchable && items.length > 6 && (
            <TextInput
              style={styles.dropdownSearch}
              placeholder="Search..."
              accessibilityLabel="Search options"
              placeholderTextColor={theme.colors.textMuted}
              value={searchText}
              onChangeText={onSearchChange}
              autoCorrect={false}
              autoFocus
            />
          )}
          <ScrollView
            style={styles.dropdownFlatList}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
            {filtered.length === 0 ? (
              <View style={styles.dropdownEmpty}>
                <Text style={styles.dropdownEmptyText}>No results</Text>
              </View>
            ) : (
              filtered.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.dropdownItem, item === value && styles.dropdownItemSelected]}
                  onPress={() => onSelect(item)}
                  accessibilityLabel={item}
                  accessibilityRole="button"
                >
                  <Text style={[styles.dropdownItemText, item === value && styles.dropdownItemTextSelected]}>
                    {item}
                  </Text>
                  {item === value && <Ionicons name="checkmark" size={16} color={theme.colors.primary} />}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
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
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: 3,
    marginBottom: theme.spacing.xl,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm - 2,
  },
  modeTabActive: {
    backgroundColor: theme.colors.primary,
  },
  modeTabText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: theme.colors.textPrimary,
  },
  dropdownContainer: {
    marginBottom: theme.spacing.lg,
    zIndex: 1,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 14,
  },
  dropdownTriggerOpen: {
    borderColor: theme.colors.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownDisabled: {
    opacity: 0.4,
  },
  dropdownTriggerText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  dropdownPlaceholder: {
    color: theme.colors.textMuted,
  },
  dropdownList: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: theme.colors.primary,
    borderBottomLeftRadius: theme.borderRadius.sm,
    borderBottomRightRadius: theme.borderRadius.sm,
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownSearch: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownFlatList: {
    maxHeight: 180,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: theme.colors.primaryDark,
  },
  dropdownItemText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  dropdownItemTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  dropdownEmpty: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  dropdownEmptyText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
  manualSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.lg,
  },
  manualSummaryText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    flex: 1,
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
