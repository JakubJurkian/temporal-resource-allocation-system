import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // If user is ALREADY logged in, send them to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the Login/Register page
  return <Outlet />;
};

export default PublicOnlyRoute;