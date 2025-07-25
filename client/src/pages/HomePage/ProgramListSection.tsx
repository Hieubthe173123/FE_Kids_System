import { Box, Typography, Paper } from '@mui/material';

const FONT_FAMILY = "'Poppins', sans-serif";

const programs = [
    {
        image: '/Nhà trẻ Sakura.png',
        title: 'Nhà trẻ Sakura',
        desc: 'Chương trình dành cho trẻ nhỏ, chú trọng phát triển vận động, cảm xúc và kỹ năng tự lập trong môi trường an toàn, thân thiện.',
        info: [
            { value: '4-5', label: 'Tuổi', color: '#F9A84B' },
            { value: '3', label: 'Ngày/tuần', color: '#29C2B4' },
            { value: '3.5', label: 'Giờ/buổi', color: '#F9A84B' },
        ],
    },
    {
        image: '/Mẫu giáo Bé Sakura.png',
        title: 'Mẫu giáo Bé Sakura',
        desc: 'Tập trung phát triển ngôn ngữ, tư duy logic, kỹ năng giao tiếp và sáng tạo qua các hoạt động trải nghiệm.',
        info: [
            { value: '3-4', label: 'Tuổi', color: '#F9A84B' },
            { value: '5', label: 'Ngày/tuần', color: '#29C2B4' },
            { value: '2', label: 'Giờ/buổi', color: '#F9A84B' },
        ],
    },
    {
        image: '/Mẫu giáo Nhỡ & Lớn.png',
        title: 'Mẫu giáo Nhỡ & Lớn Sakura',
        desc: 'Phát triển toàn diện về thể chất, trí tuệ, cảm xúc, chuẩn bị sẵn sàng cho lớp 1 với các hoạt động STEAM, tiếng Anh, kỹ năng sống.',
        info: [
            { value: '1-2', label: 'Tuổi', color: '#F9A84B' },
            { value: '3', label: 'Ngày/tuần', color: '#29C2B4' },
            { value: '3', label: 'Giờ/buổi', color: '#F9A84B' },
        ],
    },
];

const ProgramListSection = () => {
    return (
        <Box sx={{ py: 8, background: 'linear-gradient(90deg,#fff7f5 60%,#eafafc 100%)' }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" fontWeight={900} sx={{ fontFamily: FONT_FAMILY }}>
                    Các chương trình nổi bật
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: '500px', mx: 'auto', fontFamily: FONT_FAMILY }}>
                    EduKid mang đến môi trường học tập hiện đại, sáng tạo và thân thiện, giúp trẻ phát triển toàn diện từ thể chất đến trí tuệ.
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: 4,
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                }}
            >
                {programs.map((program, idx) => (
                    <Paper
                        key={idx}
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            background: '#fff',
                            boxShadow: '0 8px 32px -8px #29C2B455',
                            minWidth: 280,
                            maxWidth: 340,
                            flex: '1 1 0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                        }}
                        elevation={0}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                height: 160,
                                borderRadius: 3,
                                overflow: 'hidden',
                                mb: 2,
                                boxShadow: '0 2px 8px -2px #F9A84B33',
                            }}
                        >
                            <img
                                src={program.image}
                                alt={program.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>
                        <Typography variant="h6" fontWeight={700} sx={{ fontFamily: FONT_FAMILY, mb: 1 }}>
                            {program.title}
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: FONT_FAMILY, color: 'text.secondary', mb: 2, textAlign: 'center' }}>
                            {program.desc}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center', mt: 'auto' }}>
                            {program.info.map((info, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        flex: 1,
                                        background: info.color,
                                        color: '#fff',
                                        borderRadius: 2,
                                        px: 2,
                                        py: 1,
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography variant="h6" fontWeight={900} sx={{ fontFamily: FONT_FAMILY, fontSize: '1.1rem' }}>
                                        {info.value}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontFamily: FONT_FAMILY }}>
                                        {info.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default ProgramListSection;
