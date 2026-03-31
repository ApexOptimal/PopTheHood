import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { calculateOnboardingHealthScore } from '../../utils/healthScore';
import { theme } from '../../theme';

export default function HealthScoreRevealScreen({
  vehicleData,
  baselineData,
  hasVehicle,
  persona,
  onEnterGarage,
  onAddAnother,
  onBack,
}) {
  const [revealed, setRevealed] = useState(false);

  const recallCount = vehicleData?.recalls?.length || 0;
  const healthResult = hasVehicle
    ? calculateOnboardingHealthScore({
        mileage: baselineData?.mileage || 0,
        estimatedLastOilChange: baselineData?.estimatedLastOilChange,
        hasCheckEngineLight: baselineData?.hasCheckEngineLight || false,
        recallCount,
      })
    : null;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const gaugeAnim = useRef(new Animated.Value(0)).current;
  const factorsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start(() => {
      if (healthResult) {
        // Animate gauge fill
        Animated.timing(gaugeAnim, {
          toValue: healthResult.score / 100,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();

        // Animate score counter
        Animated.timing(scoreAnim, {
          toValue: healthResult.score,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();

        // Reveal factors after gauge
        setTimeout(() => {
          Animated.timing(factorsAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
          setRevealed(true);
        }, 1200);
      } else {
        setRevealed(true);
        factorsAnim.setValue(1);
      }
    });
  }, []);

  // Pass scoreAnim directly — no interpolation needed for 1:1 mapping

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

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {hasVehicle && healthResult ? (
            <>
              <Text style={styles.title}>Maintenance Health Score</Text>
              <Text style={styles.vehicleName}>
                {vehicleData.decodedData?.year} {vehicleData.decodedData?.make} {vehicleData.decodedData?.model}
              </Text>

              {/* Gauge */}
              <View style={styles.gaugeContainer}>
                <View style={styles.gaugeTrack}>
                  <Animated.View
                    style={[
                      styles.gaugeFill,
                      {
                        width: gaugeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                        backgroundColor: healthResult.color,
                      },
                    ]}
                  />
                </View>
                <View style={styles.scoreRow}>
                  <AnimatedScore value={scoreAnim} color={healthResult.color} />
                  <Text style={styles.scoreLabel}> / 100</Text>
                </View>
              </View>

              {/* Factors */}
              <Animated.View style={[styles.factorsSection, { opacity: factorsAnim }]}>
                {healthResult.factors.length > 0 ? (
                  healthResult.factors.map((factor, i) => (
                    <View key={i} style={styles.factorRow}>
                      <Ionicons
                        name={
                          factor.severity === 'critical' ? 'alert-circle' :
                          factor.severity === 'warning' ? 'warning' : 'information-circle'
                        }
                        size={20}
                        color={
                          factor.severity === 'critical' ? theme.colors.danger :
                          factor.severity === 'warning' ? theme.colors.warning : theme.colors.textMuted
                        }
                      />
                      <Text style={styles.factorText}>{factor.label}</Text>
                      {factor.deduction > 0 && (
                        <Text style={styles.factorDeduction}>-{factor.deduction}</Text>
                      )}
                    </View>
                  ))
                ) : (
                  <View style={styles.factorRow}>
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                    <Text style={styles.factorText}>Everything looks good!</Text>
                  </View>
                )}
              </Animated.View>

              <Text style={styles.disclaimer}>
                This is an estimated score based on limited data. Add maintenance records to improve accuracy.
              </Text>

              {/* Pro Features Teaser */}
              <Animated.View style={[styles.proTeaser, { opacity: factorsAnim }]}>
                <View style={styles.proTeaserHeader}>
                  <Ionicons name="star" size={16} color={theme.colors.primary} />
                  <Text style={styles.proTeaserTitle}>With Pop the Hood Pro</Text>
                </View>
                <View style={styles.proTeaserItem}>
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color={theme.colors.primary} />
                  <Text style={styles.proTeaserText}>
                    Ask Stoich, your AI Mechanic — knows your vehicle, history, and mods
                  </Text>
                </View>
                <View style={styles.proTeaserItem}>
                  <Ionicons name="document-text-outline" size={18} color={theme.colors.primary} />
                  <Text style={styles.proTeaserText}>
                    Export clean PDF service reports to increase resale value
                  </Text>
                </View>
                {persona === 'project' && (
                  <View style={styles.proTeaserItem}>
                    <Ionicons name="construct-outline" size={18} color={theme.colors.primary} />
                    <Text style={styles.proTeaserText}>
                      Include your modifications in exports to showcase your mods
                    </Text>
                  </View>
                )}
              </Animated.View>
            </>
          ) : (
            <>
              <View style={styles.noVehicleContainer}>
                <View style={styles.iconCircle}>
                  <Ionicons name="car-sport" size={40} color={theme.colors.textMuted} />
                </View>
                <Text style={styles.title}>You're All Set!</Text>
                <Text style={styles.noVehicleText}>
                  Add a vehicle anytime to get your Maintenance Health Score and personalized service reminders.
                </Text>
              </View>
            </>
          )}

          <Animated.View style={[styles.actionsSection, { opacity: factorsAnim }]}>
            <TouchableOpacity
            style={styles.primaryButton}
            onPress={onEnterGarage}
            accessibilityLabel="Enter Your Garage"
            accessibilityRole="button"
          >
              <Ionicons name="home" size={20} color={theme.colors.textPrimary} />
              <Text style={styles.primaryButtonText}>Enter Your Garage</Text>
            </TouchableOpacity>

            {hasVehicle && (
              <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onAddAnother}
              accessibilityLabel="Add another vehicle"
              accessibilityRole="button"
            >
                <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.secondaryButtonText}>Add Another Vehicle</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Animated number display */
function AnimatedScore({ value, color }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const listener = value.addListener(({ value: v }) => {
      setDisplay(Math.round(v));
    });
    return () => value.removeListener(listener);
  }, [value]);

  return <Text style={[styles.scoreNumber, { color }]}>{display}</Text>;
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
  content: {
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  vehicleName: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxl,
  },
  gaugeContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  gaugeTrack: {
    width: '100%',
    height: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 6,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 64,
    fontWeight: '700',
    letterSpacing: -2,
  },
  scoreLabel: {
    ...theme.typography.h3,
    color: theme.colors.textMuted,
  },
  factorsSection: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  factorText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  factorDeduction: {
    ...theme.typography.buttonSmall,
    color: theme.colors.danger,
  },
  disclaimer: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  proTeaser: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.primary + '33',
  },
  proTeaserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  proTeaserTitle: {
    ...theme.typography.h4,
    color: theme.colors.primary,
  },
  proTeaserItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  proTeaserText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  noVehicleContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xxl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  noVehicleText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: theme.spacing.md,
  },
  actionsSection: {
    width: '100%',
    gap: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  primaryButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  secondaryButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary,
  },
});
