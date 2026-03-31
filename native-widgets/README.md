# Native Home Screen Widgets – File Placement & Setup

This folder contains **source code for iOS (WidgetKit) and Android (App Widget)** home screen widgets. These files live in **separate targets/folders** from the main app.

---

## Where Widget Code Lives (Important)

- **iOS:** The widget is a **separate Xcode target** (Widget Extension). It has its own folder, bundle ID, and Info.plist. It does **not** live inside the main app target (e.g. `garageassistant` or `PopTheHood`). You add a new target in Xcode, then copy the Swift files into that target’s folder.
- **Android:** The widget is part of the **same application** but in specific paths: Java/Kotlin in `android/app/src/main/java/.../widget/`, layouts in `android/app/src/main/res/layout/`, and metadata in `res/xml/`.

---

## 1. Data Persistence (App → Widget)

The main app must **push** the latest data into a shared container so the widget can read it without the app being open.

| Platform   | Shared container | Where the main app writes |
|-----------|------------------|----------------------------|
| **iOS**   | App Group        | `UserDefaults(suiteName: "group.com.popthehood.app")` — same suite for main app and widget extension. |
| **Android** | SharedPreferences or a file in app storage | e.g. `getSharedPreferences("widget_data", Context.MODE_PRIVATE)` or a JSON file the widget reads. |

**In your React Native app:** Call `getWidgetPayload({ vehicles, shoppingList, todos })` from `src/utils/widgetData.js` whenever `vehicles`, `shoppingList`, or `todos` change. You need a **native module** (or Expo config plugin) that writes this JSON string into the App Group (iOS) or SharedPreferences/file (Android). The widget reads from the same place.

---

## 2. Update Logic & Battery

Widgets use a **timeline** (iOS) or **update period** (Android): the system decides when to refresh. Do **not** update every minute.

- **iOS:** In `TimelineProvider`, return entries with a **policy** of `.after(Date().addingTimeInterval(4 * 3600))` (e.g. 4–12 hours). The app can call `WidgetCenter.shared.reloadAllTimelines()` when data changes so the next timeline is fetched with fresh data.
- **Android:** Set `updatePeriodMillis` to at least **4–12 hours** (e.g. `4 * 60 * 60 * 1000`). Optionally update immediately when the app writes new data via `AppWidgetManager.getInstance(context).notifyAppWidgetViewDataChanged(...)`.

**Miles remaining over time:** The payload includes `snapshotAt` and `estimatedOdometer.averageMilesPerDay`. The widget can compute “miles remaining at time T” as:  
`milesRemaining(T) = dueInMiles - (averageMilesPerDay * daysBetween(snapshotAt, T))` so the gauge stays sensible without constant app updates.

---

## 3. Deep Linking (Tap → Open App to a Screen)

When the user taps a widget or an item (e.g. a shopping list part), open the app to a **specific screen**.

| Platform   | Mechanism | Example |
|-----------|-----------|---------|
| **iOS**   | Widget URL (`.widgetURL(...)` or `.url(URL(string: "popthehood://..."))`) | `popthehood://add-maintenance`, `popthehood://garage`, `popthehood://shopping`, `popthehood://todo` |
| **Android** | `PendingIntent` with an `Intent` that has the app’s deep link (e.g. `Intent.ACTION_VIEW` with `Uri.parse("popthehood://...")`) | Same URLs. |

**App scheme (already in app.json):** `popthehood`.

**Suggested URLs:**

- `popthehood://add-maintenance` — Open directly to “Add Maintenance” (e.g. open Past Due or Vehicle and present maintenance form).
- `popthehood://garage` — Open Garage / Inventory tab.
- `popthehood://shopping` — Open to shopping list (e.g. Garage tab with list visible).
- `popthehood://todo` — Open to to-do list.
- `popthehood://past-due` — Open Past Due tab.
- `popthehood://shopping/item/{id}` — Open app and highlight/open a specific shopping item (optional).
- `popthehood://todo/{id}` — Open app and highlight a specific to-do (optional).

In your React Native app, use `Linking` (or React Navigation’s linking config) to handle these URLs and navigate to the correct screen.

---

## 4. iOS – Where to Place the New Files

**→ For a full step-by-step walkthrough (Xcode clicks, App Group, copying files), see [IOS_WIDGET_SETUP.md](./IOS_WIDGET_SETUP.md).**

After running **`npx expo prebuild`**, you get an `ios/` directory.

1. Open **`ios/*.xcworkspace`** in Xcode (not the `.xcodeproj`).
2. Add a **Widget Extension** target:  
   **File → New → Target → iOS → Widget Extension**.  
   Name it e.g. **PopTheHoodWidget** (or “ApexOptimalWidget”).  
   Uncheck “Include Configuration App Intent” if you don’t need it.  
   This creates a **new folder** for the widget (e.g. `PopTheHoodWidget/`) next to your main app folder.
