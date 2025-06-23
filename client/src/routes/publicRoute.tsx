import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUserFromToken } from "../helper/authHelper";

const PublicRoute = () => {
    const accessToken = localStorage.getItem("accessToken");
    const location = useLocation();
    const pathname = location.pathname;

    const restrictedRoutes = ["/verify-otp", "/reset-password"];
    const isRestricted = restrictedRoutes.includes(pathname);

    if (!accessToken && isRestricted) {
        return <Navigate to="/sign-in" replace />;
    }

    if (accessToken) {
        const userData = getUserFromToken(accessToken);
        if (userData) {
            const { role } = userData;

            switch (role) {
                case "admin":
                    return <Navigate to="/admin-home" replace />;
                case "schoolprincipal":
                    return <Navigate to="/schoolprincipal-home" replace />;
                case "teacher":
                    return <Navigate to="/teacher-home" replace />;
                case "parent":
                    return <Navigate to="/parent-home" replace />;
                default:
                    return <Navigate to="/" replace />;
            }
        }
    }

    return <Outlet />;
};

export default PublicRoute;
