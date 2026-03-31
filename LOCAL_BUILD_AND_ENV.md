# Local builds (Xcode / Android Studio) — no EAS

This project is built **only on this machine** with Xcode (iOS) and Android Studio (Android). We do **not** use EAS Build.

## API keys: use a `.env` file

API keys are not in the repo. Put them in a **`.env`** file in the project root (same folder as `app.json`):

```
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_public_key_here
```

- **Gemini**: get a key at [Google AI Studio](https://aistudio.google.com/apikey) (used for Stoich and receipt scanning).
- **RevenueCat**: use your public API key from the RevenueCat dashboard. For local/dev you can keep the test key; switch to production when you publish.

`.env` is in `.gitignore` — never commit it.

Optional: add `SENTRY_AUTH_TOKEN=...` to `.env` so `npm run bundle:android` can upload source maps to Sentry (readable Android crash stack traces). If unset, the bundle still builds; upload is skipped.

Expo loads `.env` when you run `npx expo start` or when you build with `npx expo run:ios` / `npx expo run:android` (and when you build from Xcode/Android Studio after a prebuild). The app reads them as `process.env.EXPO_PUBLIC_*`.

## Building

- **iOS**: Open the project in Xcode (e.g. run `npx expo run:ios` once to generate the native project, then open `ios/*.xcworkspace` in Xcode), or keep using `npx expo run:ios`.
- **Android**: Same idea with Android Studio and `npx expo run:android`.

No EAS CLI or EAS Secrets are required.

## Sign in with Apple (TestFlight / App Store)

Native iOS uses **Sign in with Apple** + Supabase `signInWithIdToken`. If TestFlight builds fail while dev works, check:

1. **Supabase → Authentication → Providers → Apple** is **enabled**.
2. **Client IDs** must include your **iOS bundle ID**: `com.popthehood.app` (not only a web Services ID). Supabase validates the JWT `aud` claim against this list.
3. **Secret / key**: Apple **Services ID** key (.p8), Key ID, Team ID, and **Services ID** string are filled in per [Supabase Apple docs](https://supabase.com/docs/guides/auth/social-login/auth-apple).
4. **Xcode**: Target **Signing & Capabilities** includes **Sign In with Apple**. The config plugin `expo-apple-authentication` in `app.json` keeps the entitlement on prebuild; run `npx expo prebuild --clean` if entitlements drifted.
5. **Redirect URLs** (for Google / web Apple on Android): `popthehood://auth/callback` is listed under Supabase **URL Configuration** redirect URLs.

After changing Apple provider settings, rebuild the archive you upload to TestFlight.

### “Another web browser is already open” (Google / web OAuth)

iOS keeps **Sign in with Apple** and **Google OAuth** in separate native sessions. The app must call **`WebBrowser.dismissAuthSession()`** before opening another `openAuthSessionAsync`. The codebase does this automatically (plus a short delay and one retry). If you still see it, force-quit the app and try again once.
