import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  username: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ username: string; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.username = action.payload.username;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("username", action.payload.username);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.username = null;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    },
    checkAuth: (state) => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      if (token && username) {
        state.isAuthenticated = true;
        state.token = token;
        state.username = username;
      }
    },
  },
});

export const { login, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
