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
import LoadingOverlay from '../../components/LoadingOverlay';
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
  const [loading, setLoading] = useState(false);
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
      setMenus(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch menus", error);
      setMenus([]);
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
      setLoading(true);
      if (!ageCategory) {
        setErrorMsg("⛔ Vui lòng chọn độ tuổi.");
        toast.info("Vui lòng chọn độ tuổi.");
        setLoading(false);
        return;
      }

      const existing = menus.find((m) =>
        dayjs(m.weekStart).isSame(weekStart, "day") &&
        String(m.ageCategory) === String(ageCategory)
      );

      if (existing && !editData) {
        setErrorMsg("⛔ Tuần này đã có thực đơn cho độ tuổi này. Vui lòng chọn tuần khác hoặc sửa thực đơn cũ.");
        toast.info("Tuần này đã có thực đơn cho độ tuổi này. Vui lòng chọn tuần khác hoặc sửa thực đơn cũ.");
        setLoading(false);
        return;
      }

      const startOfSelectedWeek = dayjs(weekStart).startOf('week');
      const startOfCurrentWeek = dayjs().startOf('week');

      if (startOfSelectedWeek.isBefore(startOfCurrentWeek, 'week')) {
        setErrorMsg("Không thể tạo hoặc sửa thực đơn cho tuần đã trôi qua.");
        toast.info("Không thể tạo hoặc sửa thực đơn cho tuần đã trôi qua.");
        setLoading(false);
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
        const duplicate = menus.find((m) =>
          dayjs(m.weekStart).isSame(weekStart, "day") &&
          String(m.ageCategory) === String(ageCategory) &&
          m._id !== editData._id
        );

        if (duplicate) {
          setErrorMsg("⛔ Không thể cập nhật thực đơn do đã có một thực đơn khác tồn tại cho độ tuổi này trong tuần đó.");
          return;
        }

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
    } catch (err: any) {
      console.error("Error saving weekly menu", err);
      toast.error("Có lỗi xảy ra khi lưu thực đơn tuần!" + (err?.message ? ` (${err.message})` : ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={{ xs: 1, sm: 3 }} sx={{ background: '#f7fafd', height: '100vh', position: 'relative' }}>
      {loading && <LoadingOverlay />}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, mb: 4 }}>
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
                {(ageCategory && !isPast) && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Button
                      variant="outlined"
                      sx={{ fontWeight: 'bold', color: '#1976d2', borderColor: '#1976d2' }}
                      onClick={() => {
                        const autoMenusByDay: Record<string, { breakfast: string; lunch: string; dinner: string }[]> = {
                          '1': [ // 1 tuổi - ăn mềm, dễ nuốt
                            { breakfast: 'Sữa, Cháo thịt băm, Chuối', lunch: 'Cháo cà rốt, Thịt nạc, Canh rau ngót', dinner: 'Súp bí đỏ, Sữa, Táo nghiền' },
                            { breakfast: 'Sữa, Bánh mì mềm, Trứng hấp', lunch: 'Cháo gà xé, Rau mồng tơi', dinner: 'Cháo trắng, Ruốc cá hồi, Chuối' },
                            { breakfast: 'Sữa, Cháo khoai tây, Thịt bò xay', lunch: 'Cháo tôm, Bí đỏ', dinner: 'Cháo yến mạch, Sữa chua' },
                            { breakfast: 'Sữa, Cháo hạt sen, Rau củ', lunch: 'Cháo cá hồi, Canh rau cải', dinner: 'Cháo gạo lứt, Trứng hấp' },
                            { breakfast: 'Sữa, Bánh flan mềm, Cháo đậu xanh', lunch: 'Cháo thịt gà, Cà rốt, Khoai tây', dinner: 'Súp rau củ, Sữa' },
                            { breakfast: 'Sữa, Cháo trứng cà chua', lunch: 'Cháo cua, Rau mồng tơi', dinner: 'Cháo trắng, Bí đỏ, Chuối nghiền' },
                            { breakfast: 'Sữa, Cháo thịt băm, Khoai lang hấp', lunch: 'Cháo thịt bò, Cải ngọt', dinner: 'Cháo đậu xanh, Sữa' },
                          ],
                          '2': [ // 2 tuổi - bắt đầu ăn thô hơn
                            { breakfast: 'Sữa, Xôi đậu xanh, Trứng luộc', lunch: 'Cơm mềm, Thịt băm kho, Canh bí đỏ', dinner: 'Cháo cá, Sữa, Chuối' },
                            { breakfast: 'Sữa, Bánh mì bơ, Chuối', lunch: 'Cơm, Gà xé, Canh rau ngót', dinner: 'Cháo thịt bò, Rau mồng tơi' },
                            { breakfast: 'Sữa, Bún mọc', lunch: 'Cơm, Thịt kho tàu, Canh cải xanh', dinner: 'Cháo trứng, Sữa chua' },
                            { breakfast: 'Sữa, Phở gà', lunch: 'Cơm, Cá hấp, Canh bí xanh', dinner: 'Cháo tôm, Rau củ' },
                            { breakfast: 'Sữa, Bánh ngọt, Chuối', lunch: 'Cơm, Thịt viên sốt, Canh mướp', dinner: 'Cháo gà, Trứng hấp' },
                            { breakfast: 'Sữa, Cháo tim heo, Cà rốt', lunch: 'Cơm, Thịt bò, Canh rau cải', dinner: 'Cháo trắng, Sữa' },
                            { breakfast: 'Sữa, Bánh bao, Cam', lunch: 'Cơm, Gà rang, Canh cải ngọt', dinner: 'Cháo tôm, Trứng cút' },
                          ],
                          '3': [ // 3 tuổi - ăn cơm bình thường, đa dạng món
                            { breakfast: 'Sữa, Bánh mì trứng', lunch: 'Cơm, Thịt gà kho, Canh rau ngót', dinner: 'Cháo tôm, Bí đỏ, Sữa' },
                            { breakfast: 'Sữa, Phở bò', lunch: 'Cơm, Cá kho, Canh cải ngọt', dinner: 'Súp thịt bằm, Trái cây' },
                            { breakfast: 'Sữa, Bún chả', lunch: 'Cơm, Thịt bò xào, Canh mồng tơi', dinner: 'Cháo thịt gà, Sữa chua' },
                            { breakfast: 'Sữa, Mì trứng', lunch: 'Cơm, Thịt kho trứng, Canh rau', dinner: 'Súp cua, Cam' },
                            { breakfast: 'Sữa, Bánh ngọt, Chuối', lunch: 'Cơm, Gà chiên giòn, Canh bí xanh', dinner: 'Cháo cá, Sữa' },
                            { breakfast: 'Sữa, Bánh bao, Trứng luộc', lunch: 'Cơm, Tôm rim, Canh rau cải', dinner: 'Cháo đậu xanh, Trái cây' },
                            { breakfast: 'Sữa, Xôi gấc', lunch: 'Cơm, Thịt bò xào rau, Canh bí đỏ', dinner: 'Cháo thịt nạc, Sữa' },
                          ],
                          '4': [ // 4 tuổi - bắt đầu có khẩu phần gần giống người lớn hơn
                            { breakfast: 'Sữa, Bún bò Huế', lunch: 'Cơm, Gà rô-ti, Canh mồng tơi', dinner: 'Súp rau củ, Bánh mì' },
                            { breakfast: 'Sữa, Xôi đậu, Trứng chiên', lunch: 'Cơm, Cá kho tộ, Canh cải', dinner: 'Cháo thịt, Cam' },
                            { breakfast: 'Sữa, Mì xào rau củ', lunch: 'Cơm, Thịt bò xào, Canh bí đỏ', dinner: 'Súp gà nấm, Trái cây' },
                            { breakfast: 'Sữa, Bánh mì bơ sữa', lunch: 'Cơm, Tôm chiên, Canh rau dền', dinner: 'Cháo cá thu, Sữa chua' },
                            { breakfast: 'Sữa, Phở gà', lunch: 'Cơm, Gà kho gừng, Canh rau ngót', dinner: 'Cháo thịt bằm, Bánh flan' },
                            { breakfast: 'Sữa, Bánh bao, Cam', lunch: 'Cơm, Thịt viên, Canh rau muống', dinner: 'Cháo cua đồng, Dưa hấu' },
                            { breakfast: 'Sữa, Bánh ngọt, Dưa hấu', lunch: 'Cơm, Thịt kho tàu, Canh rau cải', dinner: 'Súp trứng, Chuối' },
                          ],
                          '5': [ // 5 tuổi - chuẩn bị vào lớp 1, ăn như người lớn, ít hạn chế
                            { breakfast: 'Sữa, Bún riêu', lunch: 'Cơm, Cá sốt cà, Canh cải ngọt', dinner: 'Cháo gà, Bánh mì, Sữa' },
                            { breakfast: 'Sữa, Bánh mì thịt nguội', lunch: 'Cơm, Gà kho, Canh rau dền', dinner: 'Cháo tôm, Trái cây' },
                            { breakfast: 'Sữa, Xôi ruốc', lunch: 'Cơm, Thịt bò xào, Canh mướp', dinner: 'Súp trứng, Sữa chua' },
                            { breakfast: 'Sữa, Mì Ý', lunch: 'Cơm, Thịt heo rim, Canh bí xanh', dinner: 'Cháo thịt, Dưa hấu' },
                            { breakfast: 'Sữa, Bánh cuốn', lunch: 'Cơm, Cá hấp gừng, Canh rau ngót', dinner: 'Súp gà, Chuối' },
                            { breakfast: 'Sữa, Bánh bao nhân trứng', lunch: 'Cơm, Tôm rang, Canh rau cải', dinner: 'Cháo đậu xanh, Sữa' },
                            { breakfast: 'Sữa, Bánh mì bơ đậu phộng', lunch: 'Cơm, Thịt viên sốt, Canh rau muống', dinner: 'Cháo tim, Dưa lưới' },
                          ],
                        };
                        const selectedWeekMenus = autoMenusByDay[String(ageCategory)];
                        if (selectedWeekMenus && selectedWeekMenus[selectedDayIndex]) {
                          const selected = selectedWeekMenus[selectedDayIndex];
                          const newMenus = [...dailyMenus];
                          newMenus[selectedDayIndex].breakfast = selected.breakfast;
                          newMenus[selectedDayIndex].lunch = selected.lunch;
                          newMenus[selectedDayIndex].dinner = selected.dinner;
                          setDailyMenus(newMenus);
                        } else {
                          toast.warn("Chưa có dữ liệu thực đơn cho độ tuổi hoặc ngày này.");
                        }
                      }}
                    >
                      Tự động điền món cho độ tuổi này
                    </Button>
                  </Box>
                )}
                <Typography fontStyle="italic" color="#4194cb" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
                  Tuần từ {dayjs(weekStart).format("DD/MM")} đến {dayjs(weekStart).add(6, "day").format("DD/MM")}
                </Typography>
                <TextField
                  label="🌞 Món sáng"
                  variant="standard"
                  value={dailyMenus[selectedDayIndex].breakfast}
                  onChange={(e) => handleMealChange(selectedDayIndex, "breakfast", e.target.value)}
                  fullWidth
                  multiline
                  disabled={isPast}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="🍽️ Món trưa"
                  variant="standard"
                  value={dailyMenus[selectedDayIndex].lunch}
                  onChange={(e) => handleMealChange(selectedDayIndex, "lunch", e.target.value)}
                  fullWidth
                  multiline
                  disabled={isPast}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="💤 Món chiều"
                  variant="standard"
                  value={dailyMenus[selectedDayIndex].dinner}
                  onChange={(e) => handleMealChange(selectedDayIndex, "dinner", e.target.value)}
                  fullWidth
                  multiline
                  disabled={isPast}
                  sx={{ mb: 2 }}
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
