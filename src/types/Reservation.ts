export interface Reservation {
  id: string;
  bikeId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: "confirmed" | "cancelled" | "completed";
}
