/**
 * Pop the Hood – App Widget provider (Quick Look, Garage Status, Modifications).
 * Place at: android/app/src/main/java/com/popthehood/app/widget/WidgetProvider.kt
 *
 * Data: main app writes JSON to SharedPreferences "widget_data" key "widgetPayload".
 * Refresh: updatePeriodMillis 4–12 hours in res/xml/widget_info.xml.
 * Deep links: popthehood://add-maintenance, popthehood://garage, popthehood://past-due.
 */

package com.popthehood.app.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import com.popthehood.app.R
import org.json.JSONObject
import java.text.NumberFormat
import java.util.Locale

class WidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val payload = loadPayload(context)
        for (widgetId in appWidgetIds) {
            val minWidth = appWidgetManager.getAppWidgetOptions(widgetId).getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH)
            val views = when {
                minWidth < 150 -> buildQuickLook(context, payload)
                minWidth < 250 -> buildGarageStatus(context, payload)
                else -> buildBuildSheet(context, payload)
            }
            appWidgetManager.updateAppWidget(widgetId, views)
        }
    }

    private fun loadPayload(context: Context): WidgetPayload? {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val json = prefs.getString(KEY_PAYLOAD, null) ?: return null
        return try {
            parsePayload(JSONObject(json))
        } catch (_: Exception) {
            null
        }
    }

    private fun buildQuickLook(context: Context, payload: WidgetPayload?): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.widget_quick_look)
        val first = payload?.nextMaintenance?.firstOrNull()
        if (first == null) {
            views.setTextViewText(R.id.widget_quick_title, "All caught up")
            views.setViewVisibility(R.id.widget_quick_bar, android.view.View.GONE)
            views.setViewVisibility(R.id.widget_quick_sub, android.view.View.GONE)
            views.setViewVisibility(R.id.widget_quick_miles, android.view.View.GONE)
        } else {
            views.setTextViewText(R.id.widget_quick_title, first.serviceName)
            views.setTextViewText(R.id.widget_quick_sub, first.vehicleName ?: "")
            views.setTextViewText(R.id.widget_quick_miles, "${first.dueInMiles} mi left")
            views.setProgressBar(R.id.widget_quick_bar, maxOf(first.dueInMiles, 1), first.dueInMiles, false)
            views.setViewVisibility(R.id.widget_quick_bar, android.view.View.VISIBLE)
            views.setViewVisibility(R.id.widget_quick_sub, android.view.View.VISIBLE)
            views.setViewVisibility(R.id.widget_quick_miles, android.view.View.VISIBLE)
        }
        views.setOnClickPendingIntent(R.id.widget_quick_root, openAppIntent(context, "popthehood://past-due"))
        return views
    }

    private fun buildGarageStatus(context: Context, payload: WidgetPayload?): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.widget_garage_status)
        val services = payload?.nextMaintenance?.take(2) ?: emptyList()
        if (services.isEmpty()) {
            views.setTextViewText(R.id.widget_garage_s1, "All caught up")
            views.setViewVisibility(R.id.widget_garage_s1_mi, android.view.View.GONE)
            views.setViewVisibility(R.id.widget_garage_row2, android.view.View.GONE)
        } else {
            views.setTextViewText(R.id.widget_garage_s1, services[0].serviceName)
            views.setTextViewText(R.id.widget_garage_s1_mi, "${services[0].dueInMiles} mi left")
            views.setViewVisibility(R.id.widget_garage_s1_mi, android.view.View.VISIBLE)
            if (services.size > 1) {
                views.setViewVisibility(R.id.widget_garage_row2, android.view.View.VISIBLE)
                views.setTextViewText(R.id.widget_garage_s2, services[1].serviceName)
                views.setTextViewText(R.id.widget_garage_s2_mi, "${services[1].dueInMiles} mi left")
            } else {
                views.setViewVisibility(R.id.widget_garage_row2, android.view.View.GONE)
            }
        }
        val est = payload?.estimatedOdometer
        if (est != null) {
            views.setViewVisibility(R.id.widget_garage_odo, android.view.View.VISIBLE)
            views.setTextViewText(R.id.widget_garage_odo_value, "~${formatMiles(est.estimatedOdometer)}")
            views.setTextViewText(R.id.widget_garage_odo_label, "Est. odometer")
        } else {
            views.setViewVisibility(R.id.widget_garage_odo, android.view.View.GONE)
        }
        views.setOnClickPendingIntent(R.id.widget_garage_root, openAppIntent(context, "popthehood://past-due"))
        return views
    }

    private fun buildBuildSheet(context: Context, payload: WidgetPayload?): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.widget_build_sheet)
        val shopping = payload?.shoppingList?.take(5) ?: emptyList()
        val todo = payload?.todoList?.take(5) ?: emptyList()
        views.setTextViewText(R.id.widget_build_title, "Modifications")
        views.setTextViewText(R.id.widget_build_s1, shopping.getOrNull(0)?.name ?: "—")
        views.setTextViewText(R.id.widget_build_s2, shopping.getOrNull(1)?.name ?: "—")
        views.setTextViewText(R.id.widget_build_s3, shopping.getOrNull(2)?.name ?: "—")
        views.setTextViewText(R.id.widget_build_t1, todo.getOrNull(0)?.title ?: "—")
        views.setTextViewText(R.id.widget_build_t2, todo.getOrNull(1)?.title ?: "—")
        views.setOnClickPendingIntent(R.id.widget_build_add, openAppIntent(context, "popthehood://add-maintenance"))
        views.setOnClickPendingIntent(R.id.widget_build_root, openAppIntent(context, "popthehood://garage"))
        return views
    }

    private fun openAppIntent(context: Context, url: String): PendingIntent {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
            setPackage(context.packageName)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        return PendingIntent.getActivity(context, url.hashCode(), intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
    }

    private fun formatMiles(n: Int): String = NumberFormat.getNumberInstance(Locale.US).format(n)

    companion object {
        private const val PREFS_NAME = "widget_data"
        private const val KEY_PAYLOAD = "widgetPayload"
    }
}

