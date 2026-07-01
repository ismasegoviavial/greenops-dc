import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Settings, BookOpen, Heart, Calendar,
  Clock, Plus, Trash2, Check, Bell, BellOff,
  ChevronRight, ChevronLeft, Sparkles, BarChart2,
  Smile, Meh, Frown, AlertCircle, Sun, Moon, X
} from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection, addDoc, query, where, orderBy,
  getDocs, doc, getDoc, updateDoc, deleteDoc,
  serverTimestamp, limit
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { generateText } from '../services/api';
import LockerIcon from './LockerIcon';

// ── Utilidades ──────────────────────────────────────────
function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

function pickByDay(arr) {
  return arr[dayOfYear() % arr.length];
}

// ── Pool de tips TCC (40+) ─────────────────────────────
const TCC_TIPS_POOL = [
  { title: 'Respiración 4-7-8', body: 'Inhala 4 seg, retén 7, exhala 8. Repite 3 veces. Activa tu sistema nervioso parasimpático.', emoji: '✨' },
  { title: 'Registro de pensamientos', body: 'Escribe el pensamiento que te preocupa y pregúntate: ¿qué evidencia tengo de que es verdad? ¿Hay otra interpretación?', emoji: '✨' },
  { title: 'Técnica del semáforo', body: 'Rojo: para. Amarillo: respira y evalúa. Verde: actúa. Aplica esto ante cualquier tensión del día.', emoji: '🚦' },
  { title: 'Activación conductual', body: 'Haz una pequeña actividad placentera aunque no tengas ganas. El estado de ánimo sigue a la acción.', emoji: '🎯' },
  { title: 'Defusión cognitiva', body: 'Cuando tengas un pensamiento negativo, di: "Estoy teniendo el pensamiento de que..." Eso crea distancia.', emoji: '✨ ' },
  { title: 'Gratitud concreta', body: 'Anota 3 cosas específicas de hoy por las que estés agradecida. La especificidad potencia el efecto.', emoji: '✨' },
  { title: 'Mindfulness del momento', body: 'Nombra 5 cosas que ves, 4 que escuchas, 3 que tocas. Ancla tu mente al presente.', emoji: '🌿' },
  { title: 'Reestructuración cognitiva', body: 'Identifica si estás catastrofizando. Pregúntate: ¿qué es lo peor real que puede pasar? ¿Puedo manejarlo?', emoji: '🔄' },
  { title: 'Autocuidado básico', body: 'Hoy prioriza agua, comida y 10 min de movimiento. El cuerpo bien cuidado regula mejor las emociones.', emoji: '💧' },
  { title: 'Límites saludables', body: 'Un "no" dicho a tiempo protege tu energía para lo que realmente importa. Practicarlo es autocuidado.', emoji: '✨' },
  { title: 'Programación de preocupaciones', body: 'Destina 15 min al día para preocuparte conscientemente. Fuera de ese horario, pospón el pensamiento.', emoji: '⏰' },
  { title: 'Validación emocional', body: 'Di: "Es comprensible sentirme así dadas las circunstancias." Las emociones no necesitan justificarse.', emoji: '💛' },
  { title: 'Resolución de problemas', body: 'Divide el problema grande en pasos pequeños. Resuelve solo el próximo paso, no todo a la vez.', emoji: '🧩' },
  { title: 'Contacto social', body: 'Envía un mensaje a alguien que aprecias. La conexión social es un regulador emocional poderoso.', emoji: '👥' },
  { title: 'Movimiento consciente', body: 'Camina 10 minutos prestando atención a cada paso. El movimiento libera endorfinas y aclara la mente.', emoji: '🚶' },
  { title: 'Pausa de compasión', body: 'Coloca la mano en el pecho y di: "Este es un momento difícil. Merezco bondad." La autocompasión no es debilidad.', emoji: '🤲' },
  { title: 'Revisión de logros', body: 'Lista 3 cosas que lograste esta semana, por pequeñas que sean. El cerebro tiende a ignorarlas.', emoji: '✨' },
  { title: 'Técnica STOP', body: 'Stop: para. Take a breath: respira. Observe: observa qué piensas/sientes. Proceed: continúa con claridad.', emoji: '✋' },
  { title: 'Externalizar la crítica', body: 'Imagina que el crítico interno es una persona externa. ¿Le hablarías así a alguien que quieres? Habla diferente.', emoji: '🪞' },
  { title: 'Ritual de cierre del día', body: 'Al terminar, escribe 1 cosa que salió bien, 1 que aprendiste, 1 que dejas ir. Cierra el día con intención.', emoji: '🌙' },
  { title: 'Expansión del presente', body: 'La ansiedad vive en el futuro. Pregúntate: ¿en este exacto momento, estoy bien? Suele ser que sí.', emoji: '✨' },
  { title: 'Acción opuesta', body: 'Cuando la emoción te pida evitar algo, haz lo opuesto de forma pequeña. La evitación amplifica el miedo.', emoji: '🔀' },
  { title: 'Autoeficacia', body: 'Recuerda un momento difícil que superaste. Ya tienes evidencia de que puedes con situaciones complejas.', emoji: '💪' },
  { title: 'Flexibilidad cognitiva', body: 'Hay pocas situaciones de solo blanco o negro. Pregúntate: ¿qué grises existen aquí? Amplía la perspectiva.', emoji: '🎨' },
  { title: 'Hidratación y pausa', body: 'Levántate, toma agua y mira por la ventana 2 minutos. Micro-pausas restauran la concentración y el ánimo.', emoji: '🪟' },
  { title: 'Escribir para procesar', body: 'Escribe sin filtro 5 minutos sobre lo que sientes. No lo releas. Solo exteriorizar ya alivia la carga emocional.', emoji: '📓' },
  { title: 'Perspectiva temporal', body: 'Pregúntate: ¿esto importará en 5 años? Si no, es una señal de que tu sistema de alerta está sobreactivado.', emoji: '🔭' },
  { title: 'Conexión con valores', body: '¿Lo que haces hoy se alinea con lo que valoras? Actuar desde valores reduce el agotamiento por vacío de sentido.', emoji: '🧭' },
  { title: 'Técnica del observador', body: 'Imagínate viendo tu situación desde afuera, como un observador neutral. ¿Qué le dirías a esa persona?', emoji: '✨' },
  { title: 'Placer anticipado', body: 'Planea algo pequeño y agradable para esta tarde o mañana. La anticipación positiva mejora el estado de ánimo presente.', emoji: '✨' },
  { title: 'Gestión de la energía', body: 'Identifica las horas del día donde tienes más energía. Reserva esas horas para lo más importante o difícil.', emoji: '⚡' },
  { title: 'Compasión por el rol', body: 'Ser docente implica un desgaste real. Reconocer eso no es queja, es honestidad. Mereces apoyo igual que tus estudiantes.', emoji: '✨' },
  { title: 'Microdescansos activos', body: 'Cada 90 minutos, toma 5 min de descanso activo: estira, muévete, respira. El rendimiento aumenta, no disminuye.', emoji: '🔋' },
  { title: 'Narración compasiva', body: 'Cuenta tu día con la misma amabilidad con que le contarías la historia a una amiga. Sin juicio, con comprensión.', emoji: '📖' },
  { title: 'Aceptación radical', body: 'Algunas cosas no se pueden cambiar hoy. Aceptarlas no es rendirse, es liberar energía para lo que sí puedes controlar.', emoji: '🌊' },
  { title: 'Pequeño placer sensorial', body: 'Disfruta conscientemente algo: un té, música, una vela. Activar los sentidos con intención calma el sistema nervioso.', emoji: '☕' },
  { title: 'Reconocimiento del esfuerzo', body: 'Di en voz alta: "Hoy me esforcé y eso tiene valor." El esfuerzo merece reconocimiento aunque el resultado no sea perfecto.', emoji: '🌟' },
  { title: 'Triángulo CBT', body: 'Pensamientos → emociones → conductas están conectados. Cambiar uno cambia los otros. Hoy trabaja el pensamiento.', emoji: '🔺' },
  { title: 'Límites de pantalla', body: 'Los últimos 30 min antes de dormir sin pantallas mejoran la calidad del sueño y el estado emocional del día siguiente.', emoji: '📵' },
  { title: 'Pregunta socrática', body: '¿Qué prueba tienes de que este pensamiento es 100% cierto? ¿Podría haber otra explicación igual de válida?', emoji: '🤔' },
];

