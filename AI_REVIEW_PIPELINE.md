# AI Review Pipeline (Developer-Only)

This pipeline is intentionally developer-only and excluded from git.

## What it does

- `npm run ai:export` creates:
  - `private-data/master_source.json` (starter file if missing)
  - `exports/master_snapshot.json`
  - `exports/master_snapshot.csv`
  - `exports/manifest.json` (includes counts + sha256)
- `npm run ai:import` reads:
  - `exports/research_results.csv`
  - writes `exports/research_results.json`

## Why this is private

- `private-data/` and `exports/` are in `.gitignore`.
- Nothing here is bundled for app users unless you explicitly wire it in.

## Source file contract

`private-data/master_source.json` must include arrays:

- `vehicles`
- `inventory`
- `todos`
- `shoppingList`

Example:

```json
{
  "schemaVersion": 1,
  "generatedFor": "ai-review-pipeline",
  "vehicles": [],
  "inventory": [],
  "todos": [],
  "shoppingList": []
}
```

## AI corrections CSV contract

`exports/research_results.csv` must include columns:

- `record_id`
- `field_checked`
- `source_url`
- `confidence`
- `status`
- `notes`

Example header:

```csv
record_id,field_checked,source_url,confidence,status,notes
```

## Recommended workflow

1. Populate `private-data/master_source.json`.
2. Run `npm run ai:export`.
3. Feed `exports/master_snapshot.csv` or `exports/master_snapshot.json` to your AI bot.
4. Save bot output to `exports/research_results.csv`.
5. Run `npm run ai:import`.
6. Review `exports/research_results.json`.
