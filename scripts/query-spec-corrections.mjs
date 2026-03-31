/**
 * Query aggregated spec corrections from Supabase.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env (bypasses RLS).
 *
 * Usage: npm run specs:corrections
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, key);

const { data, error } = await supabase
  .from('spec_corrections')
  .select('make, model, year, trim, category, field_name, default_value, user_value')
  .order('created_at', { ascending: false })
  .limit(5000);

if (error) {
  console.error('Query error:', error.message);
  process.exit(1);
}

if (!data || data.length === 0) {
  console.log('No corrections found yet.');
  process.exit(0);
}

// Group by vehicle + field, count identical corrections
const groups = {};
for (const row of data) {
  const key = `${row.make}|${row.model}|${row.year}|${row.trim}|${row.category}.${row.field_name}`;
  if (!groups[key]) {
    groups[key] = { ...row, corrections: {} };
  }
  const correctionKey = `${row.default_value} -> ${row.user_value}`;
  groups[key].corrections[correctionKey] = (groups[key].corrections[correctionKey] || 0) + 1;
}

const sorted = Object.values(groups)
  .map(g => ({
    vehicle: `${g.year} ${g.make} ${g.model} ${g.trim}`.trim(),
    field: `${g.category}.${g.field_name}`,
    corrections: g.corrections,
    total: Object.values(g.corrections).reduce((a, b) => a + b, 0),
  }))
  .sort((a, b) => b.total - a.total);

console.log(`\n=== ${data.length} total corrections, ${sorted.length} unique field corrections ===\n`);

for (const entry of sorted.slice(0, 50)) {
  console.log(`${entry.vehicle} — ${entry.field} (${entry.total}x)`);
  for (const [change, count] of Object.entries(entry.corrections)) {
    console.log(`  ${change} (${count})`);
  }
}
