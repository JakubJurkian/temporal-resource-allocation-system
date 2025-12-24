import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import styles from "./RentBikePage.module.scss";
import { isBikeAvailable } from "../../utils/bookingHelper";
import type { BikeInstance, BikeModel } from "../../types/Fleet";
import { getModels } from "../../utils/fleetStorage";

const MODELS = getModels();

const RentBikePage = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const userCity = user!.city

  // Wizard State (Starts at Step 1: Dates)
  const [step, setStep] = useState<1 | 2 | 3>(1); 
  
  // Date State
  const [dates, setDates] = useState({ start: "", end: "" });
  const [dateError, setDateError] = useState("");
  const [availableBikes, setAvailableBikes] = useState<BikeModel[]>([]);
  const [bikes] = useState<BikeInstance[]>(() => {
    const stored = localStorage.getItem("velocity_fleet")
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
        const cityBikes = bikes.filter((b: BikeInstance) => b.city === userCity);
        const freeBikes = cityBikes.filter((bike: BikeInstance) => 
          isBikeAvailable(bike.id, dates.start, dates.end)
        );

        const catalogFreeBikes = MODELS.map((b: BikeModel) => {
          // if some bike in freeBikes has modelId prop equal to b.id
          const res = freeBikes.filter((freeB: BikeInstance) => {
            if(freeB.modelId === b.id) return true;
          });
          if(res.length > 0) return b;
        }).filter(Boolean) as BikeModel[];
        setAvailableBikes(catalogFreeBikes);
        
        // setLoading(false);
        setStep(3); // Show results
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, [step, userCity, dates, bikes]);

  const handleBook = (bikeId: string) => {
    alert(`Success! Bike ${bikeId} booked in ${userCity}.`);
    navigate("/dashboard");
  };

  return (
    <div className={styles.container}>
      <header className={styles.topBar}>
        <div className={styles.logo}>Velo<span className={styles.highlight}>City</span></div>
        <Link to="/dashboard" className={styles.closeBtn}>✕</Link>
      </header>

      <main className={styles.wizardContent}>
        
        {/* --- STEP 1: DATE SELECTION (Now the first step) --- */}
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
            <p className={styles.subtitle}>Select your rental dates (min. 3 days).</p>
            
            <form onSubmit={handleSearch} className={styles.dateForm}>
              <div className={styles.inputGroup}>
                <label>Start Date</label>
                <input 
                  type="date" 
                  value={dates.start}
                  onChange={e => setDates({...dates, start: e.target.value})}
                  min={new Date().toISOString().split('T')[0]} 
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>End Date</label>
                <input 
                  type="date" 
                  value={dates.end}
                  onChange={e => setDates({...dates, end: e.target.value})}
                  className={styles.input}
                />
              </div>

              {dateError && <div className={styles.errorBox}>⚠️ {dateError}</div>}

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
            <button onClick={() => setStep(1)} className={styles.backBtn}>← Change Dates</button>
            
            <h1>Available Bikes</h1>
            <p className={styles.subtitle}>
              Found {availableBikes.length} bike{availableBikes.length === 1 ? '' : 's'} for your dates.
            </p>

            <div className={styles.bikeList}>
              {availableBikes.length === 0 ? (
                <div className={styles.noResults}>
                  <p>😔 No bikes available in {userCity} for these dates.</p>
                  <button onClick={() => setStep(1)} className={styles.retryBtn}>Try different dates</button>
                </div>
              ) : (
                availableBikes.map((bike: BikeModel) => (
                  <div key={bike.id} className={styles.bikeCard}>
                    <div className={styles.bikeInfo}>
                      <h3>{bike.name}</h3>
                      <div className={styles.specs}>
                        {/* <span className={styles.spec}>🔋 {bike.battery}%</span>
                        <span className={styles.spec}>⚡ {bike.price} PLN/d</span> */}
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

      </main>
    </div>
  );
};

export default RentBikePage;