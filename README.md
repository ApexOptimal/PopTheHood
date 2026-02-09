# Garage Assistant

A comprehensive React Native mobile application for tracking vehicle maintenance, managing garage inventory, and maximizing vehicle resale value through detailed maintenance and receipt tracking.

## Overview

Garage Assistant helps vehicle owners maintain detailed records of their vehicles' maintenance history, manage garage inventory, track service intervals, and stay on top of maintenance schedules. The app features a subscription model with RevenueCat integration for premium features.

## Features

### 🚗 Vehicle Management
- **Add Multiple Vehicles**: Track unlimited vehicles with detailed information
  - Make, model, year, trim level
  - VIN (with automatic decoding)
  - License plate
  - Vehicle images
  - Current mileage tracking
- **Vehicle Specifications Database**: 
  - Comprehensive database of vehicle makes, models, years, and trims
  - Automatic specification import (fluids, torque values, tire specs, hardware)
  - Trim-specific specifications for performance models
  - Part numbers and SKUs for maintenance items
- **Vehicle Detail View**: 
  - Complete maintenance history
  - Service interval tracking
  - Past due maintenance alerts
  - Maintenance cost tracking

### 🔧 Maintenance Tracking
- **Comprehensive Maintenance Records**:
  - Oil changes, tire rotations, brake service, and more
  - Date, mileage, cost, and location tracking
  - Detailed descriptions and notes
  - Photo attachments for receipts and work performed
- **Service Interval Management**:
  - Custom service intervals per vehicle
  - Automatic past due detection
  - Service reminders and notifications
- **Maintenance Verification**:
  - Verify maintenance completion
  - Track service history
- **Oil Life Tracking**:
  - Monitor oil life percentage
  - Automatic oil change reminders
- **Mileage Tracking**:
  - Current mileage display
  - Mileage history tracking
  - Two-week reminder notifications for mileage updates
  - Quick mileage update modal

### 📦 Garage Inventory Management
- **Inventory Tracking**:
  - Track garage supplies and parts
  - Monitor quantities and units
  - Organize by category and location
  - Barcode scanning for quick item entry
- **Auto-Deduction**:
  - Automatic inventory deduction when maintenance is performed
  - Smart oil and filter tracking
- **Borrowing System**:
  - Track items loaned to others
  - Return reminders
- **Shopping List**:
  - Create shopping lists from inventory needs
  - Track items to purchase

### 📊 Additional Features
- **AI Mechanic**: Diagnostic assistant powered by Google Gemini AI
  - Chat-like interface for describing vehicle issues
  - AI-powered diagnosis with 3 possible causes
  - Forum Finder: Search car forums directly from diagnosis
  - Automatically includes vehicle info (make/model/year) in searches
- **Past Due Screen**: View all vehicles with overdue maintenance
- **Savings Tracker**: Track money saved through DIY maintenance
- **PDF/CSV Export**: Export maintenance records and vehicle data
- **VIN Decoder**: Automatic vehicle information from VIN
- **Recalls**: Check for vehicle recalls
- **Unit Converter**: Convert between metric and imperial units
- **Image Compression**: Optimize photos for storage efficiency
- **Dark Theme**: Modern dark UI design

