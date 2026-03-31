# iOS Widget Setup – Step by Step

Follow these steps to add the Widget Extension and the five Swift files. You need **Xcode** and (for device/App Groups) an **Apple Developer account**.

---

## Step 0: Generate the iOS project (if you don’t have `ios/` yet)

If there is no **`ios/`** folder at the root of your project:

1. In Terminal, from the project root:
   ```bash
   npx expo prebuild --platform ios
   ```
2. After it finishes, you should see **`ios/`** with an **`.xcworkspace`** (e.g. `ios/garageassistant.xcworkspace` or `ios/Pop the Hood.xcworkspace`).

---

## Step 1: Open the project in Xcode

1. Open the **workspace** (not the `.xcodeproj`):
   - Double‑click **`ios/*.xcworkspace`** in Finder, or  
   - **File → Open** in Xcode and choose that `.xcworkspace`.
2. In the left sidebar (Project Navigator), you should see your app target and the Pods project.

---

## Step 2: Add the Widget Extension target

1. In Xcode menu: **File → New → Target…**
2. In the template chooser:
   - Select **iOS** at the top.
   - In the list, choose **Widget Extension** (under “Application Extension”).
   - Click **Next**.
3. Configure the widget:
   - **Product Name:** `PopTheHoodWidget` (or e.g. `ApexOptimalWidget`).
   - **Team:** your Apple Developer team.
   - **Bundle Identifier:** leave as suggested (e.g. `com.popthehood.app.PopTheHoodWidget`).
   - **Uncheck** “Include Configuration App Intent” (unless you want it).
   - **Uncheck** “Include Live Activity” (unless you want it).
   - Click **Finish**.
4. If Xcode asks **“Activate ‘PopTheHoodWidget’ scheme?”**, click **Activate** (you can switch back to the app scheme to run the main app).

Xcode creates a **new group and folder** for the widget (e.g. **PopTheHoodWidget**) and a default Swift file (e.g. `PopTheHoodWidget.swift`). You’ll replace/merge that with the files from this repo.

---

## Step 3: Add App Group to the main app target

1. In the Project Navigator, click the **blue project icon** (top of the list) to open the project settings.
2. Under **TARGETS**, select your **main app target** (e.g. “garageassistant” or “Pop the Hood”).
3. Open the **Signing & Capabilities** tab.
4. Click **+ Capability**.
5. Search for **App Groups** and double‑click it.
6. Under App Groups, click **+** and add:
   ```text
   group.com.popthehood.app
   ```
7. Leave the checkbox for `group.com.popthehood.app` **checked**.

---

## Step 4: Add App Group to the Widget Extension target

1. Under **TARGETS**, select the **Widget Extension** target (e.g. **PopTheHoodWidget**).
2. Open **Signing & Capabilities**.
3. Click **+ Capability**.
4. Add **App Groups** again.
5. Add the **same** group:
   ```text
   group.com.popthehood.app
   ```
6. Ensure the checkbox is **checked**.

Both the app and the widget must use the same App Group so they can share the widget payload.

---

## Step 5: Copy the five Swift files into the widget target folder

1. In **Finder**, go to your project root and open **`native-widgets/ios/`**. You should see:
   - `WidgetShared.swift`
   - `PopTheHoodWidget.swift`
   - `QuickLookView.swift`
   - `GarageStatusView.swift`
   - `BuildSheetView.swift`

2. In **Finder**, open the **widget target folder** inside your Xcode project. It’s next to your app folder, e.g.:
   - **`ios/PopTheHoodWidget/`**  
   (The exact name matches the Product Name you chose in Step 2.)

3. **Copy** all five files from **`native-widgets/ios/`** into **`ios/PopTheHoodWidget/`** (or your widget folder name):
   - Drag the five files from `native-widgets/ios/` into `ios/PopTheHoodWidget/`, or  
   - Copy/paste so you have:
     - `ios/PopTheHoodWidget/WidgetShared.swift`
     - `ios/PopTheHoodWidget/PopTheHoodWidget.swift`
     - `ios/PopTheHoodWidget/QuickLookView.swift`
     - `ios/PopTheHoodWidget/GarageStatusView.swift`
     - `ios/PopTheHoodWidget/BuildSheetView.swift`

4. If Xcode had created a default **`PopTheHoodWidget.swift`**, you can **replace** it with the one from `native-widgets/ios/` (the new one contains the full bundle and timeline providers). If you prefer to keep the old file, rename or remove it so there’s only **one** `@main` entry (the one in the new `PopTheHoodWidget.swift`).

---

## Step 6: Add the Swift files to the Widget target in Xcode

1. In Xcode’s **Project Navigator**, find the **PopTheHoodWidget** group (the widget target’s group).
2. If the five Swift files don’t appear there:
   - Right‑click the **PopTheHoodWidget** group → **Add Files to “[Your Project]”…**
   - Navigate to **`ios/PopTheHoodWidget/`** (or your widget folder).
   - Select all five **`.swift`** files.
   - Leave **“Copy items if needed”** unchecked (they’re already in the folder).
   - Under **Add to targets**, ensure **PopTheHoodWidget** is **checked** (and the main app target is **not** checked for these files).
   - Click **Add**.
3. If the files are already in the group but not in the target:
   - Select each file in the navigator.
   - In the **File inspector** (right panel), under **Target Membership**, check **PopTheHoodWidget**.

Ensure **WidgetShared**, **QuickLookView**, **GarageStatusView**, and **BuildSheetView** are all in the **PopTheHoodWidget** target. Only **PopTheHoodWidget.swift** should have `@main` (WidgetBundle).

---

## Step 7: Build and run

1. In the Xcode scheme dropdown, choose your **main app** scheme (e.g. “garageassistant” or “Pop the Hood”).
2. Choose a simulator or a connected device.
3. Press **⌘B** to build (or **⌘R** to run).

The widget is **embedded** in the app, so installing the app also installs the widget. On the device/simulator:

- Long‑press the home screen → tap **+** (or “Add Widget”) → find your app → you should see **Quick Look**, **Garage Status**, and **Modifications** as widget options.

---

## Troubleshooting

- **“No such module ‘WidgetKit’”**  
  The Widget Extension target should link WidgetKit by default. If not: select the **PopTheHoodWidget** target → **Build Phases → Link Binary With Libraries** → **+** → add **WidgetKit.framework**.

- **App Group not found / code signing errors**  
  Make sure the App Group is added to **both** the main app and the widget target, and that the **Team** and **Signing** settings are valid for your Apple Developer account.

- **Widget shows “All caught up” or no data**  
  The widget reads from App Group `UserDefaults`. The main app must write the payload (via a native module or Expo config) to `UserDefaults(suiteName: "group.com.popthehood.app")` with key `"widgetPayload"`. See the main **README.md** in this folder (section 1 and checklist).

- **Duplicate `@main`**  
  You must have only one `@main` in the widget target. Use the **PopTheHoodWidget.swift** from `native-widgets/ios/` and remove or rename any other file that declares `@main` in that target.
