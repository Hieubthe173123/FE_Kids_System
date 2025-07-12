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
      <Typography variant="h6" gutterBottom>
        Danh sách các lớp giáo viên dạy
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên lớp</TableCell>
              <TableCell>Khối</TableCell>
              <TableCell>Năm học</TableCell>
              <TableCell>Phòng học</TableCell>
              <TableCell>Sĩ số</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls._id}>
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