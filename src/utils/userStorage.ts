import type { User } from "../types/User";

const MOCK_ADMIN: User = {
  id: "admin_1",
  fullName: "Admin User",
  email: "admin@test.com",
  password: "123456",
  role: "admin",
  phone: "+48 000 000 000",
  city: "Warsaw",
  status: "active",
  joinedDate: "2025-01-15"
};

const MOCK_CLIENT: User = {
  id: "client_1",
  fullName: "Client User",
  email: "client@test.com",
  password: "123456",
  role: "client",
  phone: "+48 111 111 111",
  city: "Gdansk",
  status: "active",
  joinedDate: "2025-04-10"
};

export const initializeUsers = () => {
  const users = localStorage.getItem("velocity_users");
  if (!users) {
    localStorage.setItem(
      "velocity_users",
      JSON.stringify([MOCK_ADMIN, MOCK_CLIENT])
    );
    console.log("Storage initialized with Mock Users");
  }
};

export const addUserToStorage = (user: User) => {
  const currentData = localStorage.getItem("velocity_users");
  const users = currentData ? JSON.parse(currentData) : [];
  users.push(user);
  localStorage.setItem("velocity_users", JSON.stringify(users));
}

export const getUsersFromStorage = (): User[] => {
  const currentData = localStorage.getItem("velocity_users");
  return currentData ? JSON.parse(currentData) : [];
};
