import { Navigate } from "react-router-dom";
import AdminHome from "../components/AdminHome";
import ParentHome from "../components/ParentHome";
import PrincipalHome from "../components/PrincipalHome";
import TeacherHome from "../components/TeacherHome";
import TimeTable from "../pages/Parent/TimeTable";
import DailyFeedback from "../pages/Parent/DailyFeedback";
import ViewClassScreen from "../pages/Principal/ViewClassScreen";
import ClassFormManager from "../pages/Principal/ClassFormManager";
import TestAuth from "../components/Auth/TestAuth";



export const routesParent = [
    {
        path: "/parent-home",
        component: ParentHome,
        children: [
            {
                index: true,
                component: () => <Navigate to="time-table" replace />,
            },
            {
                path: "time-table",
                component: TimeTable,
            },
            {
                path: "feedback",
                component: DailyFeedback,
            },
            {
                path: "test-auth",
                component: TestAuth
            }
        ],
    },
];


export const routesAdmin = [
    {
        path: '/admin-home',
        component: AdminHome,
        children: [
            { index: true, component: () => <Navigate to="admin-home" replace /> },
            { path: 'dashboard', component: AdminHome },
        ],
    },
];

export const routesTeacher = [
    {
        path: '/teacher-home',
        component: TeacherHome,
        children: [
            { index: true, component: () => <Navigate to="teacher-home" replace /> },
            { path: 'Home', component: TeacherHome },
        ],
    },
];

export const routesSchoolPrincipal = [
    {
        path: '/principal-home',
        component: PrincipalHome,
        children: [
            { index: true, component: () => <Navigate to="principal-home" replace /> },
            { path: 'Home', component: PrincipalHome },
            {
                path: "class-management",
                component: ViewClassScreen,
            },
            {
                path: "create-class",
                component: ClassFormManager,

            }
        ],
    },
];