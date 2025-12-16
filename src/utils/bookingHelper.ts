export interface Reservation {
  id: string;
  bikeId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: "confirmed" | "cancelled";
}

// collisino detection algo for bike reservations
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
