const fs = require('fs');
const dir = 'src/components/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

const fixes = {
  'Ã¡': 'á',
  'Ã©': 'é',
  'Ã­': 'í',
  'Ã³': 'ó',
  'Ãº': 'ú',
  'Ã±': 'ñ',
  'Â¡': '¡',
  'Â¿': '¿',
  'â˜€ï¸ ': '☀️',
  'â˜€ï¸': '☀️',
  'ðŸ“š': '📚',
  'ðŸŒ™': '🌙',
  'ðŸ  ': '🏠',
  'âœ¨': '✨',
  'â Œ': '❌',
  'ðŸŒˆ': '🌈',
  'â¬œ': '⬜',
  'ðŸ“ ': '📐',
  'ðŸŽ¨': '🎨',
  'De profesores, con ?? para profesores.': 'De profesores, con 🖤 para profesores.'
};

for (const file of files) {
  const path = dir + file;
  let txt = fs.readFileSync(path, 'utf8');
  for (const [bad, good] of Object.entries(fixes)) {
    txt = txt.split(bad).join(good);
  }
  fs.writeFileSync(path, txt, 'utf8');
}
console.log('Fixed encodings!');
