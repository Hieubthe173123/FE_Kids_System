import { Navigate, Outlet } from "react-router-dom";
import { getUserFromToken } from "../helper/authHelper";

const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = getUserFromToken(accessToken || "");
    const role = userData?.role?.toLowerCase();

    if (!userData) return <Navigate to="/sign-in" replace />;
    if (!role || !allowedRoles.includes(role)) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default PrivateRoute;
