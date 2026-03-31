// Custom hook for managing Pro subscription status
import { useState, useEffect } from 'react';
import { hasProEntitlement, getCustomerInfo, getActiveSubscriptionInfo, addCustomerInfoUpdateListener } from '../utils/revenueCat';
import logger from '../utils/logger';

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
      logger.error('Error checking Pro status:', error);
      setIsPro(false);
      setSubscriptionInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkProStatus();

    // Listen for customer info updates (uses lazy-loaded RevenueCat)
    const removeListener = addCustomerInfoUpdateListener(({ customerInfo, isPro: proStatus }) => {
      setIsPro(proStatus);

      if (proStatus) {
        const subInfo = getActiveSubscriptionInfo(customerInfo);
        setSubscriptionInfo(subInfo);
      } else {
        setSubscriptionInfo(null);
      }
    });

    return removeListener;
  }, []);

  return {
    isPro,
    loading,
    subscriptionInfo,
    refreshProStatus: checkProStatus,
  };
};
