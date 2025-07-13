import { useEffect, useState } from "react";
import {
  Box, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, TextField, MenuItem, Select, FormControl,  Typography
} from "@mui/material";
import { getAttendanceToday, getTeacherClass } from "../../../services/teacher.service"; // Gọi API getOrCreateTodayAttendance

interface Student {
  _id: string;
  fullName: string;
  studentCode: string;
}

interface Attendance {
  _id: string;
  studentId: Student;
  status: "present" | "absent" | "sick" | "leave";
  checkInTime: string;
  checkOutTime: string;
  note: string;
}



const AttendancePage = () => {
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [classId, setClassId] = useState<string>("");

  useEffect(() => {
    const fetchTeacherClass = async () => {
      const res = await getTeacherClass();
      setClassId(res.data[0]._id);
    };
    fetchTeacherClass();
  }, []);

  useEffect(() => {
  
    const fetchAttendance = async () => {
      try {
        const res = await getAttendanceToday(classId);
        console.log("Check res:", res);
        setAttendanceList(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy điểm danh:", err);
      }
    };
    if (classId) fetchAttendance();
  }, [classId]);

  const handleChange = (index: number, field: keyof Attendance, value: any) => {
    const updated = [...attendanceList];
    (updated[index] as any)[field] = value;
    setAttendanceList(updated);
  };

  return (
    <Box mt={3}>
      <Typography variant="h6" mb={2} fontWeight={600}>Điểm danh hôm nay</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#1976d2" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>STT</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Học sinh</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Giờ vào</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Giờ ra</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceList.map((record, index) => (
              <TableRow key={record._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{record.studentId.fullName}</TableCell>
                <TableCell>
                  <FormControl fullWidth size="small">
                    <Select
                      value={record.status}
                      onChange={(e) => handleChange(index, "status", e.target.value)}
                    >
                      <MenuItem value="present">Có mặt</MenuItem>
                      <MenuItem value="absent">Vắng</MenuItem>
                      <MenuItem value="sick">Ốm</MenuItem>
                      <MenuItem value="leave">Nghỉ phép</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="time"
                    value={record.checkInTime}
                    onChange={(e) => handleChange(index, "checkInTime", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="time"
                    value={record.checkOutTime}
                    onChange={(e) => handleChange(index, "checkOutTime", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={record.note}
                    onChange={(e) => handleChange(index, "note", e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendancePage;
