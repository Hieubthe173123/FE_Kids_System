import {
    Grid,
    Typography,
    Paper,
    Box,
    Divider,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/vi';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useState, useEffect } from 'react';

dayjs.extend(isoWeek);
dayjs.locale('vi');

interface ClassInfo {
    name: string;
    teacher: string;
    year: string;
}

interface Props {
    selectedDate: string;
    onDateChange: (date: string) => void;
    currentClassInfo: ClassInfo | undefined;
}

export default function Information({
    selectedDate,
    onDateChange,
    currentClassInfo
}: Props) {
    const [weekRange, setWeekRange] = useState<{ start: string; end: string }>({ start: '', end: '' });


    useEffect(() => {
        const date = dayjs(selectedDate);
        const startOfWeek = date.startOf('isoWeek');
        const endOfWeek = date.endOf('isoWeek');
        setWeekRange({
            start: startOfWeek.format('DD/MM/YYYY'),
            end: endOfWeek.format('DD/MM/YYYY'),
        });
    }, [selectedDate]);


    return (
        <>
            <Grid container spacing={3} my={2} justifyContent="flex-start">
                <Grid item xs={12} md={4} sx={{ pl: { xs: 0, md: 0 } }} {...({} as any)}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                        <DatePicker
                            label="📅 Chọn ngày"
                            value={dayjs(selectedDate)}
                            onChange={(value) => {
                                if (dayjs.isDayjs(value) && value.isValid()) {
                                    onDateChange(value.format('YYYY-MM-DD'));
                                }
                            }}
                            format="DD/MM/YYYY"
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: 'outlined',
                                    sx: { bgcolor: 'white', borderRadius: 2 },
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

            {currentClassInfo && (
                <Paper
                    elevation={2}
                    sx={{
                        display: 'flex', justifyContent: 'space-around', alignItems: 'center', bgcolor: '#f9fbfc', borderRadius: 3,
                        py: 2, px: 3, mt: 2, flexWrap: 'wrap', gap: 2
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <SchoolIcon sx={{ color: '#46a2da' }} />
                        <Box>
                            <Typography fontSize={13} color="text.secondary">Lớp học</Typography>
                            <Typography fontWeight={600} fontSize={16}>{currentClassInfo.name}</Typography>
                        </Box>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', md: 'block' } }} />
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <PersonIcon sx={{ color: '#46a2da' }} />
                        <Box>
                            <Typography fontSize={13} color="text.secondary">Giáo viên</Typography>
                            <Typography fontWeight={600} fontSize={16}>{currentClassInfo.teacher}</Typography>
                        </Box>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', md: 'block' } }} />
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <CalendarMonthIcon sx={{ color: '#46a2da' }} />
                        <Box>
                            <Typography fontSize={13} color="text.secondary">Năm học</Typography>
                            <Typography fontWeight={600} fontSize={16}>{currentClassInfo.year}</Typography>
                        </Box>
                    </Box>
                </Paper>
            )}
        </>
    );
}