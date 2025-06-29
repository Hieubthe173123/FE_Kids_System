import axiosInstance from "../helper/axiosInstance";

import dayjs from "dayjs";

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
  console.log("🚀 ~ createWeeklyMenu ~ menuData:", menuData)
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