// ── Opciones del flujo de bienestar ─────────────────────
const OVERWHELM_OPTIONS = [
  { id: 'alumnos', label: 'Manejo de estudiantes', emoji: '✨' },
  { id: 'planif', label: 'Planificación pendiente', emoji: '📋' },
  { id: 'tiempo', label: 'Falta de tiempo', emoji: '⏳' },
  { id: 'admin', label: 'Tareas administrativas', emoji: '📂' },
  { id: 'familia', label: 'Situación familiar', emoji: '✨ ' },
  { id: 'colegas', label: 'Relaciones laborales', emoji: '👥' },
  { id: 'salud', label: 'Salud propia', emoji: '💊' },
  { id: 'economia', label: 'Preocupaciones económicas', emoji: '💰' },
  { id: 'otros', label: 'Otros (escribe aquí)', emoji: '✍️', custom: true },
];

const ACTIVITY_OPTIONS = [
  { id: 'caminar', label: 'Salir a caminar', emoji: '🚶' },
  { id: 'musica', label: 'Escuchar música', emoji: '🎵' },
  { id: 'leer', label: 'Leer algo placentero', emoji: '📚' },
  { id: 'cocinar', label: 'Cocinar algo rico', emoji: '✨' },
  { id: 'respirar', label: 'Respiración consciente', emoji: '✨' },
  { id: 'amiga', label: 'Hablar con alguien cercano', emoji: '💬' },
  { id: 'naturaleza', label: 'Estar en contacto con la naturaleza', emoji: '🌿' },
  { id: 'escribir', label: 'Escribir / Journaling', emoji: '📓' },
  { id: 'descansar', label: 'Descansar sin culpa', emoji: '✨' },
  { id: 'otro', label: 'Otra actividad (escribe aquí)', emoji: '✍️', custom: true },
];

