import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';
import LoginForm from '../../pages/SignIn/LoginForm';
import SakuraContent from '../../pages/SignIn/SakuraContent';
import { useNavigate } from 'react-router-dom';

export default function SignInSide() {
    const navigate = useNavigate();
    return (
        <>
            <CssBaseline enableColorScheme />
            <Box
                sx={{
                    height: '100vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Nút Back về trang chủ */}
                <Box sx={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
                    <Box component="button"
                        onClick={() => navigate("/")}
                        sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            border: '1px solid #1976d2',
                            background: '#fff',
                            color: '#1976d2',
                            fontWeight: 500,
                            cursor: 'pointer',
                            boxShadow: 1,
                            transition: 'all 0.2s',
                            '&:hover': {
                                background: '#e3f2fd',
                                borderColor: '#1565c0',
                            },
                        }}
                    >
                        ← Về trang chủ
                    </Box>
                </Box>
                <Stack
                    direction="row"
                    component="main"
                    sx={[
                        {
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            px: { xs: 2, sm: 6 },
                        },
                        (theme) => ({
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                zIndex: -1,
                                backgroundImage:
                                    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                                backgroundRepeat: 'no-repeat',
                                ...theme.applyStyles?.('dark', {
                                    backgroundImage:
                                        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
                                }),
                            },
                        }),
                    ]}
                >
                    <Stack
                        direction={{ xs: 'column-reverse', md: 'row' }}
                        spacing={{ xs: 4, md: 8 }}
                        alignItems="center"
                        justifyContent="center"
                        sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}
                    >
                        <SakuraContent />
                        <LoginForm />
                    </Stack>
                </Stack>
            </Box>
        </>
    );
}
