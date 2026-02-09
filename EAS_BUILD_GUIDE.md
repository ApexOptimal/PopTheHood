✅ **EAS is already configured:**
- `eas.json` file exists with build profiles
- EAS Project ID: `0a24e4bd-4199-4cd2-b77b-5f6694503d9d`
- Bundle identifiers configured:
  - iOS: `com.garageassistant.app`
  - Android: `com.garageassistant.app`

## Installation

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

Or use npx (no installation needed):
```bash
npx eas-cli
```

### 2. Login to Expo

```bash
npx eas login
```

You'll need an Expo account (free tier available).

## Building iOS Apps (No Mac Required!)

### Build iOS App

```bash
# Build for iOS (development)
npx eas build --platform ios --profile development

# Build for iOS (preview/testing)
npx eas build --platform ios --profile preview

# Build for iOS (production - App Store)
npx eas build --platform ios --profile production
```

### Build Android App

```bash
# Build for Android (development)
npx eas build --platform android --profile development

# Build for Android (preview/testing)
npx eas build --platform android --profile preview

# Build for Android (production - Play Store)
npx eas build --platform android --profile production
```

### Build Both Platforms

```bash
npx eas build --platform all --profile production
```

## Build Profiles (from eas.json)

Your current build profiles:

1. **development** - Development builds with dev client
   - For testing during development
   - Includes development tools

2. **preview** - Internal distribution
   - For testing before production
   - Can be distributed via TestFlight (iOS) or internal testing (Android)

3. **production** - Production builds
   - For App Store and Play Store
   - Auto-increments version numbers

## iOS App Store Requirements

### Before Building for Production

1. **Apple Developer Account** ($99/year)
   - Required to submit to App Store
   - Sign up at: https://developer.apple.com

2. **App Store Connect Setup**
   - Create your app in App Store Connect
   - Configure app metadata, screenshots, etc.

3. **Credentials**
   - EAS can automatically manage certificates and provisioning profiles
   - Or you can provide your own

### First Time iOS Build

EAS will guide you through:
- Apple Developer account setup
- Certificate generation
- Provisioning profile creation

Just follow the prompts when you run:
```bash
npx eas build --platform ios --profile production
```

## Android Play Store Requirements

### Before Building for Production

1. **Google Play Developer Account** ($25 one-time)
   - Required to publish to Play Store
   - Sign up at: https://play.google.com/console

2. **App Signing**
   - EAS can manage your signing key automatically
   - Or you can upload your own keystore

## Cost Comparison

### EAS Build Pricing (as of 2024)

**Free Tier:**
- 30 builds per month
- Perfect for development and testing

**Production Tier:**
- $29/month
- Unlimited builds
- Priority queue
- Better for frequent releases

**vs. Buying a Mac:**
- Mac Mini: $599+
- MacBook: $999+
- One-time cost, but you still need:
  - Apple Developer account ($99/year)
  - Xcode (free, but Mac-only)
  - Time to set up and maintain

**Recommendation:** Use EAS Build - it's much cheaper and easier!

## Workflow

### Development Workflow

1. **Local Development:**
   ```bash
   npm start
   # Test on device/emulator
   ```

2. **Build Development Version:**
   ```bash
   npx eas build --platform ios --profile development
   # Install on test devices
   ```

3. **Test Preview Build:**
   ```bash
   npx eas build --platform all --profile preview
   # Distribute to testers
   ```

4. **Production Build:**
   ```bash
   npx eas build --platform all --profile production
   # Submit to stores
   ```

### Submitting to Stores

**iOS (App Store):**
```bash
npx eas submit --platform ios
```

**Android (Play Store):**
```bash
npx eas submit --platform android
```

## Environment Variables

If you need to set environment variables for builds:

1. Create `.env` file (don't commit secrets!)
2. Or use EAS secrets:
   ```bash
   npx eas secret:create --scope project --name API_KEY --value your-key
   ```

## Troubleshooting

### Build Fails

- Check build logs in Expo dashboard
- Verify credentials are set up correctly
- Ensure all dependencies are compatible

### Credential Issues

- EAS can regenerate certificates if needed
- Run: `npx eas credentials` to manage credentials

### Version Conflicts

- EAS auto-increments versions in production profile
- Check `app.json` for version settings

## Next Steps

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login:**
   ```bash
   npx eas login
   ```

3. **Test Build:**
   ```bash
   npx eas build --platform ios --profile preview
   ```

4. **Monitor Build:**
   - Check status in terminal
   - Or visit: https://expo.dev/accounts/[your-account]/projects/garage-assistant/builds

## Resources

- EAS Build Docs: https://docs.expo.dev/build/introduction/
- EAS Submit Docs: https://docs.expo.dev/submit/introduction/
- Pricing: https://expo.dev/pricing

---

**Bottom Line:** You can build and publish iOS apps without a Mac using EAS Build! 🎉
