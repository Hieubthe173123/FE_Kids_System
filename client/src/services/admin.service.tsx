import axiosInstance from "../helper/axiosInstance";

export const getAccounts = async () => {
    try {
        const response = await axiosInstance.get("/admin/accounts");
        console.log(' chekc ré',response);
        
        return response.data;
    } catch (error) {
        console.error("Get accounts failed:", error);
        throw error;
    }
};