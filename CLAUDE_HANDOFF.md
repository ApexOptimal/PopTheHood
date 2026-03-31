# Handoff for Claude Code

Use this file to pick up context when working on **Pop the Hood** in Claude Code.

---

## Project summary

- **App**: Pop the Hood — garage/vehicle maintenance assistant (Expo/React Native).
- **Repo**: `pop-the-hood`, slug `garage-assistant`, bundle IDs `com.popthehood.app`.
- **Stack**: Expo ~54, React 19.1, React Native 0.81, bottom tabs + native stack navigation. Uses RevenueCat (subscriptions), Gemini (receipt/vision), AsyncStorage, expo-camera, expo-notifications, Lottie, jspdf.

---

## Critical: no EAS, local builds only

- **Do not use EAS** (no EAS Build, EAS Submit, EAS Secrets).
- **iOS**: Build/run with **Xcode** on this machine (`npx expo run:ios` or open `ios/*.xcworkspace`).
- **Android**: Build/run with **Android Studio** (`npx expo run:android`).
- **Secrets**: Use a **local `.env`** in the project root (see `LOCAL_BUILD_AND_ENV.md`). Example:
  - `EXPO_PUBLIC_GEMINI_API_KEY`
  - `EXPO_PUBLIC_REVENUECAT_API_KEY`
- Never suggest EAS env vars or `eas.json` for secrets.

---

## Key paths

| Area | Path |
|------|------|
| Entry / nav | `App.js` |
| Screens | `src/screens/` |
| Components | `src/components/` |
| Utils / services | `src/utils/`, `src/services/` |
| Native widgets (iOS/Android) | `native-widgets/` (Swift + Kotlin) |
| Config | `app.json`, `package.json` |

Notable screens: `VehiclesScreen`, `VehicleDetailScreen`, `DashboardScreen`, `InventoryScreen`, `PastDueScreen`, `SavingsScreen`, `DiagnosticScreen`, `WarningLightsScreen`, `SettingsScreen`, `WelcomeScreen`, `OnboardingScreen`, `SubscriptionScreen`.

---

## Current state (from last Cursor session)

- **Modified**: Many screens and components (e.g. `VehicleDetailScreen`, `DiagnosticScreen`, `InventoryScreen`, modals like `VehicleFormModal`, `MaintenanceFormModal`, `ReceiptConfidenceModal`), `App.js`, `app.json`, `package.json`, `.gitignore`, and various utils (`oilLife`, `revenueCat`, `visionAI`).
- **New**: Dashboard (e.g. `DashboardScreen.js`, `DashboardCard.js`, `FullThrottleWidget`, `NextMaintenanceWidget`, `ShoppingListWidget`, `ToDoListWidget`), `HealthCheckModal`, `purchaseController.js`, `widgetData.js`, `widgetPush.js`, native widget views and config under `native-widgets/`, scripts (`dump-from-simulator.js`, `export-master-for-ai.js`, `import-ai-corrections.js`, `export-vehicle-database-for-ai.mjs`), and docs (`WIDGETS.md`, `AI_REVIEW_PIPELINE.md`, `LOCAL_BUILD_AND_ENV.md`, etc.).
- **Deleted**: Various `.expo/` cache/prebuild artifacts (safe to regenerate).

When editing, assume this in-progress state: dashboard and widgets, purchase/subscription flow, and AI export/import pipeline are all active areas.

---

## Scripts (package.json)

- `npm start` / `npx expo start` — dev server.
- `npm run ios` / `npm run android` — run native app.
- `npm run prebuild` — regenerate `ios/` and `android/` (e.g. after plugin changes).
- `npm run ai:dump` — dump from simulator (script: `scripts/dump-from-simulator.js`).
- `npm run ai:export` — export master for AI (`scripts/export-master-for-ai.js`).
- `npm run ai:import` — import AI corrections (`scripts/import-ai-corrections.js`).
- `npm run ai:export-db` — export vehicle DB for AI (`scripts/export-vehicle-database-for-ai.mjs`).

---

## Docs to reference

- **Builds & env**: `LOCAL_BUILD_AND_ENV.md`
- **Widgets**: `WIDGETS.md`, `native-widgets/README.md`, `native-widgets/IOS_WIDGET_SETUP.md`
- **RevenueCat**: `REVENUECAT_INTEGRATION.md`, `REVENUECAT_SETUP.md`
- **Gemini**: `GEMINI_SETUP.md`
- **AI pipeline**: `AI_REVIEW_PIPELINE.md`

---

## Conventions / gotchas

- **New architecture**: `app.json` has `newArchEnabled: true`.
- **LogBox**: `App.js` ignores `customLogHandler` logs (known RN/Expo noise).
- **Styling**: Dark UI (`userInterfaceStyle: "dark"`), safe area via `react-native-safe-area-context`.
- **Cursor rule**: `.cursor/rules/no-eas-xcode-only.mdc` enforces “no EAS, local builds only” for this project.

Point Claude Code at this file (and optionally `LOCAL_BUILD_AND_ENV.md` and `WIDGETS.md` if working on build/env or widgets) to continue from here.
