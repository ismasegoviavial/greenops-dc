import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, LayoutTemplate, FileText, Settings, Wand2, ArrowLeft, ArrowRight, Upload, 
  CheckSquare, BarChart, Plus, Heart, Image as ImageIcon, Calendar, Clock, Target, AlertCircle, Loader2
} from 'lucide-react';
import { generatePlanificacion } from '../services/api';
import ResultsViewer from './ResultsViewer';
import { NIVELES, getAsignaturasPorNivel, getBasesCurriculares, getObjetivosAprendizaje } from '../data/curriculum';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { logActividadColegio } from '../utils/analytics';

const TIPOS_PLAN = [
  { value: 'Clase única', label: 'Clase Única (1 sesión)', desc: 'Planifica una sola clase con su respectivo Inicio, Desarrollo y Cierre.', icon: '🕐' },
  { value: 'Unidad Corta', label: 'Unidad Corta (3-4 sesiones)', desc: 'Planifica un bloque de clases conectadas para un solo objetivo.', icon: '📚' }
];

const DURACIONES = [
  { value: '1 hora (45 min)', label: '1 hora pedagógica (45 min)' },
  { value: '2 horas (90 min)', label: '2 horas pedagógicas (90 min)' },
  { value: '3 horas (135 min)', label: '3 horas pedagógicas (135 min)' },
  { value: '4 horas (180 min)', label: '4 horas pedagógicas (180 min)' }
];

