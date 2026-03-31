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
import { SERVICE_INTERVAL_LABELS } from '../utils/serviceIntervals';

export default function ServiceAlerts({ vehicle, inventory, onAddMaintenance }) {
  const currentMileage = vehicle?.mileage ? parseInt(vehicle.mileage, 10) : null;
  const serviceIntervals = vehicle?.serviceIntervals || {};

  // Build list of past-due service items
  const alerts = [];
  if (currentMileage) {
    const { getNextServiceMileage } = require('../utils/serviceIntervals');
    Object.keys(serviceIntervals).forEach(key => {
      const interval = parseInt(serviceIntervals[key], 10);
      if (!interval) return;
      const nextService = getNextServiceMileage(vehicle, key, interval);
      if (nextService !== null && nextService <= currentMileage) {
        alerts.push({
          type: key,
          label: SERVICE_INTERVAL_LABELS[key] || key,
          overdueMiles: currentMileage - nextService,
        });
      }
    });
    alerts.sort((a, b) => b.overdueMiles - a.overdueMiles);
  }

  if (alerts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Service Alerts</Text>
        <View style={styles.noAlertsRow}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.successIndicator} />
          <Text style={[styles.subtext, { marginLeft: 8 }]}>No service alerts</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Alerts</Text>
      {alerts.map(alert => (
        <TouchableOpacity
          key={alert.type}
          style={styles.alertRow}
          onPress={() => onAddMaintenance && onAddMaintenance(alert.label, vehicle?.mileage)}
        >
          <Ionicons name="warning" size={20} color={theme.colors.warning} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.alertLabel}>{alert.label}</Text>
            <Text style={styles.alertDetail}>
              Overdue by {formatDistance(alert.overdueMiles)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      ))}
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
  noAlertsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.textSecondary + '33',
  },
  alertLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  alertDetail: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
