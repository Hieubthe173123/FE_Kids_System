import { ROLE } from "../constants/roles";
import AdminHome from "../components/AdminHome";
import ParentHome from "../components/ParentHome";
import PrincipalHome from "../components/PrincipalHome";
import TeacherHome from "../components/TeacherHome";

export const mainRoute = {
    [ROLE.ADMIN]: [
        { path: "/admin-home", component: AdminHome },
    ],
    [ROLE.PRINCIPAL]: [
        { path: "/schoolprincipal-home", component: PrincipalHome },
    ],
    [ROLE.TEACHER]: [
        { path: "/teacher-home", component: TeacherHome },
    ],
    [ROLE.PARENT]: [
        { path: "/parent-home", component: ParentHome },
    ],
};
