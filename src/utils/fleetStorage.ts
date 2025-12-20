import type { BikeModel, BikeInstance } from "../types/Fleet";

// HARDCODED MODELS (Catalog)
const MODELS: BikeModel[] = [
  {
    id: "s1",
    name: "Sprint Courier S1",
    category: "Agility",
    stats: { speed: 45, range: 80, capacity: 40 },
    imageEmoji: "🛵",
  },
  {
    id: "xl",
    name: "Cargo King XL",
    category: "Heavy Duty",
    stats: { speed: 25, range: 60, capacity: 100 },
    imageEmoji: "🍕",
  },
  {
    id: "ep2",
    name: "Endurance Pro 2.0",
    category: "Dual-battery system",
    stats: { speed: 35, range: 100, capacity: 60 },
    imageEmoji: "🔋",
  },
];

// CONFIG FOR GENERATION
const FLEET_CONFIG = [
  { modelId: "s1", city: "Warsaw", amount: 5 },
  { modelId: "xl", city: "Warsaw", amount: 2 },
  { modelId: "s1", city: "Gdansk", amount: 3 },
];

export const initializeFleet = () => {
  // Save Models to Storage (So it can be edited in Admin Panel)
  if (!localStorage.getItem("velocity_models")) {
    localStorage.setItem("velocity_models", JSON.stringify(MODELS));
  }

  // Generate Instances if missing
  if (!localStorage.getItem("velocity_fleet")) {
    const instances: BikeInstance[] = [];

    FLEET_CONFIG.forEach((cfg) => {
      for (let i = 1; i <= cfg.amount; i++) {
        instances.push({
          id: `${cfg.city.substring(0, 3).toLowerCase()}-${
            cfg.modelId
          }-${String(i).padStart(2, "0")}`, // id: war-s1-01
          modelId: cfg.modelId, // <--- LINK TO MODEL
          city: cfg.city,
          status: "available",
        });
      }
    });

    localStorage.setItem("velocity_fleet", JSON.stringify(instances));
  }
};

// GETTERS

export const getModels = (): BikeModel[] => {
  const data = localStorage.getItem("velocity_models");
  return data ? JSON.parse(data) : MODELS;
};

export const getFleet = (): BikeInstance[] => {
  const data = localStorage.getItem("velocity_fleet");
  return data ? JSON.parse(data) : [];
};
