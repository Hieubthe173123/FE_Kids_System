import axiosInstance from "../helper/axiosInstance";


export const getStudentsByParentId = async (parentId: string) => {
    try {
        const response = await axiosInstance.get(`/parent/${parentId}/students`);
        return response.data;
    } catch (error) {
        console.error("Error fetching students by parent ID:", error);
        throw error;
    }
}