import { useAppSelector } from "../../store/hooks";
import { Outlet } from "react-router-dom";
import Redirect from "../Utils/Redirect.tsx";

interface Props {
  children?: React.ReactNode;
}

const PublicOnlyRoute = ({ children }: Props) => {
  const user = useAppSelector((state) => state.auth.user);

  if (user) {
    // Redirect to dashboard if already logged in
    return <Redirect to="/dashboard" />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicOnlyRoute;