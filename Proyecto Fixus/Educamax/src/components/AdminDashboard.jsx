import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Shield, Users, Key, LogOut, ArrowLeft, Loader2, Building, Star, BarChart3, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [colegio, setColegio] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resumen');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/');
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfile(userData);

          if (userData.rol !== 'admin') {
            navigate('/home2');
            return;
          }

          if (userData.colegioId) {
            const colDoc = await getDoc(doc(db, 'colegios', userData.colegioId));
            if (colDoc.exists()) setColegio({ id: colDoc.id, ...colDoc.data() });

            // Fetch teachers
            const qTeachers = query(collection(db, 'users'), where('colegioId', '==', userData.colegioId));
            const teachersSnap = await getDocs(qTeachers);
            const teacherList = [];
            teachersSnap.forEach((doc) => {
              teacherList.push({ id: doc.id, ...doc.data() });
            });
            setTeachers(teacherList);

            // Fetch activities
            const qActivities = query(collection(db, 'actividad_colegios'), where('colegioId', '==', userData.colegioId));
            const activitiesSnap = await getDocs(qActivities);
            const activitiesList = [];
            activitiesSnap.forEach((doc) => {
              activitiesList.push({ id: doc.id, ...doc.data() });
            });
            setActivities(activitiesList);
          }
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error("Error loading admin data:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col h-auto md:h-screen sticky top-0 shrink-0 hidden md:flex">
        <div className="p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shadow-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-[var(--color-text-main)] block leading-tight">Admin</span>
              <span className="text-xs text-[var(--color-text-muted)]">Panel Institucional</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => navigate('/home2')} className="w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5 transition-colors">
            <ArrowLeft className="w-5 h-5" />Volver a la App
          </button>
          
          <button 
            onClick={() => setActiveTab('resumen')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all ${
              activeTab === 'resumen' 
                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5'
            }`}
          >
            <Shield className="w-5 h-5" />Resumen Colegio
          </button>

          <button 
            onClick={() => setActiveTab('analitica')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all ${
              activeTab === 'analitica' 
                ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500 shadow-sm'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-text-main)]/5'
            }`}
          >
            <BarChart3 className="w-5 h-5" />Analítica UTP
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          
          <header className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-['Outfit'] text-[var(--color-text-main)] mb-2">
                Panel de Administración
              </h1>
              <p className="text-[var(--color-text-muted)] text-lg">
                Gestiona las licencias y accesos de {colegio?.nombre || 'tu institución'}.
              </p>
            </div>
            <button onClick={() => navigate('/home2')} className="md:hidden p-3 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
               <ArrowLeft className="w-5 h-5" />
            </button>
          </header>

          {activeTab === 'resumen' ? (
            <>
              {/* Stats Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-[var(--color-surface)] p-6 rounded-3xl border border-[var(--color-border)]/50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Users className="w-16 h-16" />
                  </div>
                  <p className="text-[var(--color-text-muted)] font-medium mb-1">Licencias Totales</p>
                  <h3 className="text-4xl font-black text-[var(--color-text-main)]">{colegio?.licenciasTotales || 0}</h3>
                  <p className="text-sm text-green-500 mt-2 font-medium">Plan Básico</p>
                </div>

                <div className="bg-[var(--color-surface)] p-6 rounded-3xl border border-[var(--color-border)]/50 shadow-sm relative overflow-hidden">
                  <p className="text-[var(--color-text-muted)] font-medium mb-1">Licencias Usadas</p>
                  <h3 className="text-4xl font-black text-[var(--color-primary)]">{colegio?.licenciasUsadas || 0}</h3>
                  <div className="w-full bg-[var(--color-border)] h-2 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="bg-[var(--color-primary)] h-full" 
                      style={{ width: `${(colegio?.licenciasUsadas / colegio?.licenciasTotales) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] p-6 rounded-3xl shadow-xl text-white relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <p className="font-medium text-white/80 mb-1 flex items-center gap-2">
                      <Key className="w-4 h-4" /> Código de Invitación
                    </p>
                    <h3 className="text-4xl font-black tracking-widest">{colegio?.codigoInvitacion || '------'}</h3>
                  </div>
                  <p className="text-sm mt-3 text-white/90">
                    Comparte este código con tus profesores.
                  </p>
                </div>
              </div>

              {/* Teachers Table */}
              <div className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)]/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[var(--color-text-main)]">Profesores Activos ({teachers.length})</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-[var(--color-text-muted)]">
                    <thead className="bg-[var(--color-background)] font-medium text-[var(--color-text-main)] uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Rol</th>
                        <th className="px-6 py-4">Ingreso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]/50">
                      {teachers.map((t) => (
                        <tr key={t.id} className="hover:bg-[var(--color-background)]/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-[var(--color-text-main)]">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold">
                                {t.nombre?.charAt(0)}
                              </div>
                              {t.nombre} {t.apellido}
                              {t.rol === 'admin' && <Star className="w-4 h-4 text-amber-400" />}
                            </div>
                          </td>
                          <td className="px-6 py-4">{t.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              t.rol === 'admin' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {t.rol || 'Profesor'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {t.createdAt?.toDate ? t.createdAt.toDate().toLocaleDateString() : 'Reciente'}
                          </td>
                        </tr>
                      ))}
                      {teachers.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-[var(--color-text-muted)]">
                            Aún no hay profesores registrados en este colegio.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <AnalyticsView activities={activities} />
          )}
        </div>
      </main>
    </div>
  );
}

