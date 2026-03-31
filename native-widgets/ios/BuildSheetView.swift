/**
 * Modifications – Medium/Large. Shopping list + to-do + Refresh + Add Maintenance shortcut.
 * Place in Widget Extension target folder.
 */

import SwiftUI
import WidgetKit

struct BuildSheetEntry: TimelineEntry {
    let date: Date
    let shoppingItems: [(id: String, name: String, checked: Bool)]
    let todoItems: [(id: String, title: String, completed: Bool)]
    let isEmpty: Bool
}

struct BuildSheetView: View {
    let entry: BuildSheetEntry
    let family: WidgetFamily

    var body: some View {
        ZStack {
            Color(red: 0.18, green: 0.18, blue: 0.18)
            if entry.isEmpty {
                VStack(spacing: 8) {
                    Image(systemName: "doc.text.fill")
                        .font(.title2)
                        .foregroundColor(.white.opacity(0.6))
                    Text("No items yet")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.8))
                    Link(destination: URL(string: "popthehood://add-maintenance")!) {
                        Text("Add Maintenance")
                            .font(.caption.weight(.medium))
                            .foregroundColor(Color(red: 0, green: 0.4, blue: 0.8))
                    }
                }
            } else {
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        Text("Modifications")
                            .font(.subheadline.weight(.bold))
                            .foregroundColor(.white)
                        Spacer()
                        Link(destination: URL(string: "popthehood://add-maintenance")!) {
                            Text("Add Maintenance")
                                .font(.caption2.weight(.medium))
                                .foregroundColor(Color(red: 0, green: 0.4, blue: 0.8))
                        }
                    }
                    if !entry.shoppingItems.isEmpty {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Shopping")
                                .font(.caption.weight(.semibold))
                                .foregroundColor(.white.opacity(0.7))
                            ForEach(entry.shoppingItems, id: \.id) { item in
                                HStack(spacing: 6) {
                                    Image(systemName: item.checked ? "checkmark.square.fill" : "square")
                                        .font(.caption)
                                        .foregroundColor(item.checked ? Color(red: 0, green: 0.4, blue: 0.8) : .white.opacity(0.5))
                                    Text(item.name)
                                        .font(.caption)
                                        .foregroundColor(.white)
                                        .strikethrough(item.checked)
                                        .lineLimit(1)
                                }
                                .widgetURL(URL(string: "popthehood://shopping/item/\(item.id)"))
                            }
                        }
                    }
                    if !entry.todoItems.isEmpty {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("To-Do")
                                .font(.caption.weight(.semibold))
                                .foregroundColor(.white.opacity(0.7))
                            ForEach(entry.todoItems.prefix(family == .systemLarge ? 10 : 4), id: \.id) { item in
                                HStack(spacing: 6) {
                                    Image(systemName: item.completed ? "checkmark.square.fill" : "square")
                                        .font(.caption)
                                        .foregroundColor(item.completed ? Color(red: 0, green: 0.4, blue: 0.8) : .white.opacity(0.5))
                                    Text(item.title)
                                        .font(.caption)
                                        .foregroundColor(.white)
                                        .strikethrough(item.completed)
                                        .lineLimit(1)
                                }
                                .widgetURL(URL(string: "popthehood://todo/\(item.id)"))
                            }
                        }
                    }
                }
                .padding(12)
            }
        }
        .widgetURL(URL(string: "popthehood://garage"))
    }
}
