# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pop the Hood** — a React Native (Expo 54, RN 0.81) mobile app for vehicle maintenance tracking, garage inventory management, and DIY savings. Dark-theme-only. Supports iOS and Android.

- Bundle ID: `com.popthehood.app`
- URL scheme: `popthehood://`
- Entitlement: `Pop the Hood Pro` (monthly, yearly, lifetime via RevenueCat)

## Build & Run Commands

```bash
npm install                          # Install dependencies
npx expo run:ios                     # Build & run on iOS (requires Xcode)
npx expo run:android                 # Build & run on Android (requires Android Studio)
npx expo prebuild --clean            # Regenerate native ios/ and android/ folders
npx expo run:ios --configuration Release   # Production iOS build
npx expo run:android --configuration Release  # Production Android build
```

**No EAS.** All builds are local only — Xcode for iOS, Android Studio for Android. Do not suggest or use EAS Build, EAS Submit, EAS Secrets, or `eas.json` env blocks. API keys live in a local `.env` file (see `LOCAL_BUILD_AND_ENV.md`).

There is no test suite. No linter configured.

### AI Data Scripts

```bash
npm run ai:dump       # Dump data from simulator
npm run ai:export     # Export app data for AI review
npm run ai:import     # Import AI corrections
npm run ai:export-db  # Export vehicle specs database
```

## Architecture

### State Management

All app state lives in `App.js` as lifted React state (`vehicles`, `inventory`, `todos`, `shoppingList`, onboarding state). Props are passed down to screens and components. There is no Redux or global context (except `ThemeContext` for design tokens and user persona).

**Persistence:** `src/utils/storage.js` wraps AsyncStorage with a synchronous in-memory cache layer. All data is local-first. Cloud sync via Supabase is a Pro-only optional feature (`src/utils/sync.js`).

### Navigation

Bottom tab navigator (4 tabs: Dashboard, Vehicles, Garage, Diagnostics) defined in `App.js`. Vehicles and Diagnostics tabs use stack navigators for sub-screens. Deep linking uses the `popthehood://` scheme for widget integration.

### Key Integrations

| Service | Purpose | Key Files |
|---------|---------|-----------|
| RevenueCat | Subscriptions & paywall | `src/utils/revenueCat.js`, `src/utils/paywall.js`, `src/services/purchaseController.js`, `src/hooks/useProStatus.js` |
| Google Gemini | Receipt OCR, product ID, AI Mechanic chat | `src/utils/visionAI.js`, `src/utils/receiptScanService.js` |
| Supabase | Optional cloud sync (Pro) | `src/utils/supabase.js`, `src/utils/sync.js` |
| Sentry | Error tracking (production only) | Configured in `App.js` |

### Onboarding Flow

Multi-stage onboarding in `src/screens/onboarding/`: QuickAdd → MaintenanceBaseline → PersonaSelect → HealthScoreReveal. Controlled by `onboardingPhase` state in `App.js`. Paywall triggers after onboarding + 3 minutes of active usage (one-time).

### Receipt Scanning Pipeline

Photo → Gemini Vision OCR → extract mileage/cost → user classifies (service vs parts) → if parts: add to inventory or log as maintenance → pre-fill maintenance form.

### Theme System

Centralized in `src/theme/` — dark theme only. `ThemeContext` provides colors, spacing, typography, and borders. All screens should use theme tokens, not hardcoded colors.

### Native Widgets

iOS (Swift) and Android (Kotlin) home screen widgets in `native-widgets/`. Data pushed via `src/utils/widgetData.js` → OS-specific storage (App Groups / SharedPreferences). Widgets deep-link back to the app.

### Vehicle Data

`src/data/vehicleData.js` is a large (~285KB) static database of vehicle makes, models, trims, and part specs. Maintained via the AI export/import scripts.

## Environment Variables

All secrets use `EXPO_PUBLIC_` prefix and are loaded via `app.config.js` from a `.env` file. Key vars: `EXPO_PUBLIC_GEMINI_API_KEY`, `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`, `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_SENTRY_DSN`.

## Changelog

**You must maintain `CHANGELOG.md` at the project root.** After completing any user-visible change (feature, fix, UI tweak, copy change), append an entry under the `## [Unreleased]` section using these categories:

- **Added** — new features or capabilities
- **Changed** — modifications to existing behavior, UI, or copy
- **Fixed** — bug fixes
- **Removed** — features or code that was taken out

Keep entries concise (one line each), written from the user's perspective. Example:

```
### Fixed
- App no longer crashes when adding a vehicle without an image
```

When the user ships a release, move `[Unreleased]` entries under a new `## [x.x.x] - YYYY-MM-DD` heading. This file is used to write App Store and Play Store release notes.

## Important Constraints

- **No Expo Go** — native modules (RevenueCat, camera, notifications) require development builds
- **New Architecture enabled** (`newArchEnabled: true`) — RN 0.81+
- **Portrait only** orientation
- RevenueCat requires a native build to test purchases
- Web platform has very limited functionality
