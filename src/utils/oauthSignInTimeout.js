/**
 * Wraps OAuth / native sign-in promises so UI loading state cannot hang forever
 * (e.g. dismissed in-app browser without a clean callback).
 *
 * Also dismisses any lingering auth sessions on timeout to prevent
 * "Another web browser is already open" on the next attempt.
 */
import { dismissAllAuthSessions } from './supabase';

export const OAUTH_SIGN_IN_TIMEOUT_MS = 30000;

export function withSignInTimeout(promise, label) {
  return new Promise((resolve, reject) => {
    let settled = false;

    const t = setTimeout(() => {
      if (settled) return;
      settled = true;
      dismissAllAuthSessions();
      reject(
        new Error(
          `${label} is taking too long. Check your connection, close any open browser windows, and try again.`
        )
      );
    }, OAUTH_SIGN_IN_TIMEOUT_MS);

    promise
      .then((v) => {
        if (settled) return;
        settled = true;
        clearTimeout(t);
        resolve(v);
      })
      .catch((e) => {
        if (settled) return;
        settled = true;
        clearTimeout(t);
        reject(e);
      });
  });
}
