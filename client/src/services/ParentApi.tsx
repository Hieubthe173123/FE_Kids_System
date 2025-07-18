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

export const getScheduleByClassId = async (classId: string) => {
    try {
        const response = await axiosInstance.get(`/parent/schedule/${classId}`);
        console.log("🚀 ~ getScheduleByClassId ~ response:", response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching schedule by class ID:", error);
        throw error;
    }
}

export const uploadPictureProfile = async (parentId: string, file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post(`/parent/${parentId}/upload-picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        throw error;
    }
};

export const getAttendanceByStudentID = async (studentId: string) => {
    try {
        const response = await axiosInstance.get(`/parent/attendance/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching attendance by student ID:", error);
        throw error;
    }
}

export const getAllHolidays = async () => {
    try {
        const response = await axiosInstance.get('/holiday');
        return response.data;
    } catch (error) {
        console.error("Error fetching holidays: ", error);
        throw error;
    }
}

export const getHolidayByDate = async (date: string) => {
    try {
        const response = await axiosInstance.get(`/holiday/${date}`)
        return response.data
    } catch (error) {
        console.error("Error fetching holiday: ", error);
        throw error
    }
}