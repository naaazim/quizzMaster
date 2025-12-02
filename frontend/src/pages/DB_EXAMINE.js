import Layout from "../components/Layout";
import ListExamensPasses from "../components/ListExamensPasses";
import ListExamensAPasser from "../components/ListExamensAPasser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { CookieService } from "../utils/cookieUtils";

function DashboardEtudiant() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    // 1️⃣ Vérifier si OAuth2 (Google) a envoyé un token
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      CookieService.setToken(token);

      axiosInstance.get("/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          CookieService.setUser(res.data);

          window.history.replaceState({}, document.title, "/dashboard-examine");
          setUserId(res.data.id);
        })
        .catch(() => navigate("/login"));

      return;
    }

    // 2️⃣ Connexion normale (sans Google)
    const userData = CookieService.getUser();

    if (!userData) {
      navigate("/login");
      return;
    }

    setUserId(userData?.id);

  }, [navigate]);

  return (
    <Layout title="TABLEAU DE BORD EXAMINE">
      {userId && <ListExamensPasses userId={userId} />}
      {userId && <ListExamensAPasser userId={userId} />}
    </Layout>
  );
}

export default DashboardEtudiant;
