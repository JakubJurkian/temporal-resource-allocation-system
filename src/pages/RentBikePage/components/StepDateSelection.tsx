import { useState, useMemo } from "react";
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

  const today = new Date().toISOString().split("T")[0];

  // Calculate dynamic limits for the END DATE input
  // It only exists if a Start Date is selected
  const maxEndDate = useMemo(() => {
    if (!dates.start) return undefined;

    const startDate = new Date(dates.start);
    // Add 21 days to the selected Start Date
    startDate.setDate(startDate.getDate() + 21);

    return startDate.toISOString().split("T")[0];
  }, [dates.start]);

  const handleDateChange = (field: "start" | "end", value: string) => {
    if (error) setError("");
    setDates({ ...dates, [field]: value });
  };

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
      <p className={styles.subtitle}>Select your rental dates (3-21 days).</p>

      <form onSubmit={(e) => onSubmit(e, setError)} className={styles.dateForm}>
        <div className={styles.inputGroup}>
          <label>Start Date</label>
          <input
            type="date"
            value={dates.start}
            onChange={(e) => handleDateChange("start", e.target.value)}
            min={today}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>End Date</label>
          <input
            type="date"
            value={dates.end}
            onChange={(e) => handleDateChange("end", e.target.value)}
            min={dates.start || today}
            max={maxEndDate}
            disabled={!dates.start}
            className={styles.input}
            required
          />
          {dates.start && (
            <span
              style={{
                fontSize: "0.8rem",
                color: "#888",
                marginTop: "4px",
                display: "block",
              }}
            >
              Max return date: {maxEndDate}
            </span>
          )}
        </div>

        {error && <div className={styles.errorBox}>⚠️ {error}</div>}

        <button type="submit" className={styles.primaryBtn}>
          Find Bikes ➜
        </button>
      </form>
    </div>
  );
}
