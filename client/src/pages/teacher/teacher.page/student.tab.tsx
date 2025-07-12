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
        placeholder="Search"
        variant="outlined"
        fullWidth
        sx={{ maxWidth: 400, mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ảnh</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Mã học sinh</TableCell>
              <TableCell>Tuổi</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Lưu ý</TableCell>
              <TableCell>Phụ huynh</TableCell>
              <TableCell>Thông tin phụ huynh</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student._id}>
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