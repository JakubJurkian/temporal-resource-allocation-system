import { Link } from "react-router-dom";
import styles from "./LandingPage.module.scss";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { LandingPageLayout } from "../../components/LandingLayout/LandingPageLayout";
import LandingBtn from "../../components/LandingBtn/LandingBtn";

const LandingPage = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  console.log(isAuthenticated);

  const logoutHandle = () => {
    dispatch(logout());
  };

  const navLinks = (
    <div className={styles.navLinks}>
      <Link to="/about">About</Link>
      <Link to="/pricing">Pricing</Link>
      {!isAuthenticated && (
        <Link to="/login" className={styles.loginBtn}>
          Login
        </Link>
      )}
      {isAuthenticated && (
        <div className={styles.loginBtn} onClick={logoutHandle}>
          Logout
        </div>
      )}
    </div>
  );

  return (
    <LandingPageLayout showBackBtn={false} headerActions={navLinks}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            OWN THE <span className={styles.gradientText}>NIGHT</span>. <br />
            OWN YOUR <span className={styles.gradientText}>SHIFT</span>.
          </h1>
          <p className={styles.heroSubtitle}>
            The premium e-bike fleet for professional couriers.
            <br />
            Unlimited battery swaps. Zero maintenance. 100% Profit.
          </p>

          <div className={styles.ctaGroup}>
            <LandingBtn primary />
            <LandingBtn primary={false} to="/fleet">
              View Fleet
            </LandingBtn>
          </div>
        </div>
      </section>

      <section className={styles.statsBar}>
        <div className={styles.statItem}>
          <h3>100 km</h3>
          <p>Max Range / Charge</p>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.statItem}>
          <h3>45 km/h</h3>
          <p>Max Speed</p>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.statItem}>
          <h3>$0</h3>
          <p>Maintenance Cost</p>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>
          Built for <span className={styles.highlight}>Delivery</span>
        </h2>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.icon}>🔋</div>
            <h3>Infinite Range</h3>
            <p>Swap batteries at any VeloCity Hub in under 30 seconds.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>🛡️</div>
            <h3>Full Insurance</h3>
            <p>Accidents happen. We cover repairs so you keep earning.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>📱</div>
            <h3>Smart App</h3>
            <p>Book shifts & and unlock bikes via phone.</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2025 VeloCity Systems. Ride Safe.</p>
      </footer>
    </LandingPageLayout>
  );
};

export default LandingPage;
