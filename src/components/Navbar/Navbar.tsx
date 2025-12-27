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
        {/* Auth Dependent Links */}
        {!isAuthenticated ? (
          <>
            <Link to="/about">About</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/login" className={styles.loginBtn}>
              Login
            </Link>
          </>
        ) : (
          <>
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
