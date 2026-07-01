import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, LayoutTemplate, FileText, Settings, Wand2, ArrowLeft, ArrowRight, Upload, 
  CheckSquare, BarChart, Plus, Heart, Image as ImageIcon, CheckCircle, PenTool, X, ShieldAlert,
  Loader2, Calendar
} from 'lucide-react';
import { generateRubrica } from '../services/api';
import ResultsViewer from './ResultsViewer';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { NIVELES, getAsignaturasPorNivel, getBasesCurriculares, getObjetivosAprendizaje } from '../data/curriculum';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { logActividadColegio } from '../utils/analytics';

// pdfjs worker configuration for browser usage
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const INSTRUMENTOS = [
  { value: 'Rúbrica analítica', label: 'Rúbrica Analítica', desc: 'Evalúa múltiples criterios por separado con niveles de desempeño (Ej. Excelente, Bueno, Regular). Ideal para tareas complejas.', icon: '📊' },
  { value: 'Lista de cotejo', label: 'Lista de Cotejo', desc: 'Evalúa la presencia o ausencia de características específicas (Sí/No). Ideal para procesos o requisitos estrictos.', icon: '✅' },
  { value: 'Escala de valoración', label: 'Escala de Valoración', desc: 'Asigna valores cualitativos o numéricos al desempeño general. Ideal para observaciones actitudinales o participativas.', icon: '⭐' }
];

