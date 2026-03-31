/**
 * Pop the Hood – Widget Extension entry and timeline providers.
 * Place in Widget Extension target folder. Use 4–12 hour refresh for battery.
 *
 * Requires: WidgetShared.swift, QuickLookView.swift, GarageStatusView.swift, BuildSheetView.swift
 * App Group: group.com.popthehood.app
 */

import WidgetKit
import SwiftUI

// MARK: - Quick Look (Small) – single urgent service, miles remaining
struct QuickLookProvider: TimelineProvider {
    func placeholder(in context: Context) -> QuickLookEntry {
        QuickLookEntry(date: Date(), serviceName: "Oil Change", vehicleName: "My Vehicle", milesRemaining: 1200, dueInMilesReference: 5000, isEmpty: false)
    }

    func getSnapshot(in context: Context, completion: @escaping (QuickLookEntry) -> Void) {
        let entry = makeEntry(date: Date())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<QuickLookEntry>) -> Void) {
        let now = Date()
        var entries: [QuickLookEntry] = []
        let payload = loadWidgetPayload()
        let avgMilesPerDay = payload?.estimatedOdometer?.averageMilesPerDay ?? 0
        let snapshotAt = parseISO8601(payload?.snapshotAt ?? payload?.updatedAt) ?? now
        let first = payload?.nextMaintenance.first
        let dueInMiles = first?.dueInMiles ?? 0

        for hourOffset in 0..<24 {
            guard let date = Calendar.current.date(byAdding: .hour, value: hourOffset * 6, to: now) else { continue }
            let milesRemaining: Int
            if let f = first, dueInMiles > 0 {
                milesRemaining = milesRemainingAt(date: date, dueInMiles: f.dueInMiles, snapshotAt: snapshotAt, averageMilesPerDay: avgMilesPerDay)
            } else {
                milesRemaining = 0
            }
            entries.append(QuickLookEntry(
                date: date,
                serviceName: first?.serviceName ?? "—",
                vehicleName: first?.vehicleName,
                milesRemaining: milesRemaining,
                dueInMilesReference: max(dueInMiles, 1),
                isEmpty: first == nil
            ))
        }
        let nextRefresh = Calendar.current.date(byAdding: .hour, value: 6, to: now) ?? now
        completion(Timeline(entries: entries, policy: .after(nextRefresh)))
    }

    private func makeEntry(date: Date) -> QuickLookEntry {
        let payload = loadWidgetPayload()
        let first = payload?.nextMaintenance.first
        let snapshotAt = parseISO8601(payload?.snapshotAt ?? payload?.updatedAt) ?? date
        let avgMilesPerDay = payload?.estimatedOdometer?.averageMilesPerDay ?? 0
        let dueInMiles = first?.dueInMiles ?? 0
        let milesRemaining = first.map { milesRemainingAt(date: date, dueInMiles: $0.dueInMiles, snapshotAt: snapshotAt, averageMilesPerDay: avgMilesPerDay) } ?? 0
        return QuickLookEntry(
            date: date,
            serviceName: first?.serviceName ?? "—",
            vehicleName: first?.vehicleName,
            milesRemaining: milesRemaining,
            dueInMilesReference: max(dueInMiles, 1),
            isEmpty: first == nil
        )
    }
}

// MARK: - Garage Status (Medium)
struct GarageStatusProvider: TimelineProvider {
    func placeholder(in context: Context) -> GarageStatusEntry {
        GarageStatusEntry(date: Date(), services: [("Oil Change", "My Car", 1200)], estimatedOdometer: 45200, odometerVehicleName: "My Car", isEmpty: false)
    }

