import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import styles from "./DashboardPage.module.scss";
import Footer from "../../components/Footer/Footer";
import { useEffect, useState } from "react";
import type { Reservation } from "../../types/Reservation";

// Fake Data
const MOCK_STATS = {
  bikesAvailable: 42,
  totalDistance: "128 km",
  caloriesBurned: "3,200",
};

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // Safe access in case auth state isn't ready
  const user = useAppSelector((state) => state.auth.user);

  // --- HELPER FUNCTION ---
  const getActiveCount = (userId: string) => {
    try {
      const storedData = localStorage.getItem("velocity_reservations");
      if (!storedData) return 0;

      const parsedData = JSON.parse(storedData);
      // Filter for THIS user and confirmed status
      return parsedData.filter(
        (r: Reservation) => r.userId === userId && r.status === "confirmed"
      ).length;
    } catch (e) {
      console.log(e);
      return 0;
    }
  };

  const [activeRentals, setActiveRentals] = useState<number>(() =>
    getActiveCount(user?.id || "")
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  // Sync state if user changes (e.g. re-login scenario)
  useEffect(() => {
    if (!user?.id) return;

    const count = getActiveCount(user.id);

    // Safety check prevents infinite loops
    if (count !== activeRentals) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveRentals(count);
    }
  }, [user?.id, activeRentals]);

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

        {/* --- Stats Grid --- */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Active Rentals</h3>
            <div className={styles.statValue}>
              {activeRentals}
              <span className={styles.statUnit}>
                {activeRentals === 1 ? "bike" : "bikes"}
              </span>
            </div>
            {/* Show 'Ongoing' only if there are active rentals */}
            <div
              className={`${styles.statusIndicator} ${
                activeRentals > 0 ? styles.active : ""
              }`}
            >
              {activeRentals > 0 ? "Ongoing" : "No active rides"}
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
            to="/rent-bike"
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
      <Footer />
    </main>
  );
};

export default DashboardPage;
