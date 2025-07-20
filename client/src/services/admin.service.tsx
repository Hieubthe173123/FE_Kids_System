import axiosInstance from "../helper/axiosInstance";

export const getAccounts = async () => {
    try {
        const response = await axiosInstance.get("/management/accounts");
        
        return response.data;
    } catch (error) {
        console.error("Get accounts failed:", error);
        throw error;
    }
};

export const getAccountById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/management/accounts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Get account by id failed:", error);
        throw error;
    }
};

export const updateAccount = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/management/accounts/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Update account failed:", error);
        throw error;
    }
};


export const statisticDataAdmin = async () => {
    try {
        const response = await axiosInstance.get("/management/statistic");
        return response.data;
    } catch (error) {
        console.error("Get statistic data failed:", error);
        throw error;
    }
};