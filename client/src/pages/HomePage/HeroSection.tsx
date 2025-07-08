import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';
import { FallingPetalsJS } from './FallingPetalsJS';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';

// CTA Gradient Button
const GradientButton = styled(Button)(() => ({
    padding: '12px 28px',
    fontWeight: 700,
    fontSize: '1rem',
    fontFamily: '"Poppins", sans-serif',
    color: '#fff',
    borderRadius: 40,
    background: 'linear-gradient(135deg, #46a2da, #3982b8)',
    boxShadow: '0 4px 14px rgba(57,130,184,0.3)',
    textTransform: 'uppercase',
    '&:hover': {
        background: 'linear-gradient(135deg, #3982b8, #316fa2)',
    },
}));

// Slide content data
const slidesData = [
    {
        title: 'Ghi lại hành trình trưởng thành của bé',
        subtitle: 'Cập nhật hoạt động & hình ảnh mỗi ngày',
        description:
            'Phụ huynh luôn đồng hành và theo sát từng khoảnh khắc phát triển tại trường mầm non Sakura.',
        image: '/1.jpg',
    },
    {
        title: 'Kết nối thông minh giữa nhà trường & phụ huynh',
        subtitle: 'Tương tác tức thì, minh bạch và yêu thương',
        description:
            'Giáo viên cập nhật nhanh chóng hình ảnh, hoạt động và tin nhắn tới phụ huynh mỗi ngày.',
        image: '/1.jpg',
    },
    {
        title: 'Môi trường sáng tạo, yêu thương và phát triển',
        subtitle: 'Từng ngày đến trường là một ngày vui',
        description:
            'Sakura xây dựng không gian học tập và chơi đùa đầy cảm hứng cho trẻ từ 2–6 tuổi.',
        image: '/1.jpg',
    },
];

export const HeroSection = () => {
    const [mounted, setMounted] = useState(false);
    console.log(mounted)
    useEffect(() => setMounted(true), []);

    return (
        <Box
            sx={{
                backgroundColor: '#f2fafe',
                position: 'relative',
                py: { xs: 6, md: 10 },
                overflow: 'hidden',
            }}
        >
            <FallingPetalsJS />

            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 6000 }}
                loop
                style={{ width: '100%' }}
            >
                {slidesData.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                            <Grid
                                container
                                spacing={4}
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{
                                    minHeight: { md: '500px', xs: 'auto' },
                                    py: { xs: 4, md: 0 },
                                }}
                            >
                                {/* Text column */}
                                <Grid {...({} as any)}
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        height: '100%',
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: '"Poppins", sans-serif',
                                                fontWeight: 600,
                                                color: '#4098c3',
                                                textTransform: 'uppercase',
                                                mb: 1,
                                            }}
                                        >
                                            Sakura School
                                        </Typography>

                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontFamily: '"Poppins", sans-serif',
                                                fontWeight: 700,
                                                color: '#e45a6c',
                                                mb: 1,
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {slide.title}
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: '"Poppins", sans-serif',
                                                fontWeight: 600,
                                                color: '#223344',
                                                mb: 2,
                                                fontSize: '1.15rem',
                                            }}
                                        >
                                            {slide.subtitle}
                                        </Typography>

                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: '#4a4a4a',
                                                mb: 3,
                                                maxWidth: 500,
                                            }}
                                        >
                                            {slide.description}
                                        </Typography>

                                        <GradientButton endIcon={<PlayArrowRoundedIcon />}>
                                            Tìm hiểu thêm
                                        </GradientButton>
                                    </Box>
                                </Grid>

                                {/* Image column */}
                                <Grid {...({} as any)}
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={slide.image}
                                        alt={`Slide ${index + 1}`}
                                        sx={{
                                            width: '100%',
                                            maxWidth: 480,
                                            height: 'auto',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Container>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};
