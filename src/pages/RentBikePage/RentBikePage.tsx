import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { getModels } from "../../utils/fleetStorage";
import { processPayment } from "../../utils/paymentHelper";
import { isBikeAvailable } from "../../utils/bookingHelper";
import type { BikeInstance, BikeModel } from "../../types/Fleet";
import styles from "./RentBikePage.module.scss";
import StepDateSelection from "./components/StepDateSelection";
import StepLoading from "./components/StepLoading";
import StepBikeSelection from "./components/StepBikeSelection";

const MODELS = getModels();

const RentBikePage = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const userCity = user!.city;
  // Wizard State (Starts at Step 1: Dates)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [dates, setDates] = useState({ start: "", end: "" });
  const [availableBikes, setAvailableBikes] = useState<BikeModel[]>([]);
  const [bikes] = useState<BikeInstance[]>(() => {
    const stored = localStorage.getItem("velocity_fleet");
    return stored ? JSON.parse(stored) : [];
  });
  const [chosenBike, setChosenBike] = useState<BikeInstance | null>(null);
  const [chosenBikeModel, setChosenBikeModel] = useState<BikeModel | null>(
    null
  );
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");

  // const [book, setBook] = useState({
  //   userId: null,
  //   bikeId: null,
  //   startDate: null,
  //   endDate: null,
  //   payment: null,
  // });

  // Step 1 - dates
  const handleBikeSearch = (
    e: React.FormEvent,
    setError: (msg: string) => void
  ) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!dates.start || !dates.end) {
      setError("Please select both dates.");
      return;
    }

    const start = new Date(dates.start);
    const end = new Date(dates.end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 3) {
      setError("Minimum rental period is 3 days.");
      return;
    }

    if (end < start) {
      setError("End date cannot be before start date.");
      return;
    }

    // Move to loading
    setStep(2);
  };

  // Step 2 - simulate API call
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

  const handleProceedToPayment = () => {
    setPaymentStatus("idle"); // Reset payment state
    setStep(5);
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

  const handleFinalPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosenBikeModel) return;

    setPaymentStatus("processing"); // 1. STATE: WAITING

    try {
      // ASYNC SIMULATION (The Requirement)
      await processPayment();

      // STATE: SUCCESS
      setPaymentStatus("success");

      // UPDATE RESERVATION STATUS (The Requirement)
      // const totalCost = getDynamicPrice(getRentalDays()).total;
      // addReservation({
      //   userId: user?.id,
      //   bikeId: chosenBike?.id,
      //   model: chosenBikeModel.name,
      //   city: userCity,
      //   startDate: dates.start,
      //   endDate: dates.end,
      //   totalCost: totalCost,
      //   status: "confirmed",
      // });

      // Redirect
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.log(error);
      // 5. STATE: REJECTION
      setPaymentStatus("error");
    }
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
          <StepDateSelection
            dates={dates}
            setDates={setDates}
            city={userCity}
            onSubmit={handleBikeSearch}
          />
        )}

        {/* --- STEP 2: LOADING --- */}
        {step === 2 && <StepLoading city={userCity} />}

        {/* --- STEP 3: RESULTS --- */}
        {step === 3 && (
          <StepBikeSelection
            availableBikes={availableBikes}
            setStep={setStep}
            onClick={handleBook}
            city={userCity}
          />
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

            <button
              className={styles.confirmBtn}
              onClick={handleProceedToPayment}
            >
              Confirm & Pay 💳
            </button>
          </div>
        )}
        {step === 5 && chosenBikeModel && (
          <div className={styles.stepContainer}>
            <button
              onClick={() => setStep(4)}
              className={styles.backBtn}
              disabled={
                paymentStatus === "processing" || paymentStatus === "success"
              }
            >
              ← Back to Summary
            </button>

            <h1>Secure Checkout</h1>
            <p className={styles.subtitle}>
              Enter your card details to finalize.
            </p>

            <form onSubmit={handleFinalPayment} className={styles.paymentForm}>
              {/* CARD UI */}
              <div className={styles.cardContainer}>
                <div className={styles.inputGroup}>
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    disabled={paymentStatus === "processing"}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    required
                    disabled={paymentStatus === "processing"}
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                      disabled={paymentStatus === "processing"}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={3}
                      required
                      disabled={paymentStatus === "processing"}
                    />
                  </div>
                </div>
              </div>

              {/* STATUS MESSAGES */}
              {paymentStatus === "error" && (
                <div className={styles.errorBanner}>
                  ⚠️ Transaction declined. Bank rejected the operation.
                </div>
              )}

              {paymentStatus === "success" && (
                <div className={styles.successBanner}>
                  ✅ Payment Successful! Redirecting...
                </div>
              )}

              {/* PAY BUTTON */}
              <button
                type="submit"
                className={styles.payBtn}
                disabled={
                  paymentStatus === "processing" || paymentStatus === "success"
                }
              >
                {paymentStatus === "processing" ? (
                  <span className={styles.miniSpinner}></span>
                ) : (
                  `Pay ${getDynamicPrice(getRentalDays()).total} PLN`
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default RentBikePage;
