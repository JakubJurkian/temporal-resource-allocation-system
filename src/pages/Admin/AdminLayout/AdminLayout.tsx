import { useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import styles from "./AdminLayout.module.scss";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: "/admin/panel", icon: "📊", label: "Dashboard" },
    { to: "/admin/users", icon: "👥", label: "Users" },
    { to: "/admin/calendar", icon: "📅", label: "Calendar" },
  ];

  const handleLogout = () => {
    navigate("/");
    toast.success("Logged out successfully!");
  };

  return (
    <div className={styles.adminContainer}>
      {/* === TOP NAVIGATION BAR === */}
      <nav className={styles.topNav}>
        
        {/* LEFT: Mobile Toggle + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className={styles.mobileToggle}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? "✕" : "☰"}
          </button>
          
          <div className={styles.brand}>
            Velo<span className={styles.highlight}>City</span> Admin
          </div>
        </div>

        {/* CENTER: Desktop Menu */}
        <div className={styles.desktopMenu}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <span className={styles.icon}>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* RIGHT: User Actions (HIDDEN ON MOBILE via CSS) */}
        <div className={styles.userSection}>
          <Link to="/dashboard" className={styles.switchBtn} title="Go to User View">
            🏠 <span>Client View</span>
          </Link>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            🚪 <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* === MOBILE DRAWER === */}
      <div className={`${styles.mobileDrawer} ${isMobileOpen ? styles.open : ""}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
            onClick={() => setIsMobileOpen(false)}
          >
            <span className={styles.icon}>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}

        {/* ✅ MOBILE ACTIONS (Visible only in Drawer) */}
        <div className={styles.mobileActions}>
            <Link to="/dashboard" className={styles.mobileSwitch}>
               🏠 Client View
            </Link>
            
            <button className={styles.mobileLogout} onClick={handleLogout}>
               🚪 Logout
            </button>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;