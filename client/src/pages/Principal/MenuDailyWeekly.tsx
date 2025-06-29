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
} from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BrunchDiningIcon from "@mui/icons-material/BrunchDining";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);
import { useState, useEffect } from "react";  
import { getWeeklyMenuByDate } from "../../services/ApiServices";
import { useNavigate } from "react-router-dom"; // thêm ở đầu file

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

export default function WeeklyMenuPage() {
  const [weekStart, setWeekStart] = useState(dayjs().startOf("week").add(1, "day"));
  const [menuData, setMenuData] = useState<DailyMenu[]>([]);
  const navigate = useNavigate(); // thêm trong component
  useEffect(() => {
    const fetchData = async () => {
      try {
        const menus = await getWeeklyMenuByDate(weekStart.format("YYYY-MM-DD"));
        setMenuData(menus);
      } catch (error) {
        console.error("Lỗi tải thực đơn:", error);
        setMenuData([]);
      }
    };

    fetchData();
  }, [weekStart]);

  const getMeal = (date: string, meal: keyof DailyMenu): JSX.Element => {
    const day = menuData.find((d) => dayjs(d.date).isSame(date, "day"));
    const mealValue = day ? day[meal] : [];
    return Array.isArray(mealValue) && mealValue.length > 0 ? (
      <>
        {mealValue.map((item, idx) => (
          <div key={idx} style={{ padding: "2px 0", fontSize: "14px" }}>🍽️ {item.dishName}</div>
        ))}
      </>
    ) : (
      <>-</>
    );
  };

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));

  const getMealLabel = (mealKey: keyof DailyMenu) => {
    switch (mealKey) {
      case "breakfast":
        return <><BrunchDiningIcon fontSize="small" sx={{ mr: 1 }} />Sáng</>;
      case "lunch":
        return <><LunchDiningIcon fontSize="small" sx={{ mr: 1 }} />Trưa</>;
      case "dinner":
        return <><DinnerDiningIcon fontSize="small" sx={{ mr: 1 }} />Chiều</>;
      default:
        return mealKey;
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#fefefe",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        fontFamily: 'Comic Sans MS',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: "bold",
          color: "#e6687a",
        }}
      >
        <RestaurantMenuIcon sx={{ color: "#4194cb" }} /> Thực đơn tuần vui nhộn 🎉
      </Typography>

<Paper
  sx={{
    p: 2,
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 2,
    backgroundColor: "#e3f2fd",
  }}
>
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <CalendarMonthIcon sx={{ color: "#4194cb" }} />
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Chọn ngày trong tuần"
        value={weekStart}
        onChange={(newValue) => {
          if (newValue) setWeekStart(newValue.startOf("week").add(1, "day"));
        }}
        format="DD/MM/YYYY"
      />
    </LocalizationProvider>
  </Box>
  <Button
    variant="contained"
    sx={{ backgroundColor: "#4194cb", color: "#fff", whiteSpace: "nowrap" }}
    onClick={() => navigate("/principal-home/menu-management")}
  >
    ➕ Tạo mới thực đơn tuần
  </Button>
</Paper>

      <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: "#f9f9f9" }}>
        {menuData.length === 0 ? (
          <Alert severity="info">Chưa có thực đơn cho tuần này.</Alert>
        ) : (
          <TableContainer>
            <Table sx={{ border: '2px solid #4194cb', minWidth: 650 }} size="small" aria-label="timetable">
              <TableHead sx={{ backgroundColor: '#46a2da' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", border: '1px solid #3982b8', fontSize: '16px', color: 'white' }}>🍽️ Buổi</TableCell>
                  {daysOfWeek.map((day) => (
                    <TableCell key={day.toString()} align="center" sx={{ border: '1px solid #3982b8', fontWeight: 'bold', fontSize: '14px', color: 'white' }}>
                      {day.format("dddd, DD/MM")}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(["breakfast", "lunch", "dinner"] as (keyof DailyMenu)[]).map((mealKey) => (
                  <TableRow key={mealKey}>
                    <TableCell sx={{ fontWeight: 500, border: '1px solid #ccc', whiteSpace: 'nowrap', backgroundColor: '#f0f8ff' }}>
                      {getMealLabel(mealKey)}
                    </TableCell>
                    {daysOfWeek.map((day) => (
                      <TableCell key={day.toString()} sx={{ border: '1px solid #ccc', whiteSpace: 'pre-wrap' }}>
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
    </Box>
  );
}
