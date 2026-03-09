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
import { theme } from '../theme';

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
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={notificationsEnabled ? theme.colors.textPrimary : theme.colors.textSecondary}
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
                color={isPro ? theme.colors.successBright : theme.colors.primary}
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
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
              <Ionicons name={opt.icon} size={22} color={appContext?.userPersona === opt.key ? theme.colors.textPrimary : theme.colors.primary} />
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
              <Ionicons name="refresh" size={24} color={theme.colors.primary} />
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Restart Onboarding</Text>
                <Text style={styles.actionDescription}>
                  Go through the setup flow again to add more vehicles
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  sectionDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  option: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  optionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryDark,
  },
  optionTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  optionDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.lg,
  },
  toggleLabel: {
    flex: 1,
    marginRight: theme.spacing.lg,
  },
  toggleTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  toggleDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  subscriptionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    gap: theme.spacing.md,
  },
  subscriptionText: {
    flex: 1,
  },
  subscriptionTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subscriptionDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    gap: theme.spacing.md,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  actionDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});
