// src/testAxios.js - Script de test pour vérifier axiosInstance
import axiosInstance from "./axiosInstance";

import { CookieService } from "./utils/cookieUtils";

export const testConnection = async () => {
    try {
        console.log("🔍 Test de connexion axiosInstance");
        console.log("Base URL:", axiosInstance.defaults.baseURL);
        console.log("Token JWT:", CookieService.getToken() ? "✅ Présent" : "❌ Manquant");


        // Test ping
        const response = await axiosInstance.get("/v1/health");
        console.log("✅ Connexion réussie:", response.data);
    } catch (error) {
        console.error("❌ Erreur de connexion:", error.message);
        console.error("Code status:", error.response?.status);
        console.error("Réponse:", error.response?.data);
    }
};

// Appelez cette fonction dans la console pour tester
// testConnection();
