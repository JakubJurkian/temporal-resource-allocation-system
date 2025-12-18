import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/User";

const storedSession = sessionStorage.getItem("velocity_session");
const initialUser = storedSession ? JSON.parse(storedSession) : null;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: initialUser ? true : false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = {
        ...action.payload,
        city: action.payload.city || "Warsaw",
      };
      state.isAuthenticated = true;
    },
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      sessionStorage.setItem(
        "velocity_session",
        JSON.stringify(action.payload)
      );
    },
    loginFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem("velocity_session");
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        sessionStorage.setItem("velocity_session", JSON.stringify(state.user));
      }
    },
  },
});

export const { loginStart, loginSuccess, logout, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
