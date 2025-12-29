import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { getModels } from "../../utils/fleetStorage";
import { processPayment } from "../../utils/paymentHelper";
import {
  addReservation,
  generateReservationId,
  isBikeAvailable,
} from "../../utils/bookingHelper";
import { getDynamicPrice, getRentalDays } from "../../utils/rentalCalculations";
import type { BikeInstance, BikeModel } from "../../types/Fleet";
import StepDateSelection from "./components/StepDateSelection";
import StepLoading from "./components/StepLoading";
import StepBikeSelection from "./components/StepBikeSelection";
import StepSummary from "./components/StepSummary";
import StepPayment from "./components/StepPayment";
import styles from "./RentBikePage.module.scss";
import type { Reservation } from "../../types/Reservation";

const MODELS = getModels();

// Timezone-safe, inclusive day diff for YYYY-MM-DD (e.g., 29→31 = 3 days)
const getInclusiveDays = (start: string, end: string) => {
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const startUTC = Date.UTC(sy, sm - 1, sd);
  const endUTC = Date.UTC(ey, em - 1, ed);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((endUTC - startUTC) / msPerDay) + 1;
};

const RentBikePage = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const userCity = user!.city;
  // Wizard State (Starts at Step 1: Dates)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [dates, setDates] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
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

    // Compare strings (YYYY-MM-DD) safely
    if (dates.end < dates.start) {
      setError("End date cannot be before start date.");
      return;
    }

    // Inclusive, timezone-safe day count
    const diffDays = getInclusiveDays(dates.start, dates.end);

    if (diffDays < 3) {
      setError("Minimum rental period is 3 days.");
      return;
    }

    if (diffDays > 21) {
      setError("Maximum rental period is 21 days.");
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
    // Get raw reservations
    const storedData = localStorage.getItem("velocity_reservations");
    const allReservations = storedData ? JSON.parse(storedData) : [];

    // Define User's requested timeframe (timestamps for easy comparison)
    const userStart = new Date(dates.start).getTime();
    const userEnd = new Date(dates.end).getTime();

    // Filter: Find ONLY reservations that conflict with these dates
    const conflictingReservations = allReservations.filter(
      (res: Reservation) => {
        // Safety check: Ignore cancelled bookings
        if (res.status === "cancelled") return false;

        const resStart = new Date(res.startDate).getTime();
        const resEnd = new Date(res.endDate).getTime();

        // THE OVERLAP FORMULA:
        // A booking overlaps if it starts before your request ends...
        // ...AND ends after your request starts.
        return userStart <= resEnd && userEnd >= resStart;
      }
    );

    // 4. Create a Set of IDs that are effectively "Blocked" for this user
    const blockedBikeIds = new Set(
      conflictingReservations.map((res: Reservation) => res.bikeId)
    );

    // Find the first physical instance that matches the model AND is not blocked
    const availableInstance = bikes.find(
      (bike) =>
        bike.modelId === modelId &&
        !blockedBikeIds.has(bike.id) &&
        bike.city === userCity &&
        bike.status === "active"
    );

    // Get Model Details (Metadata)
    const selectedModel = MODELS.find(
      (model: BikeModel) => model.id === modelId
    );

    // Update State
    if (availableInstance && selectedModel) {
      setChosenBike(availableInstance);
      setChosenBikeModel(selectedModel);
      setStep(4);
    } else {
      console.error(
        "Critical Error: No bike instance found, even though availability check passed earlier."
      );
    }
  };

  const handleProceedToPayment = () => {
    setPaymentStatus("idle"); // Reset payment state
    setStep(5);
  };

  const handleFinalPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosenBikeModel) return;

    setPaymentStatus("processing"); // STATE: WAITING

    try {
      // ASYNC SIMULATION (The Requirement)
      await processPayment();

      // STATE: SUCCESS
      setPaymentStatus("success");

      // UPDATE RESERVATION STATUS (The Requirement)
      const totalCost = getDynamicPrice(getRentalDays(dates)).total;
      const newReservation: Reservation = {
        id: generateReservationId(),
        userId: user!.id!,
        bikeId: chosenBike!.id,
        startDate: dates.start,
        endDate: dates.end,
        totalCost: totalCost,
        status: "confirmed",
      };
      addReservation(newReservation);
      setTimeout(() => navigate("/my-rentals"), 2000);
    } catch (error) {
      console.log(error);
      // STATE: REJECTION
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
          <StepSummary
            setStep={setStep}
            chosenBikeModel={chosenBikeModel}
            dates={dates}
            onClick={handleProceedToPayment}
          />
        )}
        {/* --- STEP 5: PAYMENT PROCESS --- */}
        {step === 5 && chosenBikeModel && (
          <StepPayment
            setStep={setStep}
            onSubmit={handleFinalPayment}
            paymentStatus={paymentStatus}
            price={getDynamicPrice(getRentalDays(dates)).total}
          />
        )}
      </main>
    </div>
  );
};

export default RentBikePage;
