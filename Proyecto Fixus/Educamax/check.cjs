const fs = require('fs');
const dir = 'src/components/';
fs.readdirSync(dir).filter(f => f.endsWith('.jsx')).forEach(f => {
  const txt = fs.readFileSync(dir + f, 'utf8');
  const set = new Set(txt.match(/[ÃÂâðï][^\s\w\<\>\=\-\;\{\}\(\)\'\"]*/g) || []);
  if (set.size > 0) {
    console.log(f, Array.from(set));
  }
});
