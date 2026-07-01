const fs = require('fs');
let txt = fs.readFileSync('src/components/Home2.jsx', 'utf8');

if (!txt.includes('const initials = profile')) {
  txt = txt.replace(/return \(/,
`  const initials = profile
    ? \`\${profile.nombre?.[0] || ''}\${profile.apellido?.[0] || ''}\`.toUpperCase()
    : 'F';

  return (`);
}

txt = txt.replace(/<div className="p-4 border-t border-\[var\(--color-border\)\]\/20">[\s\S]*?(?=<\/aside>)/m,
`<div className="p-4 border-t border-[var(--color-border)]/20">
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
          <button onClick={() => signOut(auth).then(() => navigate('/'))} className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 font-medium rounded-xl transition-colors text-sm mt-2">
            <LogOut className="w-4 h-4" />Cerrar Sesión
          </button>
        </div>
      `);

fs.writeFileSync('src/components/Home2.jsx', txt, 'utf8');
console.log('Fixed Home2.jsx');
