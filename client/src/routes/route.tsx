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
import AdminHomePage from "../pages/admin/admin.home/AdminHome";
import AccountDetail from "../pages/admin/admin.home/AccountDetail";
import ClassMannager from "../pages/Principal/ClassMannager";
import CurriculimList from "../pages/Principal/CurriculumList";
import ParentManagement from "../pages/Principal/ParentManager";
import StudentManagement from "../pages/Principal/StudentManagement";
import AddParentModal from "../pages/Principal/AddParentModal";
import MealTimeline from "../pages/Parent/MealTimeline";
import StudentForm from "../pages/Principal/StudentForm";
import SchoolYearList from "../pages/Principal/SchoolYearList";
import TeacherManagement from "../pages/Principal/TeacherList";
import TeacherDashboard from "../pages/teacher/teacher.dashboard/teacher.dashboard";
import TeacherOverviewPage from "../pages/teacher/teacher.page/teacher.overview";
import AttendancePage from "../pages/teacher/teacher.attendance/teacher.attendance";
import AttendanceHistoryPage from "../pages/teacher/teacher.attendance/history.attendance";
import Attendance from "../pages/Parent/Attendance";
import ParentProfile from "../pages/Parent/ParentProfile";
import ScheduleSwapPage from "../pages/teacher/swap/teacher.swap.lecture";

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
                path: "attendance",
                component: Attendance
            },
            {
                path: "profile",
                component: ParentProfile
            }
        ],
    },
];


export const routesAdmin = [
    {
        path: '/admin-home',
        component: AdminHome,
        children: [
            { index: true, component: () => <Navigate to="" replace /> },
            { path: '', component: AdminHomePage },
            { path: 'account-management', component: AdminHomePage },
            { path: 'account-management/:id', component: AccountDetail },
            { path: 'statistics', component: AdminHomePage },

        ],
    },
];

export const routesTeacher = [
    {
        path: '/teacher-home',
        component: TeacherHome,
        children: [
            { index: true, component: () => <Navigate to="" replace /> },
            { path: '', component: TeacherDashboard },
            // { path: 'time-table', component: TeacherTimetable },
            // { path: 'class-management', component: TeacherClass },
            { path: 'teacher-control', component: TeacherOverviewPage },
            { path: 'attendance', component: AttendancePage },
            { path: 'history-attendance', component: AttendanceHistoryPage },
            { path: 'swap-lecture', component: ScheduleSwapPage }

            //  { path: 'class-management/:id', component: TeacherStudent },
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
            },
            {
                path: "teacher-management",
                component: TeacherManagement,
            }

        ],
    },
];