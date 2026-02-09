# RevenueCat Integration Guide

This document provides step-by-step instructions for setting up and using RevenueCat in the Garage Assistant app.

## Prerequisites

- RevenueCat account (sign up at https://www.revenuecat.com)
- App Store Connect account (for iOS)
- Google Play Console account (for Android)

## Installation

The RevenueCat SDK has been installed via npm:
```bash
npm install react-native-purchases react-native-purchases-ui
```

## Configuration

### 1. RevenueCat Dashboard Setup

1. **Create a Project** in RevenueCat Dashboard
2. **Add your App**:
   - iOS: Add your bundle identifier (`com.garageassistant.app`)
   - Android: Add your package name (`com.garageassistant.app`)

3. **Configure Products**:
   - Go to Products section
   - Add three products:
     - `monthly` - Monthly subscription
     - `yearly` - Yearly subscription  
     - `lifetime` - Lifetime purchase

4. **Create Entitlement**:
   - Go to Entitlements section
   - Create entitlement: `Garage Assistant Pro`
   - Attach all three products to this entitlement

5. **Create Offering**:
   - Go to Offerings section
   - Create a default offering
   - Add all three packages to the offering
                                                                                                          

#### iOS (App Store Connect)
1. Create in-app purchase products:
   - Monthly subscription (Product ID: `monthly`)
   - Yearly subscription (Product ID: `yearly`)
   - Non-consumable (Product ID: `lifetime`)

2. Configure subscription groups and pricing

#### Android (Google Play Console)
1. Create subscription products:
   - Monthly subscription (Product ID: `monthly`)
   - Yearly subscription (Product ID: `yearly`)

2. Create in-app product:
   - One-time product (Product ID: `lifetime`)

3. Configure pricing and availability

### 3. Update API Key

The test API key is currently configured in `src/utils/revenueCat.js`:
```javascript
const REVENUECAT_API_KEY = 'test_SCIzthhmYCAngNMYGAboUdDTdfK';
```

**Important**: Replace this with your production API key before releasing to production. You can find your API keys in the RevenueCat Dashboard under Project Settings > API Keys.

### 4. Expo Configuration

Since this is an Expo app, you'll need to rebuild the native code after installing RevenueCat:

```bash
# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

## Usage

### Checking Pro Status

```javascript
import { hasProEntitlement } from '../utils/revenueCat';

const isPro = await hasProEntitlement();
```

### Using the Pro Status Hook

```javascript
import { useProStatus } from '../hooks/useProStatus';

function MyComponent() {
  const { isPro, loading, subscriptionInfo } = useProStatus();
  
  if (loading) return <Loading />;
  if (!isPro) return <UpgradePrompt />;
  
  return <ProFeatures />;
}
```

### Opening Subscription Screen

```javascript
navigation.navigate('Subscription');
```

### Presenting RevenueCat Paywall

The subscription screen includes a button to present the RevenueCat Paywall UI:

```javascript
import PurchasesUI from 'react-native-purchases-ui';

await PurchasesUI.presentPaywall();
```

### Customer Center

Users can manage their subscriptions through the Customer Center:

```javascript
import PurchasesUI from 'react-native-purchases-ui';

await PurchasesUI.presentCustomerCenter();
```

## Features Implemented

✅ RevenueCat SDK initialization
✅ Entitlement checking for "Garage Assistant Pro"
✅ Product configuration (Monthly, Yearly, Lifetime)
✅ Purchase flow with error handling
✅ Restore purchases functionality
✅ RevenueCat Paywall integration
✅ Customer Center integration
✅ Subscription status tracking
✅ Customer info retrieval
✅ Real-time subscription updates via listeners

## Testing

### Sandbox Testing

1. **iOS**: Use sandbox test accounts in App Store Connect
2. **Android**: Use test accounts in Google Play Console

### Test Purchases

- Test purchases work automatically in sandbox/test environments
- Use RevenueCat's test mode for development
- Test restore purchases functionality
- Test subscription renewal scenarios

## Best Practices

1. **Always check entitlements**, not product ownership
2. **Handle network errors gracefully**
3. **Provide restore purchases option** for users
4. **Listen for customer info updates** to reflect subscription changes in real-time
5. **Show subscription status** in settings
6. **Use Customer Center** for subscription management
7. **Test thoroughly** before production release

## Error Handling

The implementation includes comprehensive error handling for:
- Network errors
- User cancellations
- Invalid products
- Purchase failures
- Restore failures

## Production Checklist

- [ ] Replace test API key with production key
- [ ] Configure products in App Store Connect / Google Play
- [ ] Set up entitlements in RevenueCat Dashboard
- [ ] Create offerings in RevenueCat Dashboard
- [ ] Test all purchase flows
- [ ] Test restore purchases
- [ ] Test subscription renewals
- [ ] Test Customer Center
- [ ] Update Terms of Service and Privacy Policy URLs
- [ ] Test on real devices (not just simulators)

## Support

For RevenueCat-specific issues, refer to:
- [RevenueCat Documentation](https://www.revenuecat.com/docs)
- [RevenueCat Support](https://www.revenuecat.com/support)

## Additional Resources

- [RevenueCat React Native SDK](https://www.revenuecat.com/docs/getting-started/installation/reactnative)
- [RevenueCat Paywalls](https://www.revenuecat.com/docs/tools/paywalls)
- [RevenueCat Customer Center](https://www.revenuecat.com/docs/tools/customer-center)
