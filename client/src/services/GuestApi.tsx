import axiosInstance from "../helper/axiosInstance";

export const createEnrollSchool = async (data: any) => {
    try {
        const response = await axiosInstance.post('/enrollSchool', data);
        return response.data;
    } catch (error) {
        console.error("Error creating enrollment:", error);
        throw error;
    }
}