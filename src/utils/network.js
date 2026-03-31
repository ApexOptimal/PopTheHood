/**
 * Network connectivity utility.
 * Provides a simple check and hook for online/offline status.
 */
import NetInfo from '@react-native-community/netinfo';

/**
 * Returns true if the device has an active internet connection.
 */
export async function isOnline() {
  try {
    const state = await NetInfo.fetch();
    return !!(state.isConnected && state.isInternetReachable !== false);
  } catch {
    return true; // assume online if check fails
  }
}

/**
 * Convenience: throws a user-friendly error if offline.
 * Call at the top of any network-dependent operation.
 */
export async function requireNetwork(featureName = 'This feature') {
  const online = await isOnline();
  if (!online) {
    throw new Error(`${featureName} requires an internet connection. Please check your network and try again.`);
  }
}
