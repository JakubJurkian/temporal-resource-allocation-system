import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.scss";
import { useState } from "react";

interface RegisterFormData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeOnTerms: boolean | string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeOnTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<RegisterFormData> = {};

    // 1. Validate Full Name
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters.";
    }

    // 2. Validate Phone (Simple Regex: Optional +, then 9-15 digits)
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    if (
      !formData.phone ||
      !phoneRegex.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    // 3. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // 4. Validate Password
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // 5. Validate Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // 6. Validate Terms
    if (!formData.agreeOnTerms) {
      newErrors.agreeOnTerms = "You must agree to the terms and conditions.";
    }

    // --- CHECK FOR ERRORS ---
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log(newErrors);
      return;
    }

    console.log("Submitting valid form:", formData);
    // saving data to localstorage...
    const userData = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
    };

    const userId = Math.random().toString(36).substring(2, 10); // simple random id

    localStorage.setItem(userId, JSON.stringify(userData));
    alert("Registration successful! You can now log in.");

    setErrors({});
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeOnTerms: false,
    });

    navigate("/");
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

          <div className={styles.termsGroup}>
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                required
                name="agreeOnTerms"
                onChange={handleInputChange}
              />
              <span className={styles.checkmark}></span>
              <span className={styles.termsText}>
                I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>.
              </span>
            </label>
            {errors.agreeOnTerms && (
              <span className={styles.errorText}>{errors.agreeOnTerms}</span>
            )}
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
