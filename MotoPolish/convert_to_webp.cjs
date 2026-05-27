const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, 'public');

async function convertToWebP() {
  const files = fs.readdirSync(publicDir);
  for (const file of files) {
    if ((file.endsWith('.png') || file.endsWith('.jpg')) && file !== 'PNG A COLOR.png') {
      const filePath = path.join(publicDir, file);
      const newFileName = file.replace(/\.(png|jpg)$/, '.webp');
      const webpPath = path.join(publicDir, newFileName);
      
      console.log(`Converting ${file} to WebP...`);
      try {
        await sharp(filePath)
          .resize({ width: 800, withoutEnlargement: true })
          .webp({ quality: 80, effort: 6 })
          .toFile(webpPath);
          
        fs.unlinkSync(filePath); // delete old png
      } catch (e) {
        console.error('Error with', file, e);
      }
    }
  }
  console.log("Done converting!");
}
convertToWebP();
