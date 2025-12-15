import { Link } from "react-router-dom";
import styles from "./RegisterPage.module.scss";

const RegisterPage = () => {
  

  return (
    <main className={styles.registerContainer}>
      <div className={styles.glowOrb} aria-hidden="true"></div>

      <section className={styles.registerCard} aria-labelledby="register-title">
        <header className={styles.header}>
          <div className={styles.logo}>
            Velo<span className={styles.highlight}>City</span>
          </div>
          <h1 id="register-title" className={styles.title}>
            Join the Fleet
          </h1>
          <p className={styles.subtitle}>
            Create your courier account and start earning today.
          </p>
        </header>

        <form className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Sam Bridges"
                autoComplete="name"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+48 000 000 000"
                autoComplete="tel"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@velocity.com"
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div className={styles.termsGroup}>
            <label className={styles.checkboxContainer}>
              <input type="checkbox" required name="terms" />
              <span className={styles.checkmark}></span>
              <span className={styles.termsText}>
                I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>.
              </span>
            </label>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Create Account ➜
          </button>
        </form>

        <footer className={styles.cardFooter}>
          <p>
            Already have an account? <Link to="/login">Log in here</Link>
          </p>
        </footer>
      </section>
    </main>
  );
};

export default RegisterPage;
