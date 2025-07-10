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
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Dữ liệu thực đơn cho cả tuần (ví dụ)
const weeklyData = {
    'Thứ 2': {
        sáng: 'Bún bò Huế',
        trưa: 'Cơm sườn bì chả',
        chiều: 'Chè hạt sen',
    },
    'Thứ 3': {
        sáng: 'Phở gà',
        trưa: 'Cơm cá kho tộ, canh chua',
        chiều: 'Bánh flan',
    },
    'Thứ 4': {
        sáng: 'Xôi mặn',
        trưa: 'Bún thịt nướng',
        chiều: 'Sữa chua Hy Lạp',
    },
    'Thứ 5': {
        sáng: 'Hủ tiếu Nam Vang',
        trưa: 'Cơm gà xối mỡ',
        chiều: 'Trái cây dĩa',
    },
    'Thứ 6': {
        sáng: 'Bánh mì ốp la',
        trưa: 'Lẩu Thái hải sản',
        chiều: 'Panna cotta',
    },
    'Thứ 7': {
        sáng: 'Miến lươn',
        trưa: 'Cơm tấm & Canh khổ qua',
        chiều: 'Rau câu dừa',
    },
    'Chủ nhật': {
        sáng: 'Bò né',
        trưa: 'Gà nướng lu, xôi chiên',
        chiều: 'Tàu hũ trân châu đường đen',
    },
};

// Các loại bữa trong ngày
const mealTypes = [
    { key: 'sáng', label: 'Bữa sáng' },
    { key: 'trưa', label: 'Bữa trưa' },
    { key: 'chiều', label: 'Bữa chiều' },
];

// Hàm trợ giúp để lấy các ngày trong tuần hiện tại (Thứ 2 - Chủ Nhật)
const getWeekDays = () => {
    const weekDays = [];
    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const today = new Date();

    const currentDayOfWeek = today.getDay();
    const diff = today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));

    for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);

        weekDays.push({
            name: dayNames[day.getDay()],
            date: `${String(day.getDate()).padStart(2, '0')}/${String(day.getMonth() + 1).padStart(2, '0')}`,
        });
    }
    return weekDays;
};

// Styled component cho các ô trong bảng
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    border: `1px solid ${theme.palette.grey[200]}`,
    padding: '16px',
    fontSize: '0.95rem',
}));

export default function WeeklyMealSchedule() {
    const weekDays = getWeekDays();

    // Style cho các ô tiêu đề với màu mới
    const headerCellStyle = {
        backgroundColor: '#4194cb', // <-- MÀU ĐÃ CẬP NHẬT
        color: '#ffffff',
        fontWeight: 'bold',
    };

    return (
        <Box mt={6} p={{ xs: 2, sm: 4 }} minHeight="100vh" bgcolor="#f5f7fb">
            <Typography
                variant="h5"
                gutterBottom
                sx={{
                    fontWeight: 700,
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 3,
                }}
            >
                <CalendarTodayIcon />
                Thực đơn tuần
            </Typography>
            <Paper
                elevation={4}
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                }}
            >
                <TableContainer>
                    <Table sx={{ minWidth: 700 }} aria-label="weekly meal table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell sx={{ ...headerCellStyle, minWidth: 120 }}>
                                    Bữa
                                </StyledTableCell>
                                {weekDays.map((day) => (
                                    <StyledTableCell
                                        key={day.date}
                                        align="center"
                                        sx={headerCellStyle}
                                    >
                                        <Typography variant="subtitle1" fontWeight="700" color="inherit">
                                            {day.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.85 }} color="inherit">
                                            {day.date}
                                        </Typography>
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mealTypes.map((mealType) => (
                                <TableRow key={mealType.key} sx={{ '&:hover': { bgcolor: '#f5f5f5' }, '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                                    <StyledTableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                        {mealType.label}
                                    </StyledTableCell>
                                    {weekDays.map((day) => (
                                        <StyledTableCell key={`${day.date}-${mealType.key}`}>
                                            {weeklyData[day.name]?.[mealType.key] || '–'}
                                        </StyledTableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}