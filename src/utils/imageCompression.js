/**
 * Compresses an image file to reduce its size
 * @param {File} file - The image file to compress
 * @param {number} maxSizeMB - Maximum file size in MB (default: 5)
 * @param {number} maxWidth - Maximum width in pixels (default: 1920)
 * @param {number} maxHeight - Maximum height in pixels (default: 1920)
 * @returns {Promise<string>} - Promise that resolves to base64 data URL
 */
export function compressImage(file, maxSizeMB = 5, maxWidth = 1920, maxHeight = 1920) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try different quality levels to get under maxSizeMB
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        let quality = 0.9;
        let minQuality = 0.1;
        let bestDataUrl = null;
        
        // Binary search for optimal quality
        while (quality >= minQuality) {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          const sizeInBytes = (dataUrl.length * 3) / 4; // Approximate base64 size
          
          if (sizeInBytes <= maxSizeBytes) {
            resolve(dataUrl);
            return;
          }
          
          bestDataUrl = dataUrl;
          quality -= 0.1;
        }
        
        // If still too large, reduce dimensions further
        if (bestDataUrl && (bestDataUrl.length * 3) / 4 > maxSizeBytes) {
          const reductionFactor = Math.sqrt(maxSizeBytes / ((bestDataUrl.length * 3) / 4));
          const newWidth = Math.floor(width * reductionFactor);
          const newHeight = Math.floor(height * reductionFactor);
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          resolve(bestDataUrl || canvas.toDataURL('image/jpeg', 0.7));
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Gets the approximate file size of a base64 data URL in MB
 * @param {string} dataUrl - Base64 data URL
 * @returns {number} - Size in MB
 */
export function getDataUrlSizeMB(dataUrl) {
  const sizeInBytes = (dataUrl.length * 3) / 4;
  return sizeInBytes / (1024 * 1024);
}
