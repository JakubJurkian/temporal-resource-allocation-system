import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";
import { useEffect, useState } from "react";
import { getUsersFromStorage } from "../../utils/storage";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginSuccess } from "../../store/slices/authSlice";

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
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      // Optional: Redirect based on role
      const destination = user?.role === "admin" ? "/admin" : "/dashboard";
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<LoginFormData> = {};

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Validate password
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    const users = getUsersFromStorage();
    const userExists = users.find(
      (user) =>
        user.email === formData.email && user.password === formData.password
    );
    if (!userExists) {
      newErrors.password = "Invalid email or password.";
    }

    // Check for errors
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
    dispatch(loginSuccess(userExists!));
    navigate("/dashboard", { replace: true });
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
