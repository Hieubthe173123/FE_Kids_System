import dayjs from "dayjs";
import axiosInstance from "../helper/axiosInstance";

export const getAllCurriculums = async () => {
  try {
    const response = await axiosInstance.get("/curriculum");
    return response.data;
  } catch (error) {
    console.error("Get currriculumList failed:", error);
    throw error;
  }
};

export const createCurriculums = async (activityData: any) => {
  try {
    const response = await axiosInstance.post("/curriculum", activityData);
    return {
      data: response.data,
      error: null,
    };
  } catch (error: any) {
    const errorList = error.response?.data;
    return {
      data: null,
      error: {
        errorList: errorList,
    },
    };
  }
};

export const updateCurriculum = async (editingActivityId: string, updatedActivity: any) => {
  try {
    const response = await axiosInstance.put(`/curriculum/${editingActivityId}`, updatedActivity);
    return {
      data: response.data,
      error: null,
    };
  } catch (error: any) {
    const errorList = error.response?.data;
    return {
      data: null,
      error: {
        errorList: errorList,
      },
    };
  }
};


export const deleteCurriculum = async (id: any) => {
  try {
    const response = await axiosInstance.put(`/curriculum/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get currriculumList failed:", error);
    throw error;
  }
};

export const getListEnrollSchool = async () => {
  try {
    const response = await axiosInstance.get("/enrollSchool");
    return response.data;
  } catch (error) {
    console.error("Get enrollList failed:", error);
    throw error;
  }
};

export const accessProcessEnroll = async () => {
  try {
    const response = await axiosInstance.post("/enrollSchool/process-enroll");
    return {
      data: response.data,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || "Đã xảy ra lỗi",
        status: error.response?.status || null,
      },
    };
  }
};

export const getWeeklyMenuByDate = async (weekStart: string) => {
  try {
    const response = await axiosInstance.get("/weeklyMenu", {
      params: { weekStart }, // ví dụ: "2025-06-30"
    });

    const allMenus = response.data.data || [];
    const matchedWeek = allMenus.find((menu: any) =>
      dayjs(menu.weekStart).isSame(weekStart, "day")
    );

    return matchedWeek?.dailyMenus || [];
  } catch (error) {
    console.error("Lỗi lấy thực đơn theo tuần:", error);
    throw error;
  }
};

export const getWeeklyMenuById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/weeklyMenu/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi lấy thực đơn theo ID:", error);
    throw error;
  }
};

export const createWeeklyMenu = async (menuData: any) => {
  try {
    const response = await axiosInstance.post("/weeklyMenu", menuData);
    return response.data;
  } catch (error) {
    console.error("Lỗi tạo thực đơn:", error);
    throw error;
  }
};

export const updateWeeklyMenu = async (id: string, menuData: any) => {
  try {
    const response = await axiosInstance.put(`/weeklyMenu/${id}`, menuData);
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật thực đơn:", error);
    throw error;
  }
};

export const deleteWeeklyMenu = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/weeklyMenu/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi xóa thực đơn:", error);
    throw error;
  }
};

export const getAllWeeklyMenus = async () => {
  try {
    const response = await axiosInstance.get("/weeklyMenu");
    return response.data.data || [];
  } catch (error) {
    console.error("Lỗi lấy tất cả thực đơn:", error);
    throw error;
  }
};
