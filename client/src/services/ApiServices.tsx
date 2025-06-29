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
