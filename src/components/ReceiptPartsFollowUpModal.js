import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

/**
 * "Diversion" - Parts selected. Option A: Stock the Shelves (Inventory). Option B: Install Now (maintenance form).
 */
export default function ReceiptPartsFollowUpModal({
  visible,
  onAddToInventory,
  onInstallNow,
  onCancel,
}) {
  if (!visible) return null;
  return (
    <Modal visible transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>What would you like to do?</Text>
          <Text style={styles.subtitle}>Add parts to inventory or log the work as maintenance.</Text>
          <TouchableOpacity style={styles.option} onPress={onAddToInventory} activeOpacity={0.8}>
            <Ionicons name="cube-outline" size={24} color={theme.colors.primary} />
            <View style={styles.optionTextBlock}>
              <Text style={styles.optionTitle}>Stock the Shelves</Text>
              <Text style={styles.optionHint}>Add parts to Inventory</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={onInstallNow} activeOpacity={0.8}>
            <Ionicons name="construct-outline" size={24} color={theme.colors.primary} />
            <View style={styles.optionTextBlock}>
              <Text style={styles.optionTitle}>Completing maintenance work now?</Text>
              <Text style={styles.optionHint}>Port data to the maintenance form</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancel} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
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
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0,102,204,0.1)',
    gap: 12,
  },
  optionTextBlock: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  optionHint: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  cancel: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelText: {
    fontSize: 15,
    color: theme.colors.textTertiary,
  },
});
