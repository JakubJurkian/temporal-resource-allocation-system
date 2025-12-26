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
