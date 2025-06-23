import {
    Grid,
    Typography,
    Select,
    MenuItem,
    Paper,
    Box,
    Divider,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekday from 'dayjs/plugin/weekday';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useState } from 'react';

dayjs.extend(isoWeek);
dayjs.extend(weekday);

interface Student {
    id: number;
    name: string;
    class: string;
    teacher: string;
    year: string;
}

interface Props {
    students: Student[];
    selectedStudentId: number;
    onStudentChange: (id: number) => void;
    selectedDate: string;
    onDateChange: (date: string) => void;
    currentStudent: Student | undefined;
}

export default function Information({
    students,
    selectedStudentId,
    onStudentChange,
    selectedDate,
    onDateChange,
    currentStudent
}: Props) {
    const [weekRange, setWeekRange] = useState<{ start: string; end: string }>({
        start: '',
        end: '',
    });

    const handleDateChange = (newDate: Dayjs | null) => {
        if (!newDate) return;

        onDateChange(newDate.format('YYYY-MM-DD'));

        const startOfWeek = newDate.startOf('isoWeek');
        const endOfWeek = newDate.endOf('isoWeek');

        setWeekRange({
            start: startOfWeek.format('DD/MM/YYYY'),
            end: endOfWeek.format('DD/MM/YYYY'),
        });
    };

    return (
        <>
            <Grid container spacing={3} my={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                        👶 Chọn học sinh:
                    </Typography>
                    <Select
                        value={selectedStudentId}
                        onChange={(e) => onStudentChange(Number(e.target.value))}
                        fullWidth
                        sx={{ bgcolor: 'white', borderRadius: 2 }}
                    >
                        {students.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                                {s.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                        📅 Chọn ngày bất kỳ:
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={dayjs(selectedDate)}
                            onChange={handleDateChange}
                            format="DD/MM/YYYY"
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: 'outlined',
                                    sx: {
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                    },
                                },
                            }}
                        />
                    </LocalizationProvider>

                    {weekRange.start && (
                        <Typography mt={1} variant="body2" color="text.secondary">
                            📆 Tuần từ <strong>{weekRange.start}</strong> đến <strong>{weekRange.end}</strong>
                        </Typography>
                    )}
                </Grid>
            </Grid>

            {currentStudent && (
                <Paper
                    elevation={2}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        bgcolor: '#f9fbfc',
                        borderRadius: 3,
                        py: 2,
                        px: 3,
                        mt: 2,
                        flexWrap: 'wrap',
                        gap: 2
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <SchoolIcon sx={{ color: '#46a2da' }} />
                        <Box>
                            <Typography fontSize={13} color="text.secondary">Lớp học</Typography>
                            <Typography fontWeight={600} fontSize={16}>{currentStudent.class}</Typography>
                        </Box>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', md: 'block' } }} />
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <PersonIcon sx={{ color: '#46a2da' }} />
                        <Box>
                            <Typography fontSize={13} color="text.secondary">Giáo viên</Typography>
                            <Typography fontWeight={600} fontSize={16}>{currentStudent.teacher}</Typography>
                        </Box>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', md: 'block' } }} />
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <CalendarMonthIcon sx={{ color: '#46a2da' }} />
                        <Box>
                            <Typography fontSize={13} color="text.secondary">Năm học</Typography>
                            <Typography fontWeight={600} fontSize={16}>{currentStudent.year}</Typography>
                        </Box>
                    </Box>
                </Paper>
            )}
        </>
    );
}
