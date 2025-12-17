export interface BikeStats {
  speed: number;
  range: number;
  capacity: number;
}

export interface FleetBike {
  id: string;        // This is the MODEL ID (e.g., 'w1' for Warsaw Sprint Courier)
  model: string;
  category: string;
  description: string;
  city: string;         
  amount: number;    // Total physical bikes of this model available in the fleet
  stats: BikeStats; 
  imageEmoji: string; 
}

const INITIAL_FLEET: FleetBike[] = [
  // WARSAW
  { id: 'w1', city: 'Warsaw', model: "Sprint Courier S1", category: "Agility", description: "Lightweight and agile.", amount: 25, stats: { speed: 45, range: 80, capacity: 40 }, imageEmoji: "🛵" },
  { id: 'w2', city: 'Warsaw', model: "Endurance Pro 2.0", category: "Long-Shift", description: "Dual-battery system.", amount: 15, stats: { speed: 35, range: 100, capacity: 60 }, imageEmoji: "🔋" },
  { id: 'w3', city: 'Warsaw', model: "Cargo King XL", category: "Heavy Duty", description: "Front insulated box.", amount: 8, stats: { speed: 25, range: 60, capacity: 100 }, imageEmoji: "🍕" },

  // GDANSK
  { id: 'g1', city: 'Gdansk', model: "Sprint Courier S1", category: "Agility", description: "Lightweight and agile.", amount: 12, stats: { speed: 45, range: 80, capacity: 40 }, imageEmoji: "🛵" },
  { id: 'g2', city: 'Gdansk', model: "Endurance Pro 2.0", category: "Long-Shift", description: "Dual-battery system.", amount: 20, stats: { speed: 35, range: 100, capacity: 60 }, imageEmoji: "🔋" },
  { id: 'g3', city: 'Gdansk', model: "Cargo King XL", category: "Heavy Duty", description: "Front insulated box.", amount: 4, stats: { speed: 25, range: 60, capacity: 100 }, imageEmoji: "🍕" },
  
  // KRAKOW
  { id: 'k1', city: 'Krakow', model: "Sprint Courier S1", category: "Agility", description: "Lightweight and agile.", amount: 18, stats: { speed: 45, range: 80, capacity: 40 }, imageEmoji: "🛵" },
  { id: 'k2', city: 'Krakow', model: "Endurance Pro 2.0", category: "Long-Shift", description: "Dual-battery system.", amount: 10, stats: { speed: 35, range: 100, capacity: 60 }, imageEmoji: "🔋" },

  // WROCLAW
  { id: 'wr1', city: 'Wroclaw', model: "Sprint Courier S1", category: "Agility", description: "Lightweight and agile.", amount: 0, stats: { speed: 45, range: 80, capacity: 40 }, imageEmoji: "🛵" },
  { id: 'wr3', city: 'Wroclaw', model: "Cargo King XL", category: "Heavy Duty", description: "Front insulated box.", amount: 6, stats: { speed: 25, range: 60, capacity: 100 }, imageEmoji: "🍕" },
];

// --- CORE FUNCTIONS ---

export const initializeFleet = () => {
  const fleet = localStorage.getItem('velocity_fleet');
  if (!fleet) {
    localStorage.setItem(
      'velocity_fleet',
      JSON.stringify(INITIAL_FLEET)
    );
    console.log("Storage initialized with Initial Fleet");
  }
};


export const getFleet = (): FleetBike[] => {
  const stored = localStorage.getItem('velocity_fleet');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('velocity_fleet', JSON.stringify(INITIAL_FLEET));
  return INITIAL_FLEET;
};