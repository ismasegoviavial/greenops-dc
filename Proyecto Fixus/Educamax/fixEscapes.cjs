const fs = require('fs');
let txt = fs.readFileSync('src/components/Dashboard.jsx', 'utf8');

// Unescape escaped template literals
txt = txt.replace(/\\\$/g, '$');
txt = txt.replace(/\\`/g, '`');

fs.writeFileSync('src/components/Dashboard.jsx', txt, 'utf8');
console.log('Fixed escaped chars');
