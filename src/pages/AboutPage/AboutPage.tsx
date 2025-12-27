import styles from "./AboutPage.module.scss";

const AboutPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.glowOrb} aria-hidden="true"></div>
        <h1>
          Moving Cities <br />
          <span className={styles.gradientText}>Forward.</span>
        </h1>
        <p className={styles.lead}>
          We are VeloCity. We believe the future of urban transport is silent,
          clean, and incredibly fast. Our mission is to replace 100,000 car
          trips with e-bike rides by 2026.
        </p>
      </section>

      {/* Stats Grid */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>2.5M</span>
          <span className={styles.statLabel}>Kilometers Ridden</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>140t</span>
          <span className={styles.statLabel}>CO₂ Saved</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>4</span>
          <span className={styles.statLabel}>Cities Active</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>24/7</span>
          <span className={styles.statLabel}>Support Team</span>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <h2>Our Core Values</h2>
        <div className={styles.valueRow}>
          <div className={styles.valueItem}>
            <h3>🌱 Sustainability First</h3>
            <p>
              Every bike is charged using 100% renewable energy sources. We
              recycle 95% of our battery components.
            </p>
          </div>
          <div className={styles.valueItem}>
            <h3>🚀 Radical Speed</h3>
            <p>
              No traffic jams. No parking hunting. Our fleet is optimized for
              the quickest point-A to point-B travel.
            </p>
          </div>
          <div className={styles.valueItem}>
            <h3>🛡️ Safety by Design</h3>
            <p>
              GPS tracking, automatic collision detection, and regular
              maintenance checks ensure you ride safe.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
