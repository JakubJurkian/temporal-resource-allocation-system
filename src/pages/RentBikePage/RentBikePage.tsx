import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import styles from "./RentBikePage.module.scss";
import { isBikeAvailable } from "../../utils/bookingHelper";
import type { BikeInstance, BikeModel } from "../../types/Fleet";
import { getModels } from "../../utils/fleetStorage";

const MODELS = getModels();

const RentBikePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const userCity = user!.city;

  // Wizard State (Starts at Step 1: Dates)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Date State
  const [dates, setDates] = useState({ start: "", end: "" });
  const [dateError, setDateError] = useState("");
  const [availableBikes, setAvailableBikes] = useState<BikeModel[]>([]);
  const [bikes] = useState<BikeInstance[]>(() => {
    const stored = localStorage.getItem("velocity_fleet");
    return stored ? JSON.parse(stored) : [];
  });

  // --- STEP 1 -> 2: SEARCH ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDateError("");

    // Validate inputs
    if (!dates.start || !dates.end) {
      setDateError("Please select both dates.");
      return;
    }

    const start = new Date(dates.start);
    const end = new Date(dates.end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 3) {
      setDateError("Minimum rental period is 3 days.");
      return;
    }

    if (end < start) {
      setDateError("End date cannot be before start date.");
      return;
    }

    // Move to loading
    setStep(2);
  };

  // --- STEP 2: SIMULATE API CALL ---
  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        // FILTERING ALGORITHM
        const cityBikes = bikes.filter(
          (b: BikeInstance) => b.city === userCity
        );
        const freeBikes = cityBikes.filter((bike: BikeInstance) =>
          isBikeAvailable(bike.id, dates.start, dates.end)
        );

        const catalogFreeBikes = MODELS.map((b: BikeModel) => {
          // if some bike in freeBikes has modelId prop equal to b.id
          const res = freeBikes.filter((freeB: BikeInstance) => {
            if (freeB.modelId === b.id) return true;
          });
          if (res.length > 0) return b;
        }).filter(Boolean) as BikeModel[];
        setAvailableBikes(catalogFreeBikes);

        // setLoading(false);
        setStep(3); // Show results
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, [step, userCity, dates, bikes]);

  const [chosenBike, setChosenBike] = useState<BikeInstance | null>(null);
  const [chosenBikeModel, setChosenBikeModel] = useState<BikeModel | null>(
    null
  );
  const handleBook = (modelId: string) => {
    const x = bikes.find((b: BikeInstance) => {
      if (b.modelId === modelId) return true;
    })!;
    const y = MODELS.find((b: BikeModel) => {
      if (b.id === modelId) return true;
    })!;
    setChosenBike(x);
    setChosenBikeModel(y);
    setStep(4);
  };

  const handleConfirmPay = () => {
    return;
  };

  const getRentalDays = () => {
    if (!dates.start || !dates.end) return 0;

    const start = new Date(dates.start);
    const end = new Date(dates.end);

    // Calculate difference in milliseconds
    const diffTime = Math.abs(end.getTime() - start.getTime());

    // Convert to days and add 1 (to make it inclusive)
    // Example: Mon to Mon = 8 days, not 7
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getDynamicPrice = (days: number) => {
    const BASE_RATE = 25; // Standard price per day in PLN
    let discount = 0;

    // Apply discounts based on duration
    if (days > 7 && days <= 14) {
      discount = 0.2; // 20% off
    } else if (days > 14 && days <= 21) {
      discount = 0.4; // 40% off
    }

    // Calculate final daily rate
    const dailyRate = Math.round(BASE_RATE * (1 - discount));

    return {
      dailyRate: dailyRate,
      total: dailyRate * days,

      // UI Helpers: Only show "Old Rate" if a discount was applied
      oldRate: discount > 0 ? BASE_RATE : null,
      discountLabel: discount > 0 ? `-${discount * 100}%` : null,
    };
  };

  return (
    <div className={styles.container}>
      <header className={styles.topBar}>
        <div className={styles.logo}>
          Velo<span className={styles.highlight}>City</span>
        </div>
        <Link to="/dashboard" className={styles.closeBtn}>
          ✕
        </Link>
      </header>

      <main className={styles.wizardContent}>
        {/* --- STEP 1: DATE SELECTION --- */}
        {step === 1 && (
          <div className={styles.stepContainer}>
            {/* Context Banner */}
            <div className={styles.locationBanner}>
              <span className={styles.pinIcon}>📍</span>
              <div className={styles.bannerText}>
                <span className={styles.label}>Browsing fleet in</span>
                <span className={styles.city}>{userCity}</span>
              </div>
            </div>

            <h1>When do you need it?</h1>
            <p className={styles.subtitle}>
              Select your rental dates (min. 3 days).
            </p>

            <form onSubmit={handleSearch} className={styles.dateForm}>
              <div className={styles.inputGroup}>
                <label>Start Date</label>
                <input
                  type="date"
                  value={dates.start}
                  onChange={(e) =>
                    setDates({ ...dates, start: e.target.value })
                  }
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

              {dateError && (
                <div className={styles.errorBox}>⚠️ {dateError}</div>
              )}

              <button type="submit" className={styles.primaryBtn}>
                Find Bikes ➜
              </button>
            </form>
          </div>
        )}

        {/* --- STEP 2: LOADING --- */}
        {step === 2 && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Checking availability in {userCity}...</p>
          </div>
        )}

        {/* --- STEP 3: RESULTS --- */}
        {step === 3 && (
          <div className={styles.stepContainer}>
            <button onClick={() => setStep(1)} className={styles.backBtn}>
              ← Change Dates
            </button>

            <h1>Available Bikes</h1>
            <p className={styles.subtitle}>
              Found {availableBikes.length} bike
              {availableBikes.length === 1 ? "" : "s"} for your dates.
            </p>

            <div className={styles.bikeList}>
              {availableBikes.length === 0 ? (
                <div className={styles.noResults}>
                  <p>😔 No bikes available in {userCity} for these dates.</p>
                  <button
                    onClick={() => setStep(1)}
                    className={styles.retryBtn}
                  >
                    Try different dates
                  </button>
                </div>
              ) : (
                availableBikes.map((bike: BikeModel) => (
                  <div key={bike.id} className={styles.bikeCard}>
                    <div className={styles.bikeInfo}>
                      <h3>
                        {bike.name}
                        <span style={{ marginLeft: "8px", fontSize: "1.2em" }}>
                          {bike.imageEmoji}
                        </span>
                      </h3>

                      <div className={styles.specs}>
                        <span className={styles.spec} title="Category">
                          🏷️ {bike.category}
                        </span>
                        <span className={styles.spec} title="Max Speed">
                          ⚡ {bike.stats.speed} km/h
                        </span>
                        <span className={styles.spec} title="Range">
                          🛣️ {bike.stats.range} km
                        </span>
                        <span className={styles.spec} title="Cargo Capacity">
                          📦 {bike.stats.capacity} kg
                        </span>
                      </div>
                    </div>

                    <button
                      className={styles.bookBtn}
                      onClick={() => handleBook(bike.id)}
                    >
                      Book
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {/* --- STEP 4: SUMMARY & CONFIRM --- */}
        {step === 4 && chosenBikeModel && (
          <div className={styles.stepContainer}>
            <button onClick={() => setStep(3)} className={styles.backBtn}>
              ← Back to Bikes
            </button>

            <h1>Confirm Booking</h1>
            <p className={styles.subtitle}>
              Please review your reservation details.
            </p>

            <div className={styles.summaryCard}>
              {/* Bike Details */}
              <div className={styles.summaryRow}>
                <span className={styles.label}>Bike Model</span>
                <span className={styles.value}>
                  {chosenBikeModel.name}{" "}
                  <span style={{ fontSize: "1.2em" }}>
                    {chosenBikeModel.imageEmoji}
                  </span>
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.label}>Category</span>
                <span className={styles.value}>{chosenBikeModel.category}</span>
              </div>

              <div className={styles.divider}></div>

              {/* Rental Dates */}
              <div className={styles.summaryRow}>
                <span className={styles.label}>Dates</span>
                <span className={styles.value}>
                  {dates.start} — {dates.end}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.label}>Duration</span>
                <span className={styles.value}>{getRentalDays()} days</span>
              </div>

              <div className={styles.divider}></div>

              {/* --- DETAILED PRICING BREAKDOWN --- */}
              {/* 1. Daily Rate Row with Discount Logic */}
              <div
                className={styles.summaryRow}
                style={{ alignItems: "center" }}
              >
                <span className={styles.label}>Daily Rate</span>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {/* Show Old Rate if discount exists */}
                  {getDynamicPrice(getRentalDays()).oldRate && (
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#6b7280",
                        fontSize: "0.9rem",
                      }}
                    >
                      {getDynamicPrice(getRentalDays()).oldRate} PLN
                    </span>
                  )}

                  {/* Final Daily Rate */}
                  <span className={styles.value}>
                    {getDynamicPrice(getRentalDays()).dailyRate} PLN
                  </span>

                  {/* Discount Badge */}
                  {getDynamicPrice(getRentalDays()).discountLabel && (
                    <span
                      style={{
                        backgroundColor: "#7c3aed", // Purple/Secondary
                        color: "white",
                        fontSize: "0.75rem",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                      }}
                    >
                      {getDynamicPrice(getRentalDays()).discountLabel}
                    </span>
                  )}
                </div>
              </div>

              {/* 2. Total Calculation Row */}
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span className={styles.label}>Total Price</span>
                <span className={styles.totalValue}>
                  {getDynamicPrice(getRentalDays()).total} PLN
                </span>
              </div>
            </div>

            <button className={styles.confirmBtn} onClick={handleConfirmPay}>
              Confirm & Pay 💳
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default RentBikePage;
