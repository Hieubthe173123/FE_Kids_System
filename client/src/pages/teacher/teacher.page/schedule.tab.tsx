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
        const res = await getScheduleByClassId(classId);
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
  }, [classId]);

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
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#4194cb" }}>
              <TableCell sx={{ width: "10%", color: "#fff", fontWeight: 700 }}>Thời gian</TableCell>
              {weekdays.map((day) => (
                <TableCell key={day} sx={{ width: "18%", color: "#fff", fontWeight: 700 }}>
                  {weekdayLabels[day]}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {uniqueTimes.map((time) => (
              <TableRow key={time}>
                <TableCell sx={{ fontWeight: 600 }}>{time}</TableCell>
                {weekdays.map((day) => {
                  const activity = scheduleData?.schedule[day]?.find(
                    (a) => a.time === time
                  );
                  return (
                    <TableCell key={`${day}-${time}`}>
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
