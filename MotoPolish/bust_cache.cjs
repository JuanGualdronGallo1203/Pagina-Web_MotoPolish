const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'constants', 'data.ts');

let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\.png"/g, '.png?v=2"');
fs.writeFileSync(file, content);
console.log('Done!');
