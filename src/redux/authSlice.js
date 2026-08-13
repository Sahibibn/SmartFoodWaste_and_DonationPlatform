import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  login as loginAPI,
  logout as logoutAPI,
  getCurrentUser,
} from "../api/api";

// =====================================================
// LOGIN
// =====================================================

export const login = createAsyncThunk(
  "auth/login",

  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginAPI(credentials);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  }
);

// =====================================================
// GET CURRENT USER
// =====================================================

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",

  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "User is not authenticated"
      );
    }
  }
);

// =====================================================
// LOGOUT
// =====================================================

export const logout = createAsyncThunk(
  "auth/logout",

  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutAPI();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Logout failed"
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  user: null,

  isAuthenticated: false,

  loading: false,

  initialized: false,

  error: null,
};

// =====================================================
// AUTH SLICE
// =====================================================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================================
      // LOGIN
      // ==========================================

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;

        state.isAuthenticated = true;

        state.user = action.payload.user;

        state.error = null;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;

        state.isAuthenticated = false;

        state.user = null;

        state.error = action.payload;
      })

      // ==========================================
      // CURRENT USER
      // ==========================================

      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;

        state.isAuthenticated = true;

        state.user = action.payload.user;

        state.error = null;
      })

      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.initialized = true;

        state.isAuthenticated = false;

        state.user = null;
      })

      // ==========================================
      // LOGOUT
      // ==========================================

      .addCase(logout.pending, (state) => {
        state.loading = true;
      })

      .addCase(logout.fulfilled, (state) => {
        state.loading = false;

        state.initialized = true;

        state.isAuthenticated = false;

        state.user = null;

        state.error = null;
      })

      .addCase(logout.rejected, (state) => {
        state.loading = false;

        // Clear frontend auth even if
        // server logout fails.
        state.isAuthenticated = false;

        state.user = null;

        state.error = null;
      });
  },
});

export const { clearAuthError } =
  authSlice.actions;

export default authSlice.reducer;