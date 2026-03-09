import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert, AppState, LogBox, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { scanReceipt } from './src/utils/receiptScanService';
import { copyToPermanentStorage } from './src/utils/fileStorage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { storage } from './src/utils/storage';
import { addMileageEntry, isMonthlyMileageUpdateDue, isTwoWeekMileageUpdateDue } from './src/utils/mileageTracking';
import { deductConsumables, getDeductionMessage } from './src/utils/autoDeduction';
import { formatDistanceWithSeparators } from './src/utils/unitConverter';
import { recordOnboardingCompletion, startSession, saveSessionTime, shouldShowPaywall, markPaywallShown } from './src/utils/appUsageTracking';
import { presentPaywallIfNeeded } from './src/utils/paywall';
import * as Notifications from 'expo-notifications';
import { initializeRevenueCat } from './src/utils/revenueCat';

// Screens - we'll create these
import VehiclesScreen from './src/screens/VehiclesScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import PastDueScreen from './src/screens/PastDueScreen';
import SavingsScreen from './src/screens/SavingsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import VehicleDetailScreen from './src/screens/VehicleDetailScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import DiagnosticScreen from './src/screens/DiagnosticScreen';
import WarningLightsScreen from './src/screens/WarningLightsScreen';

// New onboarding screens
import QuickAddScreen from './src/screens/onboarding/QuickAddScreen';
import MaintenanceBaselineScreen from './src/screens/onboarding/MaintenanceBaselineScreen';
import PersonaSelectScreen from './src/screens/onboarding/PersonaSelectScreen';
import HealthScoreRevealScreen from './src/screens/onboarding/HealthScoreRevealScreen';
import { ThemeProvider, theme } from './src/theme';
import { getVehicleDefaults } from './src/utils/vehicleDefaults';
import { mapOilChangeAnswer, estimateOilChangeMileage } from './src/utils/healthScore';