export default function PlannerCreator() {
  const navigate = useNavigate();
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
    tipoPlan: 'Clase única',
    nivel: '',
    asignatura: '',
    asignaturaCustom: '',
    baseCurricular: 'General',
    objetivos: '',
    tema: '',
    actitudes: '',
    duracion: '2 horas (90 min)'
  });

  const isStepValid = () => {
    if (currentStep === 1) return true;
    if (currentStep === 2) {
      if (!form.nivel || !form.asignatura || (form.asignatura === 'Otra' && !form.asignaturaCustom)) return false;
      return true;
    }
    if (currentStep === 3) return form.tema.trim().length > 3;
    return true;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    try {
      const generatedText = await generatePlanificacion(form);
      setResult(generatedText);
      
      const asig = form.asignatura === 'Otra' ? form.asignaturaCustom : form.asignatura;
      if (auth.currentUser) {
        await addDoc(collection(db, 'materials'), {
          userId: auth.currentUser.uid,
          tipo: 'planificacion',
          titulo: `${asig} - ${form.tema || 'Planificación'}`,
          asignatura: asig,
          nivel: form.nivel,
          content: generatedText,
          createdAt: new Date()
        });
        
        if (profile?.colegioId) {
          await logActividadColegio(profile.colegioId, 'planificacion', asig, form.nivel, form.objetivos);
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error al generar la planificación. Intenta nuevamente.');
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
            <button onClick={() => navigate('/rubrica')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
              <FileText className="w-5 h-5" />Crear Rúbrica
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 font-semibold rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Calendar className="w-5 h-5" />Planificaciones
            </button>
          </nav>
        </aside>
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
          <ResultsViewer 
            content={result} 
            titulo={`Planificación: ${form.tema}`}
            tipo="planificacion" 
            onNew={() => { setResult(null); setCurrentStep(1); setForm({ ...form, tema: '', actitudes: '' }); }} 
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col md:flex-row">
      {/* Sidebar */}
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
          <button onClick={() => navigate('/rubrica')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <FileText className="w-5 h-5" />Crear Rúbrica
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 font-semibold rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <Calendar className="w-5 h-5" />Planificaciones
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-semibold mb-4">
              <Calendar className="w-4 h-4" /> Creador Inteligente
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-main)] mb-3 font-['Outfit'] tracking-tight">Planificaciones de Clases</h1>
            <p className="text-[var(--color-text-muted)] text-lg">Diseña clases estructuradas con Inicio, Desarrollo y Cierre en segundos.</p>
          </header>

          <div className="flex gap-2 mb-8 bg-[var(--color-surface)] p-2 rounded-2xl border border-[var(--color-border)] w-fit">
            {[1, 2, 3].map((step) => (
              <div 
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm transition-all
                  ${currentStep === step ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20' : 
                    currentStep > step ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 
                    'bg-[var(--color-background)] text-[var(--color-text-muted)]'}`}
              >
                {step}
              </div>
            ))}
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 shadow-sm">
            
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-1 flex items-center gap-2">
                    <LayoutTemplate className="w-6 h-6 text-[var(--color-primary)]" />
                    Tipo de Planificación
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-sm mb-6">¿Qué necesitas planificar hoy?</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TIPOS_PLAN.map((tipo) => (
                    <button
                      key={tipo.value}
                      onClick={() => setForm(f => ({ ...f, tipoPlan: tipo.value }))}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        form.tipoPlan === tipo.value 
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-4 ring-[var(--color-primary)]/10' 
                          : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] bg-[var(--color-background)]'
                      }`}
                    >
                      <div className="text-4xl mb-4">{tipo.icon}</div>
                      <h4 className="font-bold text-[var(--color-text-main)] mb-2">{tipo.label}</h4>
                      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{tipo.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-1 flex items-center gap-2">
                    <Target className="w-6 h-6 text-[var(--color-primary)]" />
                    Contexto Curricular
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-sm mb-6">Alinea la planificación al currículum nacional.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">Nivel / Curso</label>
                    <select 
                      value={form.nivel} 
                      onChange={(e) => setForm(f => ({ ...f, nivel: e.target.value, asignatura: '', baseCurricular: 'General', objetivos: '' }))}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-3.5 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all font-medium appearance-none"
                    >
                      <option value="">-- Seleccionar Nivel --</option>
                      {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">Asignatura</label>
                    <select 
                      value={form.asignatura} 
                      onChange={(e) => {
                        const bases = getBasesCurriculares(form.nivel, e.target.value);
                        setForm(f => ({ ...f, asignatura: e.target.value, baseCurricular: bases[0] || 'General', objetivos: '' }));
                      }}
                      disabled={!form.nivel}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-3.5 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all font-medium appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">-- Seleccionar Asignatura --</option>
                      {form.nivel && getAsignaturasPorNivel(form.nivel).map(a => <option key={a} value={a}>{a}</option>)}
                      <option value="Otra">Otra (Personalizada)</option>
                    </select>
                  </div>
                </div>

                {form.asignatura === 'Otra' && (
                  <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">Escribe la Asignatura</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Taller de Robótica"
                      value={form.asignaturaCustom}
                      onChange={(e) => setForm(f => ({ ...f, asignaturaCustom: e.target.value }))}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-3.5 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all font-medium"
                    />
                  </div>
                )}

                {form.nivel && form.asignatura && form.asignatura !== 'Otra' && getBasesCurriculares(form.nivel, form.asignatura).length > 1 && (
                  <div className="space-y-2 animate-in fade-in duration-300">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">Base Curricular / Programa</label>
                    <select 
                      value={form.baseCurricular} 
                      onChange={(e) => setForm(f => ({ ...f, baseCurricular: e.target.value, objetivos: '' }))}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-3.5 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all font-medium appearance-none"
                    >
                      {getBasesCurriculares(form.nivel, form.asignatura).map(bc => (
                        <option key={bc} value={bc}>{bc}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <label className="text-sm font-semibold text-[var(--color-text-main)]">Objetivo de Aprendizaje (Mineduc)</label>
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">Selecciona un OA oficial (opcional si es "Otra").</p>
                  <select 
                    value={form.objetivos} 
                    onChange={(e) => setForm(f => ({ ...f, objetivos: e.target.value }))}
                    disabled={!form.asignatura || form.asignatura === 'Otra'}
                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-3.5 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all font-medium appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Seleccionar OA del Mineduc --</option>
                    {form.nivel && form.asignatura && form.asignatura !== 'Otra' && 
                      getObjetivosAprendizaje(form.nivel, form.asignatura, form.baseCurricular).map((oa, index) => (
                        <option key={index} value={`${oa.id} - ${oa.texto}`}>{oa.id} - {oa.texto}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-1 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[var(--color-primary)]" />
                    Detalles de la Clase
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-sm mb-6">Ingresa el tema específico de esta planificación.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">Tema o Foco de la Clase *</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Las partes de la planta y sus funciones"
                      value={form.tema}
                      onChange={(e) => setForm(f => ({ ...f, tema: e.target.value }))}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-3.5 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)]">Duración</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                      <select 
                        value={form.duracion} 
                        onChange={(e) => setForm(f => ({ ...f, duracion: e.target.value }))}
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl pl-12 pr-4 py-3.5 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all font-medium appearance-none"
                      >
                        {DURACIONES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--color-text-main)] flex items-center justify-between">
                      <span>Actitudes / OAT</span>
                      <span className="text-xs font-normal text-[var(--color-text-muted)] bg-[var(--color-background)] px-2 py-0.5 rounded-md border border-[var(--color-border)]">Opcional</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ej: Trabajar de forma colaborativa"
                      value={form.actitudes}
                      onChange={(e) => setForm(f => ({ ...f, actitudes: e.target.value }))}
                      className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-3.5 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl mt-6 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--color-text-main)]">
                    La IA estructurará la clase en <strong>Inicio</strong> (Motivación y conocimientos previos), <strong>Desarrollo</strong> (Actividades principales) y <strong>Cierre</strong> (Síntesis y ticket de salida).
                  </p>
                </div>
              </div>
            )}

            <div className="mt-10 flex justify-between items-center pt-6 border-t border-[var(--color-border)]/50">
              {currentStep > 1 ? (
                <button 
                  onClick={() => setCurrentStep(s => s - 1)}
                  className="px-6 py-3 font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-background)] rounded-xl transition-all"
                >
                  Atrás
                </button>
              ) : <div></div>}
              
              {currentStep < 3 ? (
                <button 
                  onClick={() => setCurrentStep(s => s + 1)}
                  disabled={!isStepValid()}
                  className="flex items-center gap-2 px-8 py-3 bg-[var(--color-text-main)] text-[var(--color-background)] font-bold rounded-xl hover:bg-[var(--color-text-main)]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-text-main)]/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  Siguiente Paso <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handleGenerate}
                  disabled={!isStepValid() || isGenerating}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Creando Planificación...</>
                  ) : (
                    <><Wand2 className="w-5 h-5" /> Generar Planificación Mágica</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
