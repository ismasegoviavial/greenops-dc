const fs = require('fs');

let txt = fs.readFileSync('src/components/Home.jsx', 'utf8');

if (!txt.includes('Monitor')) {
  txt = txt.replace(/LogOut, Moon, Sun, Settings, BookOpen/, 'LogOut, Moon, Sun, Settings, BookOpen, Monitor');
  fs.writeFileSync('src/components/Home.jsx', txt, 'utf8');
  console.log('Added Monitor to Home.jsx imports');
} else {
  console.log('Monitor already imported or not found');
}
