import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CookieService } from "../utils/cookieUtils";
import Layout from "../components/Layout";
import ListExamensACorriger from "../components/ListExamensACorriger";
import Actions from "../components/Actions";
import ListExamensCorriges from "../components/ListExamensCorrige";

const DBExaminateur = () => {
  const [examinateurId, setExaminateurId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupère les infos de l'utilisateur depuis les cookies
    const userData = CookieService.getUser();

    // Redirige vers la page de login si l'utilisateur n'est pas connecté
    if (!userData) {
      navigate("/login");
    } else {
      // Si l'utilisateur est trouvé, on extrait son ID
      setExaminateurId(userData?.id);
    }
  }, [navigate]);

  return (
    <Layout title="TABLEAU DE BORD EXAMINATEUR">
      <Actions />
      <ListExamensACorriger examinateurId={examinateurId} />
      <ListExamensCorriges examinateurId={examinateurId} />
    </Layout>
  );
};

export default DBExaminateur;
