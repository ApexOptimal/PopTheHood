/**
 * Receipt scanning service using OCR (Gemini Vision) to extract
 * mileage, total cost, and classify shop vs parts receipts.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as FileSystem from 'expo-file-system/legacy';
import { listAvailableModels } from './visionAI';
import { requireNetwork } from './network';
import { checkRateLimit, recordCall } from './rateLimit';
import { getEnv } from './env';

let genAI = null;

function getGenAI() {
  if (genAI) return genAI;
  const apiKey = getEnv('EXPO_PUBLIC_GEMINI_API_KEY');
  if (!apiKey) throw new Error('EXPO_PUBLIC_GEMINI_API_KEY is required for receipt scanning.');
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
}

async function imageUriToBase64(imageUri) {
  const path = (imageUri || '').replace(/^file:\/\//, '');
  for (const uri of [path, imageUri]) {
    if (!uri) continue;
    try {
      const info = await FileSystem.getInfoAsync(uri, { uri: true });
      if (!info.exists) continue;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      if (base64 && base64.length > 0) {
        return base64.replace(/^data:image\/[a-z]+;base64,/, '');
      }
    } catch (_) {}
  }
  throw new Error('Could not read receipt image file.');
}

function getMimeType(uri) {
  const lower = (uri || '').toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

/**
 * Parse receipt text for mileage and total using regex fallback.
 * @param {string} text
 * @returns {{ hasMileage: boolean, mileage: number|null, totalCost: number|null }}
 */
export function parseReceiptText(text) {
  if (!text || typeof text !== 'string') {
    return { hasMileage: false, mileage: null, totalCost: null };
  }
  const t = text.replace(/\s+/g, ' ');
  let mileage = null;
  let totalCost = null;

  const mileageRegex = /\b(?:mileage|odometer|miles|mi\.?)\s*:?\s*(\d{1,7})\b/i;
  const m = t.match(mileageRegex);
  if (m) mileage = parseInt(m[1], 10);

  const totalRegex = /(?:total|amount due|balance|grand total)\s*:?\s*\$?\s*([\d,]+\.?\d*)/i;
  const totalMatch = t.match(totalRegex);
  if (totalMatch) {
    const num = parseFloat(totalMatch[1].replace(/,/g, ''));
    if (!isNaN(num)) totalCost = num;
  }
  if (totalCost == null) {
    const dollarRegex = /\$\s*([\d,]+\.?\d{2})/g;
    let last = null;
    let match;
    while ((match = dollarRegex.exec(t)) !== null) last = match;
    if (last) totalCost = parseFloat(last[1].replace(/,/g, ''));
  }

  return {
    hasMileage: mileage != null,
    mileage,
    totalCost,
  };
}

const RECEIPT_PROMPT = `You are analyzing a photo of a receipt (auto shop, parts store, or dealer).

1. Extract ALL visible text from the receipt in order (this is the "fullText").
2. Determine:
   - Does this receipt show a MILEAGE or ODOMETER reading? (common on service invoices)
   - If yes, what is that number? (integer, e.g. 45000)
   - What is the TOTAL amount due / total cost? (number with up to 2 decimals, e.g. 89.99)

Respond ONLY with a valid JSON object, no other text:
{
  "fullText": "entire receipt text here",
  "hasMileage": true or false,
  "mileage": number or null,
  "totalCost": number or null
}

If you cannot read the image or find totals, use null and hasMileage: false.`;

/**
 * Scan a receipt image and extract mileage + total cost (OCR via Gemini).
 * @param {string} imageUri - Local file URI (e.g. from ImagePicker)
 * @returns {Promise<{ hasMileage: boolean, mileage: number|null, totalCost: number|null, rawText: string }>}
 */
export async function scanReceipt(imageUri) {
  await requireNetwork('Receipt scanning');
  const limit = checkRateLimit('receipt-scan', { cooldownMs: 3000, dailyLimit: 30 });
  if (!limit.allowed) throw new Error(limit.reason);
  recordCall('receipt-scan');

  const base64 = await imageUriToBase64(imageUri);
  const mimeType = getMimeType(imageUri);
  const ai = getGenAI();
  let modelName = 'gemini-1.5-flash';
  try {
    const models = await listAvailableModels();
    const withContent = models?.find(m =>
      m.supportedGenerationMethods?.includes('generateContent')
    );
    if (withContent?.name) modelName = withContent.name.replace('models/', '');
  } catch (_) {}
  const model = ai.getGenerativeModel({ model: modelName });

  const parts = [
    { text: RECEIPT_PROMPT },
    { inlineData: { data: base64, mimeType } },
  ];

  let result;
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Receipt scan timed out. Please check your connection and try again.')), 30000)
    );
    result = await Promise.race([model.generateContent(parts), timeout]);
  } catch (e) {
    throw new Error(`Receipt scan failed: ${e.message || 'Unknown error'}`);
  }

  const response = result?.response;
  let text = '';
  if (typeof response?.text === 'function') {
    text = response.text();
  } else if (response?.candidates?.[0]?.content?.parts) {
    const part = response.candidates[0].content.parts.find(p => p.text);
    text = part ? part.text : '';
  }

  const parsed = parseReceiptText(text);
  let hasMileage = parsed.hasMileage;
  let mileage = parsed.mileage;
  let totalCost = parsed.totalCost;

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[0]);
      if (typeof data.hasMileage === 'boolean') hasMileage = data.hasMileage;
      if (data.mileage != null && !isNaN(Number(data.mileage))) mileage = Number(data.mileage);
      if (data.totalCost != null && !isNaN(Number(data.totalCost))) totalCost = Number(data.totalCost);
    } catch (_) {}
  }

  return {
    hasMileage: !!hasMileage,
    mileage: mileage != null ? mileage : null,
    totalCost: totalCost != null ? totalCost : null,
    rawText: text,
  };
}
