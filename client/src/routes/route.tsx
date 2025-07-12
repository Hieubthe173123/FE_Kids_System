import { Navigate } from "react-router-dom";
import AdminHome from "../components/AdminHome";
import ParentHome from "../components/ParentHome";
import PrincipalHome from "../components/PrincipalHome";
import TeacherHome from "../components/TeacherHome";
import TimeTable from "../pages/Parent/TimeTable";
import DailyFeedback from "../pages/Parent/DailyFeedback";
import MenuManagerDaily from "../pages/Principal/MenuDailyWeekly";
import MenuManager from "../pages/Principal/MenuManager";
import ClassFormManager from "../pages/Principal/ClassFormManager";
import ProcessEnroll from "../pages/Principal/ProcessEnroll"
import TestAuth from "../components/Auth/TestAuth";
import ClassMannager from "../pages/Principal/ClassMannager";
import CurriculimList from "../pages/Principal/CurriculumList";
import ParentManagement from "../pages/Principal/ParentManager";
import StudentManagement from "../pages/Principal/StudentManagement";
import AddParentModal from "../pages/Principal/AddParentModal";
import MealTimeline from "../pages/Parent/MealTimeline";
import StudentForm from "../pages/Principal/StudentForm";
import SchoolYearList from "../pages/Principal/SchoolYearList";

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
                path: "meal-time",
                component: MealTimeline,
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
                component: ClassMannager,
            },
               {
                path: "schoolYear-management",
                component: SchoolYearList,
            },
            {
                path: "menu-dailyWeekly",
                component: MenuManagerDaily,
            },
            {
                path: "menu-management",
                component: MenuManager,
            },
            {
                path: "create-class",
                component: ClassFormManager,

            },
            {
                path: "process-enroll",
                component: ProcessEnroll,
            },
            {
                path: "curriculum-management",
                component: CurriculimList,
            },
            {
                path: "parent-management",
                component: ParentManagement,
            },
            {
                path: "parent-create",
                component: AddParentModal,
            },
            {
                path: "parent-edit/:id",
                component: AddParentModal,
            },
            {
                path: "students-create",
                component: StudentForm,
            },
            {
                path: "students-edit/:id",
                component: StudentForm,
            },
            {
                path: "students-management",
                component: StudentManagement,
            }

        ],
    },
];