import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import {
  cancelReservation,
  getUserReservations,
} from "../../utils/bookingHelper";
import { getModels } from "../../utils/fleetStorage";
import type { Reservation } from "../../types/Reservation";
import type { BikeModel } from "../../types/Fleet";
import PageTransition from "../../components/common/PageTransition";
import styles from "./RentalsPage.module.scss";
import { downloadReservationsCSV } from "../../utils/exportHelper";
import toast from "react-hot-toast";

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const RentalsPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    return user?.id ? getUserReservations(user.id) : [];
  });
  const [models] = useState<BikeModel[]>(() => {
    return getModels();
  });

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResId, setSelectedResId] = useState<string | null>(null);

  // Helper to get friendly name
  const getBikeName = (bikeId: string) => {
    const modelCode = bikeId.split("-")[1];
    const model = models.find((m) => m.id === modelCode);
    return model ? model.name : bikeId;
  };

  // TRIGGER MODAL
  const handleCancelClick = (reservationId: string) => {
    setSelectedResId(reservationId);
    setIsModalOpen(true);
  };

  // CONFIRM ACTION
  const confirmCancel = () => {
    if (!selectedResId) return;

    const success = cancelReservation(selectedResId);

    if (success && user) {
      setReservations(getUserReservations(user.id!)); // Refresh list
      setIsModalOpen(false); // Close modal
      setSelectedResId(null);
      toast.success("Reservation cancelled successfully!");
    } else {
      // Handle error (optional: add separate error state)
      setIsModalOpen(false);
      toast.error("Failed to cancel reservation. It might be too late.");
    }
  };

  // CLOSE MODAL
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResId(null);
  };

  const isCancellable = (res: Reservation) => {
    if (res.status !== "confirmed") return false;
    const tripDate = new Date(res.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tripDate >= today;
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
    <PageTransition>
      <div className={styles.rentalsPage}>
        <header className={styles.header}>
          <h1>Ride History</h1>
          <p>Your past and upcoming journeys.</p>
          {/* EXPORT BUTTON */}
          {reservations.length > 0 && (
            <button
              className={styles.exportBtn}
              onClick={() => downloadReservationsCSV(reservations)}
            >
              📥 Export CSV
            </button>
          )}
        </header>

        <div className={styles.grid}>
          {reservations.map((res) => (
            <article
              key={res.id}
              className={`${styles.card} ${styles[res.status]}`}
            >
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

              {/* Show Cancel button only if cancellable */}
              {isCancellable(res) && (
                <div className={styles.cardFooter}>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => handleCancelClick(res.id)}
                  >
                    Cancel Reservation
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* --- CONFIRMATION MODAL --- */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>Cancel Reservation?</h2>
              <p>
                Are you sure you want to cancel this reservation?
                <br />
                This action cannot be undone.
              </p>
              <div className={styles.modalActions}>
                <button className={styles.secondaryBtn} onClick={closeModal}>
                  No, Keep it
                </button>
                <button className={styles.dangerBtn} onClick={confirmCancel}>
                  Yes, Cancel it
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default RentalsPage;
