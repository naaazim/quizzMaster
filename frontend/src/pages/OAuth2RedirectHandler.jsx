// src/pages/OAuth2RedirectHandler.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { CookieService } from "../utils/cookieUtils";

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Sauvegarde du token
    CookieService.setToken(token);

    // Récupération du user depuis le backend
    axiosInstance.get("/v1/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        CookieService.setUser(res.data);

        const role = res.data.appUserRole;

        if (role === "EXAMINE") navigate("/dashboard-examine");
        else if (role === "EXAMINATEUR") navigate("/dashboard-examinateur");
        else if (role === "ADMIN") navigate("/Gestion-roles");
        else navigate("/login");

      })
      .catch(() => navigate("/login"));

  }, [navigate]);

  return <p>Connexion en cours...</p>;
}
