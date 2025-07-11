import {
    Grid,
    Typography,
    Paper,
    Box,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem
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

interface ChildInfo {
    id: string;
    name: string;
    age: number
}

interface Props {
    selectedDate: string;
    onDateChange: (date: string) => void;
    currentClassInfo: ClassInfo | undefined;
    childrenList: ChildInfo[];
    selectedChildId: string;
    onChildChange: (childId: string) => void;
}

export default function Information({
    selectedDate,
    onDateChange,
    currentClassInfo,
    childrenList,
    selectedChildId,
    onChildChange
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

    const selectedChild = childrenList.find(child => child.id === selectedChildId);

    return (
        <>
            <Grid container spacing={2} alignItems="flex-start" my={2}>
                <Grid item xs={12} sm={6} md={6} {...({} as any)}>
                    <FormControl fullWidth variant="outlined" size="small" sx={{ minWidth: 180 }}>
                        <InputLabel id="select-child-label">👶 Chọn con</InputLabel>
                        <Select
                            labelId="select-child-label"
                            id="select-child"
                            value={selectedChildId}
                            onChange={e => onChildChange(e.target.value)}
                            label="👶 Chọn con"
                            sx={{ bgcolor: 'white', minWidth: 180 }}
                        >
                            {(childrenList ?? []).map(child => (
                                <MenuItem key={child.id} value={child.id}>{child.name} - {child.age} tuổi</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={5} {...({} as any)}>
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
                                    size: 'small',
                                    sx: { bgcolor: 'white' },
                                },
                            }}
                        />
                    </LocalizationProvider>
                    {weekRange.start && (
                        <Typography mt={1} variant="body2" color="text.secondary">
                            🗓️ Tuần từ <strong>{weekRange.start}</strong> đến <strong>{weekRange.end}</strong>
                        </Typography>
                    )}
                </Grid>
            </Grid>

            {selectedChild && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                    👶 Đang xem thời khóa biểu của: <strong>{selectedChild.name}</strong>
                </Typography>
            )}

            {currentClassInfo && (
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
