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
} from "../../services/ApiServices";
import { toast } from "react-toastify";

export default function WeeklyMenuCRUD() {
  const [menus, setMenus] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [weekStart, setWeekStart] = useState("");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [dailyMenus, setDailyMenus] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

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
    await deleteWeeklyMenu(id);
    fetchMenus();
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
      // if (dayjs(weekStart).isBefore(dayjs(), "day") && !editData) {
      //   setErrorMsg("Không thể tạo thực đơn cho tuần đã trôi qua.");
      //   return;
      // }

      // const startOfThisWeek = dayjs().startOf('week').add(1, 'day'); // nếu tuần bắt đầu từ Thứ 2
      // if (dayjs(weekStart).isBefore(startOfThisWeek) && !editData) {
      const startOfSelectedWeek = dayjs(weekStart).startOf('week');
      const startOfCurrentWeek = dayjs().startOf('week');

      // Nếu tuần được chọn < tuần hiện tại → chặn
      if (startOfSelectedWeek.isBefore(startOfCurrentWeek, 'week')) {
        setErrorMsg("Không thể tạo hoặc sửa thực đơn cho tuần đã trôi qua.");
        return;
      }
      const payload = {
        weekStart,
        dailyMenus: dailyMenus.map((d) => ({
          date: d.date,
          breakfast: parseDishes(d.breakfast),
          lunch: parseDishes(d.lunch),
          dinner: parseDishes(d.dinner),
        })),
      };

      if (editData) {
        await updateWeeklyMenu(editData._id, payload);
      } else {
        const existing = menus.find((m) =>
          dayjs(m.weekStart).isSame(weekStart, "day")
        );
        if (existing) {
          await updateWeeklyMenu(existing._id, payload);
        } else {
          await createWeeklyMenu(payload);
        }
      }
      setOpenDialog(false);
      setEditData(null);
      setErrorMsg("");
      fetchMenus();
    } catch (err) {
      console.error("Error saving weekly menu", err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3} fontWeight="bold" color="#4194cb">
        Quản lý thực đơn theo tuần
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        mb={2}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: "#e6687a" }}
          onClick={() => {
            setOpenDialog(true);
            setEditData(null);
            setErrorMsg("");
            // const defaultStart = dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD");
            const defaultStart = dayjs().startOf("isoWeek").format("YYYY-MM-DD"); // luôn là thứ Hai
            setWeekStart(defaultStart);
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
          onClick={() => navigate("/principal-home/menu-dailyWeekly")}
        >
          Xem thực đơn chi tiết
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#d5f0ff" }}>
            <TableRow>
              <TableCell><strong>STT</strong></TableCell>
              <TableCell><strong>Ngày bắt đầu tuần</strong></TableCell>
              <TableCell><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menus.map((menu, index) => (
              <TableRow key={menu._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{dayjs(menu.weekStart).format("DD/MM/YYYY")}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      const selectedWeek = dayjs(menu.weekStart).startOf('week'); // tuần bắt đầu
                      const currentWeekStart = dayjs().startOf('week'); // đầu tuần hiện tại

                      if (selectedWeek.isBefore(currentWeekStart)) {
                        toast.error("⛔ Không thể chỉnh sửa thực đơn của tuần đã trôi qua.");
                        return;
                      }

                      setEditData(menu);
                      const newStart = dayjs(menu.weekStart).format("YYYY-MM-DD");
                      setWeekStart(newStart);
                      setDailyMenus(
                        menu.dailyMenus.map((d: any) => ({
                          date: dayjs(d.date).format("YYYY-MM-DD"),
                          breakfast: d.breakfast.map((m: any) => m.dishName).join(", "),
                          lunch: d.lunch.map((m: any) => m.dishName).join(", "),
                          dinner: d.dinner.map((m: any) => m.dishName).join(", "),
                        }))
                      );
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(menu._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Custom Styled Dialog --- */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundImage: `url("/images/bg-kindergarten.png")`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            padding: 3,
            fontFamily: "'Fredoka', 'Comic Sans MS', cursive",
            color: "#333",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ff6f61" }}>
          {editData ? "🎨 Cập nhật thực đơn tuần" : "🧸 Tạo mới thực đơn tuần"}
        </DialogTitle>

        <DialogContent>
          {errorMsg && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <TextField
            type="date"
            label="📅 Ngày bắt đầu tuần"
            value={dayjs(weekStart).format("YYYY-MM-DD")}
            onChange={(e) => {
              const newStart = getStartOfWeek(e.target.value); // ⬅️ Luôn về thứ Hai

              const exists = menus.find((m) =>
                dayjs(m.weekStart).isoWeek() === dayjs(newStart).isoWeek() &&
                dayjs(m.weekStart).year() === dayjs(newStart).year()
              );

              if (exists && !editData) {
                setErrorMsg("⛔ Tuần này đã có thực đơn. Vui lòng chọn tuần khác hoặc sửa thực đơn cũ.");
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
            sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
          />

          <Tabs
            value={selectedDayIndex}
            onChange={(_, newVal) => setSelectedDayIndex(newVal)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 2,
              backgroundColor: "#fff8e1",
              borderRadius: 2,
              ".Mui-selected": { color: "#ff6f61" },
            }}
          >
            {dailyMenus.map((menu, idx) => (
              <Tab key={idx} label={dayjs(menu.date).format("dddd").toUpperCase()} />
            ))}
          </Tabs>

          {dailyMenus[selectedDayIndex] && (
            <Box>
              <Typography fontStyle="italic" color="gray" sx={{ mb: 2 }}>
                Tuần từ {dayjs(weekStart).format("DD/MM")} đến{" "}
                {dayjs(weekStart).add(6, "day").format("DD/MM")}
              </Typography>
              <TextField
                label="🌞 Món sáng"
                value={dailyMenus[selectedDayIndex].breakfast}
                onChange={(e) =>
                  handleMealChange(selectedDayIndex, "breakfast", e.target.value)
                }
                fullWidth
                multiline
                sx={{ mb: 2, backgroundColor: "#fff", borderRadius: 1 }}
              />
              <TextField
                label="🍽️ Món trưa"
                value={dailyMenus[selectedDayIndex].lunch}
                onChange={(e) =>
                  handleMealChange(selectedDayIndex, "lunch", e.target.value)
                }
                fullWidth
                multiline
                sx={{ mb: 2, backgroundColor: "#fff", borderRadius: 1 }}
              />
              <TextField
                label="💤 Món chiều"
                value={dailyMenus[selectedDayIndex].dinner}
                onChange={(e) =>
                  handleMealChange(selectedDayIndex, "dinner", e.target.value)
                }
                fullWidth
                multiline
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: "#ff6f61" }}>
            ❌ Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ backgroundColor: "#4caf50", color: "white" }}
          >
            ✅ Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
