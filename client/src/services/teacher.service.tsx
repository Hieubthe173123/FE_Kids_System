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

export const getScheduleByClassId = async (classId: string,year: string,week: string) => {
    try {
        const response = await axiosInstance.get(`/teacher/schedule/${classId}?year=${year}&week=${week}`);
        
        return response.data;
    } catch (error) {
        console.error("Get schedule by class id failed:", error);
        throw error;
    }
};

export const getAttendanceToday = async (classId: string) => {
    try {
        const response = await axiosInstance.get(`/teacher/attendance/${classId}`);
        
        return response.data;
    } catch (error) {
        console.error("Get attendance today failed:", error);
        throw error;
    }
};

export const getTeacherClass = async () => {
    try {
        const response = await axiosInstance.get(`/teacher/class-teacher`);        
        return response.data;
    } catch (error) {
        console.error("Get teacher class failed:", error);
        throw error;
    }
};


export const bulkUpdateAttendance = async (data: any) => {
    try {
        const response = await axiosInstance.put(`/teacher/bulk-update`, data);
        return response.data;
    } catch (error) {
        console.error("Bulk update attendance failed:", error);
        throw error;
    }
};


export const getTeacherInClass = async (classId: string) => {
    try {
        const response = await axiosInstance.get(`/teacher/teacherinclass/${classId}`);
        return response.data;
    } catch (error) {
        console.error("Get teacher in class failed:", error);
        throw error;
    }
};

export const getAttendanceByDate = async (date: string , classId: string) => {
    try {
        const response = await axiosInstance.get(`/teacher/attendance/history/${classId}?date=${date}`);
        
        return response.data;
    } catch (error) {
        console.error("Get attendance by date failed:", error);
        throw error;
    }
};


export const getTeacherSwappableSchedule = async ( classId: string, date: string) => {
    try {
        const response = await axiosInstance.get(`/teacher/schedule/day/${classId}?date=${date}`);
        
        return response.data;
    } catch (error) {
        console.error("Get teacher swappable schedule failed:", error);
        throw error;
    }
};

export const swapSchedule = async (data: any) => {
    try {
        const response = await axiosInstance.put(`/teacher/schedule/swap-day`, data);
        return response.data;
    } catch (error) {
        console.error("Swap schedule failed:", error);
        throw error;
    }
};