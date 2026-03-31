import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

const PERSONAS = [
  {
    key: 'daily',
    title: 'The Daily',
    icon: 'car-outline',
    description: 'Fuel economy, reliability, and routine maintenance reminders',
    details: 'Oil life tracking, service alerts, mileage logging, and cost savings reports.',
  },
  {
    key: 'track',
    title: 'The Track / Autocrosser',
    icon: 'speedometer-outline',
    description: 'Tire heat cycles, brake fluid boiling points, and alignment specs',
    details: 'Modifications focus, torque specs, performance fluid recommendations, and track day logs.',
  },
  {
    key: 'project',
    title: 'The Project',
    icon: 'build-outline',
    description: 'Modification logs, build to-do lists, and project progress',
    details: 'Mod tracking, parts lists, build notes, and project milestone management.',
  },
];

export default function PersonaSelectScreen({ onSelect, onBack }) {
  const [selected, setSelected] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnims = useRef(PERSONAS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      // Stagger card reveals
      Animated.stagger(120, cardAnims.map(anim =>
        Animated.spring(anim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true })
      )).start();
    });
  }, []);

  const handleContinue = () => {
    if (selected) onSelect(selected);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>How Do You Use Your Vehicle?</Text>
          <Text style={styles.subtitle}>
            This helps us prioritize the right info for you. You can change this anytime in Settings.
          </Text>
        </Animated.View>

        <View style={styles.cardsContainer}>
          {PERSONAS.map((persona, index) => (
            <Animated.View
              key={persona.key}
              style={{
                opacity: cardAnims[index],
                transform: [{ scale: cardAnims[index].interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.personaCard,
                  selected === persona.key && styles.personaCardSelected,
                ]}
                onPress={() => setSelected(persona.key)}
                activeOpacity={0.7}
                accessibilityLabel={`Select ${persona.title}: ${persona.description}`}
                accessibilityRole="button"
              >
                <View style={[styles.personaIconCircle, selected === persona.key && styles.personaIconSelected]}>
                  <Ionicons
                    name={persona.icon}
                    size={32}
                    color={selected === persona.key ? theme.colors.textPrimary : theme.colors.primary}
                  />
                </View>
                <View style={styles.personaContent}>
                  <Text style={styles.personaTitle}>{persona.title}</Text>
                  <Text style={styles.personaDescription}>{persona.description}</Text>
                  {selected === persona.key && (
                    <Text style={styles.personaDetails}>{persona.details}</Text>
                  )}
                </View>
                {selected === persona.key && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !selected && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selected}
          accessibilityLabel="Continue"
          accessibilityRole="button"
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  backButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignSelf: 'flex-start',
    padding: theme.spacing.sm,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  cardsContainer: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  personaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: theme.spacing.lg,
  },
  personaCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 102, 204, 0.08)',
  },
  personaIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personaIconSelected: {
    backgroundColor: theme.colors.primary,
  },
  personaContent: {
    flex: 1,
  },
  personaTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  personaDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  personaDetails: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    lineHeight: 18,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
});
