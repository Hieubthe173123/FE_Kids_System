import { Box, Typography, Button } from '@mui/material';

const FONT_FAMILY = "'Poppins', sans-serif";

const JoinSessionSection = () => {
    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                minHeight: 260,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                overflow: 'hidden',
            }}
        >
            {/* Background image */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                }}
            >
                <img
                    src={'/mamnon.jpg'}
                    alt="Session background"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
                />
                {/* Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(41,194,180,0.7)',
                        zIndex: 2,
                    }}
                />
            </Box>
            {/* Content */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 3,
                    width: '100%',
                    maxWidth: 700,
                    mx: 'auto',
                    textAlign: 'center',
                    color: 'white',
                    py: { xs: 6, md: 8 },
                }}
            >
                <Typography variant="h4" fontWeight={900} sx={{ fontFamily: FONT_FAMILY, mb: 2 }}>
                    Đăng ký nhập học tại Sakura
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: FONT_FAMILY, mb: 3, color: 'white', opacity: 0.95 }}>
                    Hãy để bé trải nghiệm môi trường giáo dục hiện đại, sáng tạo và đầy yêu thương tại Sakura. Đăng ký ngay để nhận tư vấn, tham quan trường và nhận ưu đãi nhập học cho năm học mới!
                </Typography>
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
                        transition: 'transform 0.25s, box-shadow 0.25s',
                        '&:hover': {
                            background: '#f7b85c',
                            transform: 'scale(1.08)',
                            boxShadow: '0 4px 16px -4px #F9A84B99',
                        },
                        animation: 'pulseBtn 1.2s cubic-bezier(0.4,0,0.2,1) 0s 2',
                        '@keyframes pulseBtn': {
                            '0%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.12)', boxShadow: '0 4px 16px -4px #F9A84B99' },
                            '100%': { transform: 'scale(1)' },
                        },
                    }}
                >
                    Xem thêm
                </Button>
            </Box>
            {/* Bottom border accent */}
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    height: 6,
                    background: 'linear-gradient(90deg,#F9A84B 60%,transparent)',
                    zIndex: 4,
                }}
            />
        </Box>
    );
};

export default JoinSessionSection;
