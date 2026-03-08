// AsyncStorage Implementation for React Native
// Provides persistent key-value storage for React Native apps

import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory cache for synchronous access during initialization
const syncGetCache = {};
let syncGetInitialized = false;

// Initialize cache from AsyncStorage
const initializeSyncCache = async () => {
  if (syncGetInitialized) return;
  
  try {
    const keysToLoad = ['vehicles', 'inventory', 'welcomeCompleted', 'onboardingCompleted', 'notificationsEnabled', 'barcodeCache', 'unitSystem', 'onboardingCompletionTime', 'totalUsageTime', 'lastSessionStart', 'paywallShown', 'userPersona', 'onboardingPhase'];
    for (const key of keysToLoad) {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          // Some keys are stored as plain strings/numbers, not JSON
          if (key === 'unitSystem' || key === 'onboardingCompletionTime' || key === 'lastSessionStart' || key === 'userPersona' || key === 'onboardingPhase') {
            syncGetCache[key] = item;
          } else if (key === 'totalUsageTime') {
            const parsed = parseFloat(item);
            syncGetCache[key] = isNaN(parsed) ? 0 : parsed;
          } else if (key === 'paywallShown' || key === 'welcomeCompleted') {
            syncGetCache[key] = item === 'true';
          } else {
            syncGetCache[key] = JSON.parse(item);
          }
        }
      } catch (e) {
        // Ignore parse errors
        console.warn(`Error loading ${key} from cache:`, e);
      }
    }
    syncGetInitialized = true;
  } catch (error) {
    console.error('Error initializing sync cache:', error);
    syncGetInitialized = true;
  }
};

// Initialize cache on load
initializeSyncCache();

// Estimate storage size (approximate)
export const getStorageSize = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    let total = 0;
    
    for (const key of allKeys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        total += key.length;
        total += value.length;
      }
    }
    
    // Convert to MB
    return (total / (1024 * 1024)).toFixed(2);
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return '0.00';
  }
};

export const storage = {
  // Synchronous get (uses cache for immediate access)
  get: (key) => {
    // Check cache first
    if (key in syncGetCache) {
      return syncGetCache[key];
    }
    
    // Return null if not in cache yet (will be populated async)
    return null;
  },
  
  // Asynchronous get (always fresh data)
  getAsync: async (key) => {
    try {
        const item = await AsyncStorage.getItem(key);
        if (item === null) {
          return null;
        }
        
        // Some keys are stored as plain strings/numbers, not JSON
        if (key === 'unitSystem' || key === 'onboardingCompletionTime' || key === 'lastSessionStart' || key === 'userPersona' || key === 'onboardingPhase') {
          syncGetCache[key] = item;
          return item;
        }
        
        // totalUsageTime is stored as a number
        if (key === 'totalUsageTime') {
          const parsed = parseFloat(item);
          syncGetCache[key] = isNaN(parsed) ? 0 : parsed;
          return syncGetCache[key];
        }
        
        // paywallShown and welcomeCompleted are booleans stored as strings
        if (key === 'paywallShown' || key === 'welcomeCompleted') {
          const parsed = item === 'true';
          syncGetCache[key] = parsed;
          return parsed;
        }
        
        // Everything else is JSON
        const parsed = JSON.parse(item);
        syncGetCache[key] = parsed;
        return parsed;
    } catch (error) {
      console.error('Error in getAsync:', error);
      return null;
    }
  },
  
  // Set (async but returns immediately)
  set: async (key, value) => {
    try {
      // Update cache immediately for synchronous access
      syncGetCache[key] = value;
      
      // Save to AsyncStorage
      // Some keys are stored as plain strings/numbers, not JSON
      let serialized;
      if (key === 'unitSystem' || key === 'onboardingCompletionTime' || key === 'lastSessionStart' || key === 'userPersona' || key === 'onboardingPhase') {
        serialized = String(value);
      } else if (key === 'totalUsageTime') {
        serialized = String(value); // Store as string representation of number
      } else if (key === 'paywallShown' || key === 'welcomeCompleted') {
        serialized = String(value); // Store boolean as string
      } else {
        serialized = JSON.stringify(value);
      }
      await AsyncStorage.setItem(key, serialized);
      
      // Estimate size for logging
      const sizeMB = (serialized.length / (1024 * 1024)).toFixed(2);
      if (parseFloat(sizeMB) > 5) {
        console.warn(`Warning: Saving ${sizeMB}MB to AsyncStorage for key "${key}"`);
      }
      
      return true;
    } catch (error) {
      console.error('Error in set:', error);
      // Remove from cache on error
      delete syncGetCache[key];
      
      // Check if it's a quota error
      if (error.message && error.message.includes('quota') || error.message.includes('QuotaExceeded')) {
        const currentSize = await getStorageSize();
        const errorMsg = `Storage quota exceeded! Current usage: ${currentSize}MB. ` +
          `Please delete some images or other data to free up space.`;
        console.error(errorMsg);
        // In React Native, we can't use alert directly - would need to use Alert from react-native
        return false;
      }
      
      return false;
    }
  },
  
  // Remove
  remove: async (key) => {
    try {
      // Remove from cache
      delete syncGetCache[key];
      
      // Remove from AsyncStorage
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error in remove:', error);
    }
  },
  
  // Get approximate storage usage (async)
  getUsage: async () => {
    return await getStorageSize();
  },
  
  // Clear all data
  clear: async () => {
    try {
      // Clear cache
      Object.keys(syncGetCache).forEach(key => delete syncGetCache[key]);
      
      // Clear AsyncStorage
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error in clear:', error);
    }
  }
};

// Export async version for components that can use it
export const storageAsync = {
  get: storage.getAsync,
  set: storage.set,
  remove: storage.remove,
  getUsage: storage.getUsage,
  clear: storage.clear
};
