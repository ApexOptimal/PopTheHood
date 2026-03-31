# Home Screen Widgets (iOS & Android)

Native home screen widgets display app data **without the app being open**. The implementation lives in a **separate folder/target** from the main app code.

---

## Widget suite (Quick Look, Garage Status, Modifications)

| Widget | Size | Content |
|--------|------|--------|
| **Quick Look** (Service Gauge) | Small (2×2) | Single most urgent maintenance item; progress bar = miles left until due. |
| **Garage Status** | Medium (4×2) | Top 2 upcoming services + current **estimated odometer** (Average Daily Mileage). |
| **Modifications** | Medium / Large (4×2 or 4×4) | Shopping list + to-do items; **Refresh**; shortcut that opens app to **Add Maintenance**. |

They work on a **timeline**: the app gives the system a schedule of what to show (e.g. “at 10:00 show 500 mi left; by 6:00 PM show 480 mi left”). Updates are **4–12 hours** for battery efficiency.

---

## Where the widget code lives

- **iOS:** A **separate Xcode target** (Widget Extension). It has its own folder and bundle ID, not inside the main app target. You add the target, then copy the Swift files from this repo into that target’s folder.
- **Android:** Same app, but in specific paths: Kotlin in `android/.../widget/`, layouts in `res/layout/`, metadata in `res/xml/`.

**Full file placement and setup:** see **`native-widgets/README.md`** in this repo. It includes:

- Exact paths for every iOS and Android file
- Data persistence (App Groups / SharedPreferences)
- Update logic and battery-friendly refresh (4–12 hours)
- Deep linking (tap widget → open app to the right screen)
- Checklist to finish setup

---

## Data and app → widget push

- **Payload:** `src/utils/widgetData.js` → `getWidgetPayload({ vehicles, shoppingList, todos })`. Returns JSON with:
  - `nextMaintenance` (up to 2 items; each has `vehicleName`, `dueInMiles`, `urgency`, etc.)
  - `estimatedOdometer` (estimated odometer + average miles per day for timeline “miles remaining”)
  - `shoppingList`, `todoList`, `snapshotAt`
- **Push:** The app calls **`pushWidgetData({ vehicles, shoppingList, todos })`** from `src/utils/widgetPush.js` whenever that data changes (already wired in `App.js`). The **actual write** to the OS (App Group on iOS, SharedPreferences on Android) must be done by a **native module**; see `native-widgets/README.md` and `src/utils/widgetPush.js` for the contract.

---

## Deep links (widget tap → app screen)

The app handles `popthehood://` URLs and navigates to the correct tab:

- `popthehood://past-due` or `popthehood://add-maintenance` → Past Due tab
- `popthehood://garage` → Garage tab
- `popthehood://vehicles` → Vehicles tab

Linking is configured in `App.js`. For item-specific links (e.g. `popthehood://shopping/item/123`), you can extend the linking config or handle them in a `Linking` listener.

---

## Summary

1. **Implement native widgets** using the files and instructions in **`native-widgets/`** (see `native-widgets/README.md` for where to place each file).
2. **Add a native module** that writes the JSON from `getWidgetPayloadJSON(appState)` to App Group (iOS) and SharedPreferences (Android); optionally call widget refresh (e.g. `WidgetCenter.shared.reloadAllTimelines()` on iOS).
3. **Deep links** are already set up; widget URLs open the right tab.
4. **Battery:** Use a 4–12 hour timeline/update interval as described in `native-widgets/README.md`.
