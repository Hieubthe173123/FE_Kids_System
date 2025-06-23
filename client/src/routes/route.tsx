import AdminHome from "../components/AdminHome";
import ParentHome from "../components/ParentHome";
import PrincipalHome from "../components/PrincipalHome";
import TeacherHome from "../components/TeacherHome";
import TimeTable from "../pages/Parent/TimeTable";


export const routesParent = [
    {
        path: "/parent-home",
        component: ParentHome,
    },

    {
        path: "/time-table",
        component: TimeTable,
    }

];

export const routesTeacher = [
    {
        path: "/teacher-home",
        component: TeacherHome,
    }
];

export const routesSchoolPrincipal = [
    {
        path: "/schoolprincipal-home",
        component: PrincipalHome,
    }
];

export const routesAdmin = [
    {
        path: "/admin-home",
        component: AdminHome,
    }
];