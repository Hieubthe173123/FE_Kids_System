import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

interface Class {
  _id: string;
  className: string;
  classAge?: number;
  schoolYear?: string;
  room?: {
    roomName: string;
  };
  studentCount?: number;
}

interface ClassesTabProps {
  classes: Class[];
}

const ClassesTab = ({ classes }: ClassesTabProps) => {
  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#4194cb' }}>
        Danh sách các lớp giáo viên dạy
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, bgcolor: '#f9fbfc', boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#4194cb' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Tên lớp</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Khối</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Năm học</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Phòng học</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Sĩ số</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((cls, idx) => (
              <TableRow key={cls._id} sx={{ backgroundColor: idx % 2 === 0 ? '#eaf6fd' : '#ffffff' }}>
                <TableCell>{cls.className}</TableCell>
                <TableCell>{cls.classAge}</TableCell>
                <TableCell>{cls.schoolYear}</TableCell>
                <TableCell>{cls.room?.roomName}</TableCell>
                <TableCell>{cls.studentCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClassesTab;