import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { getScheduleByClassId } from "../../../services/teacher.service";

interface Curriculum {
  _id: string;
  activityName: string;
  activityFixed: boolean;
  age: string;
}

interface Activity {
  time: string;
  fixed: boolean;
  curriculum: Curriculum;
}

interface DaySchedule {
  [key: string]: Activity[];
}

interface Room {
  _id: string;
  roomName: string;
}

interface ClassData {
  _id: string;
  className: string;
  classAge: string;
  schoolYear: string;
  room: Room;
}

interface ScheduleData {
  _id: string;
  class: ClassData;
  schedule: DaySchedule;
  schoolYear: string;
}

interface ScheduleTabProps {
  classId: string;
  selectedYear: string;
  selectedWeek: string;
  setSelectedYear: (year: string) => void;
  setSelectedWeek: (week: string) => void;
  weekOptions: { value: string; label: string }[];
}

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const weekdayLabels: Record<string, string> = {
  Monday: "Thứ 2",
  Tuesday: "Thứ 3",
  Wednesday: "Thứ 4",
  Thursday: "Thứ 5",
  Friday: "Thứ 6",
};

// Hàm lấy ngày/tháng cho từng thứ trong tuần dựa vào tuần và năm
function getDatesOfWeek(year: string, week: string): Record<string, string> {
  // week: số tuần, year: năm
  // Tuần bắt đầu từ thứ 2
  const weekNumber = parseInt(week, 10);
  const y = parseInt(year, 10);
  // Tìm ngày đầu tuần (thứ 2)
  const firstDayOfYear = new Date(y, 0, 1);
  const firstMondayOffset = (8 - firstDayOfYear.getDay()) % 7;
  const firstMonday = new Date(y, 0, 1 + firstMondayOffset);
  // Ngày thứ 2 của tuần cần lấy
  const mondayOfWeek = new Date(firstMonday.getTime());
  mondayOfWeek.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
  const dates: Record<string, string> = {};
  for (let i = 0; i < weekdays.length; i++) {
    const d = new Date(mondayOfWeek.getTime());
    d.setDate(mondayOfWeek.getDate() + i);
    dates[weekdays[i]] = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
  }
  return dates;
}

const ScheduleTab = ({
  classId,
  selectedYear,
  selectedWeek,
  setSelectedYear,
  setSelectedWeek,
  weekOptions,
}: ScheduleTabProps) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [uniqueTimes, setUniqueTimes] = useState<string[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await getScheduleByClassId(classId, selectedYear, selectedWeek);
        setScheduleData(res);

        // Lấy ra các ca giờ duy nhất từ tất cả các ngày
        const timeSet = new Set<string>();
        weekdays.forEach((day) => {
          res.schedule[day]?.forEach((activity: Activity) => {
            timeSet.add(activity.time);
          });
        });

        setUniqueTimes(Array.from(timeSet).sort());
      } catch (err) {
        console.error("Lỗi khi lấy lịch dạy", err);
      }
    };
    if (classId) fetchSchedule();
  }, [classId, selectedYear, selectedWeek]);

  return (
    <Box mt={3} paddingBottom={10} >
      <Stack direction="row" spacing={2} mb={2}>
        <FormControl sx={{ minWidth: 120, bgcolor: "white", borderRadius: 2 }}>
          <Select
            value={selectedYear}
            onChange={(e) => {
              const newYear = e.target.value;
              setSelectedYear(newYear);
              setSelectedWeek("1");
            }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Chọn năm
            </MenuItem>
            {["2024", "2025", "2026"].map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 180, bgcolor: "white", borderRadius: 2 }}>
          <Select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Chọn tuần
            </MenuItem>
            {weekOptions.map((week) => (
              <MenuItem key={week.value} value={week.value}>
                {week.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 3, bgcolor: "#f9fbfc", boxShadow: 2 }}>
        <Table sx={{ borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#4194cb" }}>
              <TableCell
                sx={{
                  width: "10%",
                  color: "#fff",
                  fontWeight: 700,
                  border: "1px solid #bdbdbd",
                }}
              >
                Thời gian
              </TableCell>
              {weekdays.map((day) => (
                <TableCell
                  key={day}
                  sx={{
                    width: "18%",
                    color: "#fff",
                    fontWeight: 700,
                    border: "1px solid #bdbdbd",
                  }}
                >
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <span>{weekdayLabels[day]}</span>
                    <span style={{ fontSize: 20, color: "#e3e3e3", fontWeight: 600 }}>
                      {selectedYear && selectedWeek ? getDatesOfWeek(selectedYear, selectedWeek)[day] : ""}
                    </span>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {uniqueTimes.map((time) => (
              <TableRow key={time}>
                <TableCell sx={{ fontWeight: 600, border: "1px solid #bdbdbd" }}>{time}</TableCell>
                {weekdays.map((day) => {
                  const activity = scheduleData?.schedule[day]?.find(
                    (a) => a.time === time
                  );
                  return (
                    <TableCell key={`${day}-${time}`} sx={{ border: "1px solid #bdbdbd" }}>
                      {activity ? activity.curriculum.activityName : "-"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ScheduleTab;
