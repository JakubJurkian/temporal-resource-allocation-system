import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.scss";
import { useState } from "react";
import { addUserToStorage, getUsersFromStorage } from "../../utils/userStorage";
import { useAppDispatch } from "../../store/hooks";
import { loginSuccess } from "../../store/slices/authSlice";

interface RegisterFormData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeOnTerms: boolean;
  city: "Warsaw" | "Gdansk" | "Poznan" | "Wroclaw";
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeOnTerms?: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 1. Add Loading State
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeOnTerms: false,
    city: "Warsaw",
  });

  const cities = ["Warsaw", "Gdansk", "Poznan", "Wroclaw"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};

    // --- VALIDATION STEPS ---
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters.";
    }

    const phoneRegex = /^\+?[0-9]{9,15}$/;
    if (
      !formData.phone ||
      !phoneRegex.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.agreeOnTerms) {
      newErrors.agreeOnTerms = "You must agree to the terms and conditions."; // Note: Use string for error message
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Start Loading & Fake API Delay
    setIsLoading(true);
    setErrors({}); // Clear previous errors

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // CRITICAL: Check if Email already exists
    const existingUsers = getUsersFromStorage();
    const emailExists = existingUsers.some((u) => u.email === formData.email);

    if (emailExists) {
      setErrors({ email: "This email is already registered." });
      setIsLoading(false);
      return;
    }

    // Create User Data
    const userData = {
      id: Math.random().toString(36).substring(2, 10),
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      role: "client" as const,
      city: formData.city,
      status: "active" as const,
      joinedDate: new Date().toLocaleDateString("en-CA"),
    };

    // Save & Login
    addUserToStorage(userData);
    dispatch(loginSuccess(userData));

    // Redirect immediately (No alert needed, smoother UX)
    navigate("/dashboard", { replace: true });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      city: e.target.value as RegisterFormData["city"],
    }));
  };

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

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Name & Phone Grid */}
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
                onChange={handleInputChange}
              />
              {errors.fullName && (
                <span className={styles.errorText}>{errors.fullName}</span>
              )}
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
                onChange={handleInputChange}
              />
              {errors.phone && (
                <span className={styles.errorText}>{errors.phone}</span>
              )}
            </div>
          </div>

          {/* Email */}
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

          {/* Passwords Grid */}
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
                onChange={handleInputChange}
              />
              {errors.password && (
                <span className={styles.errorText}>{errors.password}</span>
              )}
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
                onChange={handleInputChange}
              />
              {errors.confirmPassword && (
                <span className={styles.errorText}>
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>

          {/* City Selection */}
          <div className={styles.inputGroup}>
            <label htmlFor="city">City</label>
            <div className={styles.selectControl}>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleCityChange}
                required
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className={styles.termsGroup}>
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                required
                name="agreeOnTerms"
                checked={formData.agreeOnTerms}
                onChange={handleInputChange}
              />
              <span className={styles.checkmark}></span>
              <span className={styles.termsText}>
                I agree to the <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </span>
            </label>
            {errors.agreeOnTerms && (
              <span className={styles.errorText}>
                {String(errors.agreeOnTerms)}
              </span>
            )}
          </div>

          {/* Submit Button with Spinner */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              "Create Account ➜"
            )}
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