3. **App Groups:**  
   - Select the **main app target** → Signing & Capabilities → **+ Capability** → **App Groups** → add `group.com.popthehood.app`.  
   - Select the **Widget Extension target** → same → add the same `group.com.popthehood.app`.
4. **Copy the Swift files** from **`native-widgets/ios/`** into the **Widget Extension target folder** (e.g. `ios/PopTheHoodWidget/`). Replace the default widget file Xcode generated. Exact mapping:

   | Source (this repo) | Destination (in your Xcode widget target folder) |
   |--------------------|--------------------------------------------------|
   | `native-widgets/ios/WidgetShared.swift` | `ios/PopTheHoodWidget/WidgetShared.swift` |
   | `native-widgets/ios/PopTheHoodWidget.swift` | `ios/PopTheHoodWidget/PopTheHoodWidget.swift` |
   | `native-widgets/ios/QuickLookView.swift` | `ios/PopTheHoodWidget/QuickLookView.swift` |
   | `native-widgets/ios/GarageStatusView.swift` | `ios/PopTheHoodWidget/GarageStatusView.swift` |
   | `native-widgets/ios/BuildSheetView.swift` | `ios/PopTheHoodWidget/BuildSheetView.swift` |

   Add all five files to the Widget Extension target in Xcode (File → Add Files to “…”, or drag into the target’s group). Ensure the target’s **@main** entry point is in `PopTheHoodWidget.swift` (WidgetBundle).
5. In the Widget target’s **Build Phases → Link Binary With Libraries**, ensure **WidgetKit.framework** is linked (usually automatic for a Widget Extension).
6. Build the **main app** and the **widget target** together (e.g. run the app scheme; the widget is embedded in the app).

The widget extension target is **separate** from the main app target: different bundle ID (e.g. `com.popthehood.app.PopTheHoodWidget`), its own Info.plist, and its own folder in `ios/`.

---

## 5. Android – Where to Place the New Files

After **`npx expo prebuild`**, you get an `android/` directory. Package name from app.json: **`com.popthehood.app`**.

Place files as follows (all paths relative to **`android/app/src/main/`**). Copy from **`native-widgets/android/`**:

| Source (this repo) | Destination |
|--------------------|-------------|
| `native-widgets/android/WidgetProvider.kt` | `java/com/popthehood/app/widget/WidgetProvider.kt` |
| `native-widgets/android/res/layout/widget_quick_look.xml` | `res/layout/widget_quick_look.xml` |
| `native-widgets/android/res/layout/widget_garage_status.xml` | `res/layout/widget_garage_status.xml` |
| `native-widgets/android/res/layout/widget_build_sheet.xml` | `res/layout/widget_build_sheet.xml` |
| `native-widgets/android/res/drawable/widget_progress.xml` | `res/drawable/widget_progress.xml` |
| `native-widgets/android/res/xml/widget_info.xml` | `res/xml/widget_info.xml` |
| `native-widgets/android/res/values/widget_strings.xml` | Add `widget_description` to your `res/values/strings.xml` or merge into existing `strings.xml` |

Register the receiver in **`AndroidManifest.xml`** (inside `<application>`):

```xml
<receiver
    android:name=".widget.WidgetProvider"
    android:exported="true"
    android:label="Quick Look">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
    </intent-filter>
    <meta-data
        android:name="android.appwidget.provider"
        android:resource="@xml/widget_info" />
</receiver>
```

Use **`updatePeriodMillis`** in `widget_info.xml` to 4–12 hours (e.g. `14400000` for 4 hours) for battery efficiency.

---

## 6. Widget Designs Summary

| Widget | Size | Content |
|--------|------|--------|
| **Quick Look** (Service Gauge) | Small (2×2) | Single most urgent maintenance item; progress bar = miles left until due. |
| **Garage Status** | Medium (4×2) | Top 2 upcoming services + current estimated odometer (from Average Daily Mileage). |
| **Modifications** | Medium / Large (4×2 or 4×4) | Shopping list + to-do items; “Refresh” button; shortcut button that opens app to “Add Maintenance” (deep link). |

Tapping a specific item (e.g. a part in the shopping list) should open the app and navigate to that screen (deep link).

---

## 7. Checklist

- [ ] Main app writes `getWidgetPayload(...)` JSON to App Group (iOS) and SharedPreferences/file (Android) when data changes.
- [ ] iOS: Widget Extension target added; App Group added to **both** main app and widget; Swift files in widget target folder.
- [ ] Android: Widget provider and layouts in the paths above; receiver and metadata in manifest; `updatePeriodMillis` set to 4–12 hours.
- [ ] Deep links (`popthehood://add-maintenance`, etc.) handled in the app (e.g. via `Linking` or React Navigation).
- [ ] Timeline / update interval set to 4–12 hours for battery efficiency.
