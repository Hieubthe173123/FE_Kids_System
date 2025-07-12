import { useEffect, useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Schedules from './Schedules';
import Information from './Information';
import scheduleData from "../../data/schedules.json";
import { getStudentsByParentId, getStudentClassInfo } from '../../services/ParentApi';

interface Student {
    id: string;
    name: string;
    age: number;
}

export default function TimeTable() {
    const currentClassData = scheduleData[0];

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
        morning: true,
        afternoon: true,
    });

    const [childrenList, setChildrenList] = useState<Student[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string>("");

    const [currentClassInfo, setCurrentClassInfo] = useState<{
        name: string;
        teacher: string;
        year: string;
    } | undefined>(undefined);

    const selectedDayjs = dayjs(selectedDate);
    const startOfWeek = selectedDayjs.startOf('isoWeek');

    const weeklySchedules = useMemo(() => {
        const morningSchedule: any = {};
        const afternoonSchedule: any = {};

        if (currentClassData?.schedule) {
            for (const [day, activities] of Object.entries(currentClassData.schedule)) {
                const morningActivities: any[] = [];
                const afternoonActivities: any[] = [];

                (activities as any[]).forEach((item) => {
                    const startHour = parseInt(item.time.split('-')[0].split(':')[0], 10);
                    const scheduleItem = { time: item.time, subject: item.activity };

                    if (startHour < 14) morningActivities.push(scheduleItem);
                    else afternoonActivities.push(scheduleItem);
                });

                if (morningActivities.length > 0) morningSchedule[day] = morningActivities;
                if (afternoonActivities.length > 0) afternoonSchedule[day] = afternoonActivities;
            }
        }

        return { morningSchedule, afternoonSchedule };
    }, [currentClassData]);

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

        const fetchStudents = async () => {
            try {
                const res = await getStudentsByParentId(parentId);
                if (res.students && res.students.length > 0) {
                    setChildrenList(res.students);
                    setSelectedChildId(res.students[0].id);
                }
            } catch (err) {
                console.error("Failed to load students:", err);
            }
        };

        fetchStudents();
    }, []);

    useEffect(() => {
        const fetchClassInfo = async () => {
            if (!selectedChildId) return;

            try {
                const res = await getStudentClassInfo(selectedChildId);
                setCurrentClassInfo({
                    name: res.className || "Chưa có lớp",
                    teacher: res.teacher || "Chưa có giáo viên",
                    year: res.schoolYear || "Chưa rõ",
                });
            } catch (error) {
                console.error("Không lấy được thông tin lớp học:", error);
                setCurrentClassInfo(undefined);
            }
        };

        fetchClassInfo();
    }, [selectedChildId]);


    return (
        <Box sx={{ p: 4, minHeight: '100vh', bgcolor: '#f5f7fb' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#0d47a1' }}>
                📘 Thời khóa biểu Lớp {currentClassData.class}
            </Typography>

            <Information
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                currentClassInfo={currentClassInfo}
                childrenList={childrenList}
                selectedChildId={selectedChildId}
                onChildChange={(id: string) => setSelectedChildId(id)}
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
