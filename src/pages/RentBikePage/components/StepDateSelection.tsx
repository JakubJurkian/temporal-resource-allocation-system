import { useState } from "react";
import styles from "../RentBikePage.module.scss";

interface Props {
  dates: { start: string; end: string };
  setDates: (d: { start: string; end: string }) => void;
  onSubmit: (e: React.FormEvent, setError: (msg: string) => void) => void;
  city: string;
}

export default function StepDateSelection({
  dates,
  setDates,
  onSubmit,
  city,
}: Props) {
  const [error, setError] = useState("");

  return (
    <div className={styles.stepContainer}>
      <div className={styles.locationBanner}>
        <span className={styles.pinIcon}>📍</span>
        <div className={styles.bannerText}>
          <span className={styles.label}>Browsing fleet in</span>
          <span className={styles.city}>{city}</span>
        </div>
      </div>

      <h1>When do you need it?</h1>
      <p className={styles.subtitle}>Select your rental dates (min. 3 days).</p>

      <form onSubmit={(e) => onSubmit(e, setError)} className={styles.dateForm}>
        <div className={styles.inputGroup}>
          <label>Start Date</label>
          <input
            type="date"
            value={dates.start}
            onChange={(e) => setDates({ ...dates, start: e.target.value })}
            min={new Date().toISOString().split("T")[0]}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>End Date</label>
          <input
            type="date"
            value={dates.end}
            onChange={(e) => setDates({ ...dates, end: e.target.value })}
            className={styles.input}
          />
        </div>

        {error && <div className={styles.errorBox}>⚠️ {error}</div>}

        <button type="submit" className={styles.primaryBtn}>
          Find Bikes ➜
        </button>
      </form>
    </div>
  );
}
