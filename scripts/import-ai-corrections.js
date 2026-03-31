#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const exportsDir = path.join(projectRoot, 'exports');

const correctionsPath = path.join(exportsDir, 'research_results.csv');
const outputJsonPath = path.join(exportsDir, 'research_results.json');

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}

function parseCsv(csvText) {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return [];
  }

  const header = parseCsvLine(lines[0]).map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCsvLine(lines[i]);
    const row = {};

    for (let j = 0; j < header.length; j += 1) {
      row[header[j]] = values[j] ?? '';
    }

    rows.push(row);
  }

  return rows;
}

function validateColumns(rows) {
  const required = [
    'record_id',
    'field_checked',
    'source_url',
    'confidence',
    'status',
    'notes',
  ];

  if (rows.length === 0) {
    return { ok: false, message: 'No rows found in corrections CSV.' };
  }

  const firstRow = rows[0];
  for (const key of required) {
    if (!(key in firstRow)) {
      return {
        ok: false,
        message: `Missing required column "${key}". Required columns: ${required.join(', ')}`,
      };
    }
  }

  return { ok: true };
}

function summarize(rows) {
  const byStatus = rows.reduce((acc, row) => {
    const key = (row.status || 'unknown').toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return {
    total: rows.length,
    byStatus,
  };
}

function main() {
  if (!fs.existsSync(correctionsPath)) {
    console.log(`No corrections file found at ${correctionsPath}`);
    console.log('Create it first, then run: npm run ai:import');
    return;
  }

  const csvText = fs.readFileSync(correctionsPath, 'utf8');
  const rows = parseCsv(csvText);
  const validation = validateColumns(rows);

  if (!validation.ok) {
    throw new Error(validation.message);
  }

  const importedAt = new Date().toISOString();
  const payload = {
    schemaVersion: 1,
    importedAt,
    sourceCsvPath: path.relative(projectRoot, correctionsPath),
    summary: summarize(rows),
    rows,
  };

  fs.writeFileSync(outputJsonPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log('Corrections import complete.');
  console.log(`- Output JSON: ${outputJsonPath}`);
  console.log(`- Rows imported: ${rows.length}`);
}

main();
