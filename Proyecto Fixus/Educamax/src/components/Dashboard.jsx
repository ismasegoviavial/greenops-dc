import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wand2, LogOut, ChevronLeft, Sparkles, FileText, Upload, File, BookOpen, LayoutTemplate, Image as ImageIcon, Heart, Monitor, Sun, Moon, Settings, Calendar, BellRing
} from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { generateEvaluacion } from '../services/api';
import ResultsViewer from './ResultsViewer';
import LockerIcon from './LockerIcon';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { NIVELES, getAsignaturasPorNivel, getBasesCurriculares, getObjetivosAprendizaje } from '../data/curriculum';
import { logActividadColegio } from '../utils/analytics';

// pdfjs worker configuration for browser usage
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const TIPOS = [
  { value: 'alternativas', label: 'Selección única', desc: 'Preguntas con 4 opciones', emoji: '🔘' },
  { value: 'verdadero_falso', label: 'Verdadero / Falso', desc: 'Afirmaciones para evaluar comprensión', emoji: '✔️' },
  { value: 'desarrollo', label: 'Desarrollo', desc: 'Respuestas abiertas y argumentativas', emoji: '✍️' },
  { value: 'mixto', label: 'Mixto', desc: 'Combina alternativas y desarrollo', emoji: '🔀' },
  { value: 'completar', label: 'Completar', desc: 'Textos con espacios en blanco', emoji: '✨' },
  { value: 'personalizado', label: 'Personalizado', desc: 'Elige exactamente cuántas de cada tipo', emoji: '⚙️' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStatus, setGeneratingStatus] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState(null);
  
  const [form, setForm] = useState({
    asignatura: '', asignaturaCustom: '', baseCurricular: 'General',
    nivel: '', 
    tema: '', objetivos: '', indicadores: '',
    fileName: '', textoBase: '',
    tipoPreguntas: '', cantidad: 10, dificultad: 'medio', instrucciones: '',
    distribucion: { alternativas: 0, verdadero_falso: 0, desarrollo: 0, completar: 0 }
  });

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('educamax-theme') === 'dark');
  const [hasCurriculumUpdate, setHasCurriculumUpdate] = useState(true); // Simulamos que hay una alerta para mostrarle a la usuaria

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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setForm(f => ({ ...f, fileName: file.name, textoBase: '' }));
    
    const MAX_CHARS = 20000; 

    try {
      if (file.name.endsWith('.txt')) {
        const text = await file.text();
        setForm(f => ({ ...f, textoBase: text.slice(0, MAX_CHARS) }));
      } else if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const res = await mammoth.extractRawText({ arrayBuffer });
        setForm(f => ({ ...f, textoBase: res.value.slice(0, MAX_CHARS) }));
      } else if (file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          if (fullText.length >= MAX_CHARS) break;
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(item => item.str).join(' ') + '\n';
        }
        setForm(f => ({ ...f, textoBase: fullText.slice(0, MAX_CHARS) }));
      } else {
        alert('Formato no soportado. Sube un archivo .txt, .pdf o .docx');
        setForm(f => ({ ...f, fileName: '', textoBase: '' }));
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      alert('Hubo un error al extraer el texto.');
      setForm(f => ({ ...f, fileName: '', textoBase: '' }));
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    setForm(f => ({ ...f, fileName: '', textoBase: '' }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratingStatus("Iniciando Agentes...");
    setResult(null);
    try {
      const asig = form.asignatura === 'Otra' ? form.asignaturaCustom : form.asignatura;
      const content = await generateEvaluacion({
        asignatura: asig, 
        nivel: form.nivel, 
        tema: form.tema,
        objetivos: form.objetivos,
        indicadores: form.indicadores,
        textoBase: form.textoBase,
        tipoPreguntas: form.tipoPreguntas, 
        cantidad: form.cantidad,
        dificultad: form.dificultad, 
        instrucciones: form.instrucciones,
        distribucion: form.tipoPreguntas === 'personalizado' ? form.distribucion : null
      }, setGeneratingStatus);
      setResult(content);
      if (auth.currentUser) {
        await addDoc(collection(db, 'materials'), {
          userId: auth.currentUser.uid,
          tipo: 'evaluacion',
          titulo: `${asig} - ${form.tema || 'Evaluación'}`,
          asignatura: asig,
          nivel: form.nivel,
          content: content.formaA,
          formaB: content.formaB,
          createdAt: new Date()
        });
        
        // Registrar en Analytics B2B si pertenece a un colegio
        if (profile?.colegioId) {
          await logActividadColegio(profile.colegioId, 'evaluacion', asig, form.nivel, form.objetivos);
        }
      }
    } catch (error) {
      console.error('Generación falló:', error);
      alert('Hubo un error al generar la evaluación. Revisa tu conexión.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = () => {
    const { asignatura, asignaturaCustom, nivel, tema, objetivos, tipoPreguntas, cantidad, distribucion } = form;
    if (!asignatura || (asignatura === 'Otra' && !asignaturaCustom)) return false;
    if (!nivel || !tema || !objetivos || !tipoPreguntas || cantidad <= 0) return false;
    
    if (tipoPreguntas === 'personalizado') {
      const sum = Object.values(distribucion).reduce((a, b) => a + (parseInt(b) || 0), 0);
      if (sum !== parseInt(cantidad)) return false;
    }
    return true;
  };

  const asig = form.asignatura === 'Otra' ? form.asignaturaCustom : form.asignatura;
  const initials = profile?.nombre ? `${profile.nombre.charAt(0)}${profile.apellido?.charAt(0) || ''}`.toUpperCase() : 'F';

  return (
    <div className="flex h-screen bg-[var(--color-background)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-72 flex flex-col shrink-0 border-r border-[var(--color-border)]/30 hidden md:flex" style={{ background: 'var(--sidebar-bg)' }}>
        <div className="p-6 flex items-center gap-3 border-b border-[var(--color-border)]/20">
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] p-2.5 rounded-xl shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl font-['Outfit'] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              Educamax Creator
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">De profesores, con 🖤 para profesores.</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 px-3 mt-2">Herramientas IA</div>
          <button onClick={() => navigate('/home')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <BookOpen className="w-5 h-5" />Inicio
          </button>
          
          <button onClick={() => navigate('/rubricas')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <FileText className="w-5 h-5" />Crear Rúbrica
          </button>
          <button onClick={() => navigate('/planificaciones')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <Calendar className="w-5 h-5" />Planificaciones
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
            <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 px-3">Administración</div>
            {hasCurriculumUpdate && (
              <button 
                onClick={() => {
                  alert('Sincronizando con el Mineduc y leyendo PDFs... ¡Base de datos actualizada!');
                  setHasCurriculumUpdate(false);
                }}
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 font-medium rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors mb-2 border border-red-500/20 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <BellRing className="w-5 h-5" />
                  <span className="text-sm font-bold">¡Actualización Mineduc!</span>
                </div>
              </button>
            )}
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
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 font-medium rounded-xl transition-colors text-sm mt-2">
            <LogOut className="w-4 h-4" />Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {result ? (
          <div className="py-10 px-4">
            <ResultsViewer 
              content={result} 
              titulo={`Evaluación: ${asig} - ${form.tema || ''}`} 
              tipo="evaluacion" 
              onNew={() => setResult(null)} 
            />
          </div>
        ) : (
          <div className="pb-24">
            {/* Header Fijo Superior */}
            <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]/30 sticky top-0 z-40 shadow-sm">
              <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate('/home')} className="p-2.5 rounded-xl border border-[var(--color-border)]/30 text-[var(--color-text-muted)] hover:bg-[var(--color-background)] transition-colors md:hidden">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div>
              <h1 className="text-xl font-bold font-['Outfit'] text-[var(--color-text-main)] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
                Creador de Evaluaciones
              </h1>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Diseña pruebas personalizadas en una sola página</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8 mt-6">

        {/* Bloque 1: Materia y Nivel */}
        <section className="bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-3xl p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
            <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] p-2 rounded-lg text-xl">📚</span>
            Materia y Nivel
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">Nivel / Curso</label>
              <select 
                value={form.nivel} 
                onChange={(e) => setForm(f => ({ ...f, nivel: e.target.value, asignatura: '', baseCurricular: 'General', objetivos: '' }))}
                className="w-full p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-accent)] text-[var(--color-text-main)] appearance-none cursor-pointer"
              >
                <option value="" disabled>Selecciona un nivel o curso</option>
                {NIVELES.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">Asignatura</label>
              <select 
                value={form.asignatura} 
                onChange={(e) => {
                  const bases = getBasesCurriculares(form.nivel, e.target.value);
                  setForm(f => ({ ...f, asignatura: e.target.value, baseCurricular: bases[0] || 'General', objetivos: '' }));
                }}
                disabled={!form.nivel}
                className="w-full p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-primary)] text-[var(--color-text-main)] appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="" disabled>{form.nivel ? 'Selecciona una asignatura' : 'Selecciona un nivel primero'}</option>
                {getAsignaturasPorNivel(form.nivel).map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
                <option value="Otra">Otra</option>
              </select>
              {form.asignatura === 'Otra' && (
                <input type="text" placeholder="Escribe tu asignatura..." value={form.asignaturaCustom} onChange={e => setForm(f => ({ ...f, asignaturaCustom: e.target.value }))}
                  className="w-full mt-3 p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]" />
              )}
            </div>
          </div>

          {form.nivel && form.asignatura && form.asignatura !== 'Otra' && getBasesCurriculares(form.nivel, form.asignatura).length > 1 && (
            <div className="mt-6 pt-6 border-t border-[var(--color-border)]/30">
              <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">Base Curricular / Programa</label>
              <select 
                value={form.baseCurricular} 
                onChange={(e) => setForm(f => ({ ...f, baseCurricular: e.target.value, objetivos: '' }))}
                className="w-full p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-primary)] text-[var(--color-text-main)] appearance-none cursor-pointer"
              >
                {getBasesCurriculares(form.nivel, form.asignatura).map(bc => (
                  <option key={bc} value={bc}>{bc}</option>
                ))}
              </select>
            </div>
          )}

          {/* Selector de OA - siempre visible después de elegir nivel y asignatura */}
          {form.nivel && form.asignatura && form.asignatura !== 'Otra' && (
            <div className="mt-6 pt-6 border-t border-[var(--color-border)]/30">
              <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-1">
                Objetivo de Aprendizaje (Mineduc)
              </label>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">Selecciona un OA oficial para alinear tu evaluación al currículo nacional.</p>
              {getObjetivosAprendizaje(form.nivel, form.asignatura, form.baseCurricular).length > 0 ? (
                <select 
                  value={form.objetivos}
                  onChange={e => setForm(f => ({ ...f, objetivos: e.target.value }))}
                  className="w-full p-4 bg-[var(--color-primary)]/5 border-2 border-[var(--color-primary)]/30 rounded-xl outline-none focus:border-[var(--color-primary)] text-[var(--color-text-main)] text-sm cursor-pointer"
                >
                  <option value="">-- Seleccionar OA del Mineduc --</option>
                  {getObjetivosAprendizaje(form.nivel, form.asignatura, form.baseCurricular).map(oa => (
                    <option key={oa.id} value={`${oa.id}: ${oa.texto}`}>{oa.id} – {oa.texto}</option>
                  ))}
                </select>
              ) : (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm text-amber-700 dark:text-amber-300">
                  ⚠️ Aún no hay OAs cargados para <strong>{form.asignatura}</strong> en <strong>{form.nivel}</strong>. Puedes escribir tu OA manualmente abajo.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Bloque 2: Tema, Objetivos e Indicadores */}
        <section className="bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-3xl p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
            <span className="bg-[var(--color-accent)]/10 text-[var(--color-accent)] p-2 rounded-lg text-xl">🎯</span>
            Tema y Objetivos
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">Tema Principal de la Prueba</label>
              <input type="text" placeholder="Ej: La Célula y sus Organelos" value={form.tema} onChange={e => setForm(f => ({ ...f, tema: e.target.value }))}
                className="w-full p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-primary)] text-[var(--color-text-main)] placeholder-gray-400" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-1">
                Objetivos de Aprendizaje <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-[var(--color-text-muted)] mb-2">El OA seleccionado arriba aparecerá aquí. También puedes escribirlo o editarlo manualmente.</p>

              <textarea placeholder="Selecciona un OA del Mineduc en la sección anterior, o escribe el tuyo aquí..." value={form.objetivos} onChange={e => setForm(f => ({ ...f, objetivos: e.target.value }))}
                className="w-full p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl h-24 resize-none outline-none focus:border-[var(--color-primary)] text-[var(--color-text-main)] placeholder-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-1">
                Indicadores de Logro <span className="text-[var(--color-text-muted)] font-normal">(Opcional)</span>
              </label>
              <textarea placeholder="Ej: Identifican la función de la mitocondria y el núcleo..." value={form.indicadores} onChange={e => setForm(f => ({ ...f, indicadores: e.target.value }))}
                className="w-full p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl h-24 resize-none outline-none focus:border-[var(--color-primary)] text-[var(--color-text-main)] placeholder-gray-400" />
            </div>
          </div>
        </section>

        {/* Bloque 3: Subida de Material */}
        <section className="bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-3xl p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-2 flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-500 p-2 rounded-lg text-xl">📎</span>
            Material de Apoyo <span className="text-sm font-normal text-[var(--color-text-muted)]">(Opcional)</span>
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-6 ml-11">
            Si subes un documento, la evaluación se construirá <strong>exclusivamente</strong> en base a su contenido.
          </p>
          
          <div className="ml-11">
            {form.fileName ? (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-main)]">{form.fileName}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Texto extraído correctamente</p>
                  </div>
                </div>
                <button onClick={removeFile} className="text-xs text-red-500 font-semibold hover:underline px-2 py-1">Quitar</button>
              </div>
            ) : (
              <div 
                onClick={() => !isExtracting && fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-colors ${
                  isExtracting ? 'border-emerald-500/30 bg-emerald-500/5 cursor-wait' : 'border-[var(--color-border)]/50 hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer bg-[var(--color-background)]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  {isExtracting ? (
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 text-emerald-500" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[var(--color-text-main)]">
                    {isExtracting ? 'Procesando documento...' : 'Haz clic para subir material de apoyo'}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">Soporta PDF, DOCX o TXT</p>
                </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.docx,.txt" className="hidden" />
          </div>
        </section>

        {/* Bloque 4: Configuración de Preguntas */}
        <section className="bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-3xl p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
            <span className="bg-purple-500/10 text-purple-500 p-2 rounded-lg text-xl">📋</span>
            Tipo y Formato de Preguntas
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {TIPOS.map(t => (
              <button key={t.value} onClick={() => setForm(f => ({ ...f, tipoPreguntas: t.value }))}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  form.tipoPreguntas === t.value ? 'border-purple-500 bg-purple-500/10 shadow-sm' : 'border-[var(--color-border)]/50 hover:border-purple-500/50 hover:bg-[var(--color-background)]'
                }`}>
                <div className="text-2xl mb-2">{t.emoji}</div>
                <p className={`font-semibold text-sm ${form.tipoPreguntas === t.value ? 'text-purple-600 dark:text-purple-400' : 'text-[var(--color-text-main)]'}`}>{t.label}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-snug">{t.desc}</p>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 border-t border-[var(--color-border)]/30 pt-8">
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">Cantidad Total de Preguntas</label>
              <input type="number" min="1" value={form.cantidad} onChange={e => setForm(f => ({ ...f, cantidad: e.target.value === '' ? '' : parseInt(e.target.value, 10) }))}
                className="w-full p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl outline-none focus:border-purple-500 text-[var(--color-text-main)] text-xl font-bold text-center" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">Nivel de Dificultad</label>
              <div className="grid grid-cols-3 gap-2">
                {['básico', 'medio', 'avanzado'].map(d => (
                  <button key={d} onClick={() => setForm(f => ({ ...f, dificultad: d }))}
                    className={`p-3 rounded-xl border text-sm font-semibold capitalize transition-all ${
                      form.dificultad === d ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'border-[var(--color-border)]/50 text-[var(--color-text-muted)] hover:border-purple-500/50'
                    }`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {form.tipoPreguntas === 'personalizado' && (
            <div className="mt-8 bg-purple-500/5 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[var(--color-text-main)]">Distribución Personalizada</h3>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${Object.values(form.distribucion).reduce((a,b)=>a+(parseInt(b)||0),0) === parseInt(form.cantidad) ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                  Total: {Object.values(form.distribucion).reduce((a,b)=>a+(parseInt(b)||0),0)} / {form.cantidad}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: 'alternativas', label: 'Selección', icon: '🔘' },
                  { id: 'verdadero_falso', label: 'V/F', icon: '✔️' },
                  { id: 'desarrollo', label: 'Desarrollo', icon: '✍️' },
                  { id: 'completar', label: 'Completar', icon: '✨' }
                ].map(item => (
                  <div key={item.id}>
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1 flex items-center gap-1">{item.icon} {item.label}</label>
                    <input type="number" min="0" value={form.distribucion[item.id]} 
                      onChange={e => setForm(f => ({ ...f, distribucion: { ...f.distribucion, [item.id]: parseInt(e.target.value) || 0 } }))}
                      className="w-full p-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg outline-none focus:border-purple-500 text-[var(--color-text-main)] text-center font-bold" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-[var(--color-border)]/30 pt-8">
            <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">Instrucciones Adicionales para la IA (Opcional)</label>
            <textarea placeholder="Ej: Las preguntas de desarrollo deben incluir una rúbrica breve..." value={form.instrucciones} onChange={e => setForm(f => ({ ...f, instrucciones: e.target.value }))}
              className="w-full p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl h-24 resize-none outline-none focus:border-purple-500 text-[var(--color-text-main)] placeholder-gray-400" />
          </div>
        </section>

        {/* Generar Action */}
        <div className="py-6 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={!isFormValid() || isGenerating}
            className="px-10 py-5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-bold text-lg rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:pointer-events-none disabled:transform-none flex items-center gap-3"
          >
            {isGenerating ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{generatingStatus || 'Mágia en proceso...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>Generar Evaluación con IA</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
    )}
  </main>
</div>
  );
}
