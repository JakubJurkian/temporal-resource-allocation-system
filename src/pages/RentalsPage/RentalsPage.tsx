import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { cancelReservation, getUserReservations } from "../../utils/bookingHelper";
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handleCancel = (reservationId: string) => {
    // confirm action
    if (!window.confirm("Are you sure you want to cancel this reservation?"))
      return;

    const success = cancelReservation(reservationId);

    if (success && user) {
      // Refresh the list immediately to show the "Cancelled" status
      setReservations(getUserReservations(user.id!));
    } else {
      alert("Could not cancel reservation. It might be in the past.");
    }
  };

  // LOGIC: When to show the button?
  const isCancellable = (res: Reservation) => {
    if (res.status !== "confirmed") return false; // Can't cancel if already cancelled

    const tripDate = new Date(res.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time, compare dates only

    return tripDate >= today; // Allow cancelling up until the day of
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
            {isCancellable(res) && (
              <div className={styles.cardFooter}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => handleCancel(res.id)}
                >
                  Cancel Reservation
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
