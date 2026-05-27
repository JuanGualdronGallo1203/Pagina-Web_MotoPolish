const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, 'public');

async function optimizeImages() {
  const files = fs.readdirSync(publicDir);
  let totalSavedBytes = 0;

  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      // Skip the logo if we want, but even the logo could be slightly optimized. Let's optimize everything!
      const filePath = path.join(publicDir, file);
      const tempPath = path.join(publicDir, 'temp_' + file);
      
      const originalSize = fs.statSync(filePath).size;
      
      console.log(`Optimizing: ${file} (${(originalSize / 1024 / 1024).toFixed(2)} MB)`);
      try {
        await sharp(filePath)
          .resize({ width: 1000, withoutEnlargement: true }) // Max width 1000px
          .png({ quality: 80, compressionLevel: 9, adaptiveFiltering: true }) // Strong compression
          .toFile(tempPath);
          
        const newSize = fs.statSync(tempPath).size;
        fs.renameSync(tempPath, filePath); // Overwrite original
        
        const saved = originalSize - newSize;
        totalSavedBytes += saved;
        console.log(`  -> Reduced to ${(newSize / 1024 / 1024).toFixed(2)} MB (Saved ${(saved / 1024 / 1024).toFixed(2)} MB)`);
      } catch (e) {
        console.error('  -> Error with', file, e);
      }
    }
  }
  
  console.log(`\nOptimization Complete! Total saved space: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB`);
}

optimizeImages();
