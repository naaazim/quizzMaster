// src/axiosInstance.js
import axios from "axios";
import { CookieService } from "./utils/cookieUtils";


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = CookieService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (
      response?.status === 403 ||
      response?.status === 401 ||
      response?.data === "Une erreur est survenue : Access Denied"
    ) {
      CookieService.clearAuth();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
