import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Building, Key, X, Loader2 } from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { ErrorBoundary } from './ErrorBoundary';

const HOTSPOTS = [
  { id: 'repositorio', left: '21.8%', top: '29.6%', label: 'Mi Casillero' },
  { id: 'luz', left: '69.7%', top: '41.4%', label: 'Modo Oscuro' },
  { id: 'galeria', left: '53.8%', top: '72.0%', label: 'Galería Visual IA' },
  { id: 'agenda', left: '71.9%', top: '83.2%', label: 'Mi Agenda' },
  { id: 'evaluaciones', left: '49.6%', top: '89.6%', label: 'Creador Evaluaciones' }
];

function Home2Content() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('educamax-theme') === 'dark');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinColegio = async () => {
    if (!inviteCode.trim()) return;
    setIsJoining(true);
    setJoinError('');
    try {
      const q = query(collection(db, 'colegios'), where('codigoInvitacion', '==', inviteCode.trim().toUpperCase()));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setJoinError('Código de invitación no válido.');
        setIsJoining(false);
        return;
      }

      const colegioDoc = snap.docs[0];
      const colegioData = colegioDoc.data();

      if (colegioData.licenciasUsadas >= colegioData.licenciasTotales) {
        setJoinError('Este colegio ya no tiene licencias disponibles.');
        setIsJoining(false);
        return;
      }

      const userUid = auth.currentUser.uid;
      
      // Update User
      await updateDoc(doc(db, 'users', userUid), {
        colegioId: colegioDoc.id,
        establecimiento: colegioData.nombre
      });

      // Update Colegio Licencias
      await updateDoc(doc(db, 'colegios', colegioDoc.id), {
        licenciasUsadas: colegioData.licenciasUsadas + 1
      });

      setProfile({ ...profile, colegioId: colegioDoc.id, establecimiento: colegioData.nombre });
      setIsJoinModalOpen(false);
    } catch (err) {
      console.error(err);
      setJoinError('Ocurrió un error al unirse al colegio.');
    } finally {
      setIsJoining(false);
    }
  };

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = (profile?.nombre || 'Fernanda').split(' ')[0];
    if (hour < 12) return `¡Buenos días, ${name}! 🌞`;
    if (hour < 19) return `¡Buenas tardes, ${name}! ☕`;
    return `¡Buenas noches, ${name}! 🌙`;
  };

  const handleClick = (h) => {
    if (h.id === 'evaluaciones') navigate('/dashboard');
    
    else if (h.id === 'galeria') navigate('/galeria');
    else if (h.id === 'repositorio') navigate('/repositorio');
    else if (h.id === 'agenda') navigate('/agenda');
    else if (h.id === 'luz') setIsDarkMode(!isDarkMode);
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
          
          {profile?.rol === 'admin' && (
            <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-3 px-3 py-2 text-indigo-500 hover:bg-indigo-500/10 font-medium rounded-xl transition-colors text-sm mt-2 mb-2">
              <Building className="w-4 h-4" />Panel de Administración
            </button>
          )}

          {!profile?.colegioId && profile?.rol !== 'admin' && (
            <button onClick={() => setIsJoinModalOpen(true)} className="w-full flex items-center gap-3 px-3 py-2 text-amber-600 hover:bg-amber-500/10 font-medium rounded-xl transition-colors text-sm mt-2 mb-2">
              <Key className="w-4 h-4" />Unirse a un Colegio
            </button>
          )}

          <button onClick={() => signOut(auth).then(() => navigate('/'))} className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 font-medium rounded-xl transition-colors text-sm mt-2">
            <LogOut className="w-4 h-4" />Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 flex flex-col h-screen overflow-hidden">
        <header className="mb-6 shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-['Outfit'] text-[var(--color-text-main)]">{getGreeting()}</h1>
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
              
              <div className={`absolute px-4 py-2 bg-black/80 backdrop-blur-md text-white text-sm font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-white/20 z-50
                ${parseInt(h.top) > 80 ? 'bottom-full mb-3' : 'top-full mt-3'}
                ${parseInt(h.left) > 80 ? 'right-0' : parseInt(h.left) < 20 ? 'left-0' : 'left-1/2 -translate-x-1/2'}
              `}>
                {h.label}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Join Colegio Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-background)] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-1">Unirse a Institución</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Ingresa el código que te entregó tu colegio para activar tu licencia.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Ej: A1B2C3" 
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full text-center tracking-widest uppercase font-bold text-lg p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-primary)] text-[var(--color-text-main)]"
                />
              </div>

              {joinError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl text-center">
                  {joinError}
                </div>
              )}

              <button 
                onClick={handleJoinColegio}
                disabled={isJoining || !inviteCode.trim()}
                className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isJoining ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Validar y Unirme'}
              </button>
            </div>
          </div>
        </div>
      )}
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
