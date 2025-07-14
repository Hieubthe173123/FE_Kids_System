import { useEffect, useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
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
    }, [scheduleDataByClass]);

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
                setScheduleDataByClass(scheduleRes.schedule || {});
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
            />
            <Schedules
                title="🌙 Buổi chiều"
                panelKey="afternoon"
                expanded={expanded['afternoon']}
                onChange={handleAccordionChange}
                scheduleData={weeklySchedules.afternoonSchedule}
                startOfWeekDate={startOfWeek.format('YYYY-MM-DD')}
            />
        </Box>
    );
}
