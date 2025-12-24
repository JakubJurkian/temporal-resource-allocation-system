import type { BikeModel } from "../../../types/Fleet";
import styles from "../RentBikePage.module.scss";

interface Props {
  availableBikes: BikeModel[];
  city: "Warsaw" | "Gdansk" | "Poznan" | "Wroclaw";
  setStep: (s: 1 | 2 | 3 | 4 | 5) => void;
  onClick: (e: string) => void;
}

export default function StepBikeSelection({
  availableBikes,
  city,
  setStep,
  onClick,
}: Props) {
  return (
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
            <p>😔 No bikes available in {city} for these dates.</p>
            <button onClick={() => setStep(1)} className={styles.retryBtn}>
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
                onClick={() => onClick(bike.id)}
              >
                Book
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
