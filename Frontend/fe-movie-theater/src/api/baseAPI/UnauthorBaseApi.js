import axios from "axios";
import { toast } from "react-toastify";

// Tạo một instance Axios
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Cấu hình interceptor cho instance
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data; // Chỉ lấy data từ response
    }
    return response;
  },
  (error) => {
    // if (error.response && error.response.statusCode === 500) {
    //   window.location.href = "/auth/500"; // Redirect nếu lỗi 500
    // }

    // const statusCode = error?.response?.data.statusCode || "Unknown";
    // const errorMessage = error.response?.data?.error || "An unexpected error occurred";
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      message.forEach((element) => {
        toast.error(`${element}`);
      });
    } else {
      toast.error(`${message}`);
    }
    return Promise.reject(error); // Ném lỗi để xử lý tiếp
  }
);

export default axiosClient;
