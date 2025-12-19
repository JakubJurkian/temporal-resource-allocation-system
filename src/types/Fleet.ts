export interface BikeStats {
  speed: number;
  range: number;
  capacity: number;
}

export interface FleetBike {
  id: string; // This is the MODEL ID (e.g., 'w1' for Warsaw Sprint Courier)
  model: string;
  category: string;
  description: string;
  city: string;
  amount: number; // Total physical bikes of this model available in the fleet
  stats: BikeStats;
  imageEmoji: string;
}
