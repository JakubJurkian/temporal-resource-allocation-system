export interface User {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: "client" | "admin";
  status: "active" | "blocked";
  joinedDate: string;
  city: "Warsaw" | "Gdansk" | "Poznan" | "Wroclaw";
}
