import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/User";

// We need to check LocalStorage (Remember Me) first, then SessionStorage.
const getStoredUser = (): User | null => {
  try {
    const localUser = localStorage.getItem("velocity_user");
    if (localUser) return JSON.parse(localUser);

    const sessionUser = sessionStorage.getItem("velocity_user");
    if (sessionUser) return JSON.parse(sessionUser);

    return null;
  } catch (error) {
    console.error("Failed to parse user from storage", error);
    return null;
  }
};

const initialUser = getStoredUser();

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },

    // We clear BOTH to ensure the user is definitely logged out
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("velocity_user");
      sessionStorage.removeItem("velocity_user");
    },

    // If we update the user (e.g. change name), we must update the storage
    // so it doesn't revert when they refresh the page.
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };

        const updatedUserJSON = JSON.stringify(state.user);

        if (localStorage.getItem("velocity_user")) {
          localStorage.setItem("velocity_user", updatedUserJSON);
        } else {
          sessionStorage.setItem("velocity_user", updatedUserJSON);
        }
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
