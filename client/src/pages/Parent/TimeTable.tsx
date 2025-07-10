import { Box, Typography } from '@mui/material';
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import Schedules from './Schedules';
import Information from './Information';
import scheduleData from "../../data/schedules.json";

type ScheduleItem = {
    time: string;
    subject: string;
};

type ApiScheduleItem = {
    time: string;
    activity: string;
};

type WeeklyScheduleObject = {
    [key: string]: ScheduleItem[];
}

interface ClassInfo {
    name: string;
    teacher: string;
    year: string;
}

export default function TimeTable() {
    const currentClassData = scheduleData[0];

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
        morning: true,
        afternoon: true,
    });

    const selectedDayjs = dayjs(selectedDate);
    const startOfWeek = selectedDayjs.startOf('isoWeek');

    const weeklySchedules = useMemo(() => {
        const morningSchedule: WeeklyScheduleObject = {};
        const afternoonSchedule: WeeklyScheduleObject = {};

        if (currentClassData && currentClassData.schedule) {
            for (const [day, activities] of Object.entries(currentClassData.schedule)) {
                const morningActivities: ScheduleItem[] = [];
                const afternoonActivities: ScheduleItem[] = [];

                if (Array.isArray(activities)) {
                    activities.forEach((item: ApiScheduleItem) => {
                        const startHour = parseInt(item.time.split('-')[0].split(':')[0], 10);
                        const scheduleItem: ScheduleItem = {
                            time: item.time,
                            subject: item.activity,
                        };
                        if (startHour < 14) {
                            morningActivities.push(scheduleItem);
                        } else {
                            afternoonActivities.push(scheduleItem);
                        }
                    });
                }

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

    const currentClassInfo: ClassInfo = {
        name: `Lớp ${currentClassData.class}`,
        teacher: 'Cô Linh',
        year: '2024 - 2025',
    };

    return (
        <Box sx={{ p: 4, minHeight: '100vh', bgcolor: '#f5f7fb' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#0d47a1' }}>
                📘 Thời khóa biểu Lớp {currentClassData.class}
            </Typography>

            <Information
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                currentClassInfo={currentClassInfo}
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