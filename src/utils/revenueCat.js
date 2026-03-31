// RevenueCat SDK Integration
// Handles subscriptions, entitlements, and customer info

import { Platform } from 'react-native';
import logger from './logger';
import { getEnv } from './env';

// Conditional import to prevent crashes if native modules aren't linked
let Purchases = null;
let isPurchasesAvailable = false;
let purchasesRequireAttempted = false;

// Lazy load RevenueCat SDK - only require when actually needed
const getPurchases = () => {
  if (purchasesRequireAttempted) {
    return Purchases;
  }
  
  purchasesRequireAttempted = true;
  
  try {
    if (Platform.OS !== 'web' && typeof require !== 'undefined') {
      Purchases = require('react-native-purchases').default;
      // Verify Purchases object has required methods
      if (Purchases && typeof Purchases.configure === 'function') {
        isPurchasesAvailable = true;
        return Purchases;
      }
    }
  } catch (error) {
    // Silently fail - RevenueCat SDK requires native build
    // This is expected in Expo Go
    Purchases = null;
    isPurchasesAvailable = false;
  }
  
  return Purchases;
};

// Note: For Expo, you may need to install the Expo config plugin
// Run: npx expo install expo-build-properties
// Then add to app.json plugins array

// RevenueCat API Keys – loaded from env (platform-specific)
const REVENUECAT_API_KEY = Platform.OS === 'ios'
  ? (getEnv('EXPO_PUBLIC_REVENUECAT_IOS_API_KEY') || getEnv('EXPO_PUBLIC_REVENUECAT_API_KEY'))
  : getEnv('EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY');

// Entitlement identifier
const ENTITLEMENT_ID = 'Pop the Hood Pro';

// Product identifiers
export const PRODUCT_IDS = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  LIFETIME: 'lifetime',
};

// Initialize RevenueCat
export const initializeRevenueCat = async (userId = null) => {
  try {
    // Lazy load Purchases if not already loaded
    const PurchasesModule = getPurchases();
    
    // Skip if RevenueCat is not available
    if (!isPurchasesAvailable || !PurchasesModule) {
      // Silently skip - this is expected in Expo Go
      return { success: true, skipped: true };
    }
    
    // Use the loaded module
    Purchases = PurchasesModule;

    // Skip on web
    if (Platform.OS === 'web') {
      return { success: true, skipped: true };
    }

    // Check if already configured
    try {
      const customerInfo = await PurchasesModule.getCustomerInfo();
      // If we can get customer info, it's already configured
      if (__DEV__) {
        console.log('RevenueCat already configured');
      }
      
      // Set user ID if provided and different
      if (userId) {
        await PurchasesModule.logIn(userId);
      }
      
      return { success: true, alreadyConfigured: true };
    } catch (e) {
      // Not configured yet, proceed with configuration
      // Or RevenueCat not available - that's okay, return early
      if (!e.message || (e.message.includes('not available') || e.message.includes('NativeEventEmitter'))) {
        return { success: true, skipped: true };
      }
    }

    // Configure RevenueCat with API key
    if (!REVENUECAT_API_KEY) {
      return { success: true, skipped: true };
    }
    try {
      await PurchasesModule.configure({ apiKey: REVENUECAT_API_KEY });
    } catch (configError) {
      // Configuration failed - RevenueCat not available
      return { success: true, skipped: true };
    }

    // Set user ID if provided
    try {
      if (userId) {
        await PurchasesModule.logIn(userId);
      }
    } catch (loginError) {
      // Login failed - continue anyway
    }

    // Enable debug logs in development
    try {
      if (__DEV__ && PurchasesModule.setLogLevel) {
        PurchasesModule.setLogLevel(PurchasesModule.LOG_LEVEL.DEBUG);
      }
    } catch (logError) {
      // Log level setting failed - continue anyway
    }

    // Set up customer info update listener for real-time updates
    try {
      PurchasesModule.addCustomerInfoUpdateListener((customerInfo) => {
        if (__DEV__) {
          console.log('Customer info updated:', {
            hasPro: customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined,
            activeEntitlements: Object.keys(customerInfo.entitlements.active),
          });
        }
      });
    } catch (listenerError) {
      // Listener setup failed - that's okay, continue without it
    }

    return { success: true };
  } catch (error) {
    logger.error('Error initializing RevenueCat:', error);
    return { success: false, error: error.message };
  }
};

