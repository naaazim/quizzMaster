import Navbar from "../components/Navbar";
import ListExamensCorriges from "../components/ListExamensCorrige";
import { useNavigate } from "react-router-dom";

// Page qui affiche tous les examens déja corrigé et permet de modifier la correction
const ModifierCorrection = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const examinateurId = user?.id;
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <ListExamensCorriges examinateurId={examinateurId} />
      <button onClick={() => navigate("/dashboard-examinateur")} >Retour</button>
    </div>
  );
};

export default ModifierCorrection;