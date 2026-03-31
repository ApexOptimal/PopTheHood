import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import { theme } from '../theme';

export default function HealthCheckModal({ vehicle, onComplete, onSkip }) {
  const [currentMileage, setCurrentMileage] = useState(
    vehicle?.mileage ? String(parseInt(vehicle.mileage)) : ''
  );
  const [lastOilChangeDate, setLastOilChangeDate] = useState('');
  const [hasCheckEngineLights, setHasCheckEngineLights] = useState(false);
  const [checkEngineDetails, setCheckEngineDetails] = useState('');

  const handleComplete = () => {
    const today = new Date().toISOString().split('T')[0];
    const updates = {};

    const mileageNum = currentMileage ? parseInt(currentMileage, 10) : 0;
    if (mileageNum > 0) {
      updates.mileage = mileageNum;
      const existingHistory = vehicle?.mileageHistory || [];
      const hasEntry = existingHistory.some(e => parseInt(e.mileage, 10) === mileageNum);
      updates.mileageHistory = hasEntry
        ? existingHistory
        : [...existingHistory, { date: new Date().toISOString(), mileage: mileageNum }];
      updates.mileageLastUpdated = new Date().toISOString();
    }

    const trimmedOilDate = (lastOilChangeDate || '').trim();
    if (trimmedOilDate) {
      const parsed = new Date(trimmedOilDate);
      if (!isNaN(parsed.getTime())) {
        updates.estimatedLastService = {
          ...(vehicle?.estimatedLastService || {}),
          oilChange: parsed.toISOString(),
        };
      }
    }

    if (hasCheckEngineLights && checkEngineDetails.trim()) {
      const lightEntry = `[${today}] Check Engine: ${checkEngineDetails.trim()}`;
      const existingNotes = vehicle?.notes || '';
      updates.notes = existingNotes
        ? `${existingNotes}\n\n${lightEntry}`
        : lightEntry;
    }

    onComplete(updates);
  };

  const vehicleLabel = vehicle ? [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') : '';

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={() => onSkip?.()}
    >
      <Pressable style={styles.overlay} onPress={() => {}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card} onStartShouldSetResponder={() => true}>
              <View style={styles.header}>
                <Ionicons name="medkit" size={32} color={theme.colors.primary} />
                <Text style={styles.title}>Quick Health Check</Text>
                {vehicleLabel ? (
                  <Text style={styles.subtitle}>{vehicleLabel}</Text>
                ) : null}
                <Text style={styles.hint}>
                  A few quick questions to personalize your dashboard
                </Text>
              </View>

              {/* 1. Current mileage */}
              <View style={styles.question}>
                <Text style={styles.questionLabel}>What is your current mileage?</Text>
                <TextInput
                  style={styles.input}
                  value={currentMileage}
                  onChangeText={setCurrentMileage}
                  placeholder="e.g. 106000"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>

              {/* 2. Last oil change */}
              <View style={styles.question}>
                <Text style={styles.questionLabel}>When was your last oil change?</Text>
                <TextInput
                  style={styles.input}
                  value={lastOilChangeDate}
                  onChangeText={setLastOilChangeDate}
                  placeholder="e.g. 2024-01-15"
                  placeholderTextColor="#666"
                />
                <AnimatedPressable
                  style={styles.skipFieldButton}
                  onPress={() => setLastOilChangeDate('')}
                >
                  <Text style={styles.skipFieldText}>I don't know / Skip</Text>
                </AnimatedPressable>
              </View>

              {/* 3. Check Engine lights */}
              <View style={styles.question}>
                <Text style={styles.questionLabel}>
                  Are there any active "Check Engine" lights?
                </Text>
                <View style={styles.toggleRow}>
                  <AnimatedPressable
                    style={[
                      styles.toggleOption,
                      hasCheckEngineLights && styles.toggleOptionActive,
                    ]}
                    onPress={() => setHasCheckEngineLights(true)}
                  >
                    <Text style={[
                      styles.toggleText,
                      hasCheckEngineLights && styles.toggleTextActive,
                    ]}>
                      Yes
                    </Text>
                  </AnimatedPressable>
                  <AnimatedPressable
                    style={[
                      styles.toggleOption,
                      !hasCheckEngineLights && styles.toggleOptionActive,
                    ]}
                    onPress={() => {
                      setHasCheckEngineLights(false);
                      setCheckEngineDetails('');
                    }}
                  >
                    <Text style={[
                      styles.toggleText,
                      !hasCheckEngineLights && styles.toggleTextActive,
                    ]}>
                      No
                    </Text>
                  </AnimatedPressable>
                </View>
                {hasCheckEngineLights && (
                  <>
                    <TextInput
                      style={[styles.input, styles.detailsInput]}
                      value={checkEngineDetails}
                      onChangeText={setCheckEngineDetails}
                      placeholder="Light symbol or engine code (e.g. P0420)"
                      placeholderTextColor="#666"
                      multiline
                    />
                    <View style={styles.stoichSuggestion}>
                      <Ionicons name="chatbubble-ellipses" size={18} color={theme.colors.primary} />
                      <Text style={styles.stoichSuggestionText}>
                        Chat with Stoich to diagnose the issue and develop a plan to address it.
                      </Text>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.actions}>
                <AnimatedPressable
                  style={styles.primaryButton}
                  onPress={handleComplete}
                  animationType="bounce"
                  haptic="medium"
                >
                  <Text style={styles.primaryButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color={theme.colors.textPrimary} />
                </AnimatedPressable>
                <AnimatedPressable style={styles.skipButton} onPress={onSkip}>
                  <Text style={styles.skipButtonText}>Skip for now</Text>
                </AnimatedPressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  keyboardView: {
    width: '100%',
    maxHeight: '90%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  question: {
    marginBottom: 20,
  },
  questionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
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
  detailsInput: {
    marginTop: 8,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  skipFieldButton: {
    marginTop: 8,
    paddingVertical: 6,
  },
  skipFieldText: {
    fontSize: 13,
    color: theme.colors.textTertiary,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  toggleOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 102, 204, 0.12)',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  toggleTextActive: {
    color: theme.colors.primary,
  },
  stoichSuggestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 10,
    padding: 12,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  stoichSuggestionText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  actions: {
    marginTop: 8,
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 8,
  },
  primaryButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    color: theme.colors.textTertiary,
  },
});
