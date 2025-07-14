import React, { useState, useEffect, useCallback } from 'react';
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
import DateRangeIcon from '@mui/icons-material/DateRange';
import { getWeeklyMenuByDateNow } from "../../services/ApiServices";
import { getStudentsByParentId } from "../../services/ParentApi";
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(isSameOrAfter);
dayjs.extend(weekOfYear);

type MealType = {
    sáng: string;
    trưa: string;
    chiều: string;
};

type MenuDataType = {
    [key: string]: MealType;
};

const mealTypes = [
    { key: 'sáng', label: 'Bữa sáng', time: '06:30 - 07:00', icon: <Brightness6Icon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.7 }} /> },
    { key: 'trưa', label: 'Bữa trưa', time: '11:00 - 12:00', icon: <FastfoodIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.7 }} /> },
    { key: 'chiều', label: 'Bữa chiều', time: '15:30 - 16:00', icon: <RestaurantIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.7 }} /> },
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
            fullDate: day.toISOString().split('T')[0]
        });
    }
    return weekDays;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    padding: '6px 8px',
    fontSize: '0.88rem',
    lineHeight: 1.3,
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
        <Box sx={{ mr: 2, p: 1.5, borderRadius: '50%', backgroundColor: `${color}.main`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ wordBreak: 'break-word' }}>{value}</Typography>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
        </Box>
    </Paper>
);

