import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logout } from "../../../store/slices/authSlice";
import styles from "./AdminLayout.module.scss";

const AdminLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className={styles.adminContainer}>
      {/* --- SIDEBAR --- */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          Velo<span className={styles.highlight}>Admin</span>
        </div>

        <div className={styles.userSnippet}>
          <div className={styles.avatar}>
            {user?.fullName?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className={styles.meta}>
            <span className={styles.name}>{user?.fullName}</span>
            <span className={styles.role}>Administrator</span>
          </div>
        </div>

        <nav className={styles.navMenu}>
          <p className={styles.menuLabel}>Management</p>

          <NavLink
            to="/admin/panel"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
            end
          >
            <span className={styles.icon}>📊</span> Panel
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}>👥</span> Users
          </NavLink>

          <NavLink
            to="/admin/calendar"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}>📅</span> Calendar
          </NavLink>

          <p className={styles.menuLabel}>System</p>

          <NavLink to="/" className={styles.navItem}>
            <span className={styles.icon}>🏠</span> Back to App
          </NavLink>

          <button onClick={handleLogout} className={styles.logoutBtn}>
            <span className={styles.icon}>🚪</span> Log Out
          </button>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className={styles.mainContent}>
        {/* The child admin pages (Dashboard, Users, Fleet) render here */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
