import axios, { type InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:9999/api/",
  withCredentials: true, // Gửi cookie tự động (chứa refreshToken)
});


axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
      return config; 
  },
  (error) => Promise.reject(error)
);

// Interceptor: Xử lý lỗi và tự refresh accessToken nếu bị 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry (tránh vòng lặp vô hạn)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/access-token")
    ) {
      originalRequest._retry = true;

      try {
        // Gọi API lấy accessToken mới từ refreshToken trong cookie
        const res = await axios.post(
          "http://localhost:9999/api/auth/access-token",
          {},
          { withCredentials: true }
        );
        
        const newAccessToken = res.data.accessToken;

        // Lưu lại token mới
        localStorage.setItem("accessToken", newAccessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu refreshToken hết hạn → xoá local, chuyển về login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/sign-in";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
