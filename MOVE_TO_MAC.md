# Moving This Project to Mac

Use this checklist when copying the app to a flash drive and opening it on a MacBook with Cursor and Xcode.

---

## Before You Copy to the Flash Drive

1. **Close the dev server** (stop `npm start` / Expo) so nothing is writing to the folder.
2. **Optional but recommended:** Exclude these to keep the copy small and avoid Windows-specific build junk:
   - `node_modules` (reinstall on Mac with `npm install`)
   - `android` folder (regenerate on Mac with `npx expo prebuild --platform android` if you need Android later)
   - `ios` folder if it exists (regenerate on Mac with `npx expo prebuild --platform ios`)
   - `.expo` folder (optional; Expo will recreate cache)
3. **Do copy:** `package.json`, `package-lock.json`, `app.json`, `babel.config.js`, `metro.config.js`, `App.js`, entire `src/`, `assets/`, and all config/docs. If you copy everything except the items above, you’re good.

---

## First Time on the Mac

1. **Copy the project** from the flash drive to the Mac (e.g. `~/Projects/GB Test App` or similar). Avoid putting it only on the flash drive for daily use (slower, risk of ejecting).
2. **Terminal → project folder:**
   ```bash
   cd "/path/to/GB Test App"
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Generate native iOS (and optionally Android) project:**
   ```bash
   npx expo prebuild
   ```
   This creates the `ios` and `android` folders. For iOS-only at first you can run:
   ```bash
   npx expo prebuild --platform ios
   ```
5. **Install iOS CocoaPods** (required for native modules):
   ```bash
   cd ios && pod install && cd ..
   ```
6. **Run the app:**
   - Dev server: `npm start` then press `i` for iOS Simulator, or scan QR with a physical iPhone (dev build).
   - Or build and run: `npm run build:ios` (opens in simulator or installs on connected device).

---

## Mac Prerequisites

- **Xcode** from the App Store + Xcode Command Line Tools: `xcode-select --install`
- **Node.js** (e.g. LTS from nodejs.org or `nvm`)
- **CocoaPods:** `sudo gem install cocoapods` (or `brew install cocoapods`)
- **Expo CLI:** already available via `npx expo` after `npm install`

---

## Notes

- The **Android-only fix** (New Architecture disabled) is in `android/gradle.properties`. It only affects Android; iOS is unchanged.
- **RevenueCat UI** is optional (stub when package is missing); the app runs without it. No change needed for Mac.
- If you use **Cursor**, open the project folder on the Mac in Cursor as usual; no extra steps.
