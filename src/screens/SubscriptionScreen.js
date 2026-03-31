import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  getCustomerInfo,
  hasProEntitlement,
  getActiveSubscriptionInfo,
  addCustomerInfoUpdateListener,
} from '../utils/revenueCat';
import { presentPaywall, isRevenueCatUIAvailable } from '../utils/paywall';
import { presentCustomerCenter } from '../utils/customerCenter';
import { theme } from '../theme';
import logger from '../utils/logger';

// Import RevenueCat SDK and UI - lazy loaded to avoid errors
let Purchases = null;
let PurchasesUI = null;
let isPurchasesAvailable = false;
let revenueCatRequireAttempted = false;

// Lazy load RevenueCat - only require when actually needed
const getRevenueCatModules = () => {
  if (revenueCatRequireAttempted) {
    return { Purchases, PurchasesUI, isAvailable: isPurchasesAvailable };
  }
  
  revenueCatRequireAttempted = true;
  
  try {
    if (Platform.OS !== 'web' && typeof require !== 'undefined') {
      try {
        Purchases = require('react-native-purchases').default;
        // Verify Purchases has required methods
        if (Purchases && typeof Purchases.configure === 'function') {
          try {
            PurchasesUI = require('react-native-' + 'purchases-ui').default;
            if (PurchasesUI) {
              isPurchasesAvailable = true;
              return { Purchases, PurchasesUI, isAvailable: true };
            }
          } catch (uiError) {
            // RevenueCat UI not available when package omitted or in Expo Go
            isPurchasesAvailable = false;
          }
        }
      } catch (purchasesError) {
        // RevenueCat SDK not available - that's okay in Expo Go
        isPurchasesAvailable = false;
      }
    }
  } catch (error) {
    // Silently fail - RevenueCat requires native build
    isPurchasesAvailable = false;
  }
  
  return { Purchases, PurchasesUI, isAvailable: isPurchasesAvailable };
};

