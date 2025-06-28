import axiosInstance from "../helper/axiosInstance";
export const getListEnrollSchool = async () => {
    try {
        const response = await axiosInstance.get("/enrollSchool");
        return response.data;
    } catch (error) {
        console.error("Get enrollList failed:", error);
        throw error;
    }
}

export const accessProcessEnroll = async() => {
    try {
        const response = await axiosInstance.post("/enrollSchool/process-enroll");
        return response.data;
    } catch (error) {
        console.error("Get user failed:", error);
        throw error;
    }
}