export default function RubricaCreator() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) setProfile(snap.data());
        } catch (e) {
          console.error(e);
        }
      }
    });
    return () => unsub();
  }, []);
  
  const [form, setForm] = useState({
    instrumento: 'Rúbrica analítica',
    nivel: '',
    asignatura: '',
    asignaturaCustom: '',
    baseCurricular: 'General',
    objetivos: '',
    pregunta: '',
    fileName: '',
    puntaje: 20,
    criterios: ''
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm(f => ({ ...f, fileName: file.name, pregunta: 'Extrayendo texto del documento...' }));
    
    try {
      if (file.name.endsWith('.txt')) {
        const text = await file.text();
        setForm(f => ({ ...f, pregunta: text.slice(0, 3000) })); // Limitar tamaño
      } else if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setForm(f => ({ ...f, pregunta: result.value.slice(0, 3000) }));
      } else if (file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) { // Extract first 3 pages max
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(item => item.str).join(' ') + '\n';
        }
        setForm(f => ({ ...f, pregunta: fullText.slice(0, 3000) }));
      } else {
        alert('Formato no soportado. Sube un archivo .txt, .pdf o .docx');
        setForm(f => ({ ...f, fileName: '', pregunta: '' }));
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      alert('Hubo un error al extraer el texto. Puedes pegarlo manualmente.');
      setForm(f => ({ ...f, pregunta: '' }));
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isStepValid = () => {
    if (currentStep === 1) return true; // Default selected
    if (currentStep === 2) {
      if (!form.nivel || !form.asignatura || (form.asignatura === 'Otra' && !form.asignaturaCustom)) return false;
      return form.pregunta.trim().length > 10;
    }
    if (currentStep === 3) return form.puntaje > 0;
    return true;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    try {
      const generatedText = await generateRubrica(form);
      setResult(generatedText);
      
      const asig = form.asignatura === 'Otra' ? form.asignaturaCustom : form.asignatura;
      if (auth.currentUser) {
        await addDoc(collection(db, 'materials'), {
          userId: auth.currentUser.uid,
          tipo: 'rubrica',
          titulo: `${asig} - ${form.instrumento}`,
          asignatura: asig,
          nivel: form.nivel,
          content: generatedText,
          createdAt: new Date()
        });
        
        if (profile?.colegioId) {
          await logActividadColegio(profile.colegioId, 'rubrica', asig, form.nivel, form.objetivos);
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error al generar. Intenta nuevamente.');
    }
    setIsGenerating(false);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col h-auto md:h-screen sticky top-0 shrink-0">
          <div className="p-6 flex items-center gap-3 border-b border-[var(--color-border)]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
              <span className="text-white font-black text-xl">e.</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--color-text-main)]">educamax</span>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 px-3">Herramientas IA</div>
            <button onClick={() => navigate('/home')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
              <BookOpen className="w-5 h-5" />Inicio
            </button>
            <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
              <Wand2 className="w-5 h-5" />Crear Evaluación
            </button>
            
            <button className="w-full flex items-center gap-3 px-3 py-2.5 font-semibold rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <FileText className="w-5 h-5" />Crear Rúbrica
            </button>
            <button onClick={() => navigate('/planificaciones')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
              <Calendar className="w-5 h-5" />Planificaciones
            </button>
            <button onClick={() => navigate('/galeria')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
              <ImageIcon className="w-5 h-5" />Galería Visual IA
            </button>
            <button onClick={() => navigate('/repositorio')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
              <BookOpen className="w-5 h-5" />Mi Casillero
            </button>
            <button onClick={() => navigate('/agenda')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
              <Heart className="w-5 h-5" />Mi Agenda
            </button>
          </nav>
        </aside>
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
          <ResultsViewer 
            content={result} 
            titulo={form.instrumento}
            tipo="rubrica" 
            onNew={() => { setResult(null); setCurrentStep(1); setForm({ instrumento: 'Rúbrica analítica', pregunta: '', fileName: '', puntaje: 20, criterios: '' }); }} 
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col h-auto md:h-screen sticky top-0 shrink-0 hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-[var(--color-border)]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
            <span className="text-white font-black text-xl">e.</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-[var(--color-text-main)]">educamax</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 px-3">Herramientas IA</div>
          <button onClick={() => navigate('/home')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <BookOpen className="w-5 h-5" />Inicio
          </button>
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <Wand2 className="w-5 h-5" />Crear Evaluación
          </button>
          
          <button className="w-full flex items-center gap-3 px-3 py-2.5 font-semibold rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <FileText className="w-5 h-5" />Crear Rúbrica
          </button>
          <button onClick={() => navigate('/galeria')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <ImageIcon className="w-5 h-5" />Galería Visual IA
          </button>
          <button onClick={() => navigate('/repositorio')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <BookOpen className="w-5 h-5" />Mi Casillero
          </button>
          <button onClick={() => navigate('/agenda')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <Heart className="w-5 h-5" />Mi Agenda
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 md:p-10 lg:p-12">
          
          <div className="mb-10 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-6 shadow-inner border border-[var(--color-primary)]/20">
              <PenTool className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-[var(--color-text-main)] tracking-tight mb-3">
              Creador de Rúbricas
            </h1>
            <p className="text-[var(--color-text-muted)] text-lg max-w-xl mx-auto">
              Genera instrumentos de evaluación precisos para tus actividades o preguntas de desarrollo en segundos.
            </p>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-3xl p-6 md:p-10 shadow-2xl animate-fade-in-up">
            {isGenerating ? (
              <div className="py-20 text-center">
                <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin mx-auto mb-6" />
                <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Diseñando instrumento de evaluación...</h3>
                <p className="text-[var(--color-text-muted)]">Analizando criterios, escalando puntajes y estructurando niveles de logro.</p>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-8">
                  {[1, 2, 3].map(step => (
                    <div key={step} className={`h-2 flex-1 rounded-full transition-all duration-500 ${step <= currentStep ? 'bg-[var(--color-primary)] shadow-sm' : 'bg-[var(--color-border)]/30'}`} />
                  ))}
                </div>

                <div className="min-h-[300px]">
                  {/* Step 1: Instrument Type */}
                  {currentStep === 1 && (
                    <div className="animate-fade-in">
                      <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-5">¿Qué instrumento de evaluación necesitas?</h2>
                      <div className="grid gap-4">
                        {INSTRUMENTOS.map(inst => (
                          <button key={inst.value} onClick={() => setForm(f => ({ ...f, instrumento: inst.value }))}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all ${form.instrumento === inst.value ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-border)]/50 hover:border-[var(--color-primary)]/40'}`}>
                            <span className="text-3xl">{inst.icon}</span>
                            <div>
                              <p className="font-bold text-sm text-[var(--color-text-main)]">{inst.label}</p>
                              <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">{inst.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Question / Activity Source */}
                  {currentStep === 2 && (
                    <div className="animate-fade-in space-y-6">
                      <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Contexto Curricular y Actividad</h2>
                      
                      {/* Selectores de Curriculum */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-1">Nivel / Curso <span className="text-red-500">*</span></label>
                          <select 
                            value={form.nivel} 
                            onChange={(e) => setForm(f => ({ ...f, nivel: e.target.value, asignatura: '', baseCurricular: 'General', objetivos: '' }))}
                            className="w-full p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-accent)] text-[var(--color-text-main)] text-sm appearance-none cursor-pointer"
                          >
                            <option value="" disabled>Selecciona un nivel</option>
                            {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-1">Asignatura <span className="text-red-500">*</span></label>
                          <select 
                            value={form.asignatura} 
                            onChange={(e) => {
                              const bases = getBasesCurriculares(form.nivel, e.target.value);
                              setForm(f => ({ ...f, asignatura: e.target.value, baseCurricular: bases[0] || 'General', objetivos: '' }));
                            }}
                            disabled={!form.nivel}
                            className="w-full p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-primary)] text-[var(--color-text-main)] text-sm appearance-none cursor-pointer disabled:opacity-50"
                          >
                            <option value="" disabled>{form.nivel ? 'Selecciona una asignatura' : 'Selecciona nivel primero'}</option>
                            {getAsignaturasPorNivel(form.nivel).map(a => <option key={a} value={a}>{a}</option>)}
                            <option value="Otra">Otra</option>
                          </select>
                          {form.asignatura === 'Otra' && (
                            <input type="text" placeholder="Escribe tu asignatura..." value={form.asignaturaCustom} onChange={e => setForm(f => ({ ...f, asignaturaCustom: e.target.value }))}
                              className="w-full mt-2 p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]" />
                          )}
                        </div>
                      </div>

                      {form.nivel && form.asignatura && form.asignatura !== 'Otra' && getBasesCurriculares(form.nivel, form.asignatura).length > 1 && (
                        <div className="animate-fade-in mb-4">
                          <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-1">Base Curricular / Programa</label>
                          <select 
                            value={form.baseCurricular} 
                            onChange={(e) => setForm(f => ({ ...f, baseCurricular: e.target.value, objetivos: '' }))}
                            className="w-full p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-primary)] text-[var(--color-text-main)] text-sm appearance-none cursor-pointer"
                          >
                            {getBasesCurriculares(form.nivel, form.asignatura).map(bc => (
                              <option key={bc} value={bc}>{bc}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-1">Objetivo de Aprendizaje (Opcional)</label>
                        {getObjetivosAprendizaje(form.nivel, form.asignatura, form.baseCurricular).length > 0 && (
                          <select 
                            onChange={e => {
                              const val = e.target.value;
                              if (val) setForm(f => ({ ...f, objetivos: val }));
                            }}
                            className="w-full p-3 mb-2 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/30 rounded-xl outline-none focus:border-[var(--color-primary)] text-[var(--color-text-main)] text-sm appearance-none cursor-pointer"
                          >
                            <option value="">-- Seleccionar OA Oficial del Mineduc --</option>
                            {getObjetivosAprendizaje(form.nivel, form.asignatura, form.baseCurricular).map(oa => (
                              <option key={oa.id} value={`${oa.id}: ${oa.texto}`}>{oa.id} - {oa.texto.substring(0, 60)}...</option>
                            ))}
                          </select>
                        )}
                        <textarea placeholder="Ej: OA 1: Comprender la estructura celular..." value={form.objetivos} onChange={e => setForm(f => ({ ...f, objetivos: e.target.value }))}
                          className="w-full p-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl h-16 resize-none outline-none focus:border-[var(--color-primary)] text-[var(--color-text-main)] text-sm placeholder-gray-400" />
                      </div>

                      <div className="border-t border-[var(--color-border)]/50 pt-6">
                        <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-1">Pregunta o Actividad a Evaluar <span className="text-red-500">*</span></label>
                        <p className="text-xs text-[var(--color-text-muted)] mb-3">Escribe la instrucción o sube un documento (PDF, Word, TXT) que contenga la actividad.</p>
                        
                        <div className="flex items-center gap-3 mb-4">
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileUpload} 
                          accept=".pdf,.doc,.docx,.txt" 
                          className="hidden" 
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-background)] border-2 border-[var(--color-border)] border-dashed rounded-xl text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5 transition-all"
                        >
                          <Upload className="w-4 h-4" /> 
                          {form.fileName ? 'Cambiar Documento' : 'Subir Documento'}
                        </button>
                        {form.fileName && (
                          <span className="text-xs text-[var(--color-primary)] font-medium px-3 py-1 bg-[var(--color-primary)]/10 rounded-lg flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5" />
                            {form.fileName}
                            <button onClick={() => setForm(f => ({ ...f, fileName: '', pregunta: '' }))} className="ml-1 hover:text-red-500"><X className="w-3.5 h-3.5"/></button>
                          </span>
                        )}
                      </div>

                      <textarea 
                        value={form.pregunta} 
                        onChange={e => setForm(f => ({ ...f, pregunta: e.target.value }))}
                        placeholder="Ej: Escribe un ensayo argumentativo de 500 palabras sobre las causas del cambio climático, citando al menos 3 fuentes confiables..."
                        rows={6} 
                        className="w-full p-4 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 resize-none text-[var(--color-text-main)]" 
                      />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Settings */}
                  {currentStep === 3 && (
                    <div className="animate-fade-in space-y-8">
                      <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-5">Configuración de la Evaluación</h2>
                      
                      <div>
                        <label className="block text-sm font-bold text-[var(--color-text-main)] mb-2">Puntaje Total Esperado</label>
                        <p className="text-xs text-[var(--color-text-muted)] mb-3">La rúbrica o escala distribuirá este puntaje matemáticamente.</p>
                        <div className="flex items-center gap-4">
                          <input 
                            type="range" 
                            min="5" 
                            max="100" 
                            step="5"
                            value={form.puntaje} 
                            onChange={e => setForm(f => ({ ...f, puntaje: parseInt(e.target.value) }))}
                            className="flex-1 accent-[var(--color-primary)]"
                          />
                          <span className="text-2xl font-black text-[var(--color-primary)] w-16 text-center">{form.puntaje} pts</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-[var(--color-text-main)] mb-2">Criterios a Evaluar (Opcional)</label>
                        <p className="text-xs text-[var(--color-text-muted)] mb-3">Si dejas esto en blanco, la IA deducirá automáticamente los mejores criterios para evaluar la actividad.</p>
                        <textarea 
                          value={form.criterios} 
                          onChange={e => setForm(f => ({ ...f, criterios: e.target.value }))}
                          placeholder="Ej: Ortografía, Coherencia, Uso de fuentes bibliográficas..."
                          rows={3} 
                          className="w-full p-4 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 resize-none text-[var(--color-text-main)]" 
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-8 pt-8 border-t border-[var(--color-border)]/30">
                  <button 
                    onClick={() => setCurrentStep(s => s - 1)} 
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)]'}`}
                  >
                    <ArrowLeft className="w-4 h-4" /> Atrás
                  </button>
                  
                  {currentStep < 3 ? (
                    <button 
                      onClick={() => setCurrentStep(s => s + 1)} 
                      disabled={!isStepValid()}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      Siguiente <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleGenerate}
                      disabled={!isStepValid()}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white hover:opacity-90 transition-all shadow-xl shadow-[var(--color-primary)]/20 disabled:opacity-50 hover:scale-[1.02]"
                    >
                      <Wand2 className="w-5 h-5" /> Generar {form.instrumento}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
