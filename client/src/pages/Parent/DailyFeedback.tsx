import { Box, Typography, Paper, Avatar, Stack } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

type FeedbackItem = {
    time: string;
    subject: string;
    feedback: string;
    period: 'morning' | 'afternoon';
};

const mockFeedbacks: FeedbackItem[] = [
    {
        time: '7:30 - 7:45',
        subject: 'Đón trẻ & Thể dục sáng',
        feedback: 'Bé hợp tác tốt',
        period: 'morning',
    },
    {
        time: '7:45 - 8:15',
        subject: 'Ăn sáng',
        feedback: 'Ăn hết suất, vui vẻ',
        period: 'morning',
    },
    {
        time: '8:15 - 8:45',
        subject: 'Hoạt động ngoài trời',
        feedback: 'Tham gia năng động',
        period: 'morning',
    },
    {
        time: '8:45 - 9:15',
        subject: 'Hoạt động tập thể',
        feedback: 'Tích cực phát biểu',
        period: 'morning',
    },
    {
        time: '9:15 - 9:45',
        subject: 'Tiếng Việt - C5 Bài 8',
        feedback: 'Đọc rõ ràng, viết đẹp',
        period: 'morning',
    },
    {
        time: '9:45 - 10:15',
        subject: 'Phonics',
        feedback: 'Phát âm đúng, nhớ bài',
        period: 'morning',
    },
];

export default function DailyFeedback() {
    const studentName = 'Bé An';

    return (
        <Box mt={6} p={4} bgcolor="#f5f7fb" minHeight="100vh">
            <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 700, color: '#e6687a', display: 'flex', alignItems: 'center', gap: 1 }}
            >
                💬 Nhận xét tổng kết trong ngày
            </Typography>
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: '#fff5f7',
                    border: '2px solid #f8bbd0',
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Hôm nay <strong>{studentName}</strong> đã:
                </Typography>

                <Stack spacing={2}>
                    {mockFeedbacks.map((item, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                p: 2,
                                borderRadius: 3,
                                bgcolor: '#ffffff',
                                borderLeft: '5px solid #46a2da',
                                boxShadow: 1,
                            }}
                        >
                            <Avatar sx={{ bgcolor: '#4194cb' }}>
                                {idx % 3 === 0 ? (
                                    <EmojiEmotionsIcon />
                                ) : idx % 3 === 1 ? (
                                    <ThumbUpAltIcon />
                                ) : (
                                    <AutoStoriesIcon />
                                )}
                            </Avatar>
                            <Box>
                                <Typography fontSize={14} fontWeight={600}>
                                    {item.subject} ({item.period === 'morning' ? 'Sáng' : 'Chiều'}) - {item.time}
                                </Typography>
                                <Typography fontSize={14}>{item.feedback}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Paper>
        </Box>
    );
}