export default function WeeklyMealSchedule() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [currentDate, setCurrentDate] = useState(new Date());
    const [menuDataByAge, setMenuDataByAge] = useState<{ [ageCategory: number]: MenuDataType }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [childrenList, setChildrenList] = useState<any[]>([]);

    const mapAgeToCategory = (age: number): number => {
        return age;
    };

    const fetchMenu = useCallback(async (date: Date, ageCategories: number[]) => {
        setIsLoading(true);
        setError(null);
        try {
            const weeklyMenus = await getWeeklyMenuByDateNow(date, ageCategories);
            const menuByAge: { [ageCategory: number]: MenuDataType } = {};
            if (Array.isArray(weeklyMenus)) {
                ageCategories.forEach((ageCat: number) => {
                    const foundMenu = weeklyMenus.find((menu: any) => menu.ageCategory === ageCat);
                    if (foundMenu && Array.isArray(foundMenu.days)) {
                        const mappedMenu: MenuDataType = {};
                        foundMenu.days.forEach((day: any) => {
                            const dateObj = new Date(day.date);
                            const dateKey = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
                            mappedMenu[dateKey] = {
                                sáng: day.breakfast?.map((d: any) => d.dishName).join(', ') || '–',
                                trưa: day.lunch?.map((d: any) => d.dishName).join(', ') || '–',
                                chiều: day.dinner?.map((d: any) => d.dishName).join(', ') || '–',
                            };
                        });
                        menuByAge[ageCat] = mappedMenu;
                    }
                });
            }
            setMenuDataByAge(menuByAge);
        } catch (err) {
            setError("Không thể tải thực đơn. Vui lòng thử lại sau.");
            setMenuDataByAge({});
        } finally {
            setIsLoading(false);
        }
    }, []);

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
                    const ageCategories: number[] = Array.from(
                        new Set(res.students.map((stu: any) => mapAgeToCategory(stu.age)))
                    );
                    fetchMenu(currentDate, ageCategories);
                } else {
                    setChildrenList([]);
                    setMenuDataByAge({});
                }
            } catch (err) {
                console.error("Lỗi khi lấy học sinh:", err);
                setError("Không thể tải danh sách học sinh.");
            }
        };

        fetchStudents();
    }, [currentDate, fetchMenu]);

    const handlePrevWeek = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() - 7);
            return newDate;
        });
    };

    const handleNextWeek = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + 7);
            return newDate;
        });
    };

    const weekDays = getWeekDays(currentDate);
    const isCurrentWeek = dayjs(currentDate).isSame(new Date(), 'week');
    const weekDisplay = weekDays.length > 0
        ? `${weekDays[0].date} — ${weekDays[6].date}`
        : '';

    const getTotalDishes = (menuData: MenuDataType) => {
        if (!menuData) return 0;
        return Object.values(menuData).reduce((acc, day) => {
            return acc + Object.values(day).filter(meal => meal && meal !== '–').length;
        }, 0);
    };

    const getTodaySpecial = (menuData: MenuDataType) => {
        let todaySpecial = '–';
        if (!menuData) return todaySpecial;

        const todayKey = `${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        const todayMenu = menuData[todayKey];
        if (todayMenu) {
            const allTodayDishes = [
                ...(todayMenu.sáng && todayMenu.sáng !== '–' ? todayMenu.sáng.split(', ') : []),
                ...(todayMenu.trưa && todayMenu.trưa !== '–' ? todayMenu.trưa.split(', ') : []),
                ...(todayMenu.chiều && todayMenu.chiều !== '–' ? todayMenu.chiều.split(', ') : [])
            ].filter(dish => dish);
            if (allTodayDishes.length > 0) {
                const randomIndex = Math.floor(Math.random() * allTodayDishes.length);
                todaySpecial = allTodayDishes[randomIndex];
            }
        }
        return todaySpecial;
    };

    const headerCellStyle = {
        backgroundColor: '#4194cb',
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center' as const,
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        '&:last-child': { borderRight: 'none' }
    };

    const DesktopTable = ({ student, menuData }: { student: any, menuData: MenuDataType }) => (
        <Box mb={3}>
            <Typography variant="h6" fontWeight="bold" color="#4194cb" mb={0.5} sx={{ fontSize: '1.05rem' }}>
                Thực đơn tuần cho học sinh: {student.name} - {student.age} Tuổi
            </Typography>
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', width: '100%' }}>
                <TableContainer>
                    <Table stickyHeader aria-label="weekly meal table" size="small">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell sx={{ ...headerCellStyle, textAlign: 'left', width: 120, fontSize: '1em', padding: '8px 8px' }}>Bữa</StyledTableCell>
                                {weekDays.map((day) => (
                                    <StyledTableCell key={day.fullDate} align="center" sx={{ ...headerCellStyle, width: 90, fontSize: '1em', padding: '8px 8px' }}>
                                        <Typography variant="subtitle2" fontWeight="700" color="inherit" sx={{ fontSize: '1em' }}>{day.name}</Typography>
                                        <Typography variant="caption" color="inherit" sx={{ opacity: 0.85, fontSize: '0.92em' }}>{day.date}</Typography>
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mealTypes.map((mealType) => (
                                <StyledTableRow key={mealType.key}>
                                    <StyledTableCell component="th" scope="row" sx={{ fontWeight: 600, minWidth: 100, p: '6px 8px' }}>
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '1em' }}>{mealType.icon} <span style={{ marginLeft: 4 }}>{mealType.label}</span></Box>
                                            <Typography variant="caption" sx={{ color: '#4194cb', fontWeight: 400, display: 'block', mt: 0.2, fontSize: '0.85em' }}>{mealType.time}</Typography>
                                        </Box>
                                    </StyledTableCell>
                                    {weekDays.map((day) => (
                                        <StyledTableCell key={`${day.fullDate}-${mealType.key}`} align="center" sx={{ p: '6px 8px', fontSize: '0.97em' }}>
                                            {menuData?.[day.date]?.[mealType.key as keyof MealType] || '–'}
                                        </StyledTableCell>
                                    ))}
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );

    const MobileCardList = ({ student, menuData }: { student: any, menuData: MenuDataType }) => (
        <Box mb={4}>
            <Typography variant="h6" fontWeight="bold" color="#4194cb" mb={1}>
                Thực đơn tuần cho học sinh: {student.name} - Tuổi: {student.age}
            </Typography>
            {weekDays.map(day => (
                <Paper key={day.fullDate} elevation={2} sx={{ mb: 2, borderRadius: 3, p: 2 }}>
                    <Typography variant="h6" fontWeight="700" color="#4194cb" gutterBottom>{day.name} - {day.date}</Typography>
                    {mealTypes.map(mealType => (
                        <Box key={mealType.key} sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5, borderBottom: '1px solid #eee', pb: 0.5, '&:last-child': { border: 0, mb: 0, pb: 0 } }}>
                            <Box sx={{ width: '140px', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flexShrink: 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.97em' }}>{mealType.icon} <span style={{ marginLeft: 4 }}>{mealType.label}</span></Box>
                                <Typography variant="caption" sx={{ color: '#4194cb', fontWeight: 400, display: 'block', mt: 0.1, fontSize: '0.85em' }}>{mealType.time}</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ flexGrow: 1, textAlign: 'left', mt: 0.2, fontSize: '0.97em' }}>{menuData?.[day.date]?.[mealType.key as keyof MealType] || '–'}</Typography>
                        </Box>
                    ))}
                </Paper>
            ))}
        </Box>
    );

    // Group students by age category
    const studentsByAge: { [age: number]: any[] } = {};
    childrenList.forEach(student => {
        const ageCategory = mapAgeToCategory(student.age);
        if (!studentsByAge[ageCategory]) studentsByAge[ageCategory] = [];
        studentsByAge[ageCategory].push(student);
    });

    const MainContent = () => {
        if (isLoading) {
            return <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 300 }}><CircularProgress /></Box>;
        }
        if (error) {
            return <Alert severity="error">{error}</Alert>;
        }
        if (childrenList.length === 0) {
            return <Alert severity="info">Không tìm thấy thông tin học sinh.</Alert>;
        }
        if (Object.keys(menuDataByAge).length === 0) {
            return <Alert severity="info">Hiện chưa có dữ liệu thực đơn cho tuần này.</Alert>;
        }

        // Render only one table per age group, listing all names
        return (
            <>
                {Object.entries(studentsByAge).map(([age, students]) => {
                    const menuData = menuDataByAge[Number(age)] || {};
                    const names = students.map((stu: any) => stu.name).join(', ');
                    const displayStudent = { name: names, age };
                    return isMobile
                        ? <MobileCardList key={age} student={displayStudent} menuData={menuData} />
                        : <DesktopTable key={age} student={displayStudent} menuData={menuData} />;
                })}
            </>
        );
    };

    const allMenus = Object.values(menuDataByAge);
    const totalDishes = allMenus.reduce((sum, menu) => sum + getTotalDishes(menu), 0);
    const todaySpecial = getTodaySpecial(menuDataByAge[mapAgeToCategory(childrenList[0]?.age)] || {});

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            bgcolor: '#f5f7fb',
            p: { xs: 2, sm: 3 }
        }}>
            <Grid container spacing={3} mb={4} sx={{ flexShrink: 0 }}>
                <Grid item xs={12} sm={6} md={3} {...({} as any)}>
                    <StatCard title="Tuần đang xem" value={isLoading && !weekDisplay ? '...' : weekDisplay} icon={<DateRangeIcon />} color="success" />
                </Grid>
                <Grid item xs={12} sm={6} md={3} {...({} as any)}>
                    <StatCard title="Món đặc biệt hôm nay" value={todaySpecial} icon={<StarBorderIcon />} color="warning" />
                </Grid>
                <Grid item xs={12} sm={6} md={3} {...({} as any)}>
                    <StatCard title="Tổng số món trong tuần" value={isLoading ? '...' : `${totalDishes} món`} icon={<MenuBookIcon />} color="info" />
                </Grid>
                <Grid item xs={12} sm={6} md={3} {...({} as any)}>
                    <StatCard title="Năng lượng trung bình" value="~750 Kcal" icon={<LocalFireDepartmentIcon />} color="error" />
                </Grid>
            </Grid>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', minHeight: 0 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ flexShrink: 0 }}>
                    <Typography variant="h6" fontWeight="700" color="#333" display="flex" alignItems="center" gap={1}>
                        <CalendarTodayIcon /> Lịch thực đơn
                    </Typography>
                    <Box>
                        <Tooltip title="Tuần trước"><IconButton onClick={handlePrevWeek} disabled={isLoading}><ChevronLeftIcon /></IconButton></Tooltip>
                        <Tooltip title={isCurrentWeek ? "Bạn đang ở tuần hiện tại" : "Tuần sau"}>
                            <span>
                                <IconButton onClick={handleNextWeek} disabled={isLoading || isCurrentWeek}>
                                    <ChevronRightIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                </Box>
                <MainContent />
            </Box>
        </Box>
    );
}