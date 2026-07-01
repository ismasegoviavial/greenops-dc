import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wand2, Image as ImageIcon, LayoutTemplate, LogOut,
  Moon, Sun, Settings, BookOpen, Sparkles, Download,
  Heart, FileText
} from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { generateImage } from '../services/api';
import LockerIcon from './LockerIcon';

const ESTILOS = [
  { value: 'watercolor', label: 'Acuarela', emoji: '🎨' },
  { value: 'flat illustration', label: 'Ilustración plana', emoji: '✨' },
  { value: 'realistic', label: 'Realista', emoji: '✨' },
  { value: 'cartoon', label: 'Cartoon', emoji: '✨' },
  { value: 'infographic', label: 'Infografía', emoji: '✨' },
  { value: 'sketch', label: 'Boceto', emoji: '✍️' },
];

const ASPECTOS = [
  { value: '1:1', label: 'Cuadrado (1024x1024)' },
  { value: '16:9', label: 'Panorámico (1792x1024)' },
  { value: '9:16', label: 'Vertical (1024x1792)' },
];

export default function GaleriaVisual() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('educamax-theme') === 'dark');
  const [form, setForm] = useState({ prompt: '', estilo: 'flat illustration', aspecto: '1:1' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

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
    });
    return () => unsub();
  }, [navigate]);

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  const handleGenerate = async () => {
    if (!form.prompt.trim()) return;
    setIsGenerating(true);
    setError('');
    try {
      const url = await generateImage({ prompt: form.prompt, style: form.estilo, aspectRatio: form.aspecto });
      const newImg = { url, prompt: form.prompt, estilo: form.estilo, aspecto: form.aspecto, id: Date.now() };
      setImages(prev => [newImg, ...prev]);
      if (auth.currentUser) {
        await addDoc(collection(db, 'materials'), {
          userId: auth.currentUser.uid,
          tipo: 'imagen',
          titulo: form.prompt.slice(0, 60),
          imageUrl: url,
          prompt: form.prompt,
          estilo: form.estilo,
          favorito: false,
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      setError(`Error al generar imagen: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (url, name) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `educamax-${name || 'imagen'}.png`;
    a.click();
  };

  const initials = profile ? `${profile.nombre?.[0] || ''}${profile.apellido?.[0] || ''}`.toUpperCase() : 'F';

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col md:flex-row">
      {/* Sidebar */}
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
          <button className="w-full flex items-center gap-3 px-3 py-2.5 font-semibold rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]"><ImageIcon className="w-5 h-5" />Galería Visual IA</button>
          <button onClick={() => navigate('/repositorio')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors"><LockerIcon className="w-5 h-5" />Mi Casillero</button>
          <button onClick={() => navigate('/agenda')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <Heart className="w-5 h-5" />Mi Agenda
          </button>
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

      {/* Main */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-sm font-medium text-[var(--color-primary)] uppercase tracking-wider">Creador Visual IA</span>
          </div>
          <h1 className="text-3xl font-bold font-['Outfit'] text-[var(--color-text-main)]">
            Galería Visual IA, <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">{profile?.nombre || 'Fernanda'}</span>
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">Genera imágenes educativas con DALL-E 3 en segundos</p>
        </header>

        {/* Form */}
        <div className="max-w-2xl mb-8">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-3xl p-6 shadow-lg space-y-5">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">Describe la imagen que necesitas</label>
              <textarea value={form.prompt} onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
                placeholder="Ej: Mapa conceptual del sistema solar con planetas y órbitas, estilo educativo colorido..."
                rows={3} className="w-full p-4 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 resize-none text-[var(--color-text-main)]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">Estilo visual</label>
              <div className="grid grid-cols-3 gap-2">
                {ESTILOS.map(e => (
                  <button key={e.value} onClick={() => setForm(f => ({ ...f, estilo: e.value }))}
                    className={`flex flex-col items-center gap-1 px-3 py-3 rounded-2xl border-2 text-xs font-medium transition-all ${form.estilo === e.value ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'border-[var(--color-border)]/50 text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/40'}`}>
                    <span className="text-xl">{e.emoji}</span>
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">Proporción</label>
              <div className="flex gap-2">
                {ASPECTOS.map(a => (
                  <button key={a.value} onClick={() => setForm(f => ({ ...f, aspecto: a.value }))}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${form.aspecto === a.value ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'border-[var(--color-border)]/50 text-[var(--color-text-muted)]'}`}>
                    {a.label}<br/><span className="font-normal opacity-60">{a.value}</span>
                  </button>
                ))}
              </div>
            </div>
            {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}
            <button onClick={handleGenerate} disabled={!form.prompt.trim() || isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
              {isGenerating ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generando con DALL-E 3...</>
              ) : (
                <><Sparkles className="w-5 h-5" />Generar Imagen</>
              )}
            </button>
          </div>
        </div>

        {/* Gallery */}
        {images.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Imágenes generadas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map(img => (
                <div key={img.id} className="bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-2xl overflow-hidden shadow-md group">
                  <div className="relative aspect-square">
                    <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <button onClick={() => handleDownload(img.url, img.prompt.slice(0, 20))}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" /> Descargar
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[var(--color-text-main)] font-medium line-clamp-2">{img.prompt}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{img.estilo} · {img.aspecto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
