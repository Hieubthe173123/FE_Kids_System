import dayjs from "dayjs";
import axiosInstance from "../helper/axiosInstance";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const getWeeklyMenuByDate = async (weekStart: string, age: Number) => {
  try {
    const response = await axiosInstance.get("/weeklyMenu", {
      params: { weekStart },
    });

    const allMenus = response.data.data || [];

    const matchedWeek = allMenus.find((menu: any) =>
      dayjs(menu.weekStart).isSame(weekStart, "day") && menu.ageCategory == age
    );

    return matchedWeek?.dailyMenus || [];
  } catch (error) {
    console.error("Lỗi lấy thực đơn theo tuần:", error);
    throw error;
  }
};

// export const getWeeklyMenuByDateNow = async () => {
//   try {
//     const weekStart = dayjs().startOf("week").add(1, "day").utc();

//     const response = await axiosInstance.get("/weeklyMenu");
//     const allMenus = response.data.data || [];

//     const matchedWeek = allMenus.find((menu: any) =>
//       dayjs(menu.weekStart).utc().isSame(weekStart, "day")
//     );

//     return matchedWeek?.dailyMenus || [];
//   } catch (error) {
//     console.error("Lỗi lấy thực đơn theo tuần:", error);
//     throw error;
//   }
// };

// Trả về object: { [ageCategory]: dailyMenus[] }
// export const getWeeklyMenuByDateNow = async (date: Date, ageList: number[]) => {
//   try {
//     const weekStart = dayjs(date).startOf("week").add(1, "day").utc();
//     const response = await axiosInstance.get("/weeklyMenu");
//     const allMenus = response.data.data || [];
//     const matchedWeeks = allMenus.filter((menu: any) =>
//       dayjs(menu.weekStart).utc().isSame(weekStart, "day")
//     );
//     // Trả về mảng object gồm ageCategory và dailyMenus
//     return matchedWeeks.map((menu: any) => ({
//       ageCategory: menu.ageCategory,
//       days: menu.dailyMenus
//     }));
//   } catch (error) {
//     console.error("Lỗi lấy thực đơn theo tuần:", error);
//     throw error;
//   }
// };

export const getWeeklyMenuByDateNow = async (date: Date, ageList: number[]) => {
  try {
    const weekStart = dayjs(date).startOf("week").add(1, "day").utc();
    const response = await axiosInstance.get("/weeklyMenu");
    const allMenus = response.data || [];

    const matchedWeeks = allMenus.filter((menu: any) => {
      const isSameWeek = dayjs(menu.weekStart).utc().isSame(weekStart, "day");
      const isInAgeList = ageList.includes(menu.ageCategory);
      return isSameWeek && isInAgeList;
    });

    const abc = matchedWeeks.map((menu: any) => ({
      ageCategory: menu.ageCategory,
      days: menu.dailyMenus
    }));
    return abc;
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
  console.log("🚀 ~ createParent ~ parentData:", parentData)
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
  try {
    const response = await axiosInstance.get("/student/no-parent");
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách học sinh:", error);
    throw error;
  }
}

