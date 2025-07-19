import { useEffect, useState } from "react";
import { Box, Tabs, Tab, Typography, Paper } from "@mui/material";
import { getTeacherClasses, getStudentsInClass } from "../../../services/teacher.service";
import ScheduleTab from "./schedule.tab";
import StudentsTab from "./student.tab";
import ClassesTab from "./classs.tab";
import ParentInfoDialog from "./parent.info";

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

interface Student {
  _id: string;
  fullName: string;
  studentCode: string;
  age: number;
  gender: string;
  address: string;
  image?: string;
  parent?: {
    fullName: string;
    phone?: string;
    email?: string;
    address?: string;
    job?: string;
  };
}

const getWeeksOfYear = (year: number) => {
  const weeks: { value: string; label: string }[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  let current = new Date(start);
  let week = 1;

  while (current.getDay() !== 1) {
    current.setDate(current.getDate() + 1);
  }

  while (current <= end) {
    const weekStart = new Date(current);
    const weekEnd = new Date(current);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const formatDate = (date: Date) =>
      `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

    weeks.push({
      value: week.toString(),
      label: `Tuần ${week} - Từ ${formatDate(weekStart)} đến ${formatDate(weekEnd)}`,
    });

    current.setDate(current.getDate() + 7);
    week++;
  }

  return weeks;
};

const TeacherOverviewPage = () => {
  const [tab, setTab] = useState(0);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [weekOptions, setWeekOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getTeacherClasses();
        const classes = res.data.classes || [];
        setClasses(classes);
        const targetClasses = classes.filter((cls: any) => cls.schoolYear === "2025-2026");
        if (targetClasses.length > 0) {
          const firstClass = targetClasses[0];
          setSelectedClass(firstClass);
          const studentRes = await getStudentsInClass(firstClass._id);
          setStudents(studentRes.data.students || []);
        } else {
          console.warn("Không có lớp nào thuộc năm học 2025-2026");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách lớp:", error);
      }
    };

    fetchClasses();

    const today = new Date();
    const year = today.getFullYear();
    setSelectedYear(year.toString());

    const weeks = getWeeksOfYear(year);
    setWeekOptions(weeks);

    const firstMonday = new Date(year, 0, 1);
    while (firstMonday.getDay() !== 1) {
      firstMonday.setDate(firstMonday.getDate() + 1);
    }

    const daysDiff = Math.floor((today.getTime() - firstMonday.getTime()) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(daysDiff / 7) + 1;
    setSelectedWeek(currentWeek.toString());
  }, []);

  const handleTabChange = (_: any, newValue: number) => setTab(newValue);

  return (
    <Box sx={{ p: 4, minHeight: '100vh', bgcolor: '#f5f7fb' }}>
      {selectedClass && (
        <Paper elevation={2} sx={{ borderRadius: 3, p: 3, mb: 3, bgcolor: '#f9fbfc' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#4194cb' }}>
            👨‍🏫 Lớp dạy: {selectedClass.className} - Năm học: {selectedClass.schoolYear}
          </Typography>
        </Paper>
      )}
      <Paper elevation={2} sx={{ borderRadius: 3, p: 2, mb: 3, bgcolor: '#f9fbfc' }}>
        <Tabs value={tab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
          <Tab label="Lịch dạy" sx={{ fontWeight: 700, color: tab === 0 ? '#4194cb' : '#0d47a1' }} />
          <Tab label="Học sinh dạy" sx={{ fontWeight: 700, color: tab === 1 ? '#4194cb' : '#0d47a1' }} />
          <Tab label="Danh sách lớp" sx={{ fontWeight: 700, color: tab === 2 ? '#4194cb' : '#0d47a1' }} />
        </Tabs>
      </Paper>
      <Box>
        {tab === 0 && (
          <ScheduleTab
            classId={selectedClass?._id || ""}
            selectedYear={selectedYear}
            selectedWeek={selectedWeek}
            setSelectedYear={setSelectedYear}
            setSelectedWeek={setSelectedWeek}
            weekOptions={weekOptions}
          />
        )}
        {tab === 1 && (
          <StudentsTab
            students={students}
            setSelectedStudent={setSelectedStudent}
            setOpenModal={setOpenModal}
          />
        )}
        {tab === 2 && <ClassesTab classes={classes} />}
      </Box>
      <ParentInfoDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        selectedStudent={selectedStudent}
      />
    </Box>
  );
};

export default TeacherOverviewPage; 