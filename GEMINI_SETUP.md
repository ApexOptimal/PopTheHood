# Google Gemini AI Vision Setup

This app uses Google Gemini AI (gemini-1.5-flash model) to identify products from images when barcodes are missing or not found in databases.

## Installation

1. **Install the Google Generative AI package:**
   ```bash
   npm install @google/generative-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## API Key Setup

### Option 1: Environment Variable (Recommended)

1. Create a `.env` file in the root of your project:
   ```bash
   touch .env
   ```

2. Add your Gemini API key to the `.env` file:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyBzAu4NKdof4KI2jCzHxnjxpuAI4Fu67-A
   ```

3. **Important:** Make sure `.env` is in your `.gitignore` file to keep your API key secure.

4. Restart your Expo development server after adding the environment variable:
   ```bash
   npx expo start --clear
   ```

### Option 2: Hardcoded (For Testing Only)

The API key is currently hardcoded in `src/utils/visionAI.js` as a fallback. For production, always use environment variables.

## Getting Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to your `.env` file

## Usage

The AI vision system automatically activates when:
- A barcode scan returns a generic "Product X" result
- A barcode lookup fails
- User manually taps "Take Photo for AI ID" button

The system will:
1. Capture a photo of the product
2. Send it to Gemini AI for analysis
3. Identify the product name, category, unit, and description
4. Auto-fill the inventory form

## Categories Supported

The AI will categorize products into:
- **Fluids** - Motor oil, gear oil, brake fluid, coolant, etc.
- **Filters** - Oil filters, air filters, cabin filters, etc.
- **Parts** - Spark plugs, batteries, tires, brake pads, etc.
- **Tools** - Wrenches, sockets, jacks, gauges, etc.
- **Power Tools** - Drills, saws, impact wrenches, etc.
- **Safety** - Gloves, safety glasses, ear protection, etc.
- **Supplies** - Rags, shop towels, disposable gloves, etc.
- **Lubricants** - WD-40, grease, penetrating oil, etc.
- **Cleaning** - Degreasers, car wash soap, wax, polish, etc.
- **Lawn** - Lawn mower parts, garden tools, etc.
- **Other** - Items that don't fit other categories

## Error Handling

The system gracefully handles:
- Missing API key
- Invalid image files
- API rate limits
- Network errors
- Invalid responses

All errors show user-friendly messages and allow manual entry as a fallback.
