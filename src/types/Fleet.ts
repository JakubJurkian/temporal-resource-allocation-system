// 1. The blueprint for bikes
export interface BikeModel {
  id: string;
  name: string;
  category: string;
  stats: {
    speed: number;
    range: number;
    capacity: number;
  };
  imageEmoji: string;
}

// 2. The Physical Bike (The real asset)
export interface BikeInstance {
  id: string; // UNIQUE: e.g., 'waw-s1-04'
  modelId: string; // Link back to blueprint
  city: string;
  status: "available" | "rented" | "maintenance";
}
