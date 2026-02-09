import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SavingsScreen({ appContext }) {
  const { vehicles } = appContext || {};
  const [expandedVehicles, setExpandedVehicles] = useState({});
  const [expandedCostVehicles, setExpandedCostVehicles] = useState({});

  // Calculate costs of ownership for each vehicle
  const ownershipCostsData = useMemo(() => {
    if (!vehicles || vehicles.length === 0) {
      return { vehicles: [], totalCost: 0, totalParts: 0, totalLabor: 0 };
    }

    const vehicleCosts = vehicles.map(vehicle => {
      const records = vehicle.maintenanceRecords || [];
      
      let totalParts = 0;
      let totalLabor = 0;
      let totalCost = 0;

      records.forEach(record => {
        if (record.isDIY === true) {
          // DIY job: parts cost is diyPartsCost, labor is the savings (shopPrice - diyPartsCost)
          const partsCost = parseFloat(record.diyPartsCost) || 0;
          const shopPrice = parseFloat(record.shopPrice) || 0;
          const laborCost = Math.max(0, shopPrice - partsCost);
          
          totalParts += partsCost;
          totalLabor += laborCost;
          totalCost += partsCost + laborCost;
        } else {
          // Non-DIY job: use cost field, assume it's all labor (or split if we had that data)
          const jobCost = parseFloat(record.cost) || 0;
          totalCost += jobCost;
          // For non-DIY, we don't know parts vs labor breakdown, so count as labor
          totalLabor += jobCost;
        }
      });

      return {
        vehicle: vehicle,
        totalCost: totalCost,
        totalParts: totalParts,
        totalLabor: totalLabor,
        recordCount: records.length
      };
    });

    // Calculate grand totals
    const totalCost = vehicleCosts.reduce((sum, v) => sum + v.totalCost, 0);
    const totalParts = vehicleCosts.reduce((sum, v) => sum + v.totalParts, 0);
    const totalLabor = vehicleCosts.reduce((sum, v) => sum + v.totalLabor, 0);

    return {
      vehicles: vehicleCosts.filter(v => v.totalCost > 0 || v.recordCount > 0), // Show all vehicles with records
      totalCost: totalCost,
      totalParts: totalParts,
      totalLabor: totalLabor
    };
  }, [vehicles]);

  // Calculate savings for each vehicle and totals
  const savingsData = useMemo(() => {
    if (!vehicles || vehicles.length === 0) {
      return { vehicles: [], totalJobs: 0, totalSavings: 0 };
    }

    const vehicleSavings = vehicles.map(vehicle => {
      const records = vehicle.maintenanceRecords || [];
      
      // Filter DIY jobs that have both shop price and DIY parts cost
      const diyJobs = records.filter(record => 
        record.isDIY === true && 
        record.shopPrice !== null && 
        record.shopPrice !== undefined &&
        record.diyPartsCost !== null && 
        record.diyPartsCost !== undefined
      );

      // Calculate savings for each job with full job details
      const jobsWithSavings = diyJobs.map(job => {
        const shopPrice = parseFloat(job.shopPrice) || 0;
        const diyCost = parseFloat(job.diyPartsCost) || 0;
        const savings = Math.max(0, shopPrice - diyCost);
        
        return {
          ...job,
          shopPrice: shopPrice,
          diyPartsCost: diyCost,
          savings: savings,
          date: job.date || null,
          type: job.type || 'Maintenance',
          mileage: job.mileage || null,
        };
      }).sort((a, b) => {
        // Sort by date (newest first)
        if (a.date && b.date) {
          return new Date(b.date) - new Date(a.date);
        }
        return 0;
      });

      const totalSavings = jobsWithSavings.reduce((sum, job) => sum + job.savings, 0);
      const jobCount = diyJobs.length;

      return {
        vehicle: vehicle,
        jobCount: jobCount,
        totalSavings: totalSavings,
        jobs: jobsWithSavings
      };
    });

    // Calculate grand totals
    const totalJobs = vehicleSavings.reduce((sum, v) => sum + v.jobCount, 0);
    const totalSavings = vehicleSavings.reduce((sum, v) => sum + v.totalSavings, 0);

    return {
      vehicles: vehicleSavings.filter(v => v.jobCount > 0), // Only show vehicles with DIY jobs
      totalJobs: totalJobs,
      totalSavings: totalSavings
    };
  }, [vehicles]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const toggleVehicle = (vehicleId) => {
    setExpandedVehicles(prev => ({
      ...prev,
      [vehicleId]: !prev[vehicleId]
    }));
  };

  const toggleCostVehicle = (vehicleId) => {
    setExpandedCostVehicles(prev => ({
      ...prev,
      [vehicleId]: !prev[vehicleId]
    }));
  };

  if (!vehicles || vehicles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cash-outline" size={64} color="#4d4d4d" />
          <Text style={styles.emptyTitle}>No Vehicles Yet</Text>
          <Text style={styles.emptySubtitle}>
            Add vehicles and mark maintenance as DIY to track your savings!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (savingsData.totalJobs === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.emptyContainer}>
            <Ionicons name="stats-chart" size={64} color="#4d4d4d" />
            <Text style={styles.emptyTitle}>Track Your Build's Value</Text>
            <Text style={styles.emptySubtitle}>
              Log your maintenance to track your total investment, or mark records as DIY to see your calculated labor savings.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Costs of Ownership Section */}
        <Text style={styles.sectionTitle}>Costs of Ownership</Text>
        
        {ownershipCostsData.vehicles.length > 0 ? (
          <>
            {ownershipCostsData.vehicles.map((item, index) => {
              const vehicleId = item.vehicle.id || index;
              const isExpanded = expandedCostVehicles[vehicleId] || false;
              
              return (
                <View key={`cost-${vehicleId}`} style={styles.costCard}>
                  <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={() => toggleCostVehicle(vehicleId)}
                    style={styles.costHeaderTouchable}
                  >
                    <View style={styles.costHeader}>
                      <View style={styles.vehicleInfo}>
                        <Text style={styles.vehicleName}>
                          {item.vehicle.year || ''} {item.vehicle.make || ''} {item.vehicle.model || ''}
                          {item.vehicle.trim ? ` ${item.vehicle.trim}` : ''}
                        </Text>
                        <Text style={styles.vehicleStats}>
                          {item.recordCount} {item.recordCount === 1 ? 'maintenance record' : 'maintenance records'}
                        </Text>
                      </View>
                      <Ionicons 
                        name={isExpanded ? "chevron-up" : "chevron-down"} 
                        size={24} 
                        color="#b0b0b0" 
                      />
                    </View>
                  </TouchableOpacity>
                  
                  <View style={styles.costAmountContainer}>
                    <Text style={styles.costTotalAmount}>
                      {formatCurrency(item.totalCost)}
                    </Text>
                    <Text style={styles.costTotalLabel}>Total Cost</Text>
                  </View>

                  <View style={styles.costBreakdown}>
                    <View style={styles.costBreakdownItem}>
                      <Ionicons name="build" size={16} color="#0066cc" />
                      <Text style={styles.costBreakdownLabel}>Parts</Text>
                      <Text style={styles.costBreakdownValue}>
                        {formatCurrency(item.totalParts)}
                      </Text>
                    </View>
                    <View style={styles.costBreakdownDivider} />
                    <View style={styles.costBreakdownItem}>
                      <Ionicons name="hammer" size={16} color="#ffaa00" />
                      <Text style={styles.costBreakdownLabel}>Labor</Text>
                      <Text style={styles.costBreakdownValue}>
                        {formatCurrency(item.totalLabor)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
            
            {/* Grand Total for Costs */}
            <View style={styles.costGrandTotalCard}>
              <Text style={styles.costGrandTotalLabel}>TOTAL OWNERSHIP COST</Text>
              <Text style={styles.costGrandTotalAmount}>
                {formatCurrency(ownershipCostsData.totalCost)}
              </Text>
              <View style={styles.costGrandTotalBreakdown}>
                <View style={styles.costGrandTotalItem}>
                  <Text style={styles.costGrandTotalItemLabel}>Parts</Text>
                  <Text style={styles.costGrandTotalItemValue}>
                    {formatCurrency(ownershipCostsData.totalParts)}
                  </Text>
                </View>
                <View style={styles.costGrandTotalDivider} />
                <View style={styles.costGrandTotalItem}>
                  <Text style={styles.costGrandTotalItemLabel}>Labor</Text>
                  <Text style={styles.costGrandTotalItemValue}>
                    {formatCurrency(ownershipCostsData.totalLabor)}
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyCostCard}>
            <Ionicons name="calculator-outline" size={48} color="#4d4d4d" />
            <Text style={styles.emptyCostText}>
              Add maintenance records with cost information to track ownership costs.
            </Text>
          </View>
        )}

        {/* Savings Section */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>DIY Savings</Text>
        
        {/* Grand Total Card */}
        <View style={styles.grandTotalCard}>
          <Text style={styles.grandTotalLabel}>TOTAL SAVINGS</Text>
          <Text style={styles.grandTotalAmount}>
            {formatCurrency(savingsData.totalSavings)}
          </Text>
          <View style={styles.grandTotalStats}>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={24} color="#4dff4d" />
              <Text style={styles.statNumber}>{savingsData.totalJobs}</Text>
              <Text style={styles.statLabel}>
                {savingsData.totalJobs === 1 ? 'Job' : 'Jobs'}
              </Text>
            </View>
          </View>
        </View>

        {/* Per-Vehicle Breakdown */}
        <Text style={styles.sectionTitle}>Savings by Vehicle</Text>
        
        {savingsData.vehicles.map((item, index) => {
          const vehicleId = item.vehicle.id || index;
          const isExpanded = expandedVehicles[vehicleId] || false;
          
          return (
            <View key={vehicleId} style={styles.vehicleCard}>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => toggleVehicle(vehicleId)}
                style={styles.vehicleHeaderTouchable}
              >
                <View style={styles.vehicleHeader}>
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>
                      {item.vehicle.year || ''} {item.vehicle.make || ''} {item.vehicle.model || ''}
                      {item.vehicle.trim ? ` ${item.vehicle.trim}` : ''}
                    </Text>
                    <Text style={styles.vehicleStats}>
                      {item.jobCount} {item.jobCount === 1 ? 'DIY job' : 'DIY jobs'}
                    </Text>
                  </View>
                  <View style={styles.vehicleHeaderRight}>
                    <Ionicons name="car-sport" size={32} color="#0066cc" style={styles.carIcon} />
                    <Ionicons 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color="#b0b0b0" 
                    />
                  </View>
                </View>
              </TouchableOpacity>
              
              <View style={styles.savingsAmountContainer}>
                <Text style={styles.savingsAmount}>
                  {formatCurrency(item.totalSavings)}
                </Text>
                <Text style={styles.savingsLabel}>saved</Text>
              </View>

              {/* Expanded Job Details */}
              {isExpanded && item.jobs && item.jobs.length > 0 && (
                <View style={styles.jobsContainer}>
                  <View style={styles.jobsHeader}>
                    <Text style={styles.jobsHeaderText}>Job Details</Text>
                  </View>
                  {item.jobs.map((job, jobIndex) => (
                    <View key={job.id || jobIndex} style={styles.jobCard}>
                      <View style={styles.jobHeader}>
                        <View style={styles.jobHeaderLeft}>
                          <Ionicons name="build" size={20} color="#0066cc" />
                          <View style={styles.jobTitleContainer}>
                            <Text style={styles.jobType}>{job.type || 'Maintenance'}</Text>
                            <Text style={styles.jobDate}>{formatDate(job.date)}</Text>
                          </View>
                        </View>
                        <View style={styles.jobSavings}>
                          <Text style={styles.jobSavingsAmount}>
                            {formatCurrency(job.savings)}
                          </Text>
                          <Text style={styles.jobSavingsLabel}>saved</Text>
                        </View>
                      </View>
                      
                      <View style={styles.jobDetails}>
                        <View style={styles.jobDetailRow}>
                          <View style={styles.jobDetailItem}>
                            <Text style={styles.jobDetailLabel}>Shop Price</Text>
                            <Text style={styles.jobDetailValue}>
                              {formatCurrency(job.shopPrice)}
                            </Text>
                          </View>
                          <View style={styles.jobDetailItem}>
                            <Text style={styles.jobDetailLabel}>DIY Cost</Text>
                            <Text style={styles.jobDetailValue}>
                              {formatCurrency(job.diyPartsCost)}
                            </Text>
                          </View>
                        </View>
                        {job.mileage && (
                          <View style={styles.jobMileage}>
                            <Ionicons name="speedometer" size={16} color="#b0b0b0" />
                            <Text style={styles.jobMileageText}>
                              {parseInt(job.mileage).toLocaleString()} mi
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* Motivational Footer */}
        <View style={styles.footerCard}>
          <Ionicons name="trophy" size={32} color="#ffaa00" />
          <Text style={styles.footerText}>
            Keep up the great work! Every DIY job adds up.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  grandTotalCard: {
    backgroundColor: '#0066cc',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.9,
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  grandTotalAmount: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  grandTotalStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
    marginRight: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    marginTop: 8,
  },
  vehicleCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  vehicleHeaderTouchable: {
    marginBottom: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  vehicleInfo: {
    flex: 1,
    marginRight: 12,
  },
  vehicleHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  carIcon: {
    marginRight: 4,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  vehicleStats: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  savingsAmountContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#4d4d4d',
  },
  savingsAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4dff4d',
    marginBottom: 4,
  },
  savingsLabel: {
    fontSize: 14,
    color: '#b0b0b0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
    lineHeight: 24,
  },
  footerCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  footerText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 16,
    flex: 1,
    lineHeight: 24,
  },
  jobsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#4d4d4d',
  },
  jobsHeader: {
    marginBottom: 12,
  },
  jobsHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#b0b0b0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  jobCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  jobTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  jobType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  jobDate: {
    fontSize: 13,
    color: '#b0b0b0',
  },
  jobSavings: {
    alignItems: 'flex-end',
  },
  jobSavingsAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4dff4d',
    marginBottom: 2,
  },
  jobSavingsLabel: {
    fontSize: 11,
    color: '#b0b0b0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  jobDetails: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#4d4d4d',
  },
  jobDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobDetailItem: {
    flex: 1,
  },
  jobDetailLabel: {
    fontSize: 12,
    color: '#b0b0b0',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  jobDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  jobMileage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#4d4d4d',
  },
  jobMileageText: {
    fontSize: 13,
    color: '#b0b0b0',
    marginLeft: 6,
  },
  costCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  costHeaderTouchable: {
    marginBottom: 16,
  },
  costHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  costAmountContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#4d4d4d',
    borderBottomWidth: 1,
    borderBottomColor: '#4d4d4d',
  },
  costTotalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  costTotalLabel: {
    fontSize: 12,
    color: '#b0b0b0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  costBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
  },
  costBreakdownItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  costBreakdownLabel: {
    fontSize: 12,
    color: '#b0b0b0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  costBreakdownValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  costBreakdownDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#4d4d4d',
  },
  costGrandTotalCard: {
    backgroundColor: '#1a3a5c',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#0066cc33',
  },
  costGrandTotalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0066cc',
    opacity: 0.9,
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  costGrandTotalAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  costGrandTotalBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#0066cc33',
  },
  costGrandTotalItem: {
    flex: 1,
    alignItems: 'center',
  },
  costGrandTotalItemLabel: {
    fontSize: 11,
    color: '#b0b0b0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  costGrandTotalItemValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  costGrandTotalDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#0066cc33',
  },
  emptyCostCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 32,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  emptyCostText: {
    fontSize: 14,
    color: '#b0b0b0',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
});
