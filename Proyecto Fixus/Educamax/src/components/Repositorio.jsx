import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wand2, Image as ImageIcon, LayoutTemplate, LogOut,
  Moon, Sun, Settings, BookOpen, Trash2, Eye, Pencil,
  Search, Filter, Star, X, Check, Clock, Heart, FileText } from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection, query, where, orderBy, getDocs,
  deleteDoc, doc, updateDoc, getDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import ResultsViewer from './ResultsViewer';
import LockerIcon from './LockerIcon';

const TYPE_LABELS = {
  evaluacion: { label: 'Evaluación', color: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]', dot: 'bg-[var(--color-primary)]' },
  imagen: { label: 'Imagen IA', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400', dot: 'bg-purple-500' },
};

export default function Repositorio() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('educamax-theme') === 'dark');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [filterFav, setFilterFav] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    if (isDarkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('educamax-theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('educamax-theme', 'light'); }
  }, [isDarkMode]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { navigate('/'); return; }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) setProfile(snap.data());
        else setProfile({ nombre: 'Fernanda', apellido: '' });
      } catch { setProfile({ nombre: 'Fernanda', apellido: '' }); }
      await loadItems(user.uid);
    });
    return () => unsub();
  }, [navigate]);

  const loadItems = async (uid) => {
    setLoading(true);
    try {
      const q = query(collection(db, 'materials'), where('userId', '==', uid), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { setItems([]); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este ítem?')) return;
    await deleteDoc(doc(db, 'materials', id));
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleFav = async (id, current) => {
    await updateDoc(doc(db, 'materials', id), { favorito: !current });
    setItems(prev => prev.map(i => i.id === id ? { ...i, favorito: !current } : i));
  };

  const handleRename = async (id) => {
    if (!editTitle.trim()) return;
    await updateDoc(doc(db, 'materials', id), { titulo: editTitle.trim() });
    setItems(prev => prev.map(i => i.id === id ? { ...i, titulo: editTitle.trim() } : i));
    setEditing(null);
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  const filtered = items.filter(i => {
    const matchSearch = !search || i.titulo?.toLowerCase().includes(search.toLowerCase()) || i.asignatura?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'todos' || i.tipo === filterType;
    const matchFav = !filterFav || i.favorito;
    return matchSearch && matchType && matchFav;
  });

  const initials = profile ? `${profile.nombre?.[0] || ''}${profile.apellido?.[0] || ''}`.toUpperCase() : 'F';

  if (viewing) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] p-6 md:p-10">
        <button onClick={() => setViewing(null)} className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] mb-6 text-sm font-medium transition-colors">
          ← Volver al Casillero
        </button>
        <ResultsViewer content={viewing.contenido} titulo={viewing.titulo} tipo={viewing.tipo} onNew={() => setViewing(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col md:flex-row">
      <aside className="w-full md:w-72 flex flex-col shrink-0 border-r border-[var(--color-border)]/30" style={{ background: 'var(--sidebar-bg)' }}>
        <div className="p-6 flex items-center gap-3 border-b border-[var(--color-border)]/20">
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] p-2.5 rounded-xl shadow-lg"><BookOpen className="w-6 h-6 text-white" /></div>
          <div>
            <h2 className="font-bold text-xl font-['Outfit'] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">Educamax Creator</h2>
            <p className="text-xs text-[var(--color-text-muted)]">De profesores, con 🖤 para profesores.</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 px-3">Herramientas IA</div>
          <button onClick={() => navigate('/home')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors"><BookOpen className="w-5 h-5" />Inicio</button>
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors"><Wand2 className="w-5 h-5" />Crear Evaluación</button>
          
          <button onClick={() => navigate('/galeria')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors"><ImageIcon className="w-5 h-5" />Galería Visual IA</button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 font-semibold rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]"><LockerIcon className="w-5 h-5" />Mi Casillero</button>
          <button onClick={() => navigate('/agenda')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors"><Heart className="w-5 h-5" />Mi Agenda</button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-between px-3 py-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 font-medium rounded-xl transition-colors">
            <div className="flex items-center gap-3">{isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</div>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 font-medium rounded-xl cursor-not-allowed"><Settings className="w-5 h-5" />Ajustes de Cuenta</button>
        </nav>
        <div className="p-4 border-t border-[var(--color-border)]/20">
          {profile && (
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-[var(--color-primary)]/5 mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-sm shrink-0">{initials}</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-main)] truncate">{profile.nombre} {profile.apellido}</p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">{profile.establecimiento || 'Educamax Creator'}</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 font-medium rounded-xl transition-colors text-sm"><LogOut className="w-4 h-4" />Cerrar Sesión</button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <LockerIcon className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-sm font-medium text-[var(--color-primary)] uppercase tracking-wider">Archivo Personal</span>
          </div>
          <h1 className="text-3xl font-bold font-['Outfit'] text-[var(--color-text-main)]">Mi Casillero</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Todo el material que has creado, en un solo lugar</p>
        </header>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-2xl px-4 py-2.5 flex-1 min-w-48">
            <Search className="w-4 h-4 text-[var(--color-text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por título o asignatura..." className="bg-transparent text-sm outline-none text-[var(--color-text-main)] flex-1" />
          </div>
          <div className="flex gap-2">
            {['todos', 'evaluacion', 'imagen'].map(t => (
              <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all border ${filterType === t ? 'bg-[var(--color-primary)] text-white border-transparent' : 'border-[var(--color-border)]/50 text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/40'}`}>
                {t === 'todos' ? 'Todos' : TYPE_LABELS[t]?.label}
              </button>
            ))}
            <button onClick={() => setFilterFav(!filterFav)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1 ${filterFav ? 'bg-yellow-400 text-white border-transparent' : 'border-[var(--color-border)]/50 text-[var(--color-text-muted)]'}`}>
              <Star className="w-3.5 h-3.5" /> Favoritos
            </button>
          </div>
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            <div className="w-8 h-8 border-2 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin mx-auto mb-4" />
            Cargando tu casillero...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-[var(--color-text-muted)] font-medium">
              {items.length === 0 ? 'Aún no has creado nada. ¡Empieza generando una evaluación!' : 'Ningún resultado con esos filtros.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map(item => {
              const tl = TYPE_LABELS[item.tipo] || { label: item.tipo, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };
              const date = item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('es-CL') : '—';
              return (
                <div key={item.id} className="bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all group">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${tl.dot}`} />
                  <div className="flex-1 min-w-0">
                    {editing === item.id ? (
                      <div className="flex items-center gap-2">
                        <input value={editTitle} onChange={e => setEditTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRename(item.id)}
                          className="flex-1 px-3 py-1.5 bg-[var(--color-background)] border border-[var(--color-primary)]/40 rounded-xl text-sm outline-none text-[var(--color-text-main)]" autoFocus />
                        <button onClick={() => handleRename(item.id)} className="p-1.5 bg-green-500 text-white rounded-lg"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditing(null)} className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <>
                        <p className="font-semibold text-sm text-[var(--color-text-main)] truncate">{item.titulo || 'Sin título'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tl.color}`}>{tl.label}</span>
                          {item.asignatura && <span className="text-xs text-[var(--color-text-muted)]">{item.asignatura}</span>}
                          <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-0.5"><Clock className="w-3 h-3" />{date}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleFav(item.id, item.favorito)} className={`p-2 rounded-xl transition-colors ${item.favorito ? 'text-yellow-400 bg-yellow-400/10' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/5'}`}>
                      <Star className="w-4 h-4" fill={item.favorito ? 'currentColor' : 'none'} />
                    </button>
                    {item.contenido && (
                      <button onClick={() => setViewing(item)} className="p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/5 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => { setEditing(item.id); setEditTitle(item.titulo || ''); }} className="p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-primary)]/5 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
