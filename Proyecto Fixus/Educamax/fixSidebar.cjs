const fs = require('fs');
const dir = 'src/components/';
const files = ['Home.jsx', 'Dashboard.jsx', 'InfografiaCreator.jsx', 'GaleriaVisual.jsx'];

for (const f of files) {
  let txt = fs.readFileSync(dir + f, 'utf8');
  if (!txt.includes('Heart')) {
    txt = txt.replace('lucide-react\';', ', Heart } from \'lucide-react\';');
  }
  
  if (!txt.includes('/agenda')) {
    txt = txt.replace(
      /<button onClick=\{\(\) => navigate\('\/repositorio'\)\}.*?<\/button>/s,
      match => match + '\n          <button onClick={() => navigate(\'/agenda\')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">\n            <Heart className="w-5 h-5" />Mi Agenda\n          </button>'
    );
  }
  fs.writeFileSync(dir + f, txt, 'utf8');
}
console.log('Fixed sidebars!');
