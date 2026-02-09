/**
 * Paywall presentation using RevenueCat UI
 * Shows paywall after onboarding + 3 minutes of usage
 * Uses modern RevenueCat UI SDK methods
 */

import { Platform } from 'react-native';

// Lazy load RevenueCat UI to prevent bundling issues
let RevenueCatUI = null;
let revenueCatUIAvailable = false;

/**
 * Initialize RevenueCat UI
 */
const initializeRevenueCatUI = () => {
  if (revenueCatUIAvailable && RevenueCatUI) {
    return RevenueCatUI;
  }

  // Skip on web
  if (Platform.OS === 'web') {
    revenueCatUIAvailable = false;
    return null;
  }

  // Dynamic path so Metro doesn't resolve at bundle time (package may be omitted)
  try {
    if (typeof require !== 'undefined') {
      const purchasesUIModule = require('react-native-' + 'purchases-ui');
      if (purchasesUIModule && purchasesUIModule.default) {
        RevenueCatUI = purchasesUIModule.default;
        revenueCatUIAvailable = true;
        return RevenueCatUI;
      }
    }
  } catch (error) {
    // Silently fail when package is not installed or native module not linked
  }

  revenueCatUIAvailable = false;
  return null;
};

/**
 * Present paywall if user doesn't have Pro entitlement
 * @param {Object} options - Options for paywall presentation
 * @param {string} options.requiredEntitlementIdentifier - Entitlement identifier (default: "Pop the Hood Pro")
 * @param {Object} options.offering - Optional specific offering to present
 * @returns {Promise<Object>} Result object with success status and result type
 */
export async function presentPaywallIfNeeded(options = {}) {
  const RevenueCatUI = initializeRevenueCatUI();
  
  if (!RevenueCatUI) {
    // RevenueCat UI requires native build - silently return
    // This is expected in Expo Go or development builds without native modules
    return {
      success: false,
      error: 'RevenueCat UI not available',
      result: null
    };
  }

  try {
    const { PAYWALL_RESULT } = RevenueCatUI;
    const requiredEntitlement = options.requiredEntitlementIdentifier || 'Pop the Hood Pro';
    
    const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: requiredEntitlement,
      offering: options.offering || undefined
    });

    // Map result to boolean and return details
    const result = {
      success: true,
      result: paywallResult,
      purchased: paywallResult === PAYWALL_RESULT.PURCHASED,
      restored: paywallResult === PAYWALL_RESULT.RESTORED,
      cancelled: paywallResult === PAYWALL_RESULT.CANCELLED,
      notPresented: paywallResult === PAYWALL_RESULT.NOT_PRESENTED,
      error: paywallResult === PAYWALL_RESULT.ERROR
    };

    return result;
  } catch (error) {
    if (__DEV__) {
      console.error('Error presenting paywall:', error);
    }
    return {
      success: false,
      error: error.message || 'Unknown error',
      result: null
    };
  }
}

/**
 * Present paywall unconditionally
 * @param {Object} options - Options for paywall presentation
 * @param {Object} options.offering - Optional specific offering to present
 * @returns {Promise<Object>} Result object with success status and result type
 */
export async function presentPaywall(options = {}) {
  const RevenueCatUI = initializeRevenueCatUI();
  
  if (!RevenueCatUI) {
    // RevenueCat UI requires native build - silently return
    // This is expected in Expo Go or development builds without native modules
    return {
      success: false,
      error: 'RevenueCat UI not available',
      result: null
    };
  }

  try {
    const { PAYWALL_RESULT } = RevenueCatUI;
    
    const paywallResult = options.offering
      ? await RevenueCatUI.presentPaywall({ offering: options.offering })
      : await RevenueCatUI.presentPaywall();

    const result = {
      success: true,
      result: paywallResult,
      purchased: paywallResult === PAYWALL_RESULT.PURCHASED,
      restored: paywallResult === PAYWALL_RESULT.RESTORED,
      cancelled: paywallResult === PAYWALL_RESULT.CANCELLED,
      notPresented: paywallResult === PAYWALL_RESULT.NOT_PRESENTED,
      error: paywallResult === PAYWALL_RESULT.ERROR
    };

    return result;
  } catch (error) {
    if (__DEV__) {
      console.error('Error presenting paywall:', error);
    }
    return {
      success: false,
      error: error.message || 'Unknown error',
      result: null
    };
  }
}

/**
 * Check if RevenueCat UI is available
 * @returns {boolean} True if RevenueCat UI is available
 */
export function isRevenueCatUIAvailable() {
  return revenueCatUIAvailable;
}
