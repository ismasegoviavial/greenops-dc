const fs = require('fs');
const dir = 'src/components/';
const files = ['Home.jsx', 'Dashboard.jsx', 'InfografiaCreator.jsx', 'GaleriaVisual.jsx', 'Repositorio.jsx', 'MiAgenda.jsx'];

for (const f of files) {
  let txt = fs.readFileSync(dir + f, 'utf8');
  
  if (!txt.includes('FileText')) {
    txt = txt.replace(/,\s*Heart\s*\}\s*from\s*'lucide-react';/g, ', Heart, FileText } from \'lucide-react\';');
  }

  const rubricaBtn = `
          <button onClick={() => navigate('/rubricas')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <FileText className="w-5 h-5" />Crear Rúbrica
          </button>`;

  if (!txt.includes('/rubricas')) {
    txt = txt.replace(
      /(<button[^>]*>\s*<LayoutTemplate[^>]*>\s*Crear Infografía\s*<\/button>)/,
      `$1${rubricaBtn}`
    );
  }
  
  fs.writeFileSync(dir + f, txt, 'utf8');
}
console.log('Added Rubrica to all sidebars!');
