import { Box, Button, Container, Grid, Typography, useTheme, alpha } from '@mui/material';
import { motion, easeOut } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { FallingPetalsJS } from './FallingPetalsJS';

const FONT_FAMILY = "'Poppins', 'Roboto', sans-serif";
const mainBlue = '#46a2da';
const accentPink = '#e6687a';

const enrollmentBenefits = [
    'Môi trường học tập chuẩn quốc tế, an toàn và đầy cảm hứng.',
    'Phương pháp giáo dục sớm giúp bé phát triển toàn diện tư duy và kỹ năng.',
    'Đội ngũ giáo viên tận tâm, yêu trẻ và có chuyên môn cao.',
    'Chương trình dinh dưỡng khoa học, bữa ăn đa dạng và hấp dẫn.',
];

const ImageMosaic = ({ imageUrl }) => {
    const gridTemplate = [
        { x: -50, y: -50, pos: '0% 0%' },
        { x: 50, y: -50, pos: '100% 0%' },
        { x: -50, y: 50, pos: '0% 100%' },
        { x: 50, y: 50, pos: '100% 100%' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
        },
    };

    const tileVariants = {
        hidden: (custom) => ({ opacity: 0, x: custom.x, y: custom.y, scale: 0.8 }),
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            transition: { duration: 0.7, ease: easeOut },
        },
    };

    return (
        <Box
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={containerVariants}
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: '12px',
                width: '100%',
                aspectRatio: '1/1',
                maxWidth: '500px',
                mx: 'auto'
            }}
        >
            <FallingPetalsJS />
            {gridTemplate.map((tile, index) => (
                <motion.div
                    key={index}
                    custom={tile}
                    variants={tileVariants}
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: '200% 200%',
                        backgroundPosition: tile.pos,
                        borderRadius: '16px',
                    }}
                />
            ))}
        </Box>
    );
};


const BenefitItem = ({ text }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
        <CheckCircleIcon sx={{ color: accentPink, fontSize: '1.4rem', mt: '3px' }} />
        <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: FONT_FAMILY }}>
            {text}
        </Typography>
    </Box>
);

export const EnrollmentCTASection = () => {
    const theme = useTheme();
    const textContainerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };
    const textItemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOut } },
    };

    return (
        <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#f2fafe', overflow: 'hidden' }}>
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 8, md: 10 }} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <ImageMosaic imageUrl="/1.png" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={textContainerVariants}
                        >
                            <motion.div variants={textItemVariants}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontFamily: FONT_FAMILY,
                                        fontWeight: 700,
                                        lineHeight: 1.3,
                                        mb: 2,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    Chào mừng bé đến với{' '}
                                    <span style={{
                                        background: `linear-gradient(90deg, ${accentPink} 0%, ${mainBlue} 100%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}>
                                        Sakura
                                    </span>
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', fontSize: '1.1rem' }}>
                                    Năm học mới sắp bắt đầu! Hãy để Mầm non Sakura là nơi chắp cánh cho những ước mơ đầu đời của con bạn.
                                </Typography>
                            </motion.div>

                            <motion.div variants={textItemVariants}>
                                {enrollmentBenefits.map((text, index) => (
                                    <BenefitItem key={index} text={text} />
                                ))}
                            </motion.div>

                            <motion.div variants={textItemVariants}>
                                <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<EditCalendarIcon />}
                                        sx={{
                                            bgcolor: accentPink,
                                            borderRadius: '50px',
                                            px: 4, py: 1.5,
                                            fontWeight: 'bold', textTransform: 'none',
                                            boxShadow: `0 8px 25px ${alpha(accentPink, 0.3)}`,
                                            '&:hover': {
                                                bgcolor: alpha(accentPink, 0.9),
                                                transform: 'translateY(-2px)',
                                            },
                                        }}
                                    >
                                        Đăng ký Tư vấn
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            borderColor: alpha(mainBlue, 0.5),
                                            color: 'primary.main',
                                            borderRadius: '50px',
                                            px: 4, py: 1.5,
                                            fontWeight: 'bold', textTransform: 'none',
                                            '&:hover': {
                                                bgcolor: alpha(mainBlue, 0.1),
                                                borderColor: mainBlue,
                                            },
                                        }}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </Box>
                            </motion.div>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};