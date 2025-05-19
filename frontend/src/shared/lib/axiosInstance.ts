import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  withCredentials: true,
});

// 요청/응답 인터셉터 추가 가능
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response || err.message);
    return Promise.reject(err);
  }
);
