/**
 * Quick Look – Small widget (2×2). Single most urgent service + progress bar (miles left).
 * Place in Widget Extension target folder.
 */

import SwiftUI
import WidgetKit

struct QuickLookEntry: TimelineEntry {
    let date: Date
    let serviceName: String
    let vehicleName: String?
    let milesRemaining: Int
    let dueInMilesReference: Int  // for progress bar total
    let isEmpty: Bool
}

struct QuickLookView: View {
    let entry: QuickLookEntry

    var body: some View {
        ZStack {
            Color(red: 0.18, green: 0.18, blue: 0.18)
            if entry.isEmpty {
                VStack(spacing: 4) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.title2)
                        .foregroundColor(Color(red: 0.29, green: 0.87, blue: 0.5))
                    Text("All caught up")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.8))
                }
            } else {
                VStack(alignment: .leading, spacing: 6) {
                    Text(entry.serviceName)
                        .font(.subheadline.weight(.semibold))
                        .foregroundColor(.white)
                    if let v = entry.vehicleName, !v.isEmpty {
                        Text(v)
                            .font(.caption2)
                            .foregroundColor(.white.opacity(0.6))
                    }
                    Text("\(entry.milesRemaining) mi left")
                        .font(.caption)
                        .foregroundColor(Color(red: 0, green: 0.4, blue: 0.8))
                    GeometryReader { g in
                        let total = max(entry.dueInMilesReference, 1)
                        let pct = min(1.0, max(0, Double(entry.milesRemaining) / Double(total)))
                        ZStack(alignment: .leading) {
                            RoundedRectangle(cornerRadius: 2)
                                .fill(Color.white.opacity(0.2))
                                .frame(height: 4)
                            RoundedRectangle(cornerRadius: 2)
                                .fill(Color(red: 0, green: 0.4, blue: 0.8))
                                .frame(width: g.size.width * pct, height: 4)
                        }
                    }
                    .frame(height: 4)
                }
                .padding(12)
            }
        }
        .widgetURL(URL(string: "popthehood://past-due"))
    }
}
