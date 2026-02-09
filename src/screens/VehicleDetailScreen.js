import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../utils/storage';
import { formatDistanceWithSeparators, formatDistance, formatTorqueString, formatCapacityString, getUnitSystem } from '../utils/unitConverter';
import ServiceAlerts from '../components/ServiceAlerts';
import MaintenanceRecord from '../components/MaintenanceRecord';
import { exportMaintenanceToCSV, exportMaintenanceToPDF } from '../utils/exportMaintenance';
import { fetchRecalls, formatRecall, getRecallSummaryMessage } from '../utils/recalls';
import { Linking } from 'react-native';
import { calculateOilLife } from '../utils/oilLife';
import MileageUpdateModal from '../components/MileageUpdateModal';
import { addMileageEntry } from '../utils/mileageTracking';

// Styles must be defined before components that use them
const vehicleDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    padding: 16,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    minWidth: 0,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
    minWidth: 60,
    paddingRight: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flexShrink: 0,
    minWidth: 40,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0,
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3d3d3d',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    flexShrink: 0,
    minWidth: 60,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 0,
    minWidth: 35,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  deleteButton: {
    backgroundColor: '#cc0000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  featuredImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  noImagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066cc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  imageUploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noImageText: {
    color: '#666',
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  mileageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a3a5c',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 16,
  },
  mileageContent: {
    flex: 1,
  },
  mileageLabel: {
    fontSize: 12,
    color: '#b0b0b0',
    marginBottom: 4,
  },
  mileageValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0066cc',
  },
  oilLifeSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#1a3a5c',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2d5a8a',
  },
  oilLifeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 12,
  },
  oilLifeContent: {
    flex: 1,
  },
  oilLifeLabel: {
    fontSize: 12,
    color: '#b0b0b0',
    marginBottom: 4,
  },
  oilLifeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  oilLifePercentage: {
    fontSize: 32,
    fontWeight: '700',
  },
  oilLifeStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  oilLifeMiles: {
    fontSize: 14,
    color: '#b0b0b0',
    marginTop: 4,
  },
  oilLifeBarContainer: {
    marginTop: 8,
  },
  oilLifeBarBackground: {
    height: 12,
    backgroundColor: '#2d2d2d',
    borderRadius: 6,
    overflow: 'hidden',
  },
  oilLifeBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  metaSection: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#4d4d4d',
  },
  metaLabel: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  metaValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  metaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  nicknameBadge: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  nicknameBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  buildSheetContainer: {
    marginTop: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4d4d4d',
    overflow: 'hidden',
  },
  buildSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  buildSheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buildSheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066cc',
  },
  buildSheetContent: {
    padding: 12,
    paddingTop: 0,
    gap: 12,
  },
  buildSheetItem: {
    backgroundColor: '#2d2d2d',
    borderRadius: 6,
    padding: 10,
  },
  buildSheetLabel: {
    fontSize: 12,
    color: '#0066cc',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  buildSheetValue: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 20,
  },
  notesSection: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  notesText: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 20,
  },
  maintenanceSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  text: {
    fontSize: 16,
    color: '#ffffff',
  },
  specSection: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  intervalsList: {
    gap: 12,
    marginTop: 12,
  },
  intervalItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  intervalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  intervalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  overdueBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  overdueBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  intervalDetails: {
    gap: 6,
  },
  intervalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  intervalDetailLabel: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  intervalDetailValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  overdueText: {
    color: '#ff6b6b',
    fontWeight: '600',
  },
  fluidsList: {
    gap: 12,
    marginTop: 12,
  },
  fluidItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  fluidLabel: {
    fontSize: 14,
    color: '#b0b0b0',
    flex: 1,
  },
  fluidValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  torqueCategory: {
    marginBottom: 20,
  },
  torqueCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  torqueList: {
    gap: 10,
  },
  torqueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  torqueLabel: {
    fontSize: 14,
    color: '#b0b0b0',
    flex: 1,
  },
  torqueValue: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '600',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    gap: 6,
  },
  expandButtonText: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '600',
  },
  recallsSection: {
    marginBottom: 16,
  },
  recallsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  recallsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
    minWidth: 0,
  },
  recallsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flexShrink: 1,
    minWidth: 0,
  },
  recallsCount: {
    fontSize: 12,
    color: '#909090',
    marginLeft: 4,
    flexShrink: 0,
  },
  recallsLoading: {
    padding: 16,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  recallsLoadingText: {
    color: '#b0b0b0',
    fontSize: 14,
    textAlign: 'center',
  },
  recallsContainer: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4d4d4d',
    padding: 16,
  },
  recallsWarning: {
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#ff8800',
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
  },
  recallsWarningText: {
    color: '#ffaa44',
    fontSize: 14,
    lineHeight: 20,
  },
  recallsLink: {
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 8,
  },
  recallsLinkText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  recallsList: {
    marginTop: 8,
  },
  recallItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4d4d4d',
  },
  recallItemCompleted: {
    opacity: 0.6,
    backgroundColor: 'rgba(0, 170, 0, 0.05)',
  },
  recallItemHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  recallItemContent: {
    flex: 1,
  },
  recallItemTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  recallItemTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#909090',
  },
  recallItemComponent: {
    color: '#ff8800',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  recallItemComponentCompleted: {
    color: '#909090',
    opacity: 0.8,
  },
  recallItemSummary: {
    color: '#b0b0b0',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  recallItemSummaryCompleted: {
    color: '#909090',
    opacity: 0.7,
  },
  recallItemDate: {
    color: '#909090',
    fontSize: 11,
    marginTop: 4,
  },
  recallItemDateCompleted: {
    color: '#909090',
    opacity: 0.6,
  },
  recallCompletedLabel: {
    color: '#00aa00',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  recallsNoRecalls: {
    padding: 16,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  recallsNoRecallsText: {
    color: '#b0b0b0',
    fontSize: 14,
    textAlign: 'center',
  },
  recallsCollapsedSummary: {
    padding: 12,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  recallsCollapsedText: {
    color: '#b0b0b0',
    fontSize: 14,
    textAlign: 'center',
  },
  recallsInfoBox: {
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
  },
  recallsInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  recallsInfoText: {
    color: '#b0b0b0',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#3d3d3d',
  },
  modalButtonConfirm: {
    backgroundColor: '#0066cc',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

// Service Intervals Timeline Component
function ServiceIntervalsSection({ vehicle }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const serviceIntervals = vehicle?.serviceIntervals || {};
  const currentMileage = parseInt(vehicle?.mileage) || 0;
  const estimates = vehicle?.estimatedLastService || {};
  const maintenanceRecords = vehicle?.maintenanceRecords || [];

  // Calculate next service mileages
  const getNextServiceMileage = (serviceType, interval) => {
    if (!interval) return null;

    // "Current on Maintenance" = all factory intervals done up to current mileage; next starts from odometer
    if (vehicle?.maintenanceHistoryStatus === 'current') {
      return currentMileage + interval;
    }
    
    const lastService = estimates[serviceType];
    
    if (lastService === 'never') {
      return interval;
    }
    
    if (!lastService) {
      return currentMileage + interval;
    }
    
    const lastServiceDate = new Date(lastService);
    const serviceTypeMap = {
      'oilChange': 'Oil Change',
      'tireRotation': 'Tire Rotation',
      'brakeInspection': 'Brake Service',
      'airFilter': 'Filter Replacement',
      'cabinFilter': 'Cabin Air Filter',
      'sparkPlugs': 'Spark Plugs',
      'transmission': 'Transmission Service',
      'coolant': 'Coolant Flush',
      'brakeFluid': 'Brake Fluid Change'
    };
    
    const maintenanceType = serviceTypeMap[serviceType];
    const serviceRecords = maintenanceRecords.filter(r => {
      if (!r.type) return false;
      const recordType = r.type.toLowerCase();
      if (serviceType === 'airFilter' || serviceType === 'cabinFilter') {
        return recordType.includes('filter');
      }
      if (serviceType === 'coolant' || serviceType === 'brakeFluid') {
        return recordType.includes(serviceType.toLowerCase().replace('fluid', '')) && recordType.includes('fluid');
      }
      return recordType.includes(maintenanceType?.toLowerCase().split(' ')[0]);
    });

    if (serviceRecords.length > 0) {
      const sortedRecords = serviceRecords.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const diffA = Math.abs(dateA - lastServiceDate);
        const diffB = Math.abs(dateB - lastServiceDate);
        return diffA - diffB;
      });
      
      if (sortedRecords[0].mileage) {
        const lastServiceMileage = parseInt(sortedRecords[0].mileage);
        return lastServiceMileage + interval;
      }
    }

    const daysSince = (new Date() - lastServiceDate) / (1000 * 60 * 60 * 24);
    const createdAt = vehicle?.createdAt ? new Date(vehicle.createdAt) : new Date();
    const daysSinceCreation = (new Date() - createdAt) / (1000 * 60 * 60 * 24);
    const estimatedMilesPerDay = daysSinceCreation > 0 ? currentMileage / daysSinceCreation : 0;
    const lastServiceMileage = Math.max(0, currentMileage - (estimatedMilesPerDay * daysSince));
    return lastServiceMileage + interval;
  };

  const intervalLabels = {
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

  const intervalsList = Object.keys(serviceIntervals)
    .filter(key => serviceIntervals[key])
    .map(key => ({
      type: key,
      label: intervalLabels[key] || key,
      interval: parseInt(serviceIntervals[key]),
      nextService: getNextServiceMileage(key, parseInt(serviceIntervals[key]))
    }))
    .sort((a, b) => (a.nextService || 0) - (b.nextService || 0));

  if (intervalsList.length === 0) {
    return null;
  }

  const displayList = isExpanded ? intervalsList : intervalsList.slice(0, 2);
  const hasMore = intervalsList.length > 2;

  return (
    <View style={vehicleDetailStyles.specSection}>
      <TouchableOpacity 
        style={vehicleDetailStyles.sectionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={vehicleDetailStyles.sectionTitleRow}>
          <Ionicons name="calendar" size={20} color="#0066cc" />
          <Text style={vehicleDetailStyles.sectionTitle}>Service Intervals Timeline</Text>
        </View>
        {hasMore && (
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#b0b0b0" 
          />
        )}
      </TouchableOpacity>
      <View style={vehicleDetailStyles.intervalsList}>
        {displayList.map((item) => {
          const isOverdue = item.nextService && currentMileage >= item.nextService;
          return (
            <View key={item.type} style={vehicleDetailStyles.intervalItem}>
              <View style={vehicleDetailStyles.intervalHeader}>
                <Text style={vehicleDetailStyles.intervalLabel}>{item.label}</Text>
                {isOverdue && (
                  <View style={vehicleDetailStyles.overdueBadge}>
                    <Text style={vehicleDetailStyles.overdueBadgeText}>Overdue</Text>
                  </View>
                )}
              </View>
              <View style={vehicleDetailStyles.intervalDetails}>
                <View style={vehicleDetailStyles.intervalDetailRow}>
                  <Text style={vehicleDetailStyles.intervalDetailLabel}>Interval:</Text>
                  <Text style={vehicleDetailStyles.intervalDetailValue}>
                    Every {formatDistanceWithSeparators(item.interval)}
                  </Text>
                </View>
                {item.nextService && (
                  <View style={vehicleDetailStyles.intervalDetailRow}>
                    <Text style={vehicleDetailStyles.intervalDetailLabel}>Next Service:</Text>
                    <Text style={[vehicleDetailStyles.intervalDetailValue, isOverdue && vehicleDetailStyles.overdueText]}>
                      {formatDistanceWithSeparators(item.nextService)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
      {hasMore && !isExpanded && (
        <TouchableOpacity 
          style={vehicleDetailStyles.expandButton}
          onPress={() => setIsExpanded(true)}
        >
          <Text style={vehicleDetailStyles.expandButtonText}>
            Show {intervalsList.length - 2} more
          </Text>
          <Ionicons name="chevron-down" size={16} color="#0066cc" />
        </TouchableOpacity>
      )}
    </View>
  );
}

// Recommended Fluids Component
function RecommendedFluidsSection({ vehicle }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fluids = vehicle?.recommendedFluids || {};

  const fluidLabels = {
    engineOil: 'Engine Oil',
    engineOilCapacity: 'Engine Oil Capacity',
    transmissionFluid: 'Transmission Fluid',
    coolant: 'Coolant',
    brakeFluid: 'Brake Fluid',
    powerSteering: 'Power Steering Fluid',
    differential: 'Differential Fluid'
  };

  const fluidsList = Object.keys(fluids)
    .filter(key => fluids[key])
    .map(key => ({
      key,
      label: fluidLabels[key] || key,
      value: fluids[key]
    }));

  if (fluidsList.length === 0) {
    return null;
  }

  const displayList = isExpanded ? fluidsList : fluidsList.slice(0, 3);
  const hasMore = fluidsList.length > 3;

  return (
    <View style={vehicleDetailStyles.specSection}>
      <TouchableOpacity 
        style={vehicleDetailStyles.sectionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={vehicleDetailStyles.sectionTitleRow}>
          <Ionicons name="water" size={20} color="#0066cc" />
          <Text style={vehicleDetailStyles.sectionTitle}>Recommended Fluids</Text>
        </View>
        {hasMore && (
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#b0b0b0" 
          />
        )}
      </TouchableOpacity>
      <View style={vehicleDetailStyles.fluidsList}>
        {displayList.map((fluid) => (
          <View key={fluid.key} style={vehicleDetailStyles.fluidItem}>
            <Text style={vehicleDetailStyles.fluidLabel}>{fluid.label}</Text>
            <Text style={vehicleDetailStyles.fluidValue}>
              {fluid.key === 'engineOilCapacity' 
                ? formatCapacityString(fluid.value)
                : fluid.value}
            </Text>
          </View>
        ))}
      </View>
      {hasMore && !isExpanded && (
        <TouchableOpacity 
          style={vehicleDetailStyles.expandButton}
          onPress={() => setIsExpanded(true)}
        >
          <Text style={vehicleDetailStyles.expandButtonText}>
            Show {fluidsList.length - 3} more
          </Text>
          <Ionicons name="chevron-down" size={16} color="#0066cc" />
        </TouchableOpacity>
      )}
    </View>
  );
}

// Tires & Wheels Component
function TiresWheelsSection({ vehicle }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const tires = vehicle?.tires || {};

  const tireSpecs = [
    { key: 'tireSizeFront', label: 'Tire Size (Front)' },
    { key: 'tireSizeRear', label: 'Tire Size (Rear)' },
    { key: 'tirePressureFront', label: 'Tire Pressure (Front)' },
    { key: 'tirePressureRear', label: 'Tire Pressure (Rear)' },
    { key: 'wheelBoltPattern', label: 'Wheel Bolt Pattern' },
    { key: 'lugNutTorque', label: 'Lug Nut Torque' },
  ];

  const tireList = tireSpecs
    .filter(spec => tires[spec.key])
    .map(spec => ({
      key: spec.key,
      label: spec.label,
      value: tires[spec.key]
    }));

  if (tireList.length === 0) {
    return null;
  }

  const displayList = isExpanded ? tireList : tireList.slice(0, 3);
  const hasMore = tireList.length > 3;

  return (
    <View style={vehicleDetailStyles.specSection}>
      <TouchableOpacity 
        style={vehicleDetailStyles.sectionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={vehicleDetailStyles.sectionTitleRow}>
          <Ionicons name="disc" size={20} color="#0066cc" />
          <Text style={vehicleDetailStyles.sectionTitle}>Tires & Wheels</Text>
        </View>
        {hasMore && (
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#b0b0b0" 
          />
        )}
      </TouchableOpacity>
      <View style={vehicleDetailStyles.fluidsList}>
        {displayList.map((spec) => (
          <View key={spec.key} style={vehicleDetailStyles.fluidItem}>
            <Text style={vehicleDetailStyles.fluidLabel}>{spec.label}</Text>
            <Text style={vehicleDetailStyles.fluidValue}>{spec.value}</Text>
          </View>
        ))}
      </View>
      {hasMore && !isExpanded && (
        <TouchableOpacity 
          style={vehicleDetailStyles.expandButton}
          onPress={() => setIsExpanded(true)}
        >
          <Text style={vehicleDetailStyles.expandButtonText}>
            Show {tireList.length - 3} more
          </Text>
          <Ionicons name="chevron-down" size={16} color="#0066cc" />
        </TouchableOpacity>
      )}
    </View>
  );
}

// Hardware Component
function HardwareSection({ vehicle }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hardware = vehicle?.hardware || {};

  const hardwareSpecs = [
    { key: 'batteryGroupSize', label: 'Battery Group Size' },
    { key: 'wiperBladeDriver', label: 'Wiper Blade (Driver)' },
    { key: 'wiperBladePassenger', label: 'Wiper Blade (Passenger)' },
    { key: 'wiperBladeRear', label: 'Wiper Blade (Rear)' },
  ];

  const hardwareList = hardwareSpecs
    .filter(spec => hardware[spec.key])
    .map(spec => ({
      key: spec.key,
      label: spec.label,
      value: hardware[spec.key]
    }));

  if (hardwareList.length === 0) {
    return null;
  }

  const displayList = isExpanded ? hardwareList : hardwareList.slice(0, 2);
  const hasMore = hardwareList.length > 2;

  return (
    <View style={vehicleDetailStyles.specSection}>
      <TouchableOpacity 
        style={vehicleDetailStyles.sectionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={vehicleDetailStyles.sectionTitleRow}>
          <Ionicons name="settings" size={20} color="#0066cc" />
          <Text style={vehicleDetailStyles.sectionTitle}>Hardware</Text>
        </View>
        {hasMore && (
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#b0b0b0" 
          />
        )}
      </TouchableOpacity>
      <View style={vehicleDetailStyles.fluidsList}>
        {displayList.map((spec) => (
          <View key={spec.key} style={vehicleDetailStyles.fluidItem}>
            <Text style={vehicleDetailStyles.fluidLabel}>{spec.label}</Text>
            <Text style={vehicleDetailStyles.fluidValue}>{spec.value}</Text>
          </View>
        ))}
      </View>
      {hasMore && !isExpanded && (
        <TouchableOpacity 
          style={vehicleDetailStyles.expandButton}
          onPress={() => setIsExpanded(true)}
        >
          <Text style={vehicleDetailStyles.expandButtonText}>
            Show {hardwareList.length - 2} more
          </Text>
          <Ionicons name="chevron-down" size={16} color="#0066cc" />
        </TouchableOpacity>
      )}
    </View>
  );
}

// Lighting Component
function LightingSection({ vehicle }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const lighting = vehicle?.lighting || {};

  const lightingSpecs = [
    { key: 'headlightLow', label: 'Headlight (Low Beam)' },
    { key: 'headlightHigh', label: 'Headlight (High Beam)' },
    { key: 'fogLight', label: 'Fog Light' },
    { key: 'brakeLight', label: 'Brake Light' },
    { key: 'turnSignal', label: 'Turn Signal' },
    { key: 'interiorLight', label: 'Interior Light' },
    { key: 'trunkLight', label: 'Trunk Light' },
  ];

  const lightingList = lightingSpecs
    .filter(spec => lighting[spec.key])
    .map(spec => ({
      key: spec.key,
      label: spec.label,
      value: lighting[spec.key]
    }));

  if (lightingList.length === 0) {
    return null;
  }

  const displayList = isExpanded ? lightingList : lightingList.slice(0, 3);
  const hasMore = lightingList.length > 3;

  return (
    <View style={vehicleDetailStyles.specSection}>
      <TouchableOpacity 
        style={vehicleDetailStyles.sectionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={vehicleDetailStyles.sectionTitleRow}>
          <Ionicons name="bulb" size={20} color="#0066cc" />
          <Text style={vehicleDetailStyles.sectionTitle}>Lighting</Text>
        </View>
        {hasMore && (
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#b0b0b0" 
          />
        )}
      </TouchableOpacity>
      <View style={vehicleDetailStyles.fluidsList}>
        {displayList.map((spec) => (
          <View key={spec.key} style={vehicleDetailStyles.fluidItem}>
            <Text style={vehicleDetailStyles.fluidLabel}>{spec.label}</Text>
            <Text style={vehicleDetailStyles.fluidValue}>{spec.value}</Text>
          </View>
        ))}
      </View>
      {hasMore && !isExpanded && (
        <TouchableOpacity 
          style={vehicleDetailStyles.expandButton}
          onPress={() => setIsExpanded(true)}
        >
          <Text style={vehicleDetailStyles.expandButtonText}>
            Show {lightingList.length - 3} more
          </Text>
          <Ionicons name="chevron-down" size={16} color="#0066cc" />
        </TouchableOpacity>
      )}
    </View>
  );
}

// Parts SKUs Component
function PartsSKUsSection({ vehicle }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const partsSKUs = vehicle?.partsSKUs || {};

  const partLabels = {
    brakePads: 'Brake Pads',
    brakeRotors: 'Brake Rotors',
    wheelHubs: 'Wheel Hubs',
    wheelBearings: 'Wheel Bearings',
    airFilter: 'Air Filter',
    cabinFilter: 'Cabin Filter',
    oilFilter: 'Oil Filter',
    fuelFilter: 'Fuel Filter',
    transmissionFilter: 'Transmission Filter',
  };

  const partsList = Object.keys(partsSKUs)
    .filter(key => partsSKUs[key])
    .map(key => ({
      key,
      label: partLabels[key] || key,
      value: partsSKUs[key]
    }));

  if (partsList.length === 0) {
    return null;
  }

  const displayList = isExpanded ? partsList : partsList.slice(0, 3);
  const hasMore = partsList.length > 3;

  return (
    <View style={vehicleDetailStyles.specSection}>
      <TouchableOpacity 
        style={vehicleDetailStyles.sectionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={vehicleDetailStyles.sectionTitleRow}>
          <Ionicons name="list" size={20} color="#0066cc" />
          <Text style={vehicleDetailStyles.sectionTitle}>Parts SKUs</Text>
        </View>
        {hasMore && (
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#b0b0b0" 
          />
        )}
      </TouchableOpacity>
      <View style={vehicleDetailStyles.fluidsList}>
        {displayList.map((part) => (
          <View key={part.key} style={vehicleDetailStyles.fluidItem}>
            <Text style={vehicleDetailStyles.fluidLabel}>{part.label}</Text>
            <Text style={[vehicleDetailStyles.fluidValue, { fontFamily: 'monospace', fontSize: 13, color: '#4dff4d' }]}>{part.value}</Text>
          </View>
        ))}
      </View>
      {hasMore && !isExpanded && (
        <TouchableOpacity 
          style={vehicleDetailStyles.expandButton}
          onPress={() => setIsExpanded(true)}
        >
          <Text style={vehicleDetailStyles.expandButtonText}>
            Show {partsList.length - 3} more
          </Text>
          <Ionicons name="chevron-down" size={16} color="#0066cc" />
        </TouchableOpacity>
      )}
    </View>
  );
}

// Torque Values Component
function TorqueValuesSection({ vehicle }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const torqueValues = vehicle?.torqueValues || {};
  const suspension = torqueValues.suspension || {};
  const engine = torqueValues.engine || {};

  const suspensionSpecs = [
    { key: 'wheelLugNuts', label: 'Wheel Lug Nuts' },
    { key: 'strutMountBolts', label: 'Strut Mount Bolts' },
    { key: 'controlArmBolts', label: 'Control Arm Bolts' },
    { key: 'swayBarEndLinks', label: 'Sway Bar End Links' },
    { key: 'ballJointNuts', label: 'Ball Joint Nuts' },
    { key: 'tieRodEnds', label: 'Tie Rod Ends' },
    { key: 'brakeCaliperBolts', label: 'Brake Caliper Bolts' },
    { key: 'brakeRotorBolts', label: 'Brake Rotor Bolts' }
  ];

  const engineSpecs = [
    { key: 'oilDrainPlug', label: 'Oil Drain Plug' },
    { key: 'oilFilter', label: 'Oil Filter' },
    { key: 'sparkPlugs', label: 'Spark Plugs' },
    { key: 'valveCoverBolts', label: 'Valve Cover Bolts' },
    { key: 'intakeManifoldBolts', label: 'Intake Manifold Bolts' },
    { key: 'exhaustManifoldBolts', label: 'Exhaust Manifold Bolts' },
    { key: 'cylinderHeadBolts', label: 'Cylinder Head Bolts' },
    { key: 'camshaftSprocketBolts', label: 'Camshaft Sprocket Bolts' }
  ];

  const hasSuspensionSpecs = suspensionSpecs.some(spec => suspension[spec.key]);
  const hasEngineSpecs = engineSpecs.some(spec => engine[spec.key]);

  if (!hasSuspensionSpecs && !hasEngineSpecs) {
    return null;
  }

  const suspensionList = suspensionSpecs
    .map(spec => ({ ...spec, value: suspension[spec.key] }))
    .filter(spec => spec.value);
  const engineList = engineSpecs
    .map(spec => ({ ...spec, value: engine[spec.key] }))
    .filter(spec => spec.value);
  
  const totalItems = suspensionList.length + engineList.length;
  const showSuspensionPreview = hasSuspensionSpecs && (!isExpanded && suspensionList.length > 2);
  const showEnginePreview = hasEngineSpecs && (!isExpanded && engineList.length > 2);
  const displaySuspension = isExpanded ? suspensionList : suspensionList.slice(0, 2);
  const displayEngine = isExpanded ? engineList : engineList.slice(0, 2);
  const hasMore = totalItems > 4;

  return (
    <View style={vehicleDetailStyles.specSection}>
      <TouchableOpacity 
        style={vehicleDetailStyles.sectionHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={vehicleDetailStyles.sectionTitleRow}>
          <Ionicons name="settings" size={20} color="#0066cc" />
          <Text style={vehicleDetailStyles.sectionTitle}>Torque Specifications</Text>
        </View>
        {hasMore && (
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#b0b0b0" 
          />
        )}
      </TouchableOpacity>
      
      {hasSuspensionSpecs && (
        <View style={vehicleDetailStyles.torqueCategory}>
          <Text style={vehicleDetailStyles.torqueCategoryTitle}>Suspension Components</Text>
          <View style={vehicleDetailStyles.torqueList}>
            {displaySuspension.map((spec) => (
              <View key={spec.key} style={vehicleDetailStyles.torqueItem}>
                <Text style={vehicleDetailStyles.torqueLabel}>{spec.label}</Text>
                <Text style={vehicleDetailStyles.torqueValue}>{formatTorqueString(spec.value)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {hasEngineSpecs && (
        <View style={vehicleDetailStyles.torqueCategory}>
          <Text style={vehicleDetailStyles.torqueCategoryTitle}>Engine Components</Text>
          <View style={vehicleDetailStyles.torqueList}>
            {displayEngine.map((spec) => (
              <View key={spec.key} style={vehicleDetailStyles.torqueItem}>
                <Text style={vehicleDetailStyles.torqueLabel}>{spec.label}</Text>
                <Text style={vehicleDetailStyles.torqueValue}>{formatTorqueString(spec.value)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {hasMore && !isExpanded && (
        <TouchableOpacity 
          style={vehicleDetailStyles.expandButton}
          onPress={() => setIsExpanded(true)}
        >
          <Text style={vehicleDetailStyles.expandButtonText}>
            Show {totalItems - 4} more
          </Text>
          <Ionicons name="chevron-down" size={16} color="#0066cc" />
        </TouchableOpacity>
      )}
    </View>
  );
}

// Vehicle Recalls Component
function VehicleRecallsSection({ vehicle }) {
  const [recalls, setRecalls] = useState([]);
  const [loadingRecalls, setLoadingRecalls] = useState(false);
  const [recallsExpanded, setRecallsExpanded] = useState(false);
  const completedRecalls = vehicle?.completedRecalls || [];

  useEffect(() => {
    if (vehicle?.year && vehicle?.make && vehicle?.model) {
      const fetchVehicleRecalls = async () => {
        setLoadingRecalls(true);
        try {
          const recallsData = await fetchRecalls(vehicle.year, vehicle.make, vehicle.model);
          const formattedRecalls = recallsData.map(recall => formatRecall(recall));
          setRecalls(formattedRecalls);
        } catch (error) {
          console.error('Error fetching recalls:', error);
          setRecalls([]);
        } finally {
          setLoadingRecalls(false);
        }
      };
      fetchVehicleRecalls();
    }
  }, [vehicle?.year, vehicle?.make, vehicle?.model]);

  if (!vehicle?.year || !vehicle?.make || !vehicle?.model) {
    return null;
  }

  const activeRecallsCount = recalls.length - completedRecalls.length;

  return (
    <View style={vehicleDetailStyles.recallsSection}>
      <TouchableOpacity
        style={vehicleDetailStyles.recallsHeader}
        onPress={() => setRecallsExpanded(!recallsExpanded)}
      >
        <View style={vehicleDetailStyles.recallsHeaderLeft}>
          <Ionicons name="warning" size={20} color="#ff8800" />
          <Text style={vehicleDetailStyles.recallsTitle}>Vehicle Recalls</Text>
          {recalls.length > 0 && (
            <Text style={vehicleDetailStyles.recallsCount}>
              ({activeRecallsCount} pending)
            </Text>
          )}
        </View>
        <Ionicons 
          name={recallsExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#b0b0b0" 
        />
      </TouchableOpacity>
      {recallsExpanded && (
        <>
          {loadingRecalls ? (
            <View style={vehicleDetailStyles.recallsLoading}>
              <Text style={vehicleDetailStyles.recallsLoadingText}>Checking for recalls...</Text>
            </View>
          ) : recalls.length > 0 ? (
            <View style={vehicleDetailStyles.recallsContainer}>
              <View style={vehicleDetailStyles.recallsWarning}>
                <Text style={vehicleDetailStyles.recallsWarningText}>
                  {getRecallSummaryMessage(recalls.length)}
                </Text>
              </View>
              {activeRecallsCount > 0 && (
                <View style={vehicleDetailStyles.recallsInfoBox}>
                  <View style={vehicleDetailStyles.recallsInfoRow}>
                    <Ionicons name="information-circle" size={16} color="#0066cc" />
                    <Text style={vehicleDetailStyles.recallsInfoText}>
                      To mark recalls as complete, edit this vehicle and check them off in the recalls section.
                    </Text>
                  </View>
                </View>
              )}
              <TouchableOpacity
                style={vehicleDetailStyles.recallsLink}
                onPress={async () => {
                  const url = `https://www.nhtsa.gov/recalls?make=${encodeURIComponent(vehicle.make)}&model=${encodeURIComponent(vehicle.model)}&modelYear=${encodeURIComponent(vehicle.year)}`;
                  try {
                    const canOpen = await Linking.canOpenURL(url);
                    if (canOpen) {
                      await Linking.openURL(url);
                    } else {
                      Alert.alert('Error', 'Unable to open browser. Please visit nhtsa.gov/recalls manually.');
                    }
                  } catch (error) {
                    console.error('Error opening URL:', error);
                    Alert.alert('Error', 'Unable to open browser. Please visit nhtsa.gov/recalls manually.');
                  }
                }}
              >
                <Text style={vehicleDetailStyles.recallsLinkText}>View on NHTSA Recalls Site →</Text>
              </TouchableOpacity>
              <View style={vehicleDetailStyles.recallsList}>
                {recalls.map((recall, index) => {
                  const isCompleted = completedRecalls.includes(recall.campaignNumber);
                  return (
                    <View 
                      key={recall.campaignNumber || index} 
                      style={[
                        vehicleDetailStyles.recallItem,
                        isCompleted && vehicleDetailStyles.recallItemCompleted
                      ]}
                    >
                      <View style={vehicleDetailStyles.recallItemHeader}>
                        <View style={vehicleDetailStyles.recallItemContent}>
                          <Text style={[
                            vehicleDetailStyles.recallItemTitle,
                            isCompleted && vehicleDetailStyles.recallItemTitleCompleted
                          ]}>
                            Campaign #{recall.campaignNumber}
                          </Text>
                          <Text style={[
                            vehicleDetailStyles.recallItemComponent,
                            isCompleted && vehicleDetailStyles.recallItemComponentCompleted
                          ]}>
                            {recall.component}
                          </Text>
                          {recall.summary && (
                            <Text 
                              style={[
                                vehicleDetailStyles.recallItemSummary,
                                isCompleted && vehicleDetailStyles.recallItemSummaryCompleted
                              ]}
                            >
                              {recall.summary}
                            </Text>
                          )}
                          {recall.dateReportedFormatted && (
                            <Text style={[
                              vehicleDetailStyles.recallItemDate,
                              isCompleted && vehicleDetailStyles.recallItemDateCompleted
                            ]}>
                              Reported: {recall.dateReportedFormatted}
                            </Text>
                          )}
                          {isCompleted && (
                            <Text style={vehicleDetailStyles.recallCompletedLabel}>
                              ✓ Marked as completed
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            <View style={vehicleDetailStyles.recallsNoRecalls}>
              <Text style={vehicleDetailStyles.recallsNoRecallsText}>
                No known recalls for this vehicle model.
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

export default function VehicleDetailScreen({ route, navigation, appContext }) {
  const [showPDFExportModal, setShowPDFExportModal] = useState(false);
  const [includeBuildSheet, setIncludeBuildSheet] = useState(false);
  const [showMileageEdit, setShowMileageEdit] = useState(false);
  const [showBuildSheet, setShowBuildSheet] = useState(false);
  const { vehicleId } = route.params;
  const { vehicles, setShowVehicleForm, setEditingVehicle, setShowMaintenanceForm, setSelectedVehicle, setEditingMaintenance, deleteVehicle, updateVehicle, addMaintenance, updateMaintenance, deleteMaintenance, inventory } = appContext;
  const [vehicle, setVehicle] = useState(null);
  const [unitSystem, setUnitSystem] = useState(() => getUnitSystem());

  useEffect(() => {
    loadVehicle();
    // Reload unit system when screen focuses
    setUnitSystem(getUnitSystem());
  }, [vehicleId, vehicles]);

  const loadVehicle = () => {
    const foundVehicle = vehicles.find(v => v.id === vehicleId);
    setVehicle(foundVehicle);
  };

  const handleMileageUpdate = (newMileage, skipped) => {
    setShowMileageEdit(false);
    if (!skipped && newMileage) {
      const updatedVehicle = addMileageEntry(vehicle, newMileage);
      updateVehicle(vehicle.id, updatedVehicle);
    }
  };

  if (!vehicle) {
    return (
      <View style={vehicleDetailStyles.container}>
        <Text style={vehicleDetailStyles.text}>Vehicle not found</Text>
      </View>
    );
  }

  const vehicleImage = vehicle.vehicleImage || vehicle.images?.[0]?.data || vehicle.images?.find(img => img.id === vehicle.featuredImageId)?.data || null;

  return (
    <ScrollView style={vehicleDetailStyles.container}>
      <View style={vehicleDetailStyles.content}>
        {/* Header Actions */}
        <View style={vehicleDetailStyles.headerActions}>
          <TouchableOpacity
            style={vehicleDetailStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text style={vehicleDetailStyles.backButtonText} numberOfLines={1}>Back</Text>
          </TouchableOpacity>
          <View style={vehicleDetailStyles.headerButtons}>
            <TouchableOpacity
              style={vehicleDetailStyles.editButton}
              onPress={() => {
                setEditingVehicle(vehicle);
                setShowVehicleForm(true);
              }}
            >
              <Ionicons name="create" size={18} color="#fff" style={{ marginRight: 2 }} />
              <Text style={vehicleDetailStyles.editButtonText} numberOfLines={1} ellipsizeMode="clip">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={vehicleDetailStyles.deleteButton}
              onPress={() => {
                Alert.alert(
                  'Delete Vehicle',
                  `Delete ${vehicle.make} ${vehicle.model}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => {
                        deleteVehicle(vehicle.id);
                        navigation.goBack();
                      }
                    }
                  ]
                );
              }}
            >
              <Ionicons name="trash" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Image */}
        <View style={vehicleDetailStyles.imageContainer}>
          {vehicleImage ? (
            <Image source={{ uri: vehicleImage }} style={vehicleDetailStyles.featuredImage} />
          ) : (
            <View style={vehicleDetailStyles.noImagePlaceholder}>
              <Ionicons name="camera" size={64} color="#666" />
              <Text style={vehicleDetailStyles.noImageText}>No image uploaded</Text>
            </View>
          )}
          <TouchableOpacity
            style={vehicleDetailStyles.imageUploadButton}
            onPress={() => {
              setEditingVehicle(vehicle);
              setShowVehicleForm(true);
            }}
          >
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={vehicleDetailStyles.imageUploadButtonText}>
              {vehicleImage ? 'Edit Photo' : 'Add Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Vehicle Info */}
        <View style={vehicleDetailStyles.infoCard}>
          <Text style={vehicleDetailStyles.title}>
            {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim || ''}
          </Text>
          
          {vehicle.mileage && (
            <TouchableOpacity 
              style={vehicleDetailStyles.mileageSection}
              onPress={() => setShowMileageEdit(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="speedometer" size={32} color="#0066cc" />
              <View style={vehicleDetailStyles.mileageContent}>
                <Text style={vehicleDetailStyles.mileageLabel}>Current Mileage</Text>
                <Text style={vehicleDetailStyles.mileageValue}>
                  {formatDistanceWithSeparators(vehicle.mileage)}
                </Text>
              </View>
              <Ionicons name="pencil" size={20} color="#666" />
            </TouchableOpacity>
          )}

          {/* Oil Life Meter */}
          {(() => {
            const oilLife = calculateOilLife(vehicle);
            if (oilLife.percentage === null) return null;
            
            return (
              <View style={vehicleDetailStyles.oilLifeSection}>
                <View style={vehicleDetailStyles.oilLifeHeader}>
                  <Ionicons name="water" size={24} color={oilLife.color} />
                  <View style={vehicleDetailStyles.oilLifeContent}>
                    <Text style={vehicleDetailStyles.oilLifeLabel}>Oil Life</Text>
                    <View style={vehicleDetailStyles.oilLifeValueRow}>
                      <Text style={[vehicleDetailStyles.oilLifePercentage, { color: oilLife.color }]}>
                        {oilLife.percentage}%
                      </Text>
                      <Text style={[vehicleDetailStyles.oilLifeStatus, { color: oilLife.color }]}>
                        {oilLife.status}
                      </Text>
                    </View>
                    {oilLife.milesRemaining !== null && oilLife.milesRemaining > 0 && (
                      <Text style={vehicleDetailStyles.oilLifeMiles}>
                        {formatDistanceWithSeparators(oilLife.milesRemaining)} until next change
                      </Text>
                    )}
                    {oilLife.needsChange && (
                      <Text style={[vehicleDetailStyles.oilLifeMiles, { color: '#ff4444', fontWeight: '600' }]}>
                        Oil change needed now
                      </Text>
                    )}
                  </View>
                </View>
                <View style={vehicleDetailStyles.oilLifeBarContainer}>
                  <View style={vehicleDetailStyles.oilLifeBarBackground}>
                    <View 
                      style={[
                        vehicleDetailStyles.oilLifeBarFill, 
                        { 
                          width: `${oilLife.percentage}%`,
                          backgroundColor: oilLife.color
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            );
          })()}

          <View style={vehicleDetailStyles.metaSection}>
            {vehicle.licensePlate && (
              <View style={vehicleDetailStyles.metaItem}>
                <Text style={vehicleDetailStyles.metaLabel}>License Plate:</Text>
                <View style={vehicleDetailStyles.metaValueRow}>
                  <Text style={vehicleDetailStyles.metaValue}>{vehicle.licensePlate}</Text>
                  {vehicle.nickname ? (
                    <View style={vehicleDetailStyles.nicknameBadge}>
                      <Text style={vehicleDetailStyles.nicknameBadgeText}>{vehicle.nickname}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            )}
            {vehicle.nickname && !vehicle.licensePlate && (
              <View style={vehicleDetailStyles.metaItem}>
                <Text style={vehicleDetailStyles.metaLabel}>Nickname:</Text>
                <Text style={vehicleDetailStyles.metaValue}>{vehicle.nickname}</Text>
              </View>
            )}
            {vehicle.vin && (
              <View style={vehicleDetailStyles.metaItem}>
                <Text style={vehicleDetailStyles.metaLabel}>VIN:</Text>
                <Text style={vehicleDetailStyles.metaValue}>{vehicle.vin}</Text>
              </View>
            )}
            {vehicle.color && (
              <View style={vehicleDetailStyles.metaItem}>
                <Text style={vehicleDetailStyles.metaLabel}>Color:</Text>
                <Text style={vehicleDetailStyles.metaValue}>{vehicle.color}</Text>
              </View>
            )}

            {/* Build Sheet */}
            {vehicle.buildSheet && (
              vehicle.buildSheet.engine ||
              vehicle.buildSheet.intake || 
              vehicle.buildSheet.exhaust || 
              vehicle.buildSheet.fueling || 
              vehicle.buildSheet.ecu || 
              vehicle.buildSheet.suspension || 
              vehicle.buildSheet.body
            ) && (
              <View style={vehicleDetailStyles.buildSheetContainer}>
                <TouchableOpacity 
                  style={vehicleDetailStyles.buildSheetHeader}
                  onPress={() => setShowBuildSheet(!showBuildSheet)}
                  activeOpacity={0.7}
                >
                  <View style={vehicleDetailStyles.buildSheetHeaderLeft}>
                    <Ionicons name="construct" size={20} color="#0066cc" />
                    <Text style={vehicleDetailStyles.buildSheetTitle}>
                      {vehicle.model || 'Vehicle'} Build Sheet
                    </Text>
                  </View>
                  <Ionicons 
                    name={showBuildSheet ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#0066cc" 
                  />
                </TouchableOpacity>

                {showBuildSheet && (
                  <View style={vehicleDetailStyles.buildSheetContent}>
                    {vehicle.buildSheet.engine && (
                      <View style={vehicleDetailStyles.buildSheetItem}>
                        <Text style={vehicleDetailStyles.buildSheetLabel}>Engine</Text>
                        <Text style={vehicleDetailStyles.buildSheetValue}>{vehicle.buildSheet.engine}</Text>
                      </View>
                    )}
                    {vehicle.buildSheet.intake && (
                      <View style={vehicleDetailStyles.buildSheetItem}>
                        <Text style={vehicleDetailStyles.buildSheetLabel}>Intake</Text>
                        <Text style={vehicleDetailStyles.buildSheetValue}>{vehicle.buildSheet.intake}</Text>
                      </View>
                    )}
                    {vehicle.buildSheet.exhaust && (
                      <View style={vehicleDetailStyles.buildSheetItem}>
                        <Text style={vehicleDetailStyles.buildSheetLabel}>Exhaust</Text>
                        <Text style={vehicleDetailStyles.buildSheetValue}>{vehicle.buildSheet.exhaust}</Text>
                      </View>
                    )}
                    {vehicle.buildSheet.fueling && (
                      <View style={vehicleDetailStyles.buildSheetItem}>
                        <Text style={vehicleDetailStyles.buildSheetLabel}>Fueling</Text>
                        <Text style={vehicleDetailStyles.buildSheetValue}>{vehicle.buildSheet.fueling}</Text>
                      </View>
                    )}
                    {vehicle.buildSheet.ecu && (
                      <View style={vehicleDetailStyles.buildSheetItem}>
                        <Text style={vehicleDetailStyles.buildSheetLabel}>ECU/Tuning</Text>
                        <Text style={vehicleDetailStyles.buildSheetValue}>{vehicle.buildSheet.ecu}</Text>
                      </View>
                    )}
                    {vehicle.buildSheet.suspension && (
                      <View style={vehicleDetailStyles.buildSheetItem}>
                        <Text style={vehicleDetailStyles.buildSheetLabel}>Suspension</Text>
                        <Text style={vehicleDetailStyles.buildSheetValue}>{vehicle.buildSheet.suspension}</Text>
                      </View>
                    )}
                    {vehicle.buildSheet.body && (
                      <View style={vehicleDetailStyles.buildSheetItem}>
                        <Text style={vehicleDetailStyles.buildSheetLabel}>Body</Text>
                        <Text style={vehicleDetailStyles.buildSheetValue}>{vehicle.buildSheet.body}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Notes Section */}
        {vehicle.notes && (
          <View style={vehicleDetailStyles.notesSection}>
            <Text style={vehicleDetailStyles.sectionTitle}>Notes</Text>
            <Text style={vehicleDetailStyles.notesText}>{vehicle.notes}</Text>
          </View>
        )}

        {/* Service Alerts */}
        <ServiceAlerts
          vehicle={vehicle}
          inventory={inventory}
          onAddMaintenance={(maintenanceType, mileage) => {
            setEditingMaintenance({
              type: maintenanceType,
              date: new Date().toISOString().split('T')[0],
              mileage: mileage ? mileage.toString() : ''
            });
            setSelectedVehicle(vehicle);
            setShowMaintenanceForm(true);
          }}
        />

        {/* Vehicle Recalls */}
        <VehicleRecallsSection vehicle={vehicle} />

        {/* Service Intervals Timeline */}
        <ServiceIntervalsSection vehicle={vehicle} />

        {/* Recommended Fluids */}
        <RecommendedFluidsSection vehicle={vehicle} />

        {/* Torque Values */}
        <TorqueValuesSection vehicle={vehicle} />

        {/* Tires & Wheels */}
        <TiresWheelsSection vehicle={vehicle} />

        {/* Hardware */}
        <HardwareSection vehicle={vehicle} />

        {/* Lighting */}
        <LightingSection vehicle={vehicle} />

        {/* Parts SKUs */}
        <PartsSKUsSection vehicle={vehicle} />

        {/* Maintenance Records */}
        <View style={vehicleDetailStyles.maintenanceSection}>
          <View style={vehicleDetailStyles.sectionHeader}>
            <Text style={vehicleDetailStyles.sectionTitle}>Maintenance Records</Text>
            <TouchableOpacity
              style={vehicleDetailStyles.addButton}
              onPress={() => {
                setEditingMaintenance(null);
                setSelectedVehicle(vehicle);
                setShowMaintenanceForm(true);
              }}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={vehicleDetailStyles.addButtonText}>Add Maintenance</Text>
            </TouchableOpacity>
          </View>
          
          {/* Export Buttons */}
          {(vehicle?.maintenanceRecords || []).length > 0 && (
            <View style={vehicleDetailStyles.exportButtons}>
              <TouchableOpacity
                style={vehicleDetailStyles.exportButton}
                onPress={async () => {
                  try {
                    await exportMaintenanceToCSV(vehicle);
                    Alert.alert('Success', 'Maintenance records exported to CSV successfully!');
                  } catch (error) {
                    Alert.alert('Export Error', `Failed to export CSV: ${error.message}`);
                  }
                }}
              >
                <Ionicons name="document-text" size={18} color="#0066cc" />
                <Text style={vehicleDetailStyles.exportButtonText}>Export CSV</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={vehicleDetailStyles.exportButton}
                onPress={() => {
                  setShowPDFExportModal(true);
                }}
              >
                <Ionicons name="document" size={18} color="#0066cc" />
                <Text style={vehicleDetailStyles.exportButtonText}>Export PDF</Text>
              </TouchableOpacity>
              
              {/* PDF Export Options Modal */}
              <Modal
                visible={showPDFExportModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPDFExportModal(false)}
              >
                <View style={vehicleDetailStyles.modalOverlay}>
                  <View style={vehicleDetailStyles.modalContent}>
                    <Text style={vehicleDetailStyles.modalTitle}>Export PDF Options</Text>
                    
                    <View style={vehicleDetailStyles.modalOption}>
                      <Text style={vehicleDetailStyles.modalOptionText}>Include Build Sheet</Text>
                      <Switch
                        value={includeBuildSheet}
                        onValueChange={setIncludeBuildSheet}
                        trackColor={{ false: '#767577', true: '#0066cc' }}
                        thumbColor={includeBuildSheet ? '#fff' : '#f4f3f4'}
                      />
                    </View>
                    
                    <View style={vehicleDetailStyles.modalButtons}>
                      <TouchableOpacity
                        style={[vehicleDetailStyles.modalButton, vehicleDetailStyles.modalButtonCancel]}
                        onPress={() => setShowPDFExportModal(false)}
                      >
                        <Text style={vehicleDetailStyles.modalButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[vehicleDetailStyles.modalButton, vehicleDetailStyles.modalButtonConfirm]}
                onPress={async () => {
                          setShowPDFExportModal(false);
                  try {
                            await exportMaintenanceToPDF(vehicle, includeBuildSheet);
                    Alert.alert('Success', 'Maintenance records exported to PDF successfully!');
                  } catch (error) {
                    Alert.alert('Export Error', `Failed to export PDF: ${error.message}`);
                  }
                }}
              >
                        <Text style={[vehicleDetailStyles.modalButtonText, { color: '#fff' }]}>Export</Text>
              </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          )}
          
          <MaintenanceRecord
            vehicle={vehicle}
            onAdd={() => {
              setEditingMaintenance(null);
              setSelectedVehicle(vehicle);
              setShowMaintenanceForm(true);
            }}
            onEdit={(maintenance) => {
              setEditingMaintenance(maintenance);
              setSelectedVehicle(vehicle);
              setShowMaintenanceForm(true);
            }}
            onDelete={(maintenanceId) => deleteMaintenance(vehicle.id, maintenanceId)}
          />
        </View>
      </View>

      {showMileageEdit && (
        <MileageUpdateModal
          vehicle={vehicle}
          onUpdate={handleMileageUpdate}
          onSkip={() => setShowMileageEdit(false)}
        />
      )}
    </ScrollView>
  );
}

