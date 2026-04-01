import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signInWithGoogle, signInWithApple, dismissAllAuthSessions, supabase } from '../../utils/supabase';
import { withSignInTimeout } from '../../utils/oauthSignInTimeout';
import { storage } from '../../utils/storage';
import { theme } from '../../theme';
import logger from '../../utils/logger';

export default function AccountScreen({ onSignedIn, onSkip }) {
  /** null | 'google' | 'apple' — spinner on the button the user actually tapped */
  const [oauthLoading, setOauthLoading] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleGoogleSignIn = async () => {
    setOauthLoading('google');
    try {
      const result = await withSignInTimeout(signInWithGoogle(), 'Google sign-in');
      if (result?.user) {
        onSignedIn();
      }
    } catch (error) {
      logger.error('Onboarding Google sign-in failed:', error);
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
        onSignedIn();
      }
    } catch (error) {
      logger.error('Onboarding Apple sign-in failed:', error);
      Alert.alert('Sign In Failed', error.message);
    } finally {
      dismissAllAuthSessions();
      setOauthLoading(null);
    }
  };

  const submitEmail = async (emailToSubmit) => {
    const trimmed = (emailToSubmit || email).trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) return;
    try {
      await storage.set('subscriberEmail', trimmed);
      if (supabase) {
        await supabase.from('email_subscribers').insert({ email: trimmed, source: 'onboarding' });
      }
      setEmailSubmitted(true);
    } catch (e) {
      logger.error('Email subscribe failed:', e);
    }
  };

  const handleSkip = async () => {
    if (email.trim() && email.includes('@') && !emailSubmitted) {
      await submitEmail();
    }
    onSkip();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark-outline" size={48} color={theme.colors.primary} />
          </View>
        </View>

        <Text style={styles.title}>Protect Your Data</Text>
        <Text style={styles.subtitle}>
          Sign in to keep your vehicle maintenance history, modifications, and garage safe in the cloud. Switch phones and pick up right where you left off.
        </Text>

        <View style={styles.benefitsList}>
          <BenefitRow icon="cloud-upload-outline" text="Back up maintenance & service records" />
          <BenefitRow icon="phone-portrait-outline" text="Restore your garage on any device" />
          <BenefitRow icon="lock-closed-outline" text="Secure & private" />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.oauthButton, styles.googleButton, oauthLoading && styles.buttonDisabled]}
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
              style={[styles.oauthButton, styles.appleButton, oauthLoading && styles.buttonDisabled]}
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
            <Text style={styles.crossPlatformHint}>
              Switching between iPhone and Android? Use Google — it works on both. Apple sign-in is iOS only.
            </Text>
          )}

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or just stay in the loop</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.emailRow}>
            <TextInput
              style={styles.emailInput}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={() => submitEmail()}
              editable={!emailSubmitted}
              accessibilityLabel="Email address"
            />
            <TouchableOpacity
              style={[styles.emailSubmitButton, (!email.includes('@') || emailSubmitted) && styles.buttonDisabled]}
              onPress={() => submitEmail()}
              disabled={!email.includes('@') || emailSubmitted}
              accessibilityLabel="Submit email"
              accessibilityRole="button"
            >
              <Ionicons
                name={emailSubmitted ? 'checkmark' : 'arrow-forward'}
                size={20}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
          {emailSubmitted && (
            <Text style={styles.emailConfirmation}>You're on the list!</Text>
          )}

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
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
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  crossPlatformHint: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
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
  buttonDisabled: {
    opacity: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
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
  emailConfirmation: {
    ...theme.typography.bodySmall,
    color: theme.colors.success,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
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
