import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUser, logout } from "../../store/slices/authSlice";
import styles from "./ProfilePage.module.scss";
import Footer from "../../components/Footer/Footer";

const cities = ["Warsaw", "Gdansk", "Poznan", "Wroclaw"];

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  // Local state for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    city: user?.city || "Warsaw",
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      // Dispatch update to Redux & LocalStorage
      dispatch(updateUser({ ...formData }));
      setIsEditing(false);
      alert("Profile updated successfully!");
    }
  };

  const handleCancel = () => {
    // Reset form to original Redux state
    setFormData({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      city: user?.city || "Warsaw",
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      {/* Background Decor */}
      <div className={styles.glowOrbRight} aria-hidden="true"></div>
      <div className={styles.glowOrbLeft} aria-hidden="true"></div>

      {/* --- TOP BAR (Consistent with Dashboard) --- */}
      <header className={styles.topBar}>
        <div className={styles.logo}>
          Velo<span className={styles.highlight}>City</span>
        </div>
        <div className={styles.navActions}>
          <Link to="/dashboard" className={styles.backLink}>
            ← Back to Dashboard
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Log Out
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className={styles.content}>
        <div className={styles.profileCard}>
          
          {/* LEFT COLUMN: Avatar & Role */}
          <aside className={styles.profileHeader}>
            <div className={styles.avatarLarge}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <h1 className={styles.userName}>{user.fullName}</h1>
            <span className={styles.roleBadge}>{user.role.toUpperCase()}</span>
            <p className={styles.userId}>ID: {user.id}</p>
            <p className={styles.valueDisplay}>City: {user.city}</p>
          </aside>

          {/* RIGHT COLUMN: Details Form */}
          <section className={styles.profileDetails}>
            <div className={styles.sectionHeader}>
              <h2>Account Details</h2>
              {!isEditing && (
                <button 
                  className={styles.editBtn} 
                  onClick={() => setIsEditing(true)}
                >
                  Edit Details
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
              {/* Full Name */}
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                ) : (
                  <div className={styles.valueDisplay}>{user.fullName}</div>
                )}
              </div>

              {/* Phone */}
              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                ) : (
                  <div className={styles.valueDisplay}>{user.phone}</div>
                )}
              </div>

              {/* City */}
              <div className={styles.inputGroup}>
                <label>City</label>
                {isEditing ? (
                  <div className={styles.selectControl}>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                    >
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className={styles.valueDisplay}>{user.city}</div>
                )}
              </div>

              {/* Email (Always Read-Only) */}
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <div className={`${styles.valueDisplay} ${styles.readOnly}`}>
                  {user.email} 
                  <span className={styles.lockIcon}>🔒</span>
                </div>
              </div>

              {/* Action Buttons (Only visible in Edit Mode) */}
              {isEditing && (
                <div className={styles.actionButtons}>
                  <button 
                    type="button" 
                    onClick={handleCancel} 
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveBtn}>
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;