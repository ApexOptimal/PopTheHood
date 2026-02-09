// Custom hook for managing Pro subscription status
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { hasProEntitlement, getCustomerInfo, getActiveSubscriptionInfo } from '../utils/revenueCat';

// TEMPORARILY DISABLED: react-native-purchases has broken internal dependency
// See revenueCat.js for instructions on how to re-enable
let Purchases = null;
let isPurchasesAvailable = false;

// try {
//   if (Platform.OS !== 'web') {
//     Purchases = require('react-native-purchases').default;
//     isPurchasesAvailable = true;
//   }
// } catch (error) {
//   console.warn('RevenueCat SDK not available:', error.message);
//   isPurchasesAvailable = false;
// }

export const useProStatus = () => {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  const checkProStatus = async () => {
    try {
      setLoading(true);
      const proStatus = await hasProEntitlement();
      setIsPro(proStatus);
      
      if (proStatus) {
        const customerInfoResult = await getCustomerInfo();
        if (customerInfoResult.success) {
          const subInfo = getActiveSubscriptionInfo(customerInfoResult.customerInfo);
          setSubscriptionInfo(subInfo);
        }
      } else {
        setSubscriptionInfo(null);
      }
    } catch (error) {
      console.error('Error checking Pro status:', error);
      setIsPro(false);
      setSubscriptionInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkProStatus();

    // Listen for customer info updates (only if RevenueCat is available)
    if (isPurchasesAvailable && Purchases) {
      try {
        const customerInfoUpdateListener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
          const proStatus = customerInfo.entitlements.active['Pop the Hood Pro'] !== undefined;
          setIsPro(proStatus);
          
          if (proStatus) {
            const subInfo = getActiveSubscriptionInfo(customerInfo);
            setSubscriptionInfo(subInfo);
          } else {
            setSubscriptionInfo(null);
          }
        });

        return () => {
          customerInfoUpdateListener.remove();
        };
      } catch (error) {
        console.warn('Error setting up RevenueCat listener:', error);
      }
    }
  }, []);

  return {
    isPro,
    loading,
    subscriptionInfo,
    refreshProStatus: checkProStatus,
  };
};
