import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  phone: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
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
      localStorage.setItem("velocity_user", JSON.stringify(action.payload));
    },
    loginFailure: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    // Action 3: Logout
    logout: (state) => {
      if (state.user) {
        localStorage.removeItem(state.user.id);
      }
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginStart, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
