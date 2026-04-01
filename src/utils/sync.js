/**
 * Bidirectional Sync between AsyncStorage and Supabase
 * Offline-first: all reads from local, Supabase is backup destination.
 * Pro-only feature.
 */
import { supabase, getCurrentUser } from './supabase';
import { storage } from './storage';
import { hasProEntitlement } from './revenueCat';
import * as FileSystem from 'expo-file-system/legacy';
import logger from './logger';
import { isOnline } from './network';

let syncTimeout = null;

/**
 * Debounced sync trigger. Call after any write operation.
 */
export function scheduleSyncAfterWrite() {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    syncToSupabase().catch(err => logger.log('Background sync failed:', err.message));
  }, 5000);
}

/**
 * Full bidirectional sync.
 * @returns {{ success: boolean, error?: string, synced?: object }}
 */
export async function syncToSupabase() {
  try {
    if (!supabase) return { success: false, error: 'Sync not configured' };

    const online = await isOnline();
    if (!online) return { success: false, error: 'No internet connection' };

    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const isPro = await hasProEntitlement();
    if (!isPro) return { success: false, error: 'Pro subscription required' };

    const results = {};

    // Sync vehicles
    results.vehicles = await syncVehicles(user.id);

    // Sync shopping list
    results.shoppingList = await syncShoppingList(user.id);

    // Sync todos
    results.todos = await syncTodos(user.id);

    // Sync settings
    results.settings = await syncSettings(user.id);

    // Update last synced timestamp
    await storage.set('lastSyncedAt', new Date().toISOString());

    return { success: true, synced: results };
  } catch (error) {
    logger.error('Sync error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Restore all data from Supabase to local storage.
 */
export async function restoreFromSupabase() {
  try {
    if (!supabase) return { success: false, error: 'Restore not configured' };

    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const isPro = await hasProEntitlement();
    if (!isPro) return { success: false, error: 'Pro subscription required' };

    // Fetch all data from Supabase
    const { data: vehicles, error: vErr } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', user.id);
    if (vErr) throw vErr;

    const { data: services, error: sErr } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', user.id);
    if (sErr) throw sErr;

    const { data: shoppingList, error: slErr } = await supabase
      .from('shopping_list')
      .select('*')
      .eq('user_id', user.id);
    if (slErr) throw slErr;

    const { data: todos, error: tErr } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id);
    if (tErr) throw tErr;

    const { data: settings, error: setErr } = await supabase
      .from('app_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Convert Supabase vehicles back to local format
    const localVehicles = vehicles.map(v => {
      const vehicleServices = services
        .filter(s => s.vehicle_id === v.id)
        .map(s => ({
          id: s.id,
          type: s.service_type,
          date: s.date,
          mileage: s.mileage,
          cost: s.cost ? parseFloat(s.cost) : null,
          description: s.description,
          notes: s.notes,
          location: s.location,
          isDIY: s.is_diy,
          shopPrice: s.shop_price ? parseFloat(s.shop_price) : null,
          diyPartsCost: s.diy_parts_cost ? parseFloat(s.diy_parts_cost) : null,
          receipt: s.receipt_path ? { uri: s.receipt_path, type: 'image' } : null,
          autoDeduct: s.auto_deduct,
        }));

      return {
        id: v.id,
        year: v.year,
        make: v.make,
        model: v.model,
        trim: v.trim,
        mileage: v.mileage,
        vin: v.vin,
        licensePlate: v.license_plate,
        nickname: v.nickname,
        color: v.color,
        notes: v.notes,
        serviceIntervals: v.service_intervals || {},
        estimatedLastService: v.estimated_last_service || {},
        recommendedFluids: v.recommended_fluids || {},
        torqueValues: v.torque_values || {},
        tires: v.tires || {},
        hardware: v.hardware || {},
        lighting: v.lighting || {},
        partsSKUs: v.parts_skus || {},
        buildSheet: v.build_sheet || {},
        maintenanceHistoryStatus: v.maintenance_history_status,
        healthScore: v.health_score,
        hasCheckEngineLight: v.has_check_engine_light,
        mileageHistory: v.mileage_history || [],
        mileageLastUpdated: v.mileage_last_updated,
        vehicleImage: v.vehicle_image,
        images: v.images || [],
        maintenanceRecords: vehicleServices,
        createdAt: v.created_at,
      };
    });

    // Download images before saving so local paths are persisted
    await downloadImages(user.id, localVehicles);

    // Save to local storage
    await storage.set('vehicles', localVehicles);

    if (shoppingList) {
      const localShopping = shoppingList.map(item => ({
        id: item.id,
        name: item.name,
        completed: item.checked,
        vehicleId: item.vehicle_id || null,
      }));
      await storage.set('shoppingList', localShopping);
    }

    if (todos) {
      const localTodos = todos.map(item => ({
        id: item.id,
        title: item.title,
        completed: item.completed,
      }));
      await storage.set('todos', localTodos);
    }

    if (settings) {
      if (settings.unit_system) await storage.set('unitSystem', settings.unit_system);
      if (settings.persona) await storage.set('userPersona', settings.persona);
      if (settings.notifications_enabled !== undefined) {
        await storage.set('notificationsEnabled', settings.notifications_enabled);
      }
    }

    await storage.set('lastSyncedAt', new Date().toISOString());
    return { success: true };
  } catch (error) {
    logger.error('Restore error:', error);
    return { success: false, error: error.message };
  }
}

// --- Internal helpers ---

async function syncVehicles(userId) {
  const localVehicles = await storage.getAsync('vehicles') || [];

  for (const vehicle of localVehicles) {
    // Upsert vehicle
    const { error: vErr } = await supabase.from('vehicles').upsert({
      id: vehicle.id,
      user_id: userId,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim,
      mileage: vehicle.mileage != null && vehicle.mileage !== '' ? parseInt(String(vehicle.mileage), 10) || null : null,
      vin: vehicle.vin,
      license_plate: vehicle.licensePlate,
      nickname: vehicle.nickname,
      color: vehicle.color,
      notes: vehicle.notes,
      service_intervals: vehicle.serviceIntervals || {},
      estimated_last_service: vehicle.estimatedLastService || {},
      recommended_fluids: vehicle.recommendedFluids || {},
      torque_values: vehicle.torqueValues || {},
      tires: vehicle.tires || {},
      hardware: vehicle.hardware || {},
      lighting: vehicle.lighting || {},
      parts_skus: vehicle.partsSKUs || {},
      build_sheet: vehicle.buildSheet || {},
      maintenance_history_status: vehicle.maintenanceHistoryStatus,
      health_score: vehicle.healthScore != null && vehicle.healthScore !== '' ? Number(vehicle.healthScore) : null,
      has_check_engine_light: vehicle.hasCheckEngineLight || false,
      mileage_history: vehicle.mileageHistory || [],
      mileage_last_updated: vehicle.mileageLastUpdated,
      vehicle_image: vehicle.vehicleImage,
      images: vehicle.images || [],
      created_at: vehicle.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (vErr) logger.error('Vehicle sync error:', vErr.message);

    // Sync maintenance records as services
    const records = vehicle.maintenanceRecords || [];
    for (const record of records) {
      const { error: sErr } = await supabase.from('services').upsert({
        id: record.id,
        vehicle_id: vehicle.id,
        user_id: userId,
        service_type: record.type || 'Other',
        date: record.date || null,
        mileage: record.mileage != null && record.mileage !== '' ? parseInt(String(record.mileage), 10) || null : null,
        cost: record.cost != null && record.cost !== '' ? Number(record.cost) : null,
        description: record.description,
        notes: record.notes,
        location: record.location,
        is_diy: record.isDIY || false,
        shop_price: record.shopPrice != null && record.shopPrice !== '' ? Number(record.shopPrice) : null,
        diy_parts_cost: record.diyPartsCost != null && record.diyPartsCost !== '' ? Number(record.diyPartsCost) : null,
        receipt_path: record.receipt?.uri || null,
        auto_deduct: record.autoDeduct !== false,
        created_at: record.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (sErr) logger.error('Service sync error:', sErr.message);
    }

    // Upload images
    await uploadVehicleImages(userId, vehicle);
  }

  return { count: localVehicles.length };
}

async function syncShoppingList(userId) {
  const localList = await storage.getAsync('shoppingList') || [];

  for (const item of localList) {
    const { error } = await supabase.from('shopping_list').upsert({
      id: item.id,
      user_id: userId,
      name: item.name || 'Untitled',
      checked: item.completed || false,
      vehicle_id: item.vehicleId || null,
      created_at: item.createdAt || new Date().toISOString(),
    }, { onConflict: 'id' });

    if (error) logger.error('Shopping list sync error:', error.message);
  }

  return { count: localList.length };
}

async function syncTodos(userId) {
  const localTodos = await storage.getAsync('todos') || [];

  for (const item of localTodos) {
    const { error } = await supabase.from('todos').upsert({
      id: item.id,
      user_id: userId,
      title: item.title || item.name || '',
      completed: item.completed || false,
      created_at: item.createdAt || new Date().toISOString(),
    }, { onConflict: 'id' });

    if (error) logger.error('Todo sync error:', error.message);
  }

  return { count: localTodos.length };
}

async function syncSettings(userId) {
  const unitSystem = await storage.getAsync('unitSystem') || 'imperial';
  const persona = await storage.getAsync('userPersona');
  const notifications = await storage.getAsync('notificationsEnabled') || false;

  const { error } = await supabase.from('app_settings').upsert({
    user_id: userId,
    unit_system: unitSystem,
    persona: persona,
    notifications_enabled: notifications,
    last_synced_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });

  if (error) logger.error('Settings sync error:', error.message);
  return { synced: true };
}

async function uploadVehicleImages(userId, vehicle) {
  const images = vehicle.images || [];
  for (const img of images) {
    const uri = img.data || img.uri;
    if (!uri || uri.startsWith('http')) continue; // Skip already-uploaded URLs

    try {
      const filename = uri.split('/').pop();
      const storagePath = `${userId}/vehicles/${filename}`;

      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { error } = await supabase.storage
        .from('user-images')
        .upload(storagePath, decode(fileContent), {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error && !error.message.includes('already exists')) {
        logger.error('Image upload error:', error.message);
      }
    } catch (err) {
      logger.log('Could not upload image:', err.message);
    }
  }

  // Upload receipt images from maintenance records
  const records = vehicle.maintenanceRecords || [];
  for (const record of records) {
    if (!record.receipt?.uri || record.receipt.uri.startsWith('http')) continue;
    if (record.receipt.type === 'pdf') continue; // Skip PDFs for now

    try {
      const filename = record.receipt.uri.split('/').pop();
      const storagePath = `${userId}/receipts/${filename}`;

      const fileContent = await FileSystem.readAsStringAsync(record.receipt.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { error } = await supabase.storage
        .from('user-images')
        .upload(storagePath, decode(fileContent), {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error && !error.message.includes('already exists')) {
        logger.error('Receipt upload error:', error.message);
      }
    } catch (err) {
      logger.log('Could not upload receipt:', err.message);
    }
  }
}

async function downloadImages(userId, vehicles) {
  for (const vehicle of vehicles) {
    const images = vehicle.images || [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const uri = img.data || img.uri;
      if (!uri || !uri.startsWith('http')) continue;

      try {
        const filename = uri.split('/').pop();
        const localPath = `${FileSystem.documentDirectory}pop-the-hood/vehicles/${filename}`;

        const { uri: downloadedUri } = await FileSystem.downloadAsync(uri, localPath);
        images[i] = { ...img, data: downloadedUri };
      } catch (err) {
        logger.log('Could not download vehicle image:', err.message);
      }
    }
  }
}

// Base64 decode helper
function decode(base64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const bytes = [];
  let buffer = 0;
  let bits = 0;

  for (let i = 0; i < base64.length; i++) {
    const c = base64[i];
    if (c === '=' || c === '\n' || c === '\r') continue;
    const index = chars.indexOf(c);
    if (index === -1) continue;
    buffer = (buffer << 6) | index;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
    }
  }

  return new Uint8Array(bytes);
}

/**
 * Delete all user data from Supabase (vehicles, services, shopping list, todos, settings, images).
 * Called when the user requests data deletion from Settings.
 */
export async function deleteAllCloudData() {
  try {
    if (!supabase) return { success: true, skipped: true };

    const user = await getCurrentUser();
    if (!user) return { success: true, skipped: true };

    const userId = user.id;

    const { error: sErr } = await supabase.from('services').delete().eq('user_id', userId);
    if (sErr) logger.error('Delete services error:', sErr.message);

    const { error: vErr } = await supabase.from('vehicles').delete().eq('user_id', userId);
    if (vErr) logger.error('Delete vehicles error:', vErr.message);

    const { error: slErr } = await supabase.from('shopping_list').delete().eq('user_id', userId);
    if (slErr) logger.error('Delete shopping_list error:', slErr.message);

    const { error: tErr } = await supabase.from('todos').delete().eq('user_id', userId);
    if (tErr) logger.error('Delete todos error:', tErr.message);

    const { error: setErr } = await supabase.from('app_settings').delete().eq('user_id', userId);
    if (setErr) logger.error('Delete app_settings error:', setErr.message);

    const { error: eErr } = await supabase.from('email_subscribers').delete().eq('email', user.email);
    if (eErr) logger.error('Delete email_subscribers error:', eErr.message);

    // Remove uploaded images from storage
    try {
      const { data: files } = await supabase.storage.from('user-images').list(userId);
      if (files && files.length > 0) {
        const paths = files.map(f => `${userId}/${f.name}`);
        await supabase.storage.from('user-images').remove(paths);
      }
    } catch (imgErr) {
      logger.error('Delete images error:', imgErr.message);
    }

    return { success: true };
  } catch (error) {
    logger.error('Delete all cloud data error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get the last sync timestamp.
 */
export async function getLastSyncedAt() {
  return storage.getAsync('lastSyncedAt');
}

/**
 * Fetch the most recent cloud backup timestamp for the current user.
 * Falls back to local lastSyncedAt if the query fails.
 */
export async function getCloudBackupTimestamp() {
  try {
    if (!supabase) return null;
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('app_settings')
      .select('last_synced_at')
      .eq('user_id', user.id)
      .single();

    if (!error && data?.last_synced_at) return data.last_synced_at;
  } catch (_) {
    // fall through
  }
  return storage.getAsync('lastSyncedAt');
}
