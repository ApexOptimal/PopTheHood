import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistance } from '../utils/unitConverter';

export default function ServiceAlerts({ vehicle, inventory, onAddMaintenance }) {
  // Placeholder - full implementation would calculate service alerts
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Alerts</Text>
      <Text style={styles.subtext}>Service alerts will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#b0b0b0',
  },
});