// Modals
import VehicleFormModal from './src/components/VehicleFormModal';
import MaintenanceFormModal from './src/components/MaintenanceFormModal';
import InventoryFormModal from './src/components/InventoryFormModal';
import MileageUpdateModal from './src/components/MileageUpdateModal';
import BorrowItemModal from './src/components/BorrowItemModal';
import ServiceHistoryPromptModal from './src/components/ServiceHistoryPromptModal';
import ReceiptConfidenceModal from './src/components/ReceiptConfidenceModal';
import ReceiptPartsFollowUpModal from './src/components/ReceiptPartsFollowUpModal';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Ignore customLogHandler errors (these are internal React Native/Expo logging issues)
LogBox.ignoreLogs([
  'customLogHandler is not a function',
  'customLogHandler is not a function (it is undefined)',
]);

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function VehiclesStack({ appContext }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="VehiclesList" 
        options={{ 
          title: appContext.vehicles.length === 1 ? 'Vehicle' : 'Vehicles' 
        }}
      >
        {(props) => <VehiclesScreen {...props} appContext={appContext} />}
      </Stack.Screen>
      <Stack.Screen name="VehicleDetail" options={{ title: 'Vehicle Details' }}>
        {(props) => <VehicleDetailScreen {...props} appContext={appContext} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Subscription" 
        options={{ 
          title: 'Subscription',
          presentation: 'modal',
        }}
      >
        {(props) => <SubscriptionScreen {...props} appContext={appContext} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function DiagnosticsStack({ appContext }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="DiagnosticsMain" 
        options={{ headerShown: false }}
      >
        {(props) => <DiagnosticScreen {...props} appContext={appContext} />}
      </Stack.Screen>
      <Stack.Screen 
        name="WarningLights" 
        options={{ 
          title: 'Warning Lights',
          presentation: 'card',
        }}
      >
        {() => <WarningLightsScreen />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}


export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [todos, setTodos] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // New onboarding flow state
  const [onboardingPhase, setOnboardingPhase] = useState(null); // null=loading, 'quickAdd','baseline','persona','reveal','completed'
  const [onboardingVehicle, setOnboardingVehicle] = useState(null); // partial vehicle being built during onboarding
  const [onboardingBaseline, setOnboardingBaseline] = useState(null); // baseline answers
  const [userPersona, setUserPersona] = useState(null);
  
  // Modal states
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showMileagePrompt, setShowMileagePrompt] = useState(null);
  const [showMileageModal, setShowMileageModal] = useState(false);
  const [mileageModalVehicle, setMileageModalVehicle] = useState(null);
  
  // Editing states
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [editingInventory, setEditingInventory] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowingItem, setBorrowingItem] = useState(null);
  const [serviceHistoryPromptVehicle, setServiceHistoryPromptVehicle] = useState(null);
  const [receiptScanState, setReceiptScanState] = useState(null);
  const [maintenanceFormPrefill, setMaintenanceFormPrefill] = useState(null);
  const [receiptScanLoading, setReceiptScanLoading] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const savedVehicles = await storage.getAsync('vehicles') || [];
        const savedInventory = await storage.getAsync('inventory') || [];
        const savedTodos = await storage.getAsync('todos') || [];
        const savedShoppingList = await storage.getAsync('shoppingList') || [];
        const onboardingCompleted = await storage.getAsync('onboardingCompleted');
        const savedPhase = await storage.getAsync('onboardingPhase');
        const savedPersona = await storage.getAsync('userPersona');

        setVehicles(savedVehicles);
        setInventory(savedInventory);
        setTodos(savedTodos);
        setShoppingList(savedShoppingList);
        if (savedPersona) setUserPersona(savedPersona);

        // Determine onboarding state: backward compat + new flow
        if (onboardingCompleted || savedPhase === 'completed') {
          setOnboardingPhase('completed');
          await startSession();
        } else if (savedPhase) {
          setOnboardingPhase(savedPhase);
        } else {
          setOnboardingPhase('quickAdd');
        }
        
        // Request notification permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        // Initialize RevenueCat (always initialize, not just after onboarding)
        try {
          const revenueCatResult = await initializeRevenueCat();
          if (__DEV__ && revenueCatResult.success) {
            console.log('RevenueCat initialized successfully');
          }
        } catch (error) {
          if (__DEV__) {
            console.warn('RevenueCat initialization failed:', error);
          }
        }
        
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsReady(true);
      }
    };
    
    initApp();
  }, []);

  // Handle app state changes to track session time
  useEffect(() => {
    if (!isReady || showWelcome || showOnboarding) return;

    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App going to background - save current session time
        await saveSessionTime();
      } else if (nextAppState === 'active') {
        // App coming to foreground - start new session
        await startSession();
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [isReady, showOnboarding]);

  // Track app usage and show paywall after 3 minutes
  useEffect(() => {
    if (!isReady || showWelcome || showOnboarding) return;

    let intervalId = null;
    let checkIntervalId = null;

    const checkAndShowPaywall = async () => {
      try {
        const shouldShow = await shouldShowPaywall();
        if (shouldShow) {
          // Show paywall
          const result = await presentPaywallIfNeeded({
            requiredEntitlementIdentifier: 'Pop the Hood Pro'
          });

          if (result.success && (result.purchased || result.restored)) {
            // User purchased or restored - mark paywall as shown
            await markPaywallShown();
          } else if (result.success && result.cancelled) {
            // User cancelled - mark as shown so we don't keep pestering
            await markPaywallShown();
          } else if (result.success && result.notPresented) {
            // Paywall not presented (user already has pro) - mark as shown
            await markPaywallShown();
          }
        }
      } catch (error) {
        if (__DEV__) {
          console.error('Error checking/showing paywall:', error);
        }
      }
    };

    // Save session time periodically (every 30 seconds)
    const saveSessionPeriodically = async () => {
      try {
        await saveSessionTime();
      } catch (error) {
        if (__DEV__) {
          console.error('Error saving session time:', error);
        }
      }
    };

    // Check for paywall every 10 seconds
    checkIntervalId = setInterval(checkAndShowPaywall, 10 * 1000);
    
    // Save session time every 30 seconds
    intervalId = setInterval(saveSessionPeriodically, 30 * 1000);

    // Initial check
    checkAndShowPaywall();

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (checkIntervalId) clearInterval(checkIntervalId);
      // Save session time one last time
      saveSessionTime().catch(err => {
        if (__DEV__) {
          console.error('Error saving session time on cleanup:', err);
        }
      });
    };
  }, [isReady, showOnboarding]);

  // Handle notification taps
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data && data.type === 'mileageReminder' && data.vehicleId) {
        const vehicle = vehicles.find(v => v.id === data.vehicleId);
        if (vehicle) {
          setMileageModalVehicle(vehicle);
          setShowMileageModal(true);
        }
      }
    });

    return () => subscription.remove();
  }, [vehicles]);

  // Check for monthly mileage updates
  useEffect(() => {
    if (vehicles.length === 0 || showMileagePrompt) return;
    const vehicleNeedingUpdate = vehicles.find(vehicle => 
      isMonthlyMileageUpdateDue(vehicle)
    );
    if (vehicleNeedingUpdate) {
      setShowMileagePrompt(vehicleNeedingUpdate);
    }
  }, [vehicles, showMileagePrompt]);

  // Check for return reminders
  useEffect(() => {
    const checkReturnReminders = async () => {
      if (inventory.length === 0) return;
      const notificationsEnabled = await storage.getAsync('notificationsEnabled');
      if (!notificationsEnabled) return;

      const borrowedItems = inventory.filter(item => 
        item.isBorrowed === true && item.returnReminderDate
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const item of borrowedItems) {
        const reminderDate = new Date(item.returnReminderDate);
        reminderDate.setHours(0, 0, 0, 0);

        if (reminderDate <= today) {
          const daysOverdue = Math.floor((today - reminderDate) / (1000 * 60 * 60 * 24));
          const notificationKey = `returnReminder_${item.id}_${today.toISOString().split('T')[0]}`;
          const alreadyNotified = await storage.getAsync(notificationKey);
          
          if (!alreadyNotified) {
            const message = daysOverdue === 0
              ? `Time to check in! ${item.borrowedBy} borrowed "${item.name}" 7 days ago.`
              : `${item.borrowedBy} borrowed "${item.name}" ${7 + daysOverdue} days ago. Return reminder is ${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue.`;

            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Return Reminder',
                body: message,
                sound: true,
              },
              trigger: null,
            });

            await storage.set(notificationKey, true);
          }
        }
      }
    };

    checkReturnReminders();
    const interval = setInterval(checkReturnReminders, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [inventory]);

  // Check for low stock alerts
  useEffect(() => {
    const checkLowStock = async () => {
      if (inventory.length === 0) return;
      const notificationsEnabled = await storage.getAsync('notificationsEnabled');
      if (!notificationsEnabled) return;

      const today = new Date().toISOString().split('T')[0];
      
      for (const item of inventory) {
        if (!item.alertThreshold || item.alertThreshold === '') continue;
        
        const quantity = parseFloat(item.quantity) || 0;
        const threshold = parseFloat(item.alertThreshold) || 0;
        
        if (quantity <= threshold) {
          const notificationKey = `lowStock_${item.id}_${today}`;
          const alreadyNotified = await storage.getAsync(notificationKey);
          
          if (!alreadyNotified) {
            const message = `"${item.name}" is running low! Current stock: ${quantity} ${item.unit || 'units'} (Alert threshold: ${threshold})`;

            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Low Stock Alert',
                body: message,
                sound: true,
              },
              trigger: null,
            });

            await storage.set(notificationKey, true);
          }
        }
      }
    };

    checkLowStock();
    const interval = setInterval(checkLowStock, 60 * 60 * 1000); // Check every hour
    return () => clearInterval(interval);
  }, [inventory]);

  // Check for 2-week mileage update reminders
  useEffect(() => {
    const checkMileageReminders = async () => {
      if (vehicles.length === 0) return;
      const notificationsEnabled = await storage.getAsync('notificationsEnabled');
      if (!notificationsEnabled) return;

      const today = new Date().toISOString().split('T')[0];
      
      for (const vehicle of vehicles) {
        if (isTwoWeekMileageUpdateDue(vehicle)) {
          const notificationKey = `mileageReminder_${vehicle.id}_${today}`;
          const alreadyNotified = await storage.getAsync(notificationKey);
          
          if (!alreadyNotified) {
            const vehicleName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
            const currentMileage = vehicle.mileage ? formatDistanceWithSeparators(vehicle.mileage) : 'unknown';
            const message = `It's been 2 weeks since you last updated the mileage for your ${vehicleName}. Current mileage: ${currentMileage}. Tap to update!`;

            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Mileage Update Reminder',
                body: message,
                sound: true,
                data: { vehicleId: vehicle.id, type: 'mileageReminder' },
              },
              trigger: null,
            });

            await storage.set(notificationKey, true);
          }
        }
      }
    };

    checkMileageReminders();
    const interval = setInterval(checkMileageReminders, 60 * 60 * 1000); // Check every hour
    return () => clearInterval(interval);
  }, [vehicles]);

  const saveVehicles = async (updatedVehicles) => {
    setVehicles(updatedVehicles);
    const success = await storage.set('vehicles', updatedVehicles);
    if (!success) {
      const previousVehicles = await storage.getAsync('vehicles') || vehicles;
      setVehicles(previousVehicles);
      return false;
    }
    return true;
  };

  const saveInventory = async (updatedInventory) => {
    setInventory(updatedInventory);
    await storage.set('inventory', updatedInventory);
  };

  const saveTodos = async (updatedTodos) => {
    setTodos(updatedTodos);
    await storage.set('todos', updatedTodos);
  };

  const saveShoppingList = async (updatedList) => {
    setShoppingList(updatedList);
    await storage.set('shoppingList', updatedList);
  };

  const addVehicle = (vehicle) => {
    const newVehicle = {
      ...vehicle,
      id: Date.now().toString(),
      maintenanceRecords: [],
      createdAt: new Date().toISOString(),
      mileageLastUpdated: vehicle.mileage ? new Date().toISOString() : null,
      mileageHistory: vehicle.mileage ? [{
        date: new Date().toISOString(),
        mileage: parseInt(vehicle.mileage) || 0
      }] : [],
      // Service history status set by user in Service History prompt (current | unknown)
      maintenanceHistoryStatus: undefined
    };
    const updated = [...vehicles, newVehicle];
    saveVehicles(updated);
    setShowVehicleForm(false);
    setEditingVehicle(null);
    setServiceHistoryPromptVehicle(newVehicle);
  };

  const handleServiceHistoryChoice = (vehicleId, status) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
      setServiceHistoryPromptVehicle(null);
      return;
    }
    if (status === 'current') {
      const serviceIntervals = vehicle.serviceIntervals || {};
      const estimatedLastService = {};
      const currentDate = new Date().toISOString();
      Object.keys(serviceIntervals).forEach(serviceType => {
        if (serviceIntervals[serviceType]) {
          estimatedLastService[serviceType] = currentDate;
        }
      });
      updateVehicle(vehicleId, {
        maintenanceHistoryStatus: 'current',
        estimatedLastService: Object.keys(estimatedLastService).length > 0 ? estimatedLastService : undefined
      });
    } else {
      updateVehicle(vehicleId, { maintenanceHistoryStatus: 'unknown' });
    }
    setServiceHistoryPromptVehicle(null);
  };

  const openMaintenanceFormWithReceiptPrefill = (result) => {
    if (vehicles.length === 0) {
      Alert.alert('Add a Vehicle First', 'You need at least one vehicle to log maintenance.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    setMaintenanceFormPrefill({
      type: 'Repair',
      date: today,
      cost: result?.totalCost ?? '',
      mileage: result?.mileage != null ? String(result.mileage) : '',
    });
    if (!selectedVehicle && vehicles.length > 0) {
      setSelectedVehicle(vehicles[0]);
    }
    setShowMaintenanceForm(true);
    setEditingMaintenance(null);
  };

  const launchReceiptScan = async (source) => {
    Alert.alert(
      'Scan Receipt',
      'Choose how to capture the receipt',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            try {
              const { status } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission Required', 'Camera permission is needed to scan receipts.');
                return;
              }
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaType?.Images ?? 'images',
                allowsEditing: true,
                quality: 0.8,
              });
              if (!result.canceled && result.assets?.[0]?.uri) {
                await runReceiptScan(result.assets[0].uri, source);
              }
            } catch (e) {
              setReceiptScanLoading(false);
              Alert.alert('Error', e.message || 'Failed to take photo.');
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            try {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaType?.Images ?? 'images',
                allowsEditing: true,
                quality: 0.8,
              });
              if (!result.canceled && result.assets?.[0]?.uri) {
                await runReceiptScan(result.assets[0].uri, source);
              }
            } catch (e) {
              setReceiptScanLoading(false);
              Alert.alert('Error', e.message || 'Failed to pick image.');
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const runReceiptScan = async (imageUri, source) => {
    setReceiptScanLoading(true);
    try {
      const permanentUri = await copyToPermanentStorage(imageUri, 'receipts');
      const result = await scanReceipt(permanentUri);
      setReceiptScanLoading(false);
      if (result.hasMileage) {
        openMaintenanceFormWithReceiptPrefill(result);
        setReceiptScanState(null);
      } else {
        setReceiptScanState({
          step: 'confidence',
          result: { mileage: result.mileage, totalCost: result.totalCost },
          imageUri: permanentUri,
        });
      }
    } catch (e) {
      setReceiptScanLoading(false);
      Alert.alert('Receipt Scan Failed', e.message || 'Could not read the receipt. Try better lighting or a clearer photo.');
    }
  };

  const handleReceiptConfidenceParts = () => {
    setReceiptScanState(prev => (prev ? { ...prev, step: 'parts_followup' } : null));
  };

  const handleReceiptConfidenceService = () => {
    const result = receiptScanState?.result;
    openMaintenanceFormWithReceiptPrefill(result || {});
    setReceiptScanState(null);
  };

  const handleReceiptPartsAddToInventory = () => {
    setReceiptScanState(null);
    setShowInventoryForm(true);
    setEditingInventory(null);
  };

  const handleReceiptPartsInstallNow = () => {
    const result = receiptScanState?.result;
    openMaintenanceFormWithReceiptPrefill(result || {});
    setReceiptScanState(null);
  };

  const updateVehicle = (id, updates) => {
    const updated = vehicles.map(v => 
      v.id === id ? { 
        ...v, 
        ...updates, 
        maintenanceRecords: v.maintenanceRecords || [],
        vehicleImage: updates.vehicleImage !== undefined ? updates.vehicleImage : (v.vehicleImage || v.images?.[0]?.data || v.images?.find(img => img.id === v.featuredImageId)?.data || null)
      } : v
    );
    const success = saveVehicles(updated);
    if (success) {
      setShowVehicleForm(false);
      setEditingVehicle(null);
    }
    return success;
  };

  const deleteVehicle = (id) => {
    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = vehicles.filter(v => v.id !== id);
            saveVehicles(updated);
          }
        }
      ]
    );
  };

  const getLastServiceMileage = (vehicle, serviceType, lastServiceDate) => {
    if (!lastServiceDate) return null;
    const records = vehicle.maintenanceRecords || [];
    const serviceRecords = records.filter(r => {
      if (!r.type) return false;
      const recordType = r.type.toLowerCase();
      if (serviceType === 'oilChange') return recordType.includes('oil');
      if (serviceType === 'tireRotation') return recordType.includes('tire') || recordType.includes('rotation');
      if (serviceType === 'brakeInspection') return recordType.includes('brake');
      if (serviceType === 'airFilter' || serviceType === 'cabinFilter') return recordType.includes('filter');
      if (serviceType === 'sparkPlugs') return recordType.includes('spark');
      if (serviceType === 'transmission') return recordType.includes('transmission');
      if (serviceType === 'coolant') return recordType.includes('coolant');
      if (serviceType === 'brakeFluid') return recordType.includes('brake') && recordType.includes('fluid');
      return false;
    });

    if (serviceRecords.length > 0) {
      const lastServiceDateObj = new Date(lastServiceDate);
      const sortedRecords = serviceRecords.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const diffA = Math.abs(dateA - lastServiceDateObj);
        const diffB = Math.abs(dateB - lastServiceDateObj);
        return diffA - diffB;
      });
      if (sortedRecords[0].mileage) {
        return parseInt(sortedRecords[0].mileage);
      }
    }

    const currentMileage = parseInt(vehicle.mileage) || 0;
    const daysSince = (new Date() - lastServiceDate) / (1000 * 60 * 60 * 24);
    const createdAt = vehicle.createdAt ? new Date(vehicle.createdAt) : new Date();
    const daysSinceCreation = (new Date() - createdAt) / (1000 * 60 * 60 * 24);
    const estimatedMilesPerDay = daysSinceCreation > 0 ? currentMileage / daysSinceCreation : 0;
    return Math.max(0, currentMileage - (estimatedMilesPerDay * daysSince));
  };

  const addMaintenance = (vehicleId, maintenance) => {
    const maintenanceMileage = maintenance.mileage !== null && maintenance.mileage !== undefined
      ? Math.round(parseFloat(maintenance.mileage))
      : null;
    const vehicle = vehicles.find(v => v.id === vehicleId);
    const vehicleMileage = vehicle?.mileage ? parseFloat(vehicle.mileage) : 0;
    
    const newMaintenance = {
      ...maintenance,
      id: Date.now().toString(),
      date: maintenance.date || new Date().toISOString().split('T')[0],
      mileage: maintenanceMileage
    };
    
    const updated = vehicles.map(v => {
      if (v.id === vehicleId) {
        let updatedVehicle = { 
          ...v, 
          maintenanceRecords: [...(v.maintenanceRecords || []), newMaintenance] 
        };
        
        if (maintenanceMileage && maintenanceMileage > vehicleMileage) {
          updatedVehicle.mileage = maintenanceMileage.toString();
        }
        
        // Auto-clear reminders (same logic as original)
        if (maintenance.type && maintenanceMileage !== null) {
          const serviceTypeMap = {
            'Oil Change': 'oilChange',
            'Tire Rotation': 'tireRotation',
            'Brake Service': 'brakeInspection',
            'Filter Replacement': ['airFilter', 'cabinFilter'],
            'Cabin Air Filter': 'cabinFilter',
            'Engine Air Filter': 'airFilter',
            'Spark Plugs': 'sparkPlugs',
            'Transmission Service': 'transmission',
            'Coolant Flush': 'coolant',
            'Brake Fluid Change': 'brakeFluid',
            'Fluid Top-off': ['coolant', 'brakeFluid']
          };
          
          const matchedServiceTypes = serviceTypeMap[maintenance.type];
          if (matchedServiceTypes) {
            const serviceTypesToClear = Array.isArray(matchedServiceTypes) ? matchedServiceTypes : [matchedServiceTypes];
            const updatedIgnored = { ...(updatedVehicle.ignoredReminders || {}) };
            const updatedEstimates = { ...(updatedVehicle.estimatedLastService || {}) };
            const maintenanceDate = new Date(newMaintenance.date);
            
            serviceTypesToClear.forEach(serviceType => {
              // Clear ignored status since service was completed
              delete updatedIgnored[serviceType];
              
              // Always update the last service date to clear ALL alerts of this type
              // regardless of mileage or interval - if the service is done, clear all alerts
              updatedEstimates[serviceType] = maintenanceDate.toISOString();
            });
            
            updatedVehicle.ignoredReminders = Object.keys(updatedIgnored).length > 0 ? updatedIgnored : undefined;
            updatedVehicle.estimatedLastService = Object.keys(updatedEstimates).length > 0 ? updatedEstimates : undefined;
          }
        }
        
        return updatedVehicle;
      }
      return v;
    });
    
    saveVehicles(updated);
    
    // Handle auto-deduction
    if (maintenance.autoDeduct && maintenance.type) {
      const result = deductConsumables(maintenance.type, inventory, vehicleId, vehicle);
      if (result.deductedItems.length > 0 || result.warnings.length > 0) {
        saveInventory(result.updatedInventory);
        const message = getDeductionMessage(result.deductedItems, result.warnings);
        if (message) {
          Alert.alert('Inventory Updated', message);
        }
      }
    }
    
    setShowMaintenanceForm(false);
    setSelectedVehicle(null);
    setEditingMaintenance(null);
  };

  const updateMaintenance = (vehicleId, maintenanceId, maintenance) => {
    const maintenanceMileage = maintenance.mileage !== null && maintenance.mileage !== undefined
      ? Math.round(parseFloat(maintenance.mileage))
      : null;
    const vehicle = vehicles.find(v => v.id === vehicleId);
    const vehicleMileage = vehicle?.mileage ? parseFloat(vehicle.mileage) : 0;
    
    const updated = vehicles.map(v => {
      if (v.id === vehicleId) {
        let updatedVehicle = {
          ...v, 
          maintenanceRecords: (v.maintenanceRecords || []).map(m => 
            m.id === maintenanceId 
              ? { ...maintenance, id: maintenanceId, mileage: maintenanceMileage }
              : m
          )
        };
        
        if (maintenanceMileage && maintenanceMileage > vehicleMileage) {
          updatedVehicle.mileage = maintenanceMileage.toString();
        }
        
        // Same auto-clear logic as addMaintenance
        if (maintenance.type && maintenanceMileage !== null) {
          const serviceTypeMap = {
            'Oil Change': 'oilChange',
            'Tire Rotation': 'tireRotation',
            'Brake Service': 'brakeInspection',
            'Filter Replacement': ['airFilter', 'cabinFilter'],
            'Cabin Air Filter': 'cabinFilter',
            'Engine Air Filter': 'airFilter',
            'Spark Plugs': 'sparkPlugs',
            'Transmission Service': 'transmission',
            'Coolant Flush': 'coolant',
            'Brake Fluid Change': 'brakeFluid',
            'Fluid Top-off': ['coolant', 'brakeFluid']
          };
          
          const matchedServiceTypes = serviceTypeMap[maintenance.type];
          if (matchedServiceTypes) {
            const serviceTypesToClear = Array.isArray(matchedServiceTypes) ? matchedServiceTypes : [matchedServiceTypes];
            const updatedIgnored = { ...(updatedVehicle.ignoredReminders || {}) };
            const updatedEstimates = { ...(updatedVehicle.estimatedLastService || {}) };
            const maintenanceDate = new Date(maintenance.date);
            
            serviceTypesToClear.forEach(serviceType => {
              // Clear ignored status since service was completed
              delete updatedIgnored[serviceType];
              
              // Always update the last service date to clear ALL alerts of this type
              // regardless of mileage or interval - if the service is done, clear all alerts
              updatedEstimates[serviceType] = maintenanceDate.toISOString();
            });
            
            updatedVehicle.ignoredReminders = Object.keys(updatedIgnored).length > 0 ? updatedIgnored : undefined;
            updatedVehicle.estimatedLastService = Object.keys(updatedEstimates).length > 0 ? updatedEstimates : undefined;
          }
        }
        
        return updatedVehicle;
      }
      return v;
    });
    
    saveVehicles(updated);
    setShowMaintenanceForm(false);
    setEditingMaintenance(null);
    setSelectedVehicle(null);
  };

  const deleteMaintenance = (vehicleId, maintenanceId) => {
    const updated = vehicles.map(v => 
      v.id === vehicleId 
        ? { ...v, maintenanceRecords: (v.maintenanceRecords || []).filter(m => m.id !== maintenanceId) }
        : v
    );
    saveVehicles(updated);
  };

  const addInventoryItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      vehicleIds: item.vehicleIds || []
    };
    const updated = [...inventory, newItem];
    saveInventory(updated);
    setShowInventoryForm(false);
    setEditingInventory(null);
  };

  const updateInventoryItem = (id, updates) => {
    const updated = inventory.map(item => 
      item.id === id ? { ...item, ...updates, vehicleIds: updates.vehicleIds || item.vehicleIds || [] } : item
    );
    saveInventory(updated);
    setShowInventoryForm(false);
    setEditingInventory(null);
  };

  const lendInventoryItem = (id, borrowData) => {
    const updated = inventory.map(item => 
      item.id === id ? { ...item, ...borrowData } : item
    );
    saveInventory(updated);
    setShowBorrowModal(false);
    setBorrowingItem(null);
  };

  const returnInventoryItem = (id) => {
    const updated = inventory.map(item => 
      item.id === id ? {
        ...item,
        isBorrowed: false,
        borrowedBy: null,
        borrowedDate: null,
        returnReminderDate: null,
        borrowedPhoto: null,
        contactPhone: null,
        contactEmail: null,
        notes: null
      } : item
    );
    saveInventory(updated);
  };

  const deleteInventoryItem = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = inventory.filter(item => item.id !== id);
            saveInventory(updated);
          }
        }
      ]
    );
  };

  const addTodo = (todo) => {
    const newTodo = {
      ...todo,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [...todos, newTodo];
    saveTodos(updated);
  };

  const updateTodo = (id, updates) => {
    const updated = todos.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    );
    saveTodos(updated);
  };

  const deleteTodo = (id) => {
    const updated = todos.filter(todo => todo.id !== id);
    saveTodos(updated);
  };

  const toggleTodo = (id) => {
    const updated = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updated);
  };

  // Shopping list functions
  const addShoppingItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
      isAutoAdded: item.isAutoAdded || false,
    };
    const updated = [...shoppingList, newItem];
    saveShoppingList(updated);
  };

  const updateShoppingItem = (id, updates) => {
    const updated = shoppingList.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveShoppingList(updated);
  };

  const deleteShoppingItem = (id) => {
    const updated = shoppingList.filter(item => item.id !== id);
    saveShoppingList(updated);
  };

  const toggleShoppingItem = (id) => {
    const updated = shoppingList.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    saveShoppingList(updated);
  };

  const clearCompletedShoppingItems = () => {
    const updated = shoppingList.filter(item => !item.completed);
    saveShoppingList(updated);
  };

  const handleMileageUpdate = (vehicleId, newMileage, noChange = false) => {
    const updated = vehicles.map(v => {
      if (v.id === vehicleId) {
        if (noChange) {
          return {
            ...v,
            mileageLastUpdated: new Date().toISOString()
          };
        } else if (newMileage) {
          return addMileageEntry(v, newMileage);
        }
        return v;
      }
      return v;
    });
    saveVehicles(updated);
    setShowMileagePrompt(null);
    setShowMileageModal(false);
    setMileageModalVehicle(null);
  };

  const getPastDueCount = () => {
    let count = 0;
    vehicles.forEach(vehicle => {
      const intervals = vehicle.serviceIntervals || {};
      const estimates = vehicle.estimatedLastService || {};
      const ignoredReminders = vehicle.ignoredReminders || {};
      const currentMileage = parseInt(vehicle.mileage) || 0;

      Object.keys(intervals).forEach(serviceType => {
        const interval = parseInt(intervals[serviceType]);
        if (!interval) return;
        if (ignoredReminders[serviceType]) return;

        const lastService = estimates[serviceType];
        
        if (lastService === 'never') {
          if (currentMileage >= interval) count++;
          return;
        }

        if (!lastService) {
          if (currentMileage >= interval) count++;
          return;
        }

        const lastServiceDate = new Date(lastService);
        const lastServiceMileage = getLastServiceMileage(vehicle, serviceType, lastServiceDate);
        
        let nextServiceMileage;
        if (lastServiceMileage !== null && !isNaN(lastServiceMileage)) {
          nextServiceMileage = lastServiceMileage + interval;
        } else {
          nextServiceMileage = currentMileage + interval;
        }
        
        if (currentMileage >= nextServiceMileage) {
          count++;
        }
      });
    });
    return count;
  };

  if (!isReady) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
      </View>
    );
  }

  // Helper to advance onboarding phase
  const advanceToPhase = async (phase) => {
    await storage.set('onboardingPhase', phase);
    setOnboardingPhase(phase);
  };

  const completeOnboarding = async () => {
    await storage.set('onboardingPhase', 'completed');
    await storage.set('onboardingCompleted', true);
    await recordOnboardingCompletion();
    await startSession();
    setOnboardingPhase('completed');
  };

  // Build and save a vehicle from onboarding data
  const saveOnboardingVehicle = async (vehicleResult, baseline) => {
    if (!vehicleResult) return;

    const { vin, decodedData, recalls } = vehicleResult;
    const defaults = getVehicleDefaults(
      decodedData.make, decodedData.model, decodedData.year, decodedData.trim
    );

    const mileage = baseline?.mileage || null;
    const now = new Date().toISOString();

    // Build initial maintenance records from baseline answers
    // This gives the oil life calculator an actual mileage to work from
    const initialRecords = [];
    if (baseline?.estimatedLastOilChange && baseline.estimatedLastOilChange !== '6plus' && mileage) {
      const estMileage = estimateOilChangeMileage(baseline.estimatedLastOilChange, mileage);
      const estDate = mapOilChangeAnswer(baseline.estimatedLastOilChange);
      if (estMileage !== null && estDate) {
        initialRecords.push({
          id: `onboarding-oil-${Date.now()}`,
          type: 'Oil Change',
          date: estDate,
          mileage: String(estMileage),
          notes: 'Estimated from onboarding',
          cost: '',
        });
      }
    }

    const newVehicle = {
      make: decodedData.make || '',
      model: decodedData.model || '',
      year: decodedData.year || '',
      trim: decodedData.trim || '',
      vin: vin || '',
      mileage: mileage ? String(mileage) : '',
      mileageHistory: mileage ? [{ date: now, mileage }] : [],
      mileageLastUpdated: mileage ? now : null,
      hasCheckEngineLight: baseline?.hasCheckEngineLight || false,
      maintenanceRecords: initialRecords,
      estimatedLastService: {
        oilChange: baseline?.estimatedLastOilChange
          ? mapOilChangeAnswer(baseline.estimatedLastOilChange)
          : null,
      },
      recalls: recalls || [],
      completedRecalls: [],
      ...(defaults || {}),
    };

    await addVehicle(newVehicle);
  };

  // New onboarding flow
  if (onboardingPhase && onboardingPhase !== 'completed') {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar style="light" />
          {onboardingPhase === 'quickAdd' && (
            <QuickAddScreen
              onVehicleDecoded={(result) => {
                setOnboardingVehicle(result);
                advanceToPhase('baseline');
              }}
              onSkip={() => {
                setOnboardingVehicle(null);
                advanceToPhase('baseline');
              }}
            />
          )}
          {onboardingPhase === 'baseline' && (
            <MaintenanceBaselineScreen
              vehicleData={onboardingVehicle}
              hasVehicle={!!onboardingVehicle}
              onContinue={(baseline) => {
                setOnboardingBaseline(baseline);
                advanceToPhase('persona');
              }}
              onBack={() => advanceToPhase('quickAdd')}
            />
          )}
          {onboardingPhase === 'persona' && (
            <PersonaSelectScreen
              onSelect={async (persona) => {
                setUserPersona(persona);
                await storage.set('userPersona', persona);
                advanceToPhase('reveal');
              }}
              onBack={() => advanceToPhase('baseline')}
            />
          )}
          {onboardingPhase === 'reveal' && (
            <HealthScoreRevealScreen
              vehicleData={onboardingVehicle}
              baselineData={onboardingBaseline}
              hasVehicle={!!onboardingVehicle}
              onEnterGarage={async () => {
                if (onboardingVehicle) {
                  await saveOnboardingVehicle(onboardingVehicle, onboardingBaseline);
                }
                await completeOnboarding();
              }}
              onAddAnother={async () => {
                if (onboardingVehicle) {
                  await saveOnboardingVehicle(onboardingVehicle, onboardingBaseline);
                }
                setOnboardingVehicle(null);
                setOnboardingBaseline(null);
                advanceToPhase('quickAdd');
              }}
              onBack={() => advanceToPhase('persona')}
            />
          )}
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  // Create app context to pass down
  const appContext = {
    vehicles,
    inventory,
    todos,
    shoppingList,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    lendInventoryItem,
    returnInventoryItem,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    addShoppingItem,
    updateShoppingItem,
    deleteShoppingItem,
    toggleShoppingItem,
    clearCompletedShoppingItems,
    setShowVehicleForm,
    setShowMaintenanceForm,
    setShowInventoryForm,
    setEditingVehicle,
    setEditingMaintenance,
    setEditingInventory,
    setSelectedVehicle,
    editingInventory,
    showVehicleForm,
    showMaintenanceForm,
    showInventoryForm,
    editingVehicle,
    editingMaintenance,
    selectedVehicle,
    showBorrowModal,
    setShowBorrowModal,
    borrowingItem,
    launchReceiptScan,
    setBorrowingItem,
    restartOnboarding: async () => {
      await storage.set('onboardingPhase', 'quickAdd');
      await storage.remove('onboardingCompleted');
      setOnboardingPhase('quickAdd');
      setOnboardingVehicle(null);
      setOnboardingBaseline(null);
    },
    userPersona,
    setUserPersona: async (persona) => {
      setUserPersona(persona);
      await storage.set('userPersona', persona);
    },
    setShowMileageModal,
    setMileageModalVehicle,
  };

  return (
    <ThemeProvider>
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.textPrimary,
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: Platform.OS === 'android' ? 10 : 12,
          },
        }}
      >
        <Tab.Screen 
          name="Vehicles" 
          options={{ 
            headerShown: false,
            tabBarLabel: vehicles.length === 1 ? 'Vehicle' : 'Vehicles',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="car" size={size} color={color} />
            ),
          }}
        >
          {() => <VehiclesStack appContext={appContext} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Garage" 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cube" size={size} color={color} />
            ),
          }}
        >
          {() => <InventoryScreen appContext={appContext} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Past Due" 
          options={{
            tabBarBadge: getPastDueCount() > 0 ? getPastDueCount() : null,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="warning" size={size} color={color} />
            ),
          }}
        >
          {(props) => <PastDueScreen {...props} appContext={appContext} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Analytics" 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        >
          {() => <SavingsScreen appContext={appContext} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Diagnostics" 
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="construct" size={size} color={color} />
            ),
          }}
        >
          {() => <DiagnosticsStack appContext={appContext} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Settings" 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        >
          {(props) => <SettingsScreen {...props} appContext={appContext} />}
        </Tab.Screen>
      </Tab.Navigator>

      {/* Modals */}
      {showVehicleForm && (
        <VehicleFormModal
          initialData={editingVehicle}
          isEditing={!!editingVehicle}
          onSubmit={(vehicle) => {
            if (editingVehicle) {
              updateVehicle(editingVehicle.id, vehicle);
            } else {
              addVehicle(vehicle);
            }
          }}
          onCancel={() => {
            setShowVehicleForm(false);
            setEditingVehicle(null);
          }}
        />
      )}

      {showMaintenanceForm && selectedVehicle && (
        <MaintenanceFormModal
          vehicle={selectedVehicle}
          initialData={editingMaintenance}
          receiptPrefill={maintenanceFormPrefill}
          isEditing={!!editingMaintenance && !!editingMaintenance.id}
          onSubmit={(maintenance) => {
            if (editingMaintenance && editingMaintenance.id) {
              updateMaintenance(selectedVehicle.id, editingMaintenance.id, maintenance);
            } else {
              addMaintenance(selectedVehicle.id, maintenance);
            }
            setMaintenanceFormPrefill(null);
          }}
          onCancel={() => {
            setShowMaintenanceForm(false);
            setEditingMaintenance(null);
            setSelectedVehicle(null);
            setMaintenanceFormPrefill(null);
          }}
          onScanReceipt={() => launchReceiptScan('maintenance')}
        />
      )}

      {showInventoryForm && (
        <InventoryFormModal
          vehicles={vehicles}
          initialData={editingInventory}
          isEditing={!!editingInventory}
          existingInventory={inventory}
          onSubmit={(item) => {
            if (editingInventory) {
              updateInventoryItem(editingInventory.id, item);
              setEditingInventory(null);
            } else {
              addInventoryItem(item);
            }
            // Don't close modal - let user continue scanning
          }}
          onCancel={() => {
            setShowInventoryForm(false);
            setEditingInventory(null);
          }}
        />
      )}

      {showMileagePrompt && (
        <MileageUpdateModal
          vehicle={showMileagePrompt}
          onUpdate={(mileage, noChange) => handleMileageUpdate(showMileagePrompt.id, mileage, noChange)}
          onSkip={() => setShowMileagePrompt(null)}
        />
      )}

      {showMileageModal && mileageModalVehicle && (
        <MileageUpdateModal
          vehicle={mileageModalVehicle}
          onUpdate={(mileage, noChange) => handleMileageUpdate(mileageModalVehicle.id, mileage, noChange)}
          onSkip={() => {
            setShowMileageModal(false);
            setMileageModalVehicle(null);
          }}
        />
      )}

      {serviceHistoryPromptVehicle && (
        <ServiceHistoryPromptModal
          vehicle={serviceHistoryPromptVehicle}
          onSelect={(status) => handleServiceHistoryChoice(serviceHistoryPromptVehicle.id, status)}
          onSkip={() => {
            handleServiceHistoryChoice(serviceHistoryPromptVehicle.id, 'unknown');
          }}
        />
      )}

      <ReceiptConfidenceModal
        visible={receiptScanState?.step === 'confidence'}
        onParts={handleReceiptConfidenceParts}
        onService={handleReceiptConfidenceService}
        onCancel={() => setReceiptScanState(null)}
      />
      <ReceiptPartsFollowUpModal
        visible={receiptScanState?.step === 'parts_followup'}
        onAddToInventory={handleReceiptPartsAddToInventory}
        onInstallNow={handleReceiptPartsInstallNow}
        onCancel={() => setReceiptScanState(null)}
      />

      {receiptScanLoading && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-only">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        </View>
      )}

      {showBorrowModal && borrowingItem && (
        <BorrowItemModal
          item={borrowingItem}
          visible={showBorrowModal}
          onLend={lendInventoryItem}
          onCancel={() => {
            setShowBorrowModal(false);
            setBorrowingItem(null);
          }}
        />
      )}
    </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
