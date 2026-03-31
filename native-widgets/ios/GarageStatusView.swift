/**
 * Garage Status – Medium widget (4×2). Top 2 upcoming services + estimated odometer.
 * Place in Widget Extension target folder.
 */

import SwiftUI
import WidgetKit

struct GarageStatusEntry: TimelineEntry {
    let date: Date
    let services: [(name: String, vehicleName: String?, milesRemaining: Int)]
    let estimatedOdometer: Int?
    let odometerVehicleName: String?
    let isEmpty: Bool
}

struct GarageStatusView: View {
    let entry: GarageStatusEntry

    var body: some View {
        ZStack {
            Color(red: 0.18, green: 0.18, blue: 0.18)
            if entry.isEmpty {
                VStack(spacing: 4) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.title)
                        .foregroundColor(Color(red: 0.29, green: 0.87, blue: 0.5))
                    Text("All caught up")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.8))
                }
            } else {
                HStack(alignment: .top, spacing: 16) {
                    VStack(alignment: .leading, spacing: 8) {
                        ForEach(Array(entry.services.enumerated()), id: \.offset) { _, s in
                            VStack(alignment: .leading, spacing: 2) {
                                Text(s.name)
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundColor(.white)
                                if let v = s.vehicleName, !v.isEmpty {
                                    Text(v)
                                        .font(.caption2)
                                        .foregroundColor(.white.opacity(0.6))
                                }
                                Text("\(s.milesRemaining) mi left")
                                    .font(.caption)
                                    .foregroundColor(Color(red: 0, green: 0.4, blue: 0.8))
                            }
                        }
                    }
                    Spacer()
                    if let odometer = entry.estimatedOdometer {
                        VStack(alignment: .trailing, spacing: 2) {
                            Text("~\(formatMiles(odometer))")
                                .font(.headline.monospacedDigit())
                                .foregroundColor(.white)
                            Text("Est. odometer")
                                .font(.caption2)
                                .foregroundColor(.white.opacity(0.6))
                            if let v = entry.odometerVehicleName, !v.isEmpty {
                                Text(v)
                                    .font(.caption2)
                                    .foregroundColor(.white.opacity(0.5))
                                    .lineLimit(1)
                            }
                        }
                    }
                }
                .padding(12)
            }
        }
        .widgetURL(URL(string: "popthehood://past-due"))
    }

    private func formatMiles(_ n: Int) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        return formatter.string(from: NSNumber(value: n)) ?? "\(n)"
    }
}
