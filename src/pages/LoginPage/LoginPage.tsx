import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";
import { useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<LoginFormData> = {};

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // 4. Validate Password
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    let isAuthenticated = false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(localStorage).forEach(([_, value]) => {
      const user = JSON.parse(value);
      if (
        user.email === formData.email &&
        user.password === formData.password
      ) {
        console.log("User authenticated successfully.");
        isAuthenticated = true;
      }
    });

    if (!isAuthenticated) {
      newErrors.email = "Invalid email or password.";
      newErrors.password = "Invalid email or password.";
    }

    // --- CHECK FOR ERRORS ---
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log(newErrors);
      return;
    }

    setErrors({});
    setFormData({
      email: "",
      password: "",
    });
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };
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

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@velocity.com"
              autoComplete="email"
              required
              onChange={handleInputChange}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
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
              onChange={handleInputChange}
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
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
