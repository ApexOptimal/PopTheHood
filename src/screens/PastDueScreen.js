import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistance, formatDistanceWithSeparators, getUnitSystem } from '../utils/unitConverter';
import { storage } from '../utils/storage';
import { checkOilInventory } from '../utils/oilInventoryCheck';

export default function PastDueScreen({ appContext, navigation }) {
  const { vehicles, inventory = [], updateVehicle, setSelectedVehicle, setShowMaintenanceForm, setEditingMaintenance } = appContext;
  const [pastDueItems, setPastDueItems] = useState([]);
  const [vehicleAlerts, setVehicleAlerts] = useState({});
  const [expandedVehicles, setExpandedVehicles] = useState({});
  const [unitSystem, setUnitSystem] = useState(() => getUnitSystem());

  useEffect(() => {
    calculatePastDueItems();
    // Reload unit system when vehicles change
    setUnitSystem(getUnitSystem());
  }, [vehicles]);

  useEffect(() => {
    // Recalculate past due items and reload unit system when screen focuses
    // This ensures items disappear after maintenance is added
    if (navigation) {
      const unsubscribe = navigation.addListener('focus', () => {
        calculatePastDueItems();
        setUnitSystem(getUnitSystem());
      });
      return unsubscribe;
    }
  }, [navigation, vehicles]);

  const calculatePastDueItems = () => {
    const overdue = [];
    const alertsByVehicle = {};

    vehicles.forEach(vehicle => {
      // "Current on Maintenance" = assume all factory intervals complete up to current mileage; next service starts from odometer
      if (vehicle.maintenanceHistoryStatus === 'current') {
        return;
      }

      const intervals = vehicle.serviceIntervals || {};
      const estimates = vehicle.estimatedLastService || {};
      const ignoredReminders = vehicle.ignoredReminders || {};
      const currentMileage = parseInt(vehicle.mileage) || 0;

      Object.keys(intervals).forEach(serviceType => {
        const interval = parseInt(intervals[serviceType]);
        if (!interval) return;

        // Skip ignored reminders
        if (ignoredReminders[serviceType]) return;

        const lastService = estimates[serviceType];
        
        let item = null;

        if (lastService === 'never') {
          // Service never performed - only show as past due if current mileage >= interval
          if (currentMileage >= interval) {
            const milesOverdue = currentMileage - interval;
            // Round to avoid weird decimal values
            const roundedOverdue = Math.round(milesOverdue);
            item = {
              vehicleId: vehicle.id,
              vehicle: vehicle,
              serviceType: serviceType,
              serviceLabel: getServiceLabel(serviceType),
              status: 'never',
              message: `Service never performed - ${roundedOverdue > 0 ? `overdue by ${formatDistance(roundedOverdue, 0)}` : 'due now'}`,
              interval: interval,
              nextServiceMileage: interval,
              currentMileage: currentMileage,
              milesOverdue: roundedOverdue
            };
          }
        } else if (!lastService) {
          // No last service date - check if current mileage >= interval
          if (currentMileage >= interval) {
            const milesOverdue = currentMileage - interval;
            // Round to avoid weird decimal values
            const roundedOverdue = Math.round(milesOverdue);
            item = {
              vehicleId: vehicle.id,
              vehicle: vehicle,
              serviceType: serviceType,
              serviceLabel: getServiceLabel(serviceType),
              status: 'overdue',
              message: `Overdue by ${formatDistance(roundedOverdue, 0)}`,
              interval: interval,
              nextServiceMileage: interval,
              currentMileage: currentMileage,
              milesOverdue: roundedOverdue
            };
          }
        } else {
          const lastServiceDate = new Date(lastService);
          const lastServiceMileage = getLastServiceMileage(vehicle, serviceType, lastServiceDate);
          
          // Calculate next service mileage
          let nextServiceMileage;
          if (lastServiceMileage !== null && !isNaN(lastServiceMileage) && lastServiceMileage >= 0) {
            // We have a valid last service mileage - next service is that + interval
            nextServiceMileage = lastServiceMileage + interval;
          } else {
            // Can't determine last service mileage from records
            // Use the estimatedLastService date to estimate when service should have been done
            // If lastServiceDate is recent (within last 30 days), assume service was done at current mileage - interval
            // Otherwise, be conservative and use current mileage as the baseline
            const daysSinceLastService = (new Date() - lastServiceDate) / (1000 * 60 * 60 * 24);
            if (daysSinceLastService <= 30) {
              // Recent service date - assume it was done at approximately (current - interval) mileage
              nextServiceMileage = Math.max(interval, currentMileage);
            } else {
              // Older service date - use current mileage as baseline
              nextServiceMileage = currentMileage;
            }
          }
          
          const milesOverdue = currentMileage - nextServiceMileage;
          
          // Round to avoid weird decimal values that don't make sense
          const roundedOverdue = Math.round(Math.abs(milesOverdue));
          const roundedNextService = Math.round(nextServiceMileage);

          // Check if a recent maintenance record was added that matches this service type
          // If so, and it's at or above the next service mileage, don't show as past due
          const records = vehicle.maintenanceRecords || [];
          const matchingRecords = records.filter(r => {
            if (!r.type || !r.date) return false;
            const recordType = r.type.toLowerCase();
            const recordDate = new Date(r.date);
            const daysSinceRecord = (new Date() - recordDate) / (1000 * 60 * 60 * 24);
            
            // Only consider records from the last 7 days as "recent"
            if (daysSinceRecord > 7) return false;
            
            // Check if record type matches service type
            if (serviceType === 'oilChange') return recordType.includes('oil');
            if (serviceType === 'tireRotation') return recordType.includes('tire') || recordType.includes('rotation');
            if (serviceType === 'brakeInspection') return recordType.includes('brake') && !recordType.includes('fluid');
            if (serviceType === 'airFilter') return recordType.includes('filter') && (recordType.includes('engine') || recordType.includes('air'));
            if (serviceType === 'cabinFilter') return recordType.includes('filter') && recordType.includes('cabin');
            if (serviceType === 'sparkPlugs') return recordType.includes('spark');
            if (serviceType === 'transmission') return recordType.includes('transmission');
            if (serviceType === 'coolant') return recordType.includes('coolant');
            if (serviceType === 'brakeFluid') return recordType.includes('brake') && recordType.includes('fluid');
            return false;
          });
          
          // If there's a recent matching record with mileage >= nextServiceMileage, don't show as past due
          const recentRecordClearsAlert = matchingRecords.some(r => {
            const recordMileage = r.mileage ? parseInt(r.mileage) : null;
            return recordMileage !== null && !isNaN(recordMileage) && recordMileage >= roundedNextService;
          });
          
          // Service is past due if current mileage >= next service mileage AND no recent record cleared it
          // Only show if overdue by at least 1 mile to avoid showing "0 miles overdue" or tiny amounts
          if (currentMileage >= roundedNextService && roundedOverdue >= 1 && !recentRecordClearsAlert) {
            item = {
              vehicleId: vehicle.id,
              vehicle: vehicle,
              serviceType: serviceType,
              serviceLabel: getServiceLabel(serviceType),
              status: 'overdue',
              message: `Overdue by ${formatDistance(roundedOverdue, 0)}`,
              interval: interval,
              nextServiceMileage: roundedNextService,
              currentMileage: currentMileage,
              milesOverdue: roundedOverdue,
              daysOverdue: Math.floor((new Date() - lastServiceDate) / (1000 * 60 * 60 * 24))
            };
          }
        }

        if (item) {
          overdue.push(item);
          // Count alerts per vehicle
          if (!alertsByVehicle[vehicle.id]) {
            alertsByVehicle[vehicle.id] = {
              vehicle: vehicle,
              count: 0,
              items: []
            };
          }
          alertsByVehicle[vehicle.id].count++;
          alertsByVehicle[vehicle.id].items.push(item);
        }
      });
    });

    // Sort by miles overdue (most overdue first)
    overdue.sort((a, b) => {
      if (a.status === 'never' && b.status !== 'never') return -1;
      if (a.status !== 'never' && b.status === 'never') return 1;
      return b.milesOverdue - a.milesOverdue;
    });

    setPastDueItems(overdue);
    setVehicleAlerts(alertsByVehicle);
  };

  const getServiceLabel = (serviceType) => {
    const labels = {
      oilChange: 'Oil Change',
      tireRotation: 'Tire Rotation',
      brakeInspection: 'Brake Inspection',
      airFilter: 'Engine Air Filter',
      cabinFilter: 'Cabin Air Filter',
      sparkPlugs: 'Spark Plugs',
      transmission: 'Transmission Service',
      coolant: 'Coolant Flush',
      brakeFluid: 'Brake Fluid Change'
    };
    return labels[serviceType] || serviceType;
  };

  const getLastServiceMileage = (vehicle, serviceType, lastServiceDate) => {
    const records = vehicle.maintenanceRecords || [];
    const serviceRecords = records.filter(r => {
      if (!r.type) return false;
      const recordType = r.type.toLowerCase();
      if (serviceType === 'oilChange') return recordType.includes('oil');
      if (serviceType === 'tireRotation') return recordType.includes('tire') || recordType.includes('rotation');
      if (serviceType === 'brakeInspection') return recordType.includes('brake') && !recordType.includes('fluid');
      if (serviceType === 'airFilter') return recordType.includes('filter') && (recordType.includes('engine') || recordType.includes('air'));
      if (serviceType === 'cabinFilter') return recordType.includes('filter') && recordType.includes('cabin');
      if (serviceType === 'sparkPlugs') return recordType.includes('spark');
      if (serviceType === 'transmission') return recordType.includes('transmission');
      if (serviceType === 'coolant') return recordType.includes('coolant');
      if (serviceType === 'brakeFluid') return recordType.includes('brake') && recordType.includes('fluid');
      return false;
    });

    if (serviceRecords.length > 0) {
      // Sort by date descending to get the most recent record first
      const sortedRecords = serviceRecords.sort((a, b) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        return dateB - dateA; // Most recent first
      });
      
      // Use the most recent matching record's mileage if it exists
      const mostRecentRecord = sortedRecords[0];
      if (mostRecentRecord.mileage !== null && mostRecentRecord.mileage !== undefined && mostRecentRecord.mileage !== '') {
        const mileage = parseInt(mostRecentRecord.mileage);
        if (!isNaN(mileage)) {
          return mileage;
        }
      }
      
      // If most recent doesn't have mileage, look for any record with mileage
      for (const record of sortedRecords) {
        if (record.mileage !== null && record.mileage !== undefined && record.mileage !== '') {
          const mileage = parseInt(record.mileage);
          if (!isNaN(mileage)) {
            return mileage;
          }
        }
      }
    }

    // If no records with mileage found, return null to indicate we can't determine it
    // This will cause the calculation to use a more conservative approach
    return null;
  };

  const handleAddMaintenance = (alertItem) => {
    setSelectedVehicle(alertItem.vehicle);
    const maintenanceType = getMaintenanceTypeFromServiceType(alertItem.serviceType);
    // Pre-populate with service type and due mileage
    setEditingMaintenance({
      type: maintenanceType,
      date: new Date().toISOString().split('T')[0],
      mileage: alertItem.nextServiceMileage ? alertItem.nextServiceMileage.toString() : ''
    });
    setShowMaintenanceForm(true);
  };

  const handleViewVehicle = (vehicle) => {
    // Navigate to Vehicles tab first, then to VehicleDetail
    navigation.navigate('Vehicles', {
      screen: 'VehicleDetail',
      params: { vehicleId: vehicle.id }
    });
  };

  const toggleVehicleExpand = (vehicleId) => {
    setExpandedVehicles(prev => ({
      ...prev,
      [vehicleId]: !prev[vehicleId]
    }));
  };

  const handleIgnoreReminder = (vehicle, serviceType) => {
    const updatedIgnored = {
      ...(vehicle.ignoredReminders || {}),
      [serviceType]: new Date().toISOString()
    };
    updateVehicle(vehicle.id, { ...vehicle, ignoredReminders: updatedIgnored });
    Alert.alert('Reminder Ignored', 'This reminder has been ignored for this vehicle.');
  };

  const getMaintenanceTypeFromServiceType = (serviceType) => {
    const mapping = {
      oilChange: 'Oil Change',
      tireRotation: 'Tire Rotation',
      brakeInspection: 'Brake Service',
      airFilter: 'Engine Air Filter',
      cabinFilter: 'Cabin Air Filter',
      sparkPlugs: 'Spark Plugs',
      transmission: 'Transmission Service',
      coolant: 'Coolant Flush',
      brakeFluid: 'Brake Fluid Change'
    };
    return mapping[serviceType] || 'Maintenance';
  };

  const handleBulkClearHistorical = () => {
    Alert.alert(
      'Mark All Prior Tasks as Complete',
      'This will log each overdue service as done at your current mileage (historical / full tune-up). Red dots will clear and next service will be based on your odometer. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark All Complete',
          onPress: () => {
            const byVehicle = {};
            pastDueItems.forEach(item => {
              if (!byVehicle[item.vehicleId]) byVehicle[item.vehicleId] = new Set();
              byVehicle[item.vehicleId].add(item.serviceType);
            });
            const today = new Date().toISOString().split('T')[0];
            Object.keys(byVehicle).forEach(vehicleId => {
              const vehicle = vehicles.find(v => v.id === vehicleId);
              if (!vehicle) return;
              const currentMileage = parseInt(vehicle.mileage) || 0;
              const existingRecords = vehicle.maintenanceRecords || [];
              const serviceTypes = Array.from(byVehicle[vehicleId]);
              const newRecords = serviceTypes.map(serviceType => ({
                id: `historical-${Date.now()}-${vehicleId}-${serviceType}`,
                date: today,
                mileage: currentMileage,
                type: getMaintenanceTypeFromServiceType(serviceType),
                notes: 'Historical - full tune-up'
              }));
              updateVehicle(vehicleId, {
                maintenanceRecords: [...existingRecords, ...newRecords]
              });
            });
            calculatePastDueItems();
          }
        }
      ]
    );
  };

  const renderAlertItem = (alertItem, index) => (
    <View key={`${alertItem.vehicleId}-${alertItem.serviceType}-${index}`} style={styles.alertItem}>
      <View style={styles.alertHeader}>
        <Ionicons name="warning" size={20} color="#ff6b6b" />
        <Text style={styles.alertServiceLabel}>{alertItem.serviceLabel}</Text>
      </View>
      <Text style={styles.alertMessage}>{alertItem.message}</Text>
      <View style={styles.alertDetails}>
        <View style={styles.alertDetailRow}>
          <Text style={styles.alertDetailLabel}>Status:</Text>
          <Text style={[styles.alertDetailValue, styles.alertDetailValueOverdue]}>
            {alertItem.status === 'never' ? 'Never Performed' : 'Overdue'}
          </Text>
        </View>
        <View style={styles.alertDetailRow}>
          <Text style={styles.alertDetailLabel}>Due at:</Text>
          <Text style={styles.alertDetailValue}>
            {formatDistanceWithSeparators(alertItem.nextServiceMileage)}
          </Text>
        </View>
        <View style={styles.alertDetailRow}>
          <Text style={styles.alertDetailLabel}>Current:</Text>
          <Text style={styles.alertDetailValue}>
            {formatDistanceWithSeparators(alertItem.currentMileage)}
          </Text>
        </View>
        <View style={styles.alertDetailRow}>
          <Text style={styles.alertDetailLabel}>Interval:</Text>
          <Text style={styles.alertDetailValue}>
            Every {formatDistanceWithSeparators(alertItem.interval)}
          </Text>
        </View>
        {alertItem.daysOverdue && (
          <View style={styles.alertDetailRow}>
            <Text style={styles.alertDetailLabel}>Days Overdue:</Text>
            <Text style={styles.alertDetailValue}>
              {alertItem.daysOverdue} {alertItem.daysOverdue === 1 ? 'day' : 'days'}
            </Text>
          </View>
        )}
        {alertItem.serviceType === 'oilChange' && (() => {
          const inventoryStatus = checkOilInventory(alertItem.vehicle, inventory);
          return (
            <View style={[styles.inventoryCheck, inventoryStatus.hasEnough ? styles.inventoryCheckGood : styles.inventoryCheckBad]}>
              <Ionicons name="cube" size={16} color={inventoryStatus.hasEnough ? "#90ee90" : "#ffb0b0"} />
              <Text style={[styles.inventoryCheckText, inventoryStatus.hasEnough ? styles.inventoryCheckTextGood : styles.inventoryCheckTextBad]}>
                {inventoryStatus.message}
              </Text>
            </View>
          );
        })()}
      </View>
      <View style={styles.alertActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAddMaintenance(alertItem)}
        >
          <Ionicons name="construct" size={18} color="#0066cc" />
          <Text style={styles.actionButtonText}>Add Service</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={() => handleViewVehicle(alertItem.vehicle)}
        >
          <Text style={styles.actionButtonTextSecondary}>View Vehicle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButtonIcon}
          onPress={() => handleIgnoreReminder(alertItem.vehicle, alertItem.serviceType)}
        >
          <Ionicons name="close" size={20} color="#b0b0b0" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const totalAlerts = pastDueItems.length;
  const vehiclesWithAlerts = Object.keys(vehicleAlerts);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Large Total Alerts Display - Motivational */}
        <View style={styles.totalAlertsContainer}>
          <Text style={styles.totalAlertsNumber}>{totalAlerts}</Text>
          <Text style={styles.totalAlertsLabel}>
            {totalAlerts === 1 ? 'Service' : 'Services'} Require Attention
          </Text>
          {totalAlerts > 0 && (
            <Text style={styles.totalAlertsSubtext}>
              Across {vehiclesWithAlerts.length} {vehiclesWithAlerts.length === 1 ? 'vehicle' : 'vehicles'}
            </Text>
          )}
        </View>

        {totalAlerts > 0 && (
          <View style={styles.bulkClearBanner}>
            <Text style={styles.bulkClearTitle}>
              Looks like we found some historical intervals. Did you just perform a &quot;Full Tune-Up&quot;?
            </Text>
            <TouchableOpacity style={styles.bulkClearButton} onPress={handleBulkClearHistorical}>
              <Ionicons name="construct" size={20} color="#fff" />
              <Text style={styles.bulkClearButtonText}>Mark All Prior Tasks as Complete</Text>
            </TouchableOpacity>
          </View>
        )}

        {totalAlerts === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={64} color="#4ade80" />
            <Text style={styles.emptyStateTitle}>All Caught Up!</Text>
            <Text style={styles.emptyStateText}>
              Great news! All your vehicles are up to date on maintenance.
            </Text>
          </View>
        ) : (
          <View style={styles.alertsList}>
            {Object.keys(vehicleAlerts).map((vehicleId) => {
              const vehicleAlert = vehicleAlerts[vehicleId];
              if (!vehicleAlert) return null;

              const isExpanded = expandedVehicles[vehicleId];

              return (
                <View key={vehicleId} style={styles.vehicleGroup}>
                  <TouchableOpacity
                    style={styles.vehicleHeader}
                    onPress={() => toggleVehicleExpand(vehicleId)}
                  >
                    <View style={styles.vehicleHeaderContent}>
                      <View style={styles.vehicleHeaderInfo}>
                        <View>
                          <Text style={styles.vehicleName}>
                            {vehicleAlert.vehicle.year} {vehicleAlert.vehicle.make} {vehicleAlert.vehicle.model}
                          </Text>
                          <Text style={styles.vehicleAlertCount}>
                            {vehicleAlert.count} {vehicleAlert.count === 1 ? 'alert' : 'alerts'}
                          </Text>
                        </View>
                        <View style={styles.alertSummary}>
                          {vehicleAlert.items.slice(0, 2).map((item, idx) => (
                            <Text key={idx} style={styles.alertSummaryItem}>
                              {item.serviceLabel}
                            </Text>
                          ))}
                          {vehicleAlert.count > 2 && (
                            <Text style={styles.alertSummaryMore}>
                              +{vehicleAlert.count - 2} more
                            </Text>
                          )}
                        </View>
                      </View>
                      <Ionicons 
                        name={isExpanded ? "chevron-up" : "chevron-down"} 
                        size={24} 
                        color="#b0b0b0" 
                      />
                    </View>
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      {vehicleAlert.items.map((alertItem, index) => 
                        renderAlertItem(alertItem, index)
                      )}
                      <TouchableOpacity
                        style={styles.viewVehicleButton}
                        onPress={() => handleViewVehicle(vehicleAlert.vehicle)}
                      >
                        <Ionicons name="car" size={18} color="#0066cc" />
                        <Text style={styles.viewVehicleButtonText}>View Full Vehicle Details</Text>
                        <Ionicons name="chevron-forward" size={18} color="#0066cc" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  totalAlertsContainer: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  totalAlertsNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 8,
  },
  totalAlertsLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  totalAlertsSubtext: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  bulkClearBanner: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  bulkClearTitle: {
    fontSize: 15,
    color: '#e0e0e0',
    marginBottom: 12,
    lineHeight: 22,
  },
  bulkClearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  bulkClearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  alertsList: {
    gap: 16,
  },
  vehicleGroup: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  vehicleHeader: {
    backgroundColor: '#3d3d3d',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4d4d4d',
  },
  vehicleHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleHeaderInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  vehicleAlertCount: {
    fontSize: 14,
    color: '#ff6b6b',
    fontWeight: '500',
    marginBottom: 8,
  },
  alertSummary: {
    marginTop: 8,
  },
  alertSummaryItem: {
    fontSize: 13,
    color: '#b0b0b0',
    marginBottom: 4,
  },
  alertSummaryMore: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  expandedContent: {
    paddingTop: 8,
  },
  viewVehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a3a5c',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    marginTop: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#0066cc',
  },
  viewVehicleButtonText: {
    color: '#0066cc',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  alertItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  alertServiceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  alertMessage: {
    fontSize: 14,
    color: '#ffb0b0',
    marginBottom: 12,
  },
  alertDetails: {
    gap: 8,
    marginBottom: 12,
  },
  alertDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertDetailLabel: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  alertDetailValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  alertDetailValueOverdue: {
    color: '#ff6b6b',
    fontWeight: '600',
  },
  inventoryCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  inventoryCheckGood: {
    backgroundColor: '#1a4d1a',
    borderWidth: 1,
    borderColor: '#4dff4d',
  },
  inventoryCheckBad: {
    backgroundColor: '#4d1a1a',
    borderWidth: 1,
    borderColor: '#ff6666',
  },
  inventoryCheckText: {
    fontSize: 14,
    flex: 1,
  },
  inventoryCheckTextGood: {
    color: '#b0ffb0',
  },
  inventoryCheckTextBad: {
    color: '#ffb0b0',
  },
  alertActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    flex: 1,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  actionButtonTextSecondary: {
    color: '#b0b0b0',
    fontSize: 14,
  },
  actionButtonIcon: {
    padding: 8,
  },
});
