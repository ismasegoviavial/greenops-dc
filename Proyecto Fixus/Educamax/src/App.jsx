import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Home2 from './components/Home2';
import Dashboard from './components/Dashboard';
import GaleriaVisual from './components/GaleriaVisual';
import Repositorio from './components/Repositorio';
import MiAgenda from './components/MiAgenda';
import RubricaCreator from './components/RubricaCreator';
import PlannerCreator from './components/PlannerCreator';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home2" element={<Home2 />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/rubricas" element={<RubricaCreator />} />
        <Route path="/planificaciones" element={<PlannerCreator />} />
        <Route path="/galeria" element={<GaleriaVisual />} />
        <Route path="/repositorio" element={<Repositorio />} />
        <Route path="/agenda" element={<MiAgenda />} />
      </Routes>
    </Router>
  );
}

export default App;