export default function SubscriptionScreen({ navigation, appContext }) {
  const [loading, setLoading] = useState(true);
  const [offerings, setOfferings] = useState(null);
  const [currentOffering, setCurrentOffering] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const autoPaywallPresentedRef = useRef(false);
  const presentPaywallHandlerRef = useRef(() => {});

  useEffect(() => {
    loadSubscriptionData();
    
    // Listen for customer info updates using utility function
    const removeListener = addCustomerInfoUpdateListener(({ customerInfo, isPro }) => {
      setIsPro(isPro);
      const subInfo = getActiveSubscriptionInfo(customerInfo);
      setSubscriptionInfo(subInfo);
    });

    return () => {
      removeListener();
    };
  }, []);

  const loadSubscriptionData = async () => {
    setLoading(true);
    try {
      // Get offerings
      const offeringsResult = await getOfferings();
      if (offeringsResult.success) {
        setOfferings(offeringsResult.offerings);
        setCurrentOffering(offeringsResult.currentOffering);
      }

      // Check Pro status
      const customerInfoResult = await getCustomerInfo();
      if (customerInfoResult.success) {
        setIsPro(customerInfoResult.isPro);
        const subInfo = getActiveSubscriptionInfo(customerInfoResult.customerInfo);
        setSubscriptionInfo(subInfo);
      }
    } catch (error) {
      logger.error('Error loading subscription data:', error);
      Alert.alert('Error', 'Failed to load subscription information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkProStatus = async (customerInfo = null) => {
    try {
      if (customerInfo) {
        const isProUser = customerInfo.entitlements.active['Pop the Hood Pro'] !== undefined;
        setIsPro(isProUser);
        const subInfo = getActiveSubscriptionInfo(customerInfo);
        setSubscriptionInfo(subInfo);
      } else {
        const proStatus = await hasProEntitlement();
        setIsPro(proStatus);
        const customerInfoResult = await getCustomerInfo();
        if (customerInfoResult.success) {
          const subInfo = getActiveSubscriptionInfo(customerInfoResult.customerInfo);
          setSubscriptionInfo(subInfo);
        }
      }
    } catch (error) {
      logger.error('Error checking Pro status:', error);
    }
  };

  const handlePurchase = async (packageToPurchase) => {
    if (!packageToPurchase) {
      Alert.alert('Error', 'No package selected');
      return;
    }

    setPurchasing(true);
    try {
      const result = await purchasePackage(packageToPurchase);

      if (result.success) {
        // Navigate back first, then let the RevenueCat listener and a deferred
        // refresh settle state — avoids a race between navigation and setState
        // calls that can trigger the ErrorBoundary.
        navigation.goBack();
        setTimeout(() => appContext?.refreshProStatus?.(), 300);
        return;
      } else if (result.cancelled) {
        // User cancelled, no need to show error
        return;
      } else {
        Alert.alert('Purchase Failed', result.error || 'Unable to complete purchase. Please try again.');
      }
    } catch (error) {
      logger.error('Purchase error:', error);
      Alert.alert('Error', 'An error occurred during purchase. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const result = await restorePurchases();

      if (result.success) {
        if (result.isPro) {
          navigation.goBack();
          setTimeout(() => appContext?.refreshProStatus?.(), 300);
          return;
        } else {
          Alert.alert('No Purchases Found', 'We couldn\'t find any purchases to restore.');
        }
      } else {
        Alert.alert('Restore Failed', result.error || 'Unable to restore purchases. Please try again.');
      }
    } catch (error) {
      logger.error('Restore error:', error);
      Alert.alert('Error', 'An error occurred while restoring purchases.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresentPaywall = async () => {
    try {
      const result = await presentPaywall();

      if (result.success) {
        if (result.purchased || result.restored) {
          // Navigate first, then refresh — prevents simultaneous setState +
          // navigation from triggering the ErrorBoundary.
          navigation.goBack();
          setTimeout(() => appContext?.refreshProStatus?.(), 300);
          return;
        } else if (result.cancelled) {
          // User dismissed the paywall — refresh status in case they had an
          // existing entitlement that wasn't reflected yet.
          await checkProStatus();
          return;
        } else if (result.error) {
          await checkProStatus();
          Alert.alert('Error', 'Unable to display subscription options. Please try again.');
        }
      } else {
        // RevenueCat UI not available or threw — fall back to local status check.
        await checkProStatus();
        if (!isPro) {
          Alert.alert('Error', result.error || 'Unable to display subscription options. Please try again.');
        }
      }
    } catch (error) {
      logger.error('Error presenting paywall:', error);
      await checkProStatus();
      Alert.alert('Error', 'Unable to display subscription options. Please try again.');
    }
  };

  presentPaywallHandlerRef.current = handlePresentPaywall;

  // Open RevenueCat dashboard paywall when non-Pro user lands on this screen (dev client / store builds).
  useEffect(() => {
    if (loading || isPro) return;
    if (!isRevenueCatUIAvailable()) return;
    if (autoPaywallPresentedRef.current) return;
    autoPaywallPresentedRef.current = true;
    const t = setTimeout(() => {
      presentPaywallHandlerRef.current?.();
    }, 450);
    return () => clearTimeout(t);
  }, [loading, isPro]);

  const handlePresentCustomerCenter = async () => {
    try {
      const result = await presentCustomerCenter();
      
      if (result.success) {
        // Refresh subscription status after customer center is dismissed
        await checkProStatus();
      } else {
        Alert.alert('Error', result.error || 'Unable to open customer center. Please try again.');
      }
    } catch (error) {
      logger.error('Error presenting customer center:', error);
      Alert.alert('Error', 'Unable to open customer center. Please try again.');
    }
  };

  const formatPrice = (packageToPurchase) => {
    if (!packageToPurchase || !packageToPurchase.product) return 'N/A';
    return packageToPurchase.product.priceString;
  };

  const getPackageDescription = (packageToPurchase) => {
    if (!packageToPurchase) return '';

    const identifier = packageToPurchase.identifier.toLowerCase();
    const product = packageToPurchase.product;

    // Check for a free trial or introductory offer
    const intro = product?.introductoryPrice;
    if (intro && intro.price === 0) {
      // Free trial — show duration and what happens after
      const trialLabel = `${intro.periodNumberOfUnits} ${intro.periodUnit?.toLowerCase() || 'day'}${intro.periodNumberOfUnits !== 1 ? 's' : ''} free`;
      const billingCycle = identifier.includes('monthly')
        ? '/month after'
        : identifier.includes('yearly') || identifier.includes('annual')
          ? '/year after'
          : '';
      return `${trialLabel}, then ${product.priceString}${billingCycle}`;
    }

    if (identifier.includes('monthly')) {
      return 'Billed monthly — cancel anytime';
    } else if (identifier.includes('yearly') || identifier.includes('annual')) {
      return 'Billed annually — cancel anytime';
    } else if (identifier.includes('lifetime')) {
      return 'One-time purchase, no recurring charges';
    }
    return '';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscription</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading subscription options...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // RevenueCat Paywalls (dashboard templates) need react-native-purchases-ui in a dev/store build.
  const useRcDashboardPaywall = Platform.OS !== 'web' && isRevenueCatUIAvailable();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pop the Hood Pro</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      {isPro ? (
        <View style={styles.proActiveContainer}>
          <View style={styles.proBadge}>
            <Ionicons name="checkmark-circle" size={48} color={theme.colors.successBright} />
            <Text style={styles.proBadgeTitle}>Pro Active</Text>
            <Text style={styles.proBadgeText}>
              You have access to all Pro features!
            </Text>
          </View>

          {subscriptionInfo && subscriptionInfo.isActive && (
            <View style={styles.subscriptionInfoCard}>
              <Text style={styles.subscriptionInfoTitle}>Subscription Details</Text>
              {subscriptionInfo.expirationDate && (
                <View style={styles.subscriptionInfoRow}>
                  <Text style={styles.subscriptionInfoLabel}>
                    {subscriptionInfo.willRenew ? 'Renews' : 'Expires'}:
                  </Text>
                  <Text style={styles.subscriptionInfoValue}>
                    {new Date(subscriptionInfo.expirationDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
              {subscriptionInfo.productIdentifier && (
                <View style={styles.subscriptionInfoRow}>
                  <Text style={styles.subscriptionInfoLabel}>Plan:</Text>
                  <Text style={styles.subscriptionInfoValue}>
                    {subscriptionInfo.productIdentifier}
                  </Text>
                </View>
              )}
            </View>
          )}

          <TouchableOpacity
            style={styles.customerCenterButton}
            onPress={handlePresentCustomerCenter}
            accessibilityLabel="Manage Subscription"
            accessibilityRole="button"
          >
            <Ionicons name="person-circle" size={20} color={theme.colors.textPrimary} />
            <Text style={styles.customerCenterButtonText}>Manage Subscription</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.introSection}>
            <Image
              source={require('../../assets/PoptheHoodPro.png')}
              style={styles.proHeroImage}
              resizeMode="contain"
            />
            <Text style={styles.introTitle}>Upgrade to Pro</Text>
            <Text style={styles.introText}>
              Unlock all premium features and get the most out of Pop the Hood
            </Text>
          </View>

          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Pro Features</Text>
            {[
              { emoji: '🏎️', text: 'Unlimited vehicles' },
              { emoji: '🔄', text: 'Backup & sync across devices' },
              { emoji: '🧠', text: 'Stoich AI Mechanic' },
              { emoji: '🧾', text: 'AI receipt scanning' },
              { emoji: '💊', text: 'Health score & diagnostics' },
              { emoji: '📑', text: 'PDF report export' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.successBright} />
                <Text style={styles.featureText}>{feature.text} {feature.emoji}</Text>
              </View>
            ))}
          </View>

          {useRcDashboardPaywall ? (
            <View style={styles.rcPaywallSection}>
              <Text style={styles.rcPaywallTitle}>Subscribe with Pop the Hood Pro</Text>
              <Text style={styles.rcPaywallSubtitle}>
                See plans, free trial, and pricing in the full-screen paywall from RevenueCat (matches your dashboard and the store).
              </Text>
              <TouchableOpacity
                style={styles.paywallButton}
                onPress={handlePresentPaywall}
                accessibilityLabel="View subscription plans"
                accessibilityRole="button"
              >
                <Ionicons name="card-outline" size={22} color={theme.colors.textPrimary} />
                <Text style={styles.paywallButtonText}>View plans & subscribe</Text>
              </TouchableOpacity>
            </View>
          ) : currentOffering && currentOffering.availablePackages.length > 0 ? (
            <View style={styles.packagesSection}>
              <Text style={styles.packagesTitle}>Choose Your Plan</Text>
              
              {currentOffering.availablePackages.map((pkg, index) => (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[
                    styles.packageCard,
                    (pkg.identifier || '').toLowerCase().includes('annual') && styles.packageCardFeatured,
                  ]}
                  onPress={() => handlePurchase(pkg)}
                  disabled={purchasing}
                  accessibilityLabel={`${(pkg.identifier || '').toLowerCase().includes('monthly') ? 'Monthly' : (pkg.identifier || '').toLowerCase().includes('yearly') || (pkg.identifier || '').toLowerCase().includes('annual') ? 'Yearly' : (pkg.identifier || '').toLowerCase().includes('lifetime') ? 'Lifetime' : 'Subscription'} plan, ${formatPrice(pkg)}`}
                  accessibilityRole="button"
                >
                  {(pkg.identifier || '').toLowerCase().includes('annual') && (
                    <View style={styles.featuredBadge}>
                      <Text style={styles.featuredBadgeText}>POPULAR</Text>
                    </View>
                  )}
                  <View style={styles.packageHeader}>
                    <Text style={styles.packageTitle}>
                      {(() => {
                        // Use identifier as fallback if Purchases constants aren't available
                        const id = (pkg.identifier || '').toLowerCase();
                        if (id.includes('monthly')) return 'Monthly';
                        if (id.includes('yearly') || id.includes('annual')) return 'Yearly';
                        if (id.includes('lifetime')) return 'Lifetime';
                        // Try to use packageType if available
                        const modules = getRevenueCatModules();
                        if (modules.isAvailable && modules.Purchases && pkg.packageType) {
                          try {
                            if (pkg.packageType === modules.Purchases.PACKAGE_TYPE.MONTHLY) return 'Monthly';
                            if (pkg.packageType === modules.Purchases.PACKAGE_TYPE.ANNUAL) return 'Yearly';
                          } catch (e) {
                            // Constants not available
                          }
                        }
                        return 'Subscription';
                      })()}
                    </Text>
                    <Text style={styles.packagePrice}>{formatPrice(pkg)}</Text>
                  </View>
                  <Text style={styles.packageDescription}>
                    {getPackageDescription(pkg)}
                  </Text>
                  {purchasing && (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.primary}
                      style={styles.purchasingIndicator}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noPackagesContainer}>
              <Text style={styles.noPackagesText}>
                No subscription packages available at this time.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={loading}
            accessibilityLabel="Restore purchases"
            accessibilityRole="button"
          >
            <Ionicons name="refresh" size={18} color={theme.colors.primary} />
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          </TouchableOpacity>

          <View style={styles.legalLinksRow}>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://apexoptimal.dev/popthehood/terms')}
              accessibilityLabel="Terms of Service"
              accessibilityRole="link"
            >
              <Text style={styles.legalLinkText}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.legalLinkSeparator}>·</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://apexoptimal.dev/popthehood/privacy')}
              accessibilityLabel="Privacy Policy"
              accessibilityRole="link"
            >
              <Text style={styles.legalLinkText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          If a free trial is offered, your subscription will automatically begin and your payment method will be charged at the end of the trial period unless you cancel at least 24 hours before the trial ends. Subscriptions auto-renew at the stated price unless cancelled at least 24 hours before the end of the current period. You can manage or cancel your subscription anytime in your Apple ID settings.
        </Text>
        <TouchableOpacity
          style={styles.termsButton}
          onPress={() => {
            Linking.openURL('https://apexoptimal.dev/popthehood/terms');
          }}
          accessibilityLabel="Terms of Service"
          accessibilityRole="link"
        >
          <Text style={styles.termsButtonText}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.termsButton}
          onPress={() => {
            Linking.openURL('https://apexoptimal.dev/popthehood/privacy');
          }}
          accessibilityLabel="Privacy Policy"
          accessibilityRole="link"
        >
          <Text style={styles.termsButtonText}>Privacy Policy</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: 4,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: 16,
    fontSize: 14,
  },
  introSection: {
    alignItems: 'center',
    padding: theme.spacing.xxl,
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  proHeroImage: {
    width: 220,
    height: 220,
    marginBottom: 8,
    borderRadius: 24,
  },
  introTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  introText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  featuresTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  featureText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  packagesSection: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  packagesTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  packageCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  packageCardFeatured: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryDark,
  },
  featuredBadge: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredBadgeText: {
    color: theme.colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  packagePrice: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  packageDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  purchasingIndicator: {
    marginTop: 12,
  },
  rcPaywallSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  rcPaywallTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  rcPaywallSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  paywallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    gap: 8,
  },
  paywallButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  restoreButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  proActiveContainer: {
    padding: 16,
  },
  proBadge: {
    alignItems: 'center',
    padding: theme.spacing.xxl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  proBadgeTitle: {
    ...theme.typography.h2,
    color: theme.colors.successBright,
    marginTop: 16,
    marginBottom: 8,
  },
  proBadgeText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  subscriptionInfoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  subscriptionInfoTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  subscriptionInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subscriptionInfoLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  subscriptionInfoValue: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  customerCenterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  customerCenterButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  noPackagesContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noPackagesText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  legalLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    marginTop: 4,
  },
  legalLinkText: {
    color: theme.colors.primary,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  legalLinkSeparator: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  footer: {
    padding: 16,
    marginTop: 16,
  },
  footerText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  termsButton: {
    padding: 8,
    alignItems: 'center',
  },
  termsButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
