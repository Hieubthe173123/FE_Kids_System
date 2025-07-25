import { Box, Button, Container, Grid, Typography, styled, keyframes } from '@mui/material';
import { FallingPetalsJS } from './FallingPetalsJS';

const FONT_FAMILY = "'Poppins', sans-serif";
const IMAGE_URL = '/1.jpg';

const gentleBounce = keyframes`
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  80% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const HeroWrapper = styled(Box)(() => ({
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(90deg, #fef9f4 0%, #f4faff 100%)',
    padding: '80px 0',
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
}));

const WavyTopBorder = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 32"
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            color: '#29c2b4',
        }}
    >
        <path
            fill="currentColor"
            fillOpacity="0.5"
            d="M0,22L20,21.3C40,20.7,80,19.3,120,20.2C160,21,200,24,240,25.8C280,27.7,320,28.3,360,26.5C400,24.7,440,20.3,480,19.2C520,18,560,20,600,21C640,22,680,22,720,20.7C760,19.3,800,16.7,840,16.5C880,16.3,920,18.7,960,19.8C1000,21,1040,21,1080,19.8C1120,18.7,1160,16.3,1200,15.2C1240,14,1280,14,1320,15.8C1360,17.7,1400,21.3,1420,23.2L1440,25L1440,0L1420,0C1400,0,1360,0,1320,0C1280,0,1240,0,1200,0C1160,0,1120,0,1080,0C1040,0,1000,0,960,0C920,0,880,0,840,0C800,0,760,0,720,0C680,0,640,0,600,0C560,0,520,0,480,0C440,0,400,0,360,0C320,0,280,0,240,0C200,0,160,0,120,0C80,0,40,0,20,0L0,0Z"
        ></path>
    </svg>
);

const ImageWrapper = styled(Box)({
    position: 'relative',
    maxWidth: '500px',
    margin: '0 auto',
    animation: `${gentleBounce} 2s ease-out forwards`,
});

const Doodle = styled('div')({
    position: 'absolute',
    zIndex: 1,
    animation: `${float} 4s ease-in-out infinite`,
});


export const EnrollmentCTASection = () => {
    return (
        <HeroWrapper>
            <FallingPetalsJS />
            <WavyTopBorder />
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 8, md: 4 }} alignItems="center">
                    <Grid item xs={12} md={6} {...({} as any)}>
                        <Box>
                            <Typography
                                sx={{
                                    color: '#29c2b4',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    fontFamily: FONT_FAMILY,
                                    mb: 2,
                                }}
                            >
                                Chương trình Sakura
                            </Typography>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontFamily: FONT_FAMILY,
                                    fontWeight: 900,
                                    fontSize: { xs: '3.2rem', md: '3.2rem' },
                                    lineHeight: 1.2,
                                    color: '#384145',
                                    mb: 2,
                                }}
                            >
                                Giáo trình giáo dục
                                <br />
                                tốt nhất cho trẻ em
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: FONT_FAMILY,
                                    color: '#5a6165',
                                    mb: 4,
                                    textDecoration: 'underline',
                                }}
                            >
                                Nhận đăng ký từ 20-24 tháng 4
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: '#f9a84b',
                                    color: 'white',
                                    fontFamily: FONT_FAMILY,
                                    fontWeight: '700',
                                    borderRadius: '50px',
                                    textTransform: 'none',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    boxShadow: '0 8px 25px -8px #f9a84b',
                                    '&:hover': {
                                        bgcolor: '#f89e38',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                Đăng ký ngay
                            </Button>
                        </Box>
                    </Grid>

                    {/* === PHẦN HIỂN THỊ ẢNH VỚI ANIMATION === */}
                    <Grid item xs={12} md={6} {...({} as any)}>
                        <ImageWrapper>
                            <Doodle style={{ top: '-15px', left: '150px', animationDelay: '0s' }}>
                                <svg width="67" height="15" viewBox="0 0 67 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.58043 11.2313C12.1611 1.70258 41.8402 -2.10268 58.4196 6.5501" stroke="#FDB556" strokeWidth="4" strokeLinecap="round" />
                                    <path d="M8.58043 12.2313C18.1611 2.70258 47.8402 -1.10268 64.4196 7.5501" stroke="#F9A84B" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </Doodle>
                            <Doodle style={{ top: '30px', right: '30px', animationDelay: '0.5s' }}>
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M46 24C46 36.1503 36.1503 46 24 46C11.8497 46 2 36.1503 2 24C2 11.8497 11.8497 2 24 2C36.1503 2 46 11.8497 46 24Z" stroke="#FDB556" strokeWidth="3" />
                                    <path d="M17.5 20.5C18.3284 20.5 19 19.8284 19 19C19 18.1716 18.3284 17.5 17.5 17.5C16.6716 17.5 16 18.1716 16 19C16 19.8284 16.6716 20.5 17.5 20.5Z" fill="#FDB556" stroke="#FDB556" />
                                    <path d="M30.5 20.5C31.3284 20.5 32 19.8284 32 19C32 18.1716 31.3284 17.5 30.5 17.5C29.6716 17.5 29 18.1716 29 19C29 19.8284 29.6716 20.5 30.5 20.5Z" fill="#FDB556" stroke="#FDB556" />
                                    <path d="M16 31C16 31 19 35 24 35C29 35 32 31 32 31" stroke="#FDB556" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            </Doodle>
                            <Doodle style={{ top: '50%', left: '-15px', transform: 'translateY(-50%) rotate(-15deg)', animationDelay: '1s', animationDirection: 'alternate-reverse' }}>
                                <svg width="30" height="30" viewBox="0 0 35 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M32.5 19.5L2.5 37.5426L2.5 1.45738L32.5 19.5Z" fill="#29C2B4" stroke="#29C2B4" strokeOpacity="0.5" strokeWidth="2" />
                                </svg>
                            </Doodle>
                            <Doodle style={{ bottom: '20px', left: '50px', animationDelay: '1.5s' }}>
                                <Box sx={{ width: 50, height: 50, backgroundColor: '#C8F9F5', borderRadius: '47% 53% 69% 31% / 56% 40% 60% 44%', }} />
                            </Doodle>
                            <Doodle style={{ bottom: '10px', right: '50px', animationDelay: '0.2s' }}>
                                <Box sx={{ width: 60, height: 60, border: '3px solid #FDB556', borderRadius: '69% 31% 33% 67% / 56% 61% 39% 44%', }} />
                            </Doodle>

                            {/* Ảnh với clip-path */}
                            <img
                                src={IMAGE_URL}
                                alt="Child in kindergarten program"
                                style={{
                                    width: '100%',
                                    display: 'block',
                                    clipPath: 'ellipse(70% 50% at 50% 50%)',
                                }}
                            />
                        </ImageWrapper>
                    </Grid>
                </Grid>
            </Container>
        </HeroWrapper>
    );
};