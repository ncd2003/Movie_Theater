import axios from "axios";
import { toast } from "react-toastify";
import AuthApi from "../AuthApi";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add access token to request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==== Token Refresh Mechanism ====
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ==== Response Interceptor ====
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Nếu đã có request đang refresh -> chờ token mới
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosClient(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      // Nếu chưa có, bắt đầu refresh
      isRefreshing = true;
      return new Promise(async (resolve, reject) => {
        try {
          const res = await AuthApi.refreshToken();
          const newToken = res?.data?.access_token;

          localStorage.setItem("access_token", newToken);
          axiosClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newToken}`;

          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosClient(originalRequest));
        } catch (refreshError) {
          processQueue(refreshError, null);
          toast.error("Session expired. Please log in again.");

          // Redirect tùy vai trò
          const roleId = localStorage.getItem("roleId");
          if (roleId === "1" || roleId === "2") {
            window.location.href = "/auth/signIn";
          } else if (roleId === "3") {
            window.location.href = "/user/signIn";
          }

          reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      });
    }

    // Xử lý lỗi khác
    const statusCode = error?.response?.data?.statusCode || "Unknown";
    const errorMessage = error.response?.data?.error || "Unexpected error";
    const message = error.response?.data?.message || "Unexpected message";

    if (Array.isArray(message)) {
      message.forEach((msg) =>
        toast.error(`${statusCode}: ${msg} - ${errorMessage}`)
      );
    } else {
      toast.error(`${statusCode}: ${message} - ${errorMessage}`);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