// Get customer info
export const getCustomerInfo = async () => {
  try {
    const PurchasesModule = getPurchases();
    if (!isPurchasesAvailable || !PurchasesModule) {
      return { success: false, error: 'RevenueCat not available', isPro: false };
    }
    const customerInfo = await PurchasesModule.getCustomerInfo();
    return {
      success: true,
      customerInfo,
      isPro: customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined,
    };
  } catch (error) {
    logger.error('Error getting customer info:', error);
    return {
      success: false,
      error: error.message,
      isPro: false,
    };
  }
};

// Check if user has Pro entitlement
export const hasProEntitlement = async () => {
  try {
    const PurchasesModule = getPurchases();
    if (!isPurchasesAvailable || !PurchasesModule) {
      return false;
    }
    const customerInfo = await PurchasesModule.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (error) {
    logger.error('Error checking entitlement:', error);
    return false;
  }
};

// Get available offerings (products)
export const getOfferings = async () => {
  try {
    const PurchasesModule = getPurchases();
    if (!isPurchasesAvailable || !PurchasesModule) {
      return { success: false, error: 'RevenueCat not available', offerings: null, currentOffering: null };
    }
    const offerings = await PurchasesModule.getOfferings();
    return {
      success: true,
      offerings,
      currentOffering: offerings.current,
    };
  } catch (error) {
    logger.error('Error getting offerings:', error);
    return {
      success: false,
      error: error.message,
      offerings: null,
      currentOffering: null,
    };
  }
};

// Purchase a package
export const purchasePackage = async (packageToPurchase) => {
  try {
    if (!isPurchasesAvailable || !Purchases) {
      return { success: false, error: 'RevenueCat not available' };
    }
    
    if (!packageToPurchase) {
      return { success: false, error: 'No package provided' };
    }

    const PurchasesModule = getPurchases();
    if (!isPurchasesAvailable || !PurchasesModule) {
      return { success: false, error: 'RevenueCat not available' };
    }
    const { customerInfo } = await PurchasesModule.purchasePackage(packageToPurchase);
    const isPro = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    
    return {
      success: true,
      customerInfo,
      isPro,
    };
  } catch (error) {
    // Handle user cancellation
    if (error.userCancelled || error.code === 'PURCHASE_CANCELLED') {
      return {
        success: false,
        cancelled: true,
        error: 'Purchase was cancelled',
      };
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('network')) {
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
        networkError: true,
      };
    }

    // Handle store errors
    if (error.code === 'STORE_PROBLEM' || error.message?.includes('store')) {
      return {
        success: false,
        error: 'Store error. Please try again later.',
        storeError: true,
      };
    }

    // Handle other errors
    logger.error('Error purchasing package:', error);
    return {
      success: false,
      error: error.message || error.userInfo?.message || 'Purchase failed. Please try again.',
      errorCode: error.code,
    };
  }
};

// Restore purchases
export const restorePurchases = async () => {
  try {
    if (!isPurchasesAvailable || !Purchases) {
      return { success: false, error: 'RevenueCat not available', isPro: false };
    }
    const PurchasesModule = getPurchases();
    if (!isPurchasesAvailable || !PurchasesModule) {
      return { success: false, error: 'RevenueCat not available', isPro: false };
    }
    const customerInfo = await PurchasesModule.restorePurchases();
    const isPro = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    
    return {
      success: true,
      customerInfo,
      isPro,
    };
  } catch (error) {
    logger.error('Error restoring purchases:', error);
    return {
      success: false,
      error: error.message,
      isPro: false,
    };
  }
};

