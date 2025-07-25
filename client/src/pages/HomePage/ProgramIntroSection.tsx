import React from 'react';
import { Box, Button, Typography, Paper, Stack } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import { useEffect } from 'react';
import { useMotionValue, animate } from 'framer-motion';

const FONT_FAMILY = "'Poppins', sans-serif";

const stats = [
    { value: '14+', label: 'Năm kinh nghiệm', icon: <SchoolIcon sx={{ fontSize: 40, color: '#fff' }} /> },
    { value: '500+', label: 'Học sinh mỗi năm', icon: <GroupsIcon sx={{ fontSize: 40, color: '#fff' }} /> },
    { value: '10+', label: 'Giải thưởng đạt được', icon: <EmojiEventsIcon sx={{ fontSize: 40, color: '#fff' }} /> },
];

function useCountUp(target: string, duration = 1) {
    const match = target.match(/(\d+)(\D*)/);
    const number = match ? parseInt(match[1], 10) : 0;
    const suffix = match ? match[2] : '';
    const motionValue = useMotionValue(0);
    const [display, setDisplay] = React.useState('0' + suffix);

    useEffect(() => {
        const controls = animate(motionValue, number, {
            duration,
            onUpdate: (latest) => {
                setDisplay(Math.floor(latest).toLocaleString('vi-VN') + suffix);
            },
        });
        return controls.stop;
    }, [number, suffix, duration]);
    return display;
}
const bullets = [
    'Chúng tôi tin rằng mỗi trẻ đều thông minh và xứng đáng được quan tâm.',
    'Giáo viên tạo nên sự khác biệt cho con bạn.',
];

const ProgramIntroSection = () => {
    return (
        <Box sx={{ py: 8, backgroundColor: '#FEFDFC' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    maxWidth: 1200,
                    mx: 'auto',
                }}
            >
                {/* Left image */}
                <Box
                    sx={{
                        flex: { xs: 'none', md: 1 },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: 360,
                        maxWidth: 480,
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: 320, md: 420 },
                            height: { xs: 260, md: 320 },
                            borderRadius: '40% 60% 60% 40% / 50% 40% 60% 50%',
                            overflow: 'hidden',
                            boxShadow: '0 12px 40px -8px #F9A84B77',
                            position: 'relative',
                            background: '#fff',
                        }}
                    >
                        <img
                            src={'/chương trình.png'}
                            alt="Program"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* Decorative curve */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '80%',
                                height: 22,
                                background: 'linear-gradient(90deg, #F9A84B 60%, transparent)',
                                borderRadius: '0 0 48px 48px',
                                zIndex: 2,
                            }}
                        />
                    </Box>
                </Box>

                {/* Right content */}
                <Box sx={{ flex: 2, minWidth: 320 }}>
                    <Typography variant="h4" fontWeight={900} sx={{ fontFamily: FONT_FAMILY, mb: 2 }}>
                        Chương trình của chúng tôi
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: FONT_FAMILY, color: 'text.secondary', mb: 3 }}>
                        Sự dũng cảm không phải lúc nào cũng là những hành động lớn lao, đôi khi chỉ đơn giản là thử sức với một câu hỏi khó, mạnh dạn phát biểu trong lớp hoặc trải nghiệm điều mới mẻ. Sakura luôn khuyến khích trẻ phát triển toàn diện qua các chương trình học hiện đại và môi trường thân thiện.
                    </Typography>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 4, mb: 4, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                        {stats.map((stat, idx) => {
                            const count = useCountUp(stat.value, 1.2 + idx * 0.2);
                            // Gradient and shadow for each card
                            const gradients = [
                                'linear-gradient(135deg, #29C2B4 60%, #F9A84B 100%)',
                                'linear-gradient(135deg, #F9A84B 60%, #29C2B4 100%)',
                                'linear-gradient(135deg, #F96D6D 60%, #F9A84B 100%)',
                            ];
                            return (
                                <Paper
                                    key={idx}
                                    sx={{
                                        px: { xs: 3, md: 5 },
                                        py: { xs: 3, md: 4 },
                                        borderRadius: 6,
                                        minWidth: { xs: 120, md: 180 },
                                        minHeight: { xs: 150, md: 180 },
                                        textAlign: 'center',
                                        background: gradients[idx],
                                        color: 'white',
                                        boxShadow: '0 8px 32px -8px #F9A84B55, 0 2px 8px -2px #29C2B477',
                                        border: '3px solid #fff',
                                        position: 'relative',
                                        transition: 'transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-10px) scale(1.05)',
                                            boxShadow: '0 16px 40px -8px #F9A84B99, 0 4px 16px -4px #29C2B499',
                                        },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'visible',
                                    }}
                                    elevation={0}
                                >
                                    <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.12)', borderRadius: '50%', width: 56, height: 56, boxShadow: '0 2px 8px -2px #fff5' }}>
                                        {stat.icon}
                                    </Box>
                                    <Typography variant="h4" fontWeight={900} sx={{ fontFamily: FONT_FAMILY, mb: 0.5, letterSpacing: 1 }}>
                                        {count}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: FONT_FAMILY, fontWeight: 500, letterSpacing: 0.5 }}>
                                        {stat.label}
                                    </Typography>
                                </Paper>
                            );
                        })}
                    </Box>

                    {/* Bullets */}
                    <Stack spacing={1} sx={{ mb: 3 }}>
                        {bullets.map((b, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#29C2B4' }} />
                                <Typography variant="body2" sx={{ fontFamily: FONT_FAMILY }}>{b}</Typography>
                            </Box>
                        ))}
                    </Stack>

                    {/* Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            sx={{
                                background: '#F9A84B',
                                color: 'white',
                                borderRadius: '50px',
                                px: 4,
                                py: 1,
                                fontWeight: 'bold',
                                textTransform: 'none',
                                fontFamily: FONT_FAMILY,
                                boxShadow: '0 2px 8px -2px #F9A84B55',
                                '&:hover': { background: '#f7b85c' },
                            }}
                        >
                            Xem thêm
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<PlayArrowIcon />}
                            sx={{
                                borderRadius: '50px',
                                px: 3,
                                py: 1,
                                fontWeight: 'bold',
                                textTransform: 'none',
                                fontFamily: FONT_FAMILY,
                                borderColor: '#F9A84B',
                                color: '#F9A84B',
                                background: 'white',
                                '&:hover': { background: '#fff7e6', borderColor: '#F9A84B' },
                            }}
                        >
                            Video giới thiệu
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ProgramIntroSection;
