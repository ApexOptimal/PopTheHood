/**
 * Google Gemini AI Vision for Product Identification
 * Uses gemini-1.5-pro model to identify automotive/garage products from images
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as FileSystem from 'expo-file-system/legacy';
import { lookupBarcode } from './barcodeLookup';

// Initialize Gemini AI
let genAI = null;

/**
 * Initialize the Gemini AI client
 */
function initializeGemini() {
  if (genAI) return genAI;
  
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'AIzaSyBzAu4NKdof4KI2jCzHxnjxpuAI4Fu67-A';
  
  console.log('🔑 Initializing Gemini API...');
  console.log('API Key present:', !!apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  console.log('API Key starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'none');
  
  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please set EXPO_PUBLIC_GEMINI_API_KEY environment variable.');
  }
  
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('✅ Gemini API initialized');
  return genAI;
}

/**
 * Convert image file to base64 for Gemini API
 */
async function imageToBase64(imagePath) {
  try {
    // Verify file exists first
    const fileInfo = await FileSystem.getInfoAsync(imagePath);
    if (!fileInfo.exists) {
      throw new Error('Image file does not exist');
    }
    
    const base64 = await FileSystem.readAsStringAsync(imagePath, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    if (!base64 || base64.length === 0) {
      throw new Error('Image file is empty or could not be read');
    }
    
    // Ensure base64 string is clean (no data URI prefix)
    // Remove any data URI prefix if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');
    
    return cleanBase64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error(`Failed to read image file: ${error.message || error.toString()}`);
  }
}

/**
 * List available Gemini models for debugging
 * This helps identify which models your API key can access
 */
export async function listAvailableModels() {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'AIzaSyBzAu4NKdof4KI2jCzHxnjxpuAI4Fu67-A';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log('📋 Available models:');
      data.models.forEach(model => {
        console.log(`  - ${model.name} (${model.displayName || 'No display name'})`);
        if (model.supportedGenerationMethods) {
          console.log(`    Methods: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
      return data.models;
    } else {
      console.warn('No models found in response:', data);
      return [];
    }
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
}

/**
 * Identify an item from an image using Google Gemini AI
 * @param {string} imagePath - Local file path to the image
 * @returns {Promise<Object>} Product information with name, category, unit, and description
 */
export async function identifyItemFromImage(imagePath) {
  console.log('🔍 === identifyItemFromImage called ===');
  console.log('📁 Image path:', imagePath);
  
  try {
    // Initialize Gemini
    console.log('🔧 Initializing Gemini AI...');
    const ai = initializeGemini();
    
    // First, try to list available models to see what we can actually use
    console.log('🔍 Checking available models...');
    const availableModels = await listAvailableModels();
    
    // Find a model that supports generateContent
    let modelName = 'gemini-pro'; // Default fallback
    if (availableModels && availableModels.length > 0) {
      const generateContentModel = availableModels.find(m => 
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes('generateContent')
      );
      if (generateContentModel) {
        // Extract just the model name (remove 'models/' prefix if present)
        modelName = generateContentModel.name.replace('models/', '');
        console.log('✅ Found available model:', modelName);
      } else {
        console.warn('⚠️ No model found with generateContent support, using default:', modelName);
      }
    } else {
      console.warn('⚠️ Could not list models, using default:', modelName);
    }
    
    console.log('Using model:', modelName);
    const model = ai.getGenerativeModel({ model: modelName });
    console.log('✅ Model object created');

    // Verify file exists
    const fileInfo = await FileSystem.getInfoAsync(imagePath);
    if (!fileInfo.exists) {
      throw new Error('Image file does not exist');
    }

    // Convert image to base64
    let imageBase64;
    try {
      imageBase64 = await imageToBase64(imagePath);
    } catch (base64Error) {
      throw new Error(`Failed to read image: ${base64Error.message}`);
    }
    
    if (!imageBase64 || imageBase64.length === 0) {
      throw new Error('Image file is empty or could not be read');
    }
    
    // Determine MIME type from file extension or default to jpeg
    let mimeType = 'image/jpeg';
    const lowerPath = imagePath.toLowerCase();
    if (lowerPath.endsWith('.png')) {
      mimeType = 'image/png';
    } else if (lowerPath.endsWith('.webp')) {
      mimeType = 'image/webp';
    } else if (lowerPath.endsWith('.gif')) {
      mimeType = 'image/gif';
    }

    // Create the prompt for Gemini
    const prompt = `Analyze this image of a product found in a garage, maintenance shop, tool storage, yard, or cleaning supply area.

Based on what you see in the image, identify:
1. **Item Name**: Create a clear, concise title for this product (include brand if visible, product type, and key specifications like size/viscosity/model if applicable)
2. **Category**: Choose the most appropriate category from: Fluids, Filters, Parts, Tools, Power Tools, Safety, Supplies, Lubricants, Cleaning, Lawn, or Other
3. **Unit**: Determine the appropriate unit of measurement (quarts, liters, gallons, units, sets, pairs, bottles, cans, etc.)
4. **Description**: A brief description of what this product is used for

Focus on automotive, garage, maintenance, tool, yard, and cleaning contexts. Be specific and accurate.

Respond ONLY with a valid JSON object in this exact format:
{
  "name": "Product Name Here",
  "category": "CategoryName",
  "unit": "unit type",
  "description": "Brief description"
}`;

    // Generate content with image
    // Use the correct format for Gemini API
    // Try multiple formats to handle Android/iOS differences
    let result;
    let lastError = null;
    
    // Validate base64 data before sending
    if (!imageBase64 || typeof imageBase64 !== 'string' || imageBase64.length < 100) {
      throw new Error('Invalid image data: base64 string is too short or invalid');
    }
    
    // Try the correct format for Google Generative AI
    // The library expects parts in a specific structure
    try {
      // Format: Use the generateContent method with parts array
      // Each part can be a string (text) or an object (inlineData)
      const parts = [
        { text: prompt },
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
      ];
      
      console.log('Calling generateContent with parts array');
      result = await model.generateContent(parts);
      console.log('generateContent succeeded');
    } catch (error) {
      console.error('❌ generateContent failed:', error);
      console.error('❌ Error type:', error?.constructor?.name);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error name:', error?.name);
      console.error('❌ Error stack:', error?.stack);
      console.error('❌ Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        mimeType: mimeType,
        base64Length: imageBase64 ? imageBase64.length : 0,
        cause: error?.cause,
      });
      
      // Check if it's the specific "images" error
      const errorMsg = error.message || error.toString() || 'Unknown error';
      console.error('❌ Error message (string):', errorMsg);
      
      if (errorMsg.includes('images') || errorMsg.includes('undefined')) {
        // This might be a library bug - try alternative approach
        console.log('Attempting alternative format with string prompt');
        try {
          // Alternative: Try with prompt as string first, then image
          result = await model.generateContent([
            prompt,
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType,
              },
            },
          ]);
          console.log('Alternative format succeeded');
        } catch (altError) {
          console.error('Alternative format also failed:', altError.message);
          console.error('Alternative error details:', altError);
          throw altError; // Re-throw to be caught by outer catch
        }
      } else {
        throw error; // Re-throw to be caught by outer catch with better error handling
      }
    }

    // Safely access the response
    let response;
    try {
      if (!result) {
        throw new Error('No result returned from generateContent');
      }
      
      if (!result.response) {
        console.error('Result structure:', Object.keys(result));
        throw new Error('No response property in result');
      }
      
      response = result.response;
    } catch (responseError) {
      console.error('Error accessing response:', responseError);
      console.error('Result object:', result ? Object.keys(result) : 'null');
      throw new Error(`Failed to get response from API: ${responseError.message}`);
    }
    
    // Handle different response structures
    let text;
    try {
      // Try the standard text() method first
      if (typeof response.text === 'function') {
        text = response.text();
      } else if (response.candidates && response.candidates[0]) {
        // Alternative: access through candidates
        const candidate = response.candidates[0];
        if (candidate.content && candidate.content.parts) {
          const textPart = candidate.content.parts.find(part => part.text);
          text = textPart ? textPart.text : '';
        } else if (candidate.text) {
          text = candidate.text;
        } else {
          throw new Error('Could not extract text from Gemini response');
        }
      } else {
        throw new Error('Unexpected response structure from Gemini API');
      }
    } catch (textError) {
      console.error('Error extracting text from response:', textError);
      console.error('Response structure:', response ? Object.keys(response) : 'null');
      console.error('Response type:', typeof response);
      throw new Error(`Could not extract text from Gemini response: ${textError.message}`);
    }
    
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from Gemini API');
    }

    // Parse the JSON response
    let productData;
    try {
      // Extract JSON from response (handle markdown code blocks if present)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        productData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // Fallback: try to extract information from text
      productData = extractInfoFromText(text);
    }

    // Validate and clean the response
    return {
      name: productData.name || 'Unknown Product',
      category: validateCategory(productData.category) || 'Parts',
      unit: productData.unit || 'units',
      description: productData.description || 'Product identified from image',
      identifiedFromImage: true,
    };

  } catch (error) {
    console.error('❌ ========== Gemini AI identification error ==========');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Error name:', error?.name);
    console.error('Error stack:', error?.stack);
    console.error('Full error:', error);
    console.error('Error toString:', error?.toString());
    if (error?.cause) {
      console.error('Error cause:', error.cause);
    }
    console.error('=======================================================');
    
    // Provide helpful error messages
    const errorMsg = error?.message || error?.toString() || 'Unknown error';
    const errorMsgLower = errorMsg.toLowerCase();
    
    console.log('Checking error type...');
    console.log('Error message (lowercase):', errorMsgLower);
    
    if (errorMsgLower.includes('api key') || errorMsgLower.includes('401') || errorMsgLower.includes('403') || errorMsgLower.includes('unauthorized')) {
      console.log('Detected: API key error');
      throw new Error('Gemini API key is missing or invalid. Please check your configuration.');
    } else if (errorMsgLower.includes('image') || errorMsgLower.includes('images') || errorMsgLower.includes('inlinedata')) {
      console.log('Detected: Image format error');
      throw new Error('Could not process image. The image format may be invalid. Please try taking another photo.');
    } else if (errorMsgLower.includes('quota') || errorMsgLower.includes('rate limit') || errorMsgLower.includes('429') || errorMsgLower.includes('too many')) {
      console.log('Detected: Rate limit error');
      throw new Error('API rate limit exceeded. Please try again in a moment.');
    } else if (errorMsgLower.includes('network') || errorMsgLower.includes('fetch') || errorMsgLower.includes('connection') || errorMsgLower.includes('econnrefused') || errorMsgLower.includes('timeout')) {
      console.log('Detected: Network error');
      throw new Error(`Network error: ${errorMsg}. Please check your internet connection and try again.`);
    } else {
      console.log('Detected: Unknown error');
      throw new Error(`AI identification failed: ${errorMsg}`);
    }
  }
}

/**
 * Validate category against allowed values
 */
function validateCategory(category) {
  const validCategories = [
    'Fluids',
    'Filters',
    'Parts',
    'Tools',
    'Power Tools',
    'Safety',
    'Supplies',
    'Lubricants',
    'Cleaning',
    'Lawn',
    'Other',
  ];
  
  const categoryLower = (category || '').toLowerCase();
  const matched = validCategories.find(cat => cat.toLowerCase() === categoryLower);
  
  return matched || 'Parts'; // Default to Parts if not found
}

/**
 * Extract product information from text response (fallback)
 */
function extractInfoFromText(text) {
  const nameMatch = text.match(/name["\s:]+([^",\n}]+)/i) || 
                    text.match(/item["\s:]+([^",\n}]+)/i) ||
                    text.match(/product["\s:]+([^",\n}]+)/i);
  
  const categoryMatch = text.match(/category["\s:]+([^",\n}]+)/i);
  const unitMatch = text.match(/unit["\s:]+([^",\n}]+)/i);
  const descMatch = text.match(/description["\s:]+([^",\n}]+)/i);

  return {
    name: nameMatch ? nameMatch[1].trim() : 'Unknown Product',
    category: categoryMatch ? categoryMatch[1].trim() : 'Parts',
    unit: unitMatch ? unitMatch[1].trim() : 'units',
    description: descMatch ? descMatch[1].trim() : 'Product identified from image',
  };
}

/**
 * Identify product using both barcode and image for better accuracy
 * @param {string} imagePath - Local file path to the image
 * @param {string} barcode - Barcode/UPC code
 * @returns {Promise<Object>} Product information
 */
/**
 * Extract VIN from an image of a door jam sticker or paperwork
 * @param {string} imagePath - Local file path to the image
 * @returns {Promise<string>} VIN number (17 characters)
 */
export async function extractVINFromImage(imagePath) {
  console.log('🔍 === extractVINFromImage called ===');
  console.log('📁 Image path:', imagePath);
  
  try {
    // Initialize Gemini
    const ai = initializeGemini();
    
    // List available models
    const availableModels = await listAvailableModels();
    
    // Find a model that supports generateContent
    let modelName = 'gemini-pro';
    if (availableModels && availableModels.length > 0) {
      const generateContentModel = availableModels.find(m => 
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes('generateContent')
      );
      if (generateContentModel) {
        modelName = generateContentModel.name.replace('models/', '');
      }
    }
    
    const model = ai.getGenerativeModel({ model: modelName });
    
    // Verify file exists
    const fileInfo = await FileSystem.getInfoAsync(imagePath);
    if (!fileInfo.exists) {
      throw new Error('Image file does not exist');
    }
    
    // Convert image to base64
    const imageBase64 = await imageToBase64(imagePath);
    
    // Determine MIME type
    let mimeType = 'image/jpeg';
    const lowerPath = imagePath.toLowerCase();
    if (lowerPath.endsWith('.png')) {
      mimeType = 'image/png';
    }
    
    // Create prompt specifically for VIN extraction
    const prompt = `Look at this image of a vehicle door jam sticker, VIN plate, or vehicle paperwork.

Your task is to find and extract the Vehicle Identification Number (VIN). 

A VIN is exactly 17 characters long and contains only letters (A-Z, excluding I, O, Q) and numbers (0-9).

Look for:
- Text labeled "VIN" or "Vehicle Identification Number"
- A 17-character alphanumeric code
- Usually found on door jam stickers, dashboard, or vehicle paperwork

Respond ONLY with the 17-character VIN code in uppercase, nothing else. If you cannot find a valid VIN, respond with "NOT_FOUND".`;

    // Generate content with image
    const parts = [
      { text: prompt },
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
    ];
    
    const result = await model.generateContent(parts);
    const response = await result.response;
    
    // Extract text from response
    let text;
    if (typeof response.text === 'function') {
      text = response.text();
    } else if (response.candidates && response.candidates[0]) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts) {
        const textPart = candidate.content.parts.find(part => part.text);
        text = textPart ? textPart.text : '';
      } else if (candidate.text) {
        text = candidate.text;
      }
    }
    
    if (!text) {
      throw new Error('No response from AI');
    }
    
    // Extract VIN from response (17 characters, alphanumeric, no I, O, Q)
    const vinPattern = /[A-HJ-NPR-Z0-9]{17}/i;
    const vinMatch = text.match(vinPattern);
    
    if (vinMatch) {
      const vin = vinMatch[0].toUpperCase();
      console.log('✅ VIN extracted:', vin);
      return vin;
    } else {
      throw new Error('No valid VIN found in image');
    }
    
  } catch (error) {
    console.error('VIN extraction error:', error);
    throw error;
  }
}

export async function identifyItemFromImageAndBarcode(imagePath, barcode) {
  try {
    // First try barcode lookup
    const barcodeData = await lookupBarcode(barcode);
    
    // If barcode lookup found good data, enhance it with image analysis
    if (barcodeData && barcodeData.name && 
        !barcodeData.name.includes('Product ') && 
        !barcodeData.name.includes('Scanned Product') &&
        !barcodeData.needsVerification) {
      // Barcode lookup was successful, return it
      return barcodeData;
    }
    
    // Barcode lookup failed or returned generic, use image identification
    const imageData = await identifyItemFromImage(imagePath);
    
    // Combine barcode with image data
    return {
      ...imageData,
      barcode: barcode,
    };
  } catch (error) {
    // If barcode lookup fails, try image only
    try {
      return await identifyItemFromImage(imagePath);
    } catch (imageError) {
      throw new Error(`Could not identify product: ${error.message}`);
    }
  }
}
