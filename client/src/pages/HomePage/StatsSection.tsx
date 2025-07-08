import { Box, Container, Grid, Typography, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import CountUp from './CountUp';
import SchoolIcon from '@mui/icons-material/School';
import FaceIcon from '@mui/icons-material/Face';
import GroupIcon from '@mui/icons-material/Group';

const statsData = [
    {
        icon: <SchoolIcon sx={{ fontSize: '2.5rem' }} />,
        count: 1200,
        label: 'Trường mầm non\ntrên cả nước đang sử dụng',
        color: '#46a2da',
    },
    {
        icon: <FaceIcon sx={{ fontSize: '2.5rem' }} />,
        count: 20000,
        label: 'Giáo viên\nhạnh phúc và hài lòng',
        color: '#4194cb',
    },
    {
        icon: <GroupIcon sx={{ fontSize: '2.5rem' }} />,
        count: 150000,
        label: 'Tài khoản phụ huynh\ntương tác mỗi ngày',
        color: '#3982b8',
    },
];

const FONT_FAMILY = "'Poppins', 'Roboto', sans-serif";

type StatItemProps = {
    icon: React.ReactNode;
    count: number;
    label: string;
    color: string;
    index: number;
    isFeatured: boolean;
};

const StatItem: React.FC<StatItemProps> = ({ icon, count, label, color, index, isFeatured }) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, delay: index * 0.1 },
        },
    };

    const featuredStyles = isFeatured ? {
        transform: { xs: 'none', md: 'scale(1.1)' },
        background: `linear-gradient(145deg, ${color}, ${alpha(color, 0.7)})`,
        color: 'white',
        boxShadow: `0px 16px 40px ${alpha(color, 0.3)}`,
    } : {};

    return (
        <Grid item xs={12} sm={4} component={motion.div} variants={itemVariants} {...({} as any)}>
            <Box
                sx={{
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                    borderRadius: '24px',
                    backgroundColor: 'background.paper',
                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5,
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        transform: isFeatured ? { xs: 'none', md: 'scale(1.12)' } : 'translateY(-8px)',
                        boxShadow: isFeatured ? `0px 20px 45px ${alpha(color, 0.4)}` : `0px 12px 32px ${alpha(color, 0.2)}`,
                    },
                    ...featuredStyles,
                }}
            >
                <Box
                    sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isFeatured ? 'rgba(255,255,255,0.2)' : alpha(color, 0.15),
                        color: isFeatured ? 'white' : color,
                        transition: 'background-color 0.3s ease',
                    }}
                >
                    {icon}
                </Box>
                <Typography
                    variant="h4"
                    component="div"
                    sx={{
                        fontWeight: 700,
                        fontFamily: FONT_FAMILY,
                        color: isFeatured ? 'white' : 'text.primary',
                    }}
                >
                    <CountUp to={count} duration={2.5} separator="." />+
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        whiteSpace: 'pre-line',
                        fontFamily: FONT_FAMILY,
                        lineHeight: 1.6,
                        color: isFeatured ? alpha('#fff', 0.85) : 'text.secondary',
                    }}
                >
                    {label}
                </Typography>
            </Box>
        </Grid>
    );
};

export const StatsSection = () => {
    const theme = useTheme();
    const headerVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 100, duration: 0.8 },
        },
    };

    return (
        <Box
            component={motion.section}
            sx={{
                position: 'relative',
                py: { xs: 8, md: 12 },
                backgroundColor: '#f4f8fb',
                overflow: 'hidden',
            }}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 0,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '0%', left: '5%', width: '40%', height: '40%',
                        filter: 'blur(120px)',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.1)}, transparent 70%)`,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '0%', right: '5%', width: '40%', height: '40%',
                        filter: 'blur(120px)',
                        background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.1)}, transparent 70%)`,
                    }}
                />
            </motion.div>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={{ xs: 8, md: 6 }} alignItems="center" justifyContent="center">
                    <Grid item xs={12} lg={4} {...({} as any)}>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={headerVariants} {...({} as any)}>
                            <Typography variant="h2" sx={{ fontFamily: FONT_FAMILY, fontWeight: 700, mb: 2, lineHeight: 1.3, color: 'text.primary', textAlign: { xs: 'center', lg: 'left' } }}>
                                Những con số <br />
                                <span style={{ color: theme.palette.primary.main }}>biết nói</span>
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: FONT_FAMILY, textAlign: { xs: 'center', lg: 'left' } }}>
                                Nền tảng của chúng tôi không chỉ là công cụ, mà là người bạn đồng hành, giúp đơn giản hóa quản lý và nâng cao chất lượng dạy và học.
                            </Typography>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} lg={8} {...({} as any)}>
                        <Grid container spacing={3} alignItems="center" justifyContent="center">
                            {statsData.map((stat, index) => (
                                <StatItem
                                    key={index}
                                    icon={stat.icon}
                                    count={stat.count}
                                    label={stat.label}
                                    color={stat.color}
                                    index={index}
                                    isFeatured={index === 1}
                                />
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};