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
        <FormControl sx={{ minWidth: 120, bgcolor: 'white', borderRadius: 2 }}>
          <Select
            value={selectedYear}
            onChange={(e) => {
              const newYear = e.target.value;
              setSelectedYear(newYear);
              setSelectedWeek("1");
            }}
            displayEmpty
            sx={{ bgcolor: 'white', borderRadius: 2 }}
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
        <FormControl sx={{ minWidth: 180, bgcolor: 'white', borderRadius: 2 }}>
          <Select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            displayEmpty
            sx={{ bgcolor: 'white', borderRadius: 2 }}
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
      <TableContainer component={Paper} sx={{ borderRadius: 3, bgcolor: '#f9fbfc', boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#4194cb' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Môn</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Thứ</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Ca</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Phòng</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Thời gian</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Sĩ số</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((item, idx) => (
              <TableRow key={item._id} sx={{ backgroundColor: idx % 2 === 0 ? '#eaf6fd' : '#ffffff' }}>
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