### 💎 Subscription Features (Garage Assistant Pro)
- **RevenueCat Integration**: Full subscription management
- **Paywall System**: Automatic paywall after onboarding + 3 minutes usage
- **Customer Center**: Manage subscriptions directly in-app
- **Multiple Plans**: Monthly, Yearly, and Lifetime options

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- Expo CLI (for development)
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Physical device recommended for full feature testing

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm start
# or
expo start
```

4. **Run on your device**:
   - **iOS**: `npm run ios` or `npx expo run:ios`
   - **Android**: `npm run android` or `npx expo run:android`
   - **Web**: `npm run web` (limited features)

### Building for Production

#### iOS
```bash
npx expo run:ios --configuration Release
```

#### Android
```bash
npx expo run:android --configuration Release
```

Or use EAS Build:
```bash
eas build --platform ios
eas build --platform android
```

## Technology Stack

### Core
- **React Native** (0.81.5) - Mobile framework
- **Expo** (~54.0.31) - Development platform
- **React** (19.1.0) - UI library

### Navigation
- **React Navigation** - Navigation library
  - Bottom Tab Navigator
  - Native Stack Navigator

### State Management & Storage
- **AsyncStorage** - Persistent local storage
- React Hooks (useState, useEffect)

### Subscriptions & Payments
- **RevenueCat** (react-native-purchases) - Subscription management
- **RevenueCat UI** (react-native-purchases-ui) - Paywall and Customer Center

### Additional Libraries
- **Expo Camera** - Barcode scanning
- **Expo Notifications** - Push notifications
- **Expo Image Picker** - Photo selection
- **Expo File System** - File management
- **Expo Print** - PDF generation
- **jsPDF** - PDF creation
- **React Native Gesture Handler** - Touch gestures
- **React Native Reanimated** - Animations

## App Structure

### Screens
- **WelcomeScreen** - First-time user welcome
- **OnboardingScreen** - Initial setup (vehicles and inventory)
- **VehiclesScreen** - Main vehicles list
- **VehicleDetailScreen** - Individual vehicle details
- **InventoryScreen** - Garage inventory management
- **DiagnosticScreen** - AI Mechanic diagnostic assistant
- **PastDueScreen** - Overdue maintenance alerts
- **SavingsScreen** - DIY maintenance savings tracker
- **SettingsScreen** - App settings and preferences
- **SubscriptionScreen** - Subscription management

### Key Utilities
- **revenueCat.js** - Subscription and entitlement management
- **paywall.js** - Paywall presentation
- **customerCenter.js** - Customer center integration
- **mileageTracking.js** - Mileage tracking and reminders
- **vehicleSpecsImport.js** - Vehicle specification import
- **vinDecoder.js** - VIN decoding
- **recalls.js** - Vehicle recall checking
- **visionAI.js** - Google Gemini AI integration for product identification
- **pdfGenerator** - PDF export functionality
- **unitConverter.js** - Unit conversion utilities
- **autoDeduction.js** - Automatic inventory deduction
- **appUsageTracking.js** - App usage tracking for paywall

## Data Storage & Privacy

### Local Storage (Private)
All user data is stored locally on the device using AsyncStorage and never leaves your device:
- Vehicles and maintenance records
- Inventory items
- Shopping lists
- App preferences
- Usage tracking data
- Photos and receipts

**Your maintenance logs, vehicle data, and personal information remain completely private and are never synced to the cloud.**

### Internet Access (Limited Use)
The app requires internet access only for the following features:
- **AI Mechanic Chat**: Uses Google Gemini API to provide diagnostic assistance
- **Forum Finder**: Opens external browser to search car forums (Reddit, NASIOC, Bimmerforums, etc.)
- **VIN Decoder**: Fetches vehicle information from external VIN decoding service
- **Recalls**: Checks for vehicle recalls from external database

**Note**: All internet access is for external services only. Your personal maintenance data, vehicle records, and inventory remain stored locally on your device. Clearing app data will remove all stored information.

## Usage Guide

### First Launch
1. **Welcome Screen**: See the congratulations message
2. **Onboarding**: Add your first vehicle and inventory items
3. **Main App**: Start tracking maintenance and managing inventory

### Adding Vehicles
1. Tap "Add Vehicle" on the Vehicles screen
2. Fill in vehicle details (make, model, year required)
3. Optionally add VIN for automatic specification import
4. Add vehicle image if desired

### Tracking Maintenance
1. Select a vehicle from the Vehicles screen
2. Tap "Add Maintenance Record"
3. Fill in maintenance details (type, date, mileage, cost)
4. Add photos of receipts or work performed
5. Optionally deduct items from inventory automatically

### Managing Inventory
1. Navigate to the Inventory tab
2. Tap "Add Item" or scan a barcode
3. Set quantity, unit, category, and location
4. Items can be automatically deducted when used in maintenance

### Mileage Updates
- Tap on the mileage display for any vehicle
- Quick update modal appears
- Mileage history is automatically tracked
- Receive notifications if mileage hasn't been updated in 2 weeks

### Subscription Management
- Access subscription options from Settings
- View available plans (Monthly, Yearly, Lifetime)
- Manage subscription through Customer Center
- Restore previous purchases

## Configuration

### RevenueCat Setup
1. Configure API key in `src/utils/revenueCat.js`
2. Set up products in RevenueCat dashboard:
   - Monthly: `monthly`
   - Yearly: `yearly`
   - Lifetime: `lifetime`
3. Create entitlement: `Garage Assistant Pro`
4. Configure offerings with packages

See `REVENUECAT_INTEGRATION.md` for detailed setup instructions.

### App Configuration
- Edit `app.json` for app metadata
- Configure permissions in `app.json` plugins
- Set bundle identifiers for iOS and Android

## Development

### Project Structure
```
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── utils/          # Utility functions
│   ├── data/           # Static data (vehicle specs)
│   └── assets/         # Images and other assets
├── App.js              # Main app component
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

