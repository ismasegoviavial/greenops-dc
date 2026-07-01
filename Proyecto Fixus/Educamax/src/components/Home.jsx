import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { 
  BookOpen, Sparkles, Wand2, Image as ImageIcon, 
  Moon, Sun, LogOut, Settings, LayoutTemplate, Heart, Monitor
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('educamax-theme') === 'dark';
  });

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
        }
        
        const q = query(
          collection(db, 'materials'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const docs = await getDocs(q);
        setRecentItems(docs.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  const motivationalLine = () => {
    const lines = [
      'Cada clase que preparas con cuidado cambia una vida. ✨',
      'Tu creatividad es la mejor herramienta pedagógica. ✨',
      'Los mejores profes nunca dejan de aprender. 📚',
      'Hoy también vas a hacer algo que vale la pena. 💛',
      'El esfuerzo de preparar bien una clase siempre se nota. 🎯',
    ];
    return lines[new Date().getMinutes() % lines.length];
  };

  const greeting = () => {
    const h = new Date().getHours();
    const name = (profile?.nombre || 'Fernanda').split(' ')[0];
    if (h >= 5 && h < 12) return `¡Buenos días, ${name}! 🌞`;
    if (h >= 12 && h < 19) return `¡Buenas tardes, ${name}! ☕`;
    return `¡Buenas noches, ${name}! 🌙`;
  };

  const firstName = (profile?.nombre || 'Fernanda').split(' ')[0];
  const initials = profile
    ? `${profile.nombre?.[0] || ''}${profile.apellido?.[0] || ''}`.toUpperCase()
    : 'F';

  const TYPE_LABELS = {
    evaluacion: { label: 'Evaluación', color: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' },
    imagen: { label: 'Imagen IA', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col md:flex-row">

      {/* Sidebar */}
      <aside className="w-full md:w-72 flex flex-col shrink-0 border-r border-[var(--color-border)]/30"
        style={{ background: 'var(--sidebar-bg)' }}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-[var(--color-border)]/20">
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] p-2.5 rounded-xl shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl font-['Outfit'] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              Educamax
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">De profesores, con 🖤 para profesores.</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 px-3">Principal</div>
          
          <button className="w-full flex items-center gap-3 px-3 py-2.5 font-semibold rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <BookOpen className="w-5 h-5" />Inicio
          </button>
          
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <Wand2 className="w-5 h-5" />Crear Evaluación
          </button>

          <button onClick={() => navigate('/galeria')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <ImageIcon className="w-5 h-5" />Galería Visual IA
          </button>

          <button onClick={() => navigate('/repositorio')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <LayoutTemplate className="w-5 h-5" />Mi Casillero
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
            <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-[var(--color-secondary)]' : 'bg-gray-200'}`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${isDarkMode ? 'left-5' : 'left-0.5'}`} />
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
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-[var(--color-accent)] uppercase tracking-wider">De profesores, con 🖤 para profesores.</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-['Outfit'] text-[var(--color-text-main)]">
            {greeting()}
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2 text-base">{motivationalLine()}</p>
        </header>

        {/* Accesos rápidos */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Herramientas rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Crear Evaluación', sub: 'Pruebas con IA', emoji: '📝', route: '/dashboard', color: 'from-[var(--color-primary)] to-[var(--color-secondary)]' },
              { label: 'Galería Visual IA', sub: 'Imágenes pedagógicas', emoji: '🎨', route: '/galeria', color: 'from-purple-500 to-indigo-500' },
              { label: 'Mi Casillero', sub: 'Tu repositorio', emoji: '🗂️', route: '/repositorio', color: 'from-teal-500 to-emerald-500' },
            ].map(item => (
              <button key={item.route} onClick={() => navigate(item.route)}
                className="group relative overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-2xl p-5 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="text-3xl mb-3">{item.emoji}</div>
                <p className="font-bold text-[var(--color-text-main)] text-sm">{item.label}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.sub}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Banner PAES */}
        <section className="mb-10">
          <a href="https://www.educamax.cl" target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 md:p-8 group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-2xl">🎓</span> Repositorio PAES
                </h3>
                <p className="text-blue-100 text-sm md:text-base max-w-xl">
                  Explora y descarga ensayos PAES actualizados y material de preparación exclusivo alojado en educamax.cl.
                </p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-600 font-bold text-sm shadow-sm hover:bg-blue-50 transition-colors">
                  Ver ensayos <Sparkles className="w-4 h-4" />
                </span>
              </div>
            </div>
          </a>
        </section>

        {/* Actividad reciente */}
        {recentItems.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Actividad reciente</h2>
              <button onClick={() => navigate('/repositorio')} className="text-xs text-[var(--color-primary)] font-semibold hover:underline">Ver todo →</button>
            </div>
            <div className="grid gap-3">
              {recentItems.map(item => {
                const tl = TYPE_LABELS[item.tipo] || { label: item.tipo, color: 'bg-gray-100 text-gray-600' };
                return (
                  <div key={item.id} className="bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="text-2xl">{item.tipo === 'evaluacion' ? '📝' : '🎨'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[var(--color-text-main)] truncate">{item.titulo || 'Sin título'}</p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">{item.asignatura || ''}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tl.color}`}>{tl.label}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
