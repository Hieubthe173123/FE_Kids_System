import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface Meal {
    time: string;
    content: string;
}

export default function MealTimeline() {
    const meals: Meal[] = [
        { time: '7:30', content: 'Sữa tươi' },
        { time: '10:30', content: 'Cơm + Thịt kho + Canh rau ngót' },
        { time: '14:30', content: 'Bánh flan' },
    ];

    return (
        <Box mt={6} p={4} minHeight="100vh" bgcolor="#f5f7fb">
            <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 700, color: '#e6687a', display: 'flex', alignItems: 'center', gap: 1 }}
            >
                🥗 Thực đơn hôm nay
            </Typography>
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: '#fefefe',
                    backgroundImage: 'linear-gradient(to bottom right, #f0faff, #ffffff)',
                }}
            >
                <Timeline position="alternate">
                    {meals.map((meal, index) => (
                        <TimelineItem key={index}>
                            <TimelineSeparator>
                                <TimelineDot sx={{ bgcolor: '#46a2da' }}>
                                    <RestaurantIcon sx={{ color: 'white', fontSize: 18 }} />
                                </TimelineDot>
                                {index < meals.length - 1 && (
                                    <TimelineConnector sx={{ bgcolor: '#4194cb' }} />
                                )}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Card
                                    elevation={2}
                                    sx={{
                                        borderLeft: '6px solid #e6687a',
                                        borderRadius: 3,
                                        p: 2,
                                        mb: 1,
                                        bgcolor: '#fdfcff',
                                        transition: 'transform 0.2s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: 4,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 0 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                color: '#0d47a1',
                                                fontWeight: 600,
                                            }}
                                        >
                                            <AccessTimeIcon sx={{ fontSize: 18 }} />
                                            {meal.time}
                                        </Typography>
                                        <Typography sx={{ mt: 0.5, fontSize: 16, fontWeight: 500 }}>
                                            {meal.content}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </Paper>
        </Box>
    );
}
