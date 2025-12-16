import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/User";

const storedSession = sessionStorage.getItem('velocity_session');
const initialUser = storedSession ? JSON.parse(storedSession) : null;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: initialUser ? true : false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action 1: Start Loading
    loginStart: (state) => {
      state.isLoading = true;
    },
    // Action 2: Login Success
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      sessionStorage.setItem('velocity_session', JSON.stringify(action.payload));
    },
    loginFailure: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    // Action 3: Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('velocity_session');
    },
  },
});

export const { loginStart, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
