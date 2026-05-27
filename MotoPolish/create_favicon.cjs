const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, 'public', 'PNG A COLOR.png');
const outPath = path.join(__dirname, 'public', 'favicon.svg');

if (fs.existsSync(imgPath)) {
  const imgData = fs.readFileSync(imgPath);
  const base64 = imgData.toString('base64');
  const mimeType = 'image/png';

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" rx="40" fill="white" />
  <image href="data:${mimeType};base64,${base64}" x="10" y="10" width="180" height="180" preserveAspectRatio="xMidYMid meet" />
</svg>`;

  fs.writeFileSync(outPath, svgContent);
  console.log('Created favicon.svg');
} else {
  console.log('Image not found');
}
