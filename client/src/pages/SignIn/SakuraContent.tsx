import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';

const items = [
    {
        icon: <SettingsSuggestRoundedIcon sx={{ fontSize: 36 }} />,
        title: 'Chương trình học cá nhân hoá',
        description:
            'Sakura School mang đến lộ trình học phù hợp với từng bé, giúp phát triển toàn diện theo độ tuổi và khả năng.',
    },
    {
        icon: <ConstructionRoundedIcon sx={{ fontSize: 36 }} />,
        title: 'Theo dõi sự phát triển mỗi ngày',
        description:
            'Phụ huynh có thể theo dõi tiến độ học tập, sức khỏe và kỹ năng xã hội của bé một cách dễ dàng, minh bạch.',
    },
    {
        icon: <ThumbUpAltRoundedIcon sx={{ fontSize: 36 }} />,
        title: 'Giao diện thân thiện, dễ sử dụng',
        description:
            'Ứng dụng có thiết kế dễ dùng cho cả giáo viên và phụ huynh, tạo kết nối thuận tiện giữa nhà trường và gia đình.',
    },
    {
        icon: <AutoFixHighRoundedIcon sx={{ fontSize: 36 }} />,
        title: 'Báo cáo thông minh & trực quan',
        description:
            'Các báo cáo học tập và hoạt động được thể hiện bằng biểu đồ và hình ảnh giúp phụ huynh nắm bắt dễ dàng.',
    },
];

const sentences = [
    'Chào mừng đến với Sakura School!',
    'Môi trường học tập lý tưởng cho bé.',
    'Cùng đồng hành phát triển mỗi ngày.',
];

export default function SakuraContent() {
    const [displayedText, setDisplayedText] = React.useState('');
    const [sentenceIndex, setSentenceIndex] = React.useState(0);

    // Typing animation
    React.useEffect(() => {
        let index = 0;
        const fullText = sentences[sentenceIndex];
        const typingInterval = setInterval(() => {
            if (index < fullText.length) {
                setDisplayedText(fullText.slice(0, index + 1));
                index++;
            } else {
                clearInterval(typingInterval);
                setTimeout(() => {
                    setSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length);
                }, 1200);
            }
        }, 100);
        return () => clearInterval(typingInterval);
    }, [sentenceIndex]);

    return (
        <Stack
            spacing={4}
            sx={{
                maxWidth: 640,
                mx: 'auto',
                alignItems: 'center',
                px: 2,
                py: 4,
            }}
        >
            {/* Typing Text */}
            <Box sx={{ minHeight: 40, textAlign: 'center' }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: '#e6687a',
                        fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                        transition: 'transform 0.3s',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }}
                >
                    {displayedText}
                </Typography>
            </Box>

            {/* Feature Items */}
            <Stack spacing={3} width="100%">
                {items.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            gap: 2,
                            p: 2.5,
                            borderRadius: 3,
                            backgroundColor: '#f8fbfe',
                            border: '1px solid #d6eaff',
                            alignItems: 'flex-start',
                            transition: 'all 0.35s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#edf6fc',
                                boxShadow: '0px 8px 20px rgba(57, 130, 184, 0.2)',
                                transform: 'translateY(-3px)',
                            },
                            '& svg': {
                                color: '#4194cb',
                                transition: 'color 0.3s ease',
                            },
                        }}
                    >
                        <Box>{item.icon}</Box>
                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600, color: '#3982b8' }}
                            >
                                {item.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {item.description}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Stack>
        </Stack>
    );
}
