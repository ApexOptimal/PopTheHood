import React from 'react';
import { theme } from '../theme';
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
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
