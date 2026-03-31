#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const projectRoot = path.resolve(__dirname, '..');
const privateDir = path.join(projectRoot, 'private-data');
const exportsDir = path.join(projectRoot, 'exports');

const sourcePath = path.join(privateDir, 'master_source.json');
const snapshotJsonPath = path.join(exportsDir, 'master_snapshot.json');
const snapshotCsvPath = path.join(exportsDir, 'master_snapshot.csv');
const manifestPath = path.join(exportsDir, 'manifest.json');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
  }

  return JSON.stringify(value);
}

function toCsvCell(value) {
  if (value === null || value === undefined) return '';
  const asText = String(value);
  if (/[",\n]/.test(asText)) {
    return `"${asText.replace(/"/g, '""')}"`;
  }
  return asText;
}

function flattenRecords(data) {
  const rows = [];

  if (Array.isArray(data.vehicles)) {
    for (const vehicle of data.vehicles) {
      rows.push({
        entity_type: 'vehicle',
        entity_id: vehicle.id || '',
        field_path: 'vehicle',
        value: JSON.stringify(vehicle),
        source_key: 'vehicles',
      });

      if (Array.isArray(vehicle.maintenanceRecords)) {
        for (const record of vehicle.maintenanceRecords) {
          rows.push({
            entity_type: 'maintenance_record',
            entity_id: record.id || '',
            parent_id: vehicle.id || '',
            field_path: 'vehicle.maintenanceRecords[]',
            value: JSON.stringify(record),
            source_key: 'vehicles',
          });
        }
      }
    }
  }

  if (Array.isArray(data.inventory)) {
    for (const item of data.inventory) {
      rows.push({
        entity_type: 'inventory_item',
        entity_id: item.id || '',
        field_path: 'inventory[]',
        value: JSON.stringify(item),
        source_key: 'inventory',
      });
    }
  }

  if (Array.isArray(data.todos)) {
    for (const todo of data.todos) {
      rows.push({
        entity_type: 'todo',
        entity_id: todo.id || '',
        field_path: 'todos[]',
        value: JSON.stringify(todo),
        source_key: 'todos',
      });
    }
  }

  if (Array.isArray(data.shoppingList)) {
    for (const shoppingItem of data.shoppingList) {
      rows.push({
        entity_type: 'shopping_item',
        entity_id: shoppingItem.id || '',
        field_path: 'shoppingList[]',
        value: JSON.stringify(shoppingItem),
        source_key: 'shoppingList',
      });
    }
  }

  return rows;
}

function rowsToCsv(rows) {
  const headers = [
    'entity_type',
    'entity_id',
    'parent_id',
    'field_path',
    'value',
    'source_key',
  ];

  const lines = [headers.join(',')];
  for (const row of rows) {
    const line = headers.map((header) => toCsvCell(row[header] || '')).join(',');
    lines.push(line);
  }
  return `${lines.join('\n')}\n`;
}

function validateSourceShape(data) {
  const expectedArrayKeys = ['vehicles', 'inventory', 'todos', 'shoppingList'];
  for (const key of expectedArrayKeys) {
    if (!Array.isArray(data[key])) {
      throw new Error(`Expected "${key}" to be an array in ${sourcePath}`);
    }
  }
}

function main() {
  ensureDir(privateDir);
  ensureDir(exportsDir);

  if (!fs.existsSync(sourcePath)) {
    const starter = {
      schemaVersion: 1,
      generatedFor: 'ai-review-pipeline',
      vehicles: [],
      inventory: [],
      todos: [],
      shoppingList: [],
    };

    fs.writeFileSync(sourcePath, `${JSON.stringify(starter, null, 2)}\n`, 'utf8');
    console.log(`Created starter source file at ${sourcePath}`);
    console.log('Populate it, then rerun: npm run ai:export');
    return;
  }

  const raw = fs.readFileSync(sourcePath, 'utf8');
  const parsed = JSON.parse(raw);
  validateSourceShape(parsed);

  const exportedAt = new Date().toISOString();
  const snapshotPayload = {
    ...parsed,
    exportedAt,
  };

  const stable = stableStringify(snapshotPayload);
  const sha256 = crypto.createHash('sha256').update(stable).digest('hex');

  fs.writeFileSync(snapshotJsonPath, `${JSON.stringify(snapshotPayload, null, 2)}\n`, 'utf8');

  const rows = flattenRecords(snapshotPayload);
  fs.writeFileSync(snapshotCsvPath, rowsToCsv(rows), 'utf8');

  const manifest = {
    schemaVersion: 1,
    exportedAt,
    sourcePath: path.relative(projectRoot, sourcePath),
    files: {
      snapshotJson: path.relative(projectRoot, snapshotJsonPath),
      snapshotCsv: path.relative(projectRoot, snapshotCsvPath),
    },
    recordCounts: {
      vehicles: snapshotPayload.vehicles.length,
      inventory: snapshotPayload.inventory.length,
      todos: snapshotPayload.todos.length,
      shoppingList: snapshotPayload.shoppingList.length,
      flattenedRows: rows.length,
    },
    sha256,
  };

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log('Export complete.');
  console.log(`- JSON: ${snapshotJsonPath}`);
  console.log(`- CSV: ${snapshotCsvPath}`);
  console.log(`- Manifest: ${manifestPath}`);
}

main();
