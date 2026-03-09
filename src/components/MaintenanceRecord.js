import React, { useState } from 'react';
import { theme } from '../theme';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceWithSeparators } from '../utils/unitConverter';
import { Linking } from 'react-native';

export default function MaintenanceRecord({ vehicle, onAdd, onEdit, onDelete }) {
  const records = vehicle?.maintenanceRecords || [];
  const [receiptModal, setReceiptModal] = useState({ visible: false, receipt: null });

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Maintenance Record',
      `Are you sure you want to delete this ${item.type} record?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(item.id),
        },
      ]
    );
  };

  const renderRecord = ({ item }) => {
    // Calculate savings for DIY services
    const actualCost = parseFloat(item.cost) || 0;
    const shopPrice = item.shopPrice ? parseFloat(item.shopPrice) : null;
    const diyPartsCost = item.diyPartsCost ? parseFloat(item.diyPartsCost) : 0;
    const isDIY = item.isDIY === true;
    
    let savings = null;
    if (isDIY && shopPrice !== null) {
      const totalDIYCost = actualCost + diyPartsCost;
      savings = shopPrice - totalDIYCost;
    }

    return (
      <View style={styles.recordCard}>
        <View style={styles.recordHeader}>
          <Text style={styles.recordType}>{item.type}</Text>
          <View style={styles.recordActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onEdit(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="create" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDelete(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash" size={24} color={theme.colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
        {item.date && (
          <Text style={styles.recordDate}>
            Date: {new Date(item.date).toLocaleDateString()}
          </Text>
        )}
        {item.mileage && (
          <Text style={styles.recordMileage}>
            Mileage: {formatDistanceWithSeparators(item.mileage)}
          </Text>
        )}
        {item.description && (
          <Text style={styles.recordDescription}>{item.description}</Text>
        )}
        {item.location && (
          <Text style={styles.recordLocation}>Location: {item.location}</Text>
        )}
        
        {/* Cost information */}
        <View style={styles.costSection}>
          {isDIY && shopPrice !== null ? (
            <>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Shop Price:</Text>
                <Text style={styles.costValue}>${shopPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>DIY Cost:</Text>
                <Text style={styles.costValue}>
                  ${(actualCost + diyPartsCost).toFixed(2)}
                  {diyPartsCost > 0 ? (
                    <Text style={styles.costBreakdown}>
                      {' '}(Parts: ${diyPartsCost.toFixed(2)} + Labor: ${actualCost.toFixed(2)})
                    </Text>
                  ) : null}
                </Text>
              </View>
              {savings !== null && savings > 0 ? (
                <View style={styles.costRow}>
                  <Text style={styles.savingsLabel}>You Saved:</Text>
                  <Text style={styles.savingsValue}>${savings.toFixed(2)}</Text>
                </View>
              ) : null}
            </>
          ) : (
            actualCost > 0 ? (
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Cost:</Text>
                <Text style={styles.costValue}>${actualCost.toFixed(2)}</Text>
              </View>
            ) : null
          )}
        </View>

        {/* Receipt Section */}
        {item.receipt && (
          <View style={styles.receiptSection}>
            <TouchableOpacity
              style={styles.receiptButton}
              onPress={() => setReceiptModal({ visible: true, receipt: item.receipt })}
            >
              <Ionicons 
                name={item.receipt.type === 'pdf' ? 'document' : 'image'} 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text style={styles.receiptButtonText}>
                {item.receipt.type === 'pdf' ? 'View Receipt PDF' : 'View Receipt'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {records.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No maintenance records yet</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            <Ionicons name="add" size={20} color={theme.colors.textPrimary} />
            <Text style={styles.addButtonText}>Add First Record</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={renderRecord}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}

      {/* Receipt Modal */}
      <Modal
        visible={receiptModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setReceiptModal({ visible: false, receipt: null })}
      >
        <View style={styles.receiptModalOverlay}>
          <View style={styles.receiptModalContent}>
            <View style={styles.receiptModalHeader}>
              <Text style={styles.receiptModalTitle}>Receipt</Text>
              <TouchableOpacity
                onPress={() => setReceiptModal({ visible: false, receipt: null })}
              >
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.receiptModalBody}>
              {receiptModal.receipt?.type === 'image' ? (
                <Image
                  source={{ uri: receiptModal.receipt.uri }}
                  style={styles.receiptModalImage}
                  resizeMode="contain"
                />
              ) : receiptModal.receipt?.type === 'pdf' ? (
                <View style={styles.receiptModalPdf}>
                  <Ionicons name="document" size={64} color={theme.colors.primary} />
                  <Text style={styles.receiptModalPdfText}>
                    {receiptModal.receipt.name || 'Receipt.pdf'}
                  </Text>
                  <TouchableOpacity
                    style={styles.openPdfButton}
                    onPress={async () => {
                      try {
                        const canOpen = await Linking.canOpenURL(receiptModal.receipt.uri);
                        if (canOpen) {
                          await Linking.openURL(receiptModal.receipt.uri);
                        } else {
                          Alert.alert('Error', 'Unable to open PDF file.');
                        }
                      } catch (error) {
                        Alert.alert('Error', 'Unable to open PDF file.');
                      }
                    }}
                  >
                    <Text style={styles.openPdfButtonText}>Open PDF</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  recordCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordType: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  recordActions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
  },
  recordDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  recordMileage: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  recordDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  recordLocation: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  costSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  costLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  costValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  costBreakdown: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    fontWeight: '400',
  },
  savingsLabel: {
    fontSize: 14,
    color: theme.colors.successBright,
    fontWeight: '600',
  },
  savingsValue: {
    fontSize: 16,
    color: theme.colors.successBright,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  receiptSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  receiptButtonText: {
    flex: 1,
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  receiptModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptModalContent: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  receiptModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  receiptModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  receiptModalBody: {
    padding: 16,
  },
  receiptModalImage: {
    width: '100%',
    height: 500,
    backgroundColor: theme.colors.background,
  },
  receiptModalPdf: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  receiptModalPdfText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  openPdfButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  openPdfButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
