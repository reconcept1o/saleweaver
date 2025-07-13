import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000", // Backend URL'si
  withCredentials: true, // Çerezleri (authToken, refreshToken) gönder/alı
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
