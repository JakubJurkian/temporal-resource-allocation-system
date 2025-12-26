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
    console.log(chosenBike);
    setChosenBikeModel(y);
    setStep(4);
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
      setTimeout(() => navigate("/dashboard"), 2000);
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
