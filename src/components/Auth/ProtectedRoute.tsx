import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
interface ProtectedRouteProps {
  allowedRoles: ["admin", "user"];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Not Logged In? -> Send to Login
  // "state={{ from: location }}" lets redirect them back after login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged In, but Wrong Role? -> Send to Unauthorized
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized? -> Render the child route
  return <Outlet />;
};

export default ProtectedRoute;
