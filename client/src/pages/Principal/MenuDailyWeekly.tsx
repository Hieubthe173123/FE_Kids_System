import {
  Box,
  Typography,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Container,
  Stack,
  type SelectChangeEvent,
} from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BrunchDiningIcon from "@mui/icons-material/BrunchDining";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/vi";
import { useState, useEffect, type JSX } from "react";
import { getWeeklyMenuByDate } from "../../services/PrincipalApi";
import { useNavigate } from "react-router-dom";

dayjs.extend(isoWeek);
dayjs.locale("vi");

interface MealItem {
  dishName: string;
  description?: string;
  calories?: number;
  _id?: string;
}

interface DailyMenu {
  date: string;
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  note?: string;
  _id?: string;
}

export default function WeeklyMenuPage(): JSX.Element {
  const [weekStart, setWeekStart] = useState<Dayjs>(dayjs().isoWeekday(1));
  const [menuData, setMenuData] = useState<DailyMenu[]>([]);
  const [ageCategory, setAgeCategory] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const menus = await getWeeklyMenuByDate(
          weekStart.format("YYYY-MM-DD"),
          ageCategory
        );
        setMenuData(menus);
      } catch (error) {
        console.error("Lỗi tải thực đơn:", error);
        setMenuData([]);
      }
    };

    fetchData();
  }, [weekStart, ageCategory]);

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setWeekStart(newValue.isoWeekday(1));
    }
  };

  const handleAgeChange = (event: SelectChangeEvent<number>) => {
    setAgeCategory(Number(event.target.value));
  };

  const getMeal = (date: string, meal: keyof DailyMenu): JSX.Element => {
    const day = menuData.find((d) => dayjs(d.date).isSame(date, "day"));
    const mealItems = day ? (day[meal] as MealItem[]) : [];

    if (!Array.isArray(mealItems) || mealItems.length === 0) {
      return <Typography variant="body2" color="text.secondary">-</Typography>;
    }

    return (
      <Stack spacing={0.5}>
        {mealItems.map((item, idx) => (
          <Typography key={item._id || idx} variant="body2">
            {item.dishName}
          </Typography>
        ))}
      </Stack>
    );
  };

  type MealType = "breakfast" | "lunch" | "dinner";
  const getMealLabel = (mealKey: MealType): JSX.Element => {
    const icons: Record<MealType, JSX.Element> = {
      breakfast: <BrunchDiningIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />,
      lunch: <LunchDiningIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />,
      dinner: <DinnerDiningIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />,
    };
    const labels: Record<MealType, string> = {
      breakfast: "Sáng",
      lunch: "Trưa",
      dinner: "Chiều",
    };
    return (
      <>
        {icons[mealKey]}
        {labels[mealKey]}
      </>
    );
  };

  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    weekStart.add(i, "day")
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <RestaurantMenuIcon color="primary" sx={{ fontSize: '2.5rem' }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Quản lý thực đơn tuần
            </Typography>
          </Stack>

          <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                <DatePicker {...({} as any)}
                  label="Chọn tuần"
                  value={weekStart}
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      InputProps: {
                        startAdornment: (
                          <CalendarMonthIcon color="action" sx={{ mr: 1 }} />
                        )
                      }
                    }
                  }}
                />
                <FormControl sx={{ minWidth: 150 }} size="medium">
                  <InputLabel id="age-label">Độ tuổi</InputLabel>
                  <Select
                    labelId="age-label"
                    value={ageCategory}
                    label="Độ tuổi"
                    onChange={handleAgeChange}
                  >
                    {[1, 2, 3, 4, 5].map((age) => (
                      <MenuItem key={age} value={age}>
                        Khối {age} tuổi
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => navigate("/principal-home/menu-management")}
                sx={{ whiteSpace: "nowrap" }}
              >
                Tạo thực đơn mới
              </Button>
            </Stack>
          </Paper>

          <Paper elevation={3} sx={{ width: "100%", overflow: "hidden", borderRadius: 3, boxShadow: 3, mt: 1 }}>
            {menuData.length === 0 ? (
              <Box sx={{ p: 4 }}>
                <Alert severity="info">
                  Chưa có dữ liệu thực đơn cho tuần được chọn.
                </Alert>
              </Box>
            ) : (
              <TableContainer component={Box} sx={{ background: '#fff', borderRadius: 3 }}>
                <Table sx={{ minWidth: 900, borderCollapse: 'separate', borderSpacing: 0 }} aria-label="menu table">
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(90deg, #4194cb 0%, #6ec6ff 100%)' }}>
                      <TableCell
                        align="center"
                        sx={{ color: '#fff', fontWeight: 700, fontSize: 17, borderTopLeftRadius: 12, borderBottom: 'none', letterSpacing: 0.5 }}
                      >
                        Buổi
                      </TableCell>
                      {daysOfWeek.map((day, idx) => (
                        <TableCell
                          key={day.toString()}
                          align="center"
                          sx={{
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: 16,
                            borderBottom: 'none',
                            ...(idx === daysOfWeek.length - 1 && { borderTopRightRadius: 12 })
                          }}
                        >
                          {day.format("dddd, DD/MM")}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(["breakfast", "lunch", "dinner"] as MealType[]).map((mealKey, rowIdx) => (
                      <TableRow
                        key={mealKey}
                        sx={{
                          backgroundColor: rowIdx % 2 === 0 ? '#f7fbff' : '#e3f2fd',
                          '&:hover': { backgroundColor: '#e1f5fe' },
                          transition: 'background 0.2s',
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          align="center"
                          sx={{ fontWeight: 600, fontSize: 15, minWidth: 120, borderRight: '1px solid #e0e0e0', letterSpacing: 0.2 }}
                        >
                          {getMealLabel(mealKey)}
                        </TableCell>
                        {daysOfWeek.map((day) => (
                          <TableCell
                            key={day.toString()}
                            align="center"
                            sx={{
                              fontSize: 15,
                              px: 2,
                              py: 1.5,
                              borderRight: '1px solid #e0e0e0',
                              borderBottom: rowIdx === 2 ? 'none' : '1px solid #e0e0e0',
                              minWidth: 120,
                            }}
                          >
                            {getMeal(day.format("YYYY-MM-DD"), mealKey)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Stack>
      </Container>
    </LocalizationProvider>
  );
}