    func getSnapshot(in context: Context, completion: @escaping (GarageStatusEntry) -> Void) {
        completion(makeEntry(date: Date()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<GarageStatusEntry>) -> Void) {
        let now = Date()
        let payload = loadWidgetPayload()
        let snapshotAt = parseISO8601(payload?.snapshotAt ?? payload?.updatedAt) ?? now
        let avgMilesPerDay = payload?.estimatedOdometer?.averageMilesPerDay ?? 0
        let topTwo = Array((payload?.nextMaintenance ?? []).prefix(2))
        let services: [(name: String, vehicleName: String?, milesRemaining: Int)] = topTwo.map { item in
            let miles = milesRemainingAt(date: now, dueInMiles: item.dueInMiles, snapshotAt: snapshotAt, averageMilesPerDay: avgMilesPerDay)
            return (item.serviceName, item.vehicleName, miles)
        }
        let entry = GarageStatusEntry(
            date: now,
            services: services,
            estimatedOdometer: payload?.estimatedOdometer?.estimatedOdometer,
            odometerVehicleName: payload?.estimatedOdometer?.vehicleName,
            isEmpty: payload?.nextMaintenance.isEmpty ?? true
        )
        let nextRefresh = Calendar.current.date(byAdding: .hour, value: 6, to: now) ?? now
        completion(Timeline(entries: [entry], policy: .after(nextRefresh)))
    }

    private func makeEntry(date: Date) -> GarageStatusEntry {
        let payload = loadWidgetPayload()
        let snapshotAt = parseISO8601(payload?.snapshotAt ?? payload?.updatedAt) ?? date
        let avg = payload?.estimatedOdometer?.averageMilesPerDay ?? 0
        let topTwo = Array((payload?.nextMaintenance ?? []).prefix(2))
        let services = topTwo.map { (name: $0.serviceName, vehicleName: $0.vehicleName, milesRemaining: milesRemainingAt(date: date, dueInMiles: $0.dueInMiles, snapshotAt: snapshotAt, averageMilesPerDay: avg)) }
        return GarageStatusEntry(
            date: date,
            services: services,
            estimatedOdometer: payload?.estimatedOdometer?.estimatedOdometer,
            odometerVehicleName: payload?.estimatedOdometer?.vehicleName,
            isEmpty: payload?.nextMaintenance.isEmpty ?? true
        )
    }
}

// MARK: - Modifications widget (Medium/Large)
struct BuildSheetProvider: TimelineProvider {
    func placeholder(in context: Context) -> BuildSheetEntry {
        BuildSheetEntry(date: Date(), shoppingItems: [("1", "Oil filter", false)], todoItems: [("1", "Log oil change", false)], isEmpty: false)
    }

    func getSnapshot(in context: Context, completion: @escaping (BuildSheetEntry) -> Void) {
        completion(makeEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<BuildSheetEntry>) -> Void) {
        let entry = makeEntry()
        let nextRefresh = Calendar.current.date(byAdding: .hour, value: 6, to: Date()) ?? Date()
        completion(Timeline(entries: [entry], policy: .after(nextRefresh)))
    }

    private func makeEntry() -> BuildSheetEntry {
        let payload = loadWidgetPayload()
        let shopping = (payload?.shoppingList ?? []).map { (id: $0.id, name: $0.name, checked: $0.checked) }
        let todo = (payload?.todoList ?? []).map { (id: $0.id, title: $0.title, completed: $0.completed) }
        return BuildSheetEntry(
            date: Date(),
            shoppingItems: shopping,
            todoItems: todo,
            isEmpty: shopping.isEmpty && todo.isEmpty
        )
    }
}

// MARK: - Widget configurations
struct QuickLookWidget: Widget {
    let kind = "QuickLook"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: QuickLookProvider()) { entry in
            QuickLookView(entry: entry)
        }
        .configurationDisplayName("Quick Look")
        .description("Single most urgent service and miles left.")
        .supportedFamilies([.systemSmall])
    }
}

struct GarageStatusWidget: Widget {
    let kind = "GarageStatus"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: GarageStatusProvider()) { entry in
            GarageStatusView(entry: entry)
        }
        .configurationDisplayName("Garage Status")
        .description("Top 2 upcoming services and estimated odometer.")
        .supportedFamilies([.systemMedium])
    }
}

// Modifications widget needs family in view – pass via environment
struct BuildSheetWidgetEntryView: View {
    @Environment(\.widgetFamily) var family
    var entry: BuildSheetEntry
    var body: some View {
        BuildSheetView(entry: entry, family: family)
    }
}

// Re-declare Modifications widget with EntryView that reads family
struct BuildSheetWidgetWithFamily: Widget {
    let kind = "BuildSheet"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: BuildSheetProvider()) { entry in
            BuildSheetWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Modifications")
        .description("Shopping list, to-do, and Add Maintenance shortcut.")
        .supportedFamilies([.systemMedium, .systemLarge])
    }
}

// MARK: - Bundle (register all three)
@main
struct PopTheHoodWidgetBundle: WidgetBundle {
    var body: some Widget {
        QuickLookWidget()
        GarageStatusWidget()
        BuildSheetWidgetWithFamily()
    }
}
