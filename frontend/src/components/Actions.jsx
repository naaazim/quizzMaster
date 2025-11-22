import { useNavigate } from "react-router-dom";
import style from "../style/Actions.module.css";

const Actions = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className={style.actions}>
      <button onClick={() => navigate("/gestion-examens")}>Gestion des examens</button>
      <button onClick={() => navigate("/gestion-groupes")}>Gestion des groupes</button>
      <button onClick={() => navigate("/ajouter-passe-examen")}>Gestion des passages</button>
      <button onClick={() => navigate("/analyses")}>Analyses</button>
      {user.appUserRole == "ADMIN" && (<button onClick={() => navigate("/gestion-roles")}>Gestion des utilisateurs</button>)}
    </div>
  );
};

export default Actions;
