import axiosInstance from "../helper/axiosInstance";


export const loginApi = async (username: string, password: string) => {
    try {
        const response = await axiosInstance.post("auth/login", {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

export const forgotpassApi = async (email: string) => {
    try {
        const response = await axiosInstance.post("auth/forgot-password", {
            email,
        });
        return response.data;
    } catch (error) {
        console.error("Forgot password failed:", error);
        throw error;
    }
}
