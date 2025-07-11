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

export const getStudentClassInfo = async (studentId: string) => {
    try {
        const response = await axiosInstance.get(`/class/${studentId}/class-info`);
        return response.data;
    } catch (error) {
        console.error("Error fetching student class info:", error);
        throw error;
    }
}