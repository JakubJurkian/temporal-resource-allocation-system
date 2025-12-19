export interface Reservation {
  id: string;
  bikeId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: "confirmed" | "cancelled";
}
