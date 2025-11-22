import Layout from "../components/Layout";
import ListExamensPasses from "../components/ListExamensPasses";
import ListExamensAPasser from "../components/ListExamensAPasser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

function DashboardEtudiant() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    // 1️⃣ Vérifier si OAuth2 (Google) a envoyé un token
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt_token", token);

      axiosInstance.get("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          localStorage.setItem("user", JSON.stringify(res.data));

          window.history.replaceState({}, document.title, "/dashboard-examine");
          setUserId(res.data.id);
        })
        .catch(() => navigate("/login"));

      return;
    }

    // 2️⃣ Connexion normale (sans Google)
    const userDataString = localStorage.getItem("user");

    if (!userDataString) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(userDataString);
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
