/**
 * Customer Center presentation using RevenueCat UI
 * Allows users to manage their subscriptions
 */

import { Platform } from 'react-native';

// Lazy load RevenueCat UI
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
 * Present Customer Center for subscription management
 * @returns {Promise<Object>} Result object with success status
 */
export async function presentCustomerCenter() {
  const RevenueCatUI = initializeRevenueCatUI();
  
  if (!RevenueCatUI) {
    // RevenueCat UI requires native build - silently return
    // This is expected in Expo Go or development builds without native modules
    return {
      success: false,
      error: 'RevenueCat UI not available'
    };
  }

  try {
    await RevenueCatUI.presentCustomerCenter();
    return {
      success: true
    };
  } catch (error) {
    if (__DEV__) {
      console.error('Error presenting customer center:', error);
    }
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
}

/**
 * Check if Customer Center is available
 * @returns {boolean} True if Customer Center is available
 */
export function isCustomerCenterAvailable() {
  return revenueCatUIAvailable;
}
