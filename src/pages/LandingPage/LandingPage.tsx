import styles from "./LandingPage.module.scss";
import LandingBtn from "../../components/LandingBtn/LandingBtn";

const stats = [
  { value: "100 km", label: "Max Range / Charge" },
  { value: "45 km/h", label: "Max Speed" },
  { value: "$0", label: "Maintenance Cost" },
];

const features = [
  {
    icon: "🔋",
    title: "Infinite Range",
    description: "Swap batteries at any VeloCity Hub in under 30 seconds.",
  },
  {
    icon: "🛡️",
    title: "Full Insurance",
    description: "Accidents happen. We cover repairs so you keep earning.",
  },
  {
    icon: "📱",
    title: "Smart App",
    description: "Book shifts & and unlock bikes via phone.",
  },
];

const LandingPage = () => {
  return (
    <>
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
        {stats.map((stat, index) => (
          <>
            {index > 0 && <div className={styles.divider}></div>}
            <div key={stat.label} className={styles.statItem}>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </>
        ))}
      </section>

      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>
          Built for <span className={styles.highlight}>Delivery</span>
        </h2>

        <div className={styles.grid}>
          {features.map((feature) => (
            <div key={feature.title} className={styles.card}>
              <div className={styles.icon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default LandingPage;
