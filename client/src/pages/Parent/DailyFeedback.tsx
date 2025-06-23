import { Box, Typography, Paper, Avatar, Stack } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

interface Props {
    feedbacks: string[];
    studentName: string;
}

export default function DailyFeedback({ feedbacks, studentName }: Props) {
    return (
        <Box mt={6}>
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
                    {feedbacks.map((item, idx) => (
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
                            <Typography fontSize={16} fontWeight={500}>
                                {item}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Paper>
        </Box>
    );
}
