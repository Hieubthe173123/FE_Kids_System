import axiosInstance from "../helper/axiosInstance";

// 1. Lấy lịch dạy của giáo viên (có phân trang)
// services/teacher.service.ts

export const getTimeTable = async ({
  year,
  week,
}: {
  year: string;
  week: string;
}) => {
  try {
    const response = await axiosInstance.get(
      `/teacher/time-table?year=${year}&week=${week}`
    );
    return response.data;
  } catch (error) {
    console.error("Get time table failed:", error);
    throw error;
  }
};


// 2. Lấy danh sách lớp mà giáo viên đang dạy
export const getTeacherClasses = async () => {
    try {
        const response = await axiosInstance.get("/teacher/classes");
        console.log("Check getTeacherClasses:", response);
        return response.data;
    } catch (error) {
        console.error("Get teacher classes failed:", error);
        throw error;
    }
};

// 3. Lấy danh sách học sinh trong một lớp cụ thể
export const getStudentsInClass = async (classId: string) => {
    try {
        const response = await axiosInstance.get(`/teacher/students/${classId}`);
        console.log("Check getStudentsInClass:", response);
        return response.data;
    } catch (error) {
        console.error("Get students in class failed:", error);
        throw error;
    }
};


export const getDashboard = async () => {
    try {
        const response = await axiosInstance.get("/teacher/dashboard");
        return response.data;
    } catch (error) {
        console.error("Get dashboard failed:", error);
        throw error;
    }
};