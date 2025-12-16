import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import styles from "./DashboardPage.module.scss";
import { useEffect } from "react";

// Fake Data
const MOCK_STATS = {
  activeRentals: 1,
  bikesAvailable: 42,
  totalDistance: "128 km",
  caloriesBurned: "3,200",
};

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      // Optional: Redirect based on role
      const destination = user?.role === "admin" ? "/admin" : "/dashboard";
      navigate(destination, { replace: true });
    }
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  if (!user) return null;

  return (
    <main className={styles.container}>
      {/* Background Decor */}
      <div className={styles.glowOrbTop} aria-hidden="true"></div>

      {/* --- Navbar Area --- */}
      <header className={styles.topBar}>
        <div className={styles.logo}>
          Velo<span className={styles.highlight}>City</span>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user.fullName}</span>
          <div className={styles.avatar}>
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Log Out
          </button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <div className={styles.content}>
        <section className={styles.welcomeSection}>
          <h1>
            Hello,{" "}
            <span className={styles.highlight}>
              {user.fullName.split(" ")[0]}
            </span>
            .
          </h1>
          <p className={styles.subtitle}>Ready for your next ride?</p>
        </section>

        {/* --- Stats Grid (Fake Data) --- */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Active Rentals</h3>
            <div className={styles.statValue}>
              {MOCK_STATS.activeRentals}
              <span className={styles.statUnit}>bike</span>
            </div>
            <div className={`${styles.statusIndicator} ${styles.active}`}>
              Ongoing
            </div>
          </div>

          <div className={styles.statCard}>
            <h3>Fleet Status</h3>
            <div className={styles.statValue}>{MOCK_STATS.bikesAvailable}</div>
            <p className={styles.statLabel}>E-bikes nearby</p>
          </div>

          <div className={styles.statCard}>
            <h3>Your Impact</h3>
            <div className={styles.statValue}>{MOCK_STATS.totalDistance}</div>
            <p className={styles.statLabel}>Total distance ridden</p>
          </div>
        </section>

        {/* --- Actions Grid --- */}
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <section className={styles.actionsGrid}>
          {/* Action 1: Rent a Bike */}
          <Link
            to="/rent"
            className={`${styles.actionCard} ${styles.primaryAction}`}
          >
            <div className={styles.icon}>🚲</div>
            <div className={styles.actionInfo}>
              <h3>Rent a Bike</h3>
              <p>Find and book an e-bike near you</p>
            </div>
            <div className={styles.arrow}>➜</div>
          </Link>

          {/* Action 2: Edit Profile */}
          <Link to="/profile" className={styles.actionCard}>
            <div className={styles.icon}>👤</div>
            <div className={styles.actionInfo}>
              <h3>My Profile</h3>
              <p>Update your personal details</p>
            </div>
            <div className={styles.arrow}>➜</div>
          </Link>

          {/* Action 3: History (Placeholder) */}
          <div className={`${styles.actionCard} ${styles.disabled}`}>
            <div className={styles.icon}>📜</div>
            <div className={styles.actionInfo}>
              <h3>Ride History</h3>
              <p>Coming soon...</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
