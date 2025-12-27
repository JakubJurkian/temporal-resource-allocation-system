import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { getUserReservations } from "../../utils/bookingHelper";
import { getModels } from "../../utils/fleetStorage";
import type { Reservation } from "../../types/Reservation";
import styles from "./RentalsPage.module.scss";
import type { BikeModel } from "../../types/Fleet";

// Helper to format dates cleanly
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const HistoryPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [models, setModels] = useState<BikeModel[]>([]);

  useEffect(() => {
    if (user?.id) {
      setReservations(getUserReservations(user.id));
      setModels(getModels());
    }
  }, [user]);

  // Helper to get friendly name from ID "war-xl-01" -> "Cargo King XL"
  const getBikeName = (bikeId: string) => {
    // Extract middle part: "war-xl-01" -> "xl"
    const modelCode = bikeId.split("-")[1];
    const model = models.find((m) => m.id === modelCode);
    return model ? model.name : bikeId;
  };

  if (!reservations.length) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.icon}>📜</div>
        <h2>No history yet</h2>
        <p>You haven't made any reservations.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Ride History</h1>
        <p>Your past and upcoming journeys.</p>
      </header>

      <div className={styles.grid}>
        {reservations.map((res) => (
          <article
            key={res.id}
            className={`${styles.card} ${styles[res.status]}`}
          >
            {/* Status Badge */}
            <div className={styles.statusBadge}>
              {res.status === "confirmed" && "✅ Confirmed"}
              {res.status === "cancelled" && "❌ Cancelled"}
              {res.status === "completed" && "🏁 Completed"}
            </div>

            <div className={styles.cardContent}>
              <div className={styles.row}>
                <span className={styles.label}>Bike</span>
                <span className={styles.valueHighlight}>
                  {getBikeName(res.bikeId)}
                </span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>Dates</span>
                <span className={styles.value}>
                  {formatDate(res.startDate)} - {formatDate(res.endDate)}
                </span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>Reservation ID</span>
                <span className={styles.mono}>{res.id}</span>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.totalRow}>
                <span>Total Paid</span>
                <span className={styles.price}>{res.totalCost} PLN</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
