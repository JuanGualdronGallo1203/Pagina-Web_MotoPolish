const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, 'public');

async function convertToWebP() {
  const files = fs.readdirSync(publicDir);
  for (const file of files) {
    if (file.endsWith('.png') && file !== 'PNG A COLOR.png') {
      const filePath = path.join(publicDir, file);
      const newFileName = file.replace(/\.png$/, '.webp');
      const webpPath = path.join(publicDir, newFileName);
      
      console.log(`Converting ${file} to WebP...`);
      try {
        await sharp(filePath)
          .resize({ width: 500, withoutEnlargement: true })
          .webp({ quality: 60, effort: 6 })
          .toFile(webpPath);
          
        fs.unlinkSync(filePath); // delete old png to ensure we don't upload both
      } catch (e) {
        console.error('Error with', file, e);
      }
    }
  }
  console.log("Done converting!");
}

convertToWebP().then(() => {
  // Update data.ts
  const dataFile = path.join(__dirname, 'src', 'constants', 'data.ts');
  let content = fs.readFileSync(dataFile, 'utf8');
  content = content.replace(/\.png\?v=2"/g, '.webp"');
  content = content.replace(/\.png"/g, '.webp"');
  fs.writeFileSync(dataFile, content);
  console.log('Updated data.ts!');
});
