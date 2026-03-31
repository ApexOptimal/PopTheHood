#!/usr/bin/env node

/**
 * Reads AsyncStorage data from the iOS Simulator for com.popthehood.app
 * and writes it to private-data/master_source.json.
 *
 * Usage:  npm run ai:dump
 *         node scripts/dump-from-simulator.js
 *
 * How AsyncStorage works on iOS:
 *   - Data lives in <AppContainer>/Library/Application Support/com.popthehood.app/RCTAsyncLocalStorage_V1/
 *   - manifest.json holds small values inline as { key: value | null }
 *   - When a value is null, the real data is in an overflow file (hash-named) that contains the raw value
 *   - Overflow file names are deterministic hashes of the key
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const BUNDLE_ID = 'com.popthehood.app';
const ASYNC_STORAGE_DIR = `RCTAsyncLocalStorage_V1`;
const KEYS_WE_WANT = ['vehicles', 'inventory', 'todos', 'shoppingList'];

const projectRoot = path.resolve(__dirname, '..');
const privateDir = path.join(projectRoot, 'private-data');
const outputPath = path.join(privateDir, 'master_source.json');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function findAsyncStorageDir() {
  const simDevicesRoot = path.join(
    process.env.HOME,
    'Library/Developer/CoreSimulator/Devices'
  );

  if (!fs.existsSync(simDevicesRoot)) {
    throw new Error(
      'iOS Simulator devices directory not found. Make sure Xcode is installed.'
    );
  }

  const cmd = `find "${simDevicesRoot}" -path "*/${BUNDLE_ID}/${ASYNC_STORAGE_DIR}" -type d 2>/dev/null`;
  const result = execSync(cmd, { encoding: 'utf8' }).trim();
  const dirs = result.split('\n').filter(Boolean);

  if (dirs.length === 0) {
    throw new Error(
      `No AsyncStorage data found for ${BUNDLE_ID} in any simulator.\n` +
        'Make sure the app has been run at least once in the iOS Simulator.'
    );
  }

  if (dirs.length > 1) {
    console.log(`Found ${dirs.length} simulator instances. Using most recently modified.`);
    let newest = dirs[0];
    let newestMtime = 0;

    for (const dir of dirs) {
      const manifestPath = path.join(dir, 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        const stat = fs.statSync(manifestPath);
        if (stat.mtimeMs > newestMtime) {
          newestMtime = stat.mtimeMs;
          newest = dir;
        }
      }
    }

    return newest;
  }

  return dirs[0];
}

function readAsyncStorage(storageDir) {
  const manifestPath = path.join(storageDir, 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`manifest.json not found in ${storageDir}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const data = {};

  for (const key of KEYS_WE_WANT) {
    if (!(key in manifest)) {
      console.log(`  Key "${key}" not found in AsyncStorage (app may not have saved it yet).`);
      data[key] = [];
      continue;
    }

    const manifestValue = manifest[key];

    if (manifestValue === null) {
      const overflowFile = findOverflowFile(storageDir, key);
      if (overflowFile) {
        const raw = fs.readFileSync(overflowFile, 'utf8');
        try {
          data[key] = JSON.parse(raw);
        } catch {
          console.warn(`  Warning: Could not parse overflow file for "${key}". Using raw string.`);
          data[key] = raw;
        }
      } else {
        console.warn(`  Warning: Key "${key}" is null in manifest but no overflow file found.`);
        data[key] = [];
      }
    } else {
      try {
        data[key] = JSON.parse(manifestValue);
      } catch {
        data[key] = manifestValue;
      }
    }
  }

  return data;
}

function findOverflowFile(storageDir, key) {
  const files = fs.readdirSync(storageDir).filter((f) => f !== 'manifest.json');

  if (files.length === 0) return null;

  const md5 = crypto.createHash('md5').update(key).digest('hex');
  const candidate = path.join(storageDir, md5);
  if (fs.existsSync(candidate)) {
    return candidate;
  }

  for (const file of files) {
    const filePath = path.join(storageDir, file);
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        typeof parsed[0] === 'object'
      ) {
        if (key === 'vehicles' && parsed[0].make) return filePath;
        if (key === 'inventory' && ('name' in parsed[0] || 'quantity' in parsed[0])) return filePath;
        if (key === 'todos' && ('title' in parsed[0] || 'completed' in parsed[0])) return filePath;
        if (key === 'shoppingList' && ('name' in parsed[0] || 'checked' in parsed[0])) return filePath;
      }
    } catch {
      // not JSON, skip
    }
  }

  return null;
}

function main() {
  console.log('Searching for AsyncStorage data on iOS Simulator...');
  const storageDir = findAsyncStorageDir();
  console.log(`Found: ${storageDir}\n`);

  console.log('Reading keys...');
  const data = readAsyncStorage(storageDir);

  ensureDir(privateDir);

  const output = {
    schemaVersion: 1,
    generatedFor: 'ai-review-pipeline',
    extractedAt: new Date().toISOString(),
    simulatorPath: storageDir,
    vehicles: Array.isArray(data.vehicles) ? data.vehicles : [],
    inventory: Array.isArray(data.inventory) ? data.inventory : [],
    todos: Array.isArray(data.todos) ? data.todos : [],
    shoppingList: Array.isArray(data.shoppingList) ? data.shoppingList : [],
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

  console.log(`\nDump complete: ${outputPath}`);
  console.log(`  Vehicles:      ${output.vehicles.length}`);
  console.log(`  Inventory:     ${output.inventory.length}`);
  console.log(`  Todos:         ${output.todos.length}`);
  console.log(`  Shopping list: ${output.shoppingList.length}`);
  console.log('\nNext step: npm run ai:export');
}

main();
