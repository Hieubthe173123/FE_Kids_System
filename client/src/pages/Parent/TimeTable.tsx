import { useEffect, useState, useMemo } from 'react';
const activityNameMap: Record<string, string> = {
    "Arrival & Guided Free Play": "Đón trẻ & Chơi tự do có hướng dẫn",
    "Cognitive – exploration": "Khám phá nhận thức",
    "Gross & fine motor skills": "Vận động thô & tinh",
    "Light Physical Activity & Guided Free Play": "Hoạt động thể chất nhẹ & Chơi tự do có hướng dẫn",
    "Hygiene – Prepare for Lunch": "Vệ sinh – Chuẩn bị ăn trưa",
    "Lunch": "Ăn trưa",
    "Get Ready for Nap": "Chuẩn bị ngủ trưa",
    "Nap Time": "Giờ ngủ trưa",
    "Wake-up – Hygiene – Snack": "Thức dậy – Vệ sinh – Ăn nhẹ",
    "Communication – language": "Giao tiếp – Ngôn ngữ",
    "Afternoon Snack": "Ăn nhẹ buổi chiều",
    "Guided Free Play": "Chơi tự do có hướng dẫn",
    "Pick-up Time": "Giờ đón trẻ",
    "Physical activity": "Hoạt động thể chất",
    "Math introduction": "Giới thiệu Toán học",
    "Art": "Nghệ thuật",
    "Music": "Âm nhạc",
    "Alphabet introduction": "Giới thiệu Chữ cái",
    "Science & social exploration": "Khám phá khoa học & xã hội",
    "Literature introduction": "Giới thiệu Văn học",
    "Free Play / Light Movement": "Chơi tự do / Vận động nhẹ",
    "Free Play / Outdoor Activities": "Chơi tự do / Hoạt động ngoài trời",

};
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Hàm dịch activityName trong schedule
function translateSchedule(schedule: any) {
    if (!schedule) return {};
    const newSchedule: any = {};
    for (const [day, activities] of Object.entries(schedule)) {
        newSchedule[day] = (activities as any[]).map(item => ({
            ...item,
            curriculum: {
                ...item.curriculum,
                activityName: activityNameMap[item.curriculum.activityName] || item.curriculum.activityName
            }
        }));
    }
    return newSchedule;
}
import { Alert, Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Schedules from './Schedules';
import Information from './Information';
import {
    getStudentsByParentId,
    getStudentClassInfo,
    getScheduleByClassId,
    getAttendanceByStudentID
} from '../../services/ParentApi';
import AttendanceTable from './Attendance';

interface Student {
    id: string;
    name: string;
    age: number;
}

export default function TimeTable() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
        morning: true,
        afternoon: true,
    });

    const [childrenList, setChildrenList] = useState<Student[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [attendanceData, setAttendanceData] = useState<any[]>([]);

    const [currentClassInfo, setCurrentClassInfo] = useState<{
        name: string;
        teacher: string;
        year: string;
    } | undefined>(undefined);

    const [scheduleDataByClass, setScheduleDataByClass] = useState<any>(null);
    const vietnamHolidays: Record<string, string> = {
        '2025-01-01': 'Tết Dương lịch',
        '2025-04-30': 'Giải phóng miền Nam',
        '2025-05-01': 'Quốc tế Lao động',
        '2025-09-02': 'Quốc khánh',
        '2025-01-28': 'Tết Nguyên Đán',
        '2025-01-29': 'Tết Nguyên Đán',
        '2025-01-30': 'Tết Nguyên Đán',
        '2025-01-31': 'Tết Nguyên Đán',
        '2025-02-01': 'Tết Nguyên Đán',
        '2025-02-02': 'Tết Nguyên Đán',
    };

    const selectedDayjs = dayjs(selectedDate);
    const startOfWeek = selectedDayjs.startOf('isoWeek');

    const weekDates = Array.from({ length: 7 }, (_, i) =>
        startOfWeek.add(i, 'day')
    );

    const weeklySchedules = useMemo(() => {
        const morningSchedule: any = {};
        const afternoonSchedule: any = {};

        if (scheduleDataByClass) {
            for (const [day, activities] of Object.entries(scheduleDataByClass)) {
                if (vietnamHolidays[day]) {
                    morningSchedule[day] = [{ time: '', subject: vietnamHolidays[day] }];
                    afternoonSchedule[day] = [{ time: '', subject: vietnamHolidays[day] }];
                    continue;
                }
                const morningActivities: any[] = [];
                const afternoonActivities: any[] = [];

                (activities as any[]).forEach((item) => {
                    const startHour = parseInt(item.time.split('-')[0].split(':')[0], 10);
                    const scheduleItem = {
                        time: item.time,
                        subject: item.curriculum.activityName,
                    };

                    if (startHour < 12) morningActivities.push(scheduleItem);
                    else afternoonActivities.push(scheduleItem);
                });

                if (morningActivities.length > 0) morningSchedule[day] = morningActivities;
                if (afternoonActivities.length > 0) afternoonSchedule[day] = afternoonActivities;
            }
        }

        return { morningSchedule, afternoonSchedule };
    }, [scheduleDataByClass, vietnamHolidays]);

    const handleAccordionChange =
        (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded((prev) => ({
                ...prev,
                [panel]: isExpanded,
            }));
        };

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;

        const user = JSON.parse(userStr);
        const parentId = user._id;

        const fetchStudentsAndAttendance = async () => {
            try {
                const res = await getStudentsByParentId(parentId);
                if (res.students && res.students.length > 0) {
                    setChildrenList(res.students);
                    setSelectedChildId(res.students[0].id);
                    const attendanceRes = await getAttendanceByStudentID(res.students[0].id);
                    setAttendanceData(attendanceRes.data || []);
                }
            } catch (err) {
                setChildrenList([]);
            }
        };

        fetchStudentsAndAttendance();
    }, []);

    const fetchClassInfoAndScheduleAndAttendance = async (studentId: string) => {
        if (!studentId) return;
        try {
            const res = await getStudentClassInfo(studentId);
            setCurrentClassInfo({
                name: res.className || "Chưa có lớp",
                teacher: res.teacher || "Chưa có giáo viên",
                year: res.schoolYear || "Chưa rõ",
            });
            if (res.classId) {
                try {
                    const scheduleRes = await getScheduleByClassId(res.classId);
                    // Nếu không có lịch thì API trả về message, không log ra, chỉ hiển thị alert
                    if (scheduleRes?.message === "Schedule not found for this class") {
                        setScheduleDataByClass(null);
                    } else {
                        // Dịch activityName sang tiếng Việt trước khi set state
                        const translated = translateSchedule(scheduleRes.schedule || {});
                        setScheduleDataByClass(translated);
                    }
                } catch (scheduleError) {
                    setScheduleDataByClass(null);
                }
            } else {
                // Nếu chưa được xếp lớp, không có lịch học
                setScheduleDataByClass(null);
            }
            try {
                const attendanceRes = await getAttendanceByStudentID(studentId);
                if (attendanceRes.message === "No attendance records found for this student") {
                    setAttendanceData([]);
                } else {
                    setAttendanceData(attendanceRes.data || []);
                }
            } catch (attendanceError: any) {
                setAttendanceData([]);
            }
        } catch (error) {
            setCurrentClassInfo({ name: "---", teacher: "Chưa có giáo viên", year: "Chưa rõ" });
            setScheduleDataByClass(null);
        }
    };

    useEffect(() => {
        fetchClassInfoAndScheduleAndAttendance(selectedChildId);
    }, [selectedChildId]);

    return (
        <Box sx={{ p: 4, minHeight: '100vh', bgcolor: '#f5f7fb' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#0d47a1' }}>
                📘 Thời khóa biểu Lớp {currentClassInfo?.name || "?"}
            </Typography>

            <Information
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                currentClassInfo={currentClassInfo}
                childrenList={childrenList}
                selectedChildId={selectedChildId}
                onChildChange={(id: string) => setSelectedChildId(id)}
            />
            <AttendanceTable
                weekDates={weekDates}
                attendanceData={attendanceData}
            />

            {scheduleDataByClass ? (
                <>
                    <Schedules
                        title="🌞 Buổi sáng"
                        panelKey="morning"
                        expanded={expanded['morning']}
                        onChange={handleAccordionChange}
                        scheduleData={weeklySchedules.morningSchedule}
                        startOfWeekDate={startOfWeek.format('YYYY-MM-DD')}
                        holidays={vietnamHolidays}
                    />
                    <Schedules
                        title="🌙 Buổi chiều"
                        panelKey="afternoon"
                        expanded={expanded['afternoon']}
                        onChange={handleAccordionChange}
                        scheduleData={weeklySchedules.afternoonSchedule}
                        startOfWeekDate={startOfWeek.format('YYYY-MM-DD')}
                        holidays={vietnamHolidays}
                    />
                </>
            ) : (
                <Alert severity="info" icon={<InfoOutlinedIcon fontSize="inherit" />} sx={{ borderRadius: 2 }}>
                    Học sinh chưa được xếp vào lớp hoặc chưa có thời khóa biểu tuần này.
                </Alert>
            )}
        </Box>
    );
}
