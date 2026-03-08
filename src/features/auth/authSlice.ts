import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, SetCredentialsPayload } from "@/types/auth";

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },

    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.isHydrated = action.payload;
    },
  },
});

export const { setCredentials, clearAuth, setHydrated } = authSlice.actions;
export default authSlice.reducer;
