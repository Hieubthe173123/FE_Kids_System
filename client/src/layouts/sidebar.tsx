import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import {
    AppProvider,
    type Session,
    type Navigation,
} from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';

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

const getNavigationByRole = (role: string): Navigation => {
    const common: Navigation = [
        { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
    ];

    const adminNav = [
        { segment: 'users', title: 'User Management', icon: <AdminPanelSettingsIcon /> },
        { segment: 'settings', title: 'System Settings', icon: <SchoolIcon /> },
    ];

    const principalNav = [
        { segment: 'school-overview', title: 'School Overview', icon: <SchoolIcon /> },
        { segment: 'teachers', title: 'Teachers', icon: <GroupsIcon /> },
    ];

    const teacherNav = [
        { segment: 'my-classes', title: 'Lớp của tôi', icon: <SchoolIcon /> },
        { segment: 'students', title: 'Học sinh', icon: <GroupsIcon /> },
    ];

    const parentNav = [
        { segment: 'my-children', title: 'Con của tôi', icon: <ChildCareIcon /> },
        { segment: 'feedback', title: 'Góp ý nhà trường', icon: <DashboardIcon /> },
    ];

    switch (role) {
        case 'Admin':
            return [...common, ...adminNav];
        case 'School Principal':
            return [...common, ...principalNav];
        case 'Teacher':
            return [...common, ...teacherNav];
        case 'Parent':
            return [...common, ...parentNav];
        default:
            return common;
    }
};

function DemoPageContent({ pathname }: { pathname: string }) {
    return (
        <Box
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <Typography variant="h5">Bạn đang ở: {pathname}</Typography>
        </Box>
    );
}

interface DemoProps {
    window?: () => Window;
}

export default function DashboardLayoutAccount(props: DemoProps) {
    const { window } = props;

    const testRole = 'Parent';

    const [session] = React.useState<Session | null>({
        user: {
            name: 'Test User',
            email: 'test@example.com',
            image: 'https://i.pravatar.cc/150?img=7',
            role: testRole,
        },
    });

    const authentication = React.useMemo(() => {
        return {
            signIn: () => { },
            signOut: () => { },
        };
    }, []);

    const router = useDemoRouter('/dashboard');
    const demoWindow = window !== undefined ? window() : undefined;
    const role = session?.user?.role ?? 'Guest';
    const navigation = getNavigationByRole(role);

    return (
        <DemoProvider window={demoWindow}>
            <AppProvider
                session={session}
                authentication={authentication}
                navigation={navigation}
                router={router}
                theme={demoTheme}
                window={demoWindow}
            >
                <DashboardLayout>
                    <DemoPageContent pathname={router.pathname} />
                </DashboardLayout>
            </AppProvider>
        </DemoProvider>
    );
}
