import styles from "./PricingPage.module.scss";
import LandingBtn from "../../components/LandingBtn/LandingBtn";

const PricingPage = () => {
  return (
    <>
      <div className={styles.header}>
        <h1>Flexible Rental Plans.</h1>
        <p>The longer you ride, the less you pay per day.</p>
      </div>

      <div className={styles.pricingGrid}>
        {/* TIER 1: SHORT TERM (3-7 Days) */}
        <div className={styles.card}>
          <div className={styles.durationBadge}>3 - 7 Days</div>
          <div className={styles.tierName}>Weekender</div>

          <div className={styles.priceContainer}>
            <span className={styles.label}>Daily Rent</span>
            <div className={styles.priceRange}>
              25 <span className={styles.currency}>PLN/day</span>
            </div>
          </div>

          <div className={styles.depositInfo}>
            Security Deposit: <strong>200 PLN</strong>
          </div>

          <LandingBtn primary={false} />
        </div>

        {/* TIER 2: MEDIUM TERM (8-14 Days) */}
        <div className={`${styles.card} ${styles.popular}`}>
          <div className={styles.promoBadge}>Popular Choice</div>
          <div className={styles.durationBadge}>8 - 14 Days</div>
          <div className={styles.tierName}>Rider</div>

          <div className={styles.priceContainer}>
            <span className={styles.label}>Daily Rent</span>
            <div className={styles.priceRange}>
              20 <span className={styles.currency}>PLN/day</span>
            </div>
            <span className={styles.discountTag}>~20% OFF</span>
          </div>

          <div className={styles.depositInfo}>
            Security Deposit: <strong>200 PLN</strong>
          </div>

          <LandingBtn primary={true} />
        </div>

        {/* TIER 3: LONG TERM (15-21 Days) */}
        <div className={styles.card}>
          <div className={styles.durationBadge}>15 - 21 Days</div>
          <div className={styles.tierName}>Pro Rider</div>

          <div className={styles.priceContainer}>
            <span className={styles.label}>Daily Rent</span>
            <div className={styles.priceRange}>
              15 <span className={styles.currency}>PLN/day</span>
            </div>
            <span className={styles.discountTag}>~40% OFF</span>
          </div>

          <div className={styles.depositInfo}>
            Security Deposit: <strong>200 PLN</strong>
          </div>

          <LandingBtn primary={false} />
        </div>
      </div>

      <p className={styles.note}>
        * Security deposit is required and refunded upon bike return in good
        condition.
        <br />
        Rental periods range from 3 to 21 days.
      </p>
    </>
  );
};

export default PricingPage;
