// src/layouts/RoleLayout.tsx
import { Navigate, Outlet } from "react-router-dom";
import { getUserFromToken } from "../helper/authHelper";
import {
    AppProvider,
    type Session,
    type Navigation,
} from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider, useDemoRouter } from "@toolpad/core/internal";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ChildCareIcon from "@mui/icons-material/ChildCare";

import { ROLE } from "../constants/roles";

const getNavigationByRole = (role: string): Navigation => {


    const roleMap: Record<string, Navigation> = {
        [ROLE.ADMIN]: [
            { segment: "users", title: "User Management", icon: <AdminPanelSettingsIcon /> },
            { segment: "settings", title: "System Settings", icon: <SchoolIcon /> },
        ],
        [ROLE.PRINCIPAL]: [
            { segment: "school-overview", title: "School Overview", icon: <SchoolIcon /> },
            { segment: "teachers", title: "Teachers", icon: <GroupsIcon /> },
        ],
        [ROLE.TEACHER]: [
            { segment: "my-classes", title: "Lớp của tôi", icon: <SchoolIcon /> },
            { segment: "students", title: "Học sinh", icon: <GroupsIcon /> },
        ],
        [ROLE.PARENT]: [
            { segment: "time-table", title: "Lịch học", icon: <ChildCareIcon /> },
            { segment: "feedback", title: "Đánh giá học sinh", icon: <DashboardIcon /> },
        ],
    };

    return [...(roleMap[role] || [])];
};

export default function RoleLayout() {
    const token = localStorage.getItem("accessToken");
    const user = getUserFromToken(token || "");

    if (!user) return <Navigate to="/sign-in" replace />;

    const role = user.role?.toLowerCase?.();
    const router = useDemoRouter("/");

    const session: Session = {
        user: {
            name: "Current User",
            email: "current@user.com",
            image: "https://i.pravatar.cc/150?img=3",
            role: role || "unknown",
        },
    };

    const navigation = getNavigationByRole(role || "");

    return (
        <DemoProvider>
            <AppProvider
                session={session}
                authentication={{ signIn: () => { }, signOut: () => { } }}
                navigation={navigation}
                router={router}
            >
                <DashboardLayout>
                    <Outlet />
                </DashboardLayout>
            </AppProvider>
        </DemoProvider>
    );
}
