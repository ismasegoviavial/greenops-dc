const fs = require('fs');
const dir = 'src/components/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

const fixMap = {
  'âš™ï¸\x8F': '⚙️',
  'âœ”ï¸\x8F': '✔️',
  'âœ\x8Dï¸\x8F': '✍️',
  'â†’': '→',
  'â€¢': '•',
  'Â©': '©',
  'â\x8F°': '⏰',
  'â\x8F±ï¸\x8F': '⏳',
  'â•\x90': '═',
  'âœ…': '✅',
  'â†\x90': '←',
  'âš™ï¸ ': '⚙️',
  'âœ”ï¸ ': '✔️',
  'âœ\x8Dï¸ ': '✍️',
  'â\x8F±ï¸ ': '⏳',
  'âš™': '⚙',
  'âœ”': '✔',
  'âœ\x8D': '✍',
  'â\x8F±': '⏳',
  'â\x8F°': '⏰',
};

for (const file of files) {
  const path = dir + file;
  let txt = fs.readFileSync(path, 'utf8');
  for (const [bad, good] of Object.entries(fixMap)) {
    txt = txt.split(bad).join(good);
  }
  fs.writeFileSync(path, txt, 'utf8');
}
console.log('Fixed everything!');