private data class WidgetPayload(
    val nextMaintenance: List<MaintItem>,
    val shoppingList: List<ShopItem>,
    val todoList: List<TodoItem>,
    val estimatedOdometer: EstOdo?
)
private data class MaintItem(val serviceName: String, val vehicleName: String?, val dueInMiles: Int)
private data class ShopItem(val id: String, val name: String, val checked: Boolean)
private data class TodoItem(val id: String, val title: String, val completed: Boolean)
private data class EstOdo(val estimatedOdometer: Int, val vehicleName: String?)

private fun parsePayload(json: JSONObject): WidgetPayload {
    val maint = json.optJSONArray("nextMaintenance")?.let { arr ->
        (0 until arr.length()).map {
            val o = arr.getJSONObject(it)
            MaintItem(o.optString("serviceName"), o.optString("vehicleName").takeIf { s -> s.isNotEmpty() }, o.optInt("dueInMiles", 0))
        }
    } ?: emptyList()
    val shop = json.optJSONArray("shoppingList")?.let { arr ->
        (0 until arr.length()).map {
            val o = arr.getJSONObject(it)
            ShopItem(o.optString("id"), o.optString("name"), o.optBoolean("checked", false))
        }
    } ?: emptyList()
    val todo = json.optJSONArray("todoList")?.let { arr ->
        (0 until arr.length()).map {
            val o = arr.getJSONObject(it)
            TodoItem(o.optString("id"), o.optString("title"), o.optBoolean("completed", false))
        }
    } ?: emptyList()
    val est = json.optJSONObject("estimatedOdometer")?.let { o ->
        EstOdo(o.optInt("estimatedOdometer", 0), o.optString("vehicleName"))
    }
    return WidgetPayload(maint, shop, todo, est)
}
