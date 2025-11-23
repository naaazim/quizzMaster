// src/testAxios.js - Script de test pour vérifier axiosInstance
import axiosInstance from "./axiosInstance";

export const testConnection = async () => {
    try {
        console.log("🔍 Test de connexion axiosInstance");
        console.log("Base URL:", axiosInstance.defaults.baseURL);
        console.log("Token JWT:", localStorage.getItem("jwt_token") ? "✅ Présent" : "❌ Manquant");

        // Test ping
        const response = await axiosInstance.get("/api/v1/health");
        console.log("✅ Connexion réussie:", response.data);
    } catch (error) {
        console.error("❌ Erreur de connexion:", error.message);
        console.error("Code status:", error.response?.status);
        console.error("Réponse:", error.response?.data);
    }
};

// Appelez cette fonction dans la console pour tester
// testConnection();
