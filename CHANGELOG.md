# Changelog

All notable changes to Pop the Hood are documented here.
Use entries from this file when writing App Store / Play Store release notes.

Format: each version lists changes grouped by type.

---

## [Unreleased]

---

## [1.1.0] - 2026-04-01

### Added
- Garage inventory is now included in cloud backup and restore
- After signing in on a fresh install, the app offers to restore from an existing cloud backup
- Cross-platform hint on iOS sign-in screens: use Google if you plan to switch between iPhone and Android

### Fixed
- Dashboard action items now sort by miles remaining, so a second car due in 1,500 miles appears before a first car's 30,000-mile service
- Cloud sync no longer fails when cost, mileage, date, or name fields are empty
- Restoring from cloud now correctly saves downloaded vehicle images locally
- Year, make, and model dropdowns in onboarding now scroll properly on Android
- Year, make, and model picker menus now scroll properly on Android
- Common items picker in Garage now scrolls properly on Android
- Diagnostic screen no longer crashes when Pro status changes mid-session
- Subscribing to monthly or yearly no longer triggers an "unexpected error" screen immediately after purchase
- All three purchase paths (monthly, yearly, lifetime) now navigate back cleanly without hitting the error boundary
- VIN scan success banner now appears after auto-fill so users know their car was identified
- Notes field no longer gets polluted with "Vehicle identified: …" text after a VIN scan
- Subscription screen now auto-navigates back after purchase so Pro features unlock immediately
- "Another web browser is already open" error no longer blocks sign-in attempts
- Apple Sign-In no longer falls through to a web popup on iOS — uses native auth only
- Sign-in timeout (30s) now properly cleans up browser sessions, preventing stale locks
- Friendlier error message for Apple Sign-In configuration issues

### Changed
- Maintenance reminders (notifications) are free for everyone — Settings no longer requires Pro; turning notifications on requests system permission and offers to open Settings if denied
- Pro upgrade screen no longer lists maintenance reminders as a paid-only feature
- After VIN scan, all form fields remain fully editable — year, make, model, trim, and all specs can be changed after auto-fill
- Renamed "Build Sheet" to "Modifications" throughout the app, widgets, and documentation
- Settings screen reordered: Backup & Sync at top, then Notifications, Subscription, Setup, Stay Updated, and remaining sections
- Sign-in messaging updated to explain backup of maintenance history, modifications, and garage (not just "your data")
- Restore from Backup confirmation now shows the date of the cloud backup
- Loading spinner now appears on the correct sign-in button (Google vs Apple)

### Added
- RevenueCat native paywall UI (configured from RevenueCat dashboard) with automatic presentation
- OAuth sign-in timeout utility to prevent infinite loading states
- Cloud backup timestamp query for accurate restore date display
- Android release signing and Play Store-ready AAB build pipeline

### Updated
- RevenueCat SDK updated from 8.12.0 to 9.15.0 (react-native-purchases and react-native-purchases-ui)
