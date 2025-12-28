import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import styles from "./DashboardPage.module.scss";
import type { Reservation } from "../../types/Reservation";
import { getFleet } from "../../utils/fleetStorage";

const calculateActiveRentals = (userId: string): number => {
  try {
    const storedData = localStorage.getItem("velocity_reservations");
    if (!storedData) return 0;

    const parsedData: Reservation[] = JSON.parse(storedData);
    return parsedData.filter(
      (r) => r.userId === userId && r.status === "confirmed"
    ).length;
  } catch (error) {
    console.error("Failed to parse reservations:", error);
    return 0;
  }
};

const DashboardPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id;
  const userCity = user?.city;
  const activeFleetCount = useMemo(() => {
    if (!userCity) return 0;

    const bikes = getFleet();
    return bikes.filter((b) => b.city === userCity && b.status === "active")
      .length;
  }, [userCity]);

  const activeRentals = useMemo(() => {
    if (!userId) return 0;
    return calculateActiveRentals(userId);
  }, [userId]);

  if (!user) return null;

  return (
    <>
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
          <h3>Rentals</h3>
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
          <div className={styles.statValue}>{activeFleetCount}</div>
          <p className={styles.statLabel}>E-bikes nearby</p>
        </div>

        <div className={styles.statCard}>
          <h3>Your Impact</h3>
          <div className={styles.statValue}>128 km</div>
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

        {/* Action 3: History */}
        <Link to="/my-rentals" className={styles.actionCard}>
          <div className={styles.icon}>📜</div>
          <div className={styles.actionInfo}>
            <h3>Ride History</h3>
            <p>View your ride history</p>
          </div>
          <div className={styles.arrow}>➜</div>
        </Link>
      </section>
    </>
  );
};

export default DashboardPage;
