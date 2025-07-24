import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import type { StatItem } from "../../model/Interface";
import {
  getStatisticSchoolYear,
  createNewSchoolYear,
} from "../../services/PrincipalApi";
import { BarChart } from "@mui/x-charts/BarChart";

const PRIMARY_COLOR = "#4194cb";

export default function ProcessEnroll() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  console.log("🚀 ~ ProcessEnroll ~ selectedYear:", selectedYear)
  const [schoolYear, setSchoolYear] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenConfirm = () => {
    const currentYear = new Date().getFullYear();
    const formattedYear = `${currentYear}-${currentYear + 1}`;
    setSchoolYear(formattedYear);
    setOpenConfirm(true);
  };

  const fetchData = async () => {
    try {
      const data = await getStatisticSchoolYear();
      setStats(data.data);
      if (data.data.length > 0) {
        setSelectedYear(data.data[data.data.length - 1]._id);
      }
    } catch (err) {
      toast.error("Lỗi khi lấy dữ liệu năm học!");
    }
  };

  const handleConfirmAdd = async () => {
    setOpenConfirm(false);
    const res = await createNewSchoolYear({ schoolYear });
    if (res.error) {
      const { errorList } = res.error;
      if (errorList && errorList.length > 0) {
        for (const error of errorList) {
          toast.error(error.message);
        }
      } else {
        toast.error("Lỗi tại máy chủ");
      }
      return;
    } else {
      toast.success("Thêm năm học mới thành công!");
      fetchData();
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Tiêu đề */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: PRIMARY_COLOR,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DateRangeIcon />
          Quản lý năm học
        </Typography>

        {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      </Box>

      {/* Năm học hiện tại + thêm mới */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="subtitle1">
          Năm học hiện tại:{" "}
          <strong>
            {stats.length > 0 ? stats[stats.length - 1]._id : "Chưa có dữ liệu"}
          </strong>
        </Typography>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Làm mới dữ liệu">
            <IconButton onClick={fetchData}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Thêm mới">
            <IconButton color="primary" onClick={handleOpenConfirm}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Biểu đồ thống kê bằng MUI X */}
      <Paper elevation={2} sx={{ p: 2, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Thống kê năm học
        </Typography>

        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <BarChart
            height={400}
            xAxis={[
              {
                id: "schoolYear",
                data: stats.map((item) => item._id),
                scaleType: "band",
              },
            ]}
            series={[
              {
                label: "Học sinh",
                data: stats.map((item) => item.totalStudents),
                color: "#1976d2",
              },
              {
                label: "Lớp học",
                data: stats.map((item) => item.totalClasses),
                color: "#2e7d32",
              },
              {
                label: "Giáo viên",
                data: stats.map((item) => item.totalTeachers),
                color: "#f9a825",
              },
            ]}
            margin={{ top: 30, bottom: 50, left: 60, right: 20 }}
            legend={{
              position: { vertical: "top", horizontal: "middle" },
            }}  {...({} as any)}
          />
        </Box>
      </Paper>

      {/* Dialog xác nhận thêm năm học */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        slotProps={{
          paper: {
            sx: {
              position: "absolute",
              top: "10%",
              left: "50%",
              width: "700px",
              transform: "translate(-50%, -50%)",
            },
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold", pb: 1 }}>
          Tạo năm học mới
        </DialogTitle>

        <Typography variant="subtitle1" sx={{ px: 3, pb: 2 }}>
          Bạn có chắc chắn muốn tạo năm học mới <strong>{schoolYear}</strong>?
        </Typography>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenConfirm(false)} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleConfirmAdd}
            variant="contained"
            color="primary"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}