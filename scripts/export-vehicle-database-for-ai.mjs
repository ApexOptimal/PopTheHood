#!/usr/bin/env node

/**
 * Exports the in-app vehicle database (fluids, intervals, torque, tires, etc.)
 * from src/data/vehicleData.js to exports/ for AI accuracy review.
 * Does not use AsyncStorage — this is the bundled specs database.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const exportsDir = path.join(projectRoot, 'exports');

const dbCsvPath = path.join(exportsDir, 'vehicle_database.csv');
const dbJsonPath = path.join(exportsDir, 'vehicle_database.json');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function toCsvCell(value) {
  if (value === null || value === undefined) return '';
  const asText = String(value);
  if (/[",\n]/.test(asText)) return `"${asText.replace(/"/g, '""')}"`;
  return asText;
}

function yearInRange(year, rangeKey) {
  if (rangeKey == null) return false;
  const s = String(rangeKey).trim();
  if (!s.includes('-')) return parseInt(s, 10) === year;
  const [start, end] = s.split('-').map((x) => parseInt(x.trim(), 10));
  return !isNaN(start) && !isNaN(end) && year >= start && year <= end;
}

function getSpecsForVehicle(vehicleSpecificSpecs, make, model, year, trim) {
  const models = vehicleSpecificSpecs[make];
  if (!models || !models[model]) return null;
  const yearRanges = models[model];
  for (const [rangeKey, spec] of Object.entries(yearRanges)) {
    if (!spec || typeof spec !== 'object' || Array.isArray(spec)) continue;
    if (!yearInRange(year, rangeKey)) continue;
    const base = { ...spec };
    const trimSpecs = base.trims;
    delete base.trims;
    if (trim && trimSpecs && trimSpecs[trim]) {
      const t = trimSpecs[trim];
      return {
        serviceIntervals: t.serviceIntervals ?? base.serviceIntervals,
        recommendedFluids: { ...base.recommendedFluids, ...t.recommendedFluids },
        torqueValues: { ...base.torqueValues, ...t.torqueValues },
        tires: { ...base.tires, ...t.tires },
        hardware: { ...base.hardware, ...t.hardware },
        lighting: { ...base.lighting, ...t.lighting },
        partsSKUs: { ...base.partsSKUs, ...t.partsSKUs },
      };
    }
    return base;
  }
  return null;
}

function buildFullCatalogWithSpecs(vehicleData, vehicleSpecificSpecs) {
  const rows = [];
  for (const [make, models] of Object.entries(vehicleData)) {
    if (!models || typeof models !== 'object') continue;
    for (const [model, info] of Object.entries(models)) {
      if (!info || !Array.isArray(info.years)) continue;
      const trims = info.trims && typeof info.trims === 'object' ? Object.keys(info.trims) : [''];
      for (const year of info.years) {
        for (const trim of trims) {
          const engine = trim && info.trims[trim] ? info.trims[trim].engine : '';
          const turbo = trim && info.trims[trim] ? info.trims[trim].turbo : false;
          const spec = getSpecsForVehicle(vehicleSpecificSpecs, make, model, year, trim || undefined);
          const hasSpecs = !!spec && (
            (spec.recommendedFluids && Object.keys(spec.recommendedFluids).length > 0) ||
            (spec.tires && Object.keys(spec.tires).length > 0) ||
            (spec.serviceIntervals && Object.keys(spec.serviceIntervals).length > 0)
          );
          rows.push({
            make,
            model,
            year: String(year),
            trim: trim || '',
            engine: engine || '',
            turbo: turbo ? 'Y' : 'N',
            has_specs: hasSpecs ? 'Y' : 'N',
            service_intervals: spec?.serviceIntervals ? JSON.stringify(spec.serviceIntervals) : '',
            recommended_fluids: spec?.recommendedFluids ? JSON.stringify(spec.recommendedFluids) : '',
            torque_values: spec?.torqueValues ? JSON.stringify(spec.torqueValues) : '',
            tires: spec?.tires ? JSON.stringify(spec.tires) : '',
            hardware: spec?.hardware ? JSON.stringify(spec.hardware) : '',
            lighting: spec?.lighting ? JSON.stringify(spec.lighting) : '',
            parts_skus: spec?.partsSKUs ? JSON.stringify(spec.partsSKUs) : '',
          });
        }
      }
    }
  }
  return rows;
}

function flattenDefaultIntervals(defaultServiceIntervals) {
  const rows = [];
  for (const [key, intervals] of Object.entries(defaultServiceIntervals)) {
    if (!intervals || typeof intervals !== 'object') continue;
    rows.push({
      record_type: 'default_intervals',
      category: key,
      data: JSON.stringify(intervals),
    });
  }
  return rows;
}

function flattenDefaultFluids(defaultFluids) {
  const rows = [];
  for (const [key, fluids] of Object.entries(defaultFluids)) {
    if (!fluids || typeof fluids !== 'object') continue;
    rows.push({
      record_type: 'default_fluids',
      category: key,
      data: JSON.stringify(fluids),
    });
  }
  return rows;
}

function flattenDefaultTorque(defaultTorqueSpecs) {
  const rows = [];
  for (const [key, torque] of Object.entries(defaultTorqueSpecs)) {
    if (!torque || typeof torque !== 'object') continue;
    rows.push({
      record_type: 'default_torque',
      category: key,
      data: JSON.stringify(torque),
    });
  }
  return rows;
}

function main() {
  ensureDir(exportsDir);

  const vehicleDataPath = path.join(projectRoot, 'src/data/vehicleData.js');
  if (!fs.existsSync(vehicleDataPath)) {
    console.error('Not found:', vehicleDataPath);
    process.exit(1);
  }

  const vehicleDataUrl = new URL(`file://${vehicleDataPath}`).href;
  const load = async () => {
    const mod = await import(vehicleDataUrl);
    return mod;
  };

  load()
    .then((mod) => {
      const {
        vehicleData = {},
        vehicleSpecificSpecs = {},
        defaultServiceIntervals = {},
        defaultFluids = {},
        defaultTorqueSpecs = {},
      } = mod;

      const fullRows = buildFullCatalogWithSpecs(vehicleData, vehicleSpecificSpecs);
      const intervalRows = flattenDefaultIntervals(defaultServiceIntervals);
      const fluidRows = flattenDefaultFluids(defaultFluids);
      const torqueRows = flattenDefaultTorque(defaultTorqueSpecs);
      const withSpecsCount = fullRows.filter((r) => r.has_specs === 'Y').length;

      const payload = {
        exportedAt: new Date().toISOString(),
        source: 'src/data/vehicleData.js',
        total_vehicles: fullRows.length,
        vehicles_with_specs: withSpecsCount,
        defaultIntervals: intervalRows.length,
        defaultFluids: fluidRows.length,
        defaultTorque: torqueRows.length,
        vehicle_catalog: fullRows,
        default_intervals: intervalRows,
        default_fluids: fluidRows,
        default_torque: torqueRows,
      };

      fs.writeFileSync(dbJsonPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');

      const csvHeaders = [
        'make',
        'model',
        'year',
        'trim',
        'engine',
        'turbo',
        'has_specs',
        'service_intervals',
        'recommended_fluids',
        'torque_values',
        'tires',
        'hardware',
        'lighting',
        'parts_skus',
      ];
      const csvLines = [csvHeaders.join(',')];
      for (const row of fullRows) {
        const line = csvHeaders.map((h) => toCsvCell(row[h] ?? '')).join(',');
        csvLines.push(line);
      }
      fs.writeFileSync(dbCsvPath, csvLines.join('\n') + '\n', 'utf8');

      console.log('Vehicle database export complete.');
      console.log('- CSV (full catalog):', dbCsvPath);
      console.log('- JSON (full):', dbJsonPath);
      console.log('- Total vehicle rows:', fullRows.length);
      console.log('- Rows with fluids/intervals/torque filled:', withSpecsCount);
      console.log('- Default intervals:', intervalRows.length);
      console.log('- Default fluids:', fluidRows.length);
      console.log('- Default torque:', torqueRows.length);
    })
    .catch((err) => {
      console.error('Failed to load vehicleData.js:', err.message);
      process.exit(1);
    });
}

main();
