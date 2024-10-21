import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  success: false,
  otpSent: false,
  otpVerified: false,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`, // Use the dynamic API base URL
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // This is equivalent to 'credentials: include' in fetch
        }
      );
      console.log(response.data);
      return response.data; // Assuming your API response structure includes user data and a token
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to login'
      );
    }
  }
);
// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ firstname, lastname, email, password }, { rejectWithValue }) => {
    console.log(firstname, lastname, email, password);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`, // Using the dynamic API base URL
        { firstname, lastname, email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // This is equivalent to 'credentials: include' in fetch
        }
      );

      return response.data; // Assuming the API response includes user data and a token
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to register'
      );
    }
  }
);

// Async thunk for OTP verification
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/otpverify`,
        { otp },
        { withCredentials: true }
      );

      return response.data; // Assuming your API response structure includes success message
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to verify OTP'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.otpSent = false;
      state.otpVerified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error logging in';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error registering user';
        state.success = false;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpVerified = false;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error verifying OTP';
        state.otpVerified = false;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
