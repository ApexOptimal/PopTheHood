/**
 * Shared types and App Group reading for Pop the Hood widgets.
 * Place in the same folder as your Widget Extension target (e.g. PopTheHoodWidget/).
 *
 * App Group: group.com.popthehood.app — must match main app and widget capability.
 */

import Foundation
import WidgetKit

// MARK: - App Group
let appGroupId = "group.com.popthehood.app"

func sharedUserDefaults() -> UserDefaults? {
    UserDefaults(suiteName: appGroupId)
}

// MARK: - Payload (matches getWidgetPayload() in src/utils/widgetData.js)
struct WidgetPayload: Codable {
    var nextMaintenance: [MaintenanceItem]
    var shoppingList: [ShoppingItem]
    var todoList: [TodoItem]
    var estimatedOdometer: EstimatedOdometer?
    var snapshotAt: String?
    var updatedAt: String?
}

struct MaintenanceItem: Codable {
    var id: String
    var vehicleId: String?
    var serviceName: String
    var dueInMiles: Int
    var dueInDays: Int
    var nextServiceMileage: Int?
    var currentMileageAtSnapshot: Int?
    var urgency: Double
    var vehicleName: String?
}

struct ShoppingItem: Codable {
    var id: String
    var name: String
    var checked: Bool
}

struct TodoItem: Codable {
    var id: String
    var title: String
    var completed: Bool
}

struct EstimatedOdometer: Codable {
    var estimatedOdometer: Int
    var averageMilesPerDay: Double
    var vehicleName: String
    var snapshotAt: String?
}

// MARK: - Load payload from App Group
func loadWidgetPayload() -> WidgetPayload? {
    guard let defaults = sharedUserDefaults(),
          let data = defaults.data(forKey: "widgetPayload") else { return nil }
    return try? JSONDecoder().decode(WidgetPayload.self, from: data)
}

// MARK: - Miles remaining at a given date (for timeline)
func milesRemainingAt(date: Date, dueInMiles: Int, snapshotAt: Date, averageMilesPerDay: Double) -> Int {
    let days = max(0, date.timeIntervalSince(snapshotAt) / (24 * 3600))
    let driven = Int(averageMilesPerDay * days)
    return max(0, dueInMiles - driven)
}

func parseISO8601(_ s: String?) -> Date? {
    guard let s = s else { return nil }
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return formatter.date(from: s) ?? ISO8601DateFormatter().date(from: s)
}
