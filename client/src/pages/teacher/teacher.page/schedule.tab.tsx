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
import { getTimeTable } from "../../../services/teacher.service";

interface Schedule {
  _id: string;
  class: { className: string };
  room: { roomName: string };
  dayOfWeek: string;
  timeSlot: string;
  startTime: string;
  endTime: string;
  subject: string;
  studentCount: number;
}

interface ScheduleTabProps {
  selectedYear: string;
  selectedWeek: string;
  setSelectedYear: (year: string) => void;
  setSelectedWeek: (week: string) => void;
  weekOptions: { value: string; label: string }[];
}

const ScheduleTab = ({
  selectedYear,
  selectedWeek,
  setSelectedYear,
  setSelectedWeek,
  weekOptions,
}: ScheduleTabProps) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await getTimeTable({ year: selectedYear, week: selectedWeek });
        setSchedules(res.data.schedules);
      } catch (err) {
        console.error("Lỗi khi lấy lịch dạy", err);
      }
    };
    if (selectedYear && selectedWeek) fetchSchedule();
  }, [selectedYear, selectedWeek]);

  return (
    <Box mt={3}>
      <Stack direction="row" spacing={2} mb={2}>
        <FormControl>
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
            {[2024, 2025, 2026].map((y) => (
              <MenuItem key={y} value={y.toString()}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Môn</TableCell>
              <TableCell>Thứ</TableCell>
              <TableCell>Ca</TableCell>
              <TableCell>Phòng</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Sĩ số</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.subject}</TableCell>
                <TableCell>{item.dayOfWeek}</TableCell>
                <TableCell>{item.timeSlot}</TableCell>
                <TableCell>{item.room.roomName}</TableCell>
                <TableCell>{item.startTime} - {item.endTime}</TableCell>
                <TableCell>{item.studentCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ScheduleTab;