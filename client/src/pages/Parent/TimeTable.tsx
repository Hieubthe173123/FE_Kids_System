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
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Schedules from './Schedules';
import Information from './Information';
import {
    getStudentsByParentId,
    getStudentClassInfo,
    getScheduleByClassId,
    getAttendanceByStudentID,
    getAllHolidays
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
    const [holidays, setHolidays] = useState<Record<string, string>>({}); // key: yyyy-MM-dd, value: holiday name

    const selectedDayjs = dayjs(selectedDate);
    const startOfWeek = selectedDayjs.startOf('isoWeek');

    const weekDates = Array.from({ length: 7 }, (_, i) =>
        startOfWeek.add(i, 'day')
    );

    // Hàm lấy thông tin ngày nghỉ lễ cho cả tuần (dùng getAllHolidays)
    const fetchHolidaysForWeek = async (weekDates: dayjs.Dayjs[]) => {
        try {
            const allHolidays = await getAllHolidays();
            const holidayMap: Record<string, string> = {};
            weekDates.forEach((d) => {
                const dateStr = d.format('YYYY-MM-DD');
                const found = allHolidays.find((h: any) => h.date === dateStr);
                if (found) {
                    holidayMap[dateStr] = found.name;
                }
            });
            setHolidays(holidayMap);
        } catch (err) {
            setHolidays({});
        }
    };

    const weeklySchedules = useMemo(() => {
        const morningSchedule: any = {};
        const afternoonSchedule: any = {};

        if (scheduleDataByClass) {
            for (const [day, activities] of Object.entries(scheduleDataByClass)) {
                // day có thể là '2025-07-14' dạng yyyy-MM-dd
                const isHoliday = holidays[day];
                if (isHoliday) {
                    // Nếu là ngày nghỉ lễ, ẩn hoạt động, chỉ hiển thị tên ngày nghỉ lễ
                    morningSchedule[day] = [{ time: '', subject: isHoliday }];
                    afternoonSchedule[day] = [{ time: '', subject: isHoliday }];
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
    }, [scheduleDataByClass, holidays]);

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
                console.error("Failed to load students or attendance:", err);
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
                const scheduleRes = await getScheduleByClassId(res.classId);
                // Dịch activityName sang tiếng Việt trước khi set state
                const translated = translateSchedule(scheduleRes.schedule || {});
                setScheduleDataByClass(translated);
                // Lấy ngày nghỉ lễ cho tuần hiện tại
                await fetchHolidaysForWeek(weekDates);
            }
            try {
                const attendanceRes = await getAttendanceByStudentID(studentId);
                if (attendanceRes.message === "No attendance records found for this student") {
                    setAttendanceData([]);
                } else {
                    setAttendanceData(attendanceRes.data || []);
                }
            } catch (attendanceError: any) {
                if (attendanceError?.response?.status === 404) {
                    setAttendanceData([]);
                } else {
                    console.error("Lỗi lấy điểm danh:", attendanceError);
                    setAttendanceData([]);
                }
            }
        } catch (error) {
            console.error("Không lấy được thông tin lớp hoặc thời khóa biểu:", error);
            setCurrentClassInfo(undefined);
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

            <Schedules
                title="🌞 Buổi sáng"
                panelKey="morning"
                expanded={expanded['morning']}
                onChange={handleAccordionChange}
                scheduleData={weeklySchedules.morningSchedule}
                startOfWeekDate={startOfWeek.format('YYYY-MM-DD')}
                holidays={holidays}
            />
            <Schedules
                title="🌙 Buổi chiều"
                panelKey="afternoon"
                expanded={expanded['afternoon']}
                onChange={handleAccordionChange}
                scheduleData={weeklySchedules.afternoonSchedule}
                startOfWeekDate={startOfWeek.format('YYYY-MM-DD')}
                holidays={holidays}
            />
        </Box>
    );
}
