import {
    Box,
    Container,
    Grid,
    Paper,
    Typography
} from '@mui/material';
import {
    School,
    Chat,
    RestaurantMenu,
    EventAvailable,
    AutoAwesome,
    CalendarMonth
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);
const FONT_FAMILY = "'Poppins', 'Roboto', sans-serif";

const primaryColor = '#29C2B4'; // xanh ngọc Sakura
const secondaryColor = '#F9A84B'; // vàng cam Sakura
const accentColor = '#F96D6D'; // đỏ cam Sakura

const features = [
    {
        icon: <School fontSize="medium" />,
        title: 'Quản lý tập trung',
        desc: 'Dữ liệu học sinh, lớp học, hồ sơ giáo viên được quản lý đồng bộ.'
    },
    {
        icon: <Chat fontSize="medium" />,
        title: 'Tương tác đa chiều',
        desc: 'Phụ huynh – giáo viên – nhà trường trao đổi trực tiếp, cập nhật thông tin mỗi ngày.'
    },
    {
        icon: <RestaurantMenu fontSize="medium" />,
        title: 'Theo dõi dinh dưỡng',
        desc: 'Cập nhật thực đơn, kiểm soát khẩu phần ăn và cảnh báo dị ứng cho từng bé.'
    },
    {
        icon: <EventAvailable fontSize="medium" />,
        title: 'Điểm danh & lịch học',
        desc: 'Tự động điểm danh, báo nghỉ, phân phối thời khóa biểu thông minh.'
    },
    {
        icon: <CalendarMonth fontSize="medium" />,
        title: 'Tạo lịch học tự động',
        desc: 'Hệ thống tự động sắp xếp lịch học, tối ưu thời gian và phù hợp từng lớp.'
    },
    {
        icon: <AutoAwesome fontSize="medium" />,
        title: 'Khung chương trình mới mẻ',
        desc: 'Chương trình học sáng tạo, tích hợp STEAM, tiếng Anh, kỹ năng sống và trải nghiệm thực tế.'
    },
];

export const FeaturesSection = () => {
    return (
        <Box sx={{ py: 10, backgroundColor: '#f8fafc', fontFamily: 'Poppins, sans-serif' }}>
            <Container maxWidth="lg">
                <Typography
                    variant="subtitle2"
                    align="center"
                    sx={{
                        color: primaryColor,
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        fontSize: { xs: '1.3rem', md: '1.3rem' },
                        mb: 1,
                        fontFamily: 'Poppins, sans-serif',
                    }}
                >
                    SakuraTech Platform
                </Typography>

                <Typography
                    variant="h2"
                    align="center"
                    sx={{
                        fontFamily: FONT_FAMILY,
                        fontWeight: 700,
                        maxWidth: 750,
                        mx: 'auto',
                        lineHeight: 1.4,
                        mb: 5,
                        background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 60%, ${accentColor} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Một nền tảng, vạn tiện ích cho trường mầm non Sakura
                </Typography>


                <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
                    {features.map((item, index) => {
                        const borderColors = [primaryColor, secondaryColor, accentColor, primaryColor, secondaryColor, accentColor];
                        const iconBgColors = ['#eafafc', '#fff7e6', '#fff0ee', '#eafafc', '#fff7e6', '#fff0ee'];
                        const iconColors = [primaryColor, secondaryColor, accentColor, primaryColor, secondaryColor, accentColor];
                        return (
                            <Grid item xs={12} sm={6} md={6} key={index} {...({} as any)}>
                                <MotionPaper
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2, md: 2.5 },
                                        borderRadius: { xs: 2, md: 2.5 },
                                        borderLeft: `4px solid ${borderColors[index % borderColors.length]}`,
                                        backgroundColor: '#ffffff',
                                        display: 'flex',
                                        gap: { xs: 1.5, md: 2 },
                                        alignItems: 'flex-start',
                                        height: '100%',
                                        maxWidth: { xs: '100%', md: 420 },
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 28px rgba(0,0,0,0.08)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: { xs: 38, md: 44 },
                                            height: { xs: 38, md: 44 },
                                            bgcolor: iconBgColors[index % iconBgColors.length],
                                            borderRadius: '50%',
                                            color: iconColors[index % iconColors.length],
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mt: 0.5,
                                            fontSize: { xs: 22, md: 26 },
                                        }}
                                    >
                                        {item.icon}
                                    </Box>
                                    <Box>
                                        <Typography fontWeight={600} fontSize={{ xs: '0.98rem', md: '1.08rem' }} mb={0.5} color="#1e293b">
                                            {item.title}
                                        </Typography>
                                        <Typography fontSize={{ xs: '0.92rem', md: '0.98rem' }} color="text.secondary">
                                            {item.desc}
                                        </Typography>
                                    </Box>
                                </MotionPaper>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Box>
    );
};
