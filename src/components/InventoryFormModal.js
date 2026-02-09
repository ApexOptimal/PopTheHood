import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BarcodeScanner from './BarcodeScanner';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ANIMATION_DURATION = 375; // 25% slower than default 300ms

export default function InventoryFormModal({ vehicles = [], initialData = null, isEditing = false, onSubmit, onCancel, existingInventory = [] }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    quantity: initialData?.quantity ? String(initialData.quantity) : '1',
    unit: initialData?.unit || '',
    category: initialData?.category || '',
    location: initialData?.location || '',
    vehicleIds: initialData?.vehicleIds || [],
    alertThreshold: initialData?.alertThreshold ? String(initialData.alertThreshold) : '',
  });
  const [showCommonItemsPicker, setShowCommonItemsPicker] = useState(false);
  const [showCleaningProducts, setShowCleaningProducts] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [lastScannedBarcode, setLastScannedBarcode] = useState(null);
  
  // Animation state
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Slide in on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const handleAnimatedClose = (callback) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        quantity: initialData.quantity ? String(initialData.quantity) : '1',
        unit: initialData.unit || '',
        category: initialData.category || '',
        location: initialData.location || '',
        vehicleIds: initialData.vehicleIds || [],
        alertThreshold: initialData.alertThreshold ? String(initialData.alertThreshold) : '',
      });
    }
  }, [initialData]);

  const commonItems = [
    // Fluids
    { name: 'Motor Oil 5W-30', category: 'Fluids', unit: 'quarts' },
    { name: 'Motor Oil 10W-30', category: 'Fluids', unit: 'quarts' },
    { name: 'Motor Oil 0W-20', category: 'Fluids', unit: 'quarts' },
    { name: 'Motor Oil 5W-20', category: 'Fluids', unit: 'quarts' },
    { name: 'Motor Oil 10W-40', category: 'Fluids', unit: 'quarts' },
    { name: 'Brake Fluid DOT 3', category: 'Fluids', unit: 'bottles' },
    { name: 'Brake Fluid DOT 4', category: 'Fluids', unit: 'bottles' },
    { name: 'Brake Fluid DOT 5', category: 'Fluids', unit: 'bottles' },
    { name: 'Transmission Fluid', category: 'Fluids', unit: 'quarts' },
    { name: 'ATF (Automatic Transmission Fluid)', category: 'Fluids', unit: 'quarts' },
    { name: 'Coolant/Antifreeze', category: 'Fluids', unit: 'gallons' },
    { name: 'Power Steering Fluid', category: 'Fluids', unit: 'bottles' },
    { name: 'Windshield Washer Fluid', category: 'Fluids', unit: 'gallons' },
    { name: 'Differential Fluid', category: 'Fluids', unit: 'quarts' },
    
    // Filters
    { name: 'Engine Oil Filter', category: 'Filters', unit: 'units' },
    { name: 'Air Filter', category: 'Filters', unit: 'units' },
    { name: 'Cabin Air Filter', category: 'Filters', unit: 'units' },
    { name: 'Fuel Filter', category: 'Filters', unit: 'units' },
    { name: 'Transmission Filter', category: 'Filters', unit: 'units' },
    
    // Tune-Up Parts
    { name: 'Spark Plugs', category: 'Parts', unit: 'units' },
    { name: 'Spark Plug Wires', category: 'Parts', unit: 'sets' },
    { name: 'Ignition Coil', category: 'Parts', unit: 'units' },
    { name: 'Distributor Cap', category: 'Parts', unit: 'units' },
    { name: 'Rotor', category: 'Parts', unit: 'units' },
    { name: 'Battery', category: 'Parts', unit: 'units' },
    { name: 'Alternator', category: 'Parts', unit: 'units' },
    { name: 'Starter', category: 'Parts', unit: 'units' },
    
    // Brake Parts
    { name: 'Brake Pads', category: 'Parts', unit: 'sets' },
    { name: 'Brake Rotors', category: 'Parts', unit: 'units' },
    { name: 'Brake Calipers', category: 'Parts', unit: 'units' },
    { name: 'Brake Shoes', category: 'Parts', unit: 'sets' },
    { name: 'Brake Drums', category: 'Parts', unit: 'units' },
    { name: 'Brake Lines', category: 'Parts', unit: 'units' },
    
    // Other Parts
    { name: 'Wiper Blades', category: 'Parts', unit: 'sets' },
    { name: 'Headlight Bulbs', category: 'Parts', unit: 'units' },
    { name: 'Tail Light Bulbs', category: 'Parts', unit: 'units' },
    { name: 'Turn Signal Bulbs', category: 'Parts', unit: 'units' },
    { name: 'Fog Light Bulbs', category: 'Parts', unit: 'units' },
    { name: 'Fuses', category: 'Parts', unit: 'pack' },
    { name: 'Relays', category: 'Parts', unit: 'units' },
    { name: 'Belts (Serpentine)', category: 'Parts', unit: 'units' },
    { name: 'Timing Belt', category: 'Parts', unit: 'units' },
    { name: 'Hoses (Radiator)', category: 'Parts', unit: 'units' },
    { name: 'Hoses (Heater)', category: 'Parts', unit: 'units' },
    { name: 'Oil Drain Plug', category: 'Parts', unit: 'units' },
    { name: 'Oil Drain Plug Gasket', category: 'Parts', unit: 'units' },
    { name: 'Thermostat', category: 'Parts', unit: 'units' },
    { name: 'Water Pump', category: 'Parts', unit: 'units' },
    { name: 'Fuel Pump', category: 'Parts', unit: 'units' },
    { name: 'Oxygen Sensor', category: 'Parts', unit: 'units' },
    { name: 'Mass Air Flow Sensor', category: 'Parts', unit: 'units' },
    
    // Tools
    { name: 'Tire Pressure Gauge', category: 'Tools', unit: 'units' },
    { name: 'Jack Stands', category: 'Tools', unit: 'pairs' },
    { name: 'Floor Jack', category: 'Tools', unit: 'units' },
    { name: 'Socket Set', category: 'Tools', unit: 'sets' },
    { name: 'Wrench Set', category: 'Tools', unit: 'sets' },
    { name: 'Screwdriver Set', category: 'Tools', unit: 'sets' },
    { name: 'Pliers', category: 'Tools', unit: 'units' },
    { name: 'Torque Wrench', category: 'Tools', unit: 'units' },
    { name: 'Oil Drain Pan', category: 'Tools', unit: 'units' },
    { name: 'Funnel', category: 'Tools', unit: 'units' },
    { name: 'Oil Filter Wrench', category: 'Tools', unit: 'units' },
    { name: 'Spark Plug Socket', category: 'Tools', unit: 'units' },
    { name: 'Brake Bleeder Kit', category: 'Tools', unit: 'units' },
    
    // Safety
    { name: 'Work Gloves', category: 'Safety', unit: 'pairs' },
    { name: 'Safety Glasses', category: 'Safety', unit: 'units' },
    { name: 'Safety Goggles', category: 'Safety', unit: 'units' },
    { name: 'Ear Protection', category: 'Safety', unit: 'units' },
    
    // Supplies
    { name: 'Rags/Towels', category: 'Supplies', unit: 'pack' },
    { name: 'Shop Towels', category: 'Supplies', unit: 'rolls' },
    { name: 'Disposable Gloves', category: 'Supplies', unit: 'pairs' },
    
    // Lubricants
    { name: 'WD-40', category: 'Lubricants', unit: 'cans' },
    { name: 'Grease', category: 'Lubricants', unit: 'tubes' },
    { name: 'Penetrating Oil', category: 'Lubricants', unit: 'cans' },
    { name: 'White Lithium Grease', category: 'Lubricants', unit: 'cans' },
    
    // Cleaning & Detailing Products
    { name: 'Degreaser', category: 'Cleaning', unit: 'bottles', isCleaning: true },
    { name: 'Car Wash Soap', category: 'Cleaning', unit: 'bottles', isCleaning: true },
    { name: 'Wax/Polish', category: 'Cleaning', unit: 'bottles', isCleaning: true },
    { name: 'Tire Shine', category: 'Cleaning', unit: 'bottles', isCleaning: true },
    { name: 'Wheel Cleaner', category: 'Cleaning', unit: 'bottles', isCleaning: true },
    { name: 'Interior Cleaner', category: 'Cleaning', unit: 'bottles', isCleaning: true },
    { name: 'Dashboard Protectant', category: 'Cleaning', unit: 'bottles', isCleaning: true },
    { name: 'Leather Conditioner', category: 'Cleaning', unit: 'bottles', isCleaning: true },
    { name: 'Glass Cleaner', category: 'Cleaning', unit: 'bottles', isCleaning: true },
    { name: 'Clay Bar', category: 'Cleaning', unit: 'units', isCleaning: true },
    { name: 'Microfiber Towels', category: 'Cleaning', unit: 'pack', isCleaning: true },
    { name: 'Wash Mitt', category: 'Cleaning', unit: 'units', isCleaning: true },
    { name: 'Drying Towel', category: 'Cleaning', unit: 'units', isCleaning: true },
    { name: 'Foam Cannon', category: 'Cleaning', unit: 'units', isCleaning: true },
    { name: 'Pressure Washer Soap', category: 'Cleaning', unit: 'bottles', isCleaning: true },
    { name: 'Trim Restorer', category: 'Cleaning', unit: 'bottles', isCleaning: true },
    { name: 'Headlight Restorer', category: 'Cleaning', unit: 'kits', isCleaning: true },
    { name: 'Bug & Tar Remover', category: 'Cleaning', unit: 'bottles', isCleaning: true },
    { name: 'Engine Degreaser', category: 'Cleaning', unit: 'bottles', isCleaning: true },
    { name: 'Chrome Polish', category: 'Cleaning', unit: 'bottles', isCleaning: true },
  ];

  const getFilteredItems = () => {
    if (showCleaningProducts) {
      return commonItems;
    }
    return commonItems.filter(item => !item.isCleaning);
  };

  const handleCommonItemSelect = (item) => {
    setFormData({
      ...formData,
      name: item.name,
      category: item.category,
      unit: item.unit,
    });
    setShowCommonItemsPicker(false);
  };

  const handleBarcodeScan = (productData) => {
    // Check if item with same name already exists
    const existingItem = existingInventory?.find(
      item => item.name.toLowerCase() === productData.name.toLowerCase()
    );

    if (existingItem) {
      // Increment quantity for existing item automatically
      const newQuantity = (parseFloat(existingItem.quantity) || 0) + 1;
      onSubmit({
        ...existingItem,
        quantity: newQuantity,
      });
      // Reset form and reopen scanner for next scan
      setTimeout(() => {
        setFormData({
          name: '',
          quantity: '1',
          unit: '',
          category: '',
          location: '',
          vehicleIds: [],
          alertThreshold: '',
        });
        setShowBarcodeScanner(true);
      }, 300);
    } else {
      // New item - autofill form and return to form screen
      setFormData({
        ...formData,
        name: productData.name,
        category: productData.category,
        unit: productData.unit || 'units',
        quantity: '1',
      });
      setLastScannedBarcode(productData.barcode);
      setShowBarcodeScanner(false);
      // User can now review and edit the form, or submit
    }
  };

  const handleSubmit = () => {
    if (!formData.name) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }
    onSubmit({
      ...formData,
      quantity: formData.quantity ? parseFloat(formData.quantity) : 1,
      alertThreshold: formData.alertThreshold ? parseFloat(formData.alertThreshold) : null,
      vehicleIds: formData.vehicleIds || [],
    });
  };

  return (
    <Modal
      visible={true}
      animationType="none"
      transparent={true}
      onRequestClose={() => handleAnimatedClose(onCancel)}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim, width: '100%' }]}>
        <Animated.View style={{ flex: 1, width: '100%', justifyContent: 'flex-end', transform: [{ translateY: slideAnim }] }}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{isEditing ? 'Edit Inventory Item' : 'Add Inventory Item'}</Text>
            <View style={styles.headerButtons}>
              {isEditing && (
                <TouchableOpacity style={styles.headerSaveButton} onPress={handleSubmit}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.headerSaveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => handleAnimatedClose(onCancel)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? -150 : 20}
          >
            <ScrollView 
              style={styles.content} 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
            {/* Barcode Scanner */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Scan Barcode</Text>
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => setShowBarcodeScanner(true)}
              >
                <Ionicons name="barcode-outline" size={24} color="#0066cc" />
                <Text style={styles.scanButtonText}>Scan Product Barcode</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Add - Common Items */}
            <View style={styles.formGroup}>
              <View style={styles.quickAddHeader}>
                <Text style={styles.label}>Quick Add (Common Items)</Text>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setShowCleaningProducts(!showCleaningProducts)}
                >
                  <Ionicons 
                    name={showCleaningProducts ? "eye" : "eye-off"} 
                    size={18} 
                    color="#0066cc" 
                  />
                  <Text style={styles.toggleButtonText}>
                    {showCleaningProducts ? 'Hide' : 'Show'} Cleaning Products
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowCommonItemsPicker(true)}
              >
                <Text style={[styles.pickerButtonText, !formData.name && styles.pickerButtonPlaceholder]}>
                  {formData.name || 'Select a common item to auto-fill...'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#b0b0b0" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Item Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="e.g., Motor Oil 5W-30"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={formData.quantity}
                onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                placeholder="1"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Unit</Text>
              <TextInput
                style={styles.input}
                value={formData.unit}
                onChangeText={(text) => setFormData({ ...formData, unit: text })}
                placeholder="e.g., quarts, units, bottles"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                value={formData.category}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
                placeholder="e.g., Fluids, Filters, Parts"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                placeholder="Where is this stored?"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Low Stock Alert Threshold (Optional)</Text>
              <Text style={styles.helpText}>
                Get notified when quantity falls at or below this value
              </Text>
              <TextInput
                style={styles.input}
                value={formData.alertThreshold}
                onChangeText={(text) => setFormData({ ...formData, alertThreshold: text })}
                placeholder="e.g., 2"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>

            {/* Vehicle Selection */}
            {vehicles && vehicles.length > 0 && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Assign to Vehicle(s) (Optional)</Text>
                <Text style={styles.helpText}>
                  Select specific vehicles if this item is only for those vehicles. Leave empty for general use.
                </Text>
                <View style={styles.vehicleCheckboxes}>
                  {vehicles.map(vehicle => (
                    <TouchableOpacity
                      key={vehicle.id}
                      style={[
                        styles.vehicleCheckbox,
                        formData.vehicleIds.includes(vehicle.id) && styles.vehicleCheckboxSelected
                      ]}
                      onPress={() => {
                        const currentIds = formData.vehicleIds || [];
                        const newIds = currentIds.includes(vehicle.id)
                          ? currentIds.filter(id => id !== vehicle.id)
                          : [...currentIds, vehicle.id];
                        setFormData({ ...formData, vehicleIds: newIds });
                      }}
                    >
                      <Ionicons
                        name={formData.vehicleIds.includes(vehicle.id) ? "checkbox" : "checkbox-outline"}
                        size={20}
                        color={formData.vehicleIds.includes(vehicle.id) ? "#0066cc" : "#666"}
                      />
                      <Text style={[
                        styles.vehicleCheckboxText,
                        formData.vehicleIds.includes(vehicle.id) && styles.vehicleCheckboxTextSelected
                      ]}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            </ScrollView>
          </KeyboardAvoidingView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => handleAnimatedClose(onCancel)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            {lastScannedBarcode && !isEditing && (
              <TouchableOpacity 
                style={styles.scanAndAddButton} 
                onPress={() => {
                  // Validate and submit the current item
                  if (!formData.name) {
                    Alert.alert('Error', 'Please enter an item name');
                    return;
                  }
                  
                  // Submit the item
                  onSubmit({
                    ...formData,
                    quantity: formData.quantity ? parseFloat(formData.quantity) : 1,
                    alertThreshold: formData.alertThreshold ? parseFloat(formData.alertThreshold) : null,
                    vehicleIds: formData.vehicleIds || [],
                  });
                  
                  // Reset form and reopen scanner immediately
                  setFormData({
                    name: '',
                    quantity: '1',
                    unit: '',
                    category: '',
                    location: '',
                    vehicleIds: [],
                    alertThreshold: '',
                  });
                  setLastScannedBarcode(null);
                  
                  // Open scanner right away
                  setShowBarcodeScanner(true);
                }}
              >
                <Ionicons name="barcode-outline" size={18} color="#fff" />
                <Text style={styles.scanAndAddButtonText}>Add & Scan Next</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{isEditing ? 'Save Changes' : 'Add Item'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        </Animated.View>
      </Animated.View>

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        visible={showBarcodeScanner}
        onScan={handleBarcodeScan}
        onClose={() => setShowBarcodeScanner(false)}
      />

      {/* Common Items Picker Modal */}
      <Modal
        visible={showCommonItemsPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCommonItemsPicker(false)}
      >
        <Pressable 
          style={styles.pickerModalOverlay} 
          onPress={() => setShowCommonItemsPicker(false)}
        >
          <View style={styles.pickerModalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>Select Common Item</Text>
              <TouchableOpacity onPress={() => setShowCommonItemsPicker(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.pickerModalFilter}>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowCleaningProducts(!showCleaningProducts)}
              >
                <Ionicons 
                  name={showCleaningProducts ? "eye" : "eye-off"} 
                  size={18} 
                  color="#0066cc" 
                />
                <Text style={styles.toggleButtonText}>
                  {showCleaningProducts ? 'Hide' : 'Show'} Cleaning Products
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={getFilteredItems()}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => handleCommonItemSelect(item)}
                >
                  <View style={styles.pickerItemContent}>
                    <Text style={styles.pickerItemName}>{item.name}</Text>
                    <Text style={styles.pickerItemCategory}>
                      {item.category} • {item.unit}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              style={styles.pickerList}
            />
          </View>
        </Pressable>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 150 : 50,
  },
  modal: {
    backgroundColor: '#2d2d2d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '75%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#4d4d4d',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerSaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066cc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  headerSaveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  keyboardView: {
    flex: 1,
    minHeight: 400,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  quickAddHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#b0b0b0',
    marginBottom: 8,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  toggleButtonText: {
    color: '#0066cc',
    fontSize: 12,
    fontWeight: '500',
  },
  scanButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#0066cc',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    minHeight: 50,
    gap: 12,
  },
  scanButtonText: {
    fontSize: 16,
    color: '#0066cc',
    fontWeight: '600',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#4d4d4d',
    borderRadius: 8,
    padding: 12,
    minHeight: 50,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  pickerButtonPlaceholder: {
    color: '#666',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#4d4d4d',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#4d4d4d',
    flexWrap: 'wrap',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#3d3d3d',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scanAndAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00aa00',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    flex: 1,
    minWidth: 140,
  },
  scanAndAddButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  pickerModalContent: {
    backgroundColor: '#2d2d2d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  pickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#4d4d4d',
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  pickerModalFilter: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  pickerList: {
    maxHeight: 400,
  },
  pickerItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  pickerItemContent: {
    flex: 1,
  },
  pickerItemName: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
    fontWeight: '500',
  },
  pickerItemCategory: {
    fontSize: 13,
    color: '#b0b0b0',
  },
  helpText: {
    fontSize: 12,
    color: '#909090',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  vehicleCheckboxes: {
    gap: 8,
    marginTop: 8,
  },
  vehicleCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#4d4d4d',
    borderRadius: 8,
    padding: 12,
    gap: 10,
  },
  vehicleCheckboxSelected: {
    borderColor: '#0066cc',
    backgroundColor: '#1a3a5c',
  },
  vehicleCheckboxText: {
    fontSize: 14,
    color: '#b0b0b0',
    flex: 1,
  },
  vehicleCheckboxTextSelected: {
    color: '#ffffff',
    fontWeight: '500',
  },
});
