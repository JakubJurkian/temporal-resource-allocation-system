import type { Reservation } from "../types/Reservation";

// collision detection algo for bike reservations
export const isBikeAvailable = (
  bikeId: string,
  requestedStart: string,
  requestedEnd: string
): boolean => {
  const reservations: Reservation[] = JSON.parse(
    localStorage.getItem("velocity_reservations") || "[]"
  );

  const newStart = new Date(requestedStart).getTime();
  const newEnd = new Date(requestedEnd).getTime();

  // Filter relevant reservations for this bike
  const bikeReservations = reservations.filter(
    (r) => r.bikeId === bikeId && r.status !== "cancelled"
  );

  // Check for overlap (Collision Detection)
  for (const res of bikeReservations) {
    const existingStart = new Date(res.startDate).getTime();
    const existingEnd = new Date(res.endDate).getTime();

    // Logic: (StartA <= EndB) and (EndA >= StartB)
    if (newStart <= existingEnd && newEnd >= existingStart) {
      return false; // Collision detected! Bike is busy.
    }
  }

  return true; // No collision, bike is free.
};

export const addReservation = (newReservation: Reservation): boolean => {
  try {
    const stored = localStorage.getItem("velocity_reservations");
    const reservations: Reservation[] = stored ? JSON.parse(stored) : [];

    // VALIDATION: Check for overlaps (Double Booking Guard)
    // We check only the reservations for THIS specific bike
    const hasConflict = reservations.some((existing) => {
      if (existing.bikeId !== newReservation.bikeId) return false; // Different bike, no issue
      if (existing.status === "cancelled") return false; // Cancelled bookings don't count

      const newStart = new Date(newReservation.startDate).getTime();
      const newEnd = new Date(newReservation.endDate).getTime();
      const existStart = new Date(existing.startDate).getTime();
      const existEnd = new Date(existing.endDate).getTime();

      // Check if time ranges overlap
      return newStart <= existEnd && newEnd >= existStart;
    });

    if (hasConflict) {
      console.error(
        "❌ Booking Failed: This bike is already booked for these dates."
      );
      return false;
    }
    reservations.push(newReservation);
    localStorage.setItem("velocity_reservations", JSON.stringify(reservations));

    console.log("Reservation Saved:", newReservation.id);

    return true;
  } catch (error) {
    console.error("Failed to save reservation:", error);
    return false;
  }
};

export const generateReservationId = (): string => {
  const prefix = "VELO";
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomPart}`;
};

export const getUserReservations = (userId: string): Reservation[] => {
  try {
    const data = localStorage.getItem("velocity_reservations");
    if (!data) return [];

    let allReservations: Reservation[] = JSON.parse(data);
    let hasUpdates = false; // Track if we modified anything

    const today = new Date();
    // Reset time to midnight to avoid hour-based confusion
    today.setHours(0, 0, 0, 0);

    // AUTOMATIC STATUS UPDATE
    // We map through reservations to check for "expired" ones
    allReservations = allReservations.map((res) => {
      const endDate = new Date(res.endDate);

      // If it is 'confirmed' but the end date is in the past...
      if (res.status === "confirmed" && endDate < today) {
        hasUpdates = true;
        return { ...res, status: "completed" }; // ...mark it as completed.
      }
      return res;
    });

    // Persist changes back to storage (Self-Cleaning Data)
    if (hasUpdates) {
      localStorage.setItem(
        "velocity_reservations",
        JSON.stringify(allReservations)
      );
    }

    // Return the clean, sorted list to the UI
    return allReservations
      .filter((r) => r.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
  } catch (e) {
    console.error("Error parsing reservations", e);
    return [];
  }
};

export const cancelReservation = (reservationId: string): boolean => {
  try {
    const data = localStorage.getItem("velocity_reservations");
    if (!data) return false;

    const reservations: Reservation[] = JSON.parse(data);
    const index = reservations.findIndex((r) => r.id === reservationId);

    if (index === -1) return false;

    // BUSINESS LOGIC: Prevent cancelling past rides
    const tripStart = new Date(reservations[index].startDate);
    const today = new Date();
    // Reset time to midnight for fair comparison
    today.setHours(0, 0, 0, 0);

    if (tripStart < today) {
      console.error("Cannot cancel past reservations");
      return false;
    }

    // Update status
    reservations[index].status = "cancelled";

    // Save back to storage
    localStorage.setItem("velocity_reservations", JSON.stringify(reservations));
    return true;
  } catch (e) {
    console.error("Failed to cancel", e);
    return false;
  }
};
