import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../utils/storage';
import { getUnitSystem, setUnitSystem } from '../utils/unitConverter';
import { hasProEntitlement } from '../utils/revenueCat';

const PERSONA_OPTIONS = [
  { key: 'daily', label: 'The Daily', icon: 'car-outline', description: 'Fuel economy & reliability' },
  { key: 'track', label: 'The Track', icon: 'speedometer-outline', description: 'Performance & track data' },
  { key: 'project', label: 'The Project', icon: 'build-outline', description: 'Mod logs & build lists' },
];

export default function SettingsScreen({ navigation, appContext }) {
  const [unitSystem, setUnitSystemState] = useState('imperial');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const handleRestartOnboarding = () => {
    if (appContext?.restartOnboarding) {
      appContext.restartOnboarding();
    }
  };

  useEffect(() => {
    loadSettings();
    checkProStatus();
    
    // Check Pro status when screen is focused
    const unsubscribe = navigation?.addListener?.('focus', () => {
      checkProStatus();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadSettings = async () => {
    // Wait for cache to initialize if needed
    const currentSystem = getUnitSystem();
    setUnitSystemState(currentSystem);
    
    const enabled = await storage.getAsync('notificationsEnabled') || false;
    setNotificationsEnabled(enabled);
  };

  const handleUnitSystemChange = async (system) => {
    await setUnitSystem(system);
    setUnitSystemState(system);
    // Unit system changes are persisted to storage, other screens will reload on focus
  };

  const handleNotificationsToggle = async (value) => {
    setNotificationsEnabled(value);
    await storage.set('notificationsEnabled', value);
  };

  const checkProStatus = async () => {
    try {
      const proStatus = await hasProEntitlement();
      setIsPro(proStatus);
    } catch (error) {
      console.error('Error checking Pro status:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Measurement System</Text>
        <Text style={styles.sectionDescription}>
          Choose your preferred measurement system
        </Text>
        
        <TouchableOpacity
          style={[
            styles.option,
            unitSystem === 'imperial' && styles.optionActive
          ]}
          onPress={() => handleUnitSystemChange('imperial')}
        >
          <Text style={styles.optionTitle}>Imperial (US)</Text>
          <Text style={styles.optionDescription}>Miles, Quarts, ft-lb</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            unitSystem === 'metric' && styles.optionActive
          ]}
          onPress={() => handleUnitSystemChange('metric')}
        >
          <Text style={styles.optionTitle}>Metric (World Standard)</Text>
          <Text style={styles.optionDescription}>Kilometers, Liters, N⋅m</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.toggleRow}>
          <View style={styles.toggleLabel}>
            <Text style={styles.toggleTitle}>Enable Notifications</Text>
            <Text style={styles.toggleDescription}>
              Receive alerts for maintenance reminders
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
            trackColor={{ false: '#4d4d4d', true: '#0066cc' }}
            thumbColor={notificationsEnabled ? '#ffffff' : '#b0b0b0'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <TouchableOpacity
          style={styles.subscriptionCard}
          onPress={() => {
            // Navigate to Subscription screen
            // Since Subscription is in VehiclesStack, we need to navigate through the Vehicles tab
            // or use a root-level navigation
            if (navigation) {
              // Try to navigate directly first
              try {
                navigation.navigate('Subscription');
              } catch (e) {
                // If that fails, navigate to Vehicles tab first, then to Subscription
                navigation.navigate('Vehicles', { screen: 'Subscription' });
              }
            }
          }}
        >
          <View style={styles.subscriptionContent}>
            <View style={styles.subscriptionHeader}>
              <Ionicons 
                name={isPro ? "checkmark-circle" : "star"} 
                size={24} 
                color={isPro ? "#4dff4d" : "#0066cc"} 
              />
              <View style={styles.subscriptionText}>
                <Text style={styles.subscriptionTitle}>
                  {isPro ? 'Pop the Hood Pro' : 'Upgrade to Pro'}
                </Text>
                <Text style={styles.subscriptionDescription}>
                  {isPro 
                    ? 'You have access to all Pro features' 
                    : 'Unlock premium features and support development'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#b0b0b0" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Focus</Text>
        <Text style={styles.sectionDescription}>
          Choose how you primarily use your vehicles
        </Text>
        {PERSONA_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[
              styles.option,
              appContext?.userPersona === opt.key && styles.optionActive,
            ]}
            onPress={() => appContext?.setUserPersona?.(opt.key)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name={opt.icon} size={22} color={appContext?.userPersona === opt.key ? '#ffffff' : '#0066cc'} />
              <View>
                <Text style={styles.optionTitle}>{opt.label}</Text>
                <Text style={styles.optionDescription}>{opt.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Setup</Text>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={handleRestartOnboarding}
        >
          <View style={styles.actionContent}>
            <View style={styles.actionHeader}>
              <Ionicons name="refresh" size={24} color="#0066cc" />
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Restart Onboarding</Text>
                <Text style={styles.actionDescription}>
                  Go through the setup flow again to add more vehicles
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#b0b0b0" />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#b0b0b0',
    marginBottom: 16,
  },
  option: {
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#4d4d4d',
  },
  optionActive: {
    borderColor: '#0066cc',
    backgroundColor: '#1a3a5c',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 16,
  },
  toggleLabel: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  subscriptionCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  subscriptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  subscriptionText: {
    flex: 1,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  subscriptionDescription: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  actionCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#b0b0b0',
  },
});
