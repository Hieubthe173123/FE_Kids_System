import axios, { type InternalAxiosRequestConfig } from "axios";
const axiosInstance = axios.create({
  // baseURL: "http://localhost:7071/api/",
  baseURL: "https://sakura-function-app-server-fbhrhsbzbwfph7fg.southeastasia-01.azurewebsites.net/api/",
  withCredentials: true,
});


axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/access-token")
    ) {
      originalRequest._retry = true;

      try {
        // const res = await axios.post(
        //   "http://localhost:7071/api/auth/access-token",
        //   {},
        //   { withCredentials: true }
        // );
        const res = await axios.post(
          "https://sakura-function-app-server-fbhrhsbzbwfph7fg.southeastasia-01.azurewebsites.net/api/auth/access-token",
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
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

