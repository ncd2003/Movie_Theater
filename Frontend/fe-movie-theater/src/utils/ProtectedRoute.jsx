import { Navigate, useLocation } from "react-router-dom";
import Page403 from "../pages/auth/Page403";

const RoleBaseRoute = ({ children }) => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const userRole = localStorage.getItem("roleId") || ""; // Xử lý khi roleId null

    const hasAccess = isAdminRoute
        ? ["1", "2"].includes(userRole) // Chỉ admin & moderator
        : ["1", "2", "3"].includes(userRole); // Cả user bình thường

    return hasAccess ? children : <Page403 />;
};

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const isAdminRoute = location.pathname.startsWith('/admin');

    return isAuthenticated ? (
        <RoleBaseRoute>{children}</RoleBaseRoute>
    ) : (
        <Navigate to={isAdminRoute ? "/auth/signIn" : "/user/signIn"} replace />
    );
};

export default ProtectedRoute;