// Get purchase date for a product
export const getPurchaseDate = (customerInfo, productId) => {
  try {
    const purchaseDate = customerInfo.purchaseDate;
    return purchaseDate || null;
  } catch (error) {
    logger.error('Error getting purchase date:', error);
    return null;
  }
};

// Check if subscription is active
export const isSubscriptionActive = (customerInfo) => {
  try {
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
    if (!entitlement) return false;
    
    // Check if it's a subscription (not lifetime)
    const willRenew = entitlement.willRenew;
    const expirationDate = entitlement.expirationDate;
    
    if (expirationDate) {
      const now = new Date();
      const exp = new Date(expirationDate);
      return exp > now;
    }
    
    return willRenew !== false;
  } catch (error) {
    logger.error('Error checking subscription status:', error);
    return false;
  }
};

// Get active subscription info
export const getActiveSubscriptionInfo = (customerInfo) => {
  try {
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
    if (!entitlement) {
      return {
        isActive: false,
        productIdentifier: null,
        expirationDate: null,
        willRenew: false,
      };
    }

    return {
      isActive: true,
      productIdentifier: entitlement.productIdentifier,
      expirationDate: entitlement.expirationDate,
      willRenew: entitlement.willRenew,
      periodType: entitlement.periodType,
      latestPurchaseDate: entitlement.latestPurchaseDate,
    };
  } catch (error) {
    logger.error('Error getting subscription info:', error);
    return {
      isActive: false,
      productIdentifier: null,
      expirationDate: null,
      willRenew: false,
    };
  }
};

// Log out user (for testing/account switching)
export const logOut = async () => {
  try {
    if (!isPurchasesAvailable || !Purchases) {
      return { success: false, error: 'RevenueCat not available' };
    }
    const PurchasesModule = getPurchases();
    if (!isPurchasesAvailable || !PurchasesModule) {
      return { success: false, error: 'RevenueCat not available' };
    }
    const { customerInfo } = await PurchasesModule.logOut();
    return {
      success: true,
      customerInfo,
    };
  } catch (error) {
    logger.error('Error logging out:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Set user attributes (optional, for analytics)
export const setUserAttributes = async (attributes) => {
  try {
    if (!isPurchasesAvailable || !Purchases) {
      return { success: false, error: 'RevenueCat not available' };
    }
    const PurchasesModule = getPurchases();
    if (!isPurchasesAvailable || !PurchasesModule) {
      return { success: false, error: 'RevenueCat not available' };
    }
    await PurchasesModule.setAttributes(attributes);
    return { success: true };
  } catch (error) {
    logger.error('Error setting user attributes:', error);
    return { success: false, error: error.message };
  }
};

// Add customer info update listener
// Returns a function to remove the listener
export const addCustomerInfoUpdateListener = (callback) => {
  try {
    const PurchasesModule = getPurchases();
    if (!isPurchasesAvailable || !PurchasesModule) {
      return () => {};
    }
    const listener = PurchasesModule.addCustomerInfoUpdateListener((customerInfo) => {
      const isPro = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      callback({
        customerInfo,
        isPro,
        activeEntitlements: Object.keys(customerInfo.entitlements.active),
      });
    });

    return () => {
      try {
        listener.remove();
      } catch (error) {
        if (__DEV__) {
          console.warn('Error removing customer info listener:', error);
        }
      }
    };
  } catch (error) {
    logger.error('Error adding customer info listener:', error);
    return () => {};
  }
};

// Sync customer info (force refresh from RevenueCat servers)
export const syncCustomerInfo = async () => {
  try {
    if (!isPurchasesAvailable || !Purchases) {
      return { success: false, error: 'RevenueCat not available', isPro: false };
    }
    const PurchasesModule = getPurchases();
    if (!isPurchasesAvailable || !PurchasesModule) {
      return { success: false, error: 'RevenueCat not available', isPro: false };
    }
    const customerInfo = await PurchasesModule.getCustomerInfo();
    const isPro = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    return {
      success: true,
      customerInfo,
      isPro,
    };
  } catch (error) {
    logger.error('Error syncing customer info:', error);
    return {
      success: false,
      error: error.message,
      isPro: false,
    };
  }
};
