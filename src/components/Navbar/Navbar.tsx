import { useState } from "react"; // <--- Import this
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import styles from "./Navbar.module.scss";

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  // 1. State for Mobile Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = !!user;

  const logoutHandle = () => {
    dispatch(logout());
    setIsMenuOpen(false); // Close menu on action
    navigate("/");
  };

  // Close menu when clicking a link (UX best practice)
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.topBar}>
      <Link to="/" className={styles.logo} onClick={closeMenu}>
        Velo<span className={styles.highlight}>City</span>
      </Link>

      {/* 2. Hamburger Icon (Visible only on Mobile) */}
      <button
        className={`${styles.burger} ${isMenuOpen ? styles.active : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* 3. Navigation Links (Drawer on Mobile, Row on Desktop) */}
      <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}>
        {/* Auth Links */}
        {!isAuthenticated ? (
          <>
            <Link to="/about" onClick={closeMenu}>
              About
            </Link>
            <Link to="/pricing" onClick={closeMenu}>
              Pricing
            </Link>
            <Link to="/login" className={styles.loginBtn} onClick={closeMenu}>
              Login
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" onClick={closeMenu}>
              Dashboard
            </Link>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.fullName}</span>
              <div className={styles.avatar}>
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
            </div>
            <button onClick={logoutHandle} className={styles.loginBtn}>
              Log Out
            </button>
          </>
        )}
      </div>
    </header>
  );
};
