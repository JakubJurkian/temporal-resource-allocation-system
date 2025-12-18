import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.scss";
import { useState } from "react";
import { addUserToStorage } from "../../utils/userStorage";
import { useAppDispatch} from "../../store/hooks";
import { loginSuccess } from "../../store/slices/authSlice";

interface RegisterFormData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeOnTerms: boolean | string;
  city: 'Warsaw' | 'Gdansk' | 'Poznan' | 'Wroclaw';
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeOnTerms: false,
    city: "Warsaw", // Add city with default value
  });

  const cities = ["Warsaw", "Gdansk", "Poznan", "Wroclaw"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<RegisterFormData> = {};

    // Validate Full Name
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters.";
    }

    // Validate Phone (Simple Regex: Optional +, then 9-15 digits)
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    if (
      !formData.phone ||
      !phoneRegex.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Validate Password
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Validate Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Validate Terms
    if (!formData.agreeOnTerms) {
      newErrors.agreeOnTerms = "You must agree to the terms and conditions.";
    }

    // Check for errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log(newErrors);
      return;
    }

    console.log("Submitting valid form:", formData);
    // saving data to localstorage...
    const userData = {
      id: Math.random().toString(36).substring(2, 10), // simple random id
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      role: "user" as const,
      city: formData.city,
    };

    addUserToStorage(userData); // adding user to local storage (faking backend)
    dispatch(loginSuccess(userData));

    alert("Registration successful! You can now log in.");

    setErrors({});
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeOnTerms: false,
      city: "Warsaw", // Reset city to default value
    });

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

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, city: e.target.value as 'Warsaw' | 'Gdansk' | 'Poznan' | 'Wroclaw' });
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
