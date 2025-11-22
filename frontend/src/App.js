import './App.css';
import * as Pages from './pages';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div>
    <Router>
      <Routes>
      <Route path ="/" element={<Pages.Home/>} />
      <Route path ="/dashboard-examinateur" element={<Pages.DBExaminateur/>} />
      <Route path ="/ajouter-passe-examen" element={<Pages.AjouterPasseExamen/>} />
      <Route path ="/dashboard-examine" element={<Pages.DashboardEtudiant/>} />
      <Route path ="/Gestion-roles" element={<Pages.GestionRoles/>} />
      <Route path ="/signup" element={<Pages.Register/>} />
      <Route path="/login" element={<Pages.Login />} />
      <Route path="/gestion-groupes" element={<Pages.GestionGroupes />} />
      <Route path="/activate-account" element={<Pages.Activate />} />
      <Route path="/gestion-examens" element={<Pages.GestionExamen />} />
      <Route path="/modification-examen/:examenId" element={<Pages.ModificationExamen />} />
      <Route path="/passe-examen/:id" element={<Pages.PasseExamen />} />
      <Route path="/analyses" element={<Pages.Analyses />} />
      <Route path="/corriger-examen/:examineId/:examenId" element={<Pages.CorrectionExamen />} />
      <Route path="/consultation" element={<Pages.Consultation />} />
      <Route path="/oauth2/redirect" element={<Pages.OAuth2RedirectHandler />} />
      <Route path="*" element={<Pages.NotFound />} />
      </Routes>
    </Router>
    </div>

  );
}

export default App;

