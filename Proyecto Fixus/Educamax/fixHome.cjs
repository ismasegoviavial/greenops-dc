const fs = require('fs');
let txt = fs.readFileSync('src/components/Home.jsx', 'utf8');

// The file got severely broken by replacing blocks. Let's just fix it.
// I will rewrite the whole block of nav manually.
txt = txt.replace(/<nav className="flex-1 p-4 space-y-1">[\s\S]*?(?=<main className="flex-1)/m, 
`<nav className="flex-1 p-4 space-y-1">
          <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 px-3">Herramientas IA</div>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 font-semibold rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <BookOpen className="w-5 h-5" />Inicio
          </button>
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <Wand2 className="w-5 h-5" />Crear Evaluación
          </button>
          <button onClick={() => navigate('/infografia')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <LayoutTemplate className="w-5 h-5" />Crear Infografía
          </button>
          <button onClick={() => navigate('/rubricas')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <FileText className="w-5 h-5" />Crear Rúbrica
          </button>
          <button onClick={() => navigate('/galeria')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <ImageIcon className="w-5 h-5" />Galería Visual IA
          </button>
          <button onClick={() => navigate('/repositorio')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <LockerIcon className="w-5 h-5" />Mi Casillero
          </button>
          <button onClick={() => navigate('/agenda')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <Heart className="w-5 h-5" />Mi Agenda
          </button>

          <div className="pt-3">
            <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 px-3">Vistas</div>
            <button onClick={() => navigate('/home2')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
              <Monitor className="w-5 h-5" />Vista Escritorio
            </button>
          </div>

          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-between px-3 py-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 font-medium rounded-xl transition-colors mt-2">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
            </div>
            <div className={\`w-10 h-5 rounded-full relative transition-colors \${isDarkMode ? 'bg-[var(--color-secondary)]' : 'bg-gray-200'}\`}>
              <div className={\`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform \${isDarkMode ? 'left-5' : 'left-0.5'}\`} />
            </div>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 font-medium rounded-xl cursor-not-allowed">
            <Settings className="w-5 h-5" />Ajustes de Cuenta
          </button>
        </nav>

        {/* Profile */}
        <div className="p-4 border-t border-[var(--color-border)]/20">
          {profile && (
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-[var(--color-primary)]/5 mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-main)] truncate">{profile.nombre} {profile.apellido}</p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">{profile.establecimiento || 'Educamax Creator'}</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 font-medium rounded-xl transition-colors text-sm">
            <LogOut className="w-4 h-4" />Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      `);

// Make sure Monitor is imported.
if (!txt.includes('Monitor')) {
  txt = txt.replace(/FileText } from 'lucide-react';/g, "FileText, Monitor } from 'lucide-react';");
}

fs.writeFileSync('src/components/Home.jsx', txt, 'utf8');
console.log('Fixed Home.jsx');
