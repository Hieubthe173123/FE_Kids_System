import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';
import LoginForm from '../components/SignIn/LoginForm';
import SakuraContent from '../components/SignIn/SakuraContent';

export default function SignInSide() {
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
