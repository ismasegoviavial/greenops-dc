import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isInstitution, setIsInstitution] = useState(false);
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '', establecimiento: '', genero: 'femenino' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(cred.user, { displayName: `${form.nombre} ${form.apellido}` });
        
        let colegioId = null;
        const role = isInstitution ? 'admin' : 'profesor';

        if (isInstitution) {
          colegioId = `col_${cred.user.uid}`;
          await setDoc(doc(db, 'colegios', colegioId), {
            nombre: form.establecimiento || 'Mi Colegio',
            adminId: cred.user.uid,
            licenciasTotales: 10, // Default for testing
            licenciasUsadas: 1, // The admin uses one
            codigoInvitacion: generateInviteCode(),
            createdAt: new Date(),
          });
        }

        await setDoc(doc(db, 'users', cred.user.uid), {
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          establecimiento: form.establecimiento,
          genero: form.genero,
          rol: role,
          colegioId: colegioId,
          createdAt: new Date(),
        });
        navigate('/home2');
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
        navigate('/home2');
      }
    } catch (err) {
      const msgs = {
        'auth/email-already-in-use': 'Ese correo ya tiene una cuenta registrada.',
        'auth/invalid-email': 'El correo no es válido.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/user-not-found': 'No existe cuenta con ese correo.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/invalid-credential': 'Correo o contraseña incorrectos.',
      };
      setError(msgs[err.code] || 'Ocurrió un error. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0eb] via-[#ede5db] to-[#e0d5c8] dark:from-[#0f1923] dark:via-[#141e2b] dark:to-[#18263a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl shadow-xl mb-4">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84 51.39 51.39 0 0 0-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold font-['Outfit'] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
            Educamax Creator
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1 text-sm">Herramientas de IA para docentes</p>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-surface)] rounded-3xl shadow-2xl shadow-black/10 p-8 border border-[var(--color-border)]/30">
          <div className="flex bg-[var(--color-background)] rounded-2xl p-1 mb-6">
            <button onClick={() => { setIsRegister(false); setError(''); }} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${!isRegister ? 'bg-[var(--color-primary)] text-white shadow' : 'text-[var(--color-text-muted)]'}`}>
              Iniciar Sesión
            </button>
            <button onClick={() => { setIsRegister(true); setError(''); }} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${isRegister ? 'bg-[var(--color-primary)] text-white shadow' : 'text-[var(--color-text-muted)]'}`}>
              Crear Cuenta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Nombre</label>
                    <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Fernanda" className="mt-1 w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 text-[var(--color-text-main)]" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Apellido</label>
                    <input name="apellido" value={form.apellido} onChange={handleChange} required placeholder="García" className="mt-1 w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 text-[var(--color-text-main)]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Establecimiento</label>
                  <input name="establecimiento" value={form.establecimiento} onChange={handleChange} placeholder="Colegio / Instituto" className="mt-1 w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 text-[var(--color-text-main)]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Género (Para la IA)</label>
                  <select name="genero" value={form.genero} onChange={handleChange} className="mt-1 w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 text-[var(--color-text-main)]">
                    <option value="femenino">Femenino (Profesora)</option>
                    <option value="masculino">Masculino (Profesor)</option>
                    <option value="neutro">Neutro (Docente)</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-3 p-3 mt-2 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl">
                  <input 
                    type="checkbox" 
                    id="isInstitution" 
                    checked={isInstitution}
                    onChange={(e) => setIsInstitution(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <label htmlFor="isInstitution" className="text-sm font-medium text-[var(--color-text-main)] cursor-pointer">
                    Registrar como cuenta de Colegio (Administrador)
                  </label>
                </div>
              </>
            )}
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Correo electrónico</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="profe@colegio.cl" className="mt-1 w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 text-[var(--color-text-main)]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••" className="mt-1 w-full px-4 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)]/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 text-[var(--color-text-main)]" />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 text-sm">
              {isLoading ? 'Cargando...' : isRegister ? 'Crear Cuenta Docente' : 'Entrar al Panel'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--color-text-muted)] mt-6 opacity-60">
          Educamax Creator © 2025 — Plataforma para docentes
        </p>
      </div>
    </div>
  );
}
