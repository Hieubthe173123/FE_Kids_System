import { Box, Typography, Paper } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

const FONT_FAMILY = "'Poppins', sans-serif";

const teachers = [
    {
        name: 'Phạm Duy Kiên',
        role: 'Giáo viên mầm non',
        image: '/Kien.jpg',
        highlight: false,
        socials: [],
    },
    {
        name: 'Đậu Đình Hiếu',
        role: 'Giáo viên mầm non',
        image: '/HieuD.jpg',
        highlight: false,
        socials: [],
    },

    {
        name: 'Đinh Gia Hân',
        role: 'Giáo viên mầm non',
        image: '/Handg.jpg',
        highlight: false,
        socials: [],
    },
    {
        name: 'Bùi Trung Hiếu',
        role: 'Giáo viên mầm non',
        image: '/HieuBt.jpg',
        highlight: true,
        socials: [
            { icon: <FacebookIcon fontSize="small" />, url: '#' },
            { icon: <TwitterIcon fontSize="small" />, url: '#' },
            { icon: <YouTubeIcon fontSize="small" />, url: '#' },
        ],
    },
    {
        name: 'Hà Văn Cường',
        role: 'Giáo viên mầm non',
        image: '/Cuong.jpg',
        highlight: false,
        socials: [],
    },
];

const BestTeachersSection = () => {
    return (
        <Box sx={{ py: 8, backgroundColor: '#fff' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={900} sx={{ fontFamily: FONT_FAMILY }}>
                    Đội ngũ giáo viên xuất sắc
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: '600px', mx: 'auto', fontFamily: FONT_FAMILY }}>
                    Sakura tự hào sở hữu đội ngũ giáo viên giàu kinh nghiệm, tận tâm và sáng tạo. Mỗi thầy cô đều là người truyền cảm hứng, đồng hành cùng trẻ trên hành trình khám phá và phát triển bản thân.
                </Typography>
            </Box>
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={32}
                slidesPerView={4}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                breakpoints={{
                    0: { slidesPerView: 1 },
                    600: { slidesPerView: 2 },
                    900: { slidesPerView: 3 },
                    1200: { slidesPerView: 4 },
                }}
                style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}
            >
                {teachers.map((teacher, i) => (
                    <SwiperSlide key={i}>
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                background: teacher.highlight ? '#F9A84B' : '#f7f7f7',
                                color: teacher.highlight ? 'white' : 'text.primary',
                                minWidth: 220,
                                maxWidth: 260,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                boxShadow: teacher.highlight ? '0 8px 32px -8px #F9A84B55' : '0 2px 8px -2px #ccc',
                                position: 'relative',
                                mx: 'auto',
                            }}
                            elevation={0}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: 140,
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    mb: 2,
                                    boxShadow: '0 2px 8px -2px #F9A84B33',
                                }}
                            >
                                <img
                                    src={teacher.image}
                                    alt={teacher.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>
                            <Typography variant="h6" fontWeight={700} sx={{ fontFamily: FONT_FAMILY, mb: 0.5 }}>
                                {teacher.name}
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: FONT_FAMILY, color: teacher.highlight ? 'white' : 'text.secondary', mb: 1 }}>
                                {teacher.role}
                            </Typography>
                            {teacher.highlight && (
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 1 }}>
                                    {teacher.socials.map((s, si) => (
                                        <Box key={si} component="a" href={s.url} sx={{ color: 'white', mx: 0.5 }}>
                                            {s.icon}
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Paper>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export default BestTeachersSection;
