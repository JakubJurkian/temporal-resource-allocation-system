import { Link } from "react-router-dom";
import styles from "./LoginPage.module.scss";

const LoginPage = () => {
  return (
    <main className={styles.loginContainer}>
      <div className={styles.glowOrb} aria-hidden="true"></div>

      <section className={styles.loginCard} aria-labelledby="login-title">
        <header className={styles.header}>
          <div className={styles.logo}>
            Velo<span className={styles.highlight}>City</span>
          </div>
          <h1 id="login-title" className={styles.title}>
            Welcome Back
          </h1>
          <p className={styles.subtitle}>
            Enter your credentials to access the fleet.
          </p>
        </header>

        <form className={styles.form}>
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

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <div className={styles.formFooter}>
            <label className={styles.checkboxContainer}>
              <input type="checkbox" name="remember" />
              <span className={styles.checkmark}></span>
              Remember me
            </label>
            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Log In ➜
          </button>
        </form>

        <footer className={styles.cardFooter}>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </footer>
      </section>
    </main>
  );
};

export default LoginPage;
