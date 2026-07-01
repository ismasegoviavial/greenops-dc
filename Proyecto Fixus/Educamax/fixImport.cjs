const fs = require('fs');
const dir = 'src/components/';
['Home.jsx', 'Dashboard.jsx', 'InfografiaCreator.jsx', 'GaleriaVisual.jsx'].forEach(f => {
  let txt = fs.readFileSync(dir + f, 'utf8');
  txt = txt.replace(/\}\s+from\s+',\s+Heart\s+\}\s+from\s+'lucide-react';/g, ', Heart } from \'lucide-react\';');
  fs.writeFileSync(dir + f, txt, 'utf8');
});
