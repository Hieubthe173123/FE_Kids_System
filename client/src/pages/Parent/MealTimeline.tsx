import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    styled,
    IconButton,
    Tooltip,
    Grid,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Alert
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { getWeeklyMenuByDateNow } from "../../services/ApiServices";

type MealType = {
    sáng: string;
    trưa: string;
    chiều: string;
};

type MenuDataType = {
    [key: string]: MealType;
};

const mealTypes = [
    { key: 'sáng', label: 'Bữa sáng', icon: <Brightness6Icon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.7 }} /> },
    { key: 'trưa', label: 'Bữa trưa', icon: <FastfoodIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.7 }} /> },
    { key: 'chiều', label: 'Bữa chiều', icon: <RestaurantIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.7 }} /> },
];

const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const getWeekDays = (baseDate: Date) => {
    const weekDays = [];
    const today = new Date(baseDate);
    const currentDayOfWeek = today.getDay();
    const diff = today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));

    for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        weekDays.push({
            name: dayNames[day.getDay()],
            date: `${String(day.getDate()).padStart(2, '0')}/${String(day.getMonth() + 1).padStart(2, '0')}`,
            fullDate: day.toDateString()
        });
    }
    return weekDays;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    padding: '12px 16px',
    fontSize: '0.9rem',
}));

const StyledTableRow = styled(TableRow)(() => ({
    '&:hover': {
        backgroundColor: 'rgba(65, 148, 203, 0.1)',
        transition: 'background-color 0.2s ease-in-out',
    },
}));

type StatCardProps = {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
};

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
    <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', borderRadius: 3, height: '100%' }}>
        <Box sx={{
            mr: 2,
            p: 1.5,
            borderRadius: '50%',
            backgroundColor: `${color}.main`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="h6" fontWeight="bold">{value}</Typography>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
        </Box>
    </Paper>
);

export default function WeeklyMealSchedule() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [currentDate, setCurrentDate] = useState(new Date());
    const [menuData, setMenuData] = useState<MenuDataType>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenu = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getWeeklyMenuByDateNow();
                if (response && response.data) {
                    setMenuData(response.data);
                } else {
                    setMenuData({});
                }
            } catch (err) {
                setError("Không thể tải thực đơn. Vui lòng thử lại sau.");
                setMenuData({});
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenu();
    }, [currentDate]);

    const handlePrevWeek = () => {
        setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 7)));
    };

    const handleNextWeek = () => {
        setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 7)));
    };

    const weekDays = getWeekDays(currentDate);
    const totalDishes = Object.values(menuData).reduce((acc, day) => acc + Object.keys(day).length, 0);
    const todayName = dayNames[new Date().getDay()];
    const todaySpecial = menuData[todayName]?.trưa || 'Nghỉ ngơi';

    const headerCellStyle = {
        backgroundColor: '#4194cb',
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        '&:last-child': { borderRight: 'none' }
    };

    const MainContent = () => {
        if (isLoading) {
            return <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 300 }}><CircularProgress /></Box>;
        }
        if (error) {
            return <Alert severity="error">{error}</Alert>;
        }
        return isMobile ? <MobileCardList /> : <DesktopTable />;
    };

    const DesktopTable = () => (
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', width: '100%' }}>
            <TableContainer>
                <Table stickyHeader aria-label="weekly meal table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell sx={{ ...headerCellStyle, textAlign: 'left', width: '15%' }}>Bữa</StyledTableCell>
                            {weekDays.map((day) => (
                                <StyledTableCell key={day.fullDate} align="center" sx={{ ...headerCellStyle, width: '12%' }}>
                                    <Typography variant="subtitle1" fontWeight="700" color="inherit">{day.name}</Typography>
                                    <Typography variant="caption" color="inherit" sx={{ opacity: 0.85 }}>{day.date}</Typography>
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mealTypes.map((mealType) => (
                            <StyledTableRow key={mealType.key}>
                                <StyledTableCell component="th" scope="row" sx={{ fontWeight: '600' }}>
                                    {mealType.icon} {mealType.label}
                                </StyledTableCell>
                                {weekDays.map((day) => (
                                    <StyledTableCell key={`${day.fullDate}-${mealType.key}`} align="center">
                                        {menuData?.[day.name]?.[mealType.key as keyof MealType] || '–'}
                                    </StyledTableCell>
                                ))}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );

    const MobileCardList = () => (
        <Box>
            {weekDays.map(day => (
                <Paper key={day.fullDate} elevation={2} sx={{ mb: 2, borderRadius: 3, p: 2 }}>
                    <Typography variant="h6" fontWeight="700" color="#4194cb" gutterBottom>{day.name} - {day.date}</Typography>
                    {mealTypes.map(mealType => (
                        <Box key={mealType.key} sx={{ display: 'flex', alignItems: 'center', mb: 1, borderBottom: '1px solid #eee', pb: 1, '&:last-child': { border: 0, mb: 0, pb: 0 } }}>
                            <Box sx={{ width: '110px', fontWeight: '600', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                {mealType.icon} {mealType.label}
                            </Box>
                            <Typography variant="body2" sx={{ flexGrow: 1, textAlign: 'left' }}>{menuData?.[day.name]?.[mealType.key as keyof MealType] || '–'}</Typography>
                        </Box>
                    ))}
                </Paper>
            ))}
        </Box>
    );

    return (
        <Box mt={4} p={{ xs: 2, sm: 3 }} bgcolor="#f5f7fb" minHeight="100vh">
            <Grid container spacing={3} mb={4} {...({} as any)}>
                <Grid item xs={12} sm={6} md={4} {...({} as any)}>
                    <StatCard title="Món đặc biệt hôm nay" value={todaySpecial} icon={<StarBorderIcon />} color="warning" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} {...({} as any)}>
                    <StatCard title="Tổng số món trong tuần" value={isLoading ? '...' : `${totalDishes} món`} icon={<MenuBookIcon />} color="info" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} {...({} as any)}>
                    <StatCard title="Năng lượng trung bình" value="~750 Kcal" icon={<LocalFireDepartmentIcon />} color="error" />
                </Grid>
            </Grid>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="700" color="#333" display="flex" alignItems="center" gap={1}>
                    <CalendarTodayIcon /> Tuần này
                </Typography>
                <Box>
                    <Tooltip title="Tuần trước"><IconButton onClick={handlePrevWeek} disabled={isLoading}><ChevronLeftIcon /></IconButton></Tooltip>
                    <Tooltip title="Tuần sau"><IconButton onClick={handleNextWeek} disabled={isLoading}><ChevronRightIcon /></IconButton></Tooltip>
                </Box>
            </Box>

            <MainContent />
        </Box>
    );
}