import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
} from "@mui/material";

interface Student {
  _id: string;
  fullName: string;
  studentCode: string;
  age: number;
  gender: string;
  address: string;
  image?: string;
  note?: string;
  parent?: {
    fullName: string;
    phone?: string;
    email?: string;
    address?: string;
    job?: string;
  };
}

interface StudentsTabProps {
  students: Student[];
  setSelectedStudent: (student: Student | null) => void;
  setOpenModal: (open: boolean) => void;
}

const StudentsTab = ({ students, setSelectedStudent, setOpenModal }: StudentsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter((student) => {
    const term = searchTerm.toLowerCase();
    return (
      student.fullName.toLowerCase().includes(term) ||
      student.studentCode.toLowerCase().includes(term) ||
      String(student.age).includes(term) ||
      student.gender.toLowerCase().includes(term) ||
      student.address.toLowerCase().includes(term) ||
      (student.parent?.fullName?.toLowerCase().includes(term) ?? false)
    );
  });

  return (
    <Box mt={3}>
      <TextField
        placeholder="Tìm kiếm học sinh..."
        variant="outlined"
        fullWidth
        sx={{ maxWidth: 400, mb: 2, bgcolor: 'white', borderRadius: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TableContainer component={Paper} sx={{ borderRadius: 3, bgcolor: '#f9fbfc', boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#4194cb' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Ảnh</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Họ tên</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Mã học sinh</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Tuổi</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Giới tính</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Địa chỉ</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Lưu ý</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Phụ huynh</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Thông tin phụ huynh</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student, idx) => (
              <TableRow key={student._id} sx={{ backgroundColor: idx % 2 === 0 ? '#eaf6fd' : '#ffffff' }}>
                <TableCell>
                  <Avatar src={student.image || ""} />
                </TableCell>
                <TableCell>{student.fullName}</TableCell>
                <TableCell>{student.studentCode}</TableCell>
                <TableCell>{student.age}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.address}</TableCell>
                <TableCell>{student.note}</TableCell>
                <TableCell>{student.parent?.fullName || "Không có"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    sx={{ borderRadius: 2, color: '#4194cb', borderColor: '#4194cb', fontWeight: 600 }}
                    onClick={() => {
                      setSelectedStudent(student);
                      setOpenModal(true);
                    }}
                  >
                    Xem
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudentsTab;