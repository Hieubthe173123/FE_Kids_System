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
    EventAvailable
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);
const FONT_FAMILY = "'Poppins', 'Roboto', sans-serif";

const primaryColor = '#0ea5e9';
const secondaryColor = '#e6687a';

const features = [
    {
        icon: <School fontSize="medium" />,
        title: 'Quản lý tập trung',
        desc: 'Dữ liệu học sinh, lớp học, hồ sơ giáo viên được quản lý đồng bộ.'
    },
    {
        icon: <Chat fontSize="medium" />,
        title: 'Tương tác đa chiều',
        desc: 'Phụ huynh – giáo viên – nhà trường trao đổi trực tiếp trong ngày.'
    },
    {
        icon: <RestaurantMenu fontSize="medium" />,
        title: 'Theo dõi dinh dưỡng',
        desc: 'Cập nhật thực đơn, kiểm soát khẩu phần ăn & cảnh báo dị ứng.'
    },
    {
        icon: <EventAvailable fontSize="medium" />,
        title: 'Điểm danh & lịch học',
        desc: 'Tự động điểm danh, báo nghỉ, phân phối thời khóa biểu thông minh.'
    }
];

export const FeaturesSection = () => {
    return (
        <Box sx={{ py: 10, backgroundColor: '#f8fafc', fontFamily: 'Poppins, sans-serif' }}>
            <Container maxWidth="lg">
                <Typography
                    variant="subtitle2"
                    align="center"
                    sx={{
                        color: '#0ea5e9',
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
                        background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Một nền tảng, vạn tiện ích cho trường mầm non hiện đại
                </Typography>


                <Grid container spacing={3}>
                    {features.map((item, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <MotionPaper
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    borderLeft: '5px solid #0ea5e9',
                                    backgroundColor: '#ffffff',
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'flex-start',
                                    height: '100%',
                                    boxShadow: '0 6px 22px rgba(0,0,0,0.04)',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 28px rgba(0,0,0,0.08)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        bgcolor: '#e0f2fe',
                                        borderRadius: '50%',
                                        color: '#2563eb',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mt: 0.5
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Box>
                                    <Typography fontWeight={600} fontSize="1rem" mb={0.5} color="#1e293b">
                                        {item.title}
                                    </Typography>
                                    <Typography fontSize="0.95rem" color="text.secondary">
                                        {item.desc}
                                    </Typography>
                                </Box>
                            </MotionPaper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};
