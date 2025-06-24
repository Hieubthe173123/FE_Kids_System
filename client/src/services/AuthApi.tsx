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

export const forgotPasswordApi = async (email: string) => {
    try {
        const response = await axiosInstance.post("/auth/forgot-password", {
            email,
        });
        return response.data;
    } catch (error) {
        console.error("Forgot password failed:", error);
        throw error;
    }
};

export const verifyOTPApi = async (OTPnumber: string) => {
    try {
        const response = await axiosInstance.post("/auth/verify-otp", {
            OTPnumber,
        });
        return response.data;
    } catch (error) {
        console.error("OTP verification failed:", error);
        throw error;
    }
};

export const resetPasswordApi = async (
    email: string,
    newPassword: string,
    confirmPassword: string
) => {
    try {
        const response = await axiosInstance.post("/auth/reset-password", {
            email,
            newPassword,
            confirmPassword,
        });
        return response.data;
    } catch (error) {
        console.error("Reset password failed:", error);
        throw error;
    }
};
