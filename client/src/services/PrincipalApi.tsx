import axiosInstance from "../helper/axiosInstance";

export const getAllClass = async () => {
    try {
        const response = await axiosInstance.get("/class");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch classes:", error);
        throw error;
    }
}

export const getClassById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/class/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch class with ID ${id}:`, error);
        throw error;
    }
}


export const getAllSchoolYears = async () => {
    try {
        const response = await axiosInstance.get("/class/school-year");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch school years:", error);
        throw error;
    }
}


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
        console.error(`Failed to fetch classes for school year ${year}:`, error);
        throw error;
    }
};


export const getClassBySchooYear2 = async (year: string) => {
    try {
        const response = await axiosInstance.get(`/class/school-year/${year}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch classes for school year ID ${year}:`, error);
        throw error;
    }
}


export const getClassByStatus = async (status: boolean) => {
    try {
        const response = await axiosInstance.get(`/class/status/${status}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch classes with status ${status}:`, error);
        throw error;
    }
}

export const createClass = async (className: string, classAge: string, room: string, status: boolean) => {
    try {
        const response = await axiosInstance.post(`/class/create`, {
            className, classAge, room, status
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create class:", error);
        throw error;
    }
}

export const updateClass = async (id: string, className: string, classAge: string, room: string, status: boolean) => {
    try {
        const response = await axiosInstance.put(`/class/update/${id}`, {
            className, classAge, room, status
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update class with ID ${id}:`, error);
        throw error;
    }
}

export const deleteClass = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/class/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to delete class with ID ${id}:`, error);
        throw error;
    }
}

export const getStudentsInClass = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/class/${id}/students`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch students in class with ID ${id}:`, error);
        throw error;
    }
}

export const getTeachersInClass = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/class/${id}/teachers`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch teachers in class with ID ${id}:`, error);
        throw error;
    }
}

export const addStudentsToClass = async (id: string, studentIds: string[]) => {
    try {
        const response = await axiosInstance.post(`/class/${id}/students`, { studentIds });
        return response.data;
    } catch (error) {
        console.error(`Failed to add students to class with ID ${id}:`, error);
        throw error;
    }
}

export const addTeachersToClass = async (id: string, teacherIds: string[]) => {
    try {
        const response = await axiosInstance.post(`/class/${id}/teachers`, { teacherIds });
        return response.data;
    } catch (error) {
        console.error(`Failed to add teachers to class with ID ${id}:`, error);
        throw error;
    }
}

export const removeStudentFromClass = async (classId: string, studentId: string) => {
    try {
        const response = await axiosInstance.delete(`/class/${classId}/students/${studentId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to remove student with ID ${studentId} from class with ID ${classId}:`, error);
        throw error;
    }
}

export const removeTeacherFromClass = async (classId: string, teacherId: string) => {
    try {
        const response = await axiosInstance.delete(`/class/${classId}/teachers/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to remove teacher with ID ${teacherId} from class with ID ${classId}:`, error);
        throw error;
    }
}

export const getAvailableStudents = async () => {
    try {
        const response = await axiosInstance.get('/class/available-students');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch available students:', error);
        throw error;
    }
};

export const getAvailableTeachers = async () => {
    try {
        const response = await axiosInstance.get('/class/available-teachers');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch available teachers:', error);
        throw error;
    }
};