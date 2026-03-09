import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceWithSeparators } from '../utils/unitConverter';
import { calculateOilLife } from '../utils/oilLife';
import { theme } from '../theme';

export default function VehiclesScreen({ navigation, appContext }) {
  const { vehicles, setShowVehicleForm, setEditingVehicle, setShowMaintenanceForm, setSelectedVehicle, deleteVehicle, setShowMileageModal, setMileageModalVehicle } = appContext;

  const getVehicleImage = (vehicle) => {
    return vehicle.vehicleImage || vehicle.images?.[0]?.data || vehicle.images?.find(img => img.id === vehicle.featuredImageId)?.data || null;
  };

  const checkVehicleAlerts = (vehicle) => {
    const intervals = vehicle.serviceIntervals || {};
    const estimates = vehicle.estimatedLastService || {};
    const currentMileage = parseInt(vehicle.mileage) || 0;

    for (const [serviceType, interval] of Object.entries(intervals)) {
      if (!interval) continue;
      const lastService = estimates[serviceType];
      if (lastService === 'never') return true;
      if (!lastService) continue;

      const lastServiceDate = new Date(lastService);
      const daysSince = (new Date() - lastServiceDate) / (1000 * 60 * 60 * 24);
      const estimatedMilesPerDay = currentMileage / Math.max(1, (new Date() - new Date(vehicle.createdAt || Date.now())) / (1000 * 60 * 60 * 24));
      const lastServiceMileage = Math.max(0, currentMileage - (estimatedMilesPerDay * daysSince));
      const nextServiceMileage = lastServiceMileage + parseInt(interval);

      if (nextServiceMileage <= currentMileage) return true;
      if (nextServiceMileage - currentMileage <= parseInt(interval) * 0.1) return true;
    }
    return false;
  };

  const renderVehicle = ({ item }) => {
    const vehicleImage = getVehicleImage(item);
    const hasAlerts = checkVehicleAlerts(item);
    const oilLife = calculateOilLife(item);

    return (
      <TouchableOpacity
        style={[styles.vehicleCard, hasAlerts && styles.vehicleCardAlert]}
        onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })}
      >
        {vehicleImage ? (
          <Image source={{ uri: vehicleImage }} style={styles.vehicleImage} />
        ) : (
          <View style={styles.vehicleImagePlaceholder}>
            <Ionicons name="camera" size={32} color={theme.colors.textTertiary} />
            <Text style={styles.noImageText}>No image</Text>
          </View>
        )}

        {hasAlerts && (
          <View style={styles.alertBadge}>
            <Ionicons name="warning" size={16} color={theme.colors.danger} />
            <Text style={styles.alertText}>Service Due</Text>
          </View>
        )}

        <View style={styles.vehicleContent}>
          <View style={styles.vehicleHeader}>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleTitle}>
                {item.make} {item.model} {item.trim ? item.trim : ''}
              </Text>
              <Text style={styles.vehicleDetails}>
                {item.year}
                {item.licensePlate ? ` • ${item.licensePlate}` : ''}
                {item.nickname ? ` • ${item.nickname}` : item.licensePlate ? '' : ' • No plate'}
              </Text>
              {item.vin && <Text style={styles.vehicleVin}>VIN: {item.vin}</Text>}
              {item.mileage !== undefined && item.mileage !== null && (
                <TouchableOpacity
                  style={styles.mileageContainer}
                  onPress={() => {
                    if (setMileageModalVehicle && setShowMileageModal) {
                      setMileageModalVehicle(item);
                      setShowMileageModal(true);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="speedometer" size={16} color={theme.colors.primary} />
                  <Text style={styles.mileageText}>
                    {formatDistanceWithSeparators(item.mileage)}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.vehicleActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setEditingVehicle(item);
                  setShowVehicleForm(true);
                }}
              >
                <Ionicons name="create" size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setSelectedVehicle(item);
                  setShowMaintenanceForm(true);
                }}
              >
                <Ionicons name="build" size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.dangerButton]}
                onPress={() => deleteVehicle(item.id)}
              >
                <Ionicons name="trash" size={18} color={theme.colors.danger} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Oil Life Meter */}
          {oilLife.percentage !== null && (
            <View style={styles.oilLifeContainer}>
              <View style={styles.oilLifeHeader}>
                <Ionicons name="water" size={16} color={oilLife.color} />
                <Text style={styles.oilLifeLabel}>Oil Life</Text>
                <Text style={[styles.oilLifePercentage, { color: oilLife.color }]}>
                  {oilLife.percentage}%
                </Text>
                <Text style={styles.oilLifeStatus}>{oilLife.status}</Text>
              </View>
              <View style={styles.oilLifeBarContainer}>
                <View style={styles.oilLifeBarBackground}>
                  <View
                    style={[
                      styles.oilLifeBarFill,
                      {
                        width: `${oilLife.percentage}%`,
                        backgroundColor: oilLife.color
                      }
                    ]}
                  />
                </View>
              </View>
              {oilLife.milesRemaining !== null && oilLife.milesRemaining > 0 && (
                <Text style={styles.oilLifeMiles}>
                  {formatDistanceWithSeparators(oilLife.milesRemaining)} remaining
                </Text>
              )}
              {oilLife.needsChange && (
                <Text style={[styles.oilLifeMiles, { color: theme.colors.danger }]}>
                  Oil change needed
                </Text>
              )}
            </View>
          )}

          <View style={styles.vehicleFooter}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })}
            >
              <Ionicons name="eye" size={16} color={theme.colors.textPrimary} />
              <Text style={styles.primaryButtonText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setSelectedVehicle(item);
                setShowMaintenanceForm(true);
              }}
            >
              <Ionicons name="calendar" size={16} color={theme.colors.textPrimary} />
              <Text style={styles.secondaryButtonText}>Add Maintenance</Text>
            </TouchableOpacity>
            <Text style={styles.maintenanceCount} numberOfLines={1}>
              {item.maintenanceRecords?.length || 0} maintenance records
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {vehicles.length === 1 ? 'Your Vehicle' : 'Your Vehicles'}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowVehicleForm(true)}
        >
          <Ionicons name="add" size={24} color={theme.colors.textPrimary} />
          <Text style={styles.addButtonText}>Add Vehicle</Text>
        </TouchableOpacity>
      </View>

      {vehicles.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="car" size={64} color={theme.colors.textTertiary} />
          <Text style={styles.emptyText}>No vehicles added yet</Text>
          <Text style={styles.emptySubtext}>
            Add your first vehicle to get started!
          </Text>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          renderItem={renderVehicle}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.sm,
  },
  addButtonText: {
    ...theme.typography.buttonSmall,
    color: theme.colors.textPrimary,
  },
  list: {
    padding: theme.spacing.lg,
  },
  vehicleCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  vehicleCardAlert: {
    borderColor: theme.colors.danger,
    borderWidth: 2,
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  vehicleImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.sm,
    ...theme.typography.bodySmall,
  },
  alertBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.9)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.pill,
    gap: 6,
  },
  alertText: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  vehicleContent: {
    padding: theme.spacing.lg,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    minWidth: 0,
  },
  vehicleInfo: {
    flex: 1,
    minWidth: 0,
  },
  vehicleTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    minWidth: 0,
  },
  vehicleDetails: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  vehicleVin: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  mileageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    gap: 6,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: 6,
    backgroundColor: theme.colors.background,
    alignSelf: 'flex-start',
  },
  mileageText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  vehicleActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexShrink: 0,
    minWidth: 0,
  },
  actionButton: {
    padding: theme.spacing.sm,
    borderRadius: 6,
  },
  dangerButton: {},
  vehicleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    flexWrap: 'wrap',
    minWidth: 0,
    width: '100%',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    gap: 6,
    flexShrink: 0,
    minWidth: 0,
  },
  primaryButtonText: {
    ...theme.typography.buttonSmall,
    color: theme.colors.textPrimary,
    flexShrink: 0,
    minWidth: 0,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    gap: 6,
    flexShrink: 0,
    minWidth: 0,
  },
  secondaryButtonText: {
    ...theme.typography.buttonSmall,
    color: theme.colors.textPrimary,
    flexShrink: 0,
    minWidth: 0,
  },
  maintenanceCount: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    minWidth: 0,
    flexShrink: 1,
  },
  oilLifeContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  oilLifeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  oilLifeLabel: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    flexShrink: 0,
  },
  oilLifePercentage: {
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 0,
  },
  oilLifeStatus: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    flexShrink: 0,
    minWidth: 80,
  },
  oilLifeBarContainer: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  oilLifeBarBackground: {
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  oilLifeBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  oilLifeMiles: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
