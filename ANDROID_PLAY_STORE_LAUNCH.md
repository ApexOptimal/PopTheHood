# Android Play Store launch checklist

The app runs well in the emulator; Pro/subscriptions can’t be tested there (no Google Play Billing). Use this list before submitting to the Play Store.

---

## Verified (what’s already done)

Checked in the repo:

- **App config** — `app.json` has name "Pop the Hood", version 1.0.0, `android.package` `com.popthehood.app`, adaptive icon, permissions, `privacyUrl` `https://apexoptimal.dev/privacy`. Good to go.
- **Android build** — `versionCode` 1, `versionName` "1.0.0" in `android/app/build.gradle`. `local.properties` has `sdk.dir` set. Sentry and React Native applied.
- **RevenueCat** — Uses `getEnv()` for API keys; Android key from `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`. Product IDs in code are `monthly` / `yearly` / `lifetime`; ensure these match your RevenueCat offering and Play Console product IDs.
- **Release signing (gradle)** — Release signing is wired in `build.gradle`: if `android/app/popthehood.keystore` and `android/app/keystore.properties` exist, release builds use them; otherwise release still uses debug so `bundleRelease` runs. You only need to add the keystore and properties file when you’re ready to ship.

Not in the repo (you do these in Play Console / locally):

- No **release keystore** yet — only `debug.keystore` is present. Add `popthehood.keystore` + `keystore.properties` when you’re ready for a store build (see §1).
- No **.aab** in repo — that’s a build output; you’ll generate it with `./gradlew bundleRelease` after signing is set up.
- **Store listing, content rating, data safety, in-app products** — done in Google Play Console, not in code.

---

## 1. Release signing (required for store upload)

For Play Store you must sign release builds with your own keystore. The project is already set up to use it when the files exist.

- **If you already have a release keystore**  
  Put the `.keystore` file at `android/app/popthehood.keystore`. Copy `android-keystore.properties.example` (in project root) to `android/app/keystore.properties` and set `storePassword`, `keyPassword`, and `keyAlias` (e.g. `popthehood`). Do not commit these files.

- **If you don’t have a keystore yet**  
  Create one: Android Studio → Build → Generate Signed Bundle / APK → Create new. Save the keystore and passwords somewhere safe; you’ll need the same keystore for all future updates. Then add the file and `keystore.properties` as above.

After that, `./gradlew bundleRelease` will produce a store-ready AAB.

---

## Why “Generate Signed Bundle” is grayed out / “No modules supporting bundles found”

With Expo/React Native, the Android project is meant to be built from the **repo root** (where `node_modules` and `package.json` live). Opening only the `android` folder in Android Studio often leads to:

- **“No modules supporting bundles found”** in the Generate Signed Bundle wizard, or  
- **Generate Signed Bundle** being grayed out  

because the IDE doesn’t get the full Node/Expo context. **Use the command line to build the AAB** (see below); that’s the reliable way for this project.

---

## 2. Build the App Bundle (AAB)

From the **project root** (PopTheHood), run:

```bash
npm run bundle:android
```

Or manually:

```bash
cd android
./gradlew bundleRelease
```

The AAB is written to:  
`android/app/build/outputs/bundle/release/app-release.aab`

Upload this **.aab** file in Play Console (not an APK for production).

**Sentry source maps (optional):** To get readable Android crash stack traces in Sentry, add your auth token to `.env` (do not commit it):

```bash
SENTRY_AUTH_TOKEN=your_token_here
```

Create the token at [Sentry → Settings → Auth Tokens](https://sentry.io/settings/account/api/auth-tokens/) (scope: `project:releases`). Then `npm run bundle:android` will upload source maps automatically. If `SENTRY_AUTH_TOKEN` is not set, the build skips the upload and still produces the AAB.

---

## 3. Google Play Console setup

- **Developer account**  
  One-time $25 registration at [Google Play Console](https://play.google.com/console) if you don’t have one.

- **Create the app**  
  New app → fill package name: `com.popthehood.app` (must match `app.json` / `build.gradle`).

- **Store listing**  
  - Short and full description  
  - Screenshots (phone; tablet if you support it)  
  - Feature graphic (1024×500)  
  - App icon (already in the project)  
  - **Privacy policy URL** (required) — you have `https://apexoptimal.dev/privacy` in `app.json`; use the same or update both.

- **Content rating**  
  Complete the questionnaire (likely “Everyone” or similar for a car-maintenance app).

- **Target audience**  
  Set age group(s).

- **News app / COVID declarations**  
  Answer as “No” if the app isn’t a news or COVID-tracking app.

- **Data safety**  
  Declare what data you collect (e.g. account, usage). Match what your app and [privacy policy](https://apexoptimal.dev/privacy) actually do.

---

## 4. In-app products (RevenueCat / Pro)

So Pro works on real devices:

- In **Google Play Console** → your app → **Monetize** → **Products**:
  - Subscriptions: e.g. `com.popthehood.pro.monthly`, `com.popthehood.pro.annual` (match the IDs in your app and RevenueCat).
  - In-app product: e.g. `com.popthehood.pro.life` (lifetime).
- Set prices, billing periods, and availability.
- In **RevenueCat** dashboard, link the same product IDs to your Android app and to your Pro entitlement/offering.

No code change needed if IDs already match; emulator can’t load these because it has no Play Billing.

---

## 5. Optional but recommended

- **Internal testing track**  
  Upload the first AAB to an internal test track, add your own Google account as a tester, install from Play Store link, and confirm:
  - App installs and opens  
  - You can reach the subscription/paywall screen and see products (on a real device with a Google account).
- **Version for later updates**  
  For future releases, bump `versionCode` (integer) and optionally `versionName` in `android/app/build.gradle` (and keep `version` in `app.json` in sync if you use it elsewhere).

---

## Summary

| Step | Status |
|------|--------|
| Release signing wired in `build.gradle` (add keystore when ready) | ✅ Done in repo |
| Add `popthehood.keystore` + `keystore.properties` in `android/app/` | ⬜ Your turn |
| `./gradlew bundleRelease` produces `app-release.aab` | ⬜ After signing |
| Play Console: app created, package `com.popthehood.app` | ⬜ Your turn |
| Store listing (description, screenshots, icon, privacy URL) | ⬜ Your turn |
| Content rating, target audience, data safety | ⬜ Your turn |
| In-app products in Play Console + RevenueCat | ⬜ Your turn |
| Internal test install + Pro purchase test on real device | ⬜ Your turn |

Once the “Your turn” items are done, you’re ready to submit for production (or open/closed testing) on the Play Store.
