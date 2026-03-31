/**
 * Prepares widget payload and notifies native side to write to shared storage.
 * The actual write (App Group on iOS, SharedPreferences on Android) must be
 * implemented in a native module that:
 *   - iOS: UserDefaults(suiteName: "group.com.popthehood.app")["widgetPayload"] = jsonString
 *   - Android: getSharedPreferences("widget_data", MODE_PRIVATE).edit().putString("widgetPayload", jsonString).apply()
 *   - iOS: Call WidgetCenter.shared.reloadAllTimelines() after writing
 *   - Android: AppWidgetManager.getInstance(context).notifyAppWidgetViewDataChanged(appWidgetIds, viewId) optional
 *
 * Call pushWidgetData(appContext) whenever vehicles, shoppingList, or todos change.
 */

import { getWidgetPayload } from './widgetData';

const PAYLOAD_KEY = 'widgetPayload';

/**
 * Returns the JSON string to write to shared storage. Native module should write this
 * to App Group (iOS) or SharedPreferences (Android).
 * @param {{ vehicles: Array, shoppingList: Array, todos: Array }} appState
 * @returns {string}
 */
export function getWidgetPayloadJSON(appState = {}) {
  const payload = getWidgetPayload(appState);
  return JSON.stringify(payload);
}

/**
 * Call this when app data changes. If a native module is installed (e.g. react-native-widget-bridge
 * or custom module), it will write the payload and reload widgets. Otherwise no-op.
 * @param {{ vehicles: Array, shoppingList: Array, todos: Array }} appState
 */
export function pushWidgetData(appState = {}) {
  const json = getWidgetPayloadJSON(appState);
  try {
    if (global.NativeWidgetBridge?.writeWidgetPayload) {
      global.NativeWidgetBridge.writeWidgetPayload(json);
    }
  } catch (_) {
    // No native module; widget won't update until one is added
  }
}
