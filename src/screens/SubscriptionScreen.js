import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  getCustomerInfo,
  hasProEntitlement,
  getActiveSubscriptionInfo,
  addCustomerInfoUpdateListener,
} from '../utils/revenueCat';
import { presentPaywall, presentPaywallIfNeeded } from '../utils/paywall';
import { presentCustomerCenter } from '../utils/customerCenter';

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
      console.error('Error loading subscription data:', error);
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
      console.error('Error checking Pro status:', error);
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
        setIsPro(result.isPro);
        const subInfo = getActiveSubscriptionInfo(result.customerInfo);
        setSubscriptionInfo(subInfo);
        Alert.alert(
          'Success!',
          'Your subscription is now active. Thank you for upgrading to Pop the Hood Pro!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else if (result.cancelled) {
        // User cancelled, no need to show error
        return;
      } else {
        Alert.alert('Purchase Failed', result.error || 'Unable to complete purchase. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
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
          setIsPro(true);
          const subInfo = getActiveSubscriptionInfo(result.customerInfo);
          setSubscriptionInfo(subInfo);
          Alert.alert('Success', 'Your purchases have been restored!');
        } else {
          Alert.alert('No Purchases Found', 'We couldn\'t find any purchases to restore.');
        }
      } else {
        Alert.alert('Restore Failed', result.error || 'Unable to restore purchases. Please try again.');
      }
    } catch (error) {
      console.error('Restore error:', error);
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
          // User made a purchase or restored
          await checkProStatus();
          Alert.alert(
            'Success!',
            'Your subscription is now active. Thank you for upgrading to Pop the Hood Pro!',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ]
          );
        } else if (result.cancelled) {
          // User cancelled, no need to show error
          return;
        } else if (result.error) {
          Alert.alert('Error', 'Unable to display subscription options. Please try again.');
        }
      } else {
        Alert.alert('Error', result.error || 'Unable to display subscription options. Please try again.');
      }
    } catch (error) {
      console.error('Error presenting paywall:', error);
      Alert.alert('Error', 'Unable to display subscription options. Please try again.');
    }
  };

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
      console.error('Error presenting customer center:', error);
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
    if (identifier.includes('monthly')) {
      return 'Billed monthly';
    } else if (identifier.includes('yearly') || identifier.includes('annual')) {
      return 'Billed annually';
    } else if (identifier.includes('lifetime')) {
      return 'One-time purchase';
    }
    return '';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscription</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading subscription options...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Garage Assistant Pro</Text>
        <View style={styles.placeholder} />
      </View>

      {isPro ? (
        <View style={styles.proActiveContainer}>
          <View style={styles.proBadge}>
            <Ionicons name="checkmark-circle" size={48} color="#4dff4d" />
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
          >
            <Ionicons name="person-circle" size={20} color="#fff" />
            <Text style={styles.customerCenterButtonText}>Manage Subscription</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.introSection}>
            <Ionicons name="star" size={48} color="#0066cc" />
            <Text style={styles.introTitle}>Upgrade to Pro</Text>
            <Text style={styles.introText}>
              Unlock all premium features and get the most out of Pop the Hood
            </Text>
          </View>

          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Pro Features</Text>
            {[
              'Unlimited vehicles',
              'Advanced maintenance tracking',
              'Priority support',
              'Export to PDF & CSV',
              'Cloud backup & sync',
              'Ad-free experience',
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4dff4d" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {currentOffering && currentOffering.availablePackages.length > 0 ? (
            <View style={styles.packagesSection}>
              <Text style={styles.packagesTitle}>Choose Your Plan</Text>
              
              {currentOffering.availablePackages.map((pkg, index) => (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[
                    styles.packageCard,
                    index === 0 && styles.packageCardFeatured,
                  ]}
                  onPress={() => handlePurchase(pkg)}
                  disabled={purchasing}
                >
                  {index === 0 && (
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
                      color="#0066cc"
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
            style={styles.paywallButton}
            onPress={handlePresentPaywall}
            disabled={purchasing}
          >
            <Ionicons name="card" size={20} color="#fff" />
            <Text style={styles.paywallButtonText}>View All Plans</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={loading}
          >
            <Ionicons name="refresh" size={18} color="#0066cc" />
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Subscriptions will auto-renew unless cancelled at least 24 hours before the end of the current period.
        </Text>
        <TouchableOpacity
          style={styles.termsButton}
          onPress={() => {
            // Open terms of service
            Alert.alert('Terms of Service', 'Terms of service URL would go here');
          }}
        >
          <Text style={styles.termsButtonText}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.termsButton}
          onPress={() => {
            // Open privacy policy
            Alert.alert('Privacy Policy', 'Privacy policy URL would go here');
          }}
        >
          <Text style={styles.termsButtonText}>Privacy Policy</Text>
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
  content: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#4d4d4d',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
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
    color: '#b0b0b0',
    marginTop: 16,
    fontSize: 14,
  },
  introSection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#2d2d2d',
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  introText: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#e0e0e0',
    flex: 1,
  },
  packagesSection: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  packagesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  packageCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#4d4d4d',
  },
  packageCardFeatured: {
    borderColor: '#0066cc',
    backgroundColor: '#1a3a5c',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#0066cc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredBadgeText: {
    color: '#fff',
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
    color: '#ffffff',
  },
  packagePrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0066cc',
  },
  packageDescription: {
    fontSize: 14,
    color: '#b0b0b0',
    marginTop: 4,
  },
  purchasingIndicator: {
    marginTop: 12,
  },
  paywallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    gap: 8,
  },
  paywallButtonText: {
    color: '#fff',
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
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '600',
  },
  proActiveContainer: {
    padding: 16,
  },
  proBadge: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  proBadgeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4dff4d',
    marginTop: 16,
    marginBottom: 8,
  },
  proBadgeText: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
  },
  subscriptionInfoCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  subscriptionInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  subscriptionInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subscriptionInfoLabel: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  subscriptionInfoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  customerCenterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  customerCenterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noPackagesContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noPackagesText: {
    color: '#b0b0b0',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#909090',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  termsButton: {
    padding: 8,
    alignItems: 'center',
  },
  termsButtonText: {
    color: '#0066cc',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
