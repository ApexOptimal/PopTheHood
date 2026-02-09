# RevenueCat SDK Integration Guide

This document provides a complete guide to the RevenueCat SDK integration in the Garage Assistant app.

## Installation

The RevenueCat SDK packages are already installed:
- `react-native-purchases` (v9.7.1)
- `react-native-purchases-ui` (v9.7.1)

## Configuration

### API Key
The app is configured with the test API key: `test_SCIzthhmYCAngNMYGAboUdDTdfK`

**Important**: Before releasing to production, update the API key in `src/utils/revenueCat.js`:
```javascript
const REVENUECAT_API_KEY = 'your_production_api_key_here';
```

### Entitlement Identifier
- **Entitlement ID**: `Garage Assistant Pro`

### Product Identifiers
- Monthly: `monthly`
- Yearly: `yearly`
- Lifetime: `lifetime`

## Implementation Overview

### 1. Core SDK (`src/utils/revenueCat.js`)

The core RevenueCat SDK utility provides:

- **Initialization**: `initializeRevenueCat(userId?)` - Configures RevenueCat with API key
- **Customer Info**: `getCustomerInfo()` - Gets current customer information
- **Entitlement Checking**: `hasProEntitlement()` - Checks if user has Pro entitlement
- **Offerings**: `getOfferings()` - Gets available subscription packages
- **Purchase**: `purchasePackage(package)` - Purchases a subscription package
- **Restore**: `restorePurchases()` - Restores previous purchases
- **Customer Info Listener**: `addCustomerInfoUpdateListener(callback)` - Listens for real-time updates
- **Sync**: `syncCustomerInfo()` - Forces refresh from RevenueCat servers

### 2. Paywall Utility (`src/utils/paywall.js`)

Modern paywall presentation using RevenueCat UI:

- **presentPaywallIfNeeded(options)**: Shows paywall only if user doesn't have entitlement
- **presentPaywall(options)**: Shows paywall unconditionally

Both functions return detailed result objects with purchase/restore/cancel status.

### 3. Customer Center (`src/utils/customerCenter.js`)

Subscription management interface:

- **presentCustomerCenter()**: Opens RevenueCat Customer Center for subscription management

### 4. App Integration (`App.js`)

RevenueCat is initialized on app startup:
- Initializes SDK when app loads
- Sets up customer info update listeners
- Handles real-time entitlement updates

### 5. Subscription Screen (`src/screens/SubscriptionScreen.js`)

Complete subscription management UI:
- Displays available packages (Monthly, Yearly, Lifetime)
- Shows current subscription status
- Handles purchases and restores
- Integrates with RevenueCat UI paywall
- Provides Customer Center access

## Usage Examples

### Check if User Has Pro

```javascript
import { hasProEntitlement } from './src/utils/revenueCat';

const isPro = await hasProEntitlement();
if (isPro) {
  // User has Pro access
}
```

### Present Paywall

```javascript
import { presentPaywallIfNeeded } from './src/utils/paywall';

const result = await presentPaywallIfNeeded({
  requiredEntitlementIdentifier: 'Garage Assistant Pro'
});

if (result.purchased || result.restored) {
  // User purchased or restored
} else if (result.cancelled) {
  // User cancelled
}
```

### Listen for Customer Info Updates

```javascript
import { addCustomerInfoUpdateListener } from './src/utils/revenueCat';

useEffect(() => {
  const removeListener = addCustomerInfoUpdateListener(({ customerInfo, isPro }) => {
    // Handle entitlement changes in real-time
    console.log('Pro status:', isPro);
  });

  return () => {
    removeListener();
  };
}, []);
```

### Purchase a Package

```javascript
import { getOfferings, purchasePackage } from './src/utils/revenueCat';

// Get offerings
const { currentOffering } = await getOfferings();

// Purchase first package
if (currentOffering && currentOffering.availablePackages.length > 0) {
  const result = await purchasePackage(currentOffering.availablePackages[0]);
  
  if (result.success && result.isPro) {
    // Purchase successful
  }
}
```

### Open Customer Center

```javascript
import { presentCustomerCenter } from './src/utils/customerCenter';

const result = await presentCustomerCenter();
if (result.success) {
  // Customer center opened
}
```

## Automatic Paywall

The app automatically shows a paywall after:
1. User completes onboarding
2. User has used the app for 3 minutes

This is handled in `App.js` using:
- `src/utils/appUsageTracking.js` - Tracks usage time
- `src/utils/paywall.js` - Presents paywall

## Error Handling

All RevenueCat functions include comprehensive error handling:

- **User Cancellation**: Detected and handled gracefully
- **Network Errors**: Specific error messages for network issues
- **Store Errors**: Handles App Store/Play Store errors
- **Fallback**: Graceful degradation if RevenueCat is unavailable

## Best Practices

1. **Always Check Availability**: Functions check if RevenueCat is available before use
2. **Handle Errors Gracefully**: All errors are caught and return user-friendly messages
3. **Real-time Updates**: Use customer info listeners for immediate entitlement updates
4. **Sync on App Start**: Customer info is synced when app initializes
5. **Web Support**: All functions gracefully handle web platform (skip RevenueCat)

## Testing

### Development Mode
- Debug logs are enabled in development (`__DEV__`)
- Test API key is used
- Errors are logged to console

### Production Checklist
- [ ] Update API key to production key
- [ ] Test on real devices (iOS and Android)
- [ ] Verify products are configured in RevenueCat dashboard
- [ ] Test purchase flow end-to-end
- [ ] Test restore purchases
- [ ] Test Customer Center
- [ ] Verify entitlement checking works correctly

## RevenueCat Dashboard Setup

Ensure the following are configured in your RevenueCat dashboard:

1. **Products**: Create products with identifiers:
   - `monthly`
   - `yearly`
   - `lifetime`

2. **Entitlement**: Create entitlement:
   - Identifier: `Garage Assistant Pro`
   - Attach products to entitlement

3. **Offerings**: Create an offering with packages:
   - Monthly package
   - Yearly package
   - Lifetime package

4. **App Store Connect / Google Play Console**:
   - Configure in-app purchases
   - Link products to RevenueCat

## Troubleshooting

### RevenueCat Not Available
- Ensure native modules are linked: `npx expo run:ios` or `npx expo run:android`
- Check that packages are installed: `npm list react-native-purchases`

### Paywall Not Showing
- Check that offerings are configured in RevenueCat dashboard
- Verify API key is correct
- Check console logs for errors

### Purchases Not Working
- Ensure products are configured in App Store Connect / Google Play Console
- Verify products are linked in RevenueCat dashboard
- Test with sandbox accounts

## Additional Resources

- [RevenueCat React Native Docs](https://www.revenuecat.com/docs/getting-started/installation/reactnative)
- [RevenueCat Paywalls](https://www.revenuecat.com/docs/tools/paywalls)
- [RevenueCat Customer Center](https://www.revenuecat.com/docs/tools/customer-center)
