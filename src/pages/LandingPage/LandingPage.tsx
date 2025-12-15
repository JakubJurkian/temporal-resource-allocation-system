import { Link } from 'react-router-dom';
import styles from "./LandingPage.module.scss";

const LandingPage = () => {
  return (
    <div className={styles.pageWrapper}>
      
      {/* navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          Velo<span className={styles.highlight}>City</span>
        </div>
        <div className={styles.navLinks}>
          <Link to="/about">About</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/login" className={styles.loginBtn}>Login</Link>
        </div>
      </nav>

      {/* hero section */}
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            OWN THE <span className={styles.gradientText}>NIGHT</span>. <br />
            OWN YOUR <span className={styles.gradientText}>SHIFT</span>.
          </h1>
          <p className={styles.heroSubtitle}>
            The premium e-bike fleet for professional couriers. 
            <br />Unlimited battery swaps. Zero maintenance. 100% Profit.
          </p>
          
          <div className={styles.ctaGroup}>
            <Link to="/wizard" className={styles.primaryCta}>
              Start Riding ⚡
            </Link>
            <Link to="/fleet" className={styles.secondaryCta}>
              View Fleet
            </Link>
          </div>
        </div>
      </header>

      {/* stats bar */}
      <section className={styles.statsBar}>
        <div className={styles.statItem}>
          <h3>120 km</h3>
          <p>Range / Charge</p>
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

      {/* features grid */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Built for <span className={styles.highlight}>Delivery</span></h2>
        
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
            <p>Track your earnings, book shifts, and unlock bikes via phone.</p>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className={styles.footer}>
        <p>© 2025 VeloCity Systems. Ride Safe.</p>
      </footer>
    </div>
  );
};

export default LandingPage;