function AnalyticsView({ activities }) {
  // Aggregate data
  const statsPorTipo = [
    { name: 'Evaluaciones', value: activities.filter(a => a.tipo === 'evaluacion').length },
    { name: 'Rúbricas', value: activities.filter(a => a.tipo === 'rubrica').length },
    { name: 'Planificaciones', value: activities.filter(a => a.tipo === 'planificacion').length }
  ].filter(s => s.value > 0);

  const asigMap = {};
  activities.forEach(a => {
    asigMap[a.asignatura] = (asigMap[a.asignatura] || 0) + 1;
  });
  const statsPorAsig = Object.keys(asigMap).map(key => ({ name: key, usos: asigMap[key] }));

  // OAs más trabajados
  const oaMap = {};
  activities.forEach(a => {
    const k = `${a.nivel} - ${a.asignatura} - ${a.oaId}`;
    if (!oaMap[k]) oaMap[k] = { nivel: a.nivel, asig: a.asignatura, oa: a.oaId, count: 0 };
    oaMap[k].count += 1;
  });
  const topOAs = Object.values(oaMap).sort((a, b) => b.count - a.count).slice(0, 10);

  const COLORS = ['#d97706', '#1e40af', '#059669', '#7c3aed', '#db2777'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[var(--color-surface)] p-6 rounded-3xl border border-[var(--color-border)]/50 shadow-sm">
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-600" /> Adopción por Herramienta
          </h3>
          {statsPorTipo.length === 0 ? (
             <p className="text-[var(--color-text-muted)] text-center py-10">No hay datos suficientes aún.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={statsPorTipo}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statsPorTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)', borderRadius: '1rem' }} />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-3xl border border-[var(--color-border)]/50 shadow-sm">
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--color-primary)]" /> Uso por Asignatura
          </h3>
          {statsPorAsig.length === 0 ? (
             <p className="text-[var(--color-text-muted)] text-center py-10">No hay datos suficientes aún.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsPorAsig}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" tick={{fill: 'var(--color-text-muted)', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill: 'var(--color-text-muted)', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)', borderRadius: '1rem' }} cursor={{fill: 'var(--color-text-main)', opacity: 0.05}} />
                  <Bar dataKey="usos" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)]/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-bold text-[var(--color-text-main)]">OAs más trabajados en el colegio</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Cobertura curricular basada en las IA generadas</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--color-text-muted)]">
            <thead className="bg-[var(--color-background)] font-medium text-[var(--color-text-main)] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Nivel</th>
                <th className="px-6 py-4">Asignatura</th>
                <th className="px-6 py-4">Objetivo de Aprendizaje</th>
                <th className="px-6 py-4 text-right">Veces Trabajado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/50">
              {topOAs.map((item, idx) => (
                <tr key={idx} className="hover:bg-[var(--color-background)]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--color-text-main)]">{item.nivel}</td>
                  <td className="px-6 py-4">{item.asig}</td>
                  <td className="px-6 py-4 font-medium text-[var(--color-primary)]">{item.oa}</td>
                  <td className="px-6 py-4 text-right font-bold text-[var(--color-text-main)]">{item.count}</td>
                </tr>
              ))}
              {topOAs.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-[var(--color-text-muted)]">
                    Sin registros de cobertura aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
