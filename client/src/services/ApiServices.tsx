import dayjs from "dayjs";
import axiosInstance from "../helper/axiosInstance";



export const getWeeklyMenuByDate = async (weekStart: string) => {
  try {
    const response = await axiosInstance.get("/weeklyMenu", {
      params: { weekStart }, // ví dụ: "2025-06-30"
    });
    console.log("🚀 ~ getWeeklyMenuByDate ~ response:", response)

    const allMenus = response.data.data || [];
    console.log("🚀 ~ getWeeklyMenuByDate ~ allMenus:", allMenus)
    const matchedWeek = allMenus.find((menu: any) =>
      dayjs(menu.weekStart).isSame(weekStart, "day")
    );

    return matchedWeek?.dailyMenus || [];
  } catch (error) {
    console.error("Lỗi lấy thực đơn theo tuần:", error);
    throw error;
  }
};

export const getWeeklyMenuByDateNow = async () => {
  try {
    const weekStart = dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD");

    const response = await axiosInstance.get("/weeklyMenu", {
      params: { weekStart },
    });

    console.log("🚀 ~ getWeeklyMenuByDate ~ response:", response);

    const allMenus = response.data.data || [];

    // 👉 Tìm thực đơn có đúng tuần đó
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

export const getAllParents = async () => {
  try {
    const response = await axiosInstance.get("/parent");
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách phụ huynh:", error);
    throw error;
  }
};

export const createParent = async (parentData: any) => {
  try {
    const response = await axiosInstance.post("/parent", parentData);
    return response.data;
  } catch (error) {
    console.error("Lỗi tạo phụ huynh:", error);
    throw error;
  }
};

export const updateParent = async (id: string, parentData: any) => {
  try {
    const response = await axiosInstance.put(`/parent/${id}`, parentData);
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật phụ huynh:", error);
    throw error;
  }
};

export const getAccountParentUnused = async () => {
  try {
    const response = await axiosInstance.get(`/parent/unused`);
    return response.data;
  } catch (error) {
    console.error("Không thể lấy được Tài khoản Phụ huynh:", error);
    throw error;
  }
};

export const deleteParent = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/parent/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi xóa phụ huynh:", error);
    throw error;
  }
};

export const getParentById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/parent/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy phụ huynh theo ID:", error);
    throw error;
  }
};

export const getAllStudents = async () => {
  try {
    const response = await axiosInstance.get("/student");
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách học sinh:", error);
    throw error;
  }
};

export const createStudent = async (studentData: any) => {
  try {
    const response = await axiosInstance.post("/student", studentData);
    return response.data;
  } catch (error) {
    console.error("Lỗi tạo học sinh:", error);
    throw error;
  }
};

export const getStudentById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/student/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy học sinh theo ID:", error);
    throw error;
  }
};

export const updateStudent = async (id: string, studentData: any) => {
  try {
    const response = await axiosInstance.put(`/student/${id}`, studentData);
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật học sinh:", error);
    throw error;
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/student/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi xóa học sinh:", error);
    throw error;
  }
};

export const getAllStudentNoParent = async () => {
  console.log("23214323");

  try {
    const response = await axiosInstance.get("/student/no-parent");
    console.log("🚀 ~ getAllStudentNoParent ~ response:", response.data)
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách học sinh:", error);
    throw error;
  }
}

