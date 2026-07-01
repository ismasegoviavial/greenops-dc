const fs = require('fs');

let txt = fs.readFileSync('src/components/Dashboard.jsx', 'utf8');

txt = txt.replace(/const STEPS = \[[\s\S]*?}, \[isDarkMode\]\);/m,
`const STEPS = [
  { id: 1, label: 'Asignatura', icon: '📚' },
  { id: 2, label: 'Nivel', icon: '🎓' },
  { id: 3, label: 'Tema', icon: '📖' },
  { id: 4, label: 'Tipo', icon: '📋' },
  { id: 5, label: 'Configuración', icon: '⚙️' },
  { id: 6, label: 'Generar', icon: '✨' },
];

const ASIGNATURAS = ['Lenguaje y Comunicación', 'Matemática', 'Historia, Geografía y Cs. Sociales', 'Ciencias Naturales', 'Inglés', 'Educación Física', 'Artes Visuales', 'Música', 'Tecnología', 'Filosofía', 'Otra'];
const NIVELES = ['1° Básico', '2° Básico', '3° Básico', '4° Básico', '5° Básico', '6° Básico', '7° Básico', '8° Básico', '1° Medio', '2° Medio', '3° Medio', '4° Medio'];
const TIPOS = [
  { value: 'alternativas', label: 'Selección múltiple', desc: 'Preguntas con 4 opciones (A, B, C, D)', emoji: '🔘' },
  { value: 'verdadero_falso', label: 'Verdadero / Falso', desc: 'Afirmaciones para evaluar comprensión', emoji: '✔️' },
  { value: 'desarrollo', label: 'Preguntas de desarrollo', desc: 'Respuestas abiertas y argumentativas', emoji: '✍️' },
  { value: 'mixto', label: 'Mixto', desc: 'Combina alternativas y desarrollo automáticamente', emoji: '🔀' },
  { value: 'completar', label: 'Completar espacios', desc: 'Textos con espacios en blanco', emoji: '✨' },
  { value: 'personalizado', label: 'Personalizado', desc: 'Elige exactamente cuántas preguntas de cada tipo', emoji: '⚙️' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('educamax-theme') === 'dark');
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    asignatura: '', asignaturaCustom: '', nivel: '', tema: '',
    tipoPreguntas: '', cantidad: 10, dificultad: 'medio', instrucciones: '',
    distribucion: { alternativas: 0, verdadero_falso: 0, desarrollo: 0, completar: 0 }
  });

  useEffect(() => {
    if (isDarkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('educamax-theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('educamax-theme', 'light'); }
  }, [isDarkMode]);`);

fs.writeFileSync('src/components/Dashboard.jsx', txt, 'utf8');
console.log('Fixed Dashboard.jsx top');
