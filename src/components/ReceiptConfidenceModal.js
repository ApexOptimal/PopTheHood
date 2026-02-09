import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * "Pit Stop" - No mileage found. Ask: "Is this a parts haul or a shop visit?"
 */
export default function ReceiptConfidenceModal({ visible, onParts, onService, onCancel }) {
  if (!visible) return null;
  return (
    <Modal visible transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>What kind of receipt is this?</Text>
          <Text style={styles.subtitle}>We didn’t see a mileage reading. Choose the best match.</Text>
          <TouchableOpacity style={[styles.option, styles.optionParts]} onPress={onParts} activeOpacity={0.8}>
            <Ionicons name="cube" size={24} color="#0066cc" />
            <View style={styles.optionTextBlock}>
              <Text style={styles.optionTitle}>Parts purchase</Text>
              <Text style={styles.optionHint}>Parts haul — add to inventory or log as maintenance</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#0066cc" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.option, styles.optionService]} onPress={onService} activeOpacity={0.8}>
            <Ionicons name="construct" size={24} color="#0066cc" />
            <View style={styles.optionTextBlock}>
              <Text style={styles.optionTitle}>Shop / service visit</Text>
              <Text style={styles.optionHint}>Service record — we’ll prefill the maintenance form</Text>
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
    borderColor: '#4d4d4d',
    gap: 12,
  },
  optionParts: {
    borderColor: '#0066cc',
    backgroundColor: 'rgba(0,102,204,0.1)',
  },
  optionService: {
    borderColor: '#0066cc',
    backgroundColor: 'rgba(0,102,204,0.1)',
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
