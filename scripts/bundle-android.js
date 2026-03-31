#!/usr/bin/env node
/**
 * Build Android App Bundle (AAB) for Play Store.
 * Loads .env from project root so SENTRY_AUTH_TOKEN is used when present;
 * when the token is set, Sentry uploads source maps for readable stack traces.
 * When the token is missing, Sentry upload is disabled so the build succeeds.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const rootDir = path.join(__dirname, '..');
const envPath = path.join(rootDir, '.env');

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eq = trimmed.indexOf('=');
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  });
}

if (!process.env.SENTRY_AUTH_TOKEN) {
  process.env.SENTRY_DISABLE_AUTO_UPLOAD = 'true';
}

const androidDir = path.join(rootDir, 'android');
const gradlew = path.join(androidDir, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew');
const child = spawn(gradlew, ['bundleRelease'], {
  cwd: androidDir,
  env: process.env,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code) => process.exit(code ?? 0));
