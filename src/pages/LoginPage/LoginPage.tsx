import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";
import { useState } from "react";
import { getUsersFromStorage } from "../../utils/userStorage";
import { useAppDispatch } from "../../store/hooks";
import { loginSuccess } from "../../store/slices/authSlice";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage = () => {
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  
  // Add Loading State
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<LoginFormData> = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Start Loading
    setIsLoading(true);
    setErrors({}); // Clear old errors

    // Fake Delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const users = getUsersFromStorage();
    const user = users.find((u) => u.email === formData.email);
    const isValid = user && user.password === formData.password;

    if (!isValid) {
      setErrors({ password: "Invalid email or password." });
      setFormData((prev) => ({ ...prev, password: "" }));
      // Stop Loading on Error
      setIsLoading(false);
      return;
    }

    const storage = formData.rememberMe ? localStorage : sessionStorage;
    storage.setItem("velocity_user", JSON.stringify(user));

    // remove potential conflicts
    if (formData.rememberMe) {
      sessionStorage.removeItem("velocity_user");
    } else {
      localStorage.removeItem("velocity_user");
    }

    setFormData({ email: "", password: "", rememberMe: false });
    dispatch(loginSuccess(user!));
    navigate("/dashboard", { replace: true });
    // No need to set isLoading(false) here as we navigate away
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <main className={styles.loginContainer}>
      <div className={styles.glowOrb} aria-hidden="true"></div>

      <section className={styles.loginCard} aria-labelledby="login-title">
        <header className={styles.header}>
          <div className={styles.logo}>
            Velo<span className={styles.highlight}>City</span>
          </div>
          <h1 id="login-title" className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Enter your credentials to access the fleet.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Inputs (Email/Password)  */}
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              placeholder="name@velocity.com"
              autoComplete="email"
              required
              onChange={handleInputChange}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              onChange={handleInputChange}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <div className={styles.formFooter}>
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              <span className={styles.checkmark}></span>
              Remember me
            </label>
            <a href="#" className={styles.forgotLink}>
              Forgot Password?
            </a>
          </div>

          {/* Button with Spinner Logic */}
          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Verifying...
              </>
            ) : (
              "Log In ➜"
            )}
          </button>
        </form>

        <footer className={styles.cardFooter}>
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </footer>
      </section>
    </main>
  );
};

export default LoginPage;