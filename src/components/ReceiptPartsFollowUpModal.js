import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
            <Ionicons name="cube-outline" size={24} color="#0066cc" />
            <View style={styles.optionTextBlock}>
              <Text style={styles.optionTitle}>Stock the Shelves</Text>
              <Text style={styles.optionHint}>Add parts to Inventory</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#0066cc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={onInstallNow} activeOpacity={0.8}>
            <Ionicons name="construct-outline" size={24} color="#0066cc" />
            <View style={styles.optionTextBlock}>
              <Text style={styles.optionTitle}>Completing maintenance work now?</Text>
              <Text style={styles.optionHint}>Port data to the maintenance form</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#0066cc" />
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#b0b0b0',
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
    borderColor: '#0066cc',
    backgroundColor: 'rgba(0,102,204,0.1)',
    gap: 12,
  },
  optionTextBlock: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  optionHint: {
    fontSize: 12,
    color: '#b0b0b0',
    marginTop: 2,
  },
  cancel: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelText: {
    fontSize: 15,
    color: '#888',
  },
});
