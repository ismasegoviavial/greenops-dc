const fs = require('fs');

const content = `import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import ErrorBoundary from './ErrorBoundary';

const HOTSPOTS = [
  { id: 'evaluaciones', top: '45%', left: '35%', label: 'Generar Evaluación' },
  { id: 'infografia', top: '55%', left: '60%', label: 'Crear Infografía' },
  { id: 'galeria', top: '35%', left: '80%', label: 'Galería Visual IA' },
  { id: 'repositorio', top: '65%', left: '20%', label: 'Mi Casillero' },
];

function Home2Content() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('educamax-theme') === 'dark');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('educamax-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('educamax-theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/');
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          setProfile({ nombre: 'Fernanda', apellido: '' });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile({ nombre: 'Fernanda', apellido: '' });
      }
    });
    return () => unsub();
  }, [navigate]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días!';
    if (hour < 19) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  const handleClick = (h) => {
    if (h.id === 'evaluaciones') navigate('/dashboard');
    else if (h.id === 'infografia') navigate('/infografia');
    else if (h.id === 'galeria') navigate('/galeria');
    else if (h.id === 'repositorio') navigate('/repositorio');
  };

  const initials = profile?.nombre ? profile.nombre.charAt(0).toUpperCase() : 'F';

  return (
    <div className="flex h-screen bg-[var(--color-background)] overflow-hidden">
      <aside className="w-full md:w-72 flex flex-col shrink-0 border-r border-[var(--color-border)]/30" style={{ background: 'var(--sidebar-bg)' }}>
        <div className="p-6 border-b border-[var(--color-border)]/20">
          <h2 className="font-bold text-xl font-['Outfit'] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">Educamax Creator</h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">De profesores, con 🖤 para profesores.</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => navigate('/home')} className="w-full flex items-center gap-3 px-3 py-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 font-medium rounded-xl transition-colors">
            🏠 Volver a Vista Normal
          </button>
        </nav>
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
          <button onClick={() => signOut(auth).then(() => navigate('/'))} className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 font-medium rounded-xl transition-colors text-sm mt-2">
            <LogOut className="w-4 h-4" />Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 flex flex-col h-screen overflow-hidden">
        <header className="mb-6 shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-['Outfit'] text-[var(--color-text-main)]">{greeting()}</h1>
            <p className="text-[var(--color-text-muted)] mt-1">Explora tu escritorio interactivo. Haz clic sobre los objetos para interactuar.</p>
          </div>
          
          <a href="https://www.educamax.cl" target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all group">
            <span className="text-xl">🎓</span>
            <div className="text-left">
              <p className="text-white font-bold text-sm leading-tight">Repositorio PAES</p>
              <p className="text-blue-100 text-xs leading-tight">Ver ensayos en educamax.cl</p>
            </div>
          </a>
        </header>

        <div className="flex-1 relative rounded-3xl overflow-hidden border border-[var(--color-border)]/30 shadow-2xl bg-black">
          <img 
            src={isDarkMode ? '/assets/escritorio-noche.png' : '/assets/escritorio-dia.png'} 
            alt="Escritorio Educamax" 
            className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
          />
          
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 pointer-events-none" />

          {HOTSPOTS.map((h) => (
            <div
              key={h.id}
              className="absolute group z-10"
              style={{ top: h.top, left: h.left, transform: 'translate(-50%, -50%)' }}
            >
              <button 
                onClick={() => handleClick(h)}
                className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50 hover:border-white transition-all duration-300 flex items-center justify-center cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
              </button>
              
              <div className={\`absolute top-full mt-3 px-4 py-2 bg-black/80 backdrop-blur-md text-white text-sm font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-white/20 z-50
                \${parseInt(h.left) > 80 ? 'right-0' : parseInt(h.left) < 20 ? 'left-0' : 'left-1/2 -translate-x-1/2'}
              \`}>
                {h.label}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function Home2() {
  return (
    <ErrorBoundary>
      <Home2Content />
    </ErrorBoundary>
  );
}
`;

fs.writeFileSync('src/components/Home2.jsx', content, 'utf8');
console.log('Fixed Home2.jsx');
