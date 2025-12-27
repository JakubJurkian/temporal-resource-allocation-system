import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import styles from "./Navbar.module.scss";

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const isAuthenticated = !!user;

  const logoutHandle = () => {
    dispatch(logout());
    navigate("/"); // Redirect to home after logout
  };

  return (
    <header className={styles.topBar}>
      {/* Logo Area */}
      <Link to="/" className={styles.logo}>
        Velo<span className={styles.highlight}>City</span>
      </Link>

      {/* Navigation Area */}
      <div className={styles.navLinks}>
        {/* Public Links (Visible to everyone) */}
        <Link to="/about">About</Link>
        <Link to="/pricing">Pricing</Link>

        {/* Auth Dependent Links */}
        {!isAuthenticated ? (
          <Link to="/login" className={styles.loginBtn}>
            Login
          </Link>
        ) : (
          <>
            {/* Dashboard Link (Optional, if you want it in the header) */}
            <Link to="/dashboard">Dashboard</Link>

            <div className={styles.loginBtn} onClick={logoutHandle}>
              Logout
            </div>
          </>
        )}
      </div>
    </header>
  );
};
