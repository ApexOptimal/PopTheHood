import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export default function ServiceHistoryPromptModal({ vehicle, onSelect, onSkip }) {
  if (!vehicle) return null;

  const vehicleLabel = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ');

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={() => onSkip?.()}
    >
      <Pressable style={styles.overlay} onPress={onSkip}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>What's the status of this build?</Text>
          {vehicleLabel ? (
            <Text style={styles.subtitle}>{vehicleLabel}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.option, styles.optionPrimary]}
            onPress={() => onSelect('current')}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={28} color={theme.colors.primary} />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Current on Maintenance</Text>
              <Text style={styles.optionHint}>Clean title — we'll assume all factory intervals are complete up to this mileage. Next service starts from your current odometer.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, styles.optionSecondary]}
            onPress={() => onSelect('unknown')}
            activeOpacity={0.8}
          >
            <Ionicons name="construct" size={28} color={theme.colors.textSecondary} />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Just Bought It / Unknown History</Text>
              <Text style={styles.optionHint}>Project car — we'll show overdue items. Use "Mark All Prior Tasks as Complete" on Past Due if you've done a full tune-up.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipButtonText}>I'll set this later</Text>
          </TouchableOpacity>
        </View>
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
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    gap: 12,
  },
  optionPrimary: {
    backgroundColor: 'rgba(0, 102, 204, 0.12)',
    borderColor: theme.colors.primary,
  },
  optionSecondary: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  optionHint: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  skipButtonText: {
    fontSize: 15,
    color: theme.colors.textTertiary,
  },
});
