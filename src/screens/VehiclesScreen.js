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
            <Ionicons name="camera" size={32} color="#666" />
            <Text style={styles.noImageText}>No image</Text>
          </View>
        )}
        
        {hasAlerts && (
          <View style={styles.alertBadge}>
            <Ionicons name="warning" size={16} color="#ff4444" />
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
                  <Ionicons name="speedometer" size={16} color="#0066cc" />
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
                <Ionicons name="create" size={18} color="#b0b0b0" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setSelectedVehicle(item);
                  setShowMaintenanceForm(true);
                }}
              >
                <Ionicons name="build" size={18} color="#b0b0b0" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.dangerButton]}
                onPress={() => deleteVehicle(item.id)}
              >
                <Ionicons name="trash" size={18} color="#ff4444" />
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
                <Text style={[styles.oilLifeMiles, { color: '#ff4444' }]}>
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
              <Ionicons name="eye" size={16} color="#fff" />
              <Text style={styles.primaryButtonText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setSelectedVehicle(item);
                setShowMaintenanceForm(true);
              }}
            >
              <Ionicons name="calendar" size={16} color="#fff" />
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
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Vehicle</Text>
        </TouchableOpacity>
      </View>

      {vehicles.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="car" size={64} color="#666" />
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
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#4d4d4d',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
  vehicleCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  vehicleCardAlert: {
    borderColor: '#ff4444',
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
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  alertBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  alertText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleContent: {
    padding: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    minWidth: 0,
  },
  vehicleInfo: {
    flex: 1,
    minWidth: 0,
  },
  vehicleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
    minWidth: 0,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 4,
  },
  vehicleVin: {
    fontSize: 12,
    color: '#909090',
  },
  mileageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
    alignSelf: 'flex-start',
  },
  mileageText: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '600',
  },
  vehicleActions: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0,
    minWidth: 0,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
  },
  dangerButton: {
    // Styled separately
  },
  vehicleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
    minWidth: 0,
    width: '100%',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    flexShrink: 0,
    minWidth: 0,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    flexShrink: 0,
    minWidth: 0,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3d3d3d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    flexShrink: 0,
    minWidth: 0,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    flexShrink: 0,
    minWidth: 0,
  },
  maintenanceCount: {
    fontSize: 12,
    color: '#909090',
    minWidth: 0,
    flexShrink: 1,
  },
  oilLifeContainer: {
    marginTop: 12,
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  oilLifeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  oilLifeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    flexShrink: 0,
  },
  oilLifePercentage: {
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 0,
  },
  oilLifeStatus: {
    fontSize: 12,
    color: '#b0b0b0',
    flexShrink: 0,
    minWidth: 80,
  },
  oilLifeBarContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  oilLifeBarBackground: {
    height: 8,
    backgroundColor: '#2d2d2d',
    borderRadius: 4,
    overflow: 'hidden',
  },
  oilLifeBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  oilLifeMiles: {
    fontSize: 12,
    color: '#909090',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#b0b0b0',
    textAlign: 'center',
  },
});