### Key Development Notes
- Uses Expo managed workflow
- Native modules require `npx expo run:ios` or `npx expo run:android`
- RevenueCat requires native build (not Expo Go)
- Web platform has limited functionality

## Testing

### Testing Checklist
- [ ] Vehicle CRUD operations
- [ ] Maintenance record creation and editing
- [ ] Inventory management
- [ ] Mileage tracking and notifications
- [ ] Barcode scanning
- [ ] PDF/CSV export
- [ ] Subscription purchase flow
- [ ] Restore purchases
- [ ] Customer Center access
- [ ] Past due maintenance detection
- [ ] Service interval tracking

## Known Limitations

- Web platform has limited functionality (no native modules)
- RevenueCat requires native build (not available in Expo Go)
- Some features require device permissions (camera, notifications)

## Troubleshooting

### RevenueCat UI Not Linked Error

If you see an error like:
```
ERROR [Error: The package 'react-native-purchases-ui' doesn't seem to be linked]
```

**Solution:**
1. **Run prebuild** to generate native folders:
   ```bash
   npx expo prebuild --clean
   ```

2. **Rebuild the app** with native modules:
   - **For Android**: `npx expo run:android`
   - **For iOS** (on macOS): 
     ```bash
     cd ios
     pod install
     cd ..
     npx expo run:ios
     ```

3. **Important**: RevenueCat requires a development build, not Expo Go. Make sure you're using:
   - `npx expo run:android` or `npx expo run:ios` (creates development build)
   - NOT `expo start` with Expo Go app

### Native Modules Not Working

If native modules (camera, notifications, RevenueCat) aren't working:
- Ensure you've run `npx expo prebuild`
- Rebuild the app using `npx expo run:android` or `npx expo run:ios`
- Do NOT use Expo Go - use a development build

### Pod Install Issues (iOS)

If `pod install` fails on iOS:
- Ensure you have CocoaPods installed: `sudo gem install cocoapods`
- Navigate to `ios` folder: `cd ios`
- Run: `pod install`
- If issues persist, try: `pod install --repo-update`

### Java/JDK Not Found (Android)

If you see an error like:
```
ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH
```

**Solution:**

1. **Install Java JDK 17** (recommended for React Native):
   - Download from: https://adoptium.net/ (Temurin JDK 17 LTS)
   - Or use Chocolatey: `choco install temurin17`
   - Or use winget: `winget install EclipseAdoptium.Temurin.17.JDK`

2. **Set JAVA_HOME Environment Variable**:
   - **Windows**:
     - Open "Environment Variables" (search in Start menu)
     - Under "System variables", click "New"
     - Variable name: `JAVA_HOME`
     - Variable value: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot` (or your JDK installation path)
     - Click OK
     - Find "Path" in System variables, click "Edit"
     - Add: `%JAVA_HOME%\bin`
     - Click OK on all dialogs
     - **Restart your terminal/PowerShell** for changes to take effect

3. **Verify Installation**:
   ```bash
   java -version
   echo $env:JAVA_HOME  # PowerShell
   ```
   You should see Java version information and the JAVA_HOME path.

4. **Alternative: Use Android Studio's JDK**:
   - If you have Android Studio installed, you can use its bundled JDK:
   - Set `JAVA_HOME` to: `C:\Program Files\Android\Android Studio\jbr`
   - Or: `C:\Users\YourUsername\AppData\Local\Android\Sdk\jbr`

## Future Enhancements

Potential features for future versions:
- Cloud sync and backup
- Multi-device synchronization
- Advanced analytics and reports
- Maintenance cost trends
- Fuel economy tracking
- Service provider directory
- Maintenance scheduling calendar
- Social sharing of maintenance records

## Contributing

This is a private project. For questions or issues, please contact the project maintainer.

## License

This project is proprietary and available for personal use only.

## Support

For technical support or feature requests, please refer to the project documentation or contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: January 2026
