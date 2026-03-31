/**
 * Supabase Client
 * Configured for React Native with AsyncStorage session persistence.
 * Supports Google and Apple Sign-In via OAuth.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import logger from './logger';
import { getEnv } from './env';

const SUPABASE_URL = getEnv('EXPO_PUBLIC_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');

let _supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  } catch (e) {
    logger.error('Supabase client init failed:', e);
  }
}

export const supabase = _supabase;

/**
 * Get the current authenticated user, or null.
 */
export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Dismiss any lingering ASWebAuthenticationSession or SFSafariViewController.
 * Must be called before opening a new auth session AND after any sign-in
 * completes / times out — otherwise iOS throws "Another web browser is already open".
 */
export function dismissAllAuthSessions() {
  try {
    const WebBrowser = require('expo-web-browser');
    if (typeof WebBrowser.dismissAuthSession === 'function') {
      WebBrowser.dismissAuthSession();
    }
    if (typeof WebBrowser.dismissBrowser === 'function') {
      WebBrowser.dismissBrowser().catch(() => {});
    }
  } catch (_) {
    // ignore
  }
}

let _authSessionLock = false;

async function prepareForAuthSession() {
  dismissAllAuthSessions();
  await new Promise((r) => setTimeout(r, 200));
}

/**
 * Open OAuth in an auth session; dismiss stale sessions first and retry once if still busy.
 * Guarded by a module-level lock to prevent overlapping sessions.
 */
async function openAuthSessionSafe(url, redirectUri) {
  if (_authSessionLock) {
    dismissAllAuthSessions();
    await new Promise((r) => setTimeout(r, 300));
  }

  const WebBrowser = require('expo-web-browser');
  const { openAuthSessionAsync } = WebBrowser;

  await prepareForAuthSession();
  _authSessionLock = true;

  const isAlreadyOpenError = (e) =>
    /already open|Another web browser/i.test(String(e?.message || e || ''));

  try {
    const result = await openAuthSessionAsync(url, redirectUri);
    return result;
  } catch (e) {
    if (!isAlreadyOpenError(e)) throw e;
    logger.warn('Web auth session was still busy; forcing dismiss and retrying once.');
    dismissAllAuthSessions();
    await new Promise((r) => setTimeout(r, 400));
    return await openAuthSessionAsync(url, redirectUri);
  } finally {
    _authSessionLock = false;
  }
}

/**
 * Sign in with Google using Supabase OAuth.
 * Uses expo-auth-session for the OAuth flow.
 */
export async function signInWithGoogle() {
  if (!supabase) throw new Error('Supabase is not configured');

  const redirectUri = 'popthehood://auth/callback';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUri,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error('No OAuth URL returned');

  const result = await openAuthSessionSafe(data.url, redirectUri);

  if (result.type === 'success' && result.url) {
    // Extract tokens from the URL fragment
    const url = new URL(result.url);
    const params = new URLSearchParams(url.hash.substring(1));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (sessionError) throw sessionError;
      return sessionData;
    }

    // Fallback: check if we got a code instead
    const code = url.searchParams.get('code');
    if (code) {
      const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      if (sessionError) throw sessionError;
      return sessionData;
    }

    throw new Error('Could not extract session from OAuth callback');
  }

  // User cancelled
  return null;
}

/**
 * Sign in with Apple using Supabase OAuth.
 */
export async function signInWithApple() {
  if (!supabase) throw new Error('Supabase is not configured');
  // On iOS, use native Apple auth for best UX
  if (Platform.OS === 'ios') {
    try {
      const AppleAuthentication = require('expo-apple-authentication');
      const Crypto = require('expo-crypto');

      // Apple expects SHA256(nonce) in the auth request; Supabase verifies with the raw nonce.
      const rawNonce =
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2) +
        Date.now().toString(36);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce
      );

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (credential.identityToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
          nonce: rawNonce,
        });
        if (error) {
          logger.error('Supabase signInWithIdToken (Apple) failed:', error.message, error);
          const isAudienceError = /unacceptable audience/i.test(error.message);
          throw new Error(
            isAudienceError
              ? 'Apple sign-in could not complete. Please try again in a moment.'
              : (error.message || 'Apple sign-in could not complete. Please try again.')
          );
        }
        return data;
      }

      throw new Error('No identity token from Apple');
    } catch (e) {
      if (e.code === 'ERR_REQUEST_CANCELED') return null; // User cancelled
      // Do NOT fall through to web OAuth on iOS: native already ran or failed for a real reason.
      // Falling through hid Supabase/JWT errors on TestFlight and opened a broken second flow.
      logger.error('Apple Sign-In (iOS native) failed:', e?.message || e, e);
      throw e instanceof Error ? e : new Error(String(e?.message || e));
    }
  }

  // Web-based Apple OAuth (Android, or non-iOS platforms)
  const redirectUri = 'popthehood://auth/callback';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: redirectUri,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error('No OAuth URL returned');

  const result = await openAuthSessionSafe(data.url, redirectUri);

  if (result.type === 'success' && result.url) {
    const url = new URL(result.url);
    const params = new URLSearchParams(url.hash.substring(1));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (sessionError) throw sessionError;
      return sessionData;
    }

    const code = url.searchParams.get('code');
    if (code) {
      const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      if (sessionError) throw sessionError;
      return sessionData;
    }

    throw new Error('Could not extract session from OAuth callback');
  }

  return null;
}
