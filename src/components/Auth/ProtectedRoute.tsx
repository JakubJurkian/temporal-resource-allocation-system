import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import type { ReactNode } from "react";

type UserRole = "admin" | "client";
interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Not Logged In? -> Send to Login
  // "state={{ from: location }}" lets redirect them back after login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged In, but Wrong Role? -> Send to Unauthorized
  if (!allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized? -> Render the child route
  return children;
};

export default ProtectedRoute;
