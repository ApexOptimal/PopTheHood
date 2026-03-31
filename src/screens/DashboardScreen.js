import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { calculateHealthScore } from '../utils/healthScore';
import { calculateOilLife } from '../utils/oilLife';
import { getUpcomingServices } from '../utils/serviceIntervals';
import { deriveMaintenanceItems } from '../utils/serviceCalculations';
import { formatDistanceWithSeparators } from '../utils/unitConverter';

function VehicleHealthCard({ vehicle, onPress }) {
  const health = useMemo(() => calculateHealthScore(vehicle), [vehicle]);
  const oilLife = useMemo(() => calculateOilLife(vehicle), [vehicle]);
  const upcoming = useMemo(() => getUpcomingServices(vehicle), [vehicle]);
  const nextService = upcoming[0] || null;
  const currentMileage = parseInt(vehicle?.mileage, 10) || 0;

  const vehicleName = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ');

  return (
    <TouchableOpacity
      style={styles.healthCard}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`View ${vehicleName}`}
    >
      <View style={styles.healthCardHeader}>
        <View style={styles.healthCardInfo}>
          <Text style={styles.healthCardName} numberOfLines={1}>{vehicleName}</Text>
          {vehicle.mileage ? (
            <Text style={styles.healthCardMileage}>{formatDistanceWithSeparators(vehicle.mileage)}</Text>
          ) : null}
        </View>
        <View style={[styles.gradeCircle, { borderColor: health.color }]}>
          <Text style={[styles.gradeText, { color: health.color }]}>{health.grade}</Text>
        </View>
      </View>

      <View style={styles.healthCardBody}>
        {/* Oil Life */}
        <View style={styles.healthMetric}>
          <View style={styles.metricHeader}>
            <Ionicons name="water-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.metricLabel}>Oil Life</Text>
          </View>
          {oilLife.percentage !== null ? (
            <View style={styles.oilBarContainer}>
              <View style={styles.oilBarBg}>
                <View style={[styles.oilBarFill, { width: `${oilLife.percentage}%`, backgroundColor: oilLife.color }]} />
              </View>
              <Text style={[styles.oilPercent, { color: oilLife.color }]}>{oilLife.percentage}%</Text>
            </View>
          ) : (
            <Text style={styles.metricValue}>—</Text>
          )}
        </View>

        {/* Next Service */}
        <View style={styles.healthMetric}>
          <View style={styles.metricHeader}>
            <Ionicons name="construct-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.metricLabel}>Next Service</Text>
          </View>
          {nextService ? (
            <View style={styles.nextServiceRow}>
              <Text style={styles.nextServiceName} numberOfLines={1}>{nextService.label}</Text>
              {currentMileage >= nextService.nextService ? (
                <Text style={[styles.nextServiceMiles, { color: theme.colors.danger }]}>Overdue</Text>
              ) : (
                <Text style={styles.nextServiceMiles}>
                  in {formatDistanceWithSeparators(nextService.nextService - currentMileage)}
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.metricValue}>All caught up</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function ActionItemRow({ icon, iconColor, label, sublabel, onPress }) {
  return (
    <TouchableOpacity
      style={styles.actionItem}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.actionItemIcon, { backgroundColor: (iconColor || theme.colors.warning) + '1A' }]}>
        <Ionicons name={icon} size={18} color={iconColor || theme.colors.warning} />
      </View>
      <View style={styles.actionItemText}>
        <Text style={styles.actionItemLabel} numberOfLines={1}>{label}</Text>
        {sublabel ? <Text style={styles.actionItemSublabel} numberOfLines={1}>{sublabel}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
    </TouchableOpacity>
  );
}

export default function DashboardScreen({ appContext, navigation }) {
  const { vehicles = [], shoppingList = [], todos = [] } = appContext || {};

  const maintenanceItems = useMemo(() => deriveMaintenanceItems(vehicles, 5), [vehicles]);

  // Build action items: overdue maintenance + unchecked shopping items
  const actionItems = useMemo(() => {
    const items = [];

    // Add maintenance items (overdue first)
    maintenanceItems.forEach(m => {
      items.push({
        id: m.id,
        icon: m.dueInMiles === 0 ? 'warning' : 'construct-outline',
        iconColor: m.dueInMiles === 0 ? theme.colors.danger : theme.colors.warning,
        label: m.serviceName,
        sublabel: m.dueInMiles === 0
          ? `Overdue — ${m.vehicleName}`
          : `Due in ${m.dueInMiles.toLocaleString()} mi — ${m.vehicleName}`,
        type: 'maintenance',
      });
    });

    // Add top 2 unchecked shopping items
    const uncheckedShopping = shoppingList.filter(i => !i.completed).slice(0, 2);
    uncheckedShopping.forEach(item => {
      items.push({
        id: `shop-${item.id}`,
        icon: 'cart-outline',
        iconColor: theme.colors.primary,
        label: item.name,
        sublabel: 'Shopping list',
        type: 'shopping',
      });
    });

    return items.slice(0, 5);
  }, [maintenanceItems, shoppingList]);

  const handleVehiclePress = (vehicle) => {
    navigation?.navigate?.('Vehicles', { screen: 'VehicleDetail', params: { vehicleId: vehicle.id } });
  };

  const handleLogService = () => {
    if (vehicles.length === 0) return;
    appContext?.setSelectedVehicle?.(vehicles[0]);
    appContext?.setShowMaintenanceForm?.(true);
  };

  const handleUpdateMileage = () => {
    if (vehicles.length === 0) return;
    appContext?.setMileageModalVehicle?.(vehicles[0]);
    appContext?.setShowMileageModal?.(true);
  };

  const handleScanReceipt = () => {
    appContext?.launchReceiptScan?.('dashboard');
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 300);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Vehicle Health Cards */}
        {vehicles.length > 0 ? (
          <View style={styles.section}>
            {vehicles.map(vehicle => (
              <VehicleHealthCard
                key={vehicle.id}
                vehicle={vehicle}
                onPress={() => handleVehiclePress(vehicle)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyVehicles}>
            <Ionicons name="car-outline" size={48} color={theme.colors.textTertiary} />
            <Text style={styles.emptyTitle}>No vehicles yet</Text>
            <Text style={styles.emptyMessage}>Add a vehicle to see your dashboard</Text>
          </View>
        )}

        {/* Quick Actions */}
        {vehicles.length > 0 && (
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={handleLogService}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Log Service"
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary + '1A' }]}>
                <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.quickActionLabel}>Log Service</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={handleUpdateMileage}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Update Miles"
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.successIndicator + '1A' }]}>
                <Ionicons name="speedometer-outline" size={24} color={theme.colors.successIndicator} />
              </View>
              <Text style={styles.quickActionLabel}>Update Miles</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={handleScanReceipt}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Scan Receipt"
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.warning + '1A' }]}>
                <Ionicons name="scan-outline" size={24} color={theme.colors.warning} />
              </View>
              <Text style={styles.quickActionLabel}>Scan Receipt</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Items */}
        {actionItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Action Items</Text>
            <View style={styles.actionItemsCard}>
              {actionItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <View style={styles.actionItemDivider} />}
                  <ActionItemRow
                    icon={item.icon}
                    iconColor={item.iconColor}
                    label={item.label}
                    sublabel={item.sublabel}
                    onPress={() => {
                      if (item.type === 'maintenance') {
                        navigation?.navigate?.('Vehicles', { screen: 'PastDue' });
                      }
                    }}
                  />
                </React.Fragment>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },

  // Vehicle Health Cards
  healthCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  healthCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  healthCardInfo: {
    flex: 1,
    marginRight: 12,
  },
  healthCardName: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
  },
  healthCardMileage: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  gradeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    fontSize: 20,
    fontWeight: '800',
  },
  healthCardBody: {
    gap: 12,
  },
  healthMetric: {
    gap: 6,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    ...theme.typography.bodySmall,
    color: theme.colors.textTertiary,
  },
  oilBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  oilBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.surfaceElevated,
    overflow: 'hidden',
  },
  oilBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  oilPercent: {
    ...theme.typography.caption,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'right',
  },
  nextServiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextServiceName: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  nextServiceMiles: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },

  // Quick Actions
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  quickAction: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },

  // Action Items
  actionItemsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  actionItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionItemText: {
    flex: 1,
  },
  actionItemLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '500',
    fontSize: 15,
  },
  actionItemSublabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  actionItemDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
    marginLeft: 58,
  },

  // Empty state
  emptyVehicles: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    ...theme.typography.h4,
    color: theme.colors.textSecondary,
    marginTop: 16,
  },
  emptyMessage: {
    ...theme.typography.bodySmall,
    color: theme.colors.textTertiary,
    marginTop: 4,
  },
});
