import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { theme } from '../../theme';

export default function NotificationsScreen({ onEnable, onSkip }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleEnable = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    onEnable(status === 'granted');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="notifications-outline" size={48} color={theme.colors.primary} />
          </View>
        </View>

        <Text style={styles.title}>Stay Ahead of Maintenance</Text>
        <Text style={styles.subtitle}>
          Get a heads-up when services are coming due so you have time to plan — no surprises, no missed oil changes.
        </Text>

        <View style={styles.benefitsList}>
          <BenefitRow icon="timer-outline" text="Reminders before services are due" />
          <BenefitRow icon="cash-outline" text="Never pay for an emergency repair you could've prevented" />
          <BenefitRow icon="volume-off-outline" text="No spam — only your vehicles, only when it matters" />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.enableButton}
            onPress={handleEnable}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications" size={20} color={theme.colors.textPrimary} />
            <Text style={styles.enableButtonText}>Enable Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

function BenefitRow({ icon, text }) {
  return (
    <View style={styles.benefitRow}>
      <View style={styles.benefitIcon}>
        <Ionicons name={icon} size={20} color={theme.colors.primary} />
      </View>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primary + '1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xxl,
  },
  benefitsList: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  enableButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  enableButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
  skipButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipButtonText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
});
