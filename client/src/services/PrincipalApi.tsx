import axios from "axios";
import axiosInstance from "../helper/axiosInstance";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const getLocationProvinces = async () => {
    try{
        const response = await axios.get("https://open.oapi.vn/location/provinces");
        return response.data.data;
    }catch(error){
        console.log("Failed to fetch getLocationProvinces:", error);
        throw error;
    }
}

export const getLocationDistrict = async (provinceId: any) => {
      try{
        const response = await axios.get(`https://open.oapi.vn/location/districts/${provinceId}`);
         return response.data.data;
    }catch(error){
        console.log("Failed to fetch getLocationDistrict:", error);
        throw error;
    }
}

export const getLocationWards = async (districtId: any) => {
      try{
        const response = await axios.get(`https://open.oapi.vn/location/wards/${districtId}`);
        return response.data.data;
    }catch(error){
        console.log("Failed to fetch getLocationWards:", error);
        throw error;
    }
}


export const getAllTeachers = async () => {
    try {
        const response = await axiosInstance.get("/teacher");
        return response.data;
    } catch (error) {
        console.log("Failed to fetch all teachers:", error);
        throw error;
    }
};

export const deleteTeacher = async (id: any) => {
    try {
        const response = await axiosInstance.put(
            `/teacher/delete-teacher/${id}`
        );
        return response.data;
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

export const createTeacher = async (teacher: any) => {
    try {
        const response = await axiosInstance.post("/teacher", teacher);
        return response.data;
    } catch (error) {
        console.log("Failed to createTeacher", error);
        throw error;
    }
};

export const updateTeacher = async (teacher: any, id: any) => {
    try {
        const response = await axiosInstance.put(
            `/teacher/update-teacher/${id}`,
            teacher
        );
        return response.data;
    } catch (error) {
        console.log("Failed to updateTeacher:", error);
        throw error;
    }
};

export const getStatisticSchoolYear = async () => {
    try {
        const response = await axiosInstance.get("/class/schoolyear/statistic");
        return response.data;
    } catch (error) {
        console.log("Failed to fetch schoolyear:", error);
        throw error;
    }
};

export const createNewSchoolYear = async (schoolYear: any) => {
    try {
        const response = await axiosInstance.post(
            "/class/schoolyear/create-schoolyear",
            schoolYear
        );
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

export const getAllClass = async () => {
    try {
        const response = await axiosInstance.get("/class");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch classes:", error);
        throw error;
    }
};

export const getClassById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/class/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch class with ID ${id}:`, error);
        throw error;
    }
};

export const getAllSchoolYears = async () => {
    try {
        const response = await axiosInstance.get("/class/school-year");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch school years:", error);
        throw error;
    }
};

export const getClassBySchooYear = async (year: string) => {
    try {
        const response = await axiosInstance.get(`/class/school-year/${year}`);
        const rawData = response.data.data;

        if (!Array.isArray(rawData)) {
            return [];
        }

        const transformed = rawData.map((c: any) => ({
            ...c,
            id: c._id,
            room: c.className,
            teacher: c.teacher?.[0] || { name: "Chưa phân công" },
            students: c.students || [],
        }));

        return transformed;
    } catch (error) {
        console.error(
            `Failed to fetch classes for school year ${year}:`,
            error
        );
        throw error;
    }
};

export const getAllClassBySchoolYear = async (year: string) => {
    try {
        const response = await axiosInstance.get(
            `/class/school-year/${year}/all`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Failed to fetch all classes for school year ${year}:`,
            error
        );
        throw error;
    }
};

export const getClassByStatus = async (status: boolean) => {
    try {
        const response = await axiosInstance.get(`/class/status/${status}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch classes with status ${status}:`, error);
        throw error;
    }
};

export const createClass = async (
    className: string,
    classAge: string,
    room: string | null,
    status: boolean,
    schoolYear: string
) => {
    try {
        const response = await axiosInstance.post(`/class/create`, {
            className,
            classAge,
            room,
            status,
            schoolYear,
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create class:", error);
        throw error;
    }
};

export const updateClass = async (
    id: string,
    className: string,
    classAge: string,
    room: string,
    status: boolean
) => {
    try {
        const response = await axiosInstance.put(`/class/update/${id}`, {
            className,
            classAge,
            room,
            status,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update class with ID ${id}:`, error);
        throw error;
    }
};

export const deleteClass = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/class/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to delete class with ID ${id}:`, error);
        throw error;
    }
};

export const getStudentsInClass = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/class/${id}/students`);
        return response.data;
    } catch (error) {
        console.error(
            `Failed to fetch students in class with ID ${id}:`,
            error
        );
        throw error;
    }
};

export const getTeachersInClass = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/class/${id}/teachers`);
        return response.data;
    } catch (error) {
        console.error(
            `Failed to fetch teachers in class with ID ${id}:`,
            error
        );
        throw error;
    }
};

export const addStudentsToClass = async (id: string, studentIds: string[]) => {
    try {
        const response = await axiosInstance.post(`/class/${id}/students`, {
            studentIds,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to add students to class with ID ${id}:`, error);
        throw error;
    }
};

export const addTeachersToClass = async (id: string, teacherIds: string[]) => {
    try {
        const response = await axiosInstance.post(`/class/${id}/teachers`, {
            teacherIds,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to add teachers to class with ID ${id}:`, error);
        throw error;
    }
};

export const removeStudentFromClass = async (
    classId: string,
    studentId: string
) => {
    try {
        const response = await axiosInstance.delete(
            `/class/${classId}/students/${studentId}`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Failed to remove student with ID ${studentId} from class with ID ${classId}:`,
            error
        );
        throw error;
    }
};

export const removeTeacherFromClass = async (
    classId: string,
    teacherId: string
) => {
    try {
        const response = await axiosInstance.delete(
            `/class/${classId}/teachers/${teacherId}`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Failed to remove teacher with ID ${teacherId} from class with ID ${classId}:`,
            error
        );
        throw error;
    }
};

export const getAvailableStudents = async () => {
    try {
        const response = await axiosInstance.get("/class/available-students");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch available students:", error);
        throw error;
    }
};

export const getAvailableTeachers = async () => {
    try {
        const response = await axiosInstance.get("/class/available-teachers");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch available teachers:", error);
        throw error;
    }
};

export const getAllRooms = async () => {
    try {
        const response = await axiosInstance.get("/room");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all rooms:", error);
        throw error;
    }
};

export const createClassBatch = async (
    classes: {
        className: string;
        classAge: string;
        room: string | null;
        status: boolean;
        schoolYear: string;
    }[]
) => {
    try {
        const response = await axiosInstance.post("/class/create-batch", {
            classes,
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create classes in batch:", error);
        throw error;
    }
};

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

export const updateCurriculum = async (
    editingActivityId: string,
    updatedActivity: any
) => {
    try {
        const response = await axiosInstance.put(
            `/curriculum/${editingActivityId}`,
            updatedActivity
        );
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

export const createTimeCurriculum = async (activityList: any) => {
    try {
        const response = await axiosInstance.post(
            `/curriculum/time-fixed`,
            activityList
        );
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
        const response = await axiosInstance.post(
            "/enrollSchool/process-enroll"
        );
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

export const getWeeklyMenuByDate = async (weekStart: string, age: Number) => {
    try {
        const response = await axiosInstance.get("/weeklyMenu", {
            params: { weekStart },
        });

        const allMenus = response.data || [];

        const matchedWeek = allMenus.find(
            (menu: any) =>
                dayjs(menu.weekStart).isSame(weekStart, "day") &&
                menu.ageCategory == age
        );

        return matchedWeek?.dailyMenus || [];
    } catch (error) {
        console.error("Lỗi lấy thực đơn theo tuần:", error);
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

export const getAllWeeklyMenus = async () => {
    try {
        const response = await axiosInstance.get("/weeklyMenu");
        return response.data || [];
    } catch (error) {
        console.error("Lỗi lấy tất cả thực đơn:", error);
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

export const getWeeklyMenuByDateNow = async (date: Date) => {
    try {
        // Tính toán ngày đầu tuần (Thứ 2) dựa trên `date` được truyền vào
        const weekStart = dayjs(date).startOf("week").add(1, "day").utc();

        const response = await axiosInstance.get("/weeklyMenu");
        const allMenus = response.data.data || [];

        // Tìm kiếm tuần khớp với `weekStart` đã tính
        const matchedWeek = allMenus.find((menu: any) =>
            dayjs(menu.weekStart).utc().isSame(weekStart, "day")
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
    console.log("🚀 ~ createParent ~ parentData:", parentData);
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
};

export const checkYearExistedSchedule = async (year: string) => {
    try {
        const response = await axiosInstance.get(`/schedule/check-year`, {
            params: { year },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi kiểm tra năm học đã có lịch:", error);
        throw error;
    }
};

export const genScheduleWithAI = async (year: string) => {
    try {
        const response = await axiosInstance.get(`/schedule/genAI`, {
            params: { year },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi tạo lịch học bằng AI:", error);
        throw error;
    }
};

export const getScheduleByClassNameAndYear = async (
    schoolYear: string,
    className: string
) => {
    try {
        const response = await axiosInstance.get(`/schedule/class-schedule`, {
            params: { schoolYear, className },
        });
        return response.data;
    } catch (error) {
        console.error(
            `Lỗi lấy lịch học cho lớp ${className} trong năm học ${schoolYear}:`,
            error
        );
        throw error;
    }
};

export const saveClassSchedule = async (year: string, schedules: any) => {
    try {
        const response = await axiosInstance.post(`/schedule/save`, {
            year,
            schedules,
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi lưu lịch học:", error);
        throw error;
    }
};