const MOOD_ICONS = {
  high: { icon: Smile, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-300', label: 'Bien' },
  mid:  { icon: Meh,   color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-300', label: 'Regular' },
  low:  { icon: Frown, color: 'text-red-500',   bg: 'bg-red-50 dark:bg-red-900/20',   border: 'border-red-300',   label: 'Mal' },
};

// ── Sidebar compartida ───────────────────────────────────
function Sidebar({ profile, isDarkMode, setIsDarkMode, navigate, handleLogout, active }) {
  const initials = profile ? `${profile.nombre?.[0] || ''}${profile.apellido?.[0] || ''}`.toUpperCase() : 'F';
  return (
    <aside className="w-full md:w-72 flex flex-col shrink-0 border-r border-[var(--color-border)]/30" style={{ background: 'var(--sidebar-bg)' }}>
      <div className="p-6 flex items-center gap-3 border-b border-[var(--color-border)]/20">
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] p-2.5 rounded-xl shadow-lg"><BookOpen className="w-6 h-6 text-white" /></div>
        <div>
          <h2 className="font-bold text-xl font--outfit bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">Educamax Creator</h2>
          <p className="text-xs text-[var(--color-text-muted)]">De profesores, con 🖤 para profesores.</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 px-3">Herramientas IA</div>
        <button onClick={() => navigate('/home')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors"><BookOpen className="w-5 h-5" />Inicio</button>
        <button onClick={() => navigate('/repositorio')} className="w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors"><LockerIcon className="w-5 h-5" />Mi Casillero</button>
        <button className={`w-full flex items-center gap-3 px-3 py-2.5 font-semibold rounded-xl ${active === 'agenda' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5'} transition-colors`}>
          <Heart className="w-5 h-5" />Mi Agenda
        </button>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-between px-3 py-2.5 text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 font-medium rounded-xl transition-colors">
          <div className="flex items-center gap-3">{isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</div>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 font-medium rounded-xl cursor-not-allowed"><Settings className="w-5 h-5" />Ajustes</button>
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
  );
}

// ══════════════════════════════════════════════════════════
// TAB: BIENESTAR
// ══════════════════════════════════════════════════════════
function TabBienestar({ user, profile }) {
  const [phase, setPhase] = useState('greeting'); // greeting | mood | overwhelm | activities | result
  const [mood, setMood] = useState(null);
  const [selectedOverwhelm, setSelectedOverwhelm] = useState([]);
  const [customOverwhelm, setCustomOverwhelm] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [customActivity, setCustomActivity] = useState('');
  const [aiAdvice, setAiAdvice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  const dailyTip = pickByDay(TCC_TIPS_POOL);
  const todayStr = new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });

  const toggleOverwhelm = (id) => {
    setSelectedOverwhelm(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  const toggleActivity = (id) => {
    setSelectedActivities(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const buildContext = () => {
    const moodLabel = mood === 'high' ? 'bien' : mood === 'mid' ? 'regular' : 'mal';
    const overwhelmLabels = selectedOverwhelm.map(id => {
      if (id === 'otros') return customOverwhelm || 'algo que no supo describir';
      return OVERWHELM_OPTIONS.find(o => o.id === id)?.label || id;
    });
    const activityLabels = selectedActivities.map(id => {
      if (id === 'otro') return customActivity || 'una actividad propia';
      return ACTIVITY_OPTIONS.find(a => a.id === id)?.label || id;
    });
    return { moodLabel, overwhelmLabels, activityLabels };
  };

  const generateAdvice = async () => {
    setIsGenerating(true);
    const { moodLabel, overwhelmLabels, activityLabels } = buildContext();
    const hasCustom = (selectedOverwhelm.includes('otros') && customOverwhelm) ||
                      (selectedActivities.includes('otro') && customActivity);

    const system = `Eres un psicólogo experto en Terapia Cognitivo-Conductual (TCC) especializado en bienestar docente.
Hablas en segunda persona femenino, con calidez y cercanía. Eres empática y evitas el tono clínico frío.
Generas consejos prácticos, específicos y realizables para el momento actual de la docente.
Siempre integras en tu consejo lo que la docente escribió de forma personalizada.`;

    const user_prompt = `La docente se siente ${moodLabel} hoy.
${overwhelmLabels.length ? `Le abruma o preocupa: ${overwhelmLabels.join(', ')}.` : ''}
${activityLabels.length ? `Planea hacer hoy: ${activityLabels.join(', ')}.` : ''}
${hasCustom ? `Detalle importante que escribió ella misma: "${customOverwhelm || customActivity}"` : ''}

Genera un consejo personalizado de TCC para ella hoy. Que sea:
- Específico para lo que ella expresó (especialmente si escribió algo propio, menciona eso directamente)
- Empático y cálido (no clínico)
- Práctico (algo que pueda hacer hoy mismo)
- Corto (máximo 4-5 oraciones)
- Termina con una frase de aliento genuina`;

    try {
      const advice = await generateText(system, user_prompt);
      setAiAdvice(advice);
      await saveEntry(advice, { moodLabel, overwhelmLabels, activityLabels });
    } catch {
      setAiAdvice('Recuerda que cada día que llegas al aula, independiente de cómo te sientes, estás haciendo algo valioso. Hoy, permítete ser amable contigo misma. Un paso a la vez es suficiente. 💛');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveEntry = async (advice, context) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'agendaEntries'), {
        userId: user.uid,
        date: new Date().toDateString(),
        mood,
        overwhelm: selectedOverwhelm,
        customOverwhelm,
        activities: selectedActivities,
        customActivity,
        advice,
        context,
        createdAt: serverTimestamp(),
      });
      setSaved(true);
    } catch {}
  };

  const reset = () => {
    setPhase('greeting'); setMood(null); setSelectedOverwhelm([]);
    setCustomOverwhelm(''); setSelectedActivities([]); setCustomActivity('');
    setAiAdvice(''); setSaved(false);
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in">

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-3xl p-6 shadow-lg">

        {/* GREETING */}
        {phase === 'greeting' && (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">🌿</div>
            <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Hola, {profile?.nombre || 'Fernanda'}</h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-6 leading-relaxed">
              Este es tu espacio seguro. Tómate un momento para conectar contigo misma. ¿Cómo estás llegando hoy?
            </p>
            <button onClick={() => setPhase('mood')} className="w-full py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" /> Iniciar check-in
            </button>
          </div>
        )}

        {/* MOOD */}
        {phase === 'mood' && (
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-1">¿Cómo estás hoy?</h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-5">Sé honesta contigo misma. No hay respuesta correcta o incorrecta.</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {Object.entries(MOOD_ICONS).map(([key, val]) => {
                const Icon = val.icon;
                return (
                  <button key={key} onClick={() => setMood(key)}
                    className={`flex flex-col items-center gap-2 py-5 px-3 rounded-2xl border-2 transition-all ${mood === key ? `${val.bg} ${val.border} shadow-md -translate-y-0.5` : 'border-[var(--color-border)]/50 hover:border-[var(--color-border)]'}`}>
                    <Icon className={`w-8 h-8 ${val.color}`} />
                    <span className="text-sm font-semibold text-[var(--color-text-main)]">{val.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setPhase('greeting')} className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"><ChevronLeft className="w-4 h-4" />Atrás</button>
              <button onClick={() => setPhase('overwhelm')} disabled={!mood} className="flex items-center gap-1 bg-[var(--color-primary)] disabled:opacity-40 text-white font-bold px-5 py-2 rounded-2xl text-sm transition-all">
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* OVERWHELM */}
        {phase === 'overwhelm' && (
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-1">
              {mood === 'high' ? '¿Qué está yendo bien hoy?' : '¿Qué te pesa o preocupa?'}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">Puedes seleccionar más de una opción.</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {OVERWHELM_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => toggleOverwhelm(opt.id)}
                  className={`flex items-center gap-2 px-3 py-3 rounded-2xl border-2 text-left text-xs font-medium transition-all ${selectedOverwhelm.includes(opt.id) ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'border-[var(--color-border)]/50 text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/40'}`}>
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
            {selectedOverwhelm.includes('otros') && (
              <textarea value={customOverwhelm} onChange={e => setCustomOverwhelm(e.target.value)}
                placeholder="Cuéntame qué te abruma o preocupa hoy... El sistema te dará un consejo personalizado basado en lo que escribas."
                rows={3} className="w-full p-3 bg-[var(--color-background)] border border-[var(--color-primary)]/40 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 resize-none text-[var(--color-text-main)] mb-3" />
            )}
            <div className="flex justify-between">
              <button onClick={() => setPhase('mood')} className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"><ChevronLeft className="w-4 h-4" />Atrás</button>
              <button onClick={() => setPhase('activities')} disabled={selectedOverwhelm.length === 0}
                className="flex items-center gap-1 bg-[var(--color-primary)] disabled:opacity-40 text-white font-bold px-5 py-2 rounded-2xl text-sm">
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ACTIVITIES */}
        {phase === 'activities' && (
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-1">¿Qué puedes hacer hoy para cuidarte?</h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">Elige lo que sientes que puedes hacer. Uno es suficiente.</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {ACTIVITY_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => toggleActivity(opt.id)}
                  className={`flex items-center gap-2 px-3 py-3 rounded-2xl border-2 text-left text-xs font-medium transition-all ${selectedActivities.includes(opt.id) ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'border-[var(--color-border)]/50 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40'}`}>
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
            {selectedActivities.includes('otro') && (
              <input value={customActivity} onChange={e => setCustomActivity(e.target.value)}
                placeholder="¿Qué actividad tienes en mente? (El consejo lo incluirá)"
                className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-accent)]/40 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 text-[var(--color-text-main)] mb-3" />
            )}
            <div className="flex justify-between">
              <button onClick={() => setPhase('overwhelm')} className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"><ChevronLeft className="w-4 h-4" />Atrás</button>
              <button onClick={async () => { setPhase('result'); await generateAdvice(); }} disabled={selectedActivities.length === 0}
                className="flex items-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] disabled:opacity-40 text-white font-bold px-5 py-2 rounded-2xl text-sm shadow-lg hover:opacity-90">
                <Sparkles className="w-4 h-4" /> Ver mi consejo
              </button>
            </div>
          </div>
        )}

        {/* RESULT */}
        {phase === 'result' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
              <h2 className="text-lg font-bold text-[var(--color-text-main)]">Tu consejo personalizado</h2>
            </div>
            {isGenerating ? (
              <div className="flex flex-col items-center py-8 gap-3">
                <div className="w-8 h-8 border-2 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin" />
                <p className="text-sm text-[var(--color-text-muted)]">Preparando tu consejo...</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 border border-[var(--color-primary)]/20 rounded-2xl p-5 mb-5">
                  <p className="text-sm text-[var(--color-text-main)] leading-relaxed">{aiAdvice}</p>
                </div>
                <div className="bg-[var(--color-background)] rounded-2xl p-4 mb-5 space-y-2">
                  <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Tu check-in de hoy</p>
                  <div className="flex items-center gap-2">
                    {(() => { const m = MOOD_ICONS[mood]; const Icon = m.icon; return <Icon className={`w-4 h-4 ${m.color}`} />; })()}
                    <span className="text-xs text-[var(--color-text-main)] font-medium">Estado: {MOOD_ICONS[mood]?.label}</span>
                  </div>
                  {selectedOverwhelm.length > 0 && (
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Pesa: {selectedOverwhelm.map(id => id === 'otros' ? (customOverwhelm || 'Otros') : OVERWHELM_OPTIONS.find(o => o.id === id)?.label).join(', ')}
                    </p>
                  )}
                  {selectedActivities.length > 0 && (
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Hará: {selectedActivities.map(id => id === 'otro' ? (customActivity || 'Otra actividad') : ACTIVITY_OPTIONS.find(a => a.id === id)?.label).join(', ')}
                    </p>
                  )}
                  {saved && <p className="text-xs text-green-500 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Registrado en tu historial</p>}
                </div>
                <button onClick={reset} className="w-full py-3 border-2 border-[var(--color-border)]/50 text-[var(--color-text-muted)] font-bold rounded-2xl hover:bg-[var(--color-primary)]/5 transition-colors text-sm">
                  Nuevo check-in
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// TAB: HISTORIAL
// ══════════════════════════════════════════════════════════
function TabHistorial({ user }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const q = query(
          collection(db, 'agendaEntries'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(30)
        );
        const snap = await getDocs(q);
        setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch { setEntries([]); }
      setLoading(false);
    };
    load();
  }, [user]);

  const moodCount = { high: 0, mid: 0, low: 0 };
  entries.forEach(e => { if (e.mood) moodCount[e.mood] = (moodCount[e.mood] || 0) + 1; });
  const total = entries.length;

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stats */}
      {total > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { key: 'high', label: 'Días bien', icon: Smile, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
            { key: 'mid',  label: 'Días regular', icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
            { key: 'low',  label: 'Días difíciles', icon: Frown, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
          ].map(s => {
            const Icon = s.icon;
            const pct = total ? Math.round((moodCount[s.key] / total) * 100) : 0;
            return (
              <div key={s.key} className={`${s.bg} rounded-2xl p-4 text-center border border-[var(--color-border)]/20`}>
                <Icon className={`w-6 h-6 ${s.color} mx-auto mb-1`} />
                <p className="text-2xl font-bold text-[var(--color-text-main)]">{moodCount[s.key]}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
                <p className="text-xs font-semibold text-[var(--color-text-muted)]">{pct}%</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Mini mood chart */}
      {entries.length >= 3 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-2xl p-4 mb-6">
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4" /> Últimos {Math.min(14, entries.length)} días
          </p>
          <div className="flex items-end gap-1.5 h-14">
            {entries.slice(0, 14).reverse().map((e, i) => {
              const h = e.mood === 'high' ? 100 : e.mood === 'mid' ? 60 : 25;
              const col = e.mood === 'high' ? 'bg-green-400' : e.mood === 'mid' ? 'bg-yellow-400' : 'bg-red-400';
              return <div key={i} className={`flex-1 ${col} rounded-sm opacity-80`} style={{ height: `${h}%` }} />;
            })}
          </div>
        </div>
      )}

      {/* Entries list */}
      {entries.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-[var(--color-text-muted)]">Aún no hay registros. Completa tu primer check-in en la pestaña Bienestar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(e => {
            const m = MOOD_ICONS[e.mood] || MOOD_ICONS.mid;
            const Icon = m.icon;
            const date = e.createdAt?.toDate ? e.createdAt.toDate().toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : e.date;
            return (
              <div key={e.id} className="bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-2xl overflow-hidden">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left" onClick={() => setExpanded(expanded === e.id ? null : e.id)}>
                  <Icon className={`w-5 h-5 ${m.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text-main)]">{m.label} — {date}</p>
                    {e.context?.overwhelmLabels?.length > 0 && (
                      <p className="text-xs text-[var(--color-text-muted)] truncate">Pesaba: {e.context.overwhelmLabels.join(', ')}</p>
                    )}
                  </div>
                  <ChevronRight className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${expanded === e.id ? 'rotate-90' : ''}`} />
                </button>
                {expanded === e.id && (
                  <div className="px-4 pb-4 border-t border-[var(--color-border)]/20 pt-3 space-y-2">
                    {e.customOverwhelm && <p className="text-xs text-[var(--color-text-muted)]"><strong>Lo que escribiste:</strong> {e.customOverwhelm}</p>}
                    {e.customActivity && <p className="text-xs text-[var(--color-text-muted)]"><strong>Actividad propia:</strong> {e.customActivity}</p>}
                    {e.advice && (
                      <div className="bg-[var(--color-primary)]/5 rounded-xl p-3">
                        <p className="text-xs font-bold text-[var(--color-primary)] mb-1">Consejo recibido</p>
                        <p className="text-xs text-[var(--color-text-main)] leading-relaxed">{e.advice}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// TAB: PLANNER
// ══════════════════════════════════════════════════════════
function TabPlanner({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', dueTime: '', reminder: true });
  const [filter, setFilter] = useState('pending'); // pending | completed | all
  const [notifPermission, setNotifPermission] = useState(Notification.permission);

  const loadTasks = useCallback(async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'plannerTasks'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { setTasks([]); }
    setLoading(false);
  }, [user]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  // Check reminders every 60 seconds
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (!task.reminder || task.completed || !task.dueDate || !task.dueTime) return;
        const due = new Date(`${task.dueDate}T${task.dueTime}`);
        const diff = due - now;
        // Notify if due within next 2 minutes
        if (diff >= 0 && diff <= 2 * 60 * 1000 && Notification.permission === 'granted') {
          new Notification(`✨ Recordatorio — ${task.title}`, {
            body: task.description || 'Tienes algo pendiente en tu planner.',
            icon: '/vite.svg',
          });
        }
      });
    };
    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  const requestNotifPermission = async () => {
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'plannerTasks'), {
        userId: user.uid,
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate,
        dueTime: form.dueTime,
        reminder: form.reminder,
        completed: false,
        createdAt: serverTimestamp(),
      });
      setTasks(prev => [{ id: docRef.id, ...form, completed: false }, ...prev]);
      setForm({ title: '', description: '', dueDate: '', dueTime: '', reminder: true });
      setShowForm(false);
    } catch {}
  };

  const toggleComplete = async (id, current) => {
    await updateDoc(doc(db, 'plannerTasks', id), { completed: !current });
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !current } : t));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'plannerTasks', id));
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filtered = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Notif banner */}
      {notifPermission !== 'granted' && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <BellOff className="w-5 h-5 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Activa notificaciones para recordatorios</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Te avisaremos cuando se acerque una tarea programada</p>
          </div>
          <button onClick={requestNotifPermission} className="text-xs font-bold bg-amber-500 text-white px-3 py-1.5 rounded-xl hover:bg-amber-600 transition-colors whitespace-nowrap">
            Activar
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          {[['pending', 'Pendientes'], ['completed', 'Completadas'], ['all', 'Todas']].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${filter === v ? 'bg-[var(--color-primary)] text-white border-transparent' : 'border-[var(--color-border)]/50 text-[var(--color-text-muted)]'}`}>
              {l}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md hover:opacity-90 transition-all">
          <Plus className="w-4 h-4" /> Nueva tarea
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-[var(--color-surface)] border border-[var(--color-primary)]/30 rounded-2xl p-5 mb-5 shadow-lg space-y-3 animate-fade-in">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-[var(--color-text-main)]">Nueva tarea</h3>
            <button type="button" onClick={() => setShowForm(false)}><X className="w-4 h-4 text-[var(--color-text-muted)]" /></button>
          </div>
          <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Título de la tarea *" className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 text-[var(--color-text-main)]" />
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Descripción o nota (opcional)" rows={2}
            className="w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 resize-none text-[var(--color-text-main)]" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] block mb-1">Fecha</label>
              <input type="date" value={form.dueDate} min={today} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 text-[var(--color-text-main)]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] block mb-1">Hora</label>
              <input type="time" value={form.dueTime} onChange={e => setForm(f => ({ ...f, dueTime: e.target.value }))}
                className="w-full px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 text-[var(--color-text-main)]" />
            </div>
          </div>
          {form.dueDate && form.dueTime && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.reminder} onChange={e => setForm(f => ({ ...f, reminder: e.target.checked }))} className="w-4 h-4 accent-[var(--color-primary)] rounded" />
              <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"><Bell className="w-3.5 h-3.5" /> Recordarme con notificación</span>
            </label>
          )}
          <button type="submit" className="w-full py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-xl text-sm hover:bg-[var(--color-primary-light)] transition-colors">
            Agregar tarea
          </button>
        </form>
      )}

      {/* Tasks */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-[var(--color-text-muted)] text-sm">
            {filter === 'completed' ? 'No hay tareas completadas aún.' : filter === 'pending' ? '¡No tienes tareas pendientes! Bien hecho.' : 'No hay tareas aún.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(task => {
            const isOverdue = task.dueDate && !task.completed && new Date(`${task.dueDate}T${task.dueTime || '23:59'}`) < new Date();
            const dueDisplay = task.dueDate
              ? `${new Date(task.dueDate + 'T12:00').toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' })}${task.dueTime ? ` · ${task.dueTime}` : ''}`
              : null;
            return (
              <div key={task.id} className={`bg-[var(--color-surface)] border rounded-2xl p-4 flex items-start gap-3 transition-all ${task.completed ? 'opacity-60 border-[var(--color-border)]/20' : isOverdue ? 'border-red-300 dark:border-red-700/50' : 'border-[var(--color-border)]/30 hover:shadow-md'}`}>
                <button onClick={() => toggleComplete(task.id, task.completed)} className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${task.completed ? 'bg-green-500 border-green-500' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'}`}>
                  {task.completed && <Check className="w-3 h-3 text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${task.completed ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text-main)]'}`}>{task.title}</p>
                  {task.description && <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">{task.description}</p>}
                  {dueDisplay && (
                    <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${isOverdue && !task.completed ? 'text-red-500' : 'text-[var(--color-text-muted)]'}`}>
                      {task.reminder && !task.completed ? <Bell className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {dueDisplay}
                      {isOverdue && !task.completed && <span className="ml-1 bg-red-100 dark:bg-red-900/30 text-red-500 text-xs px-1.5 py-0.5 rounded-full">Vencida</span>}
                    </div>
                  )}
                </div>
                <button onClick={() => handleDelete(task.id)} className="p-1.5 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
export default function MiAgenda() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('educamax-theme') === 'dark');
  const [tab, setTab] = useState('bienestar');

  useEffect(() => {
    if (isDarkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('educamax-theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('educamax-theme', 'light'); }
  }, [isDarkMode]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { navigate('/'); return; }
      setUser(u);
      try {
        const snap = await getDoc(doc(db, 'users', u.uid));
        setProfile(snap.exists() ? snap.data() : { nombre: 'Fernanda', apellido: '' });
      } catch { setProfile({ nombre: 'Fernanda', apellido: '' }); }
    });
    return () => unsub();
  }, [navigate]);

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  const TABS = [
    { id: 'bienestar', label: '🌿 Bienestar', desc: 'Check-in emocional diario' },
    { id: 'historial', label: '📋 Historial', desc: 'Monitoreo de entradas' },
    { id: 'planner',   label: '✨ Planner',   desc: 'Tareas y recordatorios' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col md:flex-row">
      <Sidebar
        profile={profile} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}
        navigate={navigate} handleLogout={handleLogout} active="agenda"
      />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-sm font-medium text-[var(--color-primary)] uppercase tracking-wider">Espacio Personal</span>
          </div>
          <h1 className="text-3xl font-bold font-['Outfit'] text-[var(--color-text-main)]">
            Mi Agenda, <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">{profile?.nombre || 'Fernanda'}</span>
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1 text-sm">Tu espacio de bienestar, reflexión y organización personal</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-1 bg-[var(--color-surface-alt)] rounded-2xl p-1 mb-8 w-fit">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${tab === t.id ? 'bg-[var(--color-surface)] shadow-md text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'bienestar' && <TabBienestar user={user} profile={profile} />}
        {tab === 'historial' && <TabHistorial user={user} />}
        {tab === 'planner'   && <TabPlanner user={user} />}
      </main>
    </div>
  );
}
