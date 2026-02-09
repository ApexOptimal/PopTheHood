# Vehicle Data Verification Guide

## Overview
This guide explains how to verify and add accurate vehicle specifications to the app's database. The app uses a hierarchical data structure that prioritizes the most specific data available.

## Data Structure Hierarchy (Priority Order)

1. **Trim-Specific Specs** (Highest Priority)
   - Stored in `vehicleSpecificSpecs[make][model][yearRange].trims[trimName]`
   - Most accurate - applies to specific trim levels

2. **Year-Range Base Specs**
   - Stored in `vehicleSpecificSpecs[make][model][yearRange]`
   - Applies to all trims within a year range

3. **Make-Level Defaults**
   - Stored in `defaultFluids[make]`
   - Generic defaults for the entire make

4. **Generic Defaults** (Lowest Priority)
   - Stored in `defaultFluids.default` or `defaultFluids.turbo`/`defaultFluids.supercharged`
   - Used when no specific data exists

## How to Add Engine-Specific Specifications

### Step 1: Research Specifications

Use multiple reliable sources to verify specifications:
- Official manufacturer service manuals
- Owner's manuals
- Reputable automotive databases (Edmunds, Car and Driver specs, etc.)
- Manufacturer technical service bulletins
- Multiple independent sources for cross-verification

**Important:** Verify the following for each engine variant:
- Engine oil type (e.g., 5W-20, 5W-30, 0W-20)
- Engine oil capacity (in quarts)
- Tire pressure (may vary by trim/wheel size)
- Tire sizes (may vary by trim)
- Battery group size
- Other fluid specifications

### Step 2: Update vehicleData Structure

First, ensure all engine variants are listed in `vehicleData`:

```javascript
'Ram': {
  '1500': {
    years: [...],
    trims: {
      'Tradesman': { engine: '3.6L V6', turbo: false },
      'Tradesman EcoDiesel': { engine: '3.0L V6 Turbo Diesel', turbo: true },
      // ... other trims with different engines
    }
  }
}
```

### Step 3: Add to vehicleSpecificSpecs

Add engine-specific specifications in `vehicleSpecificSpecs`:

```javascript
'Ram': {
  '1500': {
    // Year range (e.g., '2014-2018')
    '2014-2018': {
      // Base specs for the year range (optional)
      recommendedFluids: {
        engineOil: '5W-20 Synthetic',
        engineOilCapacity: '5.9 quarts', // Default for smallest engine
        // ... other base specs
      },
      trims: {
        // Trim-specific specs (overrides base specs)
        'Tradesman': {
          recommendedFluids: {
            engineOil: '5W-20 Synthetic',
            engineOilCapacity: '5.9 quarts', // 3.6L V6
            // ... other specs
          },
          tires: {
            tireSizeFront: 'P275/70R17',
            tirePressureFront: '35 PSI',
            // ... other tire specs
          }
        },
        'Laramie': {
          recommendedFluids: {
            engineOil: '5W-20 Synthetic',
            engineOilCapacity: '7.0 quarts', // 5.7L V8
            // ... other specs
          },
          tires: {
            tireSizeFront: 'P275/70R18',
            tirePressureFront: '35 PSI',
            // ... other tire specs
          }
        },
        'Laramie EcoDiesel': {
          recommendedFluids: {
            engineOil: '5W-40 Synthetic Diesel',
            engineOilCapacity: '10.6 quarts', // 3.0L EcoDiesel
            // ... other specs
          },
          // ... other specs
        }
      }
    }
  }
}
```

## Example: 2017 Ram 1500

### Engine Variants Verified:
1. **3.6L Pentastar V6**
   - Oil Capacity: 5.9 quarts
   - Oil Type: 5W-20 Synthetic
   - Available in: Tradesman, Big Horn

2. **5.7L HEMI V8**
   - Oil Capacity: 7.0 quarts
   - Oil Type: 5W-20 Synthetic
   - Available in: Laramie, Rebel, Longhorn, Limited

3. **3.0L EcoDiesel V6**
   - Oil Capacity: 10.6 quarts
   - Oil Type: 5W-40 Synthetic Diesel
   - Available in: Tradesman EcoDiesel, Big Horn EcoDiesel, Laramie EcoDiesel, Longhorn EcoDiesel, Limited EcoDiesel

### Sources Used:
- 2017 Ram 1500 User Guide
- EngineHungry.com specifications
- Multiple automotive service databases
- Cross-referenced with official Mopar documentation

## Data Verification Checklist

Before adding specifications, verify:

- [ ] Engine options for the model/year are complete
- [ ] Oil capacity is verified from multiple sources
- [ ] Oil type (viscosity) is correct for the engine
- [ ] Tire pressure specifications are accurate
- [ ] Tire sizes match the trim/options
- [ ] Battery group size is correct
- [ ] Year ranges are accurate (when did this spec apply?)
- [ ] Trim names match the vehicleData structure
- [ ] All measurements are in consistent units (quarts, PSI, etc.)

## Notes on Common Issues

### Multiple Engine Options
Many vehicles (like the Ram 1500) have multiple engine options that may be available across different trim levels. Each engine variant should have its own specifications.

### Year Ranges
Specifications often change between model years. Use year ranges (e.g., '2014-2018') when specifications are consistent across multiple years, or specific years (e.g., '2017') when they differ.

### Tire Pressure Variations
Tire pressure can vary based on:
- Wheel size
- Trim level
- Load rating
- Whether the tire is P-metric or LT-metric

Always verify the specific tire size and load rating when checking tire pressure.

### Oil Capacity Notes
Oil capacities are typically given "with filter" - this is the standard specification. Some engines may have slightly different capacities if the filter location affects the total capacity.

## Priority for Verification

When verifying data across many vehicles, prioritize:

1. **Popular/High-Volume Vehicles** - More users will benefit
2. **Recent Model Years** - More relevant to current users
3. **Vehicles with Multiple Engine Options** - Most likely to have errors
4. **Performance/Specialty Vehicles** - Often have unique requirements

## Integration with External APIs

For large-scale verification, consider integrating with:
- Car List API (carlistapi.com)
- Vehicle Info API (vehapi.com)
- RideStyler Vehicle Catalog
- Manufacturer APIs (where available)

These can provide comprehensive data but should still be cross-verified with official sources for critical specifications like oil capacity and tire pressure.
