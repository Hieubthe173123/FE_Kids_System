import * as React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import {
    AppProvider,
    type Session,
    type Navigation,
} from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DemoProvider } from '@toolpad/core/internal';
import { logout } from "../redux/auth/authAPI"
import {
    Outlet,
    useLocation,
    useNavigate,
    useNavigationType,
} from 'react-router-dom';
import { AdminPanelSettings, BarChart, Home } from '@mui/icons-material';

const NAVIGATION: Navigation = [
    {
        segment: '',
        title: 'Trang chủ',
        icon: <Home />,
    },
    {
        segment: 'account-management',
        title: 'Quản lý tài khoản',
        icon: <AdminPanelSettings />,
    },
 
    {
        segment: 'statistics',
        title: 'Thống kê',
        icon: <BarChart />,
    },
    
];

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

export default function AdminHome() {
    const location = useLocation();
    const navigate = useNavigate();
    const navigationType = useNavigationType();
    const pathname = location.pathname.replace('/admin-home', '') || '/';

    const [isMenuExpanded, setIsMenuExpanded] = React.useState<boolean>(
        JSON.parse(localStorage.getItem('parentMenuExpanded') || 'false')
    );
    console.log(setIsMenuExpanded)
    const [loading, setLoading] = React.useState<boolean>(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const session: Session = {
        user: {
            name: user.fullName,
            email: user.email,
            image: user.image,
        },
    };

    const authentication = {
        signIn: () => { },
        signOut: async () => {
            await logout();
            window.location.href = '/sign-in';
        },
    };

    React.useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, [location, navigationType]);

    React.useEffect(() => {
        localStorage.setItem('parentMenuExpanded', JSON.stringify(isMenuExpanded));
    }, [isMenuExpanded]);

    return (
        <DemoProvider>
            <AppProvider
                session={session}
                authentication={authentication}
                navigation={NAVIGATION}
                router={{
                    pathname,
                    searchParams: new URLSearchParams(location.search),
                    navigate: (to) => navigate(`/admin-home${to}`),
                }}
                theme={demoTheme}
                branding={{
                    logo: (
                        <Box display="flex" alignItems="center">
                            <SchoolIcon sx={{ fontSize: '2rem', mr: 1, color: '#1976d2' }} />
                            <Typography variant="h6" fontWeight="bold" color="#1976d2">
                                Admin Sakura
                            </Typography>
                        </Box>
                    ),
                    title: '',
                }}
            >
                <DashboardLayout
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '100vh',
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {loading && (
                            <Box position="fixed" top={0} left={0} right={0} zIndex={1101}>
                                <CircularProgress color="secondary" />
                            </Box>
                        )}
                        <Outlet />
                    </Box>
                </DashboardLayout>
            </AppProvider>
        </DemoProvider>
    );
}
