import {
    Box,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import Schedules from './Schedules';
import Information from './Information';


type ScheduleItem = {
    time: string;
    subject: string;
    feedback?: string;
};

type Student = {
    id: number;
    name: string;
    class: string;
    teacher: string;
    year: string;
    schedule: {
        morning: ScheduleItem[];
        afternoon: ScheduleItem[];
    };
    meals: { time: string; content: string }[];
};

const mockStudents: Student[] = [
    {
        id: 1,
        name: 'Bé An',
        class: 'Mầm 2',
        teacher: 'Cô Linh',
        year: '2024 - 2025',
        schedule: {
            morning: [
                { time: '7:30 - 7:45', subject: 'Đón trẻ & Thể dục sáng', feedback: 'Bé hợp tác tốt' },
                { time: '7:45 - 8:15', subject: 'Ăn sáng', feedback: 'Ăn hết suất, vui vẻ' },
                { time: '8:15 - 8:45', subject: 'Hoạt động ngoài trời', feedback: 'Tham gia năng động' },
                { time: '8:45 - 9:15', subject: 'Hoạt động tập thể', feedback: 'Tích cực phát biểu' },
                { time: '9:15 - 9:45', subject: 'Tiếng Việt - C5 Bài 8', feedback: 'Đọc rõ ràng, viết đẹp' },
                { time: '9:45 - 10:15', subject: 'Phonics', feedback: 'Phát âm đúng, nhớ bài' },
            ],
            afternoon: [
                { time: '10:15 - 10:45', subject: 'Ăn nhẹ' },
                { time: '10:45 - 11:15', subject: 'Hoạt động tự chọn' },
                { time: '11:15 - 11:45', subject: 'Hoạt động ngoài trời' },
                { time: '11:45 - 12:15', subject: 'Ăn trưa' },
                { time: '12:15 - 14:00', subject: 'Ngủ trưa' },
                { time: '14:00 - 14:30', subject: 'Thức dậy & Vệ sinh cá nhân' },
                { time: '14:30 - 15:00', subject: 'Ăn xế' },
                { time: '15:00 - 16:00', subject: 'Hoạt động tự chọn' },
            ],
        },
        meals: [
            { time: '7:45 - 8:15', content: 'Ăn sáng: Cháo thịt bằm, sữa tươi' },
            { time: '10:15 - 10:45', content: 'Ăn nhẹ: Bánh quy, nước cam' },
            { time: '11:45 - 12:15', content: 'Ăn trưa: Cơm, canh rau, thịt kho' },
            { time: '14:30 - 15:00', content: 'Ăn xế: Sữa chua, trái cây' },
        ]
    },
];

export default function TimeTable() {
    const [selectedStudentId, setSelectedStudentId] = useState(1);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
        morning: false,
        afternoon: false,
    });

    const student = mockStudents.find((s) => s.id === selectedStudentId);

    const handleAccordionChange =
        (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded((prev) => ({
                ...prev,
                [panel]: isExpanded,
            }));
        };

    return (
        <Box sx={{ p: 4, minHeight: '100vh', bgcolor: '#f5f7fb' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#0d47a1' }}>
                📘 Lịch học của bé
            </Typography>

            <Information
                students={mockStudents}
                selectedStudentId={selectedStudentId}
                onStudentChange={setSelectedStudentId}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                currentStudent={student}
            />

            <Schedules
                title="🌞 Buổi sáng"
                panelKey="morning"
                expanded={expanded['morning']}
                onChange={handleAccordionChange}
                scheduleData={student?.schedule.morning || []}
            />
            <Schedules
                title="🌙 Buổi chiều"
                panelKey="afternoon"
                expanded={expanded['afternoon']}
                onChange={handleAccordionChange}
                scheduleData={student?.schedule.afternoon || []}
            />

        </Box>
    );
}
