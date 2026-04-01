import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storage } from '../utils/storage';
import { getUnitSystem, setUnitSystem } from '../utils/unitConverter';
import { hasProEntitlement } from '../utils/revenueCat';
import { supabase, getCurrentUser, signOut, signInWithGoogle, signInWithApple, dismissAllAuthSessions } from '../utils/supabase';
import { withSignInTimeout } from '../utils/oauthSignInTimeout';
import { syncToSupabase, restoreFromSupabase, getLastSyncedAt, getCloudBackupTimestamp, deleteAllCloudData } from '../utils/sync';
import { theme } from '../theme';
import logger from '../utils/logger';

const PERSONA_OPTIONS = [
  { key: 'daily', label: 'The Daily', icon: 'car-outline', description: 'Fuel economy & reliability' },
  { key: 'track', label: 'The Track', icon: 'speedometer-outline', description: 'Performance & track data' },
  { key: 'project', label: 'The Project', icon: 'build-outline', description: 'Mod logs & build lists' },
];

export default function SettingsScreen({ navigation, appContext }) {
  const [unitSystem, setUnitSystemState] = useState('imperial');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [syncUser, setSyncUser] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  /** null | 'google' | 'apple' — spinner on the button the user tapped */
  const [oauthLoading, setOauthLoading] = useState(null);
  const [specFeedbackEnabled, setSpecFeedbackEnabled] = useState(true);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [emailSaved, setEmailSaved] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRestartOnboarding = () => {
    if (appContext?.restartOnboarding) {
      appContext.restartOnboarding();
    }
  };

  useEffect(() => {
    loadSettings();
    checkProStatus();
    loadSyncStatus();

    // Check Pro status when screen is focused
    const unsubscribe = navigation?.addListener?.('focus', () => {
      checkProStatus();
      loadSyncStatus();
    });

    return unsubscribe;
  }, [navigation]);

  const loadSettings = async () => {
    // Wait for cache to initialize if needed
    const currentSystem = getUnitSystem();
    setUnitSystemState(currentSystem);

    const enabled = await storage.getAsync('notificationsEnabled') || false;
    setNotificationsEnabled(enabled);

    const optOut = await storage.getAsync('specFeedbackOptOut');
    setSpecFeedbackEnabled(!optOut);

    const savedEmail = await storage.getAsync('subscriberEmail');
    if (savedEmail) {
      setSubscriberEmail(savedEmail);
      setEmailSaved(true);
    }
  };

  const handleEmailSubmit = async () => {
    const trimmed = subscriberEmail.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) return;
    try {
      await storage.set('subscriberEmail', trimmed);
      if (supabase) {
        await supabase.from('email_subscribers').insert({ email: trimmed, source: 'settings' });
      }
      setEmailSaved(true);
    } catch (e) {
      logger.error('Email subscribe failed:', e);
      // Still mark as saved locally even if Supabase fails
      setEmailSaved(true);
    }
  };

  const handleUnitSystemChange = async (system) => {
    await setUnitSystem(system);
    setUnitSystemState(system);
    // Unit system changes are persisted to storage, other screens will reload on focus
  };

  const handleNotificationsToggle = async (value) => {
    if (!value) {
      setNotificationsEnabled(false);
      await storage.set('notificationsEnabled', false);
      return;
    }

    try {
      let { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const req = await Notifications.requestPermissionsAsync();
        status = req.status;
      }
      if (status !== 'granted') {
        Alert.alert(
          'Notifications not allowed',
          'To get maintenance reminders, enable notifications for Pop the Hood in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
      setNotificationsEnabled(true);
      await storage.set('notificationsEnabled', true);
    } catch (e) {
      logger.error('Notification permission error:', e);
      Alert.alert('Error', 'Could not update notification settings. Please try again.');
    }
  };

  const checkProStatus = async () => {
    try {
      const proStatus = await hasProEntitlement();
      setIsPro(proStatus);
    } catch (error) {
      logger.error('Error checking Pro status:', error);
    }
  };

  const loadSyncStatus = async () => {
    try {
      const user = await getCurrentUser();
      setSyncUser(user);
      const synced = await getLastSyncedAt();
      setLastSynced(synced);
    } catch (error) {
      logger.log('Could not load sync status:', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setOauthLoading('google');
    try {
      const result = await withSignInTimeout(signInWithGoogle(), 'Google sign-in');
      if (result?.user) {
        setSyncUser(result.user);
      }
    } catch (error) {
      Alert.alert('Sign In Failed', error.message);
    } finally {
      dismissAllAuthSessions();
      setOauthLoading(null);
    }
  };

  const handleAppleSignIn = async () => {
    setOauthLoading('apple');
    try {
      const result = await withSignInTimeout(signInWithApple(), 'Apple sign-in');
      if (result?.user) {
        setSyncUser(result.user);
      }
    } catch (error) {
      Alert.alert('Sign In Failed', error.message);
    } finally {
      dismissAllAuthSessions();
      setOauthLoading(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setSyncUser(null);
      setLastSynced(null);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSyncNow = async () => {
    if (!isPro) {
      Alert.alert(
        'Pro Feature',
        'Cloud backup & sync requires Pop the Hood Pro.',
        [
          {
            text: 'Upgrade',
            onPress: () => navigation?.navigate('Vehicles', { screen: 'Subscription' }),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }
    setIsSyncing(true);
    try {
      const result = await syncToSupabase();
      if (result.success) {
        const synced = await getLastSyncedAt();
        setLastSynced(synced);
        Alert.alert('Sync Complete', 'Your data has been backed up to the cloud.');
      } else {
        Alert.alert('Sync Failed', result.error || 'Unknown error');
      }
    } catch (error) {
      Alert.alert('Sync Error', error.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRestore = async () => {
    if (!isPro) {
      Alert.alert(
        'Pro Feature',
        'Cloud backup & sync requires Pop the Hood Pro.',
        [
          {
            text: 'Upgrade',
            onPress: () => navigation?.navigate('Vehicles', { screen: 'Subscription' }),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    setIsRestoring(true);
    let backupDateStr = 'an unknown date';
    try {
      const ts = await getCloudBackupTimestamp();
      if (ts) backupDateStr = formatLastSynced(ts);
    } catch (_) { /* use fallback */ }
    setIsRestoring(false);

    Alert.alert(
      'Restore from Backup',
      `This will replace your local data with the cloud backup from ${backupDateStr}. Are you sure?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            setIsRestoring(true);
            try {
              const result = await restoreFromSupabase();
              if (result.success) {
                const synced = await getLastSyncedAt();
                setLastSynced(synced);
                Alert.alert('Restore Complete', 'Your data has been restored from the cloud backup.');
              } else {
                Alert.alert('Restore Failed', result.error || 'Unknown error');
              }
            } catch (error) {
              Alert.alert('Restore Error', error.message);
            } finally {
              setIsRestoring(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your vehicles, maintenance records, inventory, todos, shopping list, and cloud backups. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you sure?',
              'All local and cloud data will be permanently erased.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Delete All',
                  style: 'destructive',
                  onPress: async () => {
                    setIsDeleting(true);
                    try {
                      await deleteAllCloudData();
                      await storage.clear();
                      if (syncUser) {
                        try { await signOut(); } catch (_) {}
                        setSyncUser(null);
                      }
                      setLastSynced(null);
                      Alert.alert(
                        'Data Deleted',
                        'All your data has been deleted. The app will restart from onboarding.',
                        [{ text: 'OK', onPress: () => appContext?.restartOnboarding?.() }]
                      );
                    } catch (error) {
                      Alert.alert('Error', 'Could not delete all data: ' + error.message);
                    } finally {
                      setIsDeleting(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const formatLastSynced = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}} edges={['top']}>
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardDismissMode="on-drag">

      {/* 1. Backup & Sync */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Backup & Sync</Text>
          <View style={styles.proBadge}>
            <Ionicons name="star" size={12} color={theme.colors.primary} />
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        </View>
        <Text style={styles.sectionDescription}>
          Keep your maintenance history, modifications, and garage backed up and synced across devices.
        </Text>

        {syncUser ? (
          <View style={styles.syncContainer}>
            <View style={styles.syncUserRow}>
              <Ionicons name="person-circle-outline" size={24} color={theme.colors.primary} />
              <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
                <Text style={styles.syncUserEmail}>{syncUser.email}</Text>
                <Text style={styles.syncLastSynced}>
                  Last synced: {formatLastSynced(lastSynced)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleSignOut}
                style={styles.signOutButton}
                accessibilityRole="button"
                accessibilityLabel="Sign Out"
              >
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
              onPress={handleSyncNow}
              disabled={isSyncing || isRestoring}
              accessibilityRole="button"
              accessibilityLabel={isSyncing ? "Syncing" : "Sync Now"}
            >
              {isSyncing ? (
                <ActivityIndicator size="small" color={theme.colors.textPrimary} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={20} color={theme.colors.textPrimary} />
              )}
              <Text style={styles.syncButtonText}>
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.restoreButton, isRestoring && styles.syncButtonDisabled]}
              onPress={handleRestore}
              disabled={isSyncing || isRestoring}
              accessibilityRole="button"
              accessibilityLabel={isRestoring ? "Restoring" : "Restore from Backup"}
            >
              {isRestoring ? (
                <ActivityIndicator size="small" color={theme.colors.textPrimary} />
              ) : (
                <Ionicons name="cloud-download-outline" size={20} color={theme.colors.textPrimary} />
              )}
              <Text style={styles.syncButtonText}>
                {isRestoring ? 'Restoring...' : 'Restore from Backup'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.syncContainer}>
            <Text style={styles.signInPrompt}>Sign in to back up your maintenance history, modifications, and garage across devices.</Text>
            <TouchableOpacity
              style={[styles.oauthButton, styles.googleButton, oauthLoading && styles.syncButtonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={oauthLoading !== null}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              accessibilityState={{ busy: oauthLoading === 'google' }}
            >
              {oauthLoading === 'google' ? (
                <ActivityIndicator size="small" color={theme.colors.textPrimary} />
              ) : (
                <Ionicons name="logo-google" size={20} color={theme.colors.textPrimary} />
              )}
              <Text style={styles.oauthButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.oauthButton, styles.appleButton, oauthLoading && styles.syncButtonDisabled]}
                onPress={handleAppleSignIn}
                disabled={oauthLoading !== null}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Continue with Apple"
                accessibilityState={{ busy: oauthLoading === 'apple' }}
              >
                {oauthLoading === 'apple' ? (
                  <ActivityIndicator size="small" color={theme.colors.textPrimary} />
                ) : (
                  <Ionicons name="logo-apple" size={20} color={theme.colors.textPrimary} />
                )}
                <Text style={styles.oauthButtonText}>Continue with Apple</Text>
              </TouchableOpacity>
            )}
            {Platform.OS === 'ios' && (
              <Text style={[styles.signInPrompt, { marginTop: theme.spacing.md, marginBottom: 0 }]}>
                Planning to switch between iPhone and Android? Use Google sign-in — it works on both platforms. Apple sign-in is only available on iOS.
              </Text>
            )}
          </View>
        )}
      </View>

      {/* 2. Notifications */}
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
            accessibilityLabel="Enable notifications"
            accessibilityRole="switch"
          />
        </View>
      </View>

      {/* 3. Subscription */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <TouchableOpacity
          style={styles.subscriptionCard}
          onPress={() => {
            if (navigation) {
              navigation.navigate('Vehicles', { screen: 'Subscription' });
            }
          }}
          accessibilityRole="button"
          accessibilityLabel={isPro ? "Pop the Hood Pro subscription" : "Upgrade to Pro"}
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

      {/* 4. Setup */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Setup</Text>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={handleRestartOnboarding}
          accessibilityRole="button"
          accessibilityLabel="Restart Onboarding"
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

      {/* 5. Stay Updated */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stay Updated</Text>
        <Text style={styles.sectionDescription}>
          Get notified about new features and maintenance tips. No spam.
        </Text>
        <View style={styles.emailRow}>
          <TextInput
            style={styles.emailInput}
            value={subscriberEmail}
            onChangeText={(text) => { setSubscriberEmail(text); setEmailSaved(false); }}
            placeholder="your@email.com"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleEmailSubmit}
            accessibilityLabel="Email address"
          />
          <TouchableOpacity
            style={[styles.emailSubmitButton, (!subscriberEmail.includes('@') || emailSaved) && styles.emailSubmitDisabled]}
            onPress={handleEmailSubmit}
            disabled={!subscriberEmail.includes('@') || emailSaved}
            accessibilityLabel={emailSaved ? 'Email saved' : 'Save email'}
            accessibilityRole="button"
          >
            <Ionicons
              name={emailSaved ? 'checkmark' : 'arrow-forward'}
              size={20}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
        {emailSaved && (
          <Text style={styles.emailConfirmation}>You're on the list!</Text>
        )}
      </View>

      {/* 6. Vehicle Focus */}
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
            accessibilityRole="button"
            accessibilityLabel={opt.label}
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

      {/* 7. Measurement System */}
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
          accessibilityRole="button"
          accessibilityLabel="Imperial (US)"
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
          accessibilityRole="button"
          accessibilityLabel="Metric (World Standard)"
        >
          <Text style={styles.optionTitle}>Metric (World Standard)</Text>
          <Text style={styles.optionDescription}>Kilometers, Liters, N⋅m</Text>
        </TouchableOpacity>
      </View>

      {/* 8. Feedback */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => {
            Linking.openURL('mailto:hello@apexoptimal.dev?subject=Pop%20the%20Hood%20Feedback');
          }}
          accessibilityRole="button"
          accessibilityLabel="Send Feedback"
        >
          <View style={styles.actionContent}>
            <View style={styles.actionHeader}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color={theme.colors.primary} />
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Send Feedback</Text>
                <Text style={styles.actionDescription}>
                  Have a suggestion or found a bug? We'd love to hear from you so we can improve your experience
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 9. Data & Privacy */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <View style={styles.toggleRow}>
          <View style={styles.toggleLabel}>
            <Text style={styles.toggleTitle}>Help Improve Spec Data</Text>
            <Text style={styles.toggleDescription}>
              Anonymously share corrections you make to vehicle specs so we can improve our database. No personal data is collected.
            </Text>
          </View>
          <Switch
            value={specFeedbackEnabled}
            onValueChange={(value) => {
              setSpecFeedbackEnabled(value);
              storage.set('specFeedbackOptOut', !value);
            }}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={specFeedbackEnabled ? theme.colors.textPrimary : theme.colors.textSecondary}
            accessibilityLabel="Help improve spec data"
            accessibilityRole="switch"
          />
        </View>
      </View>

      {/* 10. Delete My Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delete My Data</Text>
        <Text style={styles.sectionDescription}>
          Permanently delete all your data from this device and our servers. This cannot be undone.
        </Text>
        <TouchableOpacity
          style={styles.deleteDataButton}
          onPress={handleDeleteAllData}
          disabled={isDeleting}
          accessibilityRole="button"
          accessibilityLabel="Delete all my data"
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#ff4444" />
          ) : (
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          )}
          <Text style={styles.deleteDataText}>
            {isDeleting ? 'Deleting...' : 'Delete All My Data'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
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
  emailRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  emailInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    color: theme.colors.textPrimary,
    ...theme.typography.body,
  },
  emailSubmitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailSubmitDisabled: {
    opacity: 0.5,
  },
  emailConfirmation: {
    ...theme.typography.bodySmall,
    color: theme.colors.success,
    marginTop: theme.spacing.sm,
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
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  proBadgeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 11,
  },
  syncContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  syncUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  syncUserEmail: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  syncLastSynced: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  signOutButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  signOutText: {
    ...theme.typography.bodySmall,
    color: theme.colors.danger,
    fontWeight: '600',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncButtonText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  signInPrompt: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    minHeight: 48,
  },
  oauthButtonText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  appleButton: {
    backgroundColor: theme.colors.surfaceElevated,
  },
  deleteDataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  deleteDataText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: '#ff4444',
  },
});
