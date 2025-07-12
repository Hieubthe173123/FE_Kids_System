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

export const getAccountById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/admin/accounts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Get account by id failed:", error);
        throw error;
    }
};

export const updateAccount = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/admin/accounts/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Update account failed:", error);
        throw error;
    }
};