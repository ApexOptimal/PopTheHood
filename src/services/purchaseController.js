/**
 * Purchase Controller — single entry point for all in-app purchase logic.
 * Handles production and sandbox; keeps RevenueCat details out of UI.
 * API key: EXPO_PUBLIC_REVENUECAT_API_KEY (e.g. from .env).
 */

import { Platform } from 'react-native';
import {
  initializeRevenueCat,
  getOfferings as rcGetOfferings,
  purchasePackage as rcPurchasePackage,
  restorePurchases as rcRestorePurchases,
  getCustomerInfo as rcGetCustomerInfo,
  addCustomerInfoUpdateListener as rcAddCustomerInfoUpdateListener,
  getActiveSubscriptionInfo,
  hasProEntitlement,
} from '../utils/revenueCat';

// Entitlement and product identifiers (single source of truth)
export const ENTITLEMENT_ID = 'Pop the Hood Pro';
export const PRODUCT_IDS = { MONTHLY: 'monthly', YEARLY: 'yearly', LIFETIME: 'lifetime' };

// Result shapes for UI
const NOT_AVAILABLE = { success: false, error: 'Purchases not available', unavailable: true };

/**
 * Initialize the Purchases SDK. Call once at app launch.
 * API key from EXPO_PUBLIC_REVENUECAT_API_KEY (env / .env).
 * @param {string|null} userId - Optional app user id to identify the user
 * @returns {Promise<{ success: boolean, skipped?: boolean, alreadyConfigured?: boolean, error?: string }>}
 */
export async function initialize(userId = null) {
  const result = await initializeRevenueCat(userId);
  if (result.success && !result.skipped && __DEV__) {
    console.log('[PurchaseController] SDK initialized (key from env)');
  }
  return result;
}

/**
 * Fetch current offerings and return packages in a UI-friendly shape.
 * @returns {Promise<{
 *   success: boolean,
 *   currentOffering: object|null,
 *   packages: Array<{ identifier: string, packageType: string, product: object, title: string }>,
 *   error?: string,
 *   unavailable?: boolean
 * }>}
 */
export async function fetchOfferings() {
  const result = await rcGetOfferings();
  if (!result.success) {
    return {
      success: false,
      currentOffering: null,
      packages: [],
      error: result.error,
      unavailable: result.error === 'RevenueCat not available',
    };
  }
  const current = result.currentOffering;
  if (!current) {
    return {
      success: true,
      currentOffering: null,
      packages: [],
      error: 'No current offering',
    };
  }
  const rawPackages = current.availablePackages || [];
  const packages = rawPackages.map((pkg) => ({
    identifier: pkg.identifier,
    packageType: pkg.packageType,
    product: pkg.product,
    title: pkg.product?.title ?? pkg.identifier,
  }));
  return {
    success: true,
    currentOffering: current,
    packages,
  };
}

/**
 * Log sandbox / environment when available on customer info.
 * RevenueCat SDK may expose sandbox via customerInfo in some versions.
 * @param {object} customerInfo - RevenueCat CustomerInfo
 * @param {string} source - Label for logs (e.g. 'purchase', 'restore', 'getCustomerInfo')
 */
function logSandboxIfAvailable(customerInfo, source = '') {
  if (!customerInfo || !__DEV__) return;
  const prefix = '[PurchaseController]';
  const label = source ? ` (${source})` : '';
  // RevenueCat RN SDK: check common places for sandbox/environment
  const isSandbox =
    customerInfo.isSandbox === true ||
    customerInfo.sandbox === true ||
    (typeof customerInfo.managementURL === 'string' && customerInfo.managementURL.includes('sandbox'));
  if (typeof customerInfo.isSandbox !== 'undefined') {
    console.log(`${prefix} isSandbox${label}:`, Boolean(customerInfo.isSandbox));
  }
  if (typeof customerInfo.sandbox !== 'undefined') {
    console.log(`${prefix} sandbox${label}:`, Boolean(customerInfo.sandbox));
  }
  if (isSandbox) {
    console.log(`${prefix} Sandbox environment detected${label}. Use this for test runs.`);
  }
  // Always log in dev so tester can verify environment (e.g. StoreKit sandbox)
  console.log(`${prefix} CustomerInfo requestDate${label}:`, customerInfo.requestDate || 'n/a');
}

/**
 * Get customer info and optionally log sandbox when available.
 * @returns {Promise<{ success: boolean, customerInfo?: object, isPro?: boolean, isSandbox?: boolean, error?: string }>}
 */
export async function getCustomerInfo() {
  const result = await rcGetCustomerInfo();
  if (result.success && result.customerInfo) {
    logSandboxIfAvailable(result.customerInfo, 'getCustomerInfo');
    const isSandbox =
      result.customerInfo.isSandbox === true || result.customerInfo.sandbox === true;
    return {
      ...result,
      isSandbox: isSandbox || undefined,
    };
  }
  return result;
}

/**
 * Purchase a package. Handles success, restore, cancellations, and errors.
 * @param {object} packageToPurchase - RevenueCat Package from offerings
 * @returns {Promise<{
 *   success: boolean,
 *   customerInfo?: object,
 *   isPro?: boolean,
 *   cancelled?: boolean,
 *   networkError?: boolean,
 *   storeError?: boolean,
 *   error?: string,
 *   errorCode?: string
 * }>}
 */
export async function purchase(packageToPurchase) {
  if (!packageToPurchase) {
    return { success: false, error: 'No package provided' };
  }
  const result = await rcPurchasePackage(packageToPurchase);
  if (result.success && result.customerInfo) {
    logSandboxIfAvailable(result.customerInfo, 'purchase');
    return result;
  }
  // Normalized error (already shaped in revenueCat.js)
  if (result.cancelled) {
    return { success: false, cancelled: true, error: result.error || 'Purchase was cancelled' };
  }
  if (result.networkError) {
    return {
      success: false,
      networkError: true,
      error: result.error || 'Network error. Please check your connection and try again.',
    };
  }
  if (result.storeError) {
    return {
      success: false,
      storeError: true,
      error: result.error || 'Store error. Please try again later.',
    };
  }
  return {
    success: false,
    error: result.error || 'Purchase failed.',
    errorCode: result.errorCode,
  };
}

/**
 * Restore previous purchases.
 * @returns {Promise<{
 *   success: boolean,
 *   customerInfo?: object,
 *   isPro?: boolean,
 *   error?: string
 * }>}
 */
export async function restore() {
  const result = await rcRestorePurchases();
  if (result.success && result.customerInfo) {
    logSandboxIfAvailable(result.customerInfo, 'restore');
    return result;
  }
  return {
    success: false,
    isPro: false,
    error: result.error || 'Restore failed.',
    networkError: result.networkError,
    storeError: result.storeError,
  };
}

/**
 * Subscribe to customer info updates (e.g. for Pro status in UI).
 * @param {function} callback - Called with { customerInfo, isPro, activeEntitlements }
 * @returns {function} Remove listener
 */
export function addCustomerInfoUpdateListener(callback) {
  return rcAddCustomerInfoUpdateListener((payload) => {
    if (payload.customerInfo) {
      logSandboxIfAvailable(payload.customerInfo, 'listener');
    }
    callback(payload);
  });
}

/**
 * Check if the Purchases SDK is available (native build; not Expo Go).
 * @returns {boolean}
 */
export function isPurchasesAvailable() {
  return Platform.OS !== 'web' && typeof require !== 'undefined';
}

// Re-export for UI: single import for subscription state
export { getActiveSubscriptionInfo, hasProEntitlement };
