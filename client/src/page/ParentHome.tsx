import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import {
    AppProvider,
    type Session,
    type Navigation,
} from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';

import TimeTable from '../components/Parent/TimeTable';

const NAVIGATION: Navigation = [
    {
        segment: 'time-table',
        title: 'Time Table',
        icon: <DashboardIcon />,
    },
    {
        segment: 'feedback',
        title: 'Students Feedback',
        icon: <DashboardIcon />,
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

function DemoPageContent({ pathname }: { pathname: string }) {
    switch (pathname) {
        case '/time-table':
            return <TimeTable />;
        case '/feedback':
            return (
                <Box sx={{ p: 4 }}>
                    <Typography variant="h4">Student Feedback</Typography>
                    <Typography>Trang phản hồi từ học sinh</Typography>
                </Box>
            );
        default:
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
                    <Typography>Dashboard content for {pathname}</Typography>
                </Box>
            );
    }
}

interface DemoProps {
    window?: () => Window;
}

export default function ParentHome(props: DemoProps) {
    const { window } = props;

    const [session, setSession] = React.useState<Session | null>({
        user: {
            name: 'Phụ huynh Sakura',
            email: 'parent@sakura.edu.vn',
            image: 'https://avatars.githubusercontent.com/u/19550456',
        },
    });

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: 'Phụ huynh Sakura',
                        email: 'parent@sakura.edu.vn',
                        image: 'https://avatars.githubusercontent.com/u/19550456',
                    },
                });
            },
            signOut: () => {
                setSession(null);
            },
        };
    }, []);

    const router = useDemoRouter('/time-table'); // default to /time-table
    const demoWindow = window !== undefined ? window() : undefined;

    return (
        <DemoProvider window={demoWindow}>
            <AppProvider
                session={session}
                authentication={authentication}
                navigation={NAVIGATION}
                router={router}
                theme={demoTheme}
                window={demoWindow}
                branding={{
                    title: 'Sakura School',
                }}
            >
                <DashboardLayout>
                    <DemoPageContent pathname={router.pathname} />
                </DashboardLayout>
            </AppProvider>
        </DemoProvider>
    );
}
