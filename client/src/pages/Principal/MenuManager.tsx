import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Stack,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  getAllWeeklyMenus,
  deleteWeeklyMenu,
  createWeeklyMenu,
  updateWeeklyMenu,
} from "../../services/PrincipalApi";
import { toast } from "react-toastify";
import { MenuItem } from "@mui/material";
import Swal from 'sweetalert2';


export default function WeeklyMenuCRUD() {
  const [menus, setMenus] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [weekStart, setWeekStart] = useState("");
  const [ageCategory, setAgeCategory] = useState("");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [dailyMenus, setDailyMenus] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const isPast = dayjs(dailyMenus[selectedDayIndex]?.date).isBefore(dayjs(), "day");

  const getStartOfWeek = (dateStr: string) => {
    return dayjs(dateStr).isoWeekday(1).format("YYYY-MM-DD");
  };

  const fetchMenus = async () => {
    try {
      const data = await getAllWeeklyMenus();
      setMenus(data);
    } catch (error) {
      console.error("Failed to fetch menus", error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc muốn xóa thực đơn tuần này?',
      text: 'Thao tác này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      focusCancel: true
    });
    if (result.isConfirmed) {
      await deleteWeeklyMenu(id);
      fetchMenus();
      Swal.fire('Đã xóa!', 'Thực đơn tuần đã được xóa.', 'success');
    }
  };

  const handleMealChange = (index: number, mealType: string, value: string) => {
    const newMenus = [...dailyMenus];
    newMenus[index][mealType] = value;
    setDailyMenus(newMenus);
  };

  const parseDishes = (input: string) => {
    return input
      .split(",")
      .map((name: string) => name.trim())
      .filter((name: string) => name !== "")
      .map((name: string) => ({ dishName: name }));
  };

  const handleSave = async () => {
    try {
      if (!ageCategory) {
        setErrorMsg("⛔ Vui lòng chọn độ tuổi.");
        return;
      }

      const startOfSelectedWeek = dayjs(weekStart).startOf('week');
      const startOfCurrentWeek = dayjs().startOf('week');

      if (startOfSelectedWeek.isBefore(startOfCurrentWeek, 'week')) {
        setErrorMsg("Không thể tạo hoặc sửa thực đơn cho tuần đã trôi qua.");
        return;
      }

      const payload = {
        weekStart,
        ageCategory: Number(ageCategory),
        dailyMenus: dailyMenus.map((d) => ({
          date: d.date,
          breakfast: parseDishes(d.breakfast),
          lunch: parseDishes(d.lunch),
          dinner: parseDishes(d.dinner),
        })),
      };

      let isUpdate = false;
      if (editData) {
        await updateWeeklyMenu(editData._id, payload);
        isUpdate = true;
      } else {
        const existing = menus.find((m) =>
          dayjs(m.weekStart).isSame(weekStart, "day") &&
          String(m.ageCategory) === String(ageCategory)
        );
        if (existing) {
          await updateWeeklyMenu(existing._id, payload);
          isUpdate = true;
        } else {
          await createWeeklyMenu(payload);
        }
      }

      setOpenDialog(false);
      setEditData(null);
      setErrorMsg("");
      fetchMenus();
      if (isUpdate) {
        toast.success("Cập nhật thực đơn tuần thành công!");
      } else {
        toast.success("Tạo mới thực đơn tuần thành công!");
      }
    } catch (err) {
      console.error("Error saving weekly menu", err);
      toast.error("Có lỗi xảy ra khi lưu thực đơn tuần!");
    }
  };

  return (
    <Box p={{ xs: 1, sm: 3 }} sx={{ background: '#f7fafd', height: '100vh' }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, mb: 4 }}>
        {/* <Typography variant="h4" fontWeight="bold" color="#4194cb" mb={2}>
          Quản lý thực đơn theo tuần
        </Typography> */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} mb={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ background: 'linear-gradient(90deg,#e6687a,#ffb347)', fontWeight: 'bold', fontSize: '1rem' }}
            onClick={() => {
              setOpenDialog(true);
              setEditData(null);
              setErrorMsg("");
              const defaultStart = dayjs().startOf("isoWeek").format("YYYY-MM-DD");
              setWeekStart(defaultStart);
              setAgeCategory("");
              setDailyMenus(
                Array.from({ length: 7 }, (_, i) => {
                  const date = dayjs(defaultStart).add(i, "day").format("YYYY-MM-DD");
                  return { date, breakfast: "", lunch: "", dinner: "" };
                })
              );
            }}
          >
            Thêm thực đơn tuần
          </Button>
          <Button
            variant="outlined"
            endIcon={<NavigateNextIcon />}
            sx={{ fontWeight: 'bold', fontSize: '1rem', borderColor: '#4194cb', color: '#4194cb' }}
            onClick={() => navigate("/principal-home/menu-dailyWeekly")}
          >
            Xem thực đơn chi tiết
          </Button>
        </Stack>
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ background: '#71bfefff' }}>
                <TableCell align="center"><strong>STT</strong></TableCell>
                <TableCell align="center"><strong>Tuần thứ</strong></TableCell>
                <TableCell align="center"><strong>Ngày bắt đầu</strong></TableCell>
                <TableCell align="center"><strong>Ngày kết thúc</strong></TableCell>
                <TableCell align="center"><strong>Độ tuổi</strong></TableCell>
                <TableCell align="center"><strong>Hành động</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menus.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#aaa' }}>
                    Không có thực đơn tuần nào.
                  </TableCell>
                </TableRow>
              ) : (
                menus.map((menu, index) => {
                  const start = dayjs(menu.weekStart);
                  const end = start.add(6, "day");
                  const weekNumber = start.isoWeek();
                  return (
                    <TableRow key={menu._id} sx={{ '&:hover': { background: '#f0f8ff' } }}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">Tuần {weekNumber}</TableCell>
                      <TableCell align="center">{start.format("DD/MM/YYYY")}</TableCell>
                      <TableCell align="center">{end.format("DD/MM/YYYY")}</TableCell>
                      <TableCell align="center">{menu.ageCategory || "-"}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="edit"
                          size="small"
                          sx={{ mx: 0.5, color: '#1976d2', background: '#e3f2fd', borderRadius: 2 }}
                          onClick={() => {
                            const selectedWeek = start.startOf('week');
                            const currentWeekStart = dayjs().startOf('week');
                            if (selectedWeek.isBefore(currentWeekStart)) {
                              toast.error("⛔ Không thể chỉnh sửa thực đơn của tuần đã trôi qua.");
                              return;
                            }
                            setErrorMsg("");
                            setEditData(menu);
                            setWeekStart(start.format("YYYY-MM-DD"));
                            setAgeCategory(menu.ageCategory || "");
                            setDailyMenus(
                              menu.dailyMenus.map((d: { date: string; breakfast: { dishName: string }[]; lunch: { dishName: string }[]; dinner: { dishName: string }[] }) => ({
                                date: dayjs(d.date).format("YYYY-MM-DD"),
                                breakfast: d.breakfast.map((m) => m.dishName).join(", "),
                                lunch: d.lunch.map((m) => m.dishName).join(", "),
                                dinner: d.dinner.map((m) => m.dishName).join(", "),
                              }))
                            );
                            setOpenDialog(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          sx={{ mx: 0.5, color: '#d32f2f', background: '#ffebee', borderRadius: 2 }}
                          onClick={() => handleDelete(menu._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: '#f9f9f9',
            border: '1px solid #e0e0e0',
            boxShadow: 2,
            padding: { xs: 2, sm: 4 },
            fontFamily: 'inherit',
            color: '#222',
          },
        }}
      >
        <DialogTitle sx={{ fontSize: '1.3rem', fontWeight: 600, color: '#222', textAlign: 'center', mb: 1 }}>
          {editData ? "Cập nhật thực đơn tuần" : "Tạo mới thực đơn tuần"}
        </DialogTitle>
        <DialogContent>
          {errorMsg && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}
          <Stack spacing={2}>
            <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
              <TextField
                select
                label="Độ tuổi"
                variant="standard"
                value={ageCategory}
                onChange={(e) => {
                  const newAge = e.target.value;
                  setAgeCategory(newAge);
                  if (weekStart) {
                    const exists = menus.find((m) =>
                      dayjs(m.weekStart).isoWeek() === dayjs(weekStart).isoWeek() &&
                      dayjs(m.weekStart).year() === dayjs(weekStart).year() &&
                      Number(m.ageCategory) === Number(newAge)
                    );
                    if (exists && !editData) {
                      setErrorMsg("⛔ Tuần này đã có thực đơn cho độ tuổi này. Vui lòng chọn tuần khác hoặc sửa thực đơn cũ.");
                    } else {
                      setErrorMsg("");
                    }
                  }
                }}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 150 }}
              >
                {[1, 2, 3, 4, 5].map((age) => (
                  <MenuItem key={age} value={age.toString()}>
                    {age} tuổi
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                variant="standard"
                type="date"
                label="Ngày bắt đầu tuần"
                value={weekStart}
                onChange={(e) => {
                  const newStart = getStartOfWeek(e.target.value);
                  const exists = menus.find((m) =>
                    dayjs(m.weekStart).isoWeek() === dayjs(newStart).isoWeek() &&
                    dayjs(m.weekStart).year() === dayjs(newStart).year() &&
                    Number(m.ageCategory) == Number(ageCategory)
                  );
                  if (exists && !editData) {
                    setErrorMsg("⛔ Tuần này đã có thực đơn cho độ tuổi này. Vui lòng chọn tuần khác hoặc sửa thực đơn cũ.");
                    return;
                  }
                  setErrorMsg("");
                  setWeekStart(newStart);
                  setSelectedDayIndex(0);
                  const monday = dayjs(newStart);
                  setDailyMenus(
                    Array.from({ length: 7 }, (_, i) => {
                      const date = monday.add(i, "day").format("YYYY-MM-DD");
                      return { date, breakfast: "", lunch: "", dinner: "" };
                    })
                  );
                }}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180 }}
              />
            </Box>
            <Tabs
              value={selectedDayIndex}
              onChange={(_, newVal) => setSelectedDayIndex(newVal)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                backgroundColor: '#e3f2fd',
                borderRadius: 2,
                '.Mui-selected': { color: '#4194cb', fontWeight: 'bold' },
                fontWeight: 'bold',
                fontSize: '1rem',
                border: '1px solid #4194cb',
              }}
            >
              {dailyMenus.map((menu, idx) => (
                <Tab key={idx} label={dayjs(menu.date).format("dddd").toUpperCase()} />
              ))}
            </Tabs>
            {dailyMenus[selectedDayIndex] && (
              <Box>
                <Typography fontStyle="italic" color="#4194cb" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
                  Tuần từ {dayjs(weekStart).format("DD/MM")} đến {dayjs(weekStart).add(6, "day").format("DD/MM")}
                </Typography>
                <TextField
                  label="🌞 Món sáng"
                  value={dailyMenus[selectedDayIndex].breakfast}
                  onChange={(e) => handleMealChange(selectedDayIndex, "breakfast", e.target.value)}
                  fullWidth
                  multiline
                  disabled={isPast}
                  sx={{ mb: 2, backgroundColor: '#f7fafd', borderRadius: 2, fontWeight: 'bold', fontSize: '1rem', border: '1px solid #4194cb' }}
                />
                <TextField
                  label="🍽️ Món trưa"
                  value={dailyMenus[selectedDayIndex].lunch}
                  onChange={(e) => handleMealChange(selectedDayIndex, "lunch", e.target.value)}
                  fullWidth
                  multiline
                  disabled={isPast}
                  sx={{ mb: 2, backgroundColor: '#f7fafd', borderRadius: 2, fontWeight: 'bold', fontSize: '1rem', border: '1px solid #4194cb' }}
                />
                <TextField
                  label="💤 Món chiều"
                  value={dailyMenus[selectedDayIndex].dinner}
                  onChange={(e) => handleMealChange(selectedDayIndex, "dinner", e.target.value)}
                  fullWidth
                  multiline
                  disabled={isPast}
                  sx={{ backgroundColor: '#f7fafd', borderRadius: 2, fontWeight: 'bold', fontSize: '1rem', border: '1px solid #4194cb' }}
                />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#555', fontWeight: 500, fontSize: '1rem', border: '1px solid #bdbdbd', background: '#f5f5f5', borderRadius: 2, boxShadow: 'none', '&:hover': { background: '#ececec' } }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ background: '#1976d2', color: 'white', fontWeight: 600, fontSize: '1rem', borderRadius: 2, boxShadow: 'none', ml: 1, '&:hover': { background: '#1565c0